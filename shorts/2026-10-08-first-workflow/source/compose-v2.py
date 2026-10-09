# Re-cut with the blueprint bookends. Run from the short's directory; writes v2/final.mp4.
import json, subprocess
B = "../../assets/bookends"
S = json.load(open("script.json"))
narr_file = {s["id"]: f"narr/{s['id']}.wav" for s in S} | {"n8": "v2/narr/n8.wav"}
probe = lambda p: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)
dur = {k: probe(v) for k, v in narr_file.items()}
m = json.load(open("source/web-meta.json"))["marks"]; rel = {k: v - m["start"] for k, v in m.items()}
X = 0.5
d = [probe(f"{B}/open-lay-the-keel.mp4"), 16.72 + 1.2, rel["end"], probe(f"{B}/close-raise-the-ribs.mp4")]
start = [0]
for i in range(1, 4): start.append(start[-1] + d[i - 1] - X)
total = start[3] + d[3]
narr = {"n1": 0.6, "n2": start[1] + 0.4, "n3": start[1] + 3.2, "n4": start[1] + 14.4,
        "n5": start[2] + 0.4, "n6": start[2] + 8.0, "n7": start[2] + rel["back"] - 0.3, "n8": start[3] + 1.6}
ids = list(narr)
for a, b in zip(ids, ids[1:]): assert narr[a] + dur[a] <= narr[b] + 0.01, (a, b)
assert narr["n8"] + dur["n8"] <= total - 0.4
caps = [i for i in ids if i not in ("n1", "n8")]
inp = ["-i", f"{B}/open-lay-the-keel.mp4", "-i", "raw/term.mp4", "-i", "raw/web.mp4", "-i", f"{B}/close-raise-the-ribs.mp4",
       "-loop", "1", "-t", str(d[0]), "-i", "v2/cards/fig-tag.png"]
for i in ids: inp += ["-i", narr_file[i]]
nb = 5; cb = nb + len(ids)
for c in caps: inp += ["-loop", "1", "-t", str(total), "-i", f"v2/cards/cap-{c}.png"]
V = "fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p"
f = [f"[4:v]format=rgba,fade=in:st=0.5:d=0.6:alpha=1,fade=out:st=7.0:d=0.6:alpha=1[tag]",
     f"[0:v]{V}[o];[o][tag]overlay=0:0:shortest=1,format=yuv420p[s0]",
     f"[1:v]{V},tpad=stop_mode=clone:stop_duration=1.2[s1]", f"[2:v]{V}[s2]", f"[3:v]{V}[s3]",
     f"[s0][s1]xfade=transition=fade:duration={X}:offset={start[1]:.3f}[x1]",
     f"[x1][s2]xfade=transition=fade:duration={X}:offset={start[2]:.3f}[x2]",
     f"[x2][s3]xfade=transition=fade:duration={X}:offset={start[3]:.3f}[x3]"]
last = "x3"
for k, c in enumerate(caps):
    t0 = narr[c]; t1 = t0 + dur[c] + 0.15
    f.append(f"[{cb+k}:v]format=rgba,fade=in:st={t0:.2f}:d=0.15:alpha=1,fade=out:st={t1-0.15:.2f}:d=0.15:alpha=1[c{k}]")
    f.append(f"[{last}][c{k}]overlay=0:0:enable='between(t,{t0:.2f},{t1:.2f})'[v{k}]"); last = f"v{k}"
f.append(f"[{last}]fade=in:st=0:d=0.3,fade=out:st={total-0.6:.2f}:d=0.6[vout]")
A = "aresample=48000,aformat=channel_layouts=stereo"
f.append(f"[0:a]{A},volume=0.35[amb0]")
ms = int(start[3] * 1000); f.append(f"[3:a]{A},volume=0.4,adelay={ms}|{ms}[amb1]")
mix = ["[amb0]", "[amb1]"]
for k, i in enumerate(ids):
    ms = int(narr[i] * 1000); f.append(f"[{nb+k}:a]{A},adelay={ms}|{ms}[a{k}]"); mix.append(f"[a{k}]")
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad,atrim=duration={total:.3f},loudnorm=I=-16:TP=-1.5:LRA=11,{A}[aout]")
cmd = ["ffmpeg", "-loglevel", "error", "-y", *inp, "-filter_complex", ";".join(f), "-map", "[vout]", "-map", "[aout]",
       "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
       "-movflags", "+faststart", "-t", f"{total:.3f}", "v2/final.mp4"]
print("total", round(total, 2), "scene starts", [round(x, 2) for x in start]); print({k: round(v, 2) for k, v in narr.items()})
subprocess.run(cmd, check=True)
