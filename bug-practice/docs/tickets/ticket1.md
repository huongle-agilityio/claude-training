# T1 — Set, change and clear a click goal

Intent: .claude/intent/click-goal.md · Depends on: none · Blocks: T2, T3
T1 can ship on its own: it shows the current goal as "Goal: N" until T2 replaces that text.

## User story

As a user, I want to set a target number of clicks so that I have something to work toward.

## Acceptance criteria

- AC1: Given no goal is set, When the page loads,
  Then I see the label "Your goal", an empty input with placeholder "1–999" and a "Set goal" button,
  and no "Goal: N" text, no progress bar and no "Clear goal" button.
- AC2: Given no goal is set, When I enter 10 and press "Set goal",
  Then the text "Goal: 10" appears and a "Clear goal" button appears.
- AC3: Given the goal is 10, When I enter 20 and press "Set goal",
  Then the text changes to "Goal: 20".
- AC4: Given the goal is 10, When I submit any of: empty, 0, -5, 2.5, 1000, "abc",
  Then the error "Enter a whole number from 1 to 999" shows directly under the input,
  and "Goal: 10" is still shown.
- AC5: Given no goal, When I submit 1 or 999, Then "Goal: 1" / "Goal: 999" is shown.
- AC6: Given an error is showing, When I submit a valid goal,
  Then the error disappears.
- AC7: Given the goal is 10, When I press "Clear goal",
  Then there is no goal: no "Goal: N" text, no progress bar, no "Clear goal" button,
  the input is empty, no error is shown, and keyboard focus moves to the goal input.
  The counter value does not change.
- AC8: Input rules. The input is a text field with inputmode="numeric".
  Spaces at both ends are ignored; after that the value must be digits only, from 1 to 999.
  " 10 ", "010" and "0010" are accepted as 10. "+5", "1e2" and "10.0" are rejected with the AC4 error.
- AC9: Given a valid value in the input, When I press Enter,
  Then it behaves exactly like pressing "Set goal".
- AC10: Given I submit a goal, valid or invalid, Then the input keeps the text I entered.
- AC11: Given the goal is 10 and the count is 3, When I switch to the History tab and back,
  Then "Goal: 10" is still shown and the count is still 3. The input shows "10" and no error is shown.
- AC12: Given an error is showing, Then the input has aria-invalid="true" and
  aria-describedby pointing to the error, and the error has role="alert" so it is announced.
  When there is no error, neither aria-invalid nor aria-describedby is set.
- AC13: Given an error is showing, When I type in the input or press Reset,
  Then the error stays. Only a valid submit (AC6) or "Clear goal" (AC7) removes it.

## Technical notes (agreed in zero-questions rounds 1 and 3)

- The goal value lives in HomePage next to the counter state, so it is kept or lost together with the count.
  Reset changes only the count, never the goal.
- The input text and the error live inside `GoalPanel`. When the panel remounts (tab switch),
  the input is filled with the current goal (empty if none) and there is no error (AC11).
- `GoalPanel` shows only on the Counter tab, placed right after the existing click message
  and before `SantaRun`. The existing counter UI is not restyled or moved.
- Use the app's existing theme (light and dark). Add an `--error` color token in index.css
  for light and dark, at least 4.5:1 contrast on its background. The spec canvas is a layout
  sketch only; its colors and two-column layout are not requirements.
- Required copy: label "Your goal", placeholder "1–999", button "Set goal", button "Clear goal",
  text "Goal: N", error "Enter a whole number from 1 to 999".
- No new form styling: reuse the existing `.counter` button style like `GreetingForm`; add only `--error` and an error-text rule.
- Dev choices accepted: validator in `src/utils/goal.js` (returns the number or null);
  `<form noValidate>` for Enter, like `GreetingForm`; unit tests in `src/utils/goal.test.js`,
  UI tests in `src/components/GoalPanel.test.jsx`, AC11 in `src/App.test.jsx`.

## Scope / Non-scope

- In: goal input, Set goal, Clear goal, "Goal: N" text, validation and error message.
- Out: progress display (T2), congratulation (T3), saving across reloads,
  click history list, pie chart. Fixing the stale counter-state note in CLAUDE.md is a separate chore.

## Open questions

- Error message wording → BA decided in spec: "Enter a whole number from 1 to 999" → answered
- Input value after Set / Clear, error after Clear → BA decided (QA round, 2026-10-29): see AC7, AC10 → answered
- Input type, accepted formats, Enter key → BA decided (QA round, 2026-10-29): see AC8, AC9 → answered
- Where the goal state lives, component name, tab switch, how closely to match the spec look
  → BA decided (dev round 1, 2026-10-29): see Technical notes, AC11 → answered
- How the goal is visible before T2, input/error on tab switch, panel position, label and
  placeholder, aria and focus, when the error clears, error color
  → BA decided (dev round 3, 2026-10-29): see AC1–AC5, AC7, AC10–AC13, Technical notes → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
