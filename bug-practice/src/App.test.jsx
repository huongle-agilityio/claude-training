import { render, screen, act, cleanup } from "@testing-library/react";
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
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime.bind(vi),
  });

  render(<App />);

  const button = screen.getByRole("button", { name: /count is/i });
  await user.click(button);

  await act(async () => {
    vi.advanceTimersByTime(2000);
  });

  // Expected: "You clicked 1 time" appears in DOM
  const message = screen.queryByText(/you clicked 1 time/i);
  expect(message).not.toBeNull();

  vi.useRealTimers();
});
