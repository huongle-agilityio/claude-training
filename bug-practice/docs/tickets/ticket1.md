# T1 — Set, change and clear a click goal

Intent: intent/click-goal.md · Depends on: none · Blocks: T2, T3

## User story

As a user, I want to set a target number of clicks so that I have something to work toward.

## Acceptance criteria

- AC1: Given no goal is set, When the page loads,
  Then I see an empty goal input and a "Set goal" button, and no progress bar,
  no "x / goal" text and no "Clear goal" button.
- AC2: Given no goal is set, When I enter 10 and press "Set goal",
  Then the goal is 10 and a "Clear goal" button appears.
- AC3: Given the goal is 10, When I enter 20 and press "Set goal",
  Then the goal becomes 20.
- AC4: Given the goal is 10, When I submit any of: empty, 0, -5, 2.5, 1000, "abc",
  Then the error "Enter a whole number from 1 to 999" shows directly under the input
  (linked to it with aria-describedby) and the goal stays 10.
- AC5: Given no goal, When I submit 1 or 999, Then the goal is accepted.
- AC6: Given an error is showing, When I submit a valid goal,
  Then the error disappears.
- AC7: Given the goal is 10, When I press "Clear goal",
  Then there is no goal: no progress bar, no "x / goal" text, no "Clear goal" button,
  the input is empty and no error is shown. The counter value does not change.
- AC8: Input rules. The input is a text field with inputmode="numeric".
  Spaces at both ends are ignored; after that the value must be digits only, from 1 to 999.
  " 10 " and "010" are accepted as 10. "+5", "1e2" and "10.0" are rejected with the AC4 error.
- AC9: Given a valid value in the input, When I press Enter,
  Then it behaves exactly like pressing "Set goal".
- AC10: Given I set a goal successfully, Then the input keeps the value I entered.

## Scope / Non-scope

- In: goal input, Set goal, Clear goal, validation and error message.
- Out: progress display (T2), congratulation (T3), saving across reloads,
  click history list, pie chart.

## Open questions

- Error message wording → BA decided in spec: "Enter a whole number from 1 to 999" → answered
- Input value after Set / Clear, error after Clear → BA decided (QA round, 2026-10-29): see AC7, AC10 → answered
- Input type, accepted formats, Enter key → BA decided (QA round, 2026-10-29): see AC8, AC9 → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
