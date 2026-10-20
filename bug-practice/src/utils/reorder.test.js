import { test, expect } from "vitest";
import { reorder } from "./reorder";

const list = ["a", "b", "c", "d"];

test("moves an item forward", () => {
  expect(reorder(list, 0, 2)).toEqual(["b", "c", "a", "d"]);
});

test("moves an item backward", () => {
  expect(reorder(list, 3, 1)).toEqual(["a", "d", "b", "c"]);
});

test("returns the same list when indexes are equal", () => {
  expect(reorder(list, 1, 1)).toBe(list);
});

test("returns the same list when an index is out of range", () => {
  expect(reorder(list, -1, 2)).toBe(list);
  expect(reorder(list, 0, 4)).toBe(list);
});

test("does not mutate the input list", () => {
  const input = [...list];
  reorder(input, 0, 3);
  expect(input).toEqual(list);
});
