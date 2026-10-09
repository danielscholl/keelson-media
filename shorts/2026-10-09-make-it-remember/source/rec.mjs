// Usage: node rec.mjs <outDir> <ask|review>
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
const [OUT, MODE] = process.argv.slice(2);
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT + "/frames", { recursive: true });
const CURSOR = readFileSync(new URL("../../../tools/cursor.js", import.meta.url), "utf8");
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
await ctx.addInitScript(`try { localStorage.setItem("keelson.activeProjectId", "771a230a-c882-4c66-845b-70e55c54eee3"); } catch {}`);
await ctx.addInitScript(CURSOR);
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7979/", { waitUntil: "networkidle" });
await p.mouse.move(900, 500);
await p.waitForTimeout(800);
const frames = []; const marks = {};
const cdp = await ctx.newCDPSession(p);
cdp.on("Page.screencastFrame", async f => { const i = frames.length; frames.push(f.metadata.timestamp);
  writeFileSync(`${OUT}/frames/${String(i).padStart(5,"0")}.jpg`, Buffer.from(f.data, "base64"));
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
const mark = k => { marks[k] = Date.now() / 1000; };
const glide = async (loc, ms = 700) => { const bb = await loc.boundingBox(); await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height/2, { steps: Math.round(ms/16) }); };
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
mark("start");
await p.waitForTimeout(1000);
if (MODE === "ask") {
  const box = p.getByPlaceholder(/Type a message/);
  await glide(box, 800); await box.click(); mark("type");
  await box.pressSequentially("What did the last tide audit find?", { delay: 70 });
  await p.waitForTimeout(400); mark("send"); await p.keyboard.press("Enter");
  await p.waitForTimeout(2000);
  let last = "", stable = 0;
  for (let i = 0; i < 400 && stable < 10; i++) { await p.waitForTimeout(250); const t = await p.locator("body").innerText().catch(() => ""); if (t === last) stable++; else stable = 0; last = t; }
  mark("answered");
  await p.waitForTimeout(3000);
} else {
  const gear = p.locator("button.instruments-trigger");
  await glide(gear, 900); await p.waitForTimeout(200); mark("gear"); await gear.click();
  await p.waitForTimeout(600);
  const mem = p.getByRole("button", { name: /^Memory/ });
  await glide(mem, 500); await p.waitForTimeout(200); await mem.click();
  await p.waitForTimeout(900);
  const led = p.getByText("Ledger", { exact: false }).first();
  await glide(led, 600); await p.waitForTimeout(200); mark("ledger"); await led.click();
  await p.waitForTimeout(1200);
  const row = p.getByText(/Tide audit:/).first();
  await glide(row, 700); await p.waitForTimeout(200); mark("expand"); await row.click();
  await p.waitForTimeout(4500);
  const cf = p.getByRole("button", { name: /^Confirm/ }).first();
  await glide(cf, 900); await p.waitForTimeout(300); mark("confirm"); await cf.click();
  await p.waitForTimeout(3000);
}
mark("end");
await cdp.send("Page.stopScreencast");
writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
await p.screenshot({ path: `${OUT}/last.png` });
console.log("frames", frames.length, JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(2)]))));
await b.close().catch(() => {}); process.exit(0);
