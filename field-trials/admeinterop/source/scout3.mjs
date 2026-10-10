// Scout for "Ask about it": which ADME regions carry the explore button, and what the seed looks like.
import { createRequire } from "node:module";
const { chromium } = createRequire(new URL("../../../tools/", import.meta.url))("playwright");
const OUT = new URL("../raw/scout3/", import.meta.url).pathname;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7980/", { waitUntil: "networkidle" });
await p.getByText("ADME", { exact: true }).first().click();
await p.waitForTimeout(2500);
await p.getByRole("button", { name: /^Access/ }).first().click();
await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}01-access.png` });
const ex = await p.locator("button").evaluateAll((els) =>
  els.filter((e) => /✦|explore/i.test(e.textContent + " " + (e.getAttribute("aria-label") || "") + " " + (e.title || "")))
    .map((e) => { const r = e.getBoundingClientRect(); return { t: e.textContent.trim(), a: e.getAttribute("aria-label"), title: e.title, x: Math.round(r.x), y: Math.round(r.y) }; }));
console.log(JSON.stringify(ex, null, 1));
await b.close();
