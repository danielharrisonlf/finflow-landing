import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("test-results/design", { recursive: true });
const url = process.env.CAPTURE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch();
try {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `test-results/design/desktop-${theme}.png`,
      animations: "disabled",
    });
    await page.locator("#assistente").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `test-results/design/assistant-${theme}.png`,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `test-results/design/mobile-${theme}.png`,
      animations: "disabled",
    });
    if (!process.env.CAPTURE_URL && theme === "light") {
      await page.setViewportSize({ width: 1200, height: 630 });
      await page.addStyleTag({
        content:
          ".finflow-landing .ff-hero{padding-top:35px;gap:35px;align-items:start}.finflow-landing .ff-hero h1{font-size:43px}.finflow-landing .ff-hero-copy>p{font-size:12px}.finflow-landing .ff-hero-note{display:none}.finflow-landing .ff-hero-actions{margin-top:23px}.finflow-landing .ff-hero-preview{transform:scale(.94);transform-origin:top right}",
      });
      await page.screenshot({
        path: "public/social.png",
        animations: "disabled",
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
