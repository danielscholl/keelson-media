#!/usr/bin/env bash
# Builds the generic opener and closer from the Sora intros. Run from videos/assets/bookends.
set -euo pipefail
I=../intros; V="fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p"
# Opener 8.1s: the blueprint draws itself in full (slowed 1.2x), then holds on the finished drawing so the eye can settle before the demo.
ffmpeg -loglevel error -y -i $I/sora-blueprint-draws-4s.mp4 -loop 1 -t 8.1 -i cards/open-title.png -filter_complex "
[0:v]setpts=1.2*PTS,$V,tpad=stop_mode=clone:stop_duration=3.5,trim=duration=8.1[a];
[1:v]format=rgba,fade=in:st=0.5:d=0.6:alpha=1[t];
[a][t]overlay=0:0:shortest=1,format=yuv420p[v];
[0:a]atempo=0.8333,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=duration=8.1,afade=in:d=0.4,afade=out:st=5.6:d=2.5[au]" \
  -map "[v]" -map "[au]" -t 8.1 -c:v libx264 -crf 16 -preset slow -c:a aac -b:a 192k open-lay-the-keel.mp4
# Closer 8.2s: the real hull at dawn, slowed, end card fades in over a navy scrim.
ffmpeg -loglevel error -y -i $I/sora-shipyard-dawn-4s.mp4 -loop 1 -t 8.2 -i cards/close-card.png -filter_complex "
[0:v]setpts=1.6*PTS,$V,tpad=stop_mode=clone:stop_duration=2,trim=duration=8.2[b];
[1:v]format=rgba,fade=in:st=0.6:d=0.9:alpha=1[t];[b][t]overlay=0:0:shortest=1,format=yuv420p[v];
[0:a]atempo=0.625,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=duration=8.2,afade=out:st=6.4:d=1.8[au]" \
  -map "[v]" -map "[au]" -t 8.2 -c:v libx264 -crf 16 -preset slow -c:a aac -b:a 192k close-raise-the-ribs.mp4
