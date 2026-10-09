#!/bin/bash
# Records the browser Runs view and the Claude Code terminal at the same time, logging both start times.
S="$(cd "$(dirname "$0")/.." && pwd)"
cd "$S/raw"
node ../source/rec.mjs web > rec.log 2>&1 &
REC=$!
sleep 5
date +%s.%N > vhs-start.txt
(cd ../source && vhs cc.tape > ../raw/vhs-cc.log 2>&1)
wait $REC
cat rec.log
