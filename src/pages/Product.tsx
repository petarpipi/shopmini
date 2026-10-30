import { ArrowRight, Check, Heart, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatMoney, products } from "../data/products";
import type { Product as ProductModel } from "../data/products";
import {
  Breadcrumb,
  EmptyState,
  ProductCard,
  productImage,
  productSrcSet,
  Quantity,
  useFlash,
} from "../components/UI";
import { MAX_QUANTITY, quantityInCart } from "../lib/commerce";
import { usePageMeta } from "../lib/usePageMeta";
import { useStore } from "../state/Store";
/** True while the main purchase controls are outside the viewport; the compact mobile purchase bar is shown only then. */
function useOutOfView(target: React.RefObject<HTMLElement | null>) {
  const [outside, setOutside] = useState(false);
  useEffect(() => {
    const node = target.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOutside(!entry.isIntersecting),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);
  return outside;
}
function ProductContent({ product }: { product: ProductModel }) {
  usePageMeta(product.name, `${product.name} — ${product.description}`);
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { cart, wishlist, toggleWishlist, add } = useStore();
  const [added, flashAdded] = useFlash();
  const buy = useRef<HTMLDivElement>(null);
  const buyOutOfView = useOutOfView(buy);
  const variant = product.variants[variantIndex];
  const saved = wishlist.includes(product.id);
  const price = product.priceCents + variant.extraCents;
  const inBag = quantityInCart(cart, product.id, variant.name);
  const allowance = MAX_QUANTITY - inBag;
  const selected = Math.max(1, Math.min(quantity, allowance));
  const canBuy = product.inStock && allowance > 0;
  const showBar = buyOutOfView && product.inStock;
  useEffect(() => {
    document.body.toggleAttribute("data-sticky-buy", showBar);
    return () => document.body.removeAttribute("data-sticky-buy");
  }, [showBar]);
  const addToBag = () => {
    if (add(product.id, variant.name, selected)) {
      flashAdded();
      setQuantity(1);
    }
  };
  const buyLabel = !product.inStock
    ? "Currently unavailable"
    : !canBuy
      ? "Maximum already in your bag"
      : added
        ? "Added to your bag"
        : `Add to bag — ${formatMoney(price * selected)}`;
  return (
    <div className="container product-page">
      <Breadcrumb current={product.name} />
      <div className="product-detail">
        <header className="product-summary">
          <span className="eyebrow">{product.category} · The everyday collection</span>
          <h1>{product.name}</h1>
          <p className="product-tagline">{product.note}</p>
          <p className="detail-price">
            <span key={price} className="price-value">
              {formatMoney(price)}
            </span>
            <span className="detail-price-size">{variant.name}</span>
          </p>
        </header>
        <figure className="product-figure">
          <div className="product-figure-frame">
            <img
              src={product.image}
              srcSet={productSrcSet(product)}
              sizes="(max-width: 800px) calc(100vw - 36px), 52vw"
              alt={`AURA ${product.name} concept packaging on warm travertine`}
              width="960"
              height="1440"
              fetchPriority="high"
            />
          </div>
          <figcaption className="fine-print">
            AI-created packaging concept for a fictional product. Rendered
            labels and volumes may differ from the selected size.
          </figcaption>
        </figure>
        <div className="product-purchase">
          <p className="detail-description">{product.description}</p>
          <fieldset className="variant-options">
            <legend>
              Size <span>{variant.name}</span>
            </legend>
            <div className="variant-list">
              {product.variants.map((option, index) => (
                <label
                  key={option.name}
                  className={variantIndex === index ? "selected" : ""}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={option.name}
                    checked={variantIndex === index}
                    onChange={() => setVariantIndex(index)}
                  />
                  <span>{option.name}</span>
                  <span className="variant-price">
                    {formatMoney(product.priceCents + option.extraCents)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className={`stock-note ${product.inStock ? "" : "unavailable"}`}>
            <span aria-hidden="true" />
            {product.inStock
              ? "In stock · ready for your ritual"
              : "Currently unavailable · save it for later"}
          </p>
          <div className="detail-buy" ref={buy}>
            {product.inStock && (
              <Quantity
                value={selected}
                onChange={setQuantity}
                max={Math.max(1, allowance)}
                describedBy="quantity-note"
              />
            )}
            <button
              className={`button ${added ? "is-added" : ""}`}
              disabled={!canBuy}
              onClick={addToBag}
            >
              {buyLabel}
              {added ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <ArrowRight size={18} aria-hidden="true" />
              )}
            </button>
          </div>
          {product.inStock && (
            <p
              id="quantity-note"
              className={`quantity-note ${allowance === 0 ? "at-limit" : ""}`}
              aria-live="polite"
            >
              {allowance === 0
                ? `Your bag already holds the maximum of ${MAX_QUANTITY} in ${variant.name}. Adjust it in your bag, or choose another size.`
                : inBag > 0
                  ? `${inBag} already in your bag · up to ${allowance} more in ${variant.name}.`
                  : `Up to ${MAX_QUANTITY} per size.`}
            </p>
          )}
          <button
            className="detail-wishlist text-button"
            aria-pressed={saved}
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart
              size={18}
              fill={saved ? "currentColor" : "none"}
              aria-hidden="true"
            />
            {saved ? "Saved to your wishlist" : "Save to your wishlist"}
          </button>
          <div className="detail-shipping">
            <Package size={20} strokeWidth={1.2} aria-hidden="true" />
            <p>
              Complimentary demo shipping from €75.
              <br />
              <span>Portfolio concept. No real purchase or delivery.</span>
            </p>
          </div>
          <div className="accordions">
            <details open>
              <summary>The texture & ritual</summary>
              <p>
                <strong>{product.texture}.</strong> {product.ritual}
              </p>
            </details>
            <details>
              <summary>Considered ingredients</summary>
              <p>
                {product.ingredients} This is an illustrative product concept,
                not a final formulation or a statement of tested benefits.
              </p>
            </details>
            <details>
              <summary>Packaging & care</summary>
              <p>
                Our design concept pairs understated vessels with paper labels
                and simple outer packaging. Materials and recyclability have not
                been certified. Keep the fictional product away from heat and
                direct sunlight.
              </p>
            </details>
            <details>
              <summary>Delivery & the demo</summary>
              <p>
                Shipping is simulated at €4.90, or complimentary for a bag of
                €75 or more. No order is transmitted and no money is charged.
              </p>
            </details>
          </div>
          <p className="fine-print">
            <Check size={14} aria-hidden="true" /> Thoughtful design. No
            clinical or medical claims.
          </p>
        </div>
      </div>
      <section className="section related-products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A little more to explore</span>
            <h2>
              Complete your <em>ritual.</em>
            </h2>
          </div>
          <Link className="arrow-link" to="/shop">
            All essentials <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="product-grid three-products">
          {products
            .filter(
              (item) =>
                item.id !== product.id &&
                (item.category === product.category || item.featured),
            )
            .slice(0, 3)
            .map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>
      {product.inStock && (
        <div
          className={`sticky-buy ${showBar ? "visible" : ""}`}
          inert={!showBar}
          data-testid="sticky-buy"
        >
          <img src={productImage(product, 480)} alt="" width="40" height="60" />
          <p>
            <strong>{product.name}</strong>
            <span>
              {variant.name} · {formatMoney(price)}
            </span>
          </p>
          <button className="button" disabled={!canBuy} onClick={addToBag}>
            {canBuy ? (added ? "Added" : "Add to bag") : "At limit"}
          </button>
        </div>
      )}
    </div>
  );
}
export default function Product() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  return product ? (
    <ProductContent key={product.id} product={product} />
  ) : (
    <EmptyState
      title="An essential we couldn’t find."
      text="This product isn’t in our collection. There’s something else waiting for you."
      pageTitle="Product not found"
    />
  );
}
