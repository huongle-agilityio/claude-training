import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import App from "../App";
import { ROUTES } from "../constants/routes";

// T1 (docs/tickets/ticket1.md) is tested black-box through the app, using
// only the copy and roles named in the acceptance criteria.

const ERROR = "Enter a whole number from 1 to 999";

const renderApp = () => {
  render(
    <MemoryRouter initialEntries={[ROUTES.HOME]}>
      <App />
    </MemoryRouter>,
  );
  return userEvent.setup();
};

const goalInput = () => screen.getByRole("textbox", { name: "Your goal" });
const setGoalButton = () => screen.getByRole("button", { name: "Set goal" });
const queryClearGoal = () => screen.queryByRole("button", { name: "Clear goal" });
const countButton = () => screen.getByRole("button", { name: /count is/i });
const queryGoalText = () => screen.queryByText(/^\d+ \/ \d+$/);
const queryError = () => screen.queryByText(ERROR);

const submitGoal = async (user, value) => {
  await user.clear(goalInput());
  if (value !== "") await user.type(goalInput(), value);
  await user.click(setGoalButton());
};

const clickCount = async (user, times) => {
  for (let i = 0; i < times; i++) await user.click(countButton());
};

const expectNoGoal = () => {
  expect(queryGoalText()).toBeNull();
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(queryClearGoal()).toBeNull();
};

const expectErrorShown = () => {
  const error = screen.getByRole("alert");
  expect(error.textContent).toBe(ERROR);
  const input = goalInput();
  // "directly under the input": the error follows the input in document order
  expect(
    input.compareDocumentPosition(error) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  // When a goal exists, the error sits above the progress bar
  const bar = screen.queryByRole("progressbar");
  if (bar) {
    expect(
      error.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  }
  return error;
};

const expectNoError = () => {
  expect(queryError()).toBeNull();
  expect(goalInput().hasAttribute("aria-invalid")).toBe(false);
  expect(goalInput().hasAttribute("aria-describedby")).toBe(false);
};

afterEach(cleanup);

test("TC-T1-01: initial no-goal state shows the empty goal form only", () => {
  renderApp();

  expect(screen.getByText("Your goal")).not.toBeNull();
  const input = goalInput();
  expect(input.value).toBe("");
  expect(input.getAttribute("placeholder")).toBe("1–999");
  expect(setGoalButton()).not.toBeNull();
  expectNoGoal();
});

test("TC-T1-02: setting a valid goal shows '0 / 10' and 'Clear goal'", async () => {
  const user = renderApp();

  await submitGoal(user, "10");

  expect(screen.getByText("0 / 10")).not.toBeNull();
  expect(queryClearGoal()).not.toBeNull();
  expectNoError();
});

test("TC-T1-03: changing an existing goal updates the text", async () => {
  const user = renderApp();
  await submitGoal(user, "10");

  await submitGoal(user, "20");

  expect(screen.getByText("0 / 20")).not.toBeNull();
  expect(screen.queryByText("0 / 10")).toBeNull();
});

test("TC-T1-04: submitting empty shows an accessible error and keeps the goal", async () => {
  const user = renderApp();
  await submitGoal(user, "10");

  await submitGoal(user, "");

  const error = expectErrorShown();
  const input = goalInput();
  expect(input.getAttribute("aria-invalid")).toBe("true");
  const describedBy = input.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  expect(error.id).toBeTruthy();
  expect(describedBy.split(/\s+/)).toContain(error.id);
  expect(screen.getByText("0 / 10")).not.toBeNull();
});

test.each([
  ["TC-T1-05", "0"],
  ["TC-T1-06", "-5"],
  ["TC-T1-08", "1000"],
  ["TC-T1-09", "abc"],
  ["TC-62 (UI)", "   "],
])("%s: submitting %j shows the error and keeps '0 / 10'", async (_id, value) => {
  const user = renderApp();
  await submitGoal(user, "10");

  await submitGoal(user, value);

  expectErrorShown();
  expect(screen.getByText("0 / 10")).not.toBeNull();
});

test("TC-T1-07: submitting '2.5' shows the error, keeps the goal and the typed text", async () => {
  const user = renderApp();
  await submitGoal(user, "10");

  await submitGoal(user, "2.5");

  expectErrorShown();
  expect(screen.getByText("0 / 10")).not.toBeNull();
  expect(goalInput().value).toBe("2.5");
});

test("TC-T1-11: lower boundary 1 is accepted", async () => {
  const user = renderApp();

  await submitGoal(user, "1");

  expect(screen.getByText("0 / 1")).not.toBeNull();
  expect(queryError()).toBeNull();
  expect(queryClearGoal()).not.toBeNull();
});

test("TC-T1-12: upper boundary 999 is accepted", async () => {
  const user = renderApp();

  await submitGoal(user, "999");

  expect(screen.getByText("0 / 999")).not.toBeNull();
  expect(queryError()).toBeNull();
});

test("TC-T1-13: a valid submit clears the error", async () => {
  const user = renderApp();
  await submitGoal(user, "10");
  await submitGoal(user, "0");
  expectErrorShown();

  await submitGoal(user, "15");

  expectNoError();
  expect(screen.getByText("0 / 15")).not.toBeNull();
});

test("TC-T1-14: 'Clear goal' resets the goal, input and error, focuses the input, keeps the count", async () => {
  const user = renderApp();
  await submitGoal(user, "10");
  await clickCount(user, 3);
  await submitGoal(user, "0");
  expectErrorShown();

  await user.click(screen.getByRole("button", { name: "Clear goal" }));

  expectNoGoal();
  expect(goalInput().value).toBe("");
  expectNoError();
  expect(document.activeElement).toBe(goalInput());
  expect(countButton().textContent).toBe("Count is 3");
});

test("setting 5 after clearing goal 10 shows '0 / 5'", async () => {
  const user = renderApp();
  await submitGoal(user, "10");
  await user.click(screen.getByRole("button", { name: "Clear goal" }));

  await submitGoal(user, "5");

  expect(screen.getByText("0 / 5")).not.toBeNull();
  expect(screen.queryByText("0 / 10")).toBeNull();
  expectNoError();
});

test("TC-T1-15: an invalid submit with no goal shows the error and sets no goal", async () => {
  const user = renderApp();

  await submitGoal(user, "0");

  expectErrorShown();
  expect(queryGoalText()).toBeNull();
  expect(queryClearGoal()).toBeNull();
});

test("TC-T1-16: setting the same goal twice keeps a single goal", async () => {
  const user = renderApp();
  await submitGoal(user, "10");
  await clickCount(user, 3);

  await submitGoal(user, "10");

  expect(screen.getByText("3 / 10")).not.toBeNull();
  expect(queryError()).toBeNull();
  expect(screen.getAllByRole("button", { name: "Clear goal" })).toHaveLength(1);
});

test.each([" 10 ", "010", "0010"])(
  "TC-T1-47: %j is accepted as goal 10",
  async (value) => {
    const user = renderApp();

    await submitGoal(user, value);

    expect(screen.getByText("0 / 10")).not.toBeNull();
    expect(queryError()).toBeNull();
  },
);

test("TC-T1-48: '+5', '1e2' and '10.0' are rejected", async () => {
  const user = renderApp();
  await submitGoal(user, "10");

  for (const value of ["+5", "1e2", "10.0"]) {
    await submitGoal(user, value);
    expectErrorShown();
    expect(screen.getByText("0 / 10")).not.toBeNull();
  }
});

test("TC-T1-49: pressing Enter submits the goal", async () => {
  const user = renderApp();

  await user.type(goalInput(), "12{Enter}");

  expect(screen.getByText("0 / 12")).not.toBeNull();
});

test("pressing Enter on '0' shows the error and sets no goal", async () => {
  const user = renderApp();

  await user.type(goalInput(), "0{Enter}");

  expectErrorShown();
  expectNoGoal();
});

test("TC-T1-50: the input keeps its value after Set goal", async () => {
  const user = renderApp();

  await submitGoal(user, "10");

  expect(goalInput().value).toBe("10");
});

test("TC-T1-55: the error stays while typing and after Reset", async () => {
  const user = renderApp();
  await submitGoal(user, "10");
  await clickCount(user, 3);
  await submitGoal(user, "0");
  expectErrorShown();

  await user.type(goalInput(), "1");
  expectErrorShown();

  await user.click(screen.getByRole("button", { name: /reset/i }));
  expectErrorShown();
});

test("TC-T1-60: the goal input is a numeric text field", () => {
  renderApp();

  const input = goalInput();
  expect(input.type).toBe("text");
  expect(input.getAttribute("inputmode")).toBe("numeric");
});

test("TC-T1-61: no aria-invalid or aria-describedby while there is no error", async () => {
  const user = renderApp();
  expectNoError();

  await submitGoal(user, "10");
  expectNoError();

  await submitGoal(user, "0");
  expectErrorShown();
  await user.click(screen.getByRole("button", { name: "Clear goal" }));
  expectNoError();
});

test("TC-T1-63: Reset changes only the count, never the goal", async () => {
  const user = renderApp();
  await submitGoal(user, "10");
  await clickCount(user, 3);

  await user.click(screen.getByRole("button", { name: /reset/i }));

  expect(countButton().textContent).toBe("Count is 0");
  expect(screen.getByText("0 / 10")).not.toBeNull();
  expect(queryClearGoal()).not.toBeNull();
});
