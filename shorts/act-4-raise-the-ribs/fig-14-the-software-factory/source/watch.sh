#!/bin/bash
# Every five minutes while the factory runs, takes a short capture of the swarm card and the beads board.
S="$(cd "$(dirname "$0")/.." && pwd)"; cd "$S/raw"; n=0
status() { curl -s -X POST http://127.0.0.1:7979/api/mcp -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"chat_swarm_status","arguments":{}}}' | jq -r '.result.content[0].text' | jq -r '.[] | select(.id=="ss6x5") | .status'; }
while true; do
  st=$(status); echo "$(date +%H:%M:%S) $n $st"
  node ../source/rec-watch.mjs watch-$n-swarm swarm >/dev/null 2>&1
  node ../source/rec-watch.mjs watch-$n-beads beads >/dev/null 2>&1
  n=$((n+1))
  [ "$st" != "running" ] && break
  sleep 300
done
echo done
