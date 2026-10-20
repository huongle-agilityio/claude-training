import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { test, expect, afterEach, beforeEach, vi } from "vitest";
import { SortableList } from "../components/SortableList";
import { MOCK_ITEMS } from "../data/mockItems";

const ITEM_HEIGHT = 100;
let rafCallbacks = [];

// jsdom has no layout: derive offsetTop from the element's position in its list
beforeEach(() => {
  rafCallbacks = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    rafCallbacks.push(cb);
    return rafCallbacks.length;
  });
  vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(
    function () {
      return [...this.parentNode.children].indexOf(this) * ITEM_HEIGHT;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const dragAndDrop = (source, target) => {
  const dataTransfer = { setData: vi.fn(), effectAllowed: "", dropEffect: "" };
  fireEvent.dragStart(source, { dataTransfer });
  fireEvent.dragOver(target, { dataTransfer });
  fireEvent.drop(target, { dataTransfer });
  fireEvent.dragEnd(source, { dataTransfer });
};

test("moved items are inverted to their old position, then released", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);
  const [first, second, third, fourth] = screen.getAllByRole("listitem");

  dragAndDrop(first, third);

  // Invert: first moved down 2 slots, second and third moved up 1 slot
  expect(first.style.transform).toBe(`translateY(${-2 * ITEM_HEIGHT}px)`);
  expect(second.style.transform).toBe(`translateY(${ITEM_HEIGHT}px)`);
  expect(third.style.transform).toBe(`translateY(${ITEM_HEIGHT}px)`);
  expect(first.style.transition).toBe("none");
  // Items that did not move are untouched
  expect(fourth.style.transform).toBe("");

  // Play: next frame clears inline styles so the CSS transition runs
  rafCallbacks.forEach((cb) => cb());
  [first, second, third].forEach((item) => {
    expect(item.style.transform).toBe("");
    expect(item.style.transition).toBe("");
  });
});

test("does not animate on first render", () => {
  render(<SortableList initialItems={MOCK_ITEMS} />);

  screen.getAllByRole("listitem").forEach((item) => {
    expect(item.style.transform).toBe("");
  });
  expect(rafCallbacks).toHaveLength(0);
});
