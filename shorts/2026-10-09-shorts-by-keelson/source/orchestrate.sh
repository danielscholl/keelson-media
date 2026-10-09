#!/bin/bash
# Records cut-a-short: the vhs tape edits FIG. 16 and launches the run; the browser follows it and approves at the gate.
S="$(cd "$(dirname "$0")/.." && pwd)"
cd "$S/source"
vhs main.tape > ../raw/vhs-main.log 2>&1 &
VHS=$!
cd ../raw && node ../source/rec.mjs web
echo "browser done at $(date)"
wait $VHS
echo "vhs done at $(date)"
