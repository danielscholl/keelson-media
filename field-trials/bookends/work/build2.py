#!/usr/bin/env python3
"""Pass 2 review: reels, slates, a combined reel and a contact sheet in review/pass2/.

Usage: build2.py KEY=OPENER,CLOSER[,oslow=1,ohold=0.5,cslow=1.4,chold=1.5] ...
Run from field-trials/bookends. Pre-cut takes (work/cut.py) usually want ohold=0, chold=0.
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as b

OUT = "review/pass2"
NAMES = {"B": "Instrument, pass 1", "G": "Field survey"}
DEFAULTS = {"oslow": 1.0, "ohold": 0.5, "cslow": 1.4, "chold": 1.5}


def fade_tail(path, d=0.8):
    tmp = path + ".tmp.mp4"
    total = b.dur(path)
    b.ff("-i", path, "-vf", f"fade=out:st={total - d:.3f}:d={d}", "-af", f"afade=out:st={total - d:.3f}:d={d}",
         *b.ENC, tmp)
    os.replace(tmp, path)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    pairs, parts = [], []
    for arg in sys.argv[1:]:
        key, val = arg.split("=", 1)
        op, cl, *opts = val.split(",")
        o = {**DEFAULTS, **{k: float(v) for k, v in (x.split("=") for x in opts)}}
        b.OSLOW, b.OHOLD, b.CSLOW, b.CHOLD = o["oslow"], o["ohold"], o["cslow"], o["chold"]
        b.NAMES[key] = NAMES.get(key[0], key)
        info = b.reel(key, op, cl, f"{OUT}/reel-{key}.mp4")
        fade_tail(f"{OUT}/reel-{key}.mp4")
        print(key, op, cl, info)
        b.slate(key, f"work/slate-{key}.mp4")
        pairs.append((key, (op, cl)))
        parts += [f"work/slate-{key}.mp4", f"{OUT}/reel-{key}.mp4"]
    n = len(parts)
    ins = sum([["-i", p] for p in parts], [])
    fc = "".join(f"[{i}:v][{i}:a]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][a]"
    b.ff(*ins, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", *b.ENC, f"{OUT}/all.mp4")
    b.contact(pairs, f"{OUT}/contact.png")
