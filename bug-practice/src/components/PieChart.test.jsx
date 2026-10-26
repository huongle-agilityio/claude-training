import { render, screen, cleanup, within } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { PieChart } from "./PieChart";
import { buildGradient } from "../utils/pieChart";
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

test("builds consecutive gradient stops from slice values", () => {
  const slices = [
    { value: 1, color: "red" },
    { value: 3, color: "blue" },
  ];

  expect(buildGradient(slices, 4)).toBe(
    "conic-gradient(red 0% 25%, blue 25% 100%)",
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
