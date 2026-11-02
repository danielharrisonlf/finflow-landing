import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const url = process.env.VERIFY_URL || 'https://finflow-landing-umber.vercel.app/'
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const response = await page.goto(url)
  assert.equal(response.status(), 200)
  assert.equal(new URL(page.url()).hostname, new URL(url).hostname, 'Must be publicly accessible without authentication')
  assert.match(await page.locator('h1').innerText(), /O controle financeiro/)
  const dashboard = page.locator('#demonstracao')
  await dashboard.getByRole('button', { name: 'Simular uma despesa' }).click()
  assert.match(await dashboard.innerText(), /24.562,00/)
  await dashboard.getByRole('button', { name: 'Desfazer despesa' }).click()
  await page.getByRole('button', { name: 'Executar', exact: true }).click()
  assert.match(await page.locator('.terminal-output').innerText(), /Compra registrada/)
  await page.locator('#goal-months').selectOption('3')
  assert.match(await page.locator('.calculator-result').innerText(), /8.000,00/)
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}`)
  }
  for (const asset of ['/social.png', '/favicon.svg', '/robots.txt', '/sitemap.xml']) {
    const assetResponse = await page.request.get(new URL(asset, url).href)
    assert.equal(assetResponse.status(), 200, asset)
  }
  await page.setViewportSize({ width: 375, height: 812 })
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await page.locator('#mobile-nav').getByRole('link', { name: 'FAQ', exact: true }).click()
  await page.locator('.faq-item summary').filter({ hasText: 'Esta página já está conectada às minhas finanças?' }).click()
  assert.equal(await page.locator('.faq-item[open]').count(), 1)
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await mkdir('test-results', { recursive: true })
  await page.screenshot({ path: 'test-results/production-mobile.png', animations: 'disabled' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: 'test-results/production-desktop.png', animations: 'disabled' })
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ url, status: 'passed', viewports: [375, 768, 1024, 1440], verified: ['anonymous-access', 'dashboard-expense', 'CLI', 'calculator', 'mobile-menu', 'FAQ', 'static-assets', 'no-page-errors'] }))
} finally {
  await browser.close()
}
