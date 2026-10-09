# Opener + motion graphics + closer. Run from the short's directory; writes final.mp4.
import json, subprocess
B = "../../assets/bookends"
T = json.load(open("source/timing.json")); dur = json.load(open("narr/durations.json"))
probe = lambda p: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)
X = 0.8
op = probe(f"{B}/open-lay-the-keel.mp4"); g = probe("raw/graphics.mp4"); close = probe(f"{B}/close-raise-the-ribs.mp4")
gs = op - X; cs = gs + g - X; total = cs + close
narr = {"n0": 2.4} | {v["id"]: gs + v["n"] for v in T.values()} | {"n12": cs + 1.6}
ids = list(narr)
for a, b in zip(ids, ids[1:]): assert narr[a] + dur[a] <= narr[b] + 0.01, (a, b)
inp = ["-i", f"{B}/open-lay-the-keel.mp4", "-i", "raw/graphics.mp4", "-i", f"{B}/close-raise-the-ribs.mp4", "-loop", "1", "-t", str(op), "-i", "cards/fig-tag.png"]
for i in ids: inp += ["-i", f"narr/{i}.wav"]
V = "fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p"
A = "aresample=48000,aformat=channel_layouts=stereo"
f = ["[3:v]format=rgba,fade=in:st=0.5:d=0.6:alpha=1[tag]", f"[0:v]{V}[o0]", "[o0][tag]overlay=0:0:shortest=1,format=yuv420p[o]",
     f"[1:v]{V}[g]", f"[2:v]{V}[c]",
     f"[o][g]xfade=transition=fade:duration={X}:offset={gs:.3f}[og]",
     f"[og][c]xfade=transition=fade:duration={X}:offset={cs:.3f},fade=in:st=0:d=0.3,fade=out:st={total-0.6:.2f}:d=0.6,scale=in_range=pc:out_range=tv,format=yuv420p[vout]",
     f"[0:a]{A},volume=0.35[amb0]", f"[2:a]{A},volume=0.4,adelay={int(cs*1000)}|{int(cs*1000)}[amb1]"]
mix = ["[amb0]", "[amb1]"]
for k, i in enumerate(ids):
    ms = int(narr[i] * 1000); f.append(f"[{4+k}:a]{A},adelay={ms}|{ms}[a{k}]"); mix.append(f"[a{k}]")
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad,atrim=duration={total:.3f},loudnorm=I=-16:TP=-1.5:LRA=11,{A}[aout]")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *inp, "-filter_complex", ";".join(f), "-map", "[vout]", "-map", "[aout]",
                "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-color_range", "tv", "-c:a", "aac", "-b:a", "192k",
                "-movflags", "+faststart", "-t", f"{total:.3f}", "final.mp4"], check=True)
print("total", round(total, 2), "graphics at", round(gs, 2), "closer at", round(cs, 2))
