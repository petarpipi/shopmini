import {
  ArrowRight,
  ArrowUp,
  Check,
  Heart,
  Info,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { categories } from "../data/products";
import { isEmail, itemCount } from "../lib/commerce";
import { useStore } from "../state/Store";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
    setEmail("");
  };
  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div>
        <span className="eyebrow">A letter, on occasion</span>
        <h2 id="newsletter-title">
          A little more <em>AURA.</em>
        </h2>
        <p>Notes on thoughtful living, new rituals, and everyday beauty.</p>
      </div>
      <div className="newsletter-right">
        {done ? (
          <p role="status" className="success-message">
            <Check size={20} aria-hidden="true" /> You’re on the demo list. No
            email was stored or sent.
          </p>
        ) : (
          <form onSubmit={submit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">
              Email for the demo newsletter
            </label>
            <div className="newsletter-input">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={`newsletter-note${error ? " newsletter-error" : ""}`}
                autoComplete="email"
                maxLength={160}
              />
              <button aria-label="Join demo newsletter" type="submit">
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            </div>
            {error && (
              <p id="newsletter-error" className="field-error" role="alert">
                {error}
              </p>
            )}
            <p id="newsletter-note" className="fine-print">
              A portfolio demonstration. No subscription or emails.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const { cart, wishlist, toast, storageUnavailable } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [panel, setPanel] = useState<"menu" | "search" | null>(null);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    setPanel(null);
    if (previousPath.current !== location.pathname)
      main.current?.focus({ preventScroll: true });
    previousPath.current = location.pathname;
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const scrollToSection = () => {
      const section = document.getElementById(location.hash.slice(1));
      if (!section) return false;
      section.scrollIntoView({ behavior: "instant" });
      return true;
    };
    if (scrollToSection()) return;
    const observer = new MutationObserver(() => {
      if (scrollToSection()) observer.disconnect();
    });
    if (main.current)
      observer.observe(main.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (panel) {
      if (!node.open) node.showModal();
      if (panel === "search") node.querySelector("input")?.focus();
    } else if (node.open) node.close();
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setPanel(null);
  };
  const count = itemCount(cart);
  const searchButton = (className: string) => (
    <button
      className={`icon-button ${className}`}
      aria-label="Search products"
      aria-haspopup="dialog"
      onClick={() => setPanel("search")}
    >
      <Search size={20} aria-hidden="true" />
    </button>
  );
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className="announcement" aria-label="Store announcement">
        <span>A little care goes a long way</span>
        <span className="announcement-divider" aria-hidden="true">
          ✦
        </span>
        <span>Complimentary demo shipping on orders €75+</span>
      </aside>
      <header className="site-header">
        <div className="header-inner">
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink to="/shop">Shop all</NavLink>
            <NavLink to="/about">Our philosophy</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <div className="header-start">
            <button
              className="icon-button"
              aria-label="Open navigation"
              aria-haspopup="dialog"
              onClick={() => setPanel("menu")}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
            {searchButton("mobile-search")}
          </div>
          <Link className="brand" to="/" aria-label="AURA home">
            AURA<span aria-hidden="true">The art of everyday care</span>
          </Link>
          <nav className="header-actions" aria-label="Shopping navigation">
            {searchButton("desktop-search")}
            <Link
              className="icon-button wishlist-link"
              to="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} saved ${wishlist.length === 1 ? "product" : "products"}`}
            >
              <Heart size={20} aria-hidden="true" />
              {wishlist.length > 0 && (
                <span className="counter" key={wishlist.length} aria-hidden="true">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              className="bag-link icon-button"
              to="/cart"
              aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <ShoppingBag size={20} aria-hidden="true" />
              {count > 0 && (
                <span className="counter" key={count} aria-hidden="true">
                  {count}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <dialog
        ref={dialog}
        className={`navigation-dialog ${panel === "menu" ? "menu-dialog" : "search-dialog"}`}
        onCancel={() => setPanel(null)}
        onClose={() => setPanel(null)}
        aria-labelledby="dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) setPanel(null);
        }}
      >
        <div className="dialog-content">
          <div className="dialog-heading">
            <h2 id="dialog-title">
              {panel === "search" ? "Find your ritual." : "Menu"}
            </h2>
            <button
              className="icon-button"
              aria-label="Close dialog"
              onClick={() => setPanel(null)}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          {panel === "search" ? (
            <form onSubmit={submitSearch} role="search">
              <label className="eyebrow" htmlFor="global-search">
                Search the collection
              </label>
              <div className="search-dialog-input">
                <input
                  id="global-search"
                  type="search"
                  placeholder="Try serum, cleanser, or body care"
                  value={query}
                  maxLength={80}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button
                  className="icon-button"
                  aria-label="Submit product search"
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
              <p className="muted">
                Thoughtfully chosen essentials. Find something for your
                everyday.
              </p>
            </form>
          ) : (
            panel === "menu" && (
              <>
                <nav className="mobile-navigation" aria-label="Mobile navigation">
                  {[
                    ["/", "Home"],
                    ["/shop", "Shop all"],
                    ["/about", "Our philosophy"],
                    ["/contact", "Contact"],
                  ].map(([to, label]) => (
                    <Link key={to} to={to} onClick={() => setPanel(null)}>
                      {label}
                      <ArrowRight size={20} aria-hidden="true" />
                    </Link>
                  ))}
                </nav>
                <nav className="menu-categories" aria-label="Shop by category">
                  <span className="eyebrow">Shop by category</span>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/shop?category=${encodeURIComponent(category)}`}
                      onClick={() => setPanel(null)}
                    >
                      {category}
                    </Link>
                  ))}
                </nav>
                <div className="menu-shortcuts">
                  <Link to="/wishlist" onClick={() => setPanel(null)}>
                    <Heart size={18} aria-hidden="true" /> Wishlist
                    <span>{wishlist.length}</span>
                  </Link>
                  <Link to="/cart" onClick={() => setPanel(null)}>
                    <ShoppingBag size={18} aria-hidden="true" /> Bag
                    <span>{count}</span>
                  </Link>
                </div>
              </>
            )
          )}
        </div>
      </dialog>
      {storageUnavailable && (
        <div className="storage-notice" role="status">
          Browser storage is unavailable. Your bag and wishlist will last for
          this visit.
        </div>
      )}
      <main id="main" ref={main} tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="brand" to="/">
              AURA
            </Link>
            <p>
              Considered essentials.
              <br />
              Everyday moments, made meaningful.
            </p>
            <span className="footer-wordmark-note">
              A ShopMini concept store
            </span>
          </div>
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            <Link to="/shop">All essentials</Link>
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
              >
                {category}
              </Link>
            ))}
          </nav>
          <nav aria-labelledby="footer-about">
            <h2 id="footer-about">A little about us</h2>
            <Link to="/about">Our philosophy</Link>
            <Link to="/about#packaging">Design & packaging</Link>
            <Link to="/contact">Get in touch</Link>
            <Link to="/wishlist">Your wishlist</Link>
          </nav>
          <div className="footer-demo">
            <h2>Made to be explored</h2>
            <p>
              AURA is a fictional skincare brand. All products, shipping and
              orders are part of an interactive portfolio demonstration.
            </p>
            <span>EUR € · English</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} AURA · A ShopMini portfolio project.
          </p>
          <span>No real purchases. Just a thoughtfully built experience.</span>
          <button
            className="back-top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            Back to top <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </footer>
      <div
        className={`toast ${toast ? "visible" : ""} ${toast?.tone === "info" ? "toast-info" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toast && (
          <>
            {toast.tone === "info" ? (
              <Info size={18} aria-hidden="true" />
            ) : (
              <Check size={18} aria-hidden="true" />
            )}
            <span key={toast.id}>{toast.message}</span>
            {location.pathname !== "/cart" && (
              <Link to="/cart" className="toast-link">
                View bag
              </Link>
            )}
          </>
        )}
      </div>
    </>
  );
}
