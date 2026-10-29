# Zero-questions log — Click goal (T1–T3)

Goal: a developer can implement each ticket without asking anything.
Every question asked = a gap in the tickets; fix the ticket, then run again in a fresh session.

| Round | Date       | Who (fresh session)          | Input given            | Questions                                     | Gaps fixed in                                                           |
| ----- | ---------- | ---------------------------- | ---------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| 0     | 2026-10-29 | QA (Claude, test matrix)     | T1–T3 only             | 8 questions + 8 "untestable as written" notes | T1 AC4, AC7–AC10 · T2 AC6, AC8–AC9 · T3 Message rule, AC1–AC4, AC7–AC12 |
| 1     |            | Dev (Claude Code, plan mode) | one ticket + spec link |                                               |                                                                         |

## Round 0 — QA questions and BA decisions

1. Reset while the message is showing → hide immediately (T3 AC7).
2. Goal changed while showing → higher goal hides it; goal ≤ count keeps it and restarts 3 s (T3 AC8, AC9).
3. Clear goal while showing → hide immediately (T3 AC10).
4. Setting a goal ≤ count when a goal already exists → message shows (T3 AC4).
5. Clicks while showing → timer does not restart (T3 AC11).
6. Input after Set keeps its value; Clear empties the input and the error (T1 AC7, AC10).
7. Text input with inputmode="numeric"; trim spaces, digits only, 1–999; Enter submits (T1 AC8, AC9).
8. Bar exposed as role="progressbar" with aria-valuenow = min(count, goal); manual timing 3 s ± 0.5 s (T2 AC9, T3 AC2).
