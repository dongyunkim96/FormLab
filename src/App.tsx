import { lazy, Suspense, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowUpRight,
  Search,
  Bookmark,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import { Modal, Empty } from "./ui/shared";
import Cart, { CartContents } from "./pages/Cart";
import { useStore } from "./domain/store";
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Builder = lazy(() => import("./pages/Builder"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Saved = lazy(() => import("./pages/Saved"));
const OrderResult = lazy(() =>
  import("./pages/Checkout").then((m) => ({ default: m.OrderResult })),
);
function About() {
  return (
    <div className="page about-page">
      <p className="eyebrow">THE FORM LAB APPROACH</p>
      <h1>
        Everyday objects.
        <br />
        Extra consideration.
      </h1>
      <p className="lede">Build your everyday masterpiece.</p>
      <div className="about-grid">
        <h2>
          Good design leaves
          <br />
          room for you.
        </h2>
        <div>
          <p>
            FORM LAB is an original fictional brand exploring a simple idea: the
            objects you touch every day should feel personal, useful, and
            considered.
          </p>
          <p>
            Our keyboard collection pairs restrained forms with expressive
            finishes. The build lab turns layouts, switch types, and keycap
            coverage into choices you can understand, with compatibility checks
            along the way.
          </p>
          <p>
            Aluminum cases. PBT keycaps. Replaceable MX switches. Our
            illustrative materials tell a coherent design story without invented
            certifications or manufacturing claims.
          </p>
          <Link className="button primary" to="/build">
            Make your own
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="about-note">
        <p className="eyebrow">TRANSPARENT BY DESIGN</p>
        <h2>A portfolio, with a working point of view.</h2>
        <p>
          This store is a demonstration. Products, customer feedback, stock
          levels, and shipping policies are fictional. Checkout creates a local
          demo order, collects no payment, and ships no goods. Saved items and
          orders stay in your browser; clearing site data removes them.
        </p>
      </div>
    </div>
  );
}
export default function App() {
  const [dialog, setDialog] = useState("");
  const [search, setSearch] = useState("");
  const cart = useStore((s) => s.cart),
    notice = useStore((s) => s.notice),
    notify = useStore((s) => s.notify),
    storageError = useStore((s) => s.storageError);
  const location = useLocation(),
    navigate = useNavigate();
  const count = cart.reduce((s, x) => s + x.quantity, 0);
  useEffect(() => {
    setDialog("");
    window.scrollTo(0, 0);
    const titles: Record<string, string> = {
      "/": "Build your everyday masterpiece",
      "/shop": "The collection",
      "/build": "The build lab",
      "/saved": "Saved possibilities",
      "/cart": "Your bag",
      "/checkout": "Demo checkout",
      "/about": "Our approach",
    };
    document.title = `${titles[location.pathname] || "Your considered everyday"} — FORM LAB`;
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = window.location.origin + location.pathname;
  }, [location.pathname]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => notify(""), 4500);
    return () => clearTimeout(t);
  }, [notice, notify]);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        A little more you. A lot more everyday.{" "}
        <Link to="/build">
          Meet your next keyboard
          <ArrowRight size={12} />
        </Link>
        <span>FORM LAB / DESIGN IN THE DETAILS</span>
      </div>
      <header className="header">
        <Link className="brand" to="/" aria-label="FORM LAB home">
          FORM LAB
          <span className="brand-dot" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/build">
            Build your keyboard
            <ArrowUpRight size={13} />
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="header-tools">
          <button
            className="icon"
            aria-label="Search the collection"
            onClick={() => setDialog("search")}
          >
            <Search size={20} />
          </button>
          <NavLink
            to="/saved"
            className="icon saved-nav"
            aria-label="Saved builds and objects"
          >
            <Bookmark size={20} />
          </NavLink>
          <button
            className="bag-button"
            aria-label={`Open bag, ${count} items`}
            onClick={() => setDialog("cart")}
          >
            <ShoppingBag size={19} />
            <span className="bag-text">Bag</span>
            <span className="bag-count">{count}</span>
          </button>
          <button
            className="icon mobile-menu"
            aria-label="Open navigation"
            onClick={() => setDialog("menu")}
          >
            <Menu size={23} />
          </button>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {storageError && (
          <div className="error-banner" role="alert">
            Browser storage is unavailable. Your current session works, but
            changes cannot be saved across refreshes.
          </div>
        )}
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              Getting things into form…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route
              path="/products/:slug"
              element={<Product key={location.pathname} />}
            />
            <Route path="/build" element={<Builder />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:publicReference" element={<OrderResult />} />
            <Route path="/about" element={<About />} />
            <Route
              path="*"
              element={
                <Empty
                  title="This page hasn’t taken form."
                  description="Let’s get you back to something good."
                />
              }
            />
          </Routes>
        </Suspense>
      </main>
      <footer>
        <div className="footer-top">
          <div>
            <Link className="brand" to="/">
              FORM LAB
              <span className="brand-dot" />
            </Link>
            <p>Build your everyday masterpiece.</p>
            <span className="mono">
              THOUGHTFUL OBJECTS. PERSONAL POSSIBILITIES.
            </span>
          </div>
          <div>
            <h2>Explore</h2>
            <Link to="/shop">The collection</Link>
            <Link to="/build">The build lab</Link>
            <Link to="/saved">Saved builds</Link>
          </div>
          <div>
            <h2>The details</h2>
            <button onClick={() => setDialog("assembly")}>
              Assembly & compatibility
            </button>
            <button onClick={() => setDialog("shipping")}>
              Shipping & returns
            </button>
            <button onClick={() => setDialog("support")}>
              Support & demo information
            </button>
          </div>
          <div className="footer-note">
            <span className="live-dot" /> A MORE CONSIDERED EVERYDAY.
            <p>
              Designed to fit your space.
              <br />
              Made to follow your rhythm.
            </p>
            <Link className="text-link" to="/about">
              Get to know FORM LAB
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} FORM LAB · An original portfolio brand.
          </span>
          <span>Demo store. No payments or physical orders.</span>
          <span>DESIGNED IN THE DETAILS ↗</span>
        </div>
      </footer>
      <AnimatePresence>
        {notice && (
          <motion.div
            role="status"
            className="toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span>{notice}</span>
            {notice.includes("Added") && <Link to="/cart">View bag ↗</Link>}
            <button
              className="icon"
              aria-label="Dismiss notification"
              onClick={() => notify("")}
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {dialog && (
        <Modal
          drawer={["cart", "menu"].includes(dialog)}
          title={
            dialog === "cart"
              ? `Your bag (${count})`
              : dialog === "search"
                ? "Find your next favorite."
                : dialog === "menu"
                  ? "Explore FORM LAB"
                  : dialog === "assembly"
                    ? "Made to work together."
                    : dialog === "shipping"
                      ? "Shipping & returns"
                      : "Here to help, transparently."
          }
          onClose={() => setDialog("")}
        >
          {dialog === "cart" ? (
            <CartContents compact onNavigate={() => setDialog("")} />
          ) : dialog === "search" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/shop?q=${encodeURIComponent(search)}`);
                setDialog("");
              }}
            >
              <label>
                Search products, materials, or layouts
                <input
                  autoFocus
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Try ‘75%’ or ‘PBT’"
                />
              </label>
              <button className="button primary full">
                Search collection
                <ArrowRight size={16} />
              </button>
            </form>
          ) : dialog === "menu" ? (
            <nav className="mobile-links" aria-label="Mobile navigation">
              {[
                ["/shop", "Shop the collection"],
                ["/build", "Build your keyboard"],
                ["/saved", "Saved builds"],
                ["/about", "About FORM LAB"],
                ["/cart", "Your bag"],
              ].map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setDialog("")}>
                  {label}
                  <ArrowUpRight size={20} />
                </Link>
              ))}
            </nav>
          ) : dialog === "assembly" ? (
            <>
              <p>
                Each FORM foundation includes a layout-specific aluminum case,
                matching PCB, plate, stabilizers, and USB-C connection. The
                configurator checks these as a single compatible system.
              </p>
              <p>
                65% has 68 keys; 75% has 82; TKL has 87. Switches are sold in
                packs of 35. Use 5-pin MX hot-swap switches and keycaps covering
                your layout, including a 1.75u Shift and 6.25u spacebar.
              </p>
              <p>
                Parts are fictional. Real assembly should always follow the
                manufacturer’s instructions.
              </p>
            </>
          ) : dialog === "shipping" ? (
            <>
              <p>
                No physical products ship from this demo. Illustrative shipping
                is free above $150 and $9 below. Illustrative delivery is 3–5
                business days with a 30-day returns window.
              </p>
              <p>
                These are demonstration policies, not a commercial offer. No
                taxes or payments are collected.
              </p>
            </>
          ) : (
            <>
              <p>
                FORM LAB is a fictional portfolio store. There is no staffed
                customer service or live email service.
              </p>
              <p>
                Builds, wishlist, bag, and simulated orders are stored only in
                your browser. Share a build using its link; order references
                work only on the original device.
              </p>
              <Link
                className="button primary"
                to="/about"
                onClick={() => setDialog("")}
              >
                About this project
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}
        </Modal>
      )}
    </MotionConfig>
  );
}
