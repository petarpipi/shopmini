import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  LockKeyhole,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { formatMoney, getProduct } from "../data/products";
import {
  createDemoOrderId,
  emptyCheckout,
  firstInvalidField,
  lineTotal,
  shippingCountries,
  totals,
  validateCheckout,
} from "../lib/commerce";
import type {
  CartItem,
  CheckoutErrors,
  CheckoutFields,
} from "../lib/commerce";
import { usePageMeta } from "../lib/usePageMeta";
import { useStore } from "../state/Store";
import { EmptyState, PageIntro, productImage } from "../components/UI";
import { OrderSummary } from "../components/OrderSummary";
interface Receipt {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}
const steps = ["Your details", "Shipping", "Review"];
const labels: Record<keyof CheckoutFields, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email address",
  address: "Street address",
  city: "City",
  postalCode: "Postal code",
  country: "Country",
};
const hints: Partial<Record<keyof CheckoutFields, string>> = {
  email: "Use a sample address, for example name@example.com. Nothing is sent.",
  postalCode: "2–12 letters or numbers, for example 10115.",
};
function Confirmation({ receipt }: { receipt: Receipt }) {
  const heading = useRef<HTMLHeadingElement>(null);
  usePageMeta("Demo order complete");
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section
      className="confirmation container"
      aria-labelledby="confirmation-title"
    >
      <div className="confirmation-icon">
        <CircleCheck size={44} strokeWidth={1} aria-hidden="true" />
      </div>
      <span className="eyebrow">Demonstration complete</span>
      <h1 id="confirmation-title" ref={heading} tabIndex={-1}>
        Your ritual awaits.
      </h1>
      <p>
        You’ve reached the end of the demo checkout. This was a simulated
        order: no purchase was made and no payment was taken.
      </p>
      <div className="confirmation-receipt">
        <span>Reference {receipt.id}</span>
        <h2>Demo order summary</h2>
        <ul>
          {receipt.items.map((item) => (
            <li key={`${item.productId}-${item.variant}`}>
              <span>
                {getProduct(item.productId)?.name} · {item.variant} ×{" "}
                {item.quantity}
              </span>
              <span>{formatMoney(lineTotal(item))}</span>
            </li>
          ))}
        </ul>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatMoney(receipt.subtotal)}</dd>
          </div>
          <div>
            <dt>Demo shipping</dt>
            <dd>
              {receipt.shipping ? formatMoney(receipt.shipping) : "Complimentary"}
            </dd>
          </div>
          <div className="total-row">
            <dt>Total</dt>
            <dd>{formatMoney(receipt.total)}</dd>
          </div>
        </dl>
      </div>
      <p className="demo-confirmation-note">
        No order was sent to a business and no confirmation email will be
        sent. Customer details have been cleared from this page’s memory, and
        this summary disappears when you leave or refresh the page.
      </p>
      <Link className="button" to="/shop">
        Keep exploring <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </section>
  );
}
export default function Checkout() {
  const { cart, clearCart } = useStore();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<CheckoutFields>({ ...emptyCheckout });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false);
  usePageMeta(receipt ? "Demo order complete" : "Demo checkout");
  const move = (next: number) => {
    setStep(next);
    setErrors({});
    setSummaryVisible(false);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const showErrors = (nextErrors: CheckoutErrors) => {
    setErrors(nextErrors);
    setSummaryVisible(true);
    const first = firstInvalidField(nextErrors);
    requestAnimationFrame(() => first && document.getElementById(first)?.focus());
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (step < 2) {
      const nextErrors = validateCheckout(values, step);
      if (Object.keys(nextErrors).length) return showErrors(nextErrors);
      move(step + 1);
      return;
    }
    const detailsErrors = validateCheckout(values, 0);
    const shippingErrors = validateCheckout(values, 1);
    if (Object.keys(detailsErrors).length || Object.keys(shippingErrors).length) {
      const target = Object.keys(detailsErrors).length ? 0 : 1;
      setStep(target);
      showErrors(target === 0 ? detailsErrors : shippingErrors);
      return;
    }
    if (submitted.current || !cart.length) return;
    submitted.current = true;
    setReceipt({ id: createDemoOrderId(), items: [...cart], ...totals(cart) });
    setValues({ ...emptyCheckout });
    clearCart();
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const describedBy = (name: keyof CheckoutFields) =>
    [hints[name] && `${name}-hint`, errors[name] && `${name}-error`]
      .filter(Boolean)
      .join(" ") || undefined;
  const fieldMessages = (name: keyof CheckoutFields) => (
    <>
      {hints[name] && (
        <p className="field-hint" id={`${name}-hint`}>
          {hints[name]}
        </p>
      )}
      {errors[name] && (
        <p className="field-error" id={`${name}-error`}>
          <CircleAlert size={15} aria-hidden="true" />
          {errors[name]}
        </p>
      )}
    </>
  );
  const field = (
    name: keyof CheckoutFields,
    autoComplete: string,
    type = "text",
    wide = false,
  ) => (
    <div className={`form-field ${wide ? "full-width" : ""}`}>
      <label htmlFor={name}>
        {labels[name]} <span aria-hidden="true">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={type === "email" ? "email" : undefined}
        value={values[name]}
        maxLength={160}
        required
        aria-invalid={Boolean(errors[name])}
        aria-describedby={describedBy(name)}
        onChange={(event) => {
          setValues((current) => ({ ...current, [name]: event.target.value }));
          setErrors((current) => ({ ...current, [name]: undefined }));
        }}
      />
      {fieldMessages(name)}
    </div>
  );
  if (receipt) return <Confirmation receipt={receipt} />;
  if (!cart.length)
    return (
      <EmptyState
        title="Start with a little something."
        text="Your shopping bag is empty. Add an essential before exploring the demo checkout."
        pageTitle="Demo checkout"
      />
    );
  const errorList = (Object.keys(errors) as (keyof CheckoutFields)[]).filter(
    (name) => errors[name],
  );
  return (
    <div className="container checkout-page">
      <PageIntro eyebrow="A few simple steps" title="Demo checkout." />
      <div className="demo-banner">
        <LockKeyhole size={21} aria-hidden="true" />
        <p>
          <strong>This is a demonstration checkout.</strong> Use sample details.
          Nothing is transmitted, no order is submitted, and there is no
          payment step.
        </p>
      </div>
      <div className="checkout-layout">
        <div>
          <ol className="checkout-steps" aria-label="Checkout progress">
            {steps.map((label, index) => (
              <li
                key={label}
                className={
                  step === index ? "current" : step > index ? "complete" : ""
                }
                aria-current={step === index ? "step" : undefined}
              >
                <span className="step-marker" aria-hidden="true">
                  {step > index ? <Check size={15} /> : index + 1}
                </span>
                {index < step ? (
                  <button type="button" onClick={() => move(index)}>
                    {label}
                    <span className="sr-only">, completed — edit</span>
                  </button>
                ) : (
                  <span>
                    {label}
                    <span className="sr-only">
                      {step === index ? ", current step" : ", not started"}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ol>
          <form onSubmit={submit} noValidate>
            <div className="checkout-step" key={step}>
              <p className="step-count">
                Step {step + 1} of {steps.length}
              </p>
              <h2 className="checkout-step-title" ref={heading} tabIndex={-1}>
                {step === 0
                  ? "A little introduction."
                  : step === 1
                    ? "Where would it go?"
                    : "One last look."}
              </h2>
              {step < 2 && (
                <p className="form-intro">
                  {step === 0
                    ? "Please use fictional details to explore this portfolio demo."
                    : "Shipping is simulated. Use a sample address."}{" "}
                  Fields marked * are required.
                </p>
              )}
              {summaryVisible && errorList.length > 0 && (
                <div className="error-summary" role="alert">
                  <CircleAlert size={20} aria-hidden="true" />
                  <div>
                    <p>
                      Please check {errorList.length}{" "}
                      {errorList.length === 1 ? "field" : "fields"}:
                    </p>
                    <ul>
                      {errorList.map((name) => (
                        <li key={name}>
                          <a
                            href={`#${name}`}
                            onClick={(event) => {
                              event.preventDefault();
                              document.getElementById(name)?.focus();
                            }}
                          >
                            {labels[name]} — {errors[name]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {step === 0 && (
                <div className="form-grid">
                  {field("firstName", "given-name")}
                  {field("lastName", "family-name")}
                  {field("email", "email", "email", true)}
                </div>
              )}
              {step === 1 && (
                <div className="form-grid">
                  {field("address", "street-address", "text", true)}
                  {field("city", "address-level2")}
                  {field("postalCode", "postal-code")}
                  <div className="form-field full-width">
                    <label htmlFor="country">
                      Country <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      required
                      value={values.country}
                      aria-invalid={Boolean(errors.country)}
                      aria-describedby={describedBy("country")}
                      onChange={(event) => {
                        setValues((current) => ({
                          ...current,
                          country: event.target.value,
                        }));
                        setErrors((current) => ({
                          ...current,
                          country: undefined,
                        }));
                      }}
                    >
                      <option value="">Select a demo destination</option>
                      {shippingCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {fieldMessages("country")}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="checkout-review">
                  <div className="review-block">
                    <div>
                      <h3>Your details</h3>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => move(0)}
                      >
                        Edit details
                      </button>
                    </div>
                    <p>
                      {values.firstName} {values.lastName}
                      <br />
                      {values.email}
                    </p>
                  </div>
                  <div className="review-block">
                    <div>
                      <h3>Demo shipping address</h3>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => move(1)}
                      >
                        Edit shipping
                      </button>
                    </div>
                    <p>
                      {values.address}
                      <br />
                      {values.postalCode} {values.city}
                      <br />
                      {values.country}
                    </p>
                  </div>
                  <div className="review-products">
                    <h3>Your essentials</h3>
                    {cart.map((item) => {
                      const product = getProduct(item.productId)!;
                      return (
                        <div key={`${item.productId}-${item.variant}`}>
                          <img
                            src={productImage(product, 480)}
                            alt=""
                            width="58"
                            height="76"
                          />
                          <p>
                            <strong>{product.name}</strong>
                            <span>
                              {item.variant} · Quantity {item.quantity}
                            </span>
                          </p>
                          <span>{formatMoney(lineTotal(item))}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="review-demo-note">
                    Selecting “Complete demo order” only shows a simulated
                    confirmation. There is no payment step and no purchase
                    agreement.
                  </p>
                </div>
              )}
            </div>
            <div className="checkout-controls">
              {step > 0 ? (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => move(step - 1)}
                >
                  <ArrowLeft size={16} aria-hidden="true" /> Back
                </button>
              ) : (
                <Link className="text-button" to="/cart">
                  <ArrowLeft size={16} aria-hidden="true" /> Back to bag
                </Link>
              )}
              <button className="button" type="submit">
                {step === 2
                  ? "Complete demo order"
                  : step === 0
                    ? "Continue to shipping"
                    : "Review your order"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
        <OrderSummary cart={cart} checkout />
      </div>
    </div>
  );
}
