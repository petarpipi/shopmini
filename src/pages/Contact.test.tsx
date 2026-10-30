import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Contact, { validateContact } from "./Contact";
describe("demonstration contact form", () => {
  it("rejects empty fields and short messages", () => {
    expect(
      Object.keys(
        validateContact({ name: "", email: "", subject: "", message: "" }),
      ),
    ).toHaveLength(4);
    expect(
      validateContact({
        name: "Alex",
        email: "alex@example.com",
        subject: "Hello",
        message: "tiny",
      }),
    ).toHaveProperty("message");
  });
  it("focuses the first invalid field and shows a truthful success state", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Preview demo message" }),
    );
    expect(screen.getByLabelText(/Your name/)).toHaveFocus();
    fireEvent.change(screen.getByLabelText(/Your name/), {
      target: { value: "Alex Sample" },
    });
    fireEvent.change(screen.getByLabelText(/Email address/), {
      target: { value: "alex@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Subject/), {
      target: { value: "A sample hello" },
    });
    fireEvent.change(screen.getByLabelText(/Your message/), {
      target: { value: "This is a fictional demonstration message." },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Preview demo message" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "your message was not sent",
    );
  });
});
