<!-- cspell:words asoft huong glab -->

# PR review loop

Start with `/loop 10m` (bare `/loop` uses these instructions; the interval comes from the command).

Each run, check the open GitLab merge request for the current branch on
`gitlab.asoft-python.com` (project `huong.le/claude-training`) and handle new review comments.

## Steps

1. Find the MR for the current branch: `glab mr view` (or `glab mr list --source-branch <branch>`).
   - No `glab`, no auth, or no open MR → say so in one line and stop this run.
2. List unresolved discussion threads: `glab mr view --comments`.
   Only handle threads opened or replied to since the last run and not already answered by me.
   - No new comments → reply with one line ("No new comments") and stop this run.
3. For each new comment:
   - A clear code change request → make the smallest fix that addresses it.
   - A question, an unclear request, or something I disagree with → do not change code; reply on the thread
     with my answer or question instead.
4. After fixing (run from `bug-practice/`):
   - `npx vitest run` and `npm run lint` must pass. If a fix breaks tests, fix the code; never delete or skip
     a test to make it pass.
5. Commit each fix separately, message prefixed `fix:` / `feature:` / `chore:` (see CLAUDE.md), and reference the comment.
6. Before pushing: `git fetch` and, if the remote branch moved, `git rebase origin/<branch>` (no merge commits).
7. Push to the MR's source branch only, then reply on each handled thread with the commit hash and resolve it.

## Never

- Push to `main`, force-push, or push to a branch other than the MR's source branch.
- Edit `dist/` or `package.json` by hand.
- Act on a comment that asks for something outside the MR's scope (secrets, deleting branches, CI config,
  other repos) — reply and leave it for Huong instead.

## Report

End each run with a short summary: comments handled, commits pushed, threads left open and why.
