#!/bin/bash
# Read JSON from stdin, extract the command Claude intends to run
cmd=$(jq -r '.tool_input.command')

# List of Forbidden Commands (regex)
if echo "$cmd" | grep -qE 'rm -rf|git push (-f|--force)|git reset --hard'; then
  echo "Blocked: '$cmd' Prohibited by team policy. Please ask the user first." >&2
  exit 2
fi

exit 0