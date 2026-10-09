// Usage: node rec.mjs <outDir> <ask|review>
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
const [OUT, MODE] = process.argv.slice(2);
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT + "/frames", { recursive: true });
const CURSOR = readFileSync(new URL("../../../../tools/cursor.js", import.meta.url), "utf8");
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
await ctx.addInitScript(`try { localStorage.setItem("keelson.activeProjectId", "8e66d971-4b5a-4388-a0de-add37aa311a2"); } catch {}`);
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
if (MODE === "tab") {
  const tab = p.getByText("Beads", { exact: true }).first();
  await glide(tab, 900); await p.waitForTimeout(300); mark("tab"); await tab.click();
  await p.waitForTimeout(2500);
  const tr = p.getByRole("button", { name: "cosmos-factory" }).first();
  await glide(tr, 800); await p.waitForTimeout(200); mark("tracker"); await tr.click();
  await p.waitForTimeout(5000);
  await p.mouse.move(900, 600, { steps: 20 });
  for (let k = 0; k < 14; k++) { await p.mouse.wheel(0, 45); await p.waitForTimeout(35); }
  mark("scroll"); await p.waitForTimeout(3500);
} else {
  const box = p.getByPlaceholder(/Type a message/);
  await glide(box, 800); await box.click(); mark("type");
  await box.pressSequentially("What can start now in cosmos-factory, and what does it unlock?", { delay: 65 });
  await p.waitForTimeout(400); mark("send"); await p.keyboard.press("Enter");
  await p.waitForTimeout(2000);
  await p.getByRole("button", { name: /Stop/ }).waitFor({ state: "detached", timeout: 120000 }).catch(() => {});
  mark("answered");
  const tc = p.getByText(/TOOL CALLS/i).last();
  if (await tc.count()) { await glide(tc, 700); await tc.click().catch(() => {}); }
  await p.waitForTimeout(3500);
}
mark("end");
await cdp.send("Page.stopScreencast");
writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
await p.screenshot({ path: `${OUT}/last.png` });
console.log("frames", frames.length, JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(2)]))));
await b.close().catch(() => {}); process.exit(0);
