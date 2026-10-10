// Usage: node rec-ask.mjs — one live take of "Ask about it" on the sample stage (:7980) into raw/act2/f-ask/.
// The model's timing varies, so marks log events (click, reply, send, page) and compose cuts the waits.
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
const { chromium } = createRequire(new URL("../../../tools/", import.meta.url))("playwright");

const ROOT = new URL("../", import.meta.url).pathname;
const DUR = JSON.parse(readFileSync(`${ROOT}narr/durations.json`, "utf8"));
const CURSOR = readFileSync(`${ROOT}../../tools/cursor.js`, "utf8");
const ASK = "Draft this week's partner update from this panel as a page.";
const OUT = `${ROOT}raw/act2/f-ask`;

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
// The page opens in a sandboxed iframe; a second cursor there would freeze the host's, so only the top frame gets one.
await ctx.addInitScript(`if (window.top === window) {${CURSOR}}`);
const p = await ctx.newPage();
const wait = (s) => p.waitForTimeout(Math.max(0, s * 1000));
const now = () => Date.now() / 1000;
async function glide(loc, ms = 700) {
  const bb = await loc.boundingBox({ timeout: 3000 }).catch(() => null);
  if (!bb) return console.log("  missed", String(loc));
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: Math.round(ms / 16) });
}
const busy = async () => (await p.getByRole("button", { name: /^Stop/ }).count()) > 0;
async function until(check, s = 180) {
  for (let i = 0; i < s * 4; i++) { if (await check()) return true; await wait(0.25); }
  console.log("  timed out"); return false;
}

await p.goto("http://127.0.0.1:7980/", { waitUntil: "networkidle" });
await p.getByText("ADME", { exact: true }).first().click();
await wait(2);
await p.getByRole("button", { name: /^Access/ }).first().click();
await wait(1.5);
const explore = p.locator("button[aria-label='Explore in chat']").nth(3);
await p.getByText(/^Organizations$/).first().evaluate((el) => {
  const sc = [...document.querySelectorAll("*")].find((n) => n.scrollHeight > n.clientHeight + 40 && /auto|scroll/.test(getComputedStyle(n).overflowY)) ?? document.scrollingElement;
  sc.scrollTop += el.getBoundingClientRect().top - 150;
});
await wait(1);
await p.mouse.move(1100, 760);
await wait(0.6);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/frames`, { recursive: true });
const frames = [];
const marks = {};
const cdp = await ctx.newCDPSession(p);
cdp.on("Page.screencastFrame", async (f) => {
  const i = frames.length;
  frames.push(f.metadata.timestamp);
  writeFileSync(`${OUT}/frames/${String(i).padStart(5, "0")}.jpg`, Buffer.from(f.data, "base64"));
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
const mark = (k) => (marks[k] = now());
marks.start = now();

await wait(0.8);
mark("g1");
await glide(explore, 1100);
await wait(Math.max(0.4, DUR.g1 + 0.3 - (now() - marks.g1)));
await explore.click();
mark("click");
await until(async () => (await p.getByText(/^Assistant$/i).count()) > 0, 20);
mark("g2");
await until(async () => (await p.getByText(/12 org/i).count()) > 0, 90);
mark("stream");
await until(async () => !(await busy()), 180);
mark("kdone");
await wait(1.2);
const box = p.locator("textarea").first();
await glide(box, 700);
await box.click();
mark("g3");
await box.pressSequentially(ASK, { delay: 38 });
await wait(0.5);
await box.press("Enter");
mark("sent");
await until(async () => (await p.locator("[role=dialog] iframe").count()) > 0, 300);
mark("page");
await p.evaluate(() => { if (window.__demoCursor) window.__demoCursor.style.opacity = "0"; });
await wait(3.5);
mark("pscroll");
for (let i = 0; i < 24; i++) { await p.mouse.wheel(0, 28); await wait(0.12); }
await wait(2.5);
mark("pend");
await wait(1.5);
marks.end = now();
await cdp.send("Page.stopScreencast");
await wait(0.3);
writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
const rel = Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(3)]));
writeFileSync(`${ROOT}source/f-ask-marks.json`, JSON.stringify(rel));
console.log(frames.length, "frames", JSON.stringify(rel));
await b.close();
