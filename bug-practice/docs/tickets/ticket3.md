# T3 — Congratulate when the goal is reached

Intent: intent/click-goal.md · Depends on: T1

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
  under the progress bar, and is announced to screen readers (role="status").
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

## Scope / Non-scope

- In: show the message when the goal becomes reached, hide it per the message rule.
- Out: sounds, animations, confetti ("nothing fancy"), saving across reloads,
  click history list, pie chart.

## Open questions

- Message text → BA decided in spec: "Goal reached!" with a check icon, no emoji → answered
- Where the message appears relative to the existing 2s click message (bottom-right)
  → BA decided in spec: inside the goal panel under the progress bar, so they never overlap → answered
- Message behavior on Reset / goal change / Clear goal / repeated Set goal / clicks while showing
  → BA decided (QA round, 2026-10-29): see Message rule, AC4, AC7–AC11 → answered
- Timing tolerance for manual testing → BA decided: 3 s ± 0.5 s → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
