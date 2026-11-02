import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const screenshotsDir = join(process.cwd(), 'test-results', 'screenshots')

async function scrollFullPage(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const step = Math.max(400, Math.floor(window.innerHeight * 0.5))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => window.setTimeout(resolve, 80))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((resolve) => window.setTimeout(resolve, 900))
  })
}

async function captureLanding(page: import('@playwright/test').Page, name: string) {
  await mkdir(screenshotsDir, { recursive: true })
  await page.screenshot({ path: join(screenshotsDir, `${name}.png`), fullPage: true, animations: 'disabled' })
}

test.describe('landing responsiva', () => {
  for (const viewport of [
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'laptop-1024', width: 1024, height: 768 },
    { name: 'desktop-1440', width: 1440, height: 900 },
  ]) {
    test(`${viewport.name}: sem overflow, erros de JavaScript ou imagens quebradas`, async ({ page }) => {
      const jsErrors: string[] = []
      page.on('pageerror', (error) => jsErrors.push(error.message))
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('O controle financeiro que pensa como um desenvolvedor. E age como o seu CFO.')
      await expect(page.locator('html')).toHaveClass(/motion-ready/)
      await scrollFullPage(page)
      await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete), null, { timeout: 8000 }).catch(() => {})
      const hiddenReveals = await page.locator('.motion-ready .reveal:not(.is-visible)').count()
      const hiddenRevealDetails = await page.locator('.motion-ready .reveal:not(.is-visible)').evaluateAll((elements) =>
        elements.map((element) => ({ className: (element as HTMLElement).className, text: (element as HTMLElement).innerText.slice(0, 80) })),
      )

      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        dimensions: {
          viewport: window.innerWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          comparison: (() => {
            const element = document.querySelector<HTMLElement>('.comparison-scroll')
            if (!element) return null
            const style = getComputedStyle(element)
            const rect = element.getBoundingClientRect()
            return { left: Math.round(rect.left), right: Math.round(rect.right), clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, overflowX: style.overflowX }
          })(),
        },
        offenders: Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .map((element) => {
            const rect = element.getBoundingClientRect()
            return {
              tag: element.tagName,
              className: typeof element.className === 'string' ? element.className : '',
              text: (element.innerText || '').slice(0, 70),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              insideComparison: Boolean(element.closest('.comparison-scroll')),
            }
          })
          .filter((element) => element.right > window.innerWidth + 1 || element.left < -1)
          .filter((element) => !element.insideComparison)
          .sort((a, b) => b.right - a.right)
          .slice(0, 20),
      }))
      const brokenImages = await page.locator('img').evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => ({ src: image.currentSrc || image.src, alt: image.alt })),
      )
      await captureLanding(page, viewport.name)
      console.log(`${viewport.name} diagnostics: ${JSON.stringify({ ...layout, hiddenReveals, hiddenRevealDetails, jsErrors, brokenImages })}`)

      expect(layout.overflow, 'document width should fit the viewport').toBe(false)
      expect(hiddenReveals, 'full-page scroll should reveal every section before capture').toBe(0)
      expect(jsErrors, 'page should not throw JavaScript errors during full-page scroll').toEqual([])
      expect(brokenImages, 'all editorial images should load after lazy-loading scroll').toEqual([])
    })
  }
})

test('dashboard tabs and period update the illustrative data on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const dashboard = page.locator('#demonstracao')
  await expect(dashboard.getByText('R$ 24.586,50')).toBeVisible()

  await dashboard.getByRole('button', { name: 'Transações' }).first().click()
  await expect(dashboard.getByRole('heading', { name: 'Cada movimento conta.' })).toBeVisible()
  await dashboard.getByRole('button', { name: 'Cartões' }).first().click()
  await expect(dashboard.getByRole('heading', { name: 'Uma visão de cada fatura.' })).toBeVisible()
  await expect(dashboard.getByText('Nubank Ultravioleta')).toBeVisible()
  await dashboard.getByRole('button', { name: 'Visão geral' }).first().click()

  await dashboard.getByLabel('Período do dashboard').selectOption('Outubro')
  await expect(dashboard.getByText('R$ 21.803,00')).toBeVisible()
  await expect(dashboard.getByText('R$ 10.800,00')).toBeVisible()
  await expect(dashboard.getByRole('img', { name: 'Gráfico ilustrativo de fluxo de caixa de Outubro' })).toBeVisible()

  await page.setViewportSize({ width: 375, height: 812 })
  await dashboard.getByRole('button', { name: 'Cartões' }).last().click()
  await expect(dashboard.getByRole('heading', { name: 'Uma visão de cada fatura.' })).toBeVisible()
  await dashboard.getByRole('button', { name: 'Transações' }).last().click()
  await expect(dashboard.getByRole('heading', { name: 'Cada movimento conta.' })).toBeVisible()
})

test('simular e desfazer despesa atualiza saldo, saídas e transação', async ({ page }) => {
  await page.goto('/')
  const dashboard = page.locator('#demonstracao')
  await expect(dashboard.getByText('R$ 24.586,50')).toBeVisible()
  await dashboard.getByRole('button', { name: 'Simular uma despesa' }).click()
  await expect(dashboard.getByText('R$ 24.562,00')).toBeVisible()
  await expect(dashboard.getByText('R$ 4.738,00')).toBeVisible()
  await expect(dashboard.getByText('Café com a equipe')).toBeVisible()
  await expect(dashboard.getByRole('status')).toContainText('Despesa de R$ 24,50 adicionada')

  await dashboard.getByRole('button', { name: 'Desfazer despesa' }).click()
  await expect(dashboard.getByText('R$ 24.586,50')).toBeVisible()
  await expect(dashboard.getByText('R$ 4.713,50')).toBeVisible()
  await expect(dashboard.getByText('Café com a equipe')).toHaveCount(0)
})

test('exportação baixa CSV com cabeçalho e valores ilustrativos atuais', async ({ page }) => {
  await page.goto('/')
  const dashboard = page.locator('#demonstracao')
  await dashboard.getByRole('button', { name: 'Simular uma despesa' }).click()

  const downloadPromise = page.waitForEvent('download')
  await dashboard.getByRole('button', { name: 'Exportar CSV' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('finflow-demonstracao.csv')
  const filePath = await download.path()
  expect(filePath).not.toBeNull()
  const csv = await readFile(filePath!, 'utf8')
  expect(csv).toContain('Descrição;Categoria;Valor')
  expect(csv).toContain('Café com a equipe;Despesa · Alimentação;-24,50')
  expect(csv).toContain('Projeto freelance;Receita · Trabalho;8500,00')
  expect(csv).toContain('Mercado da semana;Despesa · Alimentação;-286,90')
})

test('CLI executa as três respostas simuladas selecionáveis', async ({ page }) => {
  await page.goto('/')
  const terminal = page.locator('.terminal-window')
  const command = terminal.locator('.terminal-toolbar select')
  const run = terminal.getByRole('button', { name: 'Executar' })

  await run.click()
  await expect(terminal.getByRole('status')).toContainText('Compra registrada.')
  await expect(terminal.getByRole('status')).toContainText('R$ 3.500,00')
  await expect(terminal.getByText('Resposta simulada · valores ilustrativos')).toBeVisible()

  await command.selectOption('saldo')
  await run.click()
  await expect(terminal.getByRole('status')).toContainText('R$ 24.586,50')
  await command.selectOption('exportar')
  await run.click()
  await expect(terminal.getByRole('status')).toContainText('extrato.ofx')
})

test('pagamento MCP e consulta de saldo no Telegram são simulações reiniciáveis', async ({ page }) => {
  await page.goto('/')
  const mcp = page.locator('.mcp-demo')
  await expect(mcp.getByText('Quer simular o pagamento?')).toBeVisible()
  await mcp.getByRole('button', { name: 'Simular pagamento autorizado' }).click()
  await expect(mcp.getByText('pay_invoice')).toBeVisible()
  await expect(mcp.getByText(/Simulação concluída: a fatura/)).toBeVisible()
  await mcp.getByRole('button', { name: 'Reiniciar demonstração' }).click()
  await expect(mcp.getByText('list_card_invoices')).toBeVisible()

  const telegram = page.locator('.telegram-demo')
  await telegram.getByRole('button', { name: 'Experimentar /saldo' }).click()
  await expect(telegram.getByText('Seu saldo consolidado')).toBeVisible()
  await expect(telegram.getByText('Dados ilustrativos · 12:43')).toBeVisible()
  await telegram.getByRole('button', { name: 'Reiniciar conversa' }).click()
  await expect(telegram.getByText('Seu saldo consolidado')).toHaveCount(0)
})

test('calculadora atualiza sliders e prazo, arredonda centavos para cima e reconhece objetivo concluído', async ({ page }) => {
  await page.goto('/')
  const calculator = page.locator('.calculator')
  const goal = calculator.getByLabel('Quanto você quer guardar?')
  const saved = calculator.getByLabel('Quanto já tem guardado?')
  const months = calculator.getByLabel('Em quanto tempo?')
  const result = calculator.locator('.calculator-result')

  await expect(result).toContainText('R$ 2.000,00')
  await months.selectOption('18')
  await expect(result).toContainText('R$ 1.333,34')

  await goal.focus()
  await goal.press('Home')
  await saved.focus()
  await saved.press('Home')
  await months.selectOption('3')
  await expect(calculator.locator('.range-label').nth(0)).toContainText('R$ 5.000,00')
  await expect(calculator.locator('.range-label').nth(1)).toContainText('R$ 0,00')
  await expect(result).toContainText('R$ 1.666,67')

  await saved.focus()
  await saved.press('End')
  await expect(result).toContainText('Você já chegou lá.')
  await expect(result).toContainText('R$ 0,00')
  await expect(result).toContainText('100% do objetivo conquistado')
})

test('menu mobile e FAQ podem ser operados pelo teclado', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Abrir menu' })
  await menu.focus()
  await menu.press('Enter')
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Tab')
  await expect(page.locator('#mobile-nav')).toContainText('Recursos')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#recursos$/)
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible()

  const faqQuestion = page.locator('#faq summary').first()
  await faqQuestion.scrollIntoViewIfNeeded()
  await faqQuestion.focus()
  await faqQuestion.press('Enter')
  await expect(faqQuestion.locator('..')).toHaveAttribute('open', '')
  await expect(faqQuestion.locator('..').locator('p')).toBeVisible()
})

test('animações respeitam a preferência por movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const firstReveal = page.locator('.reveal').first()
  await expect(firstReveal).toBeVisible()
  const styles = await firstReveal.evaluate((element) => ({
    opacity: getComputedStyle(element).opacity,
    transform: getComputedStyle(element).transform,
    animationDuration: getComputedStyle(element).animationDuration,
    transitionDuration: getComputedStyle(element).transitionDuration,
  }))
  expect(styles).toEqual({ opacity: '1', transform: 'none', animationDuration: '0s', transitionDuration: '0s' })
})

test('axe não encontra violações críticas ou sérias, incluindo contraste', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await scrollFullPage(page)
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const criticalOrSerious = results.violations.filter((violation) =>
    violation.impact === 'critical' || violation.impact === 'serious',
  )
  console.log(`axe violations: ${JSON.stringify(results.violations.map(({ id, impact, nodes }) => ({ id, impact, count: nodes.length })))}`)
  expect(criticalOrSerious).toEqual([])
})
