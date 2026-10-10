#!/usr/bin/env bash
# qa.sh takes/X.mp4 -> work/qa-X.png: 8 evenly spaced frames plus the last, 3x3
cd "$(dirname "$0")/.."
f=$1; n=$(basename "$f" .mp4); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
F=/Users/danielscholl/Library/Fonts/Inter-Regular.otf
rm -f work/_q*.png
for i in 0 1 2 3 4 5 6 7; do
  t=$(python3 -c "print(round($d*$i/8,2))")
  ffmpeg -loglevel error -y -ss $t -i "$f" -frames:v 1 -vf scale=426:-1 work/_q$i.png
  magick work/_q$i.png -font $F -fill white -undercolor '#0008' -pointsize 16 -annotate +4+16 " $t " work/_q$i.png
done
ffmpeg -loglevel error -y -sseof -0.3 -i "$f" -frames:v 1 -vf scale=426:-1 work/_q8.png
magick work/_q8.png -font $F -fill white -undercolor '#0008' -pointsize 16 -annotate +4+16 " end " work/_q8.png
magick montage -font $F work/_q[0-8].png -tile 3x3 -geometry +3+3 work/qa-$n.png
rm -f work/_q*.png
echo work/qa-$n.png
