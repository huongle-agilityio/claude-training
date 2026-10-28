# Intent: click goal

Author: Huong Le (from client brief, Day 12). Status: ready for review.
Source: client brief + Q&A rounds 1–2 (2026-10-28).

## Problem

Users click the counter but have no sense of what they are working toward.
The client wants it to "feel motivating", nothing fancy.

## Proposed outcome

Users can set a target number of clicks, see how close they are,
and get a short congratulation when they reach it.

## Rules (confirmed by client)

- Progress = the counter's current total clicks. It does NOT restart when a goal is set.
- The goal is not tied to a day; it stays until the user changes it.
- After reaching the goal, counting continues; the goal stays the same.
- Progress shows as "x / goal" plus a progress bar. No percentage.
- Goal must be a whole number from 1 to 999.
  Invalid input -> error shown next to the input, previous goal kept.
- The goal can be changed at any time. Progress still uses the current total.
  If the new goal <= current clicks, it counts as reached immediately.
- Reset keeps the goal; progress goes back to "0 / goal".
- The congratulation shows again every time the goal is reached after a reset.

## Rules (proposed by us, waiting for client confirmation)

- Congratulation message shows for 3 seconds, then hides by itself.
- It shows only at the moment the goal is reached (including when a new goal
  is already reached on set). Clicking past the goal does not show it again.
- A "Clear goal" button removes the goal and returns to the no-goal state.
- No goal set: show only the goal input and a "Set goal" button, no progress bar.
- Above the goal: show the real numbers (e.g. "12 / 10"); the bar stays full.
- Invalid input covers: empty, 0, negative, decimals, > 999, non-numbers.

## Affected users and systems

- App users (the click counter page).
- Front-end only: counter state and a new goal UI.
- Existing Reset button sets the counter back to 0 (checked in code).
- Not affected: click history list, pie chart.

## Constraints / out of scope

- No persistence: goal and progress are lost on page reload (client: out of scope).
- No percentage display, no daily goals, no changes to history or pie chart.

## Open questions

- [ ] Client to confirm the proposed rules above.
