import { useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Plus, Minus, ArrowUpRight } from "lucide-react";
import { products, money } from "../domain/catalog";
import { useStore, lineIdentity } from "../domain/store";
import { ProductArt } from "../ui/Keyboard";
import { ProductPhoto } from "../ui/ProductPhoto";
import { ProductCard, Empty, SectionHeading } from "../ui/shared";
import { BackToShop } from "./Shop";
export default function Product() {
  const { slug } = useParams();
  const p = products.find((x) => x.slug === slug);
  const [variant, setVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [angle, setAngle] = useState(false);
  const add = useStore((s) => s.add);
  if (!p)
    return (
      <Empty
        title="Object not found"
        description="This product may have moved. Find your next favorite in the collection."
      />
    );
  const selected = p.variants.find((v) => v.id === variant);
  return (
    <div className="page">
      <BackToShop />
      <div className="product-detail">
        <div>
          <div className="detail-art">
            {angle ? (
              <ProductArt product={p} color={selected?.color} />
            ) : (
              <ProductPhoto product={p} color={selected?.color} />
            )}
          </div>
          <div className="gallery-controls">
            <button
              className={!angle ? "active" : ""}
              onClick={() => setAngle(false)}
            >
              01 / Studio image
            </button>
            <button
              className={angle ? "active" : ""}
              onClick={() => setAngle(true)}
            >
              02 / Selected finish
            </button>
          </div>
          <p className="muted small">
            AI-generated representative studio image, shared by category. View
            Selected finish for your chosen color. Product specifications define
            the actual demo item.
          </p>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{p.category.toUpperCase()} / FORM SERIES</p>
          <h1>{p.title}</h1>
          <p className="detail-price">{money(selected?.price ?? p.price)}</p>
          <p className="lede">{p.description}</p>
          <fieldset>
            <legend>
              {p.category === "Switches"
                ? "Select switch pack"
                : "Choose your finish"}
              {selected ? ` — ${selected.name}` : ""}
            </legend>
            <div className="variant-list">
              {p.variants.map((v) => (
                <button
                  key={v.id}
                  aria-pressed={variant === v.id}
                  className={variant === v.id ? "selected" : ""}
                  disabled={!v.stock}
                  onClick={() => setVariant(v.id)}
                >
                  <i style={{ background: v.color }} />
                  {v.name}
                  {!v.stock ? (
                    " · Out of stock"
                  ) : variant === v.id ? (
                    <Check size={14} />
                  ) : null}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="purchase-row">
            <div className="quantity">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={14} />
              </button>
              <output aria-label="Quantity">{quantity}</output>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              className="button primary"
              disabled={!selected || !selected.stock}
              onClick={() => {
                if (selected)
                  add({
                    id: lineIdentity({ product: p.id, variant: selected.id }),
                    product: p.id,
                    variant: selected.id,
                    name: p.title,
                    option: selected.name,
                    price: selected.price,
                    quantity,
                  });
              }}
            >
              Add to bag
              <ArrowUpRight size={18} />
            </button>
          </div>
          {!selected && (
            <p className="small muted">
              Select an option to add this object to your bag.
            </p>
          )}
          <div className="shipping-note">
            <Check size={16} /> Free demo shipping on orders $150+ · 30-day
            illustrative return policy
          </div>
          <details open>
            <summary>The details</summary>
            <dl className="specs">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div>
                <dt>SKU</dt>
                <dd>{selected?.sku || "Choose an option"}</dd>
              </div>
            </dl>
          </details>
          <details>
            <summary>Compatibility & care</summary>
            <p>
              {p.category === "Switches"
                ? "35 switches per pack. FORM 65 needs 2 packs; FORM 75 and TKL need 3. MX hot-swap only; not compatible with optical sockets."
                : p.category === "Keycaps"
                  ? "Includes 145 keys, 1.75u right Shift and 6.25u spacebar. Supports FORM 65%, 75%, and TKL MX stems."
                  : "Designed for the FORM ecosystem. Check dimensions and connection specifications before choosing your setup."}{" "}
              Clean with a soft, dry cloth.
            </p>
          </details>
          <details>
            <summary>Shipping & returns</summary>
            <p>
              This is a portfolio demonstration. No physical products ship. Demo
              delivery estimate: 3–5 business days. Shipping estimate is $9
              below $150; free above. A real store would provide an authorized
              returns and support service.
            </p>
          </details>
        </div>
      </div>
      <section className="section">
        <SectionHeading eyebrow="BETTER TOGETHER" title="Finish the thought." />
        <div className="product-grid featured">
          {products
            .filter((x) => x.category !== p.category)
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
