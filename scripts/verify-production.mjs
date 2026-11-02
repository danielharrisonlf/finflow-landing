import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const url =
  process.env.VERIFY_URL || "https://finflow-landing-umber.vercel.app/";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(url);
  assert.equal(response.status(), 200);
  assert.equal(new URL(page.url()).hostname, new URL(url).hostname);
  assert.match(
    await page.locator("h1").innerText(),
    /O controle total do seu dinheiro/,
  );
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  await page.getByRole("button", { name: "Ativar tema escuro" }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.getByRole("button", { name: "Usar tema do sistema" }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  const dashboard = page.locator("#demonstracao");
  await dashboard.getByRole("button", { name: "Simular uma despesa" }).click();
  assert.match(await dashboard.innerText(), /24.562,00/);
  await page
    .getByRole("button", { name: "Registrar uma despesa", exact: true })
    .click();
  assert.match(await page.locator(".ff-ai-answer").innerText(), /35,00/);
  await page.locator("#goal-months").selectOption("3");
  assert.match(
    await page.locator(".ff-calculator-result").innerText(),
    /8.000,00/,
  );
  for (const theme of ["light", "dark"]) {
    if (theme === "dark")
      await page.getByRole("button", { name: "Ativar tema escuro" }).click();
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `Overflow ${theme} ${width}`,
      );
    }
  }
  for (const asset of [
    "/social.png",
    "/favicon.svg",
    "/robots.txt",
    "/sitemap.xml",
    "/fonts/geist-latin.woff2",
  ])
    assert.equal(
      (await page.request.get(new URL(asset, url).href)).status(),
      200,
      asset,
    );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .locator("#ff-mobile-nav")
    .getByRole("link", { name: "Segurança", exact: true })
    .click();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await mkdir("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/production-mobile.png",
    animations: "disabled",
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/production-desktop.png",
    animations: "disabled",
  });
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({
      url,
      status: "passed",
      themes: ["light", "dark"],
      viewports: [390, 768, 1024, 1440],
      verified: [
        "anonymous-access",
        "theme-persistence",
        "dashboard",
        "AI-conversation",
        "goals",
        "mobile-menu",
        "static-assets",
        "no-page-errors",
      ],
    }),
  );
} finally {
  await browser.close();
}
