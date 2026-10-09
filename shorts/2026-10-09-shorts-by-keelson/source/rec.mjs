// Usage: node rec.mjs <outDir>   (start after the tape launches cut-a-short)
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
const [OUT] = process.argv.slice(2);
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT + "/frames", { recursive: true });
const CURSOR = readFileSync(new URL("../../../tools/cursor.js", import.meta.url), "utf8");
const API = "http://127.0.0.1:7979/api/workflows";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
await ctx.addInitScript(`try { localStorage.setItem("keelson.activeProjectId", "16a4801e-dacf-472c-b304-7111f03f2900"); } catch {}`);
await ctx.addInitScript("if (window.top === window) {" + CURSOR + "}");
const p = await ctx.newPage();
let runId;
for (;;) { const r = (await (await fetch(`${API}/runs?limit=1`)).json()).runs[0];
  if (r.workflowName === "cut-a-short" && r.status === "running") { runId = r.runId; break; }
  await new Promise(s => setTimeout(s, 500)); }
await p.goto("http://127.0.0.1:7979/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: /^Workflows/ }).first().click();
await p.getByRole("radio", { name: "Runs" }).click();
await p.mouse.move(800, 500);
await p.getByText("cut-a-short", { exact: true }).first().waitFor({ timeout: 60000 });
await p.waitForTimeout(400);
const frames = []; const marks = {};
const cdp = await ctx.newCDPSession(p);
cdp.on("Page.screencastFrame", async f => { const i = frames.length; frames.push(f.metadata.timestamp);
  writeFileSync(`${OUT}/frames/${String(i).padStart(5,"0")}.jpg`, Buffer.from(f.data, "base64"));
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
const mark = k => { if (!marks[k]) marks[k] = Date.now() / 1000; };
const glide = async (loc, ms = 700) => { const bb = await loc.boundingBox(); await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height/2, { steps: Math.round(ms/16) }); };
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
mark("start");
await p.waitForTimeout(800);
const row = p.getByText("cut-a-short", { exact: true }).first();
await glide(row, 800); await p.waitForTimeout(200); mark("open"); await row.click();
await p.mouse.move(1450, 700, { steps: 30 });
const ap = p.locator(".approval-dock button.btn.primary").first();
for (;;) {
  const run = (await (await fetch(`${API}/runs/${runId}`)).json()).run;
  for (const n of run.nodes ?? []) if (n.status === "succeeded") mark(`${n.id ?? n.nodeId}-done`);
  for (const n of run.nodes ?? []) if (n.status === "running") mark(`${n.id ?? n.nodeId}-run`);
  if (await ap.isVisible().catch(() => false)) break;
  if (run.status === "failed") { console.log("run failed"); break; }
  await p.waitForTimeout(500);
}
mark("paused");
await p.waitForTimeout(3500);
const canvas = p.locator(".markdown-content img").first();
if (await canvas.isVisible().catch(() => false)) { await glide(canvas, 900); }
await p.waitForTimeout(2500);
mark("scroll");
await p.mouse.wheel(0, 500); await p.waitForTimeout(2500);
await p.mouse.wheel(0, 600); await p.waitForTimeout(2500);
await p.mouse.wheel(0, -1100); await p.waitForTimeout(1500);
await p.screenshot({ path: `${OUT}/review.png` });
await glide(ap, 900); await p.waitForTimeout(300); mark("approve"); await ap.click();
for (;;) { const run = (await (await fetch(`${API}/runs/${runId}`)).json()).run;
  if (run.status !== "running" && run.status !== "paused") break; await p.waitForTimeout(300); }
mark("staged");
await p.waitForTimeout(4000); mark("end");
await cdp.send("Page.stopScreencast");
writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
await p.screenshot({ path: `${OUT}/last.png` });
console.log("frames", frames.length, JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(2)]))));
await b.close().catch(() => {}); process.exit(0);
