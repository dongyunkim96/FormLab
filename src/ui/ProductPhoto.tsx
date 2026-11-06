import { useId, useState } from "react";
import type { Product } from "../domain/catalog";
import { ProductArt } from "./Keyboard";
export function ProductPhoto({
  product,
  color = product.color,
}: {
  product: Product;
  color?: string;
}) {
  const [failed, setFailed] = useState(false);
  const filterId = `finish-${useId().replaceAll(":", "")}`;
  const channels = [1, 3, 5].map(
    (offset) => parseInt(color.slice(offset, offset + 2), 16) / 255,
  );
  const tones = channels.map((channel) =>
    Array.from({ length: 17 }, (_, i) =>
      i === 16
        ? 1
        : i === 15
          ? 0.5 + 0.5 * channel
          : Math.min(1, channel * (0.15 + 0.85 * Math.sqrt(i / 14))),
    ).join(" "),
  );
  const assets: Record<Product["category"], string> = {
    Keyboards:
      Number(product.id.split("-")[1]) % 2
        ? "keyboard-graphite"
        : "keyboard-chalk",
    Keycaps: "keycaps",
    Switches: "switches",
    "Desk mats": "desk-mat",
    "Wrist rests": "wrist-rest",
    Cables: "cable",
    Bundles: "bundle",
  };
  if (failed) return <ProductArt product={product} color={color} />;
  return (
    <>
      <svg className="photo-filters" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              in="SourceGraphic"
              type="saturate"
              values="0"
              result="gray"
            />
            <feComponentTransfer in="gray" result="color">
              <feFuncR type="table" tableValues={tones[0]} />
              <feFuncG type="table" tableValues={tones[1]} />
              <feFuncB type="table" tableValues={tones[2]} />
            </feComponentTransfer>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -1.7008 -5.7216 -.5776 0 7.3"
              result="mask"
            />
            <feGaussianBlur in="mask" stdDeviation="1.2" result="softMask" />
            <feComposite
              in="color"
              in2="softMask"
              operator="in"
              result="tint"
            />
            <feComposite
              in="SourceGraphic"
              in2="softMask"
              operator="out"
              result="background"
            />
            <feComposite
              in="tint"
              in2="background"
              operator="arithmetic"
              k2="1"
              k3="1"
            />
          </filter>
        </defs>
      </svg>
      <img
        className="product-photo"
        style={{ filter: `url(#${filterId})` }}
        data-finish={color}
        src={`/products/${assets[product.category]}.webp`}
        width={768}
        height={768}
        loading="lazy"
        decoding="async"
        alt={`${product.title} — ${color === product.color ? "signature" : "selected"} finish, color-treated illustrative studio image`}
        onError={() => setFailed(true)}
      />
    </>
  );
}
