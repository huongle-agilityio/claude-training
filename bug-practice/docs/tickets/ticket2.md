# T2 — Show progress toward the goal

Intent: .claude/intent/click-goal.md · Depends on: T1. Start after T1 is merged into main; branch from main.

## User story

As a user, I want to see how close I am to my goal so that I stay motivated.

## Acceptance criteria

- AC1: Given the goal is 10 and the count is 0,
  Then I see "0 / 10" and an empty progress bar.
- AC2: Given the goal is 10 and the count is 0, When I click 7 times,
  Then I see "7 / 10" and the bar is 70% filled.
- AC3: Given the goal is 10, When the count reaches 12,
  Then I see "12 / 10" and the bar is full without going past its frame.
- AC4: Given the goal is 10 and the count is 7, When I press Reset,
  Then I see "0 / 10" and an empty bar; the goal is still 10.
- AC5: Given no goal and the count is 15, When I set the goal to 10,
  Then I see "15 / 10" and a full bar.
- AC6: Given any goal, Then the goal panel shows no percentage text
  (the pie chart elsewhere on the page is not affected).
- AC7: Given no goal is set, Then no progress text or bar is shown.
- AC8: Given the goal is 10 and the count is 7, When I change the goal to 20,
  Then I see "7 / 20" and the bar is 35% filled.
- AC9: The bar is exposed for tests and screen readers as role="progressbar" named "Goal progress"
  (aria-label), with aria-valuemin="0", aria-valuemax = goal, aria-valuenow = min(count, goal)
  and aria-valuetext = the visible text (e.g. "7 / 10", "12 / 10"), so screen readers read the
  real numbers, never a percentage.
  "Filled" in AC1–AC5 and AC8 means aria-valuenow / aria-valuemax
  (e.g. AC2: aria-valuenow="7", aria-valuemax="10"; AC3: aria-valuenow="10").
- AC10: Given a goal is set, Then the "Goal: N" text from T1 is no longer shown;
  "x / goal" takes its place.

## Technical notes

- The progress display goes inside `GoalPanel` (from T1), above where T3's message will sit.
- The "x / goal" text replaces T1's "Goal: N" text; after T2 there is no "Goal: N" text.
- Use the app's existing theme (light and dark); the spec canvas is a layout sketch only.
- Colors: fill uses `--accent`, track uses `--accent-bg`. The fill color stays the same when the
  goal is reached (the celebration is T3's job). The fill must have at least 3:1 contrast against
  the track in light and dark (WCAG 1.4.11); if it doesn't, add `--progress-fill` / `--progress-track`
  tokens for both themes, like T1's `--error`.
- Order inside `GoalPanel`: label → input + "Set goal" → "x / goal" → bar → (T3 message) → "Clear goal".
  The progress block takes the place of T1's "Goal: N".
- Bar: 12 px tall, full width of the panel; if the panel has no width, use max-width 360px like `.history-screen`.
- No fill animation ("nothing fancy").
- Text: "7 / 10" as one text node with normal spaces, `--text-h`, tabular numbers.
- `GoalPanel` gets a new `count` prop from HomePage.
- T1 tests that check "Goal: N" are updated to check "x / goal" (AC10); never deleted.
- The visible "7 / 10" text stays readable by screen readers (no aria-hidden).
- Track: same rounded corners as the fill, no border.
- Contrast checked by dev: `--accent` on `--accent-bg` ≈ 3.8:1 light, 5.3:1 dark, so no new tokens needed.
- Dev choices accepted: `getProgress(count, goal)` returns 0–1 capped at 1, in `src/utils/goal.js`
  with tests in `goal.test.js`; CSS in `App.css` next to `.counter`; prop-only tests (AC1, AC3, AC6,
  AC7, AC9, AC10, TC-28) in `GoalPanel.test.jsx`, tests needing clicks, Reset or a goal change
  (AC2, AC4, AC5, AC8) in `App.test.jsx`.

## Scope / Non-scope

- In: "x / goal" text, progress bar, updates on click, reset and goal change.
- Out: congratulation (T3), percentage text, saving across reloads,
  click history list, pie chart.

## Open questions

- How bar fill is checked by automated tests → BA decided (QA round, 2026-10-29): see AC9 → answered
- Branch base, accessible name and valuetext, colors and contrast, order, size, animation,
  file locations → BA decided (dev round 4, 2026-10-29): see header, AC9, Technical notes → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
