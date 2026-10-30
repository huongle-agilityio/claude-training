import { test, expect } from "vitest";
import { getProgress, parseGoal } from "./goal";

test.each([
  ["1", 1],
  ["999", 999],
  ["10", 10],
  [" 10 ", 10],
  ["010", 10],
  ["0010", 10],
])("accepts %j as %i", (input, expected) => {
  expect(parseGoal(input)).toBe(expected);
});

test.each(["", "   ", "0", "-5", "2.5", "1000", "abc", "+5", "1e2", "10.0"])(
  "rejects %j",
  (input) => {
    expect(parseGoal(input)).toBeNull();
  },
);

test.each([
  [0, 10, 0],
  [7, 10, 0.7],
  [10, 10, 1],
  [12, 10, 1],
  [15, 10, 1],
  [999, 999, 1],
])("getProgress(%i, %i) returns %s, never above 1", (count, goal, expected) => {
  expect(getProgress(count, goal)).toBe(expected);
});
