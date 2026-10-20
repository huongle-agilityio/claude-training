import {
  render,
  screen,
  act,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi, afterEach } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

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

test("Reset button is disabled when count is 0", () => {
  render(<App />);
  const reset = screen.getByRole("button", { name: /reset/i });
  expect(reset.disabled).toBe(true);
});

test("Clicking Reset sets count back to 0", async () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /count is/i });
  const reset = screen.getByRole("button", { name: /reset/i });

  await userEvent.click(button);
  await userEvent.click(button);
  expect(button.textContent).toMatch("Count is 2");
  expect(reset.disabled).toBe(false);

  await userEvent.click(reset);
  expect(button.textContent).toMatch("Count is 0");
  expect(reset.disabled).toBe(true);
});

test("Clicking Reset hides the click message", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime.bind(vi),
  });

  render(<App />);

  await user.click(screen.getByRole("button", { name: /count is/i }));
  await act(async () => {
    vi.advanceTimersByTime(2000);
  });
  expect(screen.queryByText(/you clicked/i)).not.toBeNull();

  await user.click(screen.getByRole("button", { name: /reset/i }));
  expect(screen.queryByText(/you clicked/i)).toBeNull();

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
