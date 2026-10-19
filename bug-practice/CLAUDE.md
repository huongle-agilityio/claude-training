# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A small React 19 + Vite app (scaffolded from the Vite React template) used for bug-fixing practice. Bugs are seeded into the app and fixed on `bugfix/*` / `practice/*` branches. The workflow followed in git history is: first commit a failing test that reproduces the bug (`test: ...`), then commit the fix (`fix: ...`).

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run lint      # ESLint (flat config, eslint.config.js)
npm run preview   # serve the built dist/

# Tests: there is no "test" script in package.json — call Vitest directly
npx vitest run                                   # all tests, once
npx vitest run src/components/ClickHistory.test.jsx   # one file
npx vitest run -t "shows message after 2 seconds"     # one test by name
npx vitest                                       # watch mode
```

Vitest is configured inside `vite.config.js` (`test: { environment: "jsdom" }`). Globals are not enabled, so tests import `test`/`expect`/`vi` from `vitest` explicitly and call `afterEach(cleanup)` themselves.

## Architecture

- `src/main.jsx` renders `App` inside `<StrictMode>` (effects and state initializers run twice in dev — relevant when debugging timer/state bugs).
- `src/App.jsx` holds the counter state and a `screen` state (`"counter"` | `"history"`) that switches between two tabs by conditional rendering. Switching tabs unmounts the other screen, so `ClickHistory`'s local state resets when you leave the History tab.
- `src/hooks/useClickMessage.js` — derives a "You clicked N time(s)" message from `count`, set via a 2-second debounced `setTimeout` that is cleared on every count change.
- `src/components/ClickHistory.jsx` — self-contained screen with its own `history` state of timestamps.
- Tests sit next to the code they cover (`*.test.jsx`) and use Testing Library + `user-event`. Timer-based behavior is tested with `vi.useFakeTimers()` plus `userEvent.setup({ advanceTimers: ... })`.

Plain JavaScript/JSX only (no TypeScript). ESLint enforces `react-hooks` and `react-refresh` rules.

## Conventions

- Create unit test and run after coding
- Each commit follow these structure "fix:...", "feature:...", "chore:..."
- Put components in src/components

## Never do

- Do not update any code in /dist or package.json manually
- Do not push direct to main branch
- Do not remove test failed to pass test
