import { createRequire } from "node:module";
const { chromium } = createRequire(new URL("../../../tools/", import.meta.url))("playwright");
const OUT = new URL("../raw/scout3/", import.meta.url).pathname;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7980/", { waitUntil: "networkidle" });
await p.getByText("ADME", { exact: true }).first().click();
await p.waitForTimeout(2500);
const heads = await p.locator("button[aria-label='Explore in chat']").evaluateAll((els) => els.map((e) => {
  let n = e; for (let i = 0; i < 8 && n; i++) { n = n.parentElement; const h = n?.querySelector("h2,h3,[class*=title]"); if (h) return h.textContent.trim().slice(0, 60); } return "?"; }));
console.log(heads);
const orgs = p.getByText(/^Organizations$/i).first();
await orgs.scrollIntoViewIfNeeded().catch(() => {});
await p.waitForTimeout(800);
await p.screenshot({ path: `${OUT}02-orgs.png` });
await b.close();
