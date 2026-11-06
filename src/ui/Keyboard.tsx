import { useId } from "react";
import type { CSSProperties } from "react";
import type { Product, Layout } from "../domain/catalog";
import { keyboardGeometry } from "../domain/geometry";
export function Keyboard({
  color = "#dedcd3",
  caps = "#eeeae1",
  layout = "75%",
  flat = false,
}: {
  color?: string;
  caps?: string;
  layout?: string;
  flat?: boolean;
}) {
  const uid = useId().replaceAll(":", "");
  const dark = caps === "#5b5d59";
  const geometry = keyboardGeometry(layout as Layout);
  const height = geometry.rows * 38 + 34;
  const unit = 654 / geometry.width;
  return (
    <svg
      className={`keyboard-art ${flat ? "flat" : ""}`}
      viewBox="0 0 740 350"
      role="img"
      aria-label={`${layout} mechanical keyboard, ${color === "#315bee" ? "cobalt" : "aluminum"} case`}
    >
      <defs>
        <linearGradient id={`${uid}c`} x2="0" y2="1">
          <stop stopColor={color} />
          <stop
            offset="1"
            stopColor={color === "#dedcd3" ? "#a7a79e" : color}
          />
        </linearGradient>
        <linearGradient id={`${uid}k`} x2="0.2" y2="1">
          <stop stopColor={caps} />
          <stop offset="1" stopColor={dark ? "#393c37" : "#c7c5bc"} />
        </linearGradient>
        <filter id={`${uid}s`} x="-30%" y="-50%" width="170%" height="230%">
          <feDropShadow dx="3" dy="21" stdDeviation="13" floodOpacity=".24" />
        </filter>
      </defs>
      <g
        transform={
          flat
            ? "translate(16 24)"
            : "translate(34 35) skewX(-10) scale(.93 .86)"
        }
        filter={`url(#${uid}s)`}
      >
        <rect x="0" y="17" width="700" height={height} rx="17" fill="#777a70" />
        <rect width="700" height={height} rx="17" fill={`url(#${uid}c)`} />
        <rect
          x="13"
          y="14"
          width="674"
          height={height - 35}
          rx="9"
          fill="#71756c"
        />
        {geometry.keys.map(({ label, x, y, width }, i) => {
          const w = width * unit - 4;
          const accent = i === 0 || label === "→";
          return (
            <g key={i} transform={`translate(${23 + x * unit} ${20 + y * 38})`}>
              <rect
                y="3"
                width={w}
                height="33"
                rx="4"
                fill={accent ? "#193daf" : dark ? "#272b27" : "#aaa99e"}
              />
              <rect
                width={w}
                height="31"
                rx="4"
                fill={accent ? "#315bee" : `url(#${uid}k)`}
              />
              <rect
                x="3"
                y="2"
                width={w - 6}
                height="26"
                rx="3"
                fill={accent ? "#426af1" : caps}
              />
              <text
                x={label === "Space" ? w / 2 - 30 : 5}
                y="14"
                fontSize="8"
                fontFamily="Arial,sans-serif"
                fill={accent || dark ? "#fff" : "#40433b"}
              >
                {label === "Space" ? "F O R M  L A B" : label}
              </text>
            </g>
          );
        })}
        <text
          x="25"
          y={height - 7}
          fontFamily="monospace"
          fontSize="7"
          letterSpacing="3"
          fill={color === "#464945" ? "#ddd" : "#42463c"}
        >
          FORM LAB / {layout}
        </text>
      </g>
    </svg>
  );
}
export function ProductArt({
  product,
  color,
}: {
  product: Product;
  color?: string;
}) {
  const c = color || product.color;
  if (product.category === "Keyboards" || product.category === "Bundles")
    return <Keyboard color={c} layout={product.layout} />;
  if (product.category === "Keycaps")
    return (
      <div className="cap-art" style={{ "--asset": c } as CSSProperties}>
        {["F", "O", "R", "M", "L", "A", "B", "↵", "⌘"].map((k, i) => (
          <span key={i}>{k}</span>
        ))}
      </div>
    );
  if (product.category === "Switches")
    return (
      <div className="switch-art" style={{ "--asset": c } as CSSProperties}>
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <span />
            <b />
          </div>
        ))}
      </div>
    );
  if (product.category === "Cables")
    return (
      <svg viewBox="0 0 400 250" role="img" aria-label="Woven USB-C cable">
        <path
          d="M55 180Q30 60 120 90C230 130 120 220 155 130S185 55 190 135S220 210 225 130S260 65 265 130Q280 190 340 80"
          fill="none"
          stroke={c}
          strokeWidth="15"
        />
        <rect x="328" y="51" width="20" height="36" rx="4" fill="#70746a" />
      </svg>
    );
  return (
    <div
      className={product.category === "Desk mats" ? "mat-art" : "rest-art"}
      style={{ "--asset": c } as CSSProperties}
    >
      <span>FORM LAB</span>
    </div>
  );
}
