import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import App from "./App";
import { ROUTES } from "./constants/routes";

// T2 progress (docs/tickets/ticket2.md) is tested black-box through the app.
// "Fill" = aria-valuenow / aria-valuemax on the "Goal progress" progressbar (AC9).

const renderApp = () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.HOME]}>
      <App />
    </MemoryRouter>,
  );
  return userEvent.setup();
};

afterEach(cleanup);

const goalInput = () => screen.getByRole("textbox", { name: "Your goal" });
const goalPanel = () => goalInput().closest("form");
const countButton = () => screen.getByRole("button", { name: /count is/i });
const queryBar = () => screen.queryByRole("progressbar");
const queryProgressText = () => screen.queryByText(/^\d+ \/ \d+$/);

const setGoal = async (user, value) => {
  await user.clear(goalInput());
  await user.type(goalInput(), value);
  await user.click(screen.getByRole("button", { name: "Set goal" }));
};

const clickCount = async (user, times) => {
  for (let i = 0; i < times; i++) await user.click(countButton());
};

// Checks the visible "count / goal" text and every AC9 attribute of the bar.
const expectProgress = (count, goal) => {
  const text = `${count} / ${goal}`;
  const panel = goalPanel();
  expect(within(panel).getByText(text)).not.toBeNull();
  const bar = within(panel).getByRole("progressbar", { name: "Goal progress" });
  expect(bar.getAttribute("aria-valuemin")).toBe("0");
  expect(bar.getAttribute("aria-valuemax")).toBe(String(goal));
  expect(bar.getAttribute("aria-valuenow")).toBe(String(Math.min(count, goal)));
  expect(bar.getAttribute("aria-valuetext")).toBe(text);
  return bar;
};

const expectNoProgress = () => {
  expect(queryProgressText()).toBeNull();
  expect(queryBar()).toBeNull();
};

test("TC-17: goal 10 at count 0 shows '0 / 10' and an empty bar", async () => {
  const user = renderApp();

  await setGoal(user, "10");

  expectProgress(0, 10);
});

test("TC-18: 7 clicks toward goal 10 show '7 / 10' and a 70% bar", async () => {
  const user = renderApp();
  await setGoal(user, "10");

  await clickCount(user, 7);

  expectProgress(7, 10);
});

test("TC-20: 12 clicks past goal 10 show '12 / 10' and a full bar", async () => {
  const user = renderApp();
  await setGoal(user, "10");

  await clickCount(user, 12);

  const bar = expectProgress(12, 10);
  expect(bar.getAttribute("aria-valuenow")).toBe("10");
});

test("TC-22: Reset at 7 / 10 shows '0 / 10' and keeps the goal", async () => {
  const user = renderApp();
  await setGoal(user, "10");
  await clickCount(user, 7);

  await user.click(screen.getByRole("button", { name: "Reset" }));

  expectProgress(0, 10);
  expect(screen.getByRole("button", { name: "Clear goal" })).not.toBeNull();
});

test("TC-23: setting goal 10 at count 15 shows '15 / 10' and a full bar", async () => {
  const user = renderApp();
  await clickCount(user, 15);

  await setGoal(user, "10");

  const bar = expectProgress(15, 10);
  expect(bar.getAttribute("aria-valuenow")).toBe("10");
});

test("TC-24: the goal panel shows no percentage text at counts 0, 7 and 12", async () => {
  const user = renderApp();
  await setGoal(user, "10");

  for (const [clicks, count] of [
    [0, 0],
    [7, 7],
    [5, 12],
  ]) {
    await clickCount(user, clicks);
    expectProgress(count, 10);
    expect(goalPanel().textContent).not.toContain("%");
  }
});

test("TC-58: with goal 10 and count 3, '3 / 10' replaces 'Goal: 10'", async () => {
  const user = renderApp();
  await setGoal(user, "10");
  await clickCount(user, 3);

  expectProgress(3, 10);
  expect(screen.queryByText(/Goal: \d+/)).toBeNull();
});

test("TC-25: no goal means no progress text or bar (fresh, after Clear goal, after Reset)", async () => {
  const user = renderApp();
  expectNoProgress();

  await setGoal(user, "10");
  await clickCount(user, 3);
  expectProgress(3, 10);
  await user.click(screen.getByRole("button", { name: "Clear goal" }));
  expectNoProgress();

  await user.click(screen.getByRole("button", { name: "Reset" }));
  expectNoProgress();
});

test("TC-26: changing goal 10 to 20 at count 7 shows '7 / 20' and a 35% bar", async () => {
  const user = renderApp();
  await setGoal(user, "10");
  await clickCount(user, 7);
  expectProgress(7, 10);

  await setGoal(user, "20");

  expectProgress(7, 20);
});

test("TC-64: inside the goal panel the order is text → progressbar → 'Clear goal'", async () => {
  const user = renderApp();
  await setGoal(user, "10");
  await clickCount(user, 3);

  const panel = goalPanel();
  const text = within(panel).getByText("3 / 10");
  const bar = within(panel).getByRole("progressbar", { name: "Goal progress" });
  const clear = within(panel).getByRole("button", { name: "Clear goal" });
  const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;
  expect(text.compareDocumentPosition(bar) & FOLLOWING).toBeTruthy();
  expect(bar.compareDocumentPosition(clear) & FOLLOWING).toBeTruthy();
});

test("TC-65: the '3 / 10' text is not aria-hidden", async () => {
  const user = renderApp();
  await setGoal(user, "10");
  await clickCount(user, 3);

  const text = screen.getByText("3 / 10");
  expect(text.closest('[aria-hidden="true"]')).toBeNull();
});

test("TC-27: goal 1 goes from '0 / 1' (empty) to '1 / 1' (full) on one click", async () => {
  const user = renderApp();
  await setGoal(user, "1");
  expectProgress(0, 1);

  await clickCount(user, 1);

  expectProgress(1, 1);
});
