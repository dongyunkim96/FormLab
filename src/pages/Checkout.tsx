import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useStore, revalidate } from "../domain/store";
import { money } from "../domain/catalog";
import { Empty } from "../ui/shared";
const schema = z.object({
  email: z.email("Enter a valid email address."),
  name: z.string().trim().min(2, "Enter your full name."),
  address: z.string().trim().min(5, "Enter a street address."),
  city: z.string().trim().min(2, "Enter a city."),
  region: z.string().trim().min(2, "Enter your state."),
  postal: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid US ZIP code."),
  consent: z
    .boolean()
    .refine((v) => v, "Confirm that you understand this is a demonstration."),
});
type FormValues = z.infer<typeof schema>;
export default function Checkout() {
  const cart = useStore((s) => s.cart),
    createOrder = useStore((s) => s.order);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const subtotal = cart.reduce((s, x) => s + x.price * x.quantity, 0),
    shipping = subtotal >= 15000 ? 0 : 900;
  const issues = revalidate(cart);
  if (!cart.length)
    return (
      <Empty
        title="Your bag is waiting."
        description="Add something you love before heading to checkout."
      />
    );
  return (
    <div className="page checkout-page">
      <p className="eyebrow">ONE LAST DETAIL</p>
      <h1>Make it yours.</h1>
      <div className="demo-banner">
        <ShieldCheck size={22} />
        <div>
          <strong>Demo checkout · No payment collected</strong>
          <p>
            Use fictional details. No card information is needed. Nothing will
            be shipped.
          </p>
        </div>
      </div>
      <div className="checkout-layout">
        <form
          noValidate
          onSubmit={handleSubmit(async (values) => {
            try {
              setError("");
              const order = createOrder(values.email);
              navigate(`/orders/${order.reference}`, { replace: true });
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Unable to create demo order.",
              );
            }
          })}
        >
          <h2>Where would it go?</h2>
          <p className="muted small">
            Guest checkout · United States only for this demo. Address fields
            are validated but are not saved.
          </p>
          <div className="form-grid">
            {[
              {
                id: "email",
                label: "Email address",
                auto: "email",
                type: "email",
              },
              { id: "name", label: "Full name", auto: "name" },
              {
                id: "address",
                label: "Street address",
                auto: "street-address",
              },
              { id: "city", label: "City", auto: "address-level2" },
              { id: "region", label: "State", auto: "address-level1" },
              { id: "postal", label: "ZIP code", auto: "postal-code" },
            ].map((f) => (
              <label
                key={f.id}
                className={
                  ["email", "name", "address"].includes(f.id) ? "wide" : ""
                }
              >
                {f.label}
                <input
                  type={f.type || "text"}
                  autoComplete={f.auto}
                  aria-label={f.label}
                  {...register(f.id as keyof FormValues)}
                  aria-invalid={!!errors[f.id as keyof FormValues]}
                  aria-describedby={
                    errors[f.id as keyof FormValues]
                      ? `${f.id}-error`
                      : undefined
                  }
                />
                {errors[f.id as keyof FormValues] && (
                  <span className="form-error" id={`${f.id}-error`}>
                    {errors[f.id as keyof FormValues]?.message}
                  </span>
                )}
              </label>
            ))}
          </div>
          <label className="check consent">
            <input type="checkbox" {...register("consent")} />I understand this
            is a simulated order with no payment or delivery.
          </label>
          {errors.consent && (
            <p role="alert" className="form-error">
              {errors.consent.message}
            </p>
          )}
          {error && (
            <p role="alert" className="error-banner">
              {error}
            </p>
          )}
          {issues.map((x) => (
            <p className="error-banner" role="alert" key={x}>
              {x}
            </p>
          ))}
          <button
            className="button primary full"
            disabled={isSubmitting || issues.length > 0}
          >
            {isSubmitting ? "Creating demo order…" : "Place demo order"}
            <ArrowUpRight size={18} />
          </button>
        </form>
        <aside className="cart-summary">
          <h2>A good-looking lineup.</h2>
          {cart.map((x) => (
            <div className="review-line" key={x.id}>
              <strong>
                {x.name} × {x.quantity}
              </strong>
              <span>{money(x.price * x.quantity)}</span>
              <small>{x.option}</small>
            </div>
          ))}
          <dl className="bill">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div>
              <dt>Demo shipping</dt>
              <dd>{shipping ? money(shipping) : "Free"}</dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>Not collected</dd>
            </div>
          </dl>
          <div className="summary-total">
            <span>Demo total</span>
            <strong>{money(subtotal + shipping)}</strong>
          </div>
          <Link className="text-link" to="/cart">
            ← Edit your bag
          </Link>
        </aside>
      </div>
    </div>
  );
}
export function OrderResult() {
  const { publicReference } = useParams();
  const order = useStore((s) =>
    s.orders.find((x) => x.reference === publicReference),
  );
  if (!order)
    return (
      <Empty
        title="Order not found on this device."
        description="Demo orders live only in the browser where they were created. Clearing site data removes them."
      />
    );
  return (
    <div className="page order-page">
      <div className="success-icon">
        <Check size={32} />
      </div>
      <p className="eyebrow">A LITTLE MORE YOU.</p>
      <h1>Good things took form.</h1>
      <p className="lede">
        Your demo order is complete. No payment was collected.
      </p>
      <div className="order-receipt">
        <p className="mono">{order.reference} · SIMULATED ORDER</p>
        <p>
          {new Date(order.date).toLocaleDateString("en-US")} · {order.email}
        </p>
        <p className="small muted">
          No confirmation email is sent. This receipt is stored in this browser.
        </p>
        {order.lines.map((x) => (
          <div className="review-line" key={x.id}>
            <strong>
              {x.name} × {x.quantity}
            </strong>
            <span>{money(x.price * x.quantity)}</span>
            <small>{x.option}</small>
          </div>
        ))}
        <dl className="bill">
          <div>
            <dt>Subtotal</dt>
            <dd>{money(order.subtotal)}</dd>
          </div>
          <div>
            <dt>Demo shipping estimate</dt>
            <dd>{money(order.shipping)}</dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd>Not collected</dd>
          </div>
        </dl>
        <div className="summary-total">
          <span>Demo total</span>
          <strong>{money(order.total)}</strong>
        </div>
      </div>
      <Link className="button primary" to="/shop">
        Keep exploring
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
