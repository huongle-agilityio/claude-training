# T3 — Congratulate when the goal is reached

Intent: .claude/intent/click-goal.md · Depends on: T1 and T2 (the message sits under T2's progress bar). Start after both are merged.

## User story

As a user, I want a short congratulation when I hit my goal so that reaching it feels rewarding.

## Message rule (applies to every AC below)

The message shows when the goal becomes reached: a click makes count = goal,
or a successful "Set goal" where goal ≤ count.
It hides after 3 seconds, or immediately when the goal is no longer reached
(Reset, a higher goal, Clear goal). Clicks while it is showing do not restart the timer.

## Acceptance criteria

- AC1: Given the goal is 10 and the count is 9, When I click once,
  Then the message "Goal reached!" with a check icon appears inside the goal panel,
  under the progress bar. It is rendered inside a role="status" region that is always
  present in the goal panel and empty while no message is showing, so screen readers announce it.
- AC2: Given the message is showing, When 3 seconds pass,
  Then the message disappears by itself (manual check: 3 s ± 0.5 s).
- AC3: Given the goal is 10, the count is 10 and the message has already hidden,
  When I click again, Then the message does not appear again.
- AC4: Given the count is 15, When I successfully set a goal of 15 or lower
  (with or without an existing goal, including setting the same goal again),
  Then the message appears immediately.
- AC5: Given the goal 10 was reached, When I press Reset and click 10 times,
  Then the message appears on the 10th click and not before.
- AC6: Given the goal is 10, the count is 12 and the message has hidden,
  When I change the goal to 20 and click until the count is 20,
  Then the message appears at 20 and not before.
- AC7: Given the message is showing, When I press Reset,
  Then the message hides immediately.
- AC8: Given the message is showing at count 10, When I set a goal above the count (e.g. 20),
  Then the message hides immediately.
- AC9: Given the message is showing at count 10, When I set a goal at or below the count (e.g. 5),
  Then the message stays and its 3-second timer starts again.
- AC10: Given the message is showing, When I press "Clear goal",
  Then the message hides immediately.
- AC11: Given the message is showing, When I click the counter,
  Then the timer does not restart; the message hides 3 s after it first appeared.
- AC12: Given an invalid goal is submitted, Then the message does not appear or change.
- AC13: Given the message is showing, When I switch to the History tab and back within 3 s,
  Then the message is gone and does not show again until the goal is reached again
  under the message rule.

## Technical notes (agreed in zero-questions round 1)

- The message is a new element inside `GoalPanel`, separate from the existing click message.
- The existing click message stays where it is today (inline under Reset, HomePage.jsx). Do not move it.
- When AC9 restarts the timer, the text does not change, so screen readers do not announce it again. Accepted.
- Use the app's existing theme (light and dark) for the message and check icon;
  the spec canvas colors are a sketch only.

## Scope / Non-scope

- In: show the message when the goal becomes reached, hide it per the message rule.
- Out: sounds, animations, confetti ("nothing fancy"), saving across reloads,
  click history list, pie chart.

## Open questions

- Message text → BA decided in spec: "Goal reached!" with a check icon, no emoji → answered
- Where the message appears relative to the existing 2s click message
  → BA decided: inside the goal panel under the progress bar; the click message stays inline
  under Reset (corrected in dev round 1: it is not bottom-right) → answered
- Dependency on T1/T2, tab switch, status region, look and theme
  → BA decided (dev round 1, 2026-10-29): see header, AC1, AC13, Technical notes → answered
- Message behavior on Reset / goal change / Clear goal / repeated Set goal / clicks while showing
  → BA decided (QA round, 2026-10-29): see Message rule, AC4, AC7–AC11 → answered
- Timing tolerance for manual testing → BA decided: 3 s ± 0.5 s → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
