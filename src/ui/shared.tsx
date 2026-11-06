import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, X } from "lucide-react";
import type { Product } from "../domain/catalog";
import { money } from "../domain/catalog";
import { useStore } from "../domain/store";
import { ProductPhoto } from "./ProductPhoto";
export function Modal({
  title,
  children,
  onClose,
  drawer = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={drawer ? "drawer" : "modal"}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <h2>{title}</h2>
        <button className="icon" aria-label="Close dialog" onClick={onClose}>
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  const wished = useStore((s) => s.wishlist.includes(p.id)),
    wish = useStore((s) => s.wish);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/products/${p.slug}`} aria-label={`View ${p.title}`}>
          <ProductPhoto product={p} />
        </Link>
        <span className="product-label">
          {p.category === "Keyboards"
            ? `${p.layout} / HOT-SWAP`
            : p.category === "Switches"
              ? "35-SWITCH PACK"
              : p.category}
        </span>
        <button
          className={`wish icon ${wished ? "selected" : ""}`}
          aria-label={`${wished ? "Unsave" : "Save"} ${p.title}`}
          aria-pressed={wished}
          onClick={() => wish(p.id)}
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-title">
        <Link to={`/products/${p.slug}`}>
          <h3>{p.title}</h3>
        </Link>
        <span>{money(p.price)}</span>
      </div>
      <div className="product-meta">
        <span>
          {p.layout
            ? `${p.layout} layout · Aluminum`
            : p.feel
              ? `${p.feel} · MX compatible`
              : Object.values(p.specs)[0] || "Considered desk essentials"}
        </span>
        <div className="mini-swatches">
          {p.variants.map((v) => (
            <i key={v.id} style={{ background: v.color }} title={v.name} />
          ))}
        </div>
      </div>
    </article>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  link,
  label = "Explore the collection",
}: {
  eyebrow: string;
  title: string;
  link?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {label}
          <ArrowUpRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function Empty({
  title,
  description,
  action = "Explore the collection",
  to = "/shop",
}: {
  title: string;
  description: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="empty">
      <span className="empty-mark">↗</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button primary" to={to}>
        {action}
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
