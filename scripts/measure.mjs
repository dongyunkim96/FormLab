import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.addInitScript(() => {
  window.__metrics = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__metrics.lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries())
      if (!e.hadRecentInput) window.__metrics.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
});
await page.goto("http://127.0.0.1:4174", { waitUntil: "networkidle" });
await page.getByRole("heading", { level: 1 }).waitFor();
await page.waitForTimeout(1000);
const metrics = await page.evaluate(() => ({
  ...window.__metrics,
  navigation: performance.getEntriesByType("navigation")[0].toJSON(),
  resources: performance.getEntriesByType("resource").map((e) => ({
    name: e.name,
    duration: e.duration,
    bytes: e.transferSize,
  })),
}));
fs.writeFileSync(
  "docs/performance-lab.json",
  JSON.stringify(
    {
      environment:
        "Windows, headless Chromium, 1440x1000, local production preview, no CPU/network throttling; one lab run, no field INP measurement",
      ...metrics,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify({ LCP: metrics.lcp, CLS: metrics.cls }));
await page.screenshot({ path: "docs/home-desktop.png", fullPage: false });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "docs/home-mobile.png", fullPage: true });
await browser.close();
