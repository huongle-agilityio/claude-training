import { test, expect } from "vitest";
import { parseGoal } from "./goal";

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
