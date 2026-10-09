#!/bin/bash
# Stands in for the browser on the terminal re-take: approves the gate a few seconds after the run pauses.
until id=$(curl -s 'http://127.0.0.1:7979/api/workflows/runs?limit=1' | jq -er '.runs[0] | select(.workflowName=="cut-a-short" and .status=="paused") | .runId'); do sleep 2; done
sleep 14
KEELSON_SERVER_URL=http://127.0.0.1:7979 /Users/Shared/keelson-demo/bin/keelson workflow respond "$id" gate approve
