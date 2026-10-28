import { test, expect } from "vitest";
import { buildGradient, formatPercent, toPercents } from "./pieChart";

test("builds consecutive gradient stops from slice values", () => {
  const slices = [
    { value: 1, color: "red" },
    { value: 3, color: "blue" },
  ];

  expect(buildGradient(slices, 4)).toBe(
    "conic-gradient(red 0% 25%, blue 25% 100%)",
  );
});

test("rounds three equal slices so they still add up to 100", () => {
  expect(toPercents([1, 1, 1], 3)).toEqual([34, 33, 33]);
});

test("rounds six equal slices so they still add up to 100", () => {
  const percents = toPercents([1, 1, 1, 1, 1, 1], 6);

  expect(percents.reduce((sum, percent) => sum + percent, 0)).toBe(100);
});

test("keeps exact percents unchanged", () => {
  expect(toPercents([25, 40, 20, 15], 100)).toEqual([25, 40, 20, 15]);
});

test("shows a tiny non-zero slice as <1% instead of 0%", () => {
  expect(toPercents([1, 400], 401).map(formatPercent)).toEqual([
    "<1%",
    "100%",
  ]);
});
