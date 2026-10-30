import { Component, lazy, Suspense, useEffect } from "react";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { EmptyState } from "./components/UI";
import Home from "./pages/Home";
const loadShop = () => import("./pages/Shop");
const loadProduct = () => import("./pages/Product");
const Shop = lazy(loadShop);
const Product = lazy(loadProduct);
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="empty-state">
        <h1>A little pause.</h1>
        <p>We couldn’t load this page. Please try again.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
/** Warms the two most visited route chunks once the browser is idle, so in-app navigation rarely shows the loading state. */
function usePrefetchRoutes() {
  useEffect(() => {
    const prefetch = () => {
      void loadShop();
      void loadProduct();
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 1500);
    return () => clearTimeout(id);
  }, []);
}
export default function App() {
  usePrefetchRoutes();
  return (
    <ErrorBoundary>
      <Shell>
        {/* The fallback fills the viewport so the footer never appears and then jumps when a route chunk arrives. */}
        <Suspense
          fallback={
            <div className="page-loading" role="status">
              <span>Preparing your ritual…</span>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="*"
              element={
                <EmptyState
                  title="A little off the path."
                  text="This page doesn’t exist. Your next ritual is waiting in the collection."
                  pageTitle="Page not found"
                />
              }
            />
          </Routes>
        </Suspense>
      </Shell>
    </ErrorBoundary>
  );
}
