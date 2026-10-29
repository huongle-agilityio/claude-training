# T2 — Show progress toward the goal

Intent: intent/click-goal.md · Depends on: T1

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
- AC9: The bar is exposed for tests and screen readers as role="progressbar" with
  aria-valuemin="0", aria-valuemax = goal and aria-valuenow = min(count, goal).
  "Filled" in AC1–AC5 and AC8 means aria-valuenow / aria-valuemax
  (e.g. AC2: aria-valuenow="7", aria-valuemax="10"; AC3: aria-valuenow="10").

## Scope / Non-scope

- In: "x / goal" text, progress bar, updates on click, reset and goal change.
- Out: congratulation (T3), percentage text, saving across reloads,
  click history list, pie chart.

## Open questions

- How bar fill is checked by automated tests → BA decided (QA round, 2026-10-29): see AC9 → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
