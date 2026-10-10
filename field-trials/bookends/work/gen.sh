#!/usr/bin/env bash
# Sequential Sora generation; usage: gen.sh NAME... (NAME like A-open or A-open.v2)
cd "$(dirname "$0")/.."
for n in "$@"; do
  base=${n%.v2}; take=1; [ "$n" != "$base" ] && take=2
  out=takes/${base}-${take}.mp4
  [ -f "$out" ] && { echo "skip $out"; continue; }
  echo "$(date +%T) start $n -> $out"
  python3 ../../tools/sora.py prompts/$n.txt "$out" --seconds 4 2>&1 | grep -v -i key || true
  [ -f "$out" ] && echo "$(date +%T) done $out" || echo "$(date +%T) FAILED $n"
done
echo ALLDONE
