# T1 — Set, change and clear a click goal

Intent: intent/click-goal.md · Depends on: none · Blocks: T2, T3

## User story

As a user, I want to set a target number of clicks so that I have something to work toward.

## Acceptance criteria

- AC1: Given no goal is set, When the page loads,
  Then I see a goal input and a "Set goal" button, and no progress bar or "Clear goal" button.
- AC2: Given no goal is set, When I enter 10 and press "Set goal",
  Then the goal is 10 and a "Clear goal" button appears.
- AC3: Given the goal is 10, When I enter 20 and press "Set goal",
  Then the goal becomes 20.
- AC4: Given the goal is 10, When I submit any of: empty, 0, -5, 2.5, 1000, "abc",
  Then an error "Enter a whole number from 1 to 999" shows next to the input
  and the goal stays 10.
- AC5: Given no goal, When I submit 1 or 999, Then the goal is accepted.
- AC6: Given an error is showing, When I submit a valid goal,
  Then the error disappears.
- AC7: Given the goal is 10, When I press "Clear goal",
  Then the app returns to the no-goal state (AC1).

## Scope / Non-scope

- In: goal input, Set goal, Clear goal, validation and error message.
- Out: progress display (T2), congratulation (T3), saving across reloads,
  click history list, pie chart.

## Open questions

- Error message wording → BA decided in spec: "Enter a whole number from 1 to 999" → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
