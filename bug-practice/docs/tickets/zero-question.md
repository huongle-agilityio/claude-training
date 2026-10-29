# Zero-questions log — Click goal (T1–T3)

Goal: a developer can implement each ticket without asking anything.
Every question asked = a gap in the tickets; fix the ticket, then run again in a fresh session.

| Round | Date       | Who (fresh session)                         | Input given                                               | Questions                                                                       | Gaps fixed in                                                                                                             |
| ----- | ---------- | ------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 0     | 2026-10-29 | QA (Claude, test matrix)                    | T1–T3 only                                                | 8 questions + 8 "untestable as written" notes                                   | T1 AC4, AC7–AC10 · T2 AC6, AC8–AC9 · T3 Message rule, AC1–AC4, AC7–AC12                                                   |
| 1     | 2026-10-29 | Dev (Claude Code, plan mode)                | T3 (it also read T1, T2, intent, spec, test matrix, code) | 5 questions + 1 spec mismatch                                                   | T1 AC11, Technical notes · T2 Technical notes · T3 header, AC1, AC13, Technical notes · test matrix TC-29, 30, 41, 53, 54 |
| 2     | 2026-10-29 | Dev (Claude Code, plan mode, fresh session) | T3                                                        | **0 — ZERO QUESTIONS** (only the known blocker: T1 and T2 must be merged first) | —                                                                                                                         |
| 3     | 2026-10-29 | Dev (Claude Code, plan mode, fresh session) | T1                                                        | 3 blockers + 6 smaller gaps                                                     | T1 AC1–AC5, AC7, AC10–AC13, Technical notes · T2 AC10, notes · test matrix T1 rows, TC-55…TC-58                           |
| 3b    | 2026-10-29 | Dev (Claude Code, plan mode, fresh session) | T1                                                        | **0 — ZERO QUESTIONS** (4 stated assumptions, 2 doc path fixes)                 | T1 AC12, Technical notes · path fixes in all tickets and test matrix                                                      |
| 4     | 2026-10-29 | Dev (Claude Code, plan mode, fresh session) | T2                                                        | 3 blockers + 6 smaller gaps (with defaults)                                     | T2 header, AC9, Technical notes · test matrix TC-17, 18, 20, 59 · spec Reached/Above boards                               |
| 4b    | 2026-10-29 | Dev (Claude Code, plan mode, fresh session) | T2                                                        | **0 — ZERO QUESTIONS** (known blocker: T1 not merged yet; 4 stated assumptions) | T2 Technical notes                                                                                                        |

## Round 0 — QA questions and BA decisions

1. Reset while the message is showing → hide immediately (T3 AC7).
2. Goal changed while showing → higher goal hides it; goal ≤ count keeps it and restarts 3 s (T3 AC8, AC9).
3. Clear goal while showing → hide immediately (T3 AC10).
4. Setting a goal ≤ count when a goal already exists → message shows (T3 AC4).
5. Clicks while showing → timer does not restart (T3 AC11).
6. Input after Set keeps its value; Clear empties the input and the error (T1 AC7, AC10).
7. Text input with inputmode="numeric"; trim spaces, digits only, 1–999; Enter submits (T1 AC8, AC9).
8. Bar exposed as role="progressbar" with aria-valuenow = min(count, goal); manual timing 3 s ± 0.5 s (T2 AC9, T3 AC2).

## Round 1 — Dev questions (T3) and BA decisions

1. T1 and T2 are not built yet; where does goal state live, what is the panel called?
   → T3 waits for T1 and T2. Goal state lives next to the counter state (HomePage); new `GoalPanel` component (T1 notes, T3 header).
2. Switching to the History tab or another page while the message shows?
   → The goal lives as long as the count (T1 AC11). The message is dropped on a tab switch and does not reappear (T3 AC13).
3. Is the role="status" region always present? Restarted timer is not re-announced, OK?
   → Always present, empty when hidden. Not re-announcing is accepted (T3 AC1, notes; TC-29, TC-30).
4. Match the spec's exact colors and two-column layout?
   → No. Use the app's existing theme incl. dark mode; spec is a layout sketch; existing counter UI is not restyled (T1, T2, T3 notes).
5. The click message is inline under Reset in code, not bottom-right. Move it?
   → No. It stays where it is; the goal message is a separate element in the goal panel (T3 notes, TC-41).

- Spec mismatch: canvas drew the bar as role="img"; T2 AC9 requires role="progressbar" → spec updated.

Lesson: questions in round 1 were all about how the ticket fits the real code and design, not about behavior.
The QA round had already closed the behavior gaps.

## Round 3 — Dev questions (T1) and BA decisions

1. How is "goal is 10" visible if T1 ships alone? → T1 shows "Goal: N"; T2 replaces it with "x / goal" (T1 AC2, T2 AC10).
2. Do input text and error survive a tab switch? → No; they live in `GoalPanel`. On return the input shows the current goal and there is no error (T1 AC11).
3. Where exactly is `GoalPanel`? → Counter tab only, right after the click message, before `SantaRun`.
4. Label and placeholder required? → Yes: "Your goal", "1–999".
5. aria-invalid / announce the error? → Yes: aria-invalid="true" while the error shows, error has role="alert" (T1 AC12).
6. When does the error go away? → Only on a valid submit or Clear goal; typing and Reset keep it (T1 AC13).
7. Invalid text stays in the input? → Yes (T1 AC10).
8. Focus after Clear goal? → Moves to the goal input (T1 AC7).
9. Error color? → Add an `--error` token for light and dark, at least 4.5:1 contrast.

- Dev self-decisions (validator file, "0010" accepted, `<form noValidate>`, test files) accepted and written into the ticket.
- Stale CLAUDE.md note (counter state now in HomePage) → separate chore, not part of T1.

Lesson: splitting one feature into tickets that ship separately means each ticket must be checkable on its own;
T1 had no visible goal until T2, which the QA round missed.

## Round 3b — T1 zero questions

Assumptions the dev stated (accepted and written into T1): Reset never touches the goal; no error → no aria-describedby;
no new form styling (reuse `.counter`); invalid submit with no goal shows only the error.
Doc fixes: intent path is `.claude/intent/click-goal.md`; test matrix source points to `docs/tickets/ticketN.md`.
Plan saved for Day 13: branch `feature/click-goal-t1`, order goal.js → index.css → GoalPanel.jsx → HomePage.jsx, test per AC.

## Round 4 — Dev questions (T2) and BA decisions

1. Build on what? → Wait until T1 is merged into main, then branch from main (T2 header).
2. Screen reader reads a percentage → add aria-valuetext = visible text ("7 / 10", "12 / 10") and name "Goal progress" (T2 AC9).
3. Bar colors, change on reach, contrast → fill `--accent`, track `--accent-bg`, same color when reached; at least 3:1 fill vs track, else add progress tokens. Spec boards updated so the fill no longer turns green.
   4–9. Dev defaults accepted: order in panel, 12 px full-width bar (max 360px), no animation, `getProgress` in goal.js,
   CSS in App.css, test split between GoalPanel.test.jsx and App.test.jsx, "7 / 10" as one text node.

Lesson: the spec "is a layout sketch only", but a visible detail in it (green fill when reached) still raised a question.
A sketch should not show details we don't want built.

## Round 4b — T2 zero questions

Assumptions accepted and written into T2: `count` prop on `GoalPanel`; T1 "Goal: N" tests updated, not deleted;
visible text not hidden from screen readers; track has rounded corners only. Contrast already passes 3:1 with existing tokens.

## Result

All three tickets reached ZERO QUESTIONS.

| Ticket | Rounds              | Questions per round             |
| ------ | ------------------- | ------------------------------- |
| T3     | QA → dev 1 → dev 2  | 8 (shared QA round) → 5 → **0** |
| T1     | QA → dev 3 → dev 3b | 8 (shared QA round) → 9 → **0** |
| T2     | QA → dev 4 → dev 4b | 8 (shared QA round) → 9 → **0** |

Build order for Day 13: T1 → T2 → T3, each from main after the previous one is merged.
Plans saved by Claude Code in plan mode are ready to use.
