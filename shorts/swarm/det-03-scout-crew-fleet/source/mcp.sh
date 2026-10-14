#!/bin/bash
# Usage: mcp.sh <tool> '<json args>' — calls a tool on the demo stage (7979) over MCP and prints its text.
curl -s -X POST http://127.0.0.1:7979/api/mcp -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' \
  -d "$(jq -nc --arg n "$1" --argjson a "${2:-{\}}" '{jsonrpc:"2.0",id:1,method:"tools/call",params:{name:$n,arguments:$a}}')" | jq -r '.result.content[0].text // .'
