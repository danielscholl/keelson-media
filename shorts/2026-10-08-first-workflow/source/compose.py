import json,subprocess
S=json.load(open("script.json")); dur={}
for s in S:
    dur[s["id"]]=float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"narr/{s['id']}.wav"],capture_output=True,text=True).stdout)
m=json.load(open("web/meta.json"))["marks"]; rel={k:v-m["start"] for k,v in m.items()}
X=0.5
d=[6.2, 16.72+1.2, rel["end"], 7.0]
start=[0]; 
for i in range(1,4): start.append(start[-1]+d[i-1]-X)
total=start[3]+d[3]
narr={"n1":start[0]+0.5,"n2":start[1]+0.4,"n3":start[1]+3.2,"n4":start[1]+14.4,
      "n5":start[2]+0.4,"n6":start[2]+8.0,"n7":start[2]+rel["back"]-0.3,"n8":start[3]+0.6}
ids=list(narr); 
for a,b in zip(ids,ids[1:]): assert narr[a]+dur[a] <= narr[b]+0.01, (a,b,narr[a]+dur[a],narr[b])
caps=[i for i in ids if i not in ("n1","n8")]
inp=["-i","../sora-intro.mp4","-loop","1","-t",str(d[0]),"-i","cards/title.png","-i","term.mp4","-i","web.mp4","-loop","1","-t",str(d[3]),"-i","cards/outro.png"]
for i in ids: inp+=["-i",f"narr/{i}.wav"]
capbase=5+len(ids)
for c in caps: inp+=["-loop","1","-t",str(total),"-i",f"cards/cap-{c}.png"]
V="fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p"
f=[]
f.append(f"[0:v]setpts=1.25*PTS,{V},tpad=stop_mode=clone:stop_duration=2,trim=duration={d[0]},setpts=PTS-STARTPTS[s0b]")
f.append(f"[1:v]format=rgba,fade=in:st=0.9:d=0.7:alpha=1[ttl]")
f.append(f"[s0b][ttl]overlay=0:0:shortest=1,format=yuv420p[s0]")
f.append(f"[2:v]{V},tpad=stop_mode=clone:stop_duration=1.2[s1]")
f.append(f"[3:v]{V}[s2]")
f.append(f"[4:v]{V}[s3]")
f.append(f"[s0][s1]xfade=transition=fade:duration={X}:offset={start[1]:.3f}[x1]")
f.append(f"[x1][s2]xfade=transition=fade:duration={X}:offset={start[2]:.3f}[x2]")
f.append(f"[x2][s3]xfade=transition=fade:duration={X}:offset={start[3]:.3f}[x3]")
last="x3"
for k,c in enumerate(caps):
    t0=narr[c]; t1=t0+dur[c]+0.15
    f.append(f"[{capbase+k}:v]format=rgba,fade=in:st={t0:.2f}:d=0.15:alpha=1,fade=out:st={t1-0.15:.2f}:d=0.15:alpha=1[c{k}]")
    f.append(f"[{last}][c{k}]overlay=0:0:enable='between(t,{t0:.2f},{t1:.2f})'[v{k}]"); last=f"v{k}"
f.append(f"[{last}]fade=in:st=0:d=0.4,fade=out:st={total-0.6:.2f}:d=0.6[vout]")
f.append(f"[0:a]atempo=0.8,volume=0.35,afade=out:st=4.2:d=1.8,aresample=48000,aformat=channel_layouts=stereo[amb]")
mix=["[amb]"]
for k,i in enumerate(ids):
    ms=int(narr[i]*1000); f.append(f"[{5+k}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[a{k}]"); mix.append(f"[a{k}]")
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad,atrim=duration={total:.3f},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[aout]")
cmd=["ffmpeg","-loglevel","error","-y",*inp,"-filter_complex",";".join(f),"-map","[vout]","-map","[aout]","-c:v","libx264","-preset","slow","-crf","18","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart","-t",f"{total:.3f}","keelson-first-workflow.mp4"]
print("total",round(total,2),"scene starts",[round(x,2) for x in start]); print({k:round(v,2) for k,v in narr.items()})
subprocess.run(cmd,check=True)
