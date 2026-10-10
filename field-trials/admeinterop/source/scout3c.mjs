// Dry run of "Ask about it": Organizations ✦ → seeded chat → partner update prompt → watch for the page.
import { createRequire } from "node:module";
const { chromium } = createRequire(new URL("../../../tools/", import.meta.url))("playwright");
const OUT = new URL("../raw/scout3/", import.meta.url).pathname;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7980/", { waitUntil: "networkidle" });
await p.getByText("ADME", { exact: true }).first().click();
await p.waitForTimeout(2500);
const panel = p.locator("button[aria-label='Explore in chat']").nth(3);
await panel.scrollIntoViewIfNeeded();
await panel.click();
await p.waitForTimeout(2500);
await p.screenshot({ path: `${OUT}10-seeded.png` });
const t0 = Date.now();
const idle = async () => { for (let i = 0; i < 90; i++) { if (!(await p.getByRole("button", { name: /^Stop/ }).count())) return; await p.waitForTimeout(2000); } };
await p.waitForTimeout(2000);
await idle();
await p.screenshot({ path: `${OUT}11-kickoff.png` });
const box = p.locator("textarea").first();
await box.fill(process.env.ASK ?? "Draft this week's partner update from this panel as a page.");
await p.screenshot({ path: `${OUT}12-typed.png` });
await box.press("Enter");
const t1 = Date.now();
for (let i = 0; i < 30; i++) {
  await p.waitForTimeout(5000);
  await p.screenshot({ path: `${OUT}13-reply-${String(i).padStart(2, "0")}.png` });
  const busy = await p.getByRole("button", { name: /^Stop/ }).count();
  console.log(`t+${((Date.now() - t1) / 1000).toFixed(0)}s busy=${busy}`);
  if (!busy && i > 1) break;
}
await p.screenshot({ path: `${OUT}14-done.png`, fullPage: false });
console.log("kickoff", ((t1 - t0) / 1000).toFixed(0), "s; reply", ((Date.now() - t1) / 1000).toFixed(0), "s");
await b.close();
