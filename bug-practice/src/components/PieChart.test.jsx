import { render, screen, cleanup, within } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PieChart } from "./PieChart";
import { MOCK_CHART_DATA } from "../data/mockChartData";

afterEach(cleanup);

test("renders the title and a legend entry for every slice", () => {
  render(<PieChart data={MOCK_CHART_DATA} title="Project phases" />);

  expect(screen.getByRole("heading", { name: "Project phases" })).toBeTruthy();
  const items = screen.getAllByRole("listitem");
  expect(items).toHaveLength(MOCK_CHART_DATA.length);
  expect(within(items[1]).getByText("Build")).toBeTruthy();
  expect(within(items[1]).getByText("40%")).toBeTruthy();
});

test("describes every slice in the chart's accessible label", () => {
  render(<PieChart data={MOCK_CHART_DATA} title="Project phases" />);

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Project phases: Design 25%, Build 40%, Test 20%, Ship 15%",
  );
});

test("skips zero-value slices", () => {
  const data = [
    { id: "a", label: "A", value: 0, color: "red" },
    { id: "b", label: "B", value: 5, color: "blue" },
  ];
  render(<PieChart data={data} title="Chart" />);

  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(screen.queryByText("A")).toBeNull();
});

test("shows an empty message when there is no data", () => {
  render(<PieChart data={[]} title="Chart" />);

  expect(screen.getByText("No data to display.")).toBeTruthy();
  expect(screen.queryByRole("img")).toBeNull();
});

test("shows the empty message instead of crashing when data is missing", () => {
  render(<PieChart title="Chart" />);

  expect(screen.getByText("No data to display.")).toBeTruthy();
});

test("leaves the title out of the label and heading when none is given", () => {
  render(<PieChart data={[{ id: "a", label: "A", value: 1, color: "red" }]} />);

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe("A 100%");
  expect(screen.queryByRole("heading")).toBeNull();
});

test("treats numeric string values as numbers", () => {
  const data = [
    { id: "a", label: "A", value: "25", color: "red" },
    { id: "b", label: "B", value: "75", color: "blue" },
  ];
  render(<PieChart data={data} title="Chart" />);

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Chart: A 25%, B 75%",
  );
});

test("drops NaN and Infinity values", () => {
  const data = [
    { id: "a", label: "A", value: NaN, color: "red" },
    { id: "b", label: "B", value: Infinity, color: "green" },
    { id: "c", label: "C", value: 5, color: "blue" },
  ];
  render(<PieChart data={data} title="Chart" />);

  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "Chart: C 100%",
  );
});

test("legend percentages add up to 100 for equal slices", () => {
  const data = ["A", "B", "C"].map((label) => ({ label, value: 1, color: "red" }));
  render(<PieChart data={data} title="Chart" />);

  const total = screen
    .getAllByRole("listitem")
    .reduce((sum, item) => sum + parseInt(item.textContent.replace(/\D/g, ""), 10), 0);
  expect(total).toBe(100);
});
