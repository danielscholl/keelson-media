// Render a short's plate boards (motion graphics on the blueprint sheet) to one video.
// Usage: node plate.mjs <short-dir> [--only t1,t2,...]   (--only writes PNG stills to raw/plate-stills for checking)
// short.yaml `plate`: { html, out, boards: [{ id, lines: [ids], lead, gap, tail }] }. Each board lasts
// lead + its lines (with gap between) + tail, so narration sets the pacing. The page gets
// window.setup(T, words) and must build a paused GSAP timeline on window.tl; T[board] = { s, e, lines: { id: { n, d } } }
// in plate seconds, words[id] = [[word, start, end], ...] relative to the line. Writes source/plate-marks.json
// ({ board: s, "board.end": e, lineId: n }) for compose, and the encoded video.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import YAML from "yaml";

const dir = resolve(process.argv[2]);
const fps = 30;
const onlyAt = process.argv.indexOf("--only");
const only = onlyAt > 0 ? process.argv[onlyAt + 1].split(",").map(Number) : null;
const M = YAML.parse(readFileSync(join(dir, "short.yaml"), "utf8"));
const dur = JSON.parse(readFileSync(join(dir, "narr/durations.json"), "utf8"));
const words = JSON.parse(readFileSync(join(dir, "narr/words.json"), "utf8"));

const T = {}, marks = {};
let t = 0;
for (const b of M.plate.boards) {
  const s = t;
  let n = s + (b.lead ?? 0.6);
  const lines = {};
  for (const [k, id] of b.lines.entries()) {
    if (k) n += b.gap ?? 0.6;
    lines[id] = { n: +n.toFixed(3), d: dur[id] };
    marks[id] = +n.toFixed(3);
    n += dur[id];
  }
  t = n + (b.tail ?? 1.0);
  T[b.id] = { s: +s.toFixed(3), e: +t.toFixed(3), lines };
  marks[b.id] = +s.toFixed(3);
  marks[`${b.id}.end`] = +t.toFixed(3);
}
writeFileSync(join(dir, "source/plate-marks.json"), JSON.stringify(marks, null, 1));

const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exit(1); });
p.on("console", (m) => m.type() === "error" && console.error("console:", m.text()));
await p.goto(`file://${join(dir, M.plate.html)}`);
await p.evaluate(() => document.fonts.ready);
await p.evaluate(([T, words]) => { window.setup(T, words); }, [T, words]);

const out = join(dir, only ? "raw/plate-stills" : "raw/plate-frames");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const times = only ?? Array.from({ length: Math.round(t * fps) }, (_, k) => k / fps);
for (let k = 0; k < times.length; k++) {
  // tl.seek returns the timeline, which page.evaluate cannot serialize; return nothing.
  await p.evaluate((x) => { window.tl.seek(x, false); }, times[k]);
  await p.screenshot({ path: join(out, `${String(k).padStart(5, "0")}.${only ? "png" : "jpg"}`), ...(only ? {} : { type: "jpeg", quality: 95 }) });
  if (!only && k % 300 === 0) console.log(`frame ${k} / ${times.length}`);
}
await b.close();
if (!only) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(fps), "-i", join(out, "%05d.jpg"),
    "-vf", "scale=in_range=pc:out_range=tv,format=yuv420p", "-c:v", "libx264", "-crf", "16", "-preset", "slow",
    "-color_range", "tv", join(dir, M.plate.out)]);
  rmSync(out, { recursive: true, force: true });
}
console.log(`plate ${t.toFixed(2)}s, ${M.plate.boards.length} boards${only ? `, ${times.length} stills in raw/plate-stills` : ` -> ${M.plate.out}`}`);
