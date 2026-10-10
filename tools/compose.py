#!/usr/bin/env python3
"""Compose a short from its manifest.

Usage: compose.py <short-dir> [--out final.mp4] [--cards-only] [--dry]
Reads <short-dir>/short.yaml, narr/<id>.wav (tts.py), renders cards/ with cards.mjs, and writes the
master, final.srt, and build/timeline.json (every line and mark on the master's clock).

Times in the manifest are source times: a number is seconds into the scene's source, a string is
"mark", "mark + 0.4", or "mark - 0.3" against that scene's marks, so a re-capture moves nothing by hand.
Segments run cold-open scenes (`cold: true`), open bookend, scenes in order, close bookend, each
crossfading into the next (a scene's `xfade` sets the fade out of the segment before it). The composer
refuses to render if two lines overlap or the last line runs into the fade-out.
"""
import argparse, json, os, re, subprocess, sys
import yaml

TOOLS = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(TOOLS)
VP = (128, 100, 1664, 936)
FULL = (0, 0, 1920, 1080)
AMBIENT = {"open": 0.35, "close": 0.4}

ap = argparse.ArgumentParser()
ap.add_argument("short"); ap.add_argument("--out", default="final.mp4")
ap.add_argument("--cards-only", action="store_true"); ap.add_argument("--dry", action="store_true")
args = ap.parse_args()
root = os.path.abspath(args.short)
M = yaml.safe_load(open(os.path.join(root, "short.yaml")))
here = lambda p: p if os.path.isabs(p) else os.path.join(root, p)


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out)


def load_marks(spec):
    if not spec:
        return {}
    if isinstance(spec, dict):
        return dict(spec)
    d = json.load(open(here(spec)))
    if "marks" in d:
        t0 = d["marks"]["start"]
        return {k: v - t0 for k, v in d["marks"].items()}
    return d


fig, title, X = str(M["fig"]), M["title"], float(M.get("crossfade", 0.5))
book = M.get("bookends") or {}
segs = [{**s, "source": here(s["source"])} for s in M["scenes"] if s.get("cold")]
if book.get("open"):
    segs.append({"id": "open", "source": f"{LIB}/assets/bookends/open-{book['open']}.mp4", "frame": "full", "bookend": True})
for s in M["scenes"]:
    if not s.get("cold"):
        segs.append({**s, "source": here(s["source"])})
if book.get("close"):
    segs.append({"id": "close", "source": f"{LIB}/assets/bookends/close-{book['close']}.mp4", "frame": "full", "bookend": True,
                 **({"xfade": book["xfade"]} if "xfade" in book else {})})
by_id = {s["id"]: s for s in segs}

for s in segs:
    s["marks"] = load_marks(s.get("marks"))
    length = probe(s["source"])
    s["marks"].setdefault("start", 0.0)
    s["marks"].setdefault("end", length)


def src_time(seg, expr):
    if isinstance(expr, (int, float)):
        return float(expr)
    m = re.fullmatch(r"\s*([\w.-]+)\s*(?:([+-])\s*([\d.]+))?\s*", str(expr))
    if not m:
        raise SystemExit(f"bad time {expr!r} in scene {seg['id']}")
    name, sign, off = m.groups()
    if name not in seg["marks"]:
        try:
            base = float(name)
        except ValueError:
            raise SystemExit(f"scene {seg['id']} has no mark {name!r}; marks: {sorted(seg['marks'])}")
    else:
        base = seg["marks"][name]
    return base + (float(off) if sign == "+" else -float(off) if sign else 0.0)


t = 0.0
for i, s in enumerate(segs):
    a, b = (src_time(s, e) for e in s.get("trim", ["start", "end"]))
    s["a"], s["b"], s["hold"] = a, b, float(s.get("hold", 0))
    s["dur"] = b - a + s["hold"]
    s["x"] = 0.0 if i == 0 else float(s.get("xfade", X))
    t = t - s["x"] if i else 0.0
    s["at"] = t
    t += s["dur"]
total = t
glob = lambda seg, expr: seg["at"] + src_time(seg, expr) - seg["a"]
local = lambda seg, expr: src_time(seg, expr) - seg["a"]

# Narration
narr_dir = os.path.join(root, "narr")
words = json.load(open(os.path.join(narr_dir, "words.json"))) if os.path.exists(os.path.join(narr_dir, "words.json")) else {}
lines = []
for ln in M["lines"]:
    seg = by_id[ln["scene"]]
    wav = here(ln.get("wav", f"narr/{ln['id']}.wav"))
    start = glob(seg, ln["at"])
    cap = ln.get("caption", M.get("captions", True) and not seg.get("bookend"))
    lines.append({**ln, "wav": wav, "start": start, "dur": probe(wav), "caption": cap,
                  "rect": VP if seg.get("frame") == "viewport" else FULL})
lines.sort(key=lambda l: l["start"])
for p, q in zip(lines, lines[1:]):
    if p["start"] + p["dur"] > q["start"] + 0.01:
        raise SystemExit(f"{p['id']} ends at {p['start'] + p['dur']:.2f}s but {q['id']} starts at {q['start']:.2f}s")
if lines and lines[-1]["start"] + lines[-1]["dur"] > total - 0.4:
    raise SystemExit(f"{lines[-1]['id']} runs into the fade-out ({total:.2f}s)")

# Cards
cards = []
figtag = {"kind": "figtag", "file": "figtag.png", "text": f"FIG. {fig} · {title.upper()}", "scene": "open"}
sheet = {"kind": "sheet", "file": "sheet.png", "text": f"SHEET {fig} · ACT {M.get('act', '0')}", "title": title, "scene": "close"}
for c in M.get("cards", []):
    if c["kind"] == "figtag":
        figtag |= c
    elif c["kind"] == "sheet":
        sheet |= c
    else:
        cards.append(c)
overlays = []  # (file, t0, t1, fade)
if "open" in by_id:
    o = by_id["open"]
    overlays.append(("figtag.png", o["at"] + figtag.get("from", 0.5), o["at"] + figtag.get("to", o["dur"] - 1.1), 0.6))
if "close" in by_id:
    c = by_id["close"]
    overlays.append(("sheet.png", c["at"] + sheet.get("from", 1.4), total, 0.6))
render = [figtag, sheet]
for s in segs:
    if s.get("frame") == "viewport":
        render.append({"kind": "viewport", "file": f"viewport-{s['id']}.png", "rect": VP,
                       "header": M.get("viewport_header", f"<b>KEELSON</b> &nbsp;·&nbsp; FIG. {fig} &nbsp;·&nbsp; {title.upper()}"),
                       "label": s.get("label", "")})
tone = M.get("caption_tone", "light")
for k, ln in enumerate(lines):
    if not ln["caption"]:
        continue
    render.append({"kind": "caption", "file": f"cap-{ln['id']}.png", "text": ln["text"], "rect": ln["rect"], "tone": tone})
    nxt = lines[k + 1]["start"] if k + 1 < len(lines) else total
    overlays.append((f"cap-{ln['id']}.png", ln["start"], min(ln["start"] + ln["dur"] + 0.15, nxt), 0.15))
for k, c in enumerate(cards):
    seg = by_id[c["scene"]]
    render.append({**c, "file": f"callout-{k}.png"})
    overlays.append((f"callout-{k}.png", glob(seg, c["at"]), glob(seg, c["until"]) if "until" in c else seg["at"] + seg["dur"], 0.25))

card_dir = os.path.join(root, "cards")
build = os.path.join(root, "build")
os.makedirs(build, exist_ok=True)
json.dump({"out": card_dir, "cards": render}, open(os.path.join(build, "cards.json"), "w"), indent=1)
if not args.dry:
    subprocess.run(["node", os.path.join(TOOLS, "cards.mjs"), os.path.join(build, "cards.json")], check=True, cwd=TOOLS)
if args.cards_only:
    sys.exit(0)


def zoom_filter(seg):
    zs = seg.get("zoom") or []
    if not zs:
        return ""
    if isinstance(zs, dict):
        zs = [zs]
    zsum, cxsum, cysum = [], [], []
    for z in zs:
        a = local(seg, z["at"]); over = float(z.get("over", 0.8))
        u = local(seg, z["until"]) if "until" in z else seg["b"] - seg["a"] + 10
        bx, by, bw, bh = z["box"]
        Z = min(1920 / bw, 1080 / bh)
        ramp = lambda s0: f"(clip((it-{s0:.3f})/{over},0,1)*clip((it-{s0:.3f})/{over},0,1)*(3-2*clip((it-{s0:.3f})/{over},0,1)))"
        p = f"({ramp(a)}-{ramp(u)})"
        zsum.append(f"{Z - 1:.4f}*{p}")
        cxsum.append(f"{(bx + bw / 2) * 2 - 1920:.1f}*{p}")
        cysum.append(f"{(by + bh / 2) * 2 - 1080:.1f}*{p}")
    zexpr = "1+" + "+".join(zsum)
    cx, cy = "1920+" + "+".join(cxsum), "1080+" + "+".join(cysum)
    return (f",scale=3840:2160:flags=lanczos,zoompan=z='{zexpr}':d=1:fps=30:s=1920x1080"
            f":x='clip({cx}-iw/zoom/2,0,iw-iw/zoom)':y='clip({cy}-ih/zoom/2,0,ih-ih/zoom)'")


inputs, f = [], []
def add_input(*spec):
    inputs.extend(spec)
    return sum(1 for x in inputs if x == "-i") - 1


for k, s in enumerate(segs):
    vi = s["vi"] = add_input("-i", s["source"])
    rng = s.get("range", "auto")
    chain = (f"[{vi}:v]trim=start={s['a']:.3f}:end={s['b']:.3f},setpts=PTS-STARTPTS,fps=30,"
             f"scale=1920:1080:flags=lanczos:in_range={rng}:out_range=tv,setsar=1,format=yuv420p")
    for m in s.get("masks", []):
        x, y, w, h = m["box"]
        en = f":enable='between(t,{local(s, m.get('from', 'start')):.3f},{local(s, m.get('to', 'end')):.3f})'"
        chain += f",drawbox=x={x}:y={y}:w={w}:h={h}:color={m.get('color', '0x0d1329')}:t=fill{en}"
    chain += zoom_filter(s)
    if s["hold"]:
        chain += f",tpad=stop_mode=clone:stop_duration={s['hold']:.3f}"
    if s.get("frame") == "viewport":
        bg = add_input("-loop", "1", "-t", f"{s['dur']:.3f}", "-i", os.path.join(card_dir, f"viewport-{s['id']}.png"))
        x, y, w, h = VP
        f.append(chain + f",scale={w}:{h}:flags=lanczos[f{k}]")
        f.append(f"[{bg}:v]fps=30,format=yuv420p[bg{k}];[bg{k}][f{k}]overlay={x}:{y}:shortest=1")
        f[-1] += f",format=yuv420p,settb=AVTB[s{k}]"
    else:
        f.append(chain + f",settb=AVTB[s{k}]")
last = "s0"
for k, s in enumerate(segs[1:], 1):
    f.append(f"[{last}][s{k}]xfade=transition=fade:duration={s['x']:.3f}:offset={s['at']:.3f}[x{k}]")
    last = f"x{k}"
for k, (file, t0, t1, fade) in enumerate(overlays):
    ci = add_input("-loop", "1", "-t", f"{total:.3f}", "-i", os.path.join(card_dir, file))
    f.append(f"[{ci}:v]format=rgba,fade=in:st={t0:.3f}:d={fade}:alpha=1,fade=out:st={max(t0, t1 - fade):.3f}:d={fade}:alpha=1[c{k}]")
    f.append(f"[{last}][c{k}]overlay=0:0:enable='between(t,{t0:.3f},{t1:.3f})'[o{k}]")
    last = f"o{k}"
f.append(f"[{last}]fade=in:st=0:d=0.3,fade=out:st={total - 0.6:.3f}:d=0.6,format=yuv420p[vout]")

A = "aresample=48000,aformat=channel_layouts=stereo"
mix = []
for s in segs:
    if s.get("bookend") or s.get("audio"):
        vol = float(s.get("audio", AMBIENT.get(s["id"], 0.4)))
        idx = s["vi"]
        ms = int(s["at"] * 1000)
        f.append(f"[{idx}:a]atrim=start={s['a']:.3f}:end={s['b']:.3f},asetpts=PTS-STARTPTS,{A},volume={vol},adelay={ms}|{ms}[amb{len(mix)}]")
        mix.append(f"[amb{len(mix)}]")
for k, ln in enumerate(lines):
    ni = add_input("-i", ln["wav"])
    ms = int(ln["start"] * 1000)
    f.append(f"[{ni}:a]{A},adelay={ms}|{ms}[n{k}]")
    mix.append(f"[n{k}]")
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad,atrim=duration={total:.3f},"
         f"loudnorm=I=-16:TP=-1.5:LRA=11,{A}[aout]")


def srt_time(x):
    ms = int(round(x * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


with open(os.path.join(root, os.path.splitext(args.out)[0] + ".srt"), "w") as fh:
    for k, ln in enumerate(lines, 1):
        fh.write(f"{k}\n{srt_time(ln['start'])} --> {srt_time(ln['start'] + ln['dur'])}\n{ln['text']}\n\n")
timeline = {"total": round(total, 3),
            "segments": {s["id"]: {"at": round(s["at"], 3), "dur": round(s["dur"], 3)} for s in segs},
            "lines": {ln["id"]: {"start": round(ln["start"], 3), "end": round(ln["start"] + ln["dur"], 3),
                                 "words": [[w, round(ln["start"] + s0, 3), round(ln["start"] + e0, 3)] for w, s0, e0 in words.get(ln["id"], [])]}
                      for ln in lines}}
json.dump(timeline, open(os.path.join(build, "timeline.json"), "w"), indent=1)
open(os.path.join(build, "filter.txt"), "w").write(";\n".join(f))

print(f"total {total:.2f}s  " + "  ".join(f"{s['id']}@{s['at']:.2f}" for s in segs), file=sys.stderr)
for p, q in zip(lines, lines[1:] + [None]):
    gap = (q["start"] if q else total) - (p["start"] + p["dur"])
    print(f"  {p['id']:>4} {p['start']:6.2f} → {p['start'] + p['dur']:6.2f}   gap after {gap:4.1f}s", file=sys.stderr)
if args.dry:
    sys.exit(0)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *inputs, "-/filter_complex", os.path.join(build, "filter.txt"),
                "-map", "[vout]", "-map", "[aout]", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
                "-color_range", "tv", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{total:.3f}",
                os.path.join(root, args.out)], check=True)
print(os.path.join(root, args.out))
