import { getProduct, products } from "../data/products";
import type { Product } from "../data/products";
export interface CartItem {
  productId: string;
  variant: string;
  quantity: number;
}
export interface StoreData {
  cart: CartItem[];
  wishlist: string[];
}
export const STORAGE_KEY = "shopmini-aura-v1";
export const MAX_QUANTITY = 10;
export const FREE_SHIPPING_CENTS = 7500;
export const SHIPPING_CENTS = 490;
export const normalizeQuantity = (value: number) =>
  Number.isFinite(value)
    ? Math.min(MAX_QUANTITY, Math.max(1, Math.floor(value)))
    : 1;
export const isValidQuantity = (value: unknown): value is number =>
  Number.isInteger(value) &&
  (value as number) >= 1 &&
  (value as number) <= MAX_QUANTITY;
/** A line is billable only when it names a known, in-stock product, one of its sizes and a whole quantity from 1 to 10. */
export function isValidLine(item: CartItem) {
  const product = getProduct(item.productId);
  return Boolean(
    product?.inStock &&
      product.variants.some((variant) => variant.name === item.variant) &&
      isValidQuantity(item.quantity),
  );
}
/** Unit price in cents from the catalog, or null when the product or size is unknown. Stored prices are never used. */
export function unitPrice(item: Pick<CartItem, "productId" | "variant">) {
  const product = getProduct(item.productId);
  const variant = product?.variants.find((option) => option.name === item.variant);
  return product && variant ? product.priceCents + variant.extraCents : null;
}
export const lineTotal = (item: CartItem) =>
  isValidLine(item) ? (unitPrice(item) ?? 0) * item.quantity : 0;
export const shippingFor = (subtotal: number) =>
  subtotal <= 0 || subtotal >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
export function totals(cart: CartItem[]) {
  const subtotal = cart.reduce((sum, item) => sum + lineTotal(item), 0);
  const shipping = shippingFor(subtotal);
  return { subtotal, shipping, total: subtotal + shipping };
}
export const itemCount = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.quantity, 0);
export const quantityInCart = (cart: CartItem[], productId: string, variant: string) =>
  cart.find((line) => line.productId === productId && line.variant === variant)
    ?.quantity ?? 0;
/** How many more units of this size fit in the bag before reaching the per-size limit. */
export const remainingAllowance = (cart: CartItem[], productId: string, variant: string) =>
  Math.max(0, MAX_QUANTITY - quantityInCart(cart, productId, variant));
export function addItem(cart: CartItem[], item: CartItem) {
  return addItemWithResult(cart, item).cart;
}
/** Adds a line and reports how many units were actually accepted, so the UI never claims more than it added. */
export function addItemWithResult(
  cart: CartItem[],
  item: CartItem,
): { cart: CartItem[]; added: number } {
  const product = getProduct(item.productId);
  if (
    !product?.inStock ||
    !product.variants.some((variant) => variant.name === item.variant) ||
    !Number.isFinite(item.quantity) ||
    item.quantity < 1
  )
    return { cart, added: 0 };
  const requested = normalizeQuantity(item.quantity);
  const added = Math.min(
    requested,
    remainingAllowance(cart, item.productId, item.variant),
  );
  if (!added) return { cart, added: 0 };
  const exists = cart.some(
    (line) => line.productId === item.productId && line.variant === item.variant,
  );
  return {
    added,
    cart: exists
      ? cart.map((line) =>
          line.productId === item.productId && line.variant === item.variant
            ? { ...line, quantity: line.quantity + added }
            : line,
        )
      : [...cart, { productId: item.productId, variant: item.variant, quantity: added }],
  };
}
export const toggleSaved = (ids: string[], id: string) =>
  !getProduct(id)
    ? ids
    : ids.includes(id)
      ? ids.filter((value) => value !== id)
      : [...ids, id];
export function sanitizeStore(raw: unknown): StoreData {
  const clean: StoreData = { cart: [], wishlist: [] };
  if (!raw || typeof raw !== "object") return clean;
  const value = raw as Record<string, unknown>;
  if (Array.isArray(value.cart)) {
    for (const entry of value.cart) {
      if (!entry || typeof entry !== "object") continue;
      const item = entry as Partial<CartItem>;
      if (
        typeof item.productId !== "string" ||
        typeof item.variant !== "string" ||
        !isValidQuantity(item.quantity)
      )
        continue;
      clean.cart = addItem(clean.cart, {
        productId: item.productId,
        variant: item.variant,
        quantity: item.quantity,
      });
    }
  }
  if (Array.isArray(value.wishlist))
    clean.wishlist = [
      ...new Set(
        value.wishlist.filter(
          (id): id is string =>
            typeof id === "string" && Boolean(getProduct(id)),
        ),
      ),
    ];
  return clean;
}
export function readStore(storage: Pick<Storage, "getItem">): StoreData {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? sanitizeStore(JSON.parse(raw)) : { cart: [], wishlist: [] };
  } catch {
    return { cart: [], wishlist: [] };
  }
}
export function writeStore(
  storage: Pick<Storage, "setItem">,
  data: StoreData,
): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
/** The lowest price a product can be bought for, i.e. its smallest size. Cards and price filters use this value. */
export const startingPriceCents = (product: Product) =>
  product.priceCents +
  Math.min(...product.variants.map((variant) => variant.extraCents));
const startingPrices = products.map(startingPriceCents);
/** Whole-euro slider bounds derived from the catalog, so every position can change the results. */
export const priceBounds = {
  min: Math.floor(Math.min(...startingPrices) / 100),
  max: Math.ceil(Math.max(...startingPrices) / 100),
};
export const sortOptions = [
  { value: "featured", label: "Our selection" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const;
export type SortValue = (typeof sortOptions)[number]["value"];
export interface Filters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: SortValue;
}
export const initialFilters: Filters = {
  search: "",
  category: "All",
  minPrice: priceBounds.min,
  maxPrice: priceBounds.max,
  sort: "featured",
};
const wholeEuros = (raw: string | null, fallback: number) => {
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value)
    ? Math.min(priceBounds.max, Math.max(priceBounds.min, Math.round(value)))
    : fallback;
};
/** Reads untrusted URL parameters into valid filters. Unknown values fall back to defaults; an inverted range is swapped. */
export function filtersFromParams(
  params: URLSearchParams,
  categories: readonly string[],
): Filters {
  const category = params.get("category") ?? "All";
  const sort = params.get("sort");
  let minPrice = wholeEuros(params.get("minPrice"), priceBounds.min);
  let maxPrice = wholeEuros(params.get("maxPrice"), priceBounds.max);
  if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
  return {
    search: (params.get("search") ?? "").slice(0, 80),
    category: categories.includes(category) ? category : "All",
    minPrice,
    maxPrice,
    sort: sortOptions.some((option) => option.value === sort)
      ? (sort as SortValue)
      : "featured",
  };
}
export const filtersAreActive = (filters: Filters) =>
  Boolean(filters.search.trim()) ||
  filters.category !== initialFilters.category ||
  filters.minPrice !== initialFilters.minPrice ||
  filters.maxPrice !== initialFilters.maxPrice ||
  filters.sort !== initialFilters.sort;
export function filterProducts(
  filters: Filters,
  source: Product[] = products,
): Product[] {
  const query = filters.search.trim().toLowerCase();
  const result = source.filter((product) => {
    const price = startingPriceCents(product);
    return (
      (filters.category === "All" || product.category === filters.category) &&
      price >= filters.minPrice * 100 &&
      price <= filters.maxPrice * 100 &&
      `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(query)
    );
  });
  if (filters.sort === "price-asc")
    result.sort((a, b) => startingPriceCents(a) - startingPriceCents(b));
  if (filters.sort === "price-desc")
    result.sort((a, b) => startingPriceCents(b) - startingPriceCents(a));
  if (filters.sort === "name")
    result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
export interface CheckoutFields {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;
export const emptyCheckout: CheckoutFields = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};
export const checkoutSteps: (keyof CheckoutFields)[][] = [
  ["firstName", "lastName", "email"],
  ["address", "city", "postalCode", "country"],
];
export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const shippingCountries = [
  "Germany",
  "France",
  "Netherlands",
  "Belgium",
  "Austria",
  "Italy",
  "Spain",
  "North Macedonia",
];
function fieldError(field: keyof CheckoutFields, raw: string) {
  const value = raw.trim();
  if (!value)
    return field === "country"
      ? "Select a demo destination."
      : "Please complete this field.";
  if (value.length > 160) return "Please use 160 characters or fewer.";
  if (field === "email" && !isEmail(value))
    return "Enter an email address in the format name@example.com.";
  if (field === "postalCode" && !/^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(value))
    return "Enter a postal code of 2–12 letters or numbers.";
  if (field === "country" && !shippingCountries.includes(value))
    return "Select a listed country.";
  return undefined;
}
/** Validates one checkout step. Errors are returned in on-screen field order, so the first key is the first invalid field. */
export function validateCheckout(values: CheckoutFields, step: number) {
  const errors: CheckoutErrors = {};
  for (const field of checkoutSteps[step] ?? []) {
    const message = fieldError(field, values[field]);
    if (message) errors[field] = message;
  }
  return errors;
}
export const firstInvalidField = (errors: CheckoutErrors) =>
  [...checkoutSteps.flat()].find((field) => errors[field]);
/** Demo order reference. Falls back when crypto.randomUUID is unavailable (e.g. plain-http LAN previews). */
export function createDemoOrderId(
  random: () => string = () =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`,
) {
  return `DEMO-${random().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
