import { ArrowRight, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney, getProduct } from "../data/products";
import {
  FREE_SHIPPING_CENTS,
  itemCount,
  lineTotal,
  totals,
} from "../lib/commerce";
import type { CartItem } from "../lib/commerce";
import { productImage } from "./UI";
export function OrderSummary({
  cart,
  checkout = false,
}: {
  cart: CartItem[];
  checkout?: boolean;
}) {
  const amounts = totals(cart);
  const count = itemCount(cart);
  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <span className="eyebrow">Your everyday essentials</span>
      <h2 id="order-summary-title">Order summary</h2>
      {checkout && (
        <ul className="summary-items" aria-label={`${count} items in your bag`}>
          {cart.map((item) => {
            const product = getProduct(item.productId)!;
            return (
              <li key={`${item.productId}-${item.variant}`}>
                <span className="summary-thumb">
                  <img src={productImage(product, 480)} alt="" width="48" height="64" />
                  <span aria-hidden="true">{item.quantity}</span>
                </span>
                <span className="summary-name">
                  {product.name}
                  <small>
                    {item.variant} · Qty {item.quantity}
                  </small>
                </span>
                <span>{formatMoney(lineTotal(item))}</span>
              </li>
            );
          })}
        </ul>
      )}
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd data-testid="subtotal">{formatMoney(amounts.subtotal)}</dd>
        </div>
        <div>
          <dt>Estimated demo shipping</dt>
          <dd data-testid="shipping">
            {amounts.shipping === 0
              ? "Complimentary"
              : formatMoney(amounts.shipping)}
          </dd>
        </div>
        <div className="total-row">
          <dt>
            Total <span>EUR</span>
          </dt>
          <dd data-testid="total" key={amounts.total} className="summary-total">
            {formatMoney(amounts.total)}
          </dd>
        </div>
      </dl>
      <p className="fine-print">
        Illustrative prices include concept taxes. No payment is taken.
      </p>
      {!checkout && (
        <Link className="button" to="/checkout">
          Proceed to demo checkout <ArrowRight size={17} aria-hidden="true" />
        </Link>
      )}
      <p className="summary-lock">
        <LockKeyhole size={15} aria-hidden="true" /> Demo only · no payment
        details collected
      </p>
      <div className="shipping-progress">
        <p>
          {amounts.subtotal >= FREE_SHIPPING_CENTS
            ? "Your bag qualifies for complimentary demo shipping."
            : `${formatMoney(FREE_SHIPPING_CENTS - amounts.subtotal)} away from complimentary demo shipping.`}
        </p>
        <progress
          max={FREE_SHIPPING_CENTS}
          value={Math.min(amounts.subtotal, FREE_SHIPPING_CENTS)}
          aria-label="Progress toward complimentary shipping"
        />
      </div>
    </aside>
  );
}
