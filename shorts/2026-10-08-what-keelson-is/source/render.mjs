// Renders scene.html frame by frame. Usage: node render.mjs <short-dir> [--fps 30] [--only t1,t2,...]
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const dir = process.argv[2], fps = 30;
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1].split(",").map(Number) : null;
const script = JSON.parse(readFileSync(`${dir}/script.json`, "utf8"));
const dur = JSON.parse(readFileSync(`${dir}/narr/durations.json`, "utf8"));
const LEAD = { hook: 0.5 }, TAIL = { workflows: 1.8, standalone: 0.8, reveal: 3.5 };
const T = {}; let t = 0;
for (const s of script.filter((s) => !["opener", "close"].includes(s.scene))) {
  const n = t + (LEAD[s.scene] ?? 0.6), e = n + dur[s.id] + (TAIL[s.scene] ?? 1.1);
  T[s.scene] = { id: s.id, s: +t.toFixed(3), n: +n.toFixed(3), d: dur[s.id], e: +e.toFixed(3), text: s.text }; t = e;
}
writeFileSync(`${dir}/source/timing.json`, JSON.stringify(T, null, 1));
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exit(1); });
await p.goto(`file://${dir}/source/scene.html`);
const total = await p.evaluate((T) => window.setup(T), T);
const end = T.reveal.e;
console.log("timeline", total.toFixed(2), "graphics end", end.toFixed(2));
const out = only ? `${dir}/raw/stills` : `${dir}/raw/frames`; mkdirSync(out, { recursive: true });
const times = only ?? Array.from({ length: Math.round(end * fps) }, (_, k) => k / fps);
for (let k = 0; k < times.length; k++) {
  await p.evaluate((t) => window.seek(t), times[k]);
  await p.screenshot({ path: `${out}/${String(k).padStart(5, "0")}.${only ? "png" : "jpg"}`, ...(only ? {} : { type: "jpeg", quality: 95 }) });
  if (!only && k % 300 === 0) console.log("frame", k, "/", times.length);
}
await b.close();
