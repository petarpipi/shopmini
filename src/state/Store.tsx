import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getProduct } from "../data/products";
import {
  addItemWithResult,
  MAX_QUANTITY,
  normalizeQuantity,
  readStore,
  STORAGE_KEY,
  toggleSaved,
  writeStore,
} from "../lib/commerce";
import type { CartItem, StoreData } from "../lib/commerce";
export interface Toast {
  id: number;
  message: string;
  tone: "success" | "info";
}
interface StoreContextValue extends StoreData {
  /** Returns the number of units actually added (0 when nothing could be added). */
  add: (productId: string, variant: string, quantity?: number) => number;
  update: (item: CartItem, quantity: number) => void;
  remove: (item: CartItem) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void;
  toast: Toast | null;
  notify: (message: string, tone?: Toast["tone"]) => void;
  storageUnavailable: boolean;
}
const StoreContext = createContext<StoreContextValue | null>(null);
const initialData = (): StoreData => {
  try {
    return readStore(window.localStorage);
  } catch {
    return { cart: [], wishlist: [] };
  }
};
export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(initialData);
  // Mirrors the latest state synchronously, so rapid repeated actions are evaluated against what they will actually change.
  const latest = useRef(data);
  const [toast, setToast] = useState<Toast | null>(null);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const notify = useCallback(
    (message: string, tone: Toast["tone"] = "success") => {
      clearTimeout(timer.current);
      setToast({ id: Date.now(), message, tone });
      timer.current = setTimeout(() => setToast(null), 4200);
    },
    [],
  );
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!dirty.current) return;
    try {
      setStorageUnavailable(!writeStore(window.localStorage, data));
    } catch {
      setStorageUnavailable(true);
    }
  }, [data]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        dirty.current = false;
        latest.current = initialData();
        setData(latest.current);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const change = (next: StoreData) => {
    dirty.current = true;
    latest.current = next;
    setData(next);
  };
  const add = (productId: string, variant: string, quantity = 1) => {
    const product = getProduct(productId);
    if (!product) return 0;
    const result = addItemWithResult(latest.current.cart, {
      productId,
      variant,
      quantity,
    });
    if (!result.added) {
      if (product.inStock)
        notify(
          `Your bag already holds the maximum of ${MAX_QUANTITY} for ${product.name}, ${variant}.`,
          "info",
        );
      return 0;
    }
    change({ ...latest.current, cart: result.cart });
    const requested = normalizeQuantity(quantity);
    notify(
      result.added < requested
        ? `Only ${result.added} added — your bag now holds the limit of ${MAX_QUANTITY} for ${product.name}, ${variant}.`
        : `${product.name}, ${variant}${result.added > 1 ? ` × ${result.added}` : ""} added to your bag`,
      result.added < requested ? "info" : "success",
    );
    return result.added;
  };
  const update = (item: CartItem, quantity: number) =>
    change({
      ...latest.current,
      cart: latest.current.cart.map((line) =>
        line.productId === item.productId && line.variant === item.variant
          ? { ...line, quantity: normalizeQuantity(quantity) }
          : line,
      ),
    });
  const remove = (item: CartItem) => {
    change({
      ...latest.current,
      cart: latest.current.cart.filter(
        (line) =>
          !(line.productId === item.productId && line.variant === item.variant),
      ),
    });
    notify(`${getProduct(item.productId)?.name ?? "Item"}, ${item.variant} removed from your bag`, "info");
  };
  const toggleWishlist = (id: string) => {
    const product = getProduct(id);
    if (!product) return;
    const wasSaved = latest.current.wishlist.includes(id);
    change({
      ...latest.current,
      wishlist: toggleSaved(latest.current.wishlist, id),
    });
    notify(
      wasSaved
        ? `${product.name} removed from your wishlist`
        : `${product.name} saved to your wishlist`,
      wasSaved ? "info" : "success",
    );
  };
  return (
    <StoreContext.Provider
      value={{
        ...data,
        add,
        update,
        remove,
        toggleWishlist,
        clearCart: () => change({ ...latest.current, cart: [] }),
        toast,
        notify,
        storageUnavailable,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("StoreProvider is required");
  return context;
}
