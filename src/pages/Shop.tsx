import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { categories, products, money } from "../domain/catalog";
import { ProductCard, Modal, Empty } from "../ui/shared";
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState<URLSearchParams | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [comparison, setComparison] = useState(false);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const list = products
    .filter(
      (p) =>
        (!category || p.category === category) &&
        (!q ||
          `${p.title} ${p.category} ${Object.values(p.specs).join(" ")}`
            .toLowerCase()
            .includes(q.toLowerCase())) &&
        (!params.get("layout") || p.layout === params.get("layout")) &&
        (!params.get("feel") || p.feel === params.get("feel")) &&
        (!params.get("color") ||
          p.variants.some((v) => v.name.includes(params.get("color")!))) &&
        (!params.get("max") || p.price <= Number(params.get("max")) * 100) &&
        (!params.get("stock") || p.variants.some((v) => v.stock > 0)),
    )
    .sort((a, b) =>
      params.get("sort") === "low"
        ? a.price - b.price
        : params.get("sort") === "high"
          ? b.price - a.price
          : params.get("sort") === "new"
            ? b.created - a.created
            : 0,
    );
  const filters = (
    value: URLSearchParams,
    change: (k: string, v: string) => void,
  ) => (
    <>
      <label>
        Layout
        <select
          aria-label="Layout"
          value={value.get("layout") || ""}
          onChange={(e) => change("layout", e.target.value)}
        >
          <option value="">All layouts</option>
          {["65%", "75%", "TKL"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Color
        <select
          aria-label="Color"
          value={value.get("color") || ""}
          onChange={(e) => change("color", e.target.value)}
        >
          <option value="">All colors</option>
          {["Chalk", "Graphite", "Cobalt", "Sage"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Switch feel
        <select
          aria-label="Switch feel"
          value={value.get("feel") || ""}
          onChange={(e) => change("feel", e.target.value)}
        >
          <option value="">All feels</option>
          {["Linear", "Tactile", "Clicky"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        Maximum price
        <select
          aria-label="Maximum price"
          value={value.get("max") || ""}
          onChange={(e) => change("max", e.target.value)}
        >
          <option value="">Any price</option>
          {[30, 60, 150, 250].map((x) => (
            <option key={x} value={x}>
              Under ${x}
            </option>
          ))}
        </select>
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={value.has("stock")}
          onChange={(e) => change("stock", e.target.checked ? "1" : "")}
        />{" "}
        In stock only
      </label>
    </>
  );
  return (
    <div className="page shop-page">
      <p className="eyebrow">THE FORM LAB COLLECTION</p>
      <h1>Find your everyday.</h1>
      <p className="lede">Thoughtful objects. A setup that’s entirely yours.</p>
      <div className="category-tabs">
        <button
          className={!category ? "active" : ""}
          onClick={() => update("category", "")}
        >
          All objects <span>{products.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={category === c ? "active" : ""}
            onClick={() => {
              const next = new URLSearchParams();
              next.set("category", c);
              setParams(next);
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="shop-toolbar">
        <input
          aria-label="Search products"
          type="search"
          placeholder="Find something good…"
          value={q}
          onChange={(e) => update("q", e.target.value)}
        />
        <span>
          {list.length} {list.length === 1 ? "object" : "objects"}
        </span>
        <button
          className="button secondary"
          onClick={() => setDraft(new URLSearchParams(params))}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
        <select
          aria-label="Sort products"
          value={params.get("sort") || ""}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="new">Newest</option>
        </select>
      </div>
      {[...params].filter(([k]) => k !== "sort").length > 0 && (
        <div className="active-filters">
          {[...params]
            .filter(([k]) => k !== "sort")
            .map(([k, v]) => (
              <button key={k} onClick={() => update(k, "")}>
                {k}: {v}
                <X size={12} />
              </button>
            ))}
          <button onClick={() => setParams({})}>Reset all</button>
        </div>
      )}
      {list.length ? (
        <div className="product-grid shop-grid">
          {list.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} />
              <label className="compare-check">
                <input
                  type="checkbox"
                  checked={compare.includes(p.id)}
                  disabled={
                    !compare.includes(p.id) &&
                    (compare.length === 3 ||
                      (compare.length > 0 &&
                        products.find((x) => x.id === compare[0])?.category !==
                          p.category))
                  }
                  onChange={() =>
                    setCompare(
                      compare.includes(p.id)
                        ? compare.filter((id) => id !== p.id)
                        : [...compare, p.id],
                    )
                  }
                />{" "}
                Compare
              </label>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="A little too specific?"
          description="Try another search or clear a filter to find your next desk essential."
        />
      )}
      {compare.length > 0 && (
        <div className="compare-bar">
          <span>{compare.length} of 3 selected · same-category comparison</span>
          <button
            className="button primary"
            onClick={() => setComparison(true)}
          >
            Compare objects
          </button>
          <button
            className="icon"
            aria-label="Clear comparison"
            onClick={() => setCompare([])}
          >
            <X />
          </button>
        </div>
      )}
      {draft && (
        <Modal
          drawer
          title="Refine your collection"
          onClose={() => setDraft(null)}
        >
          <div className="filter-fields">
            {filters(draft, (k, v) => {
              const next = new URLSearchParams(draft);
              if (v) next.set(k, v);
              else next.delete(k);
              setDraft(next);
            })}
          </div>
          <button
            className="button primary full"
            onClick={() => {
              setParams(draft);
              setDraft(null);
            }}
          >
            Apply filters
          </button>
          <button
            className="button secondary full"
            onClick={() => setDraft(new URLSearchParams())}
          >
            Reset filters
          </button>
        </Modal>
      )}
      {comparison && (
        <Modal title="A closer look" onClose={() => setComparison(false)}>
          <div className="comparison">
            {compare.map((id) => {
              const p = products.find((x) => x.id === id)!;
              return (
                <div key={id}>
                  <h3>{p.title}</h3>
                  <p>{money(p.price)}</p>
                  {Object.entries(p.specs).map(([k, v]) => (
                    <p key={k}>
                      <small>{k}</small>
                      <br />
                      {v}
                    </p>
                  ))}
                  <Link className="text-link" to={`/products/${p.slug}`}>
                    View object →
                  </Link>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
export function BackToShop() {
  return (
    <Link
      className="text-link"
      to="/shop"
      onClick={(e) => {
        if (window.history.state?.idx > 0) {
          e.preventDefault();
          window.history.back();
        }
      }}
    >
      <ArrowLeft size={16} /> Back to collection
    </Link>
  );
}
