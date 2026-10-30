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
const queryGoalText = () => screen.queryByText(/^\d+ \/ \d+$/);
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

test("AC2: setting a valid goal shows '0 / 10' and a Clear goal button", async () => {
  render(<Harness />);

  await submit("10");

  expect(screen.getByText("0 / 10")).not.toBeNull();
  expect(queryClearButton()).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
});

test("AC3: changing the goal updates the text", async () => {
  render(<Harness initialGoal={10} />);

  await submit("20");

  expect(screen.getByText("0 / 20")).not.toBeNull();
  expect(screen.queryByText("0 / 10")).toBeNull();
});

test("AC3: submitting the same goal twice keeps a single Clear goal button", async () => {
  render(<Harness initialGoal={10} />);

  await submit("10");

  expect(screen.getByText("0 / 10")).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getAllByRole("button", { name: "Clear goal" })).toHaveLength(1);
});

test.each(["", "0", "-5", "2.5", "1000", "abc"])(
  "AC4, AC12: rejects %j, shows the error and keeps '0 / 10'",
  async (value) => {
    render(<Harness initialGoal={10} />);

    await submit(value);

    const error = screen.getByRole("alert");
    expect(error.textContent).toBe(ERROR_TEXT);
    expect(getInput().getAttribute("aria-invalid")).toBe("true");
    expect(getInput().getAttribute("aria-describedby")).toBe(error.id);
    expect(screen.getByText("0 / 10")).not.toBeNull();
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

  expect(screen.getByText(`0 / ${value}`)).not.toBeNull();
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
  expect(screen.getByText("0 / 15")).not.toBeNull();
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

  expect(screen.getByText("0 / 10")).not.toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
});

test.each(["+5", "1e2", "10.0"])("AC8: rejects %j", async (value) => {
  render(<Harness initialGoal={10} />);

  await submit(value);

  expect(screen.getByRole("alert").textContent).toBe(ERROR_TEXT);
  expect(screen.getByText("0 / 10")).not.toBeNull();
});

test("AC9: pressing Enter submits like Set goal", async () => {
  render(<Harness />);

  await userEvent.type(getInput(), "12{Enter}");

  expect(screen.getByText("0 / 12")).not.toBeNull();
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

// T2: the progress display is driven by the goal and count props only.
const renderProgress = (goal, count) =>
  render(
    <GoalPanel
      goal={goal}
      count={count}
      onSetGoal={() => {}}
      onClearGoal={() => {}}
    />,
  );

const getBar = () => screen.getByRole("progressbar", { name: "Goal progress" });

test("T2 AC1, AC9: goal 10, count 0 shows '0 / 10' and an empty progressbar", () => {
  renderProgress(10, 0);

  expect(screen.getByText("0 / 10")).not.toBeNull();
  const bar = getBar();
  expect(bar.getAttribute("aria-valuemin")).toBe("0");
  expect(bar.getAttribute("aria-valuemax")).toBe("10");
  expect(bar.getAttribute("aria-valuenow")).toBe("0");
  expect(bar.getAttribute("aria-valuetext")).toBe("0 / 10");
});

test("T2 AC9: progressbar is named 'Goal progress' with min/max/now/valuetext", () => {
  renderProgress(10, 7);

  const bar = getBar();
  expect(bar.getAttribute("aria-valuemin")).toBe("0");
  expect(bar.getAttribute("aria-valuemax")).toBe("10");
  expect(bar.getAttribute("aria-valuenow")).toBe("7");
  expect(bar.getAttribute("aria-valuetext")).toBe("7 / 10");
  expect(screen.getByText("7 / 10").closest("[aria-hidden]")).toBeNull();
});

test("T2 AC3, AC9: count 12 with goal 10 shows '12 / 10' and a full bar", () => {
  renderProgress(10, 12);

  expect(screen.getByText("12 / 10")).not.toBeNull();
  const bar = getBar();
  expect(bar.getAttribute("aria-valuenow")).toBe("10");
  expect(bar.getAttribute("aria-valuemax")).toBe("10");
  expect(bar.getAttribute("aria-valuetext")).toBe("12 / 10");
  expect(bar.firstElementChild.style.width).toBe("100%");
});

test.each([0, 7, 12])(
  "T2 AC6: the goal panel shows no percentage at count %i",
  (count) => {
    const { container } = renderProgress(10, count);

    expect(container.textContent).not.toContain("%");
  },
);

test("T2 AC7: no goal shows no progress text or bar", () => {
  renderProgress(null, 5);

  expect(screen.queryByText(/^\d+ \/ \d+$/)).toBeNull();
  expect(screen.queryByRole("progressbar")).toBeNull();
});

test("T2 AC10: '3 / 10' replaces 'Goal: 10'", () => {
  renderProgress(10, 3);

  expect(screen.getByText("3 / 10")).not.toBeNull();
  expect(screen.queryByText(/Goal: \d+/)).toBeNull();
});

test("T2 TC-27: goal 1 goes from '0 / 1' to '1 / 1'", () => {
  const { rerender } = renderProgress(1, 0);
  expect(screen.getByText("0 / 1")).not.toBeNull();
  expect(getBar().getAttribute("aria-valuenow")).toBe("0");

  rerender(
    <GoalPanel goal={1} count={1} onSetGoal={() => {}} onClearGoal={() => {}} />,
  );

  expect(screen.getByText("1 / 1")).not.toBeNull();
  expect(getBar().getAttribute("aria-valuenow")).toBe("1");
});

test("T2 TC-28: goal 999 from count 998 to 999", () => {
  const { rerender } = renderProgress(999, 998);
  expect(screen.getByText("998 / 999")).not.toBeNull();

  rerender(
    <GoalPanel
      goal={999}
      count={999}
      onSetGoal={() => {}}
      onClearGoal={() => {}}
    />,
  );

  expect(screen.getByText("999 / 999")).not.toBeNull();
  expect(getBar().getAttribute("aria-valuenow")).toBe("999");
});

test("T2: order is text → progressbar → Clear goal", () => {
  renderProgress(10, 7);

  const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;
  const text = screen.getByText("7 / 10");
  const bar = getBar();
  const clear = screen.getByRole("button", { name: "Clear goal" });
  expect(text.compareDocumentPosition(bar) & FOLLOWING).toBeTruthy();
  expect(bar.compareDocumentPosition(clear) & FOLLOWING).toBeTruthy();
});
