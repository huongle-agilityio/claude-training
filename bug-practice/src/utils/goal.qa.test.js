import { test, expect } from "vitest";
import { parseGoal } from "./goal";

// T1 AC4, AC5, AC8 (test matrix TC-10): parseGoal returns the number or null.

test.each([
  ["1", 1],
  ["999", 999],
  ["10", 10],
  [" 10 ", 10],
  ["010", 10],
  ["0010", 10],
])("TC-T1-10: parseGoal accepts %j as %i", (input, expected) => {
  expect(parseGoal(input)).toBe(expected);
});

test.each(["", "0", "-5", "2.5", "1000", "abc", "+5", "1e2", "10.0"])(
  "TC-T1-10: parseGoal rejects %j with null",
  (input) => {
    expect(parseGoal(input)).toBeNull();
  },
);

test.each(["   ", "1 0", " 1 0 "])(
  "TC-T1-62: parseGoal trims only the ends, so %j is null",
  (input) => {
    expect(parseGoal(input)).toBeNull();
  },
);
