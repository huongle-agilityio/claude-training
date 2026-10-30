import { render, screen, act, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi, afterEach } from "vitest";
import { MemoryRouter } from "react-router";
import App from "./App";
import { ROUTES } from "./constants/routes";

// T1 click goal (docs/tickets/ticket1.md, test matrix TC-53, TC-56)

const renderApp = (path = ROUTES.HOME) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const switchTab = async (user, name) => {
  const tab =
    screen.queryByRole("tab", { name }) ?? screen.getByRole("button", { name });
  await user.click(tab);
};

const setGoal = async (user, value) => {
  const input = screen.getByRole("textbox", { name: "Your goal" });
  await user.clear(input);
  await user.type(input, value);
  await user.click(screen.getByRole("button", { name: "Set goal" }));
};

test("TC-T1-53: the goal survives a tab switch, the error does not", async () => {
  const user = userEvent.setup();
  renderApp();
  await setGoal(user, "10");
  const button = screen.getByRole("button", { name: /count is/i });
  await user.click(button);
  await user.click(button);
  await user.click(button);
  await setGoal(user, "0");
  expect(screen.getByRole("alert").textContent).toBe(
    "Enter a whole number from 1 to 999",
  );

  await switchTab(user, /history/i);
  await switchTab(user, /counter/i);

  expect(screen.getByText("3 / 10")).not.toBeNull();
  expect(screen.getByRole("button", { name: /count is/i }).textContent).toMatch(
    "Count is 3",
  );
  const input = screen.getByRole("textbox", { name: "Your goal" });
  expect(input.value).toBe("10");
  expect(screen.queryByText("Enter a whole number from 1 to 999")).toBeNull();
  expect(input.hasAttribute("aria-invalid")).toBe(false);
});

test("TC-T1-56: the goal panel sits after the click message and before SantaRun, Counter tab only", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime.bind(vi),
  });
  renderApp();

  await user.click(screen.getByRole("button", { name: /count is/i }));
  await act(async () => {
    vi.advanceTimersByTime(2000);
  });

  const message = screen.getByText(/you clicked 1 time/i);
  const goalInput = screen.getByRole("textbox", { name: "Your goal" });
  const santa = screen.getByTestId("santa-run");
  const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;
  expect(message.compareDocumentPosition(goalInput) & FOLLOWING).toBeTruthy();
  expect(goalInput.compareDocumentPosition(santa) & FOLLOWING).toBeTruthy();

  await switchTab(user, /history/i);
  expect(screen.queryByRole("textbox", { name: "Your goal" })).toBeNull();
});
