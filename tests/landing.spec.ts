import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const screenshotsDir = join(process.cwd(), 'test-results', 'screenshots')
const themeButtonName = /Ativar tema (claro|escuro)/

async function clearThemeForFirstDocument(page: Page) {
  await page.addInitScript(() => {
    try {
      if (sessionStorage.getItem('__finflow-theme-test-cleaned') !== '1') {
        localStorage.removeItem('finflow-theme')
        sessionStorage.setItem('__finflow-theme-test-cleaned', '1')
      }
    } catch {
      // Storage denial is covered separately; let the application exercise its fallback.
    }
  })
}

async function setTheme(page: Page, theme: 'light' | 'dark') {
  const root = page.locator('html')
  if ((await root.getAttribute('data-theme')) !== theme) {
    await page.getByRole('button', { name: themeButtonName }).click()
  }
  await expect(root).toHaveAttribute('data-theme', theme)
  await expect(root).toHaveClass(new RegExp(`\\b${theme}\\b`))
}

async function scrollFullPage(page: Page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const step = Math.max(400, Math.floor(window.innerHeight * 0.6))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => window.setTimeout(resolve, 60))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((resolve) => window.setTimeout(resolve, 250))
  })
}

async function saveScreenshot(page: Page, name: string) {
  await mkdir(screenshotsDir, { recursive: true })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: join(screenshotsDir, `${name}.png`),
    fullPage: true,
    animations: 'disabled',
  })
}

async function audit(page: Page, state: string) {
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        .every(
          (animation) =>
            animation.playState !== 'running' || animation.effect?.getTiming().iterations === Infinity,
        ),
    null,
    { timeout: 5000 },
  )
  const stableColors = await page.evaluate(() => {
    const brand = document.querySelector<HTMLElement>('nav .ff-brand')
    const cardText = document.querySelector<HTMLElement>('#cartoes .ff-feature-copy p')
    const card = cardText?.closest<HTMLElement>('.ff-feature-card')
    return {
      brand: brand ? getComputedStyle(brand).color : null,
      cardText: cardText ? getComputedStyle(cardText).color : null,
      cardBackground: card ? getComputedStyle(card).backgroundColor : null,
    }
  })
  console.log(`stable colors ${state}: ${JSON.stringify(stableColors)}`)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  const violations = results.violations.map(({ id, impact, nodes }) => ({
    id,
    impact,
    count: nodes.length,
    examples: nodes.slice(0, 3).map((node) => ({ target: node.target, summary: node.failureSummary })),
  }))
  console.log(`axe ${state}: ${JSON.stringify(violations)}`)
  expect(violations, `axe WCAG AA violations in ${state}`).toEqual([])
}

test('required B2C copy and interactive examples match the brief', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await clearThemeForFirstDocument(page)
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'O controle total do seu dinheiro, com a simplicidade que você sempre quis.',
  )
  await expect(page.getByRole('heading', { name: 'Conecte seu agente de IA via CLI ou MCP' })).toBeVisible()

  const ai = page.locator('#assistente')
  const prompts = ai.getByRole('group', { name: 'Exemplos de conversa' })
  const promptButtons = prompts.getByRole('button')
  await expect(promptButtons).toHaveCount(3)
  for (const button of await promptButtons.all()) {
    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(ai.locator('.ff-chat-message.ff-chat-outgoing')).not.toBeEmpty()
    await expect(ai.locator('.ff-ai-answer')).not.toBeEmpty()
  }

  const cardDemo = page.locator('#cartoes')
  await expect(cardDemo.getByText('Novembro', { exact: true })).toBeVisible()
  await cardDemo.getByRole('button', { name: 'Ver o próximo mês' }).click()
  await expect(cardDemo.getByText('Dezembro', { exact: true })).toBeVisible()
  await cardDemo.getByRole('button', { name: 'Voltar à fatura atual' }).click()
  await expect(cardDemo.getByText('Novembro', { exact: true })).toBeVisible()
})

test('theme follows OS, supports an override, survives reload, and resets to system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await clearThemeForFirstDocument(page)
  await page.goto('/')
  const root = page.locator('html')

  await expect(page.getByRole('button', { name: 'Ativar tema escuro' })).toBeVisible()
  await expect(root).toHaveAttribute('data-theme', 'light')
  await expect(root).toHaveAttribute('data-theme-preference', 'system')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(root).toHaveAttribute('data-theme', 'dark')

  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect(root).toHaveAttribute('data-theme', 'light')
  await expect(root).toHaveAttribute('data-theme-preference', 'light')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('finflow-theme'))).toBe('light')
  await page.reload()
  await expect(root).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(root).toHaveAttribute('data-theme', 'light')

  await page.getByRole('button', { name: 'Usar tema do sistema' }).click()
  await expect(root).toHaveAttribute('data-theme-preference', 'system')
  await expect(root).toHaveAttribute('data-theme', 'dark')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('finflow-theme'))).toBeNull()
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(root).toHaveAttribute('data-theme', 'light')
})

test('theme updates across tabs and remains usable when storage is blocked', async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await clearThemeForFirstDocument(page)
  await page.goto('/')
  const secondTab = await context.newPage()
  await secondTab.goto('/')

  await secondTab.getByRole('button', { name: 'Ativar tema escuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'dark')

  const blockedPage = await context.newPage()
  await blockedPage.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Storage access denied', 'SecurityError')
      },
    })
  })
  const errors: string[] = []
  blockedPage.on('pageerror', (error) => errors.push(error.message))
  await blockedPage.goto('/')
  await expect(blockedPage.locator('html')).toHaveAttribute('data-theme', 'light')
  await blockedPage.getByRole('button', { name: 'Ativar tema escuro' }).click()
  await expect(blockedPage.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(errors).toEqual([])
})

test('inline theme bootstrap applies stored theme before the app module loads', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('finflow-theme', 'dark'))
  await page.route('**/assets/*.js', (route) => route.abort())
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.locator('#root')).toBeEmpty()
})

test('landing and demo fit mobile, tablet, and desktop in both themes; screenshots and assets are healthy', async ({ page }) => {
  const jsErrors: string[] = []
  page.on('pageerror', (error) => jsErrors.push(error.message))
  await page.emulateMedia({ colorScheme: 'light' })
  await clearThemeForFirstDocument(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await scrollFullPage(page)
  await page.waitForFunction(
    () => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
    null,
    { timeout: 15_000 },
  )

  for (const theme of ['light', 'dark'] as const) {
    if (theme === 'dark') await setTheme(page, 'dark')
    for (const viewport of [
      { name: 'mobile-390', width: 390, height: 844 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'desktop-1440', width: 1440, height: 900 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      const layout = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }))
      expect(layout.document, `${theme} ${viewport.name} document width`).toBeLessThanOrEqual(viewport.width)
      expect(layout.body, `${theme} ${viewport.name} body width`).toBeLessThanOrEqual(viewport.width)
      if (viewport.width === 390 || viewport.width === 1440) {
        await saveScreenshot(page, `${theme}-${viewport.name}`)
      }
    }
  }

  const brokenImages = await page.locator('img').evaluateAll((images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => ({ src: image.currentSrc || image.src, alt: image.alt })),
  )
  expect(brokenImages, 'all landing illustrations load').toEqual([])
  expect(jsErrors, 'the landing has no uncaught JavaScript errors').toEqual([])
})

test('dashboard period, expense undo, CSV export, and Telegram simulation work', async ({ page }) => {
  await page.goto('/')
  const dashboard = page.locator('#demonstracao')
  await expect(dashboard.getByText('R$ 24.586,50')).toBeVisible()
  await dashboard.getByRole('button', { name: 'Simular uma despesa' }).click()
  await expect(dashboard.getByText('R$ 24.562,00')).toBeVisible()
  await expect(dashboard.getByText('Café com a equipe')).toBeVisible()
  await dashboard.getByRole('button', { name: 'Desfazer despesa' }).click()
  await expect(dashboard.getByText('R$ 24.586,50')).toBeVisible()
  await expect(dashboard.getByText('Café com a equipe')).toHaveCount(0)

  await dashboard.getByRole('combobox', { name: 'Período do dashboard' }).selectOption('Outubro')
  await expect(dashboard.getByText('R$ 21.803,00')).toBeVisible()
  await expect(dashboard.getByRole('img', { name: 'Gráfico ilustrativo de fluxo de caixa de Outubro' })).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await dashboard.getByRole('button', { name: 'Exportar CSV' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('finflow-demonstracao.csv')
  const csvPath = await download.path()
  expect(csvPath).not.toBeNull()
  const csv = await readFile(csvPath!, 'utf8')
  expect(csv).toContain('Descrição;Categoria;Valor')
  expect(csv).toContain('Salário do mês;Receita · Trabalho;8500,00')
  expect(csv).toContain('Mercado da semana;Despesa · Alimentação;-286,90')

  const telegram = page.locator('.ff-telegram')
  await telegram.getByRole('button', { name: 'Experimentar consulta de saldo' }).click()
  await expect(telegram.getByRole('status')).toContainText('R$ 24.586,50')
  await telegram.getByRole('button', { name: 'Reiniciar conversa' }).click()
  await expect(telegram.getByRole('status')).toHaveCount(0)
})

test('goal calculator rounds cents up and handles a completed goal', async ({ page }) => {
  await page.goto('/')
  const calculator = page.locator('.ff-calculator')
  const goal = calculator.locator('#goal-value')
  const saved = calculator.locator('#saved-value')
  const months = calculator.getByLabel('Em quanto tempo?')
  const result = calculator.locator('.ff-calculator-result')

  await expect(result).toContainText('R$ 2.000,00')
  await months.selectOption('18')
  await expect(result).toContainText('R$ 1.333,34')
  await goal.focus()
  await goal.press('Home')
  await saved.focus()
  await saved.press('Home')
  await months.selectOption('3')
  await expect(result).toContainText('R$ 1.666,67')
  await saved.focus()
  await saved.press('End')
  await expect(result).toContainText('Você já chegou lá.')
  await expect(result).toContainText('R$ 0,00')
  await expect(result).toContainText('100% do seu objetivo')
})

test('mobile menu, unavailable account dialog, and FAQ are keyboard operable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const menu = page.getByRole('button', { name: 'Abrir menu' })
  await menu.focus()
  await menu.press('Enter')
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()

  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await page.getByRole('button', { name: 'Acessar minha conta' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading')).toBeVisible()
  await expect(dialog).toContainText(/acesso/i)
  await expect(dialog).toContainText(/dispon/i)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  const faq = page.locator('#duvidas details').first()
  const summary = faq.locator('summary')
  await summary.focus()
  await summary.press('Enter')
  await expect(faq).toHaveAttribute('open', '')
  await expect(faq.locator('p')).toBeVisible()
})

test('axe WCAG AA passes in light and dark themes with FAQ open and account dialog', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await clearThemeForFirstDocument(page)
  await page.goto('/')
  await page.locator('#duvidas details').first().locator('summary').click()

  for (const theme of ['light', 'dark'] as const) {
    if (theme === 'dark') await setTheme(page, 'dark')
    await audit(page, `${theme} landing, dashboard, AI, goal calculator, and expanded FAQ`)
    await page.getByRole('button', { name: 'Acessar minha conta' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await audit(page, `${theme} account availability dialog`)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  }
})
