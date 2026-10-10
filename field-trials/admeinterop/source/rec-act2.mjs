// Usage: node rec-act2.mjs [scene...] — records Act II on the sample stage (:7980) into raw/act2/<scene>/.
// Each line is a mark; actions inside a line run against its real narration length.
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
const { chromium } = createRequire(new URL("../../../tools/", import.meta.url))("playwright");

const ROOT = new URL("../", import.meta.url).pathname;
const DUR = JSON.parse(readFileSync(`${ROOT}narr/durations.json`, "utf8"));
const CURSOR = readFileSync(`${ROOT}../../tools/cursor.js`, "utf8");
const GAP = 0.5;
const ONLY = process.argv.slice(2);

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.2, colorScheme: "dark" });
await ctx.addInitScript(CURSOR);
const p = await ctx.newPage();
const wait = (s) => p.waitForTimeout(Math.max(0, s * 1000));
const now = () => Date.now() / 1000;

async function glide(loc, ms = 700) {
  const bb = await loc.boundingBox({ timeout: 3000 }).catch(() => null);
  if (!bb) return console.log("  missed", String(loc));
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: Math.round(ms / 16) });
}
async function into(loc, block = "start") {
  await loc.evaluate((el, block) => el.scrollIntoView({ behavior: "smooth", block }), block, { timeout: 3000 }).catch(() => console.log("  missed", String(loc)));
  await wait(0.9);
}
async function top() {
  await p.evaluate(() => {
    for (const el of [document.scrollingElement, ...document.querySelectorAll("main, [class*=scroll]")]) el?.scrollTo?.({ top: 0, behavior: "instant" });
  });
}

async function record(name, body) {
  if (ONLY.length && !ONLY.includes(name)) return;
  const OUT = `${ROOT}raw/act2/${name}`;
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
  marks.start = now();
  const mark = (k) => (marks[k] = now());
  // A line: mark it, run its actions, then hold until the narration and the gap are over.
  const line = async (id, actions = async () => {}) => {
    const t0 = now();
    mark(id);
    await actions();
    await wait(DUR[id] + GAP - (now() - t0));
  };
  await body({ line, mark, at: async (t0, s) => wait(s - (now() - t0)) });
  marks.end = now();
  await cdp.send("Page.stopScreencast");
  await wait(0.3);
  writeFileSync(`${OUT}/meta.json`, JSON.stringify({ frames, marks }, null, 1));
  console.log(name, frames.length, "frames", JSON.stringify(Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +(v - marks.start).toFixed(2)]))));
}

const section = (name) => p.getByRole("button", { name: new RegExp(`^${name}`) }).first();

await p.goto("http://127.0.0.1:7980/", { waitUntil: "networkidle" });
await p.getByText("ADME", { exact: true }).first().click();
await wait(1.5);
await section("Seismic").click();
await wait(0.8);
await p.getByRole("button", { name: "Read subprojects" }).first().click().catch(() => {});
await wait(2);
await p.locator("button[aria-label*=Dismiss], [class*=toast] button").first().click({ timeout: 500 }).catch(() => {});
await section("Access").click();
await wait(1.2);
await top();
await p.mouse.move(1300, 700);
await wait(0.6);

await record("f-access", async ({ line }) => {
  await wait(0.8);
  await line("a1");
  await line("a2", async () => {
    await wait(0.4);
    await glide(p.getByText(/^32 people from 12 organizations/).first(), 900);
    await wait(2.4);
    await glide(p.getByText("ACCEPTED, NOT USED", { exact: false }).first(), 900);
  });
  await line("a3", async () => {
    await into(p.getByText("From invitation to data", { exact: false }).first(), "start");
    await wait(0.6);
    await glide(p.getByText("Accepted the invitation", { exact: true }).first(), 600);
    await wait(1.0);
    await glide(p.getByText("Made a data call", { exact: true }).first(), 600);
  });
  await line("a4", async () => {
    await top();
    await wait(0.3);
    await glide(p.getByText(/measured 14:/i).first(), 800);
  });
  await wait(1.2);
});

await record("f-why", async ({ line }) => {
  await wait(0.2);
  await line("b1", async () => {
    await into(p.getByText("Cannot use it", { exact: false }).first(), "center");
    const rachel = p.getByRole("button", { name: /Rachel Kim/ }).first();
    await glide(rachel, 900);
    await wait(0.8);
    await rachel.click();
  });
  await line("b2", async () => {
    await wait(0.3);
    const why = p.getByRole("button", { name: "Why 401/403" }).first();
    await glide(why, 700);
    await wait(0.4);
    await why.click();
    await wait(2.2);
    await glide(p.getByText("this is the cause", { exact: false }).first(), 900);
  });
  await line("b3", async () => {
    await into(p.getByText("Add Rachel Kim to users@", { exact: false }).first(), "start");
    await glide(p.getByText("Note for Rachel Kim", { exact: false }).first(), 700);
  });
  await wait(1.4);
});

await p.keyboard.press("Escape");
await p.locator("button[aria-label*=Close], button[aria-label*=close]").first().click({ timeout: 800 }).catch(() => {});
await section("Seismic").click();
await wait(1.0);
await top();
await p.mouse.move(1300, 700);
await wait(0.6);

await record("f-seismic", async ({ line }) => {
  await wait(0.6);
  await line("d1", async () => {
    await wait(0.4);
    await glide(p.getByText(/^13 subprojects; 9 of 32/).first(), 900);
  });
  await line("d2", async () => {
    await glide(p.getByText(/^subprojects$/i).first(), 600);
    await wait(1.4);
    await glide(p.getByText("ON DEFAULT ACL", { exact: false }).first(), 700);
    await wait(1.4);
    await glide(p.getByText("NO MEMBERS", { exact: false }).first(), 700);
  });
  await line("d3", async () => {
    await into(p.getByText("Grant or revoke", { exact: true }).first(), "start");
    const person = p.locator("select").first();
    await glide(person, 600);
    await person.selectOption({ label: "Lena Fischer" });
    await wait(0.6);
    const preview = p.getByRole("button", { name: "Preview plan" }).first();
    await glide(preview, 600);
    await wait(0.2);
    await preview.click();
    await wait(1.6);
    await glide(p.getByText(/^POST entitlements/).first(), 800);
  });
  await line("d4", async () => {
    await glide(p.getByRole("button", { name: /^Apply 1 change/ }).first(), 800);
  });
  await wait(1.4);
});

await p.getByRole("button", { name: "Discard plan" }).first().click({ timeout: 2000 }).catch(() => {});
await p.keyboard.press("Escape");
await section("Data").click();
await wait(1.2);
await top();
await p.mouse.move(1300, 700);
await wait(0.6);

await record("f-data", async ({ line }) => {
  await wait(0.6);
  await line("e1", async () => {
    await wait(0.4);
    await glide(p.getByText(/^1,284,512 records under/).first(), 900);
  });
  await line("e2", async () => {
    await glide(p.getByText("LEGAL TAGS IN USE", { exact: false }).first(), 700);
    await wait(1.6);
    await into(p.getByText("Partition map", { exact: true }).first(), "start");
    await wait(0.4);
    await glide(p.getByText("opendes-pilot-trial", { exact: true }).first(), 900);
  });
  await wait(1.4);
});

await b.close();
