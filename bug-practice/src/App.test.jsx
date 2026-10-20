import {
  render,
  screen,
  act,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import App from "./App";
import { ROUTES } from "./constants/routes";

const renderApp = (path = ROUTES.HOME) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test("Clicking the button increases count = 2 ", async () => {
  renderApp();
  const button = screen.getByRole("button", { name: /count is/i });
  await userEvent.click(button);
  await userEvent.click(button);
  expect(button.textContent).toMatch("Count is 2");
});

test("Clicking the button once shows message after 2 seconds", async () => {
  vi.useFakeTimers();

  renderApp();

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
  renderApp();
  const reset = screen.getByRole("button", { name: /reset/i });
  expect(reset.disabled).toBe(true);
});

test("Clicking Reset sets count back to 0", async () => {
  renderApp();
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

  renderApp();

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

  renderApp();

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

test("Go to Sortable List link opens the sortable page", async () => {
  renderApp();
  await userEvent.click(
    screen.getByRole("link", { name: /go to sortable list/i }),
  );
  expect(screen.getByRole("heading", { name: /sortable list/i })).not.toBeNull();
  expect(screen.queryByRole("button", { name: /count is/i })).toBeNull();
});

test("Back to Home link returns to the home page", async () => {
  renderApp(ROUTES.SORTABLE);
  await userEvent.click(screen.getByRole("link", { name: /back to home/i }));
  expect(screen.getByRole("button", { name: /count is/i })).not.toBeNull();
  expect(screen.queryByRole("heading", { name: /sortable list/i })).toBeNull();
});

test("Clicking the count button plays the santa animation", async () => {
  renderApp();
  expect(screen.queryByTestId("santa-run")).toBeNull();

  await userEvent.click(screen.getByRole("button", { name: /count is/i }));
  expect(screen.queryByTestId("santa-run")).not.toBeNull();
});
