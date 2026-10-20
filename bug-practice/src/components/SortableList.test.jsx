import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { test, expect, afterEach, vi } from "vitest";
import { SortableList } from "./SortableList";
import { MOCK_ITEMS } from "../data/mockItems";

afterEach(cleanup);

// jsdom has no DataTransfer, so pass a minimal stub with drag events
const createDataTransfer = () => ({
  setData: vi.fn(),
  getData: vi.fn(),
  effectAllowed: "",
  dropEffect: "",
});

const getItems = () => screen.getAllByRole("listitem");

const getTitles = () =>
  getItems().map((item) => within(item).getByRole("heading").textContent);

const dragAndDrop = (source, target) => {
  const dataTransfer = createDataTransfer();
  fireEvent.dragStart(source, { dataTransfer });
  fireEvent.dragOver(target, { dataTransfer });
  fireEvent.drop(target, { dataTransfer });
  fireEvent.dragEnd(source, { dataTransfer });
};

test("renders every item with its title and description", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);

  expect(getItems()).toHaveLength(MOCK_ITEMS.length);
  MOCK_ITEMS.forEach(({ title, description }) => {
    expect(screen.getByText(title)).not.toBeNull();
    expect(screen.getByText(description)).not.toBeNull();
  });
});

test("dragging the first item onto the third moves it to third place", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);
  const [first, , third] = getItems();

  dragAndDrop(first, third);

  expect(getTitles()).toEqual([
    MOCK_ITEMS[1].title,
    MOCK_ITEMS[2].title,
    MOCK_ITEMS[0].title,
    ...MOCK_ITEMS.slice(3).map((item) => item.title),
  ]);
});

test("dragging an item upward moves it before the target", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);
  const items = getItems();

  dragAndDrop(items[4], items[1]);

  expect(getTitles().slice(0, 3)).toEqual([
    MOCK_ITEMS[0].title,
    MOCK_ITEMS[4].title,
    MOCK_ITEMS[1].title,
  ]);
});

test("dropping an item on itself keeps the order", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);
  const [first] = getItems();

  dragAndDrop(first, first);

  expect(getTitles()).toEqual(MOCK_ITEMS.map((item) => item.title));
});

test("marks the dragged and hovered items while dragging", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);
  const [first, second] = getItems();
  const dataTransfer = createDataTransfer();

  fireEvent.dragStart(first, { dataTransfer });
  fireEvent.dragOver(second, { dataTransfer });

  expect(first.classList.contains("dragging")).toBe(true);
  expect(second.classList.contains("drag-over")).toBe(true);
  expect(dataTransfer.setData).toHaveBeenCalledWith("text/plain", MOCK_ITEMS[0].id);
});

test("clears drag styles when the drag ends without a drop", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);
  const [first, second] = getItems();
  const dataTransfer = createDataTransfer();

  fireEvent.dragStart(first, { dataTransfer });
  fireEvent.dragOver(second, { dataTransfer });
  fireEvent.dragEnd(first, { dataTransfer });

  expect(first.classList.contains("dragging")).toBe(false);
  expect(second.classList.contains("drag-over")).toBe(false);
  expect(getTitles()).toEqual(MOCK_ITEMS.map((item) => item.title));
});
