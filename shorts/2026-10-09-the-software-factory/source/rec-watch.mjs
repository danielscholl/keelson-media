// Usage: node rec-watch.mjs <outDir> <swarm|beads> — a short take of the live swarm card or the draining board.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
const [OUT, MODE] = process.argv.slice(2);
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT + "/frames", { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
await ctx.addInitScript(`try { localStorage.setItem("keelson.activeProjectId", "8e66d971-4b5a-4388-a0de-add37aa311a2"); } catch {}`);
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:7979/", { waitUntil: "networkidle" });
if (MODE === "swarm") {
  await p.getByText("Swarms", { exact: true }).first().click(); await p.waitForTimeout(2500);
  const f = p.frames()[1];
  await f.getByText("Open swarm").first().click().catch(() => {}); await p.waitForTimeout(3000);
} else {
  await p.getByText("Beads", { exact: true }).first().click(); await p.waitForTimeout(2000);
  await p.getByRole("button", { name: "cosmos-factory" }).first().click().catch(() => {}); await p.waitForTimeout(3000);
}
await p.mouse.move(1900, 1000);
const frames = []; const marks = {};
const cdp = await ctx.newCDPSession(p);
cdp.on("Page.screencastFrame", async fr => { const i = frames.length; frames.push(fr.metadata.timestamp);
  writeFileSync(`${OUT}/frames/${String(i).padStart(5,"0")}.jpg`, Buffer.from(fr.data, "base64"));
  await cdp.send("Page.screencastFrameAck", { sessionId: fr.sessionId }).catch(() => {}); });
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
marks.start = Date.now() / 1000;
await p.waitForTimeout(12000);
marks.end = Date.now() / 1000;
await cdp.send("Page.stopScreencast");
writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
await p.screenshot({ path: `${OUT}/last.png`, fullPage: true });
await b.close().catch(() => {}); process.exit(0);
