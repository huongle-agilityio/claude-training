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
- AC6: Given any goal, Then no percentage text is shown.
- AC7: Given no goal is set, Then no progress text or bar is shown.

## Scope / Non-scope

- In: "x / goal" text, progress bar, updates on click, reset and goal change.
- Out: congratulation (T3), percentage text, saving across reloads,
  click history list, pie chart.

## Open questions

- None.

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
