import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Trash2, ArrowUpRight } from "lucide-react";
import { useStore } from "../domain/store";
import type { Saved as SavedBuild } from "../domain/store";
import { total, cases, keycaps, encodeConfig } from "../domain/builder";
import { products, money } from "../domain/catalog";
import { Keyboard } from "../ui/Keyboard";
import { Empty, ProductCard } from "../ui/shared";
export default function Saved() {
  const saved = useStore((s) => s.saved),
    wishlist = useStore((s) => s.wishlist),
    save = useStore((s) => s.save),
    remove = useStore((s) => s.deleteSaved),
    restore = useStore((s) => s.restoreSaved);
  const [removed, setRemoved] = useState<SavedBuild | null>(null);
  return (
    <div className="page">
      <p className="eyebrow">IDEAS WORTH KEEPING</p>
      <h1>Your collection of possibilities.</h1>
      <p className="lede">
        Saved on this device. Ready when inspiration strikes.
      </p>
      {removed && (
        <div className="undo-note">
          Build removed.{" "}
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
      {saved.length ? (
        <div className="saved-grid">
          {saved.map((s) => (
            <article className="saved-card" key={s.id}>
              <div className="product-image">
                <Keyboard
                  color={cases.find((x) => x.id === s.config.case)!.color}
                  caps={keycaps.find((x) => x.id === s.config.keycap)!.color}
                />
              </div>
              <h2>{s.name}</h2>
              <p>
                FORM {s.config.layout} · {money(total(s.config))}
              </p>
              <div className="saved-actions">
                <Link
                  className="text-link"
                  to={`/build?c=${encodeURIComponent(encodeConfig(s.config))}&saved=${s.id}`}
                >
                  Open build
                  <ArrowUpRight size={16} />
                </Link>
                <button
                  className="icon"
                  aria-label={`Duplicate ${s.name}`}
                  onClick={() => save(`${s.name} copy`, s.config)}
                >
                  <Copy size={18} />
                </button>
                <button
                  className="icon"
                  aria-label={`Delete ${s.name}`}
                  onClick={() => {
                    setRemoved(s);
                    remove(s.id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Your next idea starts here."
          description="Build a keyboard, give it a name, and save it here for another day."
          action="Start a build"
          to="/build"
        />
      )}
      {wishlist.length > 0 && (
        <section className="section">
          <h2>Objects you love.</h2>
          <div className="product-grid">
            {products
              .filter((p) => wishlist.includes(p.id))
              .map((p) => (
                <ProductCard product={p} key={p.id} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
