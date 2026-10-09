#!/usr/bin/env bash
# Usage: tools/publish.sh <short-dir>
# Writes media/fig-NN/ (web mp4, poster, card thumbnail, captions) from a short's final cut, for Pages to serve.
set -euo pipefail
d="${1%/}"
fig=$(sed -n 's/^fig: *"\{0,1\}\([0-9]*\)"\{0,1\}.*/\1/p' "$d/short.yaml" | head -1)
out="$(dirname "$0")/../media/fig-$fig"
mkdir -p "$out"
ffmpeg -nostdin -loglevel error -y -i "$d/final.mp4" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart "$out/fig-$fig.mp4"
ffmpeg -nostdin -loglevel error -y -ss 6 -i "$d/final.mp4" -frames:v 1 -vf scale=1280:-1 -q:v 3 "$out/poster.jpg"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/fig-$fig.mp4")
ffmpeg -nostdin -loglevel error -y -ss "$(python3 -c "print(round($dur * 0.42, 2))")" -i "$out/fig-$fig.mp4" -frames:v 1 \
  -vf scale=640:-1 -q:v 4 "$out/thumb.jpg"
[ -f "$d/final.srt" ] && ffmpeg -nostdin -loglevel error -y -i "$d/final.srt" "$out/captions.vtt"
echo "media/fig-$fig: $(du -h "$out/fig-$fig.mp4" | cut -f1)"
