// Usage: node rec.mjs <outDir> <chat|usage>
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
const [OUT, MODE] = process.argv.slice(2);
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT + "/frames", { recursive: true });
const CURSOR = readFileSync(new URL("../../../../tools/cursor.js", import.meta.url), "utf8");
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
await ctx.addInitScript(CURSOR);
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7979/", { waitUntil: "networkidle" });
await p.mouse.move(900, 500); await p.waitForTimeout(800);
const frames = []; const marks = {};
const cdp = await ctx.newCDPSession(p);
cdp.on("Page.screencastFrame", async f => { const i = frames.length; frames.push(f.metadata.timestamp);
  writeFileSync(`${OUT}/frames/${String(i).padStart(5,"0")}.jpg`, Buffer.from(f.data, "base64"));
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
const mark = k => { marks[k] = Date.now() / 1000; };
const glide = async (loc, ms = 700) => { const bb = await loc.boundingBox(); await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height/2, { steps: Math.round(ms/16) }); };
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
mark("start"); await p.waitForTimeout(1000);
if (MODE === "chat") {
  const chip = p.locator(".chat-model-chip").first();
  await glide(chip, 900); await p.waitForTimeout(200); mark("picker"); await chip.click(); await p.waitForTimeout(600);
  await p.locator(".model-picker-popover-search").pressSequentially("phi", { delay: 120 }); await p.waitForTimeout(900);
  const opt = p.getByText("phi4:latest").first();
  await glide(opt, 700); await p.waitForTimeout(200); mark("pick"); await opt.click(); await p.waitForTimeout(900);
  const box = p.getByPlaceholder(/Type a message/);
  await glide(box, 700); await box.click(); mark("type");
  await box.pressSequentially("Give me three short names for a harbor tide app.", { delay: 60 });
  await p.waitForTimeout(400); mark("send"); await p.keyboard.press("Enter");
  await p.waitForTimeout(1500);
  await p.getByRole("button", { name: /Stop/ }).waitFor({ state: "detached", timeout: 240000 }).catch(() => {});
  mark("answered"); await p.waitForTimeout(3000);
} else {
  await p.locator("button.instruments-trigger").click(); await p.waitForTimeout(400);
  await p.getByRole("button", { name: /^Usage/ }).click(); await p.waitForTimeout(1500);
  const led = p.getByText("Ledger", { exact: true }).first();
  await glide(led, 800); await p.waitForTimeout(200); mark("ledger"); await led.click(); await p.waitForTimeout(3000);
  const cell = p.getByText("unpriced").first();
  if (await cell.count()) { await glide(cell, 900); }
  mark("row"); await p.waitForTimeout(4000);
}
mark("end");
await cdp.send("Page.stopScreencast");
writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
await p.screenshot({ path: `${OUT}/last.png` });
console.log("frames", frames.length, JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(2)]))));
await b.close().catch(() => {}); process.exit(0);
