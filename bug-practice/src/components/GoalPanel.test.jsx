import { useState } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, afterEach } from "vitest";
import { GoalPanel } from "./GoalPanel";

const ERROR_TEXT = "Enter a whole number from 1 to 999";

// GoalPanel only owns the input text and the error; the goal itself lives in
// the parent (HomePage), so the tests hold it in a small stateful wrapper.
const Harness = ({ initialGoal = null }) => {
  const [goal, setGoal] = useState(initialGoal);
  return (
    <GoalPanel
      goal={goal}
      onSetGoal={setGoal}
      onClearGoal={() => setGoal(null)}
    />
  );
};

const getInput = () => screen.getByLabelText("Your goal");
const queryGoalText = () => screen.queryByText(/^Goal: \d+$/);
const queryClearButton = () =>
  screen.queryByRole("button", { name: "Clear goal" });

const submit = async (text) => {
  await userEvent.clear(getInput());
  if (text) await userEvent.type(getInput(), text);
  await userEvent.click(screen.getByRole("button", { name: "Set goal" }));
};

afterEach(cleanup);

test("AC1: shows only the label, empty input and Set goal when no goal is set", () => {
  render(<Harness />);

  const input = getInput();
  expect(input.value).toBe("");
  expect(input.getAttribute("placeholder")).toBe("1–999");
  expect(screen.getByRole("button", { name: "Set goal" })).not.toBeNull();
  expect(queryGoalText()).toBeNull();
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(queryClearButton()).toBeNull();
});

test("AC2: setting a valid goal shows 'Goal: 10' and a Clear goal button", async () => {
  render(<Harness />);

  await submit("10");

  expect(screen.getByText("Goal: 10")).not.toBeNull();
  expect(queryClearButton()).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
});

test("AC3: changing the goal updates the text", async () => {
  render(<Harness initialGoal={10} />);

  await submit("20");

  expect(screen.getByText("Goal: 20")).not.toBeNull();
  expect(screen.queryByText("Goal: 10")).toBeNull();
});

test("AC3: submitting the same goal twice keeps a single Clear goal button", async () => {
  render(<Harness initialGoal={10} />);

  await submit("10");

  expect(screen.getByText("Goal: 10")).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getAllByRole("button", { name: "Clear goal" })).toHaveLength(1);
});

test.each(["", "0", "-5", "2.5", "1000", "abc"])(
  "AC4, AC12: rejects %j, shows the error and keeps 'Goal: 10'",
  async (value) => {
    render(<Harness initialGoal={10} />);

    await submit(value);

    const error = screen.getByRole("alert");
    expect(error.textContent).toBe(ERROR_TEXT);
    expect(getInput().getAttribute("aria-invalid")).toBe("true");
    expect(getInput().getAttribute("aria-describedby")).toBe(error.id);
    expect(screen.getByText("Goal: 10")).not.toBeNull();
  },
);

test("AC4: an invalid submit with no goal shows only the error", async () => {
  render(<Harness />);

  await submit("0");

  expect(screen.getByRole("alert").textContent).toBe(ERROR_TEXT);
  expect(queryGoalText()).toBeNull();
  expect(queryClearButton()).toBeNull();
});

test.each(["1", "999"])("AC5: accepts the boundary value %s", async (value) => {
  render(<Harness />);

  await submit(value);

  expect(screen.getByText(`Goal: ${value}`)).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
});

test("AC6, AC12: a valid submit removes the error and its aria attributes", async () => {
  render(<Harness initialGoal={10} />);

  await submit("0");
  expect(screen.getByRole("alert")).not.toBeNull();

  await submit("15");

  expect(screen.queryByRole("alert")).toBeNull();
  expect(getInput().hasAttribute("aria-invalid")).toBe(false);
  expect(getInput().hasAttribute("aria-describedby")).toBe(false);
  expect(screen.getByText("Goal: 15")).not.toBeNull();
});

test("AC7: Clear goal returns to the no-goal state and focuses the input", async () => {
  render(<Harness initialGoal={10} />);
  await submit("0");
  expect(screen.getByRole("alert")).not.toBeNull();

  await userEvent.click(queryClearButton());

  expect(queryGoalText()).toBeNull();
  expect(screen.queryByRole("progressbar")).toBeNull();
  expect(queryClearButton()).toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(getInput().value).toBe("");
  expect(document.activeElement).toBe(getInput());
});

test("AC8: the input is a text field with inputmode numeric", () => {
  render(<Harness />);

  expect(getInput().getAttribute("type")).toBe("text");
  expect(getInput().getAttribute("inputmode")).toBe("numeric");
});

test.each([" 10 ", "010", "0010"])("AC8: accepts %j as 10", async (value) => {
  render(<Harness />);

  await submit(value);

  expect(screen.getByText("Goal: 10")).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
});

test.each(["+5", "1e2", "10.0"])("AC8: rejects %j", async (value) => {
  render(<Harness initialGoal={10} />);

  await submit(value);

  expect(screen.getByRole("alert").textContent).toBe(ERROR_TEXT);
  expect(screen.getByText("Goal: 10")).not.toBeNull();
});

test("AC9: pressing Enter submits like Set goal", async () => {
  render(<Harness />);

  await userEvent.type(getInput(), "12{Enter}");

  expect(screen.getByText("Goal: 12")).not.toBeNull();
});

test("AC10: the input keeps the text after a valid submit", async () => {
  render(<Harness />);

  await submit("10");

  expect(getInput().value).toBe("10");
});

test("AC10: the input keeps the text after an invalid submit", async () => {
  render(<Harness initialGoal={10} />);

  await submit("2.5");

  expect(getInput().value).toBe("2.5");
});

test("AC12: no aria-invalid or aria-describedby while there is no error", () => {
  render(<Harness />);

  expect(getInput().hasAttribute("aria-invalid")).toBe(false);
  expect(getInput().hasAttribute("aria-describedby")).toBe(false);
});

test("AC13: typing in the input does not remove the error", async () => {
  render(<Harness initialGoal={10} />);
  await submit("0");

  await userEvent.type(getInput(), "1");

  expect(screen.getByRole("alert").textContent).toBe(ERROR_TEXT);
});
