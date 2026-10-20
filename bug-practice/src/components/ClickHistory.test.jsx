import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, afterEach } from "vitest";
import { ClickHistory } from "./ClickHistory";

afterEach(cleanup);

test("clicking Record Click once adds one entry to the history list", async () => {
  render(<ClickHistory />);

  // Before any click — empty state message shown, no list items
  expect(screen.getByText(/no clicks recorded yet/i)).not.toBeNull();

  const button = screen.getByRole("button", { name: /record click/i });
  await userEvent.click(button);

  // After one click — empty message gone, exactly 1 list item
  expect(screen.queryByText(/no clicks recorded yet/i)).toBeNull();
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
});

test("clicking Record Click twice adds two entries to the history list", async () => {
  render(<ClickHistory />);

  const button = screen.getByRole("button", { name: /record click/i });
  await userEvent.click(button);
  await userEvent.click(button);

  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
