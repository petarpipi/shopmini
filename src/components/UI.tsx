import {
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { formatMoney } from "../data/products";
import { useStore } from "../state/Store";
import { MAX_QUANTITY, startingPriceCents } from "../lib/commerce";
import { usePageMeta } from "../lib/usePageMeta";
export function ArrowLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="arrow-link" to={to}>
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
export const productImage = (product: Product, width: 480 | 960 = 960) =>
  width === 480 ? product.image.replace(".webp", "-480.webp") : product.image;
export const productSrcSet = (product: Product) =>
  `${productImage(product, 480)} 480w, ${product.image} 960w`;
/** Briefly true after `trigger` is called; used for restrained confirmation states. */
export function useFlash(duration = 1600) {
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [
    active,
    () => {
      clearTimeout(timer.current);
      setActive(true);
      timer.current = setTimeout(() => setActive(false), duration);
    },
  ] as const;
}
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { wishlist, toggleWishlist, add } = useStore();
  const [added, flashAdded] = useFlash();
  const saved = wishlist.includes(product.id);
  const size = product.variants[0].name;
  const multipleSizes = product.variants.length > 1;
  return (
    <article className="product-card" data-testid="product-card">
      <div className="product-photo">
        <Link
          to={`/product/${product.slug}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={productImage(product, 480)}
            srcSet={productSrcSet(product)}
            sizes="(max-width: 600px) 46vw, (max-width: 1100px) 31vw, 330px"
            alt=""
            loading={priority ? "eager" : "lazy"}
            width="960"
            height="1440"
          />
        </Link>
        {!product.inStock ? (
          <span className="product-badge muted-badge">Coming back soon</span>
        ) : (
          product.featured && <span className="product-badge">The essentials</span>
        )}
        <button
          className="favorite-button icon-button"
          aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={19} strokeWidth={1.6} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
        </button>
        {product.inStock && (
          <button
            className={`quick-add ${added ? "is-added" : ""}`}
            onClick={() => {
              if (add(product.id, size)) flashAdded();
            }}
            aria-label={`Add ${product.name}, ${size}, to bag`}
          >
            <span className="quick-add-label">
              {added ? "Added to bag" : "Add to bag"}
            </span>
            <span className="quick-add-size">{size}</span>
            <span className="quick-add-icon" aria-hidden="true">
              {added ? <Check size={17} /> : <Plus size={17} />}
            </span>
          </button>
        )}
      </div>
      <div className="product-meta">
        <span>{product.category}</span>
        <span>
          {multipleSizes
            ? product.variants.map((variant) => variant.name).join(" · ")
            : size}
        </span>
      </div>
      <div className="product-name-row">
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <span className="product-price">
          {multipleSizes && <small>From </small>}
          {formatMoney(startingPriceCents(product))}
        </span>
      </div>
      <p className="product-description">{product.note}</p>
    </article>
  );
}
export function Quantity({
  value,
  onChange,
  label = "Quantity",
  max = MAX_QUANTITY,
  describedBy,
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  max?: number;
  describedBy?: string;
}) {
  return (
    <div
      className="quantity"
      role="group"
      aria-label={label}
      aria-describedby={describedBy}
    >
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <output aria-live="polite" aria-label={label}>
        <span key={value}>{value}</span>
      </output>
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
export function EmptyState({
  title,
  text,
  icon = "bag",
  pageTitle,
}: {
  title: string;
  text: string;
  icon?: "bag" | "heart" | "check";
  pageTitle?: string;
}) {
  usePageMeta(pageTitle ?? title);
  const Icon =
    icon === "heart" ? Heart : icon === "check" ? Check : ShoppingBag;
  return (
    <section className="empty-state container">
      <Icon size={38} strokeWidth={1} aria-hidden="true" />
      <h1>{title}</h1>
      <p>{text}</p>
      <Link className="button" to="/shop">
        Explore the collection <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </section>
  );
}
export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <span aria-hidden="true">/</span>
      <Link to="/shop">Collection</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <header className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </header>
  );
}
