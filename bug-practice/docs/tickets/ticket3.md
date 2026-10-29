# T3 — Congratulate when the goal is reached

Intent: intent/click-goal.md · Depends on: T1

## User story

As a user, I want a short congratulation when I hit my goal so that reaching it feels rewarding.

## Acceptance criteria

- AC1: Given the goal is 10 and the count is 9, When I click once,
  Then a congratulation message appears.
- AC2: Given the message is showing, When 3 seconds pass,
  Then the message disappears by itself.
- AC3: Given the goal is 10 and the count is 10 (message already shown),
  When I click again, Then the message does not appear again.
- AC4: Given no goal and the count is 15, When I set the goal to 10,
  Then the message appears immediately.
- AC5: Given the goal 10 was reached, When I press Reset and click 10 times,
  Then the message appears again.
- AC6: Given the goal is 10 and the count is 12, When I change the goal to 20
  and click until the count is 20, Then the message appears.

## Scope / Non-scope

- In: show the message at the moment the goal is reached, auto-hide after 3s.
- Out: sounds, animations, confetti ("nothing fancy"), saving across reloads,
  click history list, pie chart.

## Open questions

- Message text → BA decided in spec: "Goal reached!" with a check icon, no emoji → answered
- Where the message appears relative to the existing 2s click message (bottom-right)
  → BA decided in spec: inside the goal panel under the progress bar, so they never overlap → answered

## Spec

[Click Goal UI Spec](https://claude.ai/artifact/EvzfiuPLGFXzKWyxyo6jUb)
