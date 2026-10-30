import { describe, expect, it, vi } from "vitest";
import { formatMoney, products } from "../data/products";
import { categories } from "../data/products";
import {
  addItem,
  addItemWithResult,
  createDemoOrderId,
  emptyCheckout,
  filterProducts,
  filtersAreActive,
  filtersFromParams,
  firstInvalidField,
  initialFilters,
  MAX_QUANTITY,
  normalizeQuantity,
  priceBounds,
  readStore,
  remainingAllowance,
  sanitizeStore,
  shippingFor,
  startingPriceCents,
  STORAGE_KEY,
  toggleSaved,
  totals,
  unitPrice,
  validateCheckout,
  writeStore,
} from "./commerce";
import type { CartItem } from "./commerce";
const line: CartItem = { productId: "aura-01", variant: "150 ml", quantity: 1 };
describe("cart calculations and safe quantities", () => {
  it("calculates EUR amounts using integer cents", () => {
    expect(totals([line])).toEqual({
      subtotal: 2800,
      shipping: 490,
      total: 3290,
    });
    expect(formatMoney(3290)).toBe("€32.90");
  });
  it("applies the shipping boundary at exactly 75 EUR", () => {
    expect(shippingFor(7499)).toBe(490);
    expect(shippingFor(7500)).toBe(0);
    expect(shippingFor(7501)).toBe(0);
  });
  it("does not charge shipping for an empty bag", () =>
    expect(totals([])).toEqual({ subtotal: 0, shipping: 0, total: 0 }));
  it("includes the selected variant in unit prices and totals", () => {
    const larger = { ...line, variant: "250 ml", quantity: 2 };
    expect(unitPrice(larger)).toBe(3800);
    expect(totals([larger])).toEqual({
      subtotal: 7600,
      shipping: 0,
      total: 7600,
    });
  });
  it.each([
    [0, 1],
    [-4, 1],
    [2.9, 2],
    [NaN, 1],
    [Infinity, 1],
    [999, MAX_QUANTITY],
  ])("normalizes quantity %s to %s", (input, expected) =>
    expect(normalizeQuantity(input)).toBe(expected),
  );
  it("merges equal sizes, keeps other sizes separate and does not mutate input", () => {
    const source = [line];
    const merged = addItem(source, { ...line, quantity: 3 });
    expect(merged[0].quantity).toBe(4);
    expect(source[0].quantity).toBe(1);
    expect(addItem(merged, { ...line, variant: "250 ml" })).toHaveLength(2);
  });
  it("caps merged quantities and rejects unavailable products or invalid sizes", () => {
    expect(
      addItem([{ ...line, quantity: 9 }], { ...line, quantity: 9 })[0].quantity,
    ).toBe(10);
    expect(
      addItem([], { productId: "aura-12", variant: "100 ml", quantity: 1 }),
    ).toEqual([]);
    expect(addItem([], { ...line, variant: "bad-size" })).toEqual([]);
    expect(addItem([], { ...line, productId: "missing" })).toEqual([]);
  });
  it("reports how many units were actually accepted at the per-size limit", () => {
    const eight = [{ ...line, quantity: 8 }];
    expect(remainingAllowance(eight, line.productId, line.variant)).toBe(2);
    expect(addItemWithResult(eight, { ...line, quantity: 5 })).toEqual({
      cart: [{ ...line, quantity: 10 }],
      added: 2,
    });
    const full = [{ ...line, quantity: 10 }];
    expect(addItemWithResult(full, line)).toEqual({ cart: full, added: 0 });
    expect(addItemWithResult([], { ...line, quantity: 0 }).added).toBe(0);
    expect(addItemWithResult([], { ...line, quantity: -3 }).added).toBe(0);
  });
  it("matches independently calculated totals in integer cents", () => {
    // 2 × €56.00 (Daily Glow 50 ml) + 3 × €18.00 (Linen 75 ml) + 1 × €38.00 (Cleanser 250 ml)
    const cart: CartItem[] = [
      { productId: "aura-02", variant: "50 ml", quantity: 2 },
      { productId: "aura-11", variant: "75 ml", quantity: 3 },
      { productId: "aura-01", variant: "250 ml", quantity: 1 },
    ];
    expect(totals(cart)).toEqual({ subtotal: 20400, shipping: 0, total: 20400 });
    expect(formatMoney(totals(cart).total)).toBe("€204.00");
    // €74.00 is one euro below the free-shipping threshold.
    expect(
      totals([
        { productId: "aura-02", variant: "50 ml", quantity: 1 },
        { productId: "aura-11", variant: "75 ml", quantity: 1 },
      ]),
    ).toEqual({ subtotal: 7400, shipping: 490, total: 7890 });
  });
  it("never bills invalid lines, even if they bypass sanitization", () => {
    expect(unitPrice({ productId: "aura-01", variant: "999 ml" })).toBeNull();
    expect(unitPrice({ productId: "missing", variant: "30 ml" })).toBeNull();
    expect(
      totals([
        line,
        { ...line, quantity: 0 },
        { ...line, quantity: -5 },
        { ...line, quantity: 2.5 },
        { ...line, variant: "999 ml" },
        { productId: "aura-12", variant: "100 ml", quantity: 1 },
        { productId: "missing", variant: "x", quantity: 1 },
      ]),
    ).toEqual({ subtotal: 2800, shipping: 490, total: 3290 });
  });
});
describe("catalog filtering", () => {
  it("includes all twelve unique products by default", () => {
    expect(filterProducts(initialFilters)).toHaveLength(12);
    expect(new Set(products.map((product) => product.id)).size).toBe(12);
  });
  it("searches case-insensitively and trims whitespace", () =>
    expect(
      filterProducts({ ...initialFilters, search: "  DAILY GLOW  " }).map(
        (product) => product.id,
      ),
    ).toEqual(["aura-02"]));
  it("combines category, search and maximum price", () =>
    expect(
      filterProducts({
        ...initialFilters,
        category: "Serums",
        search: "serum",
        maxPrice: 40,
      }).map((product) => product.id),
    ).toEqual(["aura-08"]));
  it("supports empty results", () =>
    expect(
      filterProducts({ ...initialFilters, search: "impossible-product" }),
    ).toEqual([]));
  it("sorts prices both ways without mutating the catalog", () => {
    const before = products.map((product) => product.id);
    const ascending = filterProducts({ ...initialFilters, sort: "price-asc" });
    const descending = filterProducts({
      ...initialFilters,
      sort: "price-desc",
    });
    expect(ascending[0].id).toBe("aura-11");
    expect(descending[0].id).toBe("aura-07");
    expect(ascending.map((product) => product.priceCents)).toEqual(
      ascending.map((product) => product.priceCents).sort((a, b) => a - b),
    );
    expect(products.map((product) => product.id)).toEqual(before);
  });
  it("derives price bounds from the catalog's smallest-size prices", () => {
    expect(priceBounds).toEqual({ min: 18, max: 48 });
    expect(startingPriceCents(products[1])).toBe(4200);
  });
  it("applies a minimum price, a maximum price and inclusive boundaries", () => {
    const ids = (minPrice: number, maxPrice: number) =>
      filterProducts({ ...initialFilters, minPrice, maxPrice }).map(
        (product) => product.id,
      );
    expect(ids(46, 48)).toEqual(["aura-07", "aura-09"]);
    expect(ids(18, 18)).toEqual(["aura-11"]);
    expect(ids(48, 48)).toEqual(["aura-07"]);
    expect(ids(19, 25)).toEqual([]);
    expect(ids(34, 34).sort()).toEqual(["aura-06", "aura-10"]);
    // The whole slider range is meaningful: raising the upper bound keeps revealing products up to €48.
    const counts = Array.from(
      { length: priceBounds.max - priceBounds.min + 1 },
      (_, index) => ids(priceBounds.min, priceBounds.min + index).length,
    );
    expect(counts.at(-1)).toBe(12);
    expect(new Set(counts).size).toBeGreaterThan(8);
  });
  it("combines category, minimum price and sorting", () =>
    expect(
      filterProducts({
        ...initialFilters,
        category: "Moisturizers",
        minPrice: 35,
        sort: "price-desc",
      }).map((product) => product.id),
    ).toEqual(["aura-09", "aura-03"]));
  it("reads untrusted URL parameters into safe filters", () => {
    const parse = (query: string) =>
      filtersFromParams(new URLSearchParams(query), categories);
    expect(parse("")).toEqual(initialFilters);
    expect(parse("category=Bogus&sort=evil&minPrice=abc&maxPrice=")).toEqual(
      initialFilters,
    );
    expect(parse("minPrice=5&maxPrice=999")).toMatchObject({
      minPrice: 18,
      maxPrice: 48,
    });
    expect(parse("minPrice=40&maxPrice=30")).toMatchObject({
      minPrice: 30,
      maxPrice: 40,
    });
    expect(parse("category=Serums&sort=name&search=glow")).toMatchObject({
      category: "Serums",
      sort: "name",
      search: "glow",
    });
    expect(filtersAreActive(parse(""))).toBe(false);
    expect(filtersAreActive(parse("minPrice=20"))).toBe(true);
    expect(filtersAreActive(parse("search=%20%20"))).toBe(false);
  });
  it("sorts names alphabetically", () => {
    const names = filterProducts({ ...initialFilters, sort: "name" }).map(
      (product) => product.name,
    );
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
describe("wishlist and persistence", () => {
  it("toggles only valid product IDs without duplicates", () => {
    expect(toggleSaved([], "aura-01")).toEqual(["aura-01"]);
    expect(toggleSaved(["aura-01"], "aura-01")).toEqual([]);
    expect(toggleSaved(["aura-01"], "unknown")).toEqual(["aura-01"]);
  });
  it("restores valid cart and wishlist data alongside invalid records", () => {
    const result = sanitizeStore({
      cart: [
        line,
        null,
        { productId: "missing" },
        { ...line, variant: "invalid" },
        { ...line, quantity: -4 },
        { ...line, quantity: 2 },
      ],
      wishlist: ["aura-01", "missing", 34, "aura-01", "aura-12"],
    });
    expect(result.cart).toEqual([{ ...line, quantity: 3 }]);
    expect(result.wishlist).toEqual(["aura-01", "aura-12"]);
  });
  it("accepts only whole stored quantities from 1 to 10 and ignores stored prices", () => {
    const result = sanitizeStore({
      cart: [
        { ...line, quantity: 0.4 },
        { ...line, quantity: 1e9 },
        { ...line, quantity: "3" },
        { ...line, quantity: 11 },
        { productId: "aura-02", variant: "30 ml", quantity: 2, priceCents: 1 },
      ],
    });
    expect(result.cart).toEqual([
      { productId: "aura-02", variant: "30 ml", quantity: 2 },
    ]);
    expect(totals(result.cart).subtotal).toBe(8400);
  });
  it("persists and reloads data without touching unrelated keys", () => {
    localStorage.setItem("another-app", "keep-me");
    expect(
      writeStore(localStorage, { cart: [line], wishlist: ["aura-02"] }),
    ).toBe(true);
    expect(readStore(localStorage)).toEqual({
      cart: [line],
      wishlist: ["aura-02"],
    });
    expect(localStorage.getItem("another-app")).toBe("keep-me");
  });
  it("handles malformed JSON without overwriting it on read", () => {
    localStorage.setItem(STORAGE_KEY, "{bad json");
    expect(readStore(localStorage)).toEqual({ cart: [], wishlist: [] });
    expect(localStorage.getItem(STORAGE_KEY)).toBe("{bad json");
  });
  it("handles unavailable browser storage without throwing", () => {
    const getItem = vi.fn(() => {
      throw new Error("denied");
    });
    const setItem = vi.fn(() => {
      throw new Error("quota");
    });
    expect(readStore({ getItem })).toEqual({ cart: [], wishlist: [] });
    expect(writeStore({ setItem }, { cart: [], wishlist: [] })).toBe(false);
  });
  it.each([null, 22, "invalid", [], { cart: false, wishlist: {} }])(
    "handles invalid stored shape %j",
    (raw) => expect(sanitizeStore(raw)).toEqual({ cart: [], wishlist: [] }),
  );
});
describe("checkout validation", () => {
  it("requires all customer fields", () =>
    expect(Object.keys(validateCheckout(emptyCheckout, 0))).toEqual([
      "firstName",
      "lastName",
      "email",
    ]));
  it("rejects invalid email and whitespace-only names", () => {
    expect(
      validateCheckout(
        {
          ...emptyCheckout,
          firstName: " ",
          lastName: "Sample",
          email: "invalid@",
        },
        0,
      ),
    ).toHaveProperty("email");
    expect(
      validateCheckout(
        {
          ...emptyCheckout,
          firstName: " ",
          lastName: "Sample",
          email: "a@example.com",
        },
        0,
      ),
    ).toHaveProperty("firstName");
  });
  it("requires all shipping fields and a supported country", () => {
    expect(Object.keys(validateCheckout(emptyCheckout, 1))).toHaveLength(4);
    expect(
      validateCheckout(
        {
          ...emptyCheckout,
          address: "12 Sample St",
          city: "Berlin",
          postalCode: "10115",
          country: "invalid",
        },
        1,
      ),
    ).toHaveProperty("country");
  });
  it("accepts valid sample details and postal formats", () => {
    const values = {
      firstName: "Alex",
      lastName: "Sample",
      email: "alex@example.com",
      address: "12 Sample Street",
      city: "Berlin",
      postalCode: "10115",
      country: "Germany",
    };
    expect(validateCheckout(values, 0)).toEqual({});
    expect(validateCheckout(values, 1)).toEqual({});
    expect(validateCheckout({ ...values, postalCode: "!" }, 1)).toHaveProperty(
      "postalCode",
    );
  });
  it("returns errors in on-screen field order so focus reaches the first invalid field", () => {
    const errors = validateCheckout(
      { ...emptyCheckout, address: "12 Sample Street", city: "Berlin", postalCode: "-" },
      1,
    );
    expect(Object.keys(errors)).toEqual(["postalCode", "country"]);
    expect(firstInvalidField(errors)).toBe("postalCode");
    expect(
      firstInvalidField(
        validateCheckout({ ...emptyCheckout, firstName: "Alex", email: "bad" }, 0),
      ),
    ).toBe("lastName");
  });
  it("creates demo references with and without crypto.randomUUID", () => {
    expect(createDemoOrderId(() => "abcd1234-ffff")).toBe("DEMO-ABCD1234");
    expect(createDemoOrderId()).toMatch(/^DEMO-[0-9A-F]{8}$/);
  });
});
