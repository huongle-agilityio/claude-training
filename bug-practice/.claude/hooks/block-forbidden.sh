#!/bin/bash
# Read JSON from stdin, extract the command Claude intends to run.
# Blocks: rm with both recursive and force flags, git push --force / -f / +refspec,
# git reset --hard. This is a guardrail, not a sandbox: `find -delete`,
# scripts, etc. can still get past it.

# Fail closed: without jq we cannot read the command, so block everything
if ! command -v jq >/dev/null 2>&1; then
  echo "Blocked: jq is required by the block-forbidden hook." >&2
  exit 2
fi

cmd=$(jq -r '.tool_input.command // empty')

block() {
  printf "Blocked: '%s' Prohibited by team policy. Please ask the user first.\n" "$cmd" >&2
  exit 2
}

# Split into segments on ; & | ( ) ` " ' and newlines, then only look at the
# first word of each segment. This catches `bash -c "rm -rf x"` but not text
# like `git commit -m "avoid git reset --hard"`.
while IFS= read -r segment; do
  read -ra words <<< "$segment"

  # Skip prefixes that run the next word as a command
  while [[ ${#words[@]} -gt 0 && ${words[0]} =~ ^(sudo|env|exec|command|xargs)$ ]]; do
    words=("${words[@]:1}")
  done
  [[ ${#words[@]} -eq 0 ]] && continue

  case "${words[0]##*/}" in
    rm)
      recursive=0
      force=0
      for w in "${words[@]:1}"; do
        case "$w" in
          --recursive) recursive=1 ;;
          --force) force=1 ;;
          --*) ;;
          -*)
            [[ $w == *[rR]* ]] && recursive=1
            [[ $w == *f* ]] && force=1
            ;;
        esac
      done
      if (( recursive && force )); then block; fi
      ;;
    git)
      # Find the subcommand, skipping global options like `-C dir`
      i=1
      sub=""
      while (( i < ${#words[@]} )); do
        case "${words[i]}" in
          -C|-c) i=$((i + 2)) ;;
          -*) i=$((i + 1)) ;;
          *) sub=${words[i]}; break ;;
        esac
      done
      for w in "${words[@]:i+1}"; do
        case "$sub:$w" in
          push:--force*|push:+*) block ;;
          push:--*) ;;
          push:-*f*) block ;;
          reset:--hard) block ;;
        esac
      done
      ;;
  esac
done < <(printf '%s\n' "$cmd" | tr ";&|()\`\"'" '\n')

exit 0
