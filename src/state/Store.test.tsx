import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { STORAGE_KEY } from "../lib/commerce";
import { StoreProvider, useStore } from "./Store";
function Harness() {
  const store = useStore();
  return (
    <>
      <button onClick={() => store.add("aura-01", "150 ml")}>Add</button>
      <button
        onClick={(event) => {
          const added = store.add("aura-01", "150 ml", 5);
          event.currentTarget.dataset.added = String(added);
        }}
      >
        Add five
      </button>
      <button onClick={() => store.toggleWishlist("aura-02")}>Save</button>
      <button onClick={store.clearCart}>Clear</button>
      <output aria-label="Count">
        {store.cart.reduce((sum, item) => sum + item.quantity, 0)}
      </output>
      <output aria-label="Saved">{store.wishlist.length}</output>
      <output aria-label="Toast">{store.toast?.message ?? ""}</output>
    </>
  );
}
const renderStore = () =>
  render(
    <StoreProvider>
      <Harness />
    </StoreProvider>,
  );
describe("shopping state integration", () => {
  it("updates counters, persists both collections and restores them on remount", async () => {
    const view = renderStore();
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByLabelText("Count")).toHaveTextContent("2");
    expect(screen.getByLabelText("Saved")).toHaveTextContent("1");
    await waitFor(() =>
      expect(localStorage.getItem(STORAGE_KEY)).toContain("aura-02"),
    );
    view.unmount();
    renderStore();
    expect(screen.getByLabelText("Count")).toHaveTextContent("2");
    expect(screen.getByLabelText("Saved")).toHaveTextContent("1");
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByLabelText("Count")).toHaveTextContent("0");
    expect(screen.getByLabelText("Saved")).toHaveTextContent("1");
  });
  it("does not overwrite corrupted data on mount", () => {
    localStorage.setItem(STORAGE_KEY, "malformed");
    renderStore();
    expect(screen.getByLabelText("Count")).toHaveTextContent("0");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("malformed");
  });
  it("reports partial additions at the per-size limit instead of claiming all were added", () => {
    renderStore();
    const addFive = screen.getByText("Add five");
    fireEvent.click(addFive);
    expect(addFive.dataset.added).toBe("5");
    for (let index = 0; index < 3; index += 1) fireEvent.click(screen.getByText("Add"));
    expect(screen.getByLabelText("Count")).toHaveTextContent("8");
    fireEvent.click(addFive);
    expect(addFive.dataset.added).toBe("2");
    expect(screen.getByLabelText("Count")).toHaveTextContent("10");
    expect(screen.getByLabelText("Toast")).toHaveTextContent(
      "Only 2 added — your bag now holds the limit of 10",
    );
    fireEvent.click(addFive);
    expect(addFive.dataset.added).toBe("0");
    expect(screen.getByLabelText("Count")).toHaveTextContent("10");
    expect(screen.getByLabelText("Toast")).toHaveTextContent(
      "already holds the maximum of 10",
    );
  });
  it("evaluates rapid repeated actions against the latest state", () => {
    renderStore();
    act(() => {
      fireEvent.click(screen.getByText("Save"));
      fireEvent.click(screen.getByText("Save"));
    });
    expect(screen.getByLabelText("Saved")).toHaveTextContent("0");
    expect(screen.getByLabelText("Toast")).toHaveTextContent(
      "Daily Glow Serum removed from your wishlist",
    );
  });
});
