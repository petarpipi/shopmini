import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney, getProduct } from "../data/products";
import { itemCount, lineTotal, MAX_QUANTITY, unitPrice } from "../lib/commerce";
import { usePageMeta } from "../lib/usePageMeta";
import { useStore } from "../state/Store";
import {
  EmptyState,
  PageIntro,
  productImage,
  Quantity,
} from "../components/UI";
import { OrderSummary } from "../components/OrderSummary";
export default function Cart() {
  const { cart, update, remove } = useStore();
  usePageMeta("Your bag");
  if (!cart.length)
    return (
      <EmptyState
        title="A little space for something lovely."
        text="Your bag is empty. Discover the essentials and find your everyday ritual."
        pageTitle="Your bag"
      />
    );
  const count = itemCount(cart);
  return (
    <div className="container cart-page">
      <PageIntro
        eyebrow="A little care, chosen by you"
        title="Your shopping bag."
        text="Considered essentials for your everyday."
      />
      <div className="cart-layout">
        <section aria-labelledby="bag-items-heading">
          <div className="cart-table-heading">
            <h2 id="bag-items-heading">
              Your essentials ({count} {count === 1 ? "item" : "items"})
            </h2>
            <span aria-hidden="true">Quantity / total</span>
          </div>
          {cart.map((item) => {
            const product = getProduct(item.productId)!;
            const atLimit = item.quantity >= MAX_QUANTITY;
            const noteId = `limit-${item.productId}-${item.variant.replace(/\s/g, "")}`;
            return (
              <article
                className="cart-item"
                key={`${item.productId}-${item.variant}`}
              >
                <Link
                  className="cart-image"
                  to={`/product/${product.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={productImage(product, 480)}
                    alt=""
                    width="110"
                    height="145"
                  />
                </Link>
                <div className="cart-item-information">
                  <span className="eyebrow">{product.category}</span>
                  <h3>
                    <Link to={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <p>
                    {item.variant} <span aria-hidden="true">·</span>{" "}
                    {formatMoney(unitPrice(item) ?? 0)} each
                  </p>
                  <Quantity
                    label={`Quantity for ${product.name} ${item.variant}`}
                    value={item.quantity}
                    onChange={(quantity) => update(item, quantity)}
                    describedBy={atLimit ? noteId : undefined}
                  />
                  {atLimit && (
                    <p className="quantity-note at-limit" id={noteId}>
                      Limit of {MAX_QUANTITY} per size reached.
                    </p>
                  )}
                </div>
                <div className="cart-item-end">
                  <button
                    className="icon-button"
                    aria-label={`Remove ${product.name} ${item.variant} from bag`}
                    onClick={() => remove(item)}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                  <strong key={item.quantity} className="line-total">
                    {formatMoney(lineTotal(item))}
                  </strong>
                </div>
              </article>
            );
          })}
          <Link className="arrow-link continue-shopping" to="/shop">
            <ArrowLeft size={17} aria-hidden="true" /> Continue shopping
          </Link>
        </section>
        <OrderSummary cart={cart} />
      </div>
    </div>
  );
}
