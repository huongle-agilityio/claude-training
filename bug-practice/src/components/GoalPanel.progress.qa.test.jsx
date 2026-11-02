import { render, screen, cleanup } from "@testing-library/react";
import { test, expect, vi, afterEach } from "vitest";
import { GoalPanel } from "./GoalPanel";

// T2 AC2, AC9 (test matrix TC-28): goal 999 boundary, with the count passed
// in directly as GoalPanel's `count` prop.

afterEach(cleanup);

const renderPanel = (props) =>
  render(
    <GoalPanel onSetGoal={vi.fn()} onClearGoal={vi.fn()} {...props} />,
  );

test("TC-28: goal 999 shows '998 / 999' at count 998 and '999 / 999' (full bar) at count 999", () => {
  const { rerender } = renderPanel({ goal: 999, count: 998 });

  expect(screen.getByText("998 / 999")).not.toBeNull();
  const bar = screen.getByRole("progressbar", { name: "Goal progress" });
  expect(bar.getAttribute("aria-valuenow")).toBe("998");
  expect(bar.getAttribute("aria-valuemax")).toBe("999");

  rerender(
    <GoalPanel
      goal={999}
      count={999}
      onSetGoal={vi.fn()}
      onClearGoal={vi.fn()}
    />,
  );

  expect(screen.getByText("999 / 999")).not.toBeNull();
  const after = screen.getByRole("progressbar", { name: "Goal progress" });
  expect(after.getAttribute("aria-valuenow")).toBe("999");
  expect(after.getAttribute("aria-valuemax")).toBe("999");
  expect(after.getAttribute("aria-valuetext")).toBe("999 / 999");
});
