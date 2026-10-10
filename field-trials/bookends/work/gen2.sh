#!/usr/bin/env bash
# Pass 2 sequential Sora jobs; usage: gen2.sh "PROMPT|OUT|EXTRA ARGS" ...
cd "$(dirname "$0")/.."
for spec in "$@"; do
  IFS='|' read -r name out args <<<"$spec"
  [ -f "$out" ] && { echo "skip $out"; continue; }
  echo "$(date +%T) start $name -> $out"
  python3 ../../tools/sora.py "prompts/$name.txt" "$out" $args 2>&1 | grep -v -i key || true
  [ -f "$out" ] && echo "$(date +%T) done $out" || echo "$(date +%T) FAILED $name"
done
echo ALLDONE
