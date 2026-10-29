# Intent: click goal

Author: Huong Le (from client brief, Day 12). Status: approved.
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
- Above the goal: show the real numbers (e.g. "12 / 10"); the bar stays full.
- Goal must be a whole number from 1 to 999.
  Invalid input (empty, 0, negative, decimals, > 999, non-numbers)
  -> error shown next to the input, previous goal kept.
- The goal can be changed at any time. Progress still uses the current total.
  If the new goal <= current clicks, it counts as reached immediately.
- No goal set: show only the goal input and a "Set goal" button, no progress bar.
- A "Clear goal" button removes the goal and returns to the no-goal state.
- Reset keeps the goal; progress goes back to "0 / goal".
- Congratulation message shows for 3 seconds, then hides by itself.
- It shows only at the moment the goal is reached: when a click reaches it,
  when a new goal is already reached on set, and again every time the goal
  is reached after a reset. Clicking past the goal does not show it again.

## Affected users and systems

- App users (the click counter page).
- Front-end only: counter state and a new goal UI.
- Existing Reset button sets the counter back to 0 (checked in code).
- Not affected: click history list, pie chart.

## Constraints / out of scope

- No persistence: goal and progress are lost on page reload (client: out of scope).
- No percentage display, no daily goals, no changes to history or pie chart.

## Open questions

- None. All rules confirmed by client (rounds 1–2, 2026-10-28).
