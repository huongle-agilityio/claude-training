import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { SantaRun } from "./SantaRun";

afterEach(cleanup);

test("renders nothing when runId is 0", () => {
  render(<SantaRun runId={0} />);
  expect(screen.queryByTestId("santa-run")).toBeNull();
});

test("shows santa with presents and sparkles trailing behind", () => {
  render(<SantaRun runId={1} />);
  const runner = screen.getByTestId("santa-runner");

  expect(runner.textContent).toContain("🎅");
  expect(runner.textContent).toContain("🎁");

  const sparkles = screen.getAllByTestId("santa-sparkle");
  expect(sparkles.length).toBeGreaterThan(0);

  // Sparkles sit before (to the left of) santa so they trail as he runs right.
  const santa = runner.querySelector(".santa-run__santa");
  const trail = runner.querySelector(".santa-run__trail");
  expect(
    trail.compareDocumentPosition(santa) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("hides after the run animation ends", () => {
  render(<SantaRun runId={1} />);
  fireEvent.animationEnd(screen.getByTestId("santa-runner"));
  expect(screen.queryByTestId("santa-run")).toBeNull();
});

test("ignores animationend bubbling from sparkles", () => {
  render(<SantaRun runId={1} />);
  fireEvent.animationEnd(screen.getAllByTestId("santa-sparkle")[0]);
  expect(screen.queryByTestId("santa-run")).not.toBeNull();
});

test("replays when runId changes after a run finished", () => {
  const { rerender } = render(<SantaRun runId={1} />);
  fireEvent.animationEnd(screen.getByTestId("santa-runner"));
  expect(screen.queryByTestId("santa-run")).toBeNull();

  rerender(<SantaRun runId={2} />);
  expect(screen.queryByTestId("santa-run")).not.toBeNull();
});
