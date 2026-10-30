import { test, expect } from "vitest";
import { getProgress } from "./goal";

// T2 AC2, AC3 (test matrix TC-19): getProgress(count, goal) returns 0–1, capped at 1.

test.each([
  [0, 10, 0],
  [7, 10, 0.7],
  [10, 10, 1],
  [12, 10, 1],
  [15, 10, 1],
  [999, 999, 1],
])("TC-19: getProgress(%i, %i) is %d", (count, goal, expected) => {
  expect(getProgress(count, goal)).toBeCloseTo(expected);
  expect(getProgress(count, goal)).toBeLessThanOrEqual(1);
});
