#!/bin/bash
# Records the fix-issue run: vhs terminal in the background, browser approval once the run pauses.
S="$(cd "$(dirname "$0")/.." && pwd)"
cd "$S/source"
vhs fix.tape > ../raw/vhs-fix.log 2>&1 &
VHS=$!
until curl -s http://127.0.0.1:7979/api/workflows/runs | jq -e '.runs[] | select(.workflowName=="fix-issue" and .status=="paused")' >/dev/null; do sleep 5; done
echo "paused at $(date)"
cd ../raw && node ../source/rec-gate.mjs gate
echo "approved at $(date)"
wait $VHS
echo "vhs done at $(date)"
