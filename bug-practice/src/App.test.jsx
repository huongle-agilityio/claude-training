import { render, screen, act, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi, afterEach } from "vitest";
import App from "./App";

afterEach(cleanup);

test("Clicking the button increases count = 2 ", async () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /count is/i });
  await userEvent.click(button);
  await userEvent.click(button);
  expect(button.textContent).toMatch("Count is 2");
});

test("Clicking the button once shows message after 2 seconds", async () => {
  vi.useFakeTimers();

  render(<App />);

  const button = screen.getByRole("button", { name: /count is/i });

  await act(async () => {
    fireEvent.click(button);
  });

  await act(async () => {
    vi.advanceTimersByTime(2000);
  });

  // Expected: "You clicked 1 time" appears in DOM
  const message = screen.queryByText(/you clicked 1 time/i);
  expect(message).not.toBeNull();

  vi.useRealTimers();
});

test("Clicking the button twice shows message with plural 'times'", async () => {
  vi.useFakeTimers();

  render(<App />);

  const button = screen.getByRole("button", { name: /count is/i });

  await act(async () => {
    fireEvent.click(button);
    fireEvent.click(button);
  });

  await act(async () => {
    vi.advanceTimersByTime(2000);
  });

  // Expected: "You clicked 2 times" (plural) appears in DOM
  const message = screen.queryByText("You clicked 2 times");
  expect(message).not.toBeNull();

  vi.useRealTimers();
});
