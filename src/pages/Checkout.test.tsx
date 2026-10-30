import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { STORAGE_KEY } from "../lib/commerce";
import { StoreProvider } from "../state/Store";
import Checkout from "./Checkout";
const renderCheckout = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      cart: [
        { productId: "aura-02", variant: "50 ml", quantity: 1 },
        { productId: "aura-11", variant: "75 ml", quantity: 1 },
      ],
      wishlist: [],
    }),
  );
  return render(
    <MemoryRouter>
      <StoreProvider>
        <Checkout />
      </StoreProvider>
    </MemoryRouter>,
  );
};
describe("demo checkout", () => {
  it("summarises errors and focuses the first invalid field in visual order", async () => {
    const user = userEvent.setup();
    renderCheckout();
    await user.click(screen.getByRole("button", { name: /Continue to shipping/ }));
    const summary = await screen.findByRole("alert");
    expect(summary).toHaveTextContent("Please check 3 fields");
    await waitFor(() => expect(screen.getByLabelText(/First name/)).toHaveFocus());
    expect(screen.getByLabelText(/First name/)).toHaveAttribute("aria-invalid", "true");
    await user.type(screen.getByLabelText(/First name/), "Alex");
    await user.type(screen.getByLabelText(/Last name/), "Sample");
    await user.type(screen.getByLabelText(/Email address/), "alex@example.com");
    await user.click(screen.getByRole("button", { name: /Continue to shipping/ }));
    await user.type(screen.getByLabelText(/Street address/), "12 Sample Street");
    await user.type(screen.getByLabelText(/^City/), "Berlin");
    await user.type(screen.getByLabelText(/Postal code/), "-");
    await user.click(screen.getByRole("button", { name: /Review your order/ }));
    // Postal code is above Country on screen, so it must receive focus first.
    await waitFor(() => expect(screen.getByLabelText(/Postal code/)).toHaveFocus());
    expect(screen.getByLabelText(/Postal code/)).toHaveAccessibleDescription(
      /2–12 letters or numbers.*Enter a postal code/,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Please check 2 fields");
  });
  it("shows matching totals and focuses an honest confirmation after completion", async () => {
    const user = userEvent.setup();
    renderCheckout();
    await user.type(screen.getByLabelText(/First name/), "Alex");
    await user.type(screen.getByLabelText(/Last name/), "Sample");
    await user.type(screen.getByLabelText(/Email address/), "alex@example.com");
    await user.click(screen.getByRole("button", { name: /Continue to shipping/ }));
    await user.type(screen.getByLabelText(/Street address/), "12 Sample Street");
    await user.type(screen.getByLabelText(/^City/), "Berlin");
    await user.type(screen.getByLabelText(/Postal code/), "10115");
    await user.selectOptions(screen.getByLabelText(/Country/), "Germany");
    await user.click(screen.getByRole("button", { name: /Review your order/ }));
    // €56.00 + €18.00 = €74.00, below €75, so €4.90 demo shipping applies.
    expect(screen.getByTestId("subtotal")).toHaveTextContent("€74.00");
    expect(screen.getByTestId("shipping")).toHaveTextContent("€4.90");
    expect(screen.getByTestId("total")).toHaveTextContent("€78.90");
    await user.dblClick(screen.getByRole("button", { name: /Complete demo order/ }));
    const heading = await screen.findByRole("heading", { name: "Your ritual awaits." });
    await waitFor(() => expect(heading).toHaveFocus());
    const receipt = screen.getByRole("heading", { name: "Demo order summary" })
      .parentElement as HTMLElement;
    expect(within(receipt).getByText("€78.90")).toBeInTheDocument();
    expect(within(receipt).getByText("€4.90")).toBeInTheDocument();
    expect(screen.getByText(/no purchase was made and no payment was taken/)).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).not.toContain("alex@example.com");
    await waitFor(() => expect(localStorage.getItem(STORAGE_KEY)).toContain('"cart":[]'));
  });
});
