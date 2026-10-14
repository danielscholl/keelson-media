// Usage: node rec-run.mjs <rawDir> — records the whole Scout run in two pages at once (Keelson's Swarms tab, ClickClack),
// starting the swarm from the launcher. While it runs, drop a file <rawDir>/cmd/<name>.js holding the body of
// `async (p, f, cc, mark) => {...}` to steer the pages; it runs once, then is renamed .done. Touch <rawDir>/cmd/STOP to finish.
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync, readFileSync, readdirSync, renameSync, existsSync, rmSync } from "node:fs";
const [OUT] = process.argv.slice(2);
const CURSOR = readFileSync(new URL("../../../../tools/cursor.js", import.meta.url), "utf8");
const TASK = readFileSync(new URL("./task.txt", import.meta.url), "utf8").trim();
for (const d of ["kf", "cf", "cmd", "shots"]) { rmSync(`${OUT}/${d}`, { recursive: true, force: true }); mkdirSync(`${OUT}/${d}`, { recursive: true }); }
const b = await chromium.launch({ channel: "chrome" });
const mk = async () => { const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" }); await ctx.addInitScript(CURSOR); return [ctx, await ctx.newPage()]; };
const [kctx, p] = await mk(); const [cctx, cc] = await mk();
const marks = {}; const mark = k => { marks[k] = Date.now() / 1000; console.log("mark", k); save(); };
const kfr = [], cfr = [];
const save = () => writeFileSync(`${OUT}/meta.json`, JSON.stringify({ marks, kframes: kfr, cframes: cfr }, null, 1));
const cast = async (ctx, page, dir, arr) => { const cdp = await ctx.newCDPSession(page);
  cdp.on("Page.screencastFrame", async fr => { const i = arr.length; arr.push(fr.metadata.timestamp);
    writeFileSync(`${OUT}/${dir}/${String(i).padStart(6, "0")}.jpg`, Buffer.from(fr.data, "base64"));
    await cdp.send("Page.screencastFrameAck", { sessionId: fr.sessionId }).catch(() => {}); });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 }); return cdp; };
await p.goto("http://127.0.0.1:7979/", { waitUntil: "networkidle" });
await p.getByText("Swarms", { exact: true }).first().click(); await p.waitForTimeout(2500);
const f = p.frames()[1];
await f.evaluate(() => { if (window.__cur) window.__cur.remove(); }).catch(() => {});
await cc.goto("http://127.0.0.1:18080/app", { waitUntil: "networkidle" }); await cc.waitForTimeout(1000);
await p.mouse.move(900, 300);
const kcdp = await cast(kctx, p, "kf", kfr); const ccdp = await cast(cctx, cc, "cf", cfr);
const glide = async (page, loc, ms = 700) => { const bb = await loc.boundingBox(); await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: Math.round(ms / 16) }); };
mark("start"); await p.waitForTimeout(1200);
const ta = f.locator("#launch-task"); await glide(p, ta, 800); await ta.click(); mark("type");
await p.keyboard.type(TASK, { delay: 16 }); mark("typed"); await p.waitForTimeout(1500);
const sc = f.locator("#plan-small"); await glide(p, sc, 700); mark("scout"); await p.waitForTimeout(1800);
const st = f.locator("#launch-start"); await st.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); await glide(p, st, 800); mark("summary"); await p.waitForTimeout(1800);
mark("startclick"); await st.click(); await p.waitForTimeout(1500);
let shot = 0;
const status = async () => { try { const r = await fetch("http://127.0.0.1:7979/api/mcp", { method: "POST", headers: { "content-type": "application/json", accept: "application/json, text/event-stream" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "chat_swarm_status", arguments: {} } }) }); const j = await r.json(); return j.result?.content?.[0]?.text ?? ""; } catch { return ""; } };
const log = [];
while (!existsSync(`${OUT}/cmd/STOP`)) {
  for (const n of readdirSync(`${OUT}/cmd`).filter(n => n.endsWith(".js")).sort()) {
    const src = readFileSync(`${OUT}/cmd/${n}`, "utf8"); renameSync(`${OUT}/cmd/${n}`, `${OUT}/cmd/${n}.done`);
    try { const fn = eval(`(async (p, f, cc, mark, glide) => { ${src} })`); console.log("cmd", n, await fn(p, p.frames()[1], cc, mark, glide)); } catch (e) { console.log("cmd-error", n, e.message); }
  }
  if (shot++ % 5 === 0) { await p.screenshot({ path: `${OUT}/shots/k.png` }).catch(() => {}); await cc.screenshot({ path: `${OUT}/shots/c.png` }).catch(() => {});
    log.push({ t: Date.now() / 1000, s: await status() }); writeFileSync(`${OUT}/status-log.json`, JSON.stringify(log)); }
  await new Promise(r => setTimeout(r, 1000));
}
mark("end"); await kcdp.send("Page.stopScreencast"); await ccdp.send("Page.stopScreencast"); save(); await b.close();
