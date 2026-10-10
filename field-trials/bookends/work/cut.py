#!/usr/bin/env python3
"""Pre-cut a take for the review reels: keep [start, end] at SLOW, then freeze FREEZE seconds.

Usage: cut.py IN OUT --end 2.53 [--start 0] [--slow 1.0] [--freeze 0.9]
Audio is trimmed and slowed to match, then faded out across the freeze.
"""
import argparse, subprocess

p = argparse.ArgumentParser()
p.add_argument("src"); p.add_argument("out")
p.add_argument("--start", type=float, default=0.0)
p.add_argument("--end", type=float, required=True)
p.add_argument("--slow", type=float, default=1.0)
p.add_argument("--freeze", type=float, default=0.0)
a = p.parse_args()

body = (a.end - a.start) * a.slow
total = body + a.freeze
fade = max(0.4, min(1.2, a.freeze + 0.3))
v = (f"[0:v]trim={a.start}:{a.end},setpts=PTS-STARTPTS,setpts={a.slow}*PTS,fps=30,"
     f"tpad=stop_mode=clone:stop_duration={a.freeze},trim=duration={total:.3f}[v]")
au = (f"[0:a]atrim={a.start}:{a.end},asetpts=PTS-STARTPTS,atempo={1 / a.slow:.4f},apad,"
      f"atrim=duration={total:.3f},afade=out:st={max(0, total - fade):.3f}:d={fade:.3f}[a]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", a.src, "-filter_complex", f"{v};{au}",
                "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "14", "-preset", "slow",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", a.out], check=True)
print(a.out, f"{total:.2f}s")
