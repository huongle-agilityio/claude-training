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

const submitGoal = async (text) => {
  const input = screen.getByLabelText("Your goal");
  await userEvent.clear(input);
  await userEvent.type(input, text);
  await userEvent.click(screen.getByRole("button", { name: "Set goal" }));
};

const clickCount = async (times) => {
  for (let i = 0; i < times; i++) {
    await userEvent.click(screen.getByRole("button", { name: /count is/i }));
  }
};

test("T1 AC7: Clear goal does not change the count", async () => {
  renderApp();
  await submitGoal("10");
  await clickCount(3);

  await userEvent.click(screen.getByRole("button", { name: "Clear goal" }));

  expect(screen.queryByText(/^\d+ \/ \d+$/)).toBeNull();
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(screen.getByRole("button", { name: /count is/i }).textContent).toBe(
    "Count is 3",
  );
});

test("T1 AC11: goal and count survive a tab switch; input shows the goal and no error", async () => {
  renderApp();
  await submitGoal("10");
  await clickCount(3);
  await submitGoal("abc");
  expect(screen.getByRole("alert")).not.toBeNull();

  await userEvent.click(screen.getByRole("button", { name: "History" }));
  await userEvent.click(screen.getByRole("button", { name: "Counter" }));

  expect(screen.getByText("3 / 10")).not.toBeNull();
  expect(screen.getByRole("button", { name: /count is/i }).textContent).toBe(
    "Count is 3",
  );
  expect(screen.getByLabelText("Your goal").value).toBe("10");
  expect(screen.queryByRole("alert")).toBeNull();
});

test("T1 AC13: Reset keeps the error and the goal", async () => {
  renderApp();
  await submitGoal("10");
  await clickCount(2);
  await submitGoal("0");

  await userEvent.click(screen.getByRole("button", { name: /reset/i }));

  expect(screen.getByRole("alert").textContent).toBe(
    "Enter a whole number from 1 to 999",
  );
  expect(screen.getByText("0 / 10")).not.toBeNull();
});

test("T1: goal panel sits after the click message and before SantaRun, Counter tab only", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime.bind(vi),
  });

  renderApp();
  await user.click(screen.getByRole("button", { name: /count is/i }));
  await act(async () => {
    vi.advanceTimersByTime(2000);
  });

  const panel = screen.getByLabelText("Your goal").closest("form");
  const message = screen.getByText(/you clicked 1 time/i);
  expect(
    message.compareDocumentPosition(panel) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(panel.nextElementSibling).toBe(screen.getByTestId("santa-run"));

  await user.click(screen.getByRole("button", { name: "History" }));
  expect(screen.queryByLabelText("Your goal")).toBeNull();
});

const getGoalBar = () =>
  screen.getByRole("progressbar", { name: "Goal progress" });

test("T2 AC2: 7 clicks with goal 10 show '7 / 10' and a 70% bar", async () => {
  renderApp();
  await submitGoal("10");

  await clickCount(7);

  expect(screen.getByText("7 / 10")).not.toBeNull();
  expect(getGoalBar().getAttribute("aria-valuenow")).toBe("7");
  expect(getGoalBar().getAttribute("aria-valuemax")).toBe("10");
});

test("T2 AC4: Reset at 7 / 10 shows '0 / 10', empty bar, goal kept", async () => {
  renderApp();
  await submitGoal("10");
  await clickCount(7);

  await userEvent.click(screen.getByRole("button", { name: /reset/i }));

  expect(screen.getByText("0 / 10")).not.toBeNull();
  expect(getGoalBar().getAttribute("aria-valuenow")).toBe("0");
  expect(getGoalBar().getAttribute("aria-valuemax")).toBe("10");
  expect(screen.getByRole("button", { name: "Clear goal" })).not.toBeNull();
});

test("T2 AC5: setting goal 10 at count 15 shows '15 / 10' and a full bar", async () => {
  renderApp();
  await clickCount(15);

  await submitGoal("10");

  expect(screen.getByText("15 / 10")).not.toBeNull();
  expect(getGoalBar().getAttribute("aria-valuenow")).toBe("10");
  expect(getGoalBar().getAttribute("aria-valuemax")).toBe("10");
});

test("T2 AC7: no progress on load, after Clear goal, after Reset with no goal", async () => {
  const expectNoProgress = () => {
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText(/^\d+ \/ \d+$/)).toBeNull();
  };
  renderApp();
  expectNoProgress();

  await submitGoal("10");
  await clickCount(2);
  await userEvent.click(screen.getByRole("button", { name: "Clear goal" }));
  expectNoProgress();

  await userEvent.click(screen.getByRole("button", { name: /reset/i }));
  expectNoProgress();
});

test("T2 AC8: changing goal 10 → 20 at count 7 shows '7 / 20' and a 35% bar", async () => {
  renderApp();
  await submitGoal("10");
  await clickCount(7);

  await submitGoal("20");

  expect(screen.getByText("7 / 20")).not.toBeNull();
  expect(getGoalBar().getAttribute("aria-valuenow")).toBe("7");
  expect(getGoalBar().getAttribute("aria-valuemax")).toBe("20");
});
