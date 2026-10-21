## What

Fix the counter button so each click increases the count and the message renders.

## Why

- Ticket: [TICKET-ID]
- Root cause: [example: click handler not update state so UI not re-render]
- Repro steps:
  1. Open the app
  2. Click the counter button
  3. Expected: count goes up and message shows. Actual: nothing happens

## Changes

- Added a failing unit test for the click behavior (commit 1: red)
- Fixed the click handler in [tên file] (commit 2: green)

## How tested

- New unit test fails before the fix and passes after
- Full test suite passes
- Manually clicked the button in the browser: count and message update

## Screenshots

| Before  | After   |
| ------- | ------- |
| [image] | [image] |
