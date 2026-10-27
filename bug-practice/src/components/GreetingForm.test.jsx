import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, afterEach } from "vitest";
import { GreetingForm } from "./GreetingForm";

afterEach(cleanup);

test("shows a greeting with the entered name on submit", async () => {
  render(<GreetingForm />);

  await userEvent.type(screen.getByLabelText(/name/i), "Huong");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(screen.getByRole("status").textContent).toBe("Hello, Huong");
});

test("shows an error when submitting an empty name", async () => {
  render(<GreetingForm />);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(screen.getByRole("status").textContent).toBe("Name is required");
});

test("treats a whitespace-only name as empty", async () => {
  render(<GreetingForm />);

  await userEvent.type(screen.getByLabelText(/name/i), "   ");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  expect(screen.getByRole("status").textContent).toBe("Name is required");
});

test("submits with the Enter key", async () => {
  render(<GreetingForm />);

  await userEvent.type(screen.getByLabelText(/name/i), "Ana{Enter}");

  expect(screen.getByRole("status").textContent).toBe("Hello, Ana");
});

test("shows no message before the first submit", () => {
  render(<GreetingForm />);

  expect(screen.queryByRole("status")).toBeNull();
});
