---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR, opening a pull request, or when the user asks to summarize branch changes for review.
allowed-tools: Bash(git log *), Bash(git diff *), Bash(git branch *), Read
---

When writing a PR description:

1. RUN `scripts/branch-summary.sh` (do not read it) to get the branch overview.
2. Run `git diff main...HEAD` for the full changes.
3. Only if the user asks for "a detailed PR" or "like the last one", read `references/good-pr-example.md` and match its style.
4. Write: ## What / ## Why / ## Changes / ## How tested.
   If the reason or repro steps are unknown, write "TODO" — do not guess.
