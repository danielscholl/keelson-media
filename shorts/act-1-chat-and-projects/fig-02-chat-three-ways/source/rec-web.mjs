// Usage: node rec-web.mjs <outDir> <take: ask|reload>
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
const [OUT, TAKE] = process.argv.slice(2);
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT + "/frames", { recursive: true });
const CURSOR = readFileSync(new URL("../../../../tools/cursor.js", import.meta.url), "utf8");
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
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
const glide = async (loc, ms = 700) => { const bb = await loc.boundingBox(); const x = bb.x + bb.width/2, y = bb.y + bb.height/2; await p.mouse.move(x, y, { steps: Math.round(ms/16) }); };
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
mark("start");
await p.waitForTimeout(1500);
const conv = p.getByText(/Codename for our harbor/).first();
await glide(conv, 900); await p.waitForTimeout(200); mark("open"); await conv.click();
await p.waitForTimeout(1800); mark("shown");
if (TAKE === "ask") {
  const box = p.getByPlaceholder(/Type a message/);
  await glide(box, 800); await box.click(); await p.waitForTimeout(200); mark("type");
  await box.pressSequentially("Why that name?", { delay: 90 });
  await p.waitForTimeout(400); mark("send"); await p.keyboard.press("Enter");
  // the answer is the third message bubble; wait for streaming to settle
  let last = "", stable = 0;
  for (let i = 0; i < 120 && stable < 6; i++) { await p.waitForTimeout(250); const t = await p.locator("body").innerText().catch(() => ""); if (t === last && t.includes("Why that name?") && t.length > 0) stable++; else stable = 0; last = t; }
  mark("answered");
  await p.waitForTimeout(3000);
} else {
  await p.mouse.move(1100, 520, { steps: 40 }); await p.waitForTimeout(300); mark("scroll");
  for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 60); await p.waitForTimeout(40); }
  await p.waitForTimeout(4500);
}
mark("end");
await cdp.send("Page.stopScreencast");
await p.waitForTimeout(300);
writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
await p.screenshot({ path: `${OUT}/last.png` });
console.log("frames", frames.length, JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(2)]))));
await b.close();
