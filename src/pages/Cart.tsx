import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Minus, Plus, Trash2 } from "lucide-react";
import { useStore, revalidate } from "../domain/store";
import type { CartLine } from "../domain/store";
import { products, money } from "../domain/catalog";
import { cases, keycaps } from "../domain/builder";
import { Keyboard, ProductArt } from "../ui/Keyboard";
import { Empty } from "../ui/shared";
export function CartContents({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const cart = useStore((s) => s.cart),
    quantity = useStore((s) => s.quantity),
    remove = useStore((s) => s.remove),
    restore = useStore((s) => s.restore);
  const [removed, setRemoved] = useState<CartLine | null>(null);
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const errors = revalidate(cart);
  if (!cart.length && !removed)
    return (
      <Empty
        title="Room for something good."
        description="Your bag is empty. Start with an everyday essential or build something entirely yours."
      />
    );
  return (
    <>
      {removed && (
        <div className="undo-note">
          {removed.name} removed.{" "}
          <button
            onClick={() => {
              restore(removed);
              setRemoved(null);
            }}
          >
            Undo
          </button>
        </div>
      )}
      <div className={compact ? "cart-layout compact" : "cart-layout"}>
        <div>
          {cart.map((line) => {
            const p = products.find((x) => x.id === line.product);
            return (
              <article className="cart-line" key={line.id}>
                <div className="cart-art">
                  {line.config ? (
                    <Keyboard
                      color={
                        cases.find((x) => x.id === line.config!.case)!.color
                      }
                      caps={
                        keycaps.find((x) => x.id === line.config!.keycap)!.color
                      }
                    />
                  ) : p ? (
                    <ProductArt
                      product={p}
                      color={
                        p.variants.find((v) => v.id === line.variant)?.color
                      }
                    />
                  ) : null}
                </div>
                <div className="cart-line-copy">
                  <h3>{line.name}</h3>
                  <p>{line.option}</p>
                  <strong>{money(line.price)}</strong>
                  <div className="cart-line-actions">
                    <div className="quantity">
                      <button
                        aria-label={`Decrease ${line.name} quantity`}
                        onClick={() => quantity(line.id, line.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <output>{line.quantity}</output>
                      <button
                        aria-label={`Increase ${line.name} quantity`}
                        onClick={() => quantity(line.id, line.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {line.config && (
                      <Link
                        onClick={onNavigate}
                        className="text-link"
                        to={`/build?edit=${encodeURIComponent(line.id)}`}
                      >
                        Edit build
                      </Link>
                    )}
                    <button
                      className="icon"
                      aria-label={`Remove ${line.name}`}
                      onClick={() => {
                        setRemoved(line);
                        remove(line.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <strong className="line-total">
                  {money(line.price * line.quantity)}
                </strong>
              </article>
            );
          })}
        </div>
        {cart.length > 0 && (
          <aside className="cart-summary">
            <p className="eyebrow">THE GOOD STUFF, TOGETHER</p>
            <h2>Your order summary.</h2>
            <dl className="bill">
              <div>
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div>
                <dt>Demo shipping estimate</dt>
                <dd>{subtotal >= 15000 ? "On us" : money(900)}</dd>
              </div>
              <div>
                <dt>Tax</dt>
                <dd>Not collected in demo</dd>
              </div>
            </dl>
            <div className="summary-total">
              <span>Estimated total</span>
              <strong>{money(subtotal + (subtotal >= 15000 ? 0 : 900))}</strong>
            </div>
            {errors.length > 0 && (
              <div className="error-banner" role="alert">
                {errors.map((e) => (
                  <p key={e}>{e}</p>
                ))}
              </div>
            )}
            {!errors.length && (
              <Link
                onClick={onNavigate}
                className="button primary full"
                to="/checkout"
              >
                Continue to demo checkout
                <ArrowUpRight size={18} />
              </Link>
            )}
            <p className="small muted">
              Portfolio demo. No payment is collected and no products ship. Your
              bag does not reserve stock.
            </p>
            {compact && (
              <Link onClick={onNavigate} className="text-link" to="/cart">
                View full bag →
              </Link>
            )}
          </aside>
        )}
      </div>
    </>
  );
}
export default function Cart() {
  return (
    <div className="page">
      <p className="eyebrow">GOOD CHOICES START HERE</p>
      <h1>Your bag.</h1>
      <CartContents />
    </div>
  );
}
