// Usage: node peek.mjs <out.png> [tab] — screenshots the demo stage (optionally a tab) and dumps the launcher's ids.
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";
const [OUT, TAB = "Swarms"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7979/", { waitUntil: "networkidle" });
await p.getByText(TAB, { exact: true }).first().click(); await p.waitForTimeout(3000);
await p.screenshot({ path: OUT });
for (const f of p.frames()) { const ids = await f.evaluate(() => [...document.querySelectorAll("[id]")].map(e => e.tagName.toLowerCase() + "#" + e.id + (e.type ? ":" + e.type : "") + (e.value && e.type==="radio" ? "=" + e.value : ""))).catch(() => []); if (ids.length) console.log(f.url(), ids.join(" ")); }
await b.close();
