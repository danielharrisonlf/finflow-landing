import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

await mkdir('test-results', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
await page.goto(process.env.CAPTURE_URL || 'http://127.0.0.1:4173')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1200)
await page.screenshot({ path: 'test-results/design-desktop.png' })
if (!process.env.CAPTURE_URL) {
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.screenshot({ path: 'public/social.png', animations: 'disabled' })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 1000 })
}
await page.locator('#interfaces').scrollIntoViewIfNeeded()
await page.waitForTimeout(1000)
await page.screenshot({ path: 'test-results/design-interfaces.png' })
await page.setViewportSize({ width: 375, height: 812 })
await page.goto(process.env.CAPTURE_URL || 'http://127.0.0.1:4173')
await page.waitForTimeout(1200)
await page.evaluate(async () => {
  document.documentElement.style.scrollBehavior = 'auto'
  for (let top = 0; top < document.documentElement.scrollHeight; top += 500) {
    window.scrollTo({ top, behavior: 'instant' })
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  window.scrollTo({ top: 0, behavior: 'instant' })
})
await page.waitForTimeout(1000)
await page.screenshot({ path: 'test-results/design-mobile.png', fullPage: true })
await browser.close()
