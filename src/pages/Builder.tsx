import { Component, lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  RotateCcw,
  Share2,
  Bookmark,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useStore, lineIdentity } from "../domain/store";
import {
  cases,
  switches,
  keycaps,
  layouts,
  defaultConfig,
  conflicts,
  compatibleReplacement,
  total,
  bill,
  encodeConfig,
  decodeConfig,
} from "../domain/builder";
import type { Config } from "../domain/builder";
import { money } from "../domain/catalog";
import { Keyboard } from "../ui/Keyboard";
import { Modal } from "../ui/shared";
const Preview3D = lazy(() => import("../ui/Preview3D"));
class PreviewBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
const steps = [
  "Layout",
  "Case",
  "Switches",
  "Keycaps",
  "Accessories",
  "Review",
];
export default function Builder() {
  const c = useStore((s) => s.config),
    setConfig = useStore((s) => s.setConfig),
    notify = useStore((s) => s.notify),
    add = useStore((s) => s.add),
    save = useStore((s) => s.save);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState<Config | null>(null);
  const [dialog, setDialog] = useState("");
  const [name, setName] = useState("My everyday build");
  const [importError, setImportError] = useState("");
  const [three, setThree] = useState(false);
  const [failed, setFailed] = useState(false);
  const [exploded, setExploded] = useState(false);
  const reduced = useReducedMotion();
  const shared = params.get("c"),
    editId = params.get("edit");
  useEffect(() => {
    if (shared) {
      try {
        setConfig(decodeConfig(shared));
        setImportError("");
      } catch (e) {
        setImportError(e instanceof Error ? e.message : "Invalid build link.");
      }
    } else if (editId) {
      const line = useStore.getState().cart.find((x) => x.id === editId);
      if (line?.config) setConfig(line.config);
      else setImportError("That cart build is no longer available.");
    }
  }, [shared, editId, setConfig]);
  const choose = (next: Config) => {
    if (conflicts(next).length) setPending(next);
    else setConfig(next);
  };
  const ca = cases.find((x) => x.id === c.case)!,
    kc = keycaps.find((x) => x.id === c.keycap)!;
  const fallback = (
    <Keyboard color={ca.color} caps={kc.color} layout={c.layout} />
  );
  const options = (
    items: {
      id: string;
      name: string;
      price: number;
      color?: string;
      feel?: string;
    }[],
    field: "case" | "switch" | "keycap",
  ) => (
    <div className="build-options">
      {items.map((o) => (
        <button
          key={o.id}
          className={`option ${c[field] === o.id ? "selected" : ""}`}
          aria-pressed={c[field] === o.id}
          onClick={() => choose({ ...c, [field]: o.id })}
        >
          {o.color && (
            <i className="option-color" style={{ background: o.color }} />
          )}
          <span>
            <strong>{o.name}</strong>
            {o.feel && <small>{o.feel}</small>}
            <small>
              {field === "switch"
                ? `${money(o.price)} / 35-switch pack`
                : field === "case"
                  ? `${money(o.price)} finish upgrade`
                  : money(o.price)}
            </small>
          </span>
          {c[field] === o.id ? (
            <Check size={18} />
          ) : (
            <span className="radio-mark" />
          )}
        </button>
      ))}
    </div>
  );
  return (
    <div className="page builder-page">
      <div className="builder-header">
        <div>
          <p className="eyebrow">THE BUILD LAB / MAKE IT YOURS</p>
          <h1>A form of self-expression.</h1>
        </div>
        <button className="text-link" onClick={() => setDialog("reset")}>
          <RotateCcw size={15} />
          Start fresh
        </button>
      </div>
      {importError && (
        <p role="alert" className="error-banner">
          {importError}{" "}
          <button onClick={() => navigate("/build", { replace: true })}>
            Use current build
          </button>
        </p>
      )}
      <nav className="build-steps" aria-label="Configuration steps">
        {steps.map((s, i) => (
          <button
            key={s}
            aria-current={step === i ? "step" : undefined}
            className={step === i ? "active" : ""}
            onClick={() => setStep(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {s}
          </button>
        ))}
      </nav>
      <div className="builder-layout">
        <div className="build-preview">
          <div className="preview-heading">
            <span className="mono">FORM {c.layout} / LIVE PREVIEW</span>
            <span className="preview-badge">
              {three && !failed ? "3D STUDY" : "2D PREVIEW"}
            </span>
          </div>
          {three && !failed ? (
            <PreviewBoundary fallback={fallback}>
              <Suspense fallback={fallback}>
                <Preview3D
                  config={c}
                  exploded={exploded}
                  onFailure={() => {
                    setFailed(true);
                    notify(
                      "3D unavailable. Your 2D preview and build controls are ready.",
                    );
                  }}
                />
              </Suspense>
            </PreviewBoundary>
          ) : (
            <div className="builder-keyboard">{fallback}</div>
          )}
          <div className="preview-footer">
            <span>
              {ca.name} · {kc.name}
            </span>
            <button className="text-link" onClick={() => setThree(!three)}>
              {three
                ? "Use 2D preview"
                : failed
                  ? "Retry 3D preview"
                  : reduced
                    ? "Enable optional 3D"
                    : "Explore in 3D"}
              <ArrowUpRight size={14} />
            </button>
            {three && (
              <button
                className="text-link"
                onClick={() => {
                  setFailed(false);
                  setExploded(!exploded);
                }}
              >
                {exploded ? "Assemble" : "Explode"} view
              </button>
            )}
          </div>
          <p className="preview-caption">
            Your ideas, taking shape. Illustrative previews; specifications
            below define your build.
          </p>
          <div className="build-confidence">
            <span>
              <Check size={15} /> Compatibility checked
            </span>
            <span>
              <Check size={15} /> No tools needed to choose
            </span>
          </div>
        </div>
        <div className="build-controls">
          <p className="eyebrow">STEP {step + 1} OF 6</p>
          <h2>
            {
              [
                "Find your footprint.",
                "Set the tone.",
                "Find your rhythm.",
                "Give it character.",
                "The finishing touches.",
                "Every detail, considered.",
              ][step]
            }
          </h2>
          <p className="muted">
            {
              [
                "Just the keys you need. Every layout includes a matching hot-swap PCB and plate.",
                "Machined aluminum. A finish that belongs on your desk.",
                "All FORM boards use 5-pin MX sockets. Switches are sold in packs of 35.",
                "Cherry-profile PBT keycaps. Named colors, considered coverage.",
                "Make a little more room for good work.",
                "One complete keyboard, built around you. Review every part before adding it.",
              ][step]
            }
          </p>
          {step === 0 && (
            <div className="build-options">
              {Object.entries(layouts).map(([l, v]) => (
                <button
                  key={l}
                  className={`option ${c.layout === l ? "selected" : ""}`}
                  aria-pressed={c.layout === l}
                  onClick={() =>
                    choose({ ...c, layout: l as Config["layout"] })
                  }
                >
                  <span className="layout-graphic">▦</span>
                  <span>
                    <strong>
                      {l}{" "}
                      {l === "65%"
                        ? "— Keep it compact"
                        : l === "75%"
                          ? "— The sweet spot"
                          : "— Room to work"}
                    </strong>
                    <small>
                      {v.keys} keys · {v.width} mm · {v.system}
                    </small>
                    <small>Foundation {money(v.price)}</small>
                  </span>
                  {c.layout === l && <Check size={18} />}
                </button>
              ))}
            </div>
          )}
          {step === 1 && options(cases, "case")}
          {step === 2 && (
            <>
              {options(switches, "switch")}
              <button
                className="text-link help"
                onClick={() => setDialog("help")}
              >
                Help me choose a switch ↗
              </button>
              <p className="small muted">
                {layouts[c.layout].keys} keys need{" "}
                {Math.ceil(layouts[c.layout].keys / 35)} packs (
                {Math.ceil(layouts[c.layout].keys / 35) * 35} switches). Spares
                included.
              </p>
            </>
          )}
          {step === 3 && options(keycaps, "keycap")}
          {step === 4 && (
            <div className="build-options">
              {[
                {
                  id: "mat",
                  name: "Grid desk mat",
                  description: "900 × 400 mm · Woven surface",
                  price: 2900,
                },
                {
                  id: "rest",
                  name: "Oak wrist rest",
                  description: "365 × 80 mm · Fits every FORM layout",
                  price: 3400,
                },
              ].map((o) => (
                <button
                  key={o.id}
                  className={`option ${c[o.id as "mat" | "rest"] ? "selected" : ""}`}
                  aria-pressed={c[o.id as "mat" | "rest"]}
                  onClick={() =>
                    choose({ ...c, [o.id]: !c[o.id as "mat" | "rest"] })
                  }
                >
                  <span>
                    <strong>{o.name}</strong>
                    <small>{o.description}</small>
                    <small>+ {money(o.price)}</small>
                  </span>
                  {c[o.id as "mat" | "rest"] ? (
                    <Check size={18} />
                  ) : (
                    <span className="radio-mark" />
                  )}
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <>
              <dl className="bill">
                {bill(c).map((x) => (
                  <div key={x.name}>
                    <dt>{x.name}</dt>
                    <dd>{money(x.price)}</dd>
                  </div>
                ))}
              </dl>
              <p className="small muted">
                Case system: {layouts[c.layout].system}. MX sockets. Keycaps
                include 1.75u Shift and 6.25u spacebar. Stock checked for
                required switch packs.
              </p>
            </>
          )}
          <div className="build-purchase">
            <div className="builder-summary">
              <span>
                YOUR BUILD TOTAL <small>USD · shipping calculated in bag</small>
              </span>
              <strong>{money(total(c))}</strong>
            </div>
            <button
              className="button primary full"
              onClick={() => {
                if (step < 5) setStep(step + 1);
                else {
                  const current = editId
                    ? useStore.getState().cart.find((x) => x.id === editId)
                    : undefined;
                  if (editId && !current) {
                    notify(
                      "This bag item was removed. Add this as a new build.",
                    );
                    navigate("/build", { replace: true });
                    return;
                  }
                  add(
                    {
                      id: lineIdentity({ config: c }),
                      name: `FORM ${c.layout} · Custom build`,
                      option: `${ca.name} / ${switches.find((x) => x.id === c.switch)!.name} / ${kc.name}`,
                      config: { ...c },
                      price: total(c),
                      quantity: 1,
                    },
                    editId || undefined,
                  );
                  navigate("/cart");
                }
              }}
            >
              {step < 5
                ? `Next: ${steps[step + 1]}`
                : editId
                  ? "Update build in bag"
                  : "Add your build to bag"}
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="build-save">
            <button
              className="text-link"
              onClick={() => {
                const saved = useStore
                  .getState()
                  .saved.find((s) => s.id === params.get("saved"));
                if (saved) setName(saved.name);
                setDialog("save");
              }}
            >
              <Bookmark size={15} />
              Save build
            </button>
            <button className="text-link" onClick={() => setDialog("share")}>
              <Share2 size={15} />
              Share build
            </button>
          </div>
        </div>
      </div>
      {pending && (
        <Modal
          title="Let’s make these parts fit."
          onClose={() => setPending(null)}
        >
          <p>Your proposed selection needs a compatible replacement:</p>
          <ul className="conflict-list">
            {conflicts(pending).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p>
            Proposed build: {pending.layout},{" "}
            {
              cases.find((x) => x.id === compatibleReplacement(pending).case)!
                .name
            }
            ,{" "}
            {
              switches.find(
                (x) => x.id === compatibleReplacement(pending).switch,
              )!.name
            }
            ,{" "}
            {
              keycaps.find(
                (x) => x.id === compatibleReplacement(pending).keycap,
              )!.name
            }
            .
          </p>
          <div className="replacement-price">
            {money(total(c))} → {money(total(compatibleReplacement(pending)))}{" "}
            <strong>
              (
              {total(compatibleReplacement(pending)) - total(c) >= 0 ? "+" : ""}
              {money(total(compatibleReplacement(pending)) - total(c))})
            </strong>
          </div>
          <button
            className="button primary full"
            onClick={() => {
              setConfig(compatibleReplacement(pending));
              setPending(null);
            }}
          >
            Apply compatible build
          </button>
          <button
            className="button secondary full"
            onClick={() => setPending(null)}
          >
            Keep current build
          </button>
        </Modal>
      )}
      {dialog && (
        <Modal
          title={
            dialog === "save"
              ? "Keep this one."
              : dialog === "share"
                ? "Good things are worth sharing."
                : dialog === "reset"
                  ? "A fresh start?"
                  : "Three ways to find your feel."
          }
          onClose={() => setDialog("")}
        >
          {dialog === "save" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save(name, c, params.get("saved") || undefined);
                setDialog("");
              }}
            >
              <label>
                Build name
                <input
                  maxLength={60}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <p className="small muted">
                Saved in this browser. No account needed.
              </p>
              <button className="button primary full">Save named build</button>
            </form>
          ) : dialog === "share" ? (
            <>
              <p>
                All your parts and options, in one versioned link. No personal
                details included.
              </p>
              <label>
                Share URL
                <input
                  readOnly
                  value={`${location.origin}/build?c=${encodeURIComponent(encodeConfig(c))}`}
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <button
                className="button primary full"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      `${location.origin}/build?c=${encodeURIComponent(encodeConfig(c))}`,
                    );
                    notify("Build link copied.");
                  } catch {
                    notify("Select the link above and copy it.");
                  }
                }}
              >
                Copy build link
              </button>
            </>
          ) : dialog === "reset" ? (
            <>
              <p>
                Your current unsaved choices will be replaced with the Chalk
                FORM 75 default. Saved builds stay available.
              </p>
              <button
                className="button primary full"
                onClick={() => {
                  setConfig({ ...defaultConfig });
                  setStep(0);
                  navigate("/build", { replace: true });
                  setDialog("");
                }}
              >
                Reset configuration
              </button>
            </>
          ) : (
            <>
              {switches.slice(0, 3).map((s) => (
                <div className="switch-explanation" key={s.id}>
                  <h3>{s.name}</h3>
                  <p>{s.feel}</p>
                  <small>{money(s.price)} per 35-switch pack · 5-pin MX</small>
                </div>
              ))}
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
