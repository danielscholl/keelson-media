#!/bin/bash
# Runs Claude Code headless against the demo Keelson over MCP and prints its tool calls and replies as they stream.
claude -p "$1" --mcp-config /Users/Shared/keelson-demo/mcp.json --strict-mcp-config \
  --allowedTools "mcp__keelson__*" --disallowedTools "Bash Read Glob Grep Edit Write" \
  --no-session-persistence --output-format stream-json --verbose 2>/dev/null |
jq --unbuffered -r '
  select(.type=="assistant") | .message.content[] |
  if .type=="tool_use" and (.name|startswith("mcp__keelson__")) then
    "\u001b[38;5;141m● keelson\u001b[0m \(.name|sub("mcp__keelson__";"")) \u001b[2m\(.input|tostring|.[0:70])\u001b[0m"
  elif .type=="text" then "\n\(.text)\n" else empty end'
