#!/usr/bin/env python3
"""Build review reels, slates, all-pairings.mp4 and contact.png from chosen takes.

Usage: build.py PAIR=OPENER,CLOSER ...   e.g. A=takes/A-open-1.mp4,takes/A-close-1.mp4
Run from field-trials/bookends.
"""
import json, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

PLATE = "../admeinterop/raw/plate.mp4"
NAMES = {"A": "Benchmark", "B": "Instrument", "C": "Core", "D": "Shared sheet",
         "E": "Seismic", "F": "Plumb"}
NAVY = (0x1e, 0x3a, 0x5f)
V = "fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p,settb=AVTB"
A = "aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo"
ENC = ["-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
XF, OHOLD, CHOLD, OSLOW, CSLOW = 0.8, 0.5, 1.5, 1.0, 1.4


def ff(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args], check=True)


def dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "json", path], capture_output=True, text=True, check=True)
    return float(json.loads(out.stdout)["format"]["duration"])


def plate_len():
    return dur(PLATE)


def reel(letter, opener, closer, out):
    od, cd, pd = dur(opener), dur(closer), plate_len()
    to = round(od * OSLOW + OHOLD, 3)
    tc = round(cd * CSLOW + CHOLD, 3)
    off1 = to - XF                # opener -> plate start
    tp = 4.0 + 3.0                 # plate intro + plate outro
    off2 = off1 + tp - XF          # plate -> closer
    total = off2 + tc
    fc = f"""
[0:v]setpts={OSLOW}*PTS,{V},tpad=stop_mode=clone:stop_duration={OHOLD},trim=duration={to},setpts=PTS-STARTPTS[o];
[1:v]trim=start_frame=1,trim=duration=4,setpts=PTS-STARTPTS,{V}[p1];
[1:v]trim={pd - 3}:{pd},setpts=PTS-STARTPTS,{V}[p2];
[p1][p2]concat=n=2:v=1:a=0[p];
[2:v]setpts={CSLOW}*PTS,{V},tpad=stop_mode=clone:stop_duration={CHOLD},trim=duration={tc},setpts=PTS-STARTPTS[c];
[o][p]xfade=transition=fade:duration={XF}:offset={off1}[op];
[op][c]xfade=transition=fade:duration={XF}:offset={off2},format=yuv420p[v];
[0:a]atempo={1 / OSLOW:.4f},{A},apad,atrim=duration={to},afade=in:d=0.3,afade=out:st={off1}:d={XF}[oa];
[2:a]atempo={1 / CSLOW:.4f},{A},apad,atrim=duration={tc},afade=in:d={XF},afade=out:st={tc - 2.0}:d=2.0,adelay={int(off2 * 1000)}:all=1[ca];
[oa][ca]amix=inputs=2:duration=longest:normalize=0,apad,atrim=duration={total}[a]"""
    ff("-i", opener, "-i", PLATE, "-i", closer, "-filter_complex", fc,
       "-map", "[v]", "-map", "[a]", "-t", f"{total}", *ENC, out)
    return {"opener_s": to, "closer_s": tc, "total_s": round(total, 2)}


def slate_png(letter, out):
    bg = Image.open("work/plate-blank.png").convert("RGB")
    d = ImageDraw.Draw(bg)
    big = ImageFont.truetype("/Users/danielscholl/Library/Fonts/Inter-Bold.otf", 220)
    name = ImageFont.truetype("/Users/danielscholl/Library/Fonts/Inter-Medium.otf", 72)
    W, H = bg.size
    d.text((W / 2, H / 2 - 60), letter, font=big, fill=NAVY, anchor="mm")
    d.text((W / 2, H / 2 + 130), NAMES[letter], font=name, fill=NAVY, anchor="mm")
    bg.save(out)


def slate(letter, out):
    png = f"work/slate-{letter}.png"
    slate_png(letter, png)
    ff("-loop", "1", "-t", "1.5", "-framerate", "30", "-i", png,
       "-f", "lavfi", "-t", "1.5", "-i", "anullsrc=r=48000:cl=stereo",
       "-vf", "fps=30,format=yuv420p", "-shortest", *ENC, out)


def frames(path, t_list, w=320):
    ims = []
    for t in t_list:
        tmp = "work/_f.png"
        args = ["-sseof", "-0.3"] if t == "end" else ["-ss", f"{t}"]
        ff(*args, "-i", path, "-frames:v", "1", "-vf", f"scale={w}:-1", tmp)
        ims.append(Image.open(tmp).convert("RGB"))
    return ims


def contact(pairs, out):
    w, h, pad, lab = 320, 180, 10, 230
    hdr = 50
    sheet = Image.new("RGB", (lab + 6 * (w + pad) + pad, hdr + len(pairs) * (h + pad) + pad),
                      (0xf3, 0xf5, 0xf8))
    d = ImageDraw.Draw(sheet)
    f = ImageFont.truetype("/Users/danielscholl/Library/Fonts/Inter-Medium.otf", 26)
    fs = ImageFont.truetype("/Users/danielscholl/Library/Fonts/Inter-Regular.otf", 18)
    for i, t in enumerate(["opener first", "opener mid", "opener last",
                           "closer first", "closer mid", "closer last"]):
        d.text((lab + pad + i * (w + pad) + w / 2, hdr / 2), t, font=fs, fill=NAVY, anchor="mm")
    for r, (letter, (op, cl)) in enumerate(pairs):
        y = hdr + r * (h + pad)
        d.text((pad, y + h / 2 - 16), f"{letter} · {NAMES[letter]}", font=f, fill=NAVY, anchor="lm")
        d.text((pad, y + h / 2 + 18), f"{op.split('/')[-1][:-4]} + {cl.split('/')[-1][:-4]}",
               font=fs, fill=NAVY, anchor="lm")
        ims = frames(op, [0, dur(op) / 2, "end"]) + frames(cl, [0, dur(cl) / 2, "end"])
        for i, im in enumerate(ims):
            sheet.paste(im, (lab + pad + i * (w + pad), y))
    sheet.save(out)


if __name__ == "__main__":
    pairs = []
    for arg in sys.argv[1:]:
        k, v = arg.split("=")
        pairs.append((k, tuple(v.split(","))))
    parts = []
    for letter, (op, cl) in pairs:
        info = reel(letter, op, cl, f"review/reel-{letter}.mp4")
        print(letter, info)
        slate(letter, f"work/slate-{letter}.mp4")
        parts += [f"work/slate-{letter}.mp4", f"review/reel-{letter}.mp4"]
    if parts:
        n = len(parts)
        ins = sum([["-i", p] for p in parts], [])
        fc = "".join(f"[{i}:v][{i}:a]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][a]"
        ff(*ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", *ENC,
           "review/all-pairings.mp4")
        contact(pairs, "review/contact.png")
