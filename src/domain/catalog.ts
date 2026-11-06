import { productDetails, productFinish, themeColor } from "./catalog-details";
export type Category =
  | "Keyboards"
  | "Keycaps"
  | "Switches"
  | "Desk mats"
  | "Wrist rests"
  | "Cables"
  | "Bundles";
export type Layout = "65%" | "75%" | "TKL";
export type Variant = {
  id: string;
  name: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
};
export type Product = {
  id: string;
  slug: string;
  title: string;
  category: Category;
  description: string;
  price: number;
  color: string;
  layout?: Layout;
  feel?: string;
  packSize?: number;
  specs: Record<string, string>;
  variants: Variant[];
  created: number;
};
export const colors = [
  { name: "Chalk", hex: "#dedcd3" },
  { name: "Graphite", hex: "#464945" },
  { name: "Cobalt", hex: "#315bee" },
  { name: "Sage", hex: "#9cae97" },
];
const groups: {
  category: Category;
  names: string[];
  base: number;
  description: string;
}[] = [
  {
    category: "Keyboards",
    names: [
      "FORM 65",
      "FORM 75",
      "FORM TKL",
      "FORM 65 Studio",
      "FORM 75 Studio",
      "FORM TKL Studio",
      "FORM 65 Essential",
      "FORM 75 Essential",
      "FORM TKL Essential",
      "FORM 65 Quiet",
      "FORM 75 Quiet",
      "FORM TKL Quiet",
      "FORM 65 Carbon",
      "FORM 75 Carbon",
      "FORM TKL Carbon",
      "FORM 65 Arc",
      "FORM 75 Arc",
      "FORM TKL Arc",
      "FORM 65 Atelier",
      "FORM 75 Atelier",
      "FORM TKL Atelier",
      "FORM 65 Pro",
      "FORM 75 Pro",
      "FORM TKL Pro",
    ],
    base: 15900,
    description:
      "A considered foundation for your everyday. An aluminum case, hot-swap PCB, and a carefully balanced typing feel.",
  },
  {
    category: "Keycaps",
    names: [
      "Chalk PBT",
      "After Hours PBT",
      "Studio Blue PBT",
      "Field Notes PBT",
      "Warm Sand PBT",
      "Signal PBT",
      "Ember PBT",
      "Pine PBT",
      "Lagoon PBT",
      "Lavender PBT",
      "Terracotta PBT",
      "Glacier PBT",
      "Porcelain PBT",
      "Midnight PBT",
      "Matcha PBT",
      "Rosewood PBT",
      "Marigold PBT",
      "Blueprint PBT",
      "Oat Milk PBT",
      "Storm PBT",
      "Clay PBT",
      "Sea Glass PBT",
      "Plum PBT",
      "Espresso PBT",
    ],
    base: 4900,
    description:
      "Sculpted PBT keycaps with crisp legends. A 145-key kit with 1.75u right Shift and 6.25u spacebar for every FORM layout.",
  },
  {
    category: "Switches",
    names: [
      "Cloud Linear",
      "Moss Tactile",
      "Signal Clicky",
      "Quiet Linear",
      "Pebble Tactile",
      "Ink Linear",
      "Petal Linear",
      "Dune Tactile",
      "Echo Clicky",
      "Hush Silent Linear",
      "Fern Silent Tactile",
      "Cinder Linear",
      "Mist Light Linear",
      "Ridge Tactile",
      "Cadence Clicky",
      "Velvet Silent Linear",
      "Stone Heavy Tactile",
      "Drift Long-Pole Linear",
    ],
    base: 1200,
    description:
      "A pack of 35 five-pin MX switches. Choose the feel that makes your work feel a little more yours.",
  },
  {
    category: "Desk mats",
    names: [
      "Grid Desk Mat",
      "Contour Desk Mat",
      "Field Desk Mat",
      "Mono Desk Mat",
      "Orbit Desk Mat",
      "Topography Desk Mat",
      "Graph Paper Desk Mat",
      "Dune Desk Mat",
      "Nightfall Desk Mat",
      "Tidal Desk Mat",
      "Terrazzo Desk Mat",
      "Meadow Desk Mat",
      "Blueprint Desk Mat",
      "Horizon Desk Mat",
      "Dot Matrix Desk Mat",
      "Contour Compact Desk Mat",
    ],
    base: 2900,
    description:
      "A soft woven surface and grippy rubber base. Room for your keyboard, mouse, and a little clear thinking.",
  },
  {
    category: "Wrist rests",
    names: [
      "Oak Wrist Rest",
      "Walnut Wrist Rest",
      "Cork Wrist Rest",
      "Ash Wrist Rest",
      "Graphite Wrist Rest",
      "Maple Wrist Rest",
      "Bamboo Wrist Rest",
      "Cherry Wrist Rest",
      "Smoked Oak Wrist Rest",
      "Sage Cork Wrist Rest",
      "Chalk Cork Wrist Rest",
      "Walnut Compact Wrist Rest",
    ],
    base: 3400,
    description:
      "A gently rounded rest for a more considered desk. Select a size to match your keyboard.",
  },
  {
    category: "Cables",
    names: [
      "Coil USB-C",
      "Straight USB-C",
      "Studio USB-C",
      "Signal USB-C",
      "Field USB-C",
      "Sage Coil USB-C",
      "Ember Coil USB-C",
      "Midnight Straight USB-C",
      "Chalk Straight USB-C",
      "Studio Braided USB-C",
      "Travel USB-C",
      "Graphite Coil USB-C",
    ],
    base: 2400,
    description:
      "A detachable 1.8 m USB-C to USB-A cable with a woven jacket. A small detail that ties it all together.",
  },
  {
    category: "Bundles",
    names: [
      "The Everyday Set",
      "The Studio Set",
      "The Focus Set",
      "The Creative Set",
      "The Quiet Hours Set",
      "The Field Notes Set",
      "The After Hours Set",
      "The First Build Set",
      "The Warm Minimal Set",
      "The Blue Studio Set",
    ],
    base: 21900,
    description:
      "A coordinated FORM 75 keyboard, desk mat, and USB-C cable. Ready for a fresh start at your desk.",
  },
];
const seededProducts: Product[] = groups.flatMap((g, gi) =>
  g.names.map((title, i) => {
    const id = `${gi}-${i}`,
      color = productFinish(g.category, i),
      price =
        i < (gi < 3 ? 6 : gi === 6 ? 4 : 5)
          ? g.base + i * 500
          : g.base +
            (i % 6) *
              (g.category === "Keyboards" || g.category === "Bundles"
                ? 1500
                : g.category === "Switches"
                  ? 150
                  : 400);
    const layout =
      g.category === "Keyboards"
        ? (["65%", "75%", "TKL"] as Layout[])[i % 3]
        : g.category === "Bundles"
          ? title.includes("First Build")
            ? "65%"
            : "75%"
          : undefined;
    const feel =
      g.category === "Switches"
        ? title.includes("Clicky")
          ? "Clicky"
          : title.includes("Tactile")
            ? "Tactile"
            : "Linear"
        : undefined;
    return {
      id,
      slug: title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
      title,
      category: g.category,
      description: `${g.description}${productDetails(g.category, title, i).description}`,
      price,
      color,
      layout,
      feel,
      packSize: g.category === "Switches" ? 35 : undefined,
      created: 100 - gi * 6 + i,
      specs: {
        ...(layout
          ? {
              Layout: layout,
              Connection: "USB-C",
              Mount: "Gasket",
              Sockets: "5-pin MX hot-swap",
            }
          : {}),
        ...(feel
          ? { Feel: feel, "Pack size": "35 switches", Socket: "3/5-pin MX" }
          : {}),
        ...(g.category === "Keycaps"
          ? {
              Material: "Dye-sub PBT",
              Coverage: "65%, 75%, TKL",
              Profile: "Cherry",
            }
          : {}),
        ...(g.category === "Desk mats"
          ? { Dimensions: "900 × 400 × 4 mm", Surface: "Woven fabric" }
          : {}),
        ...(g.category === "Wrist rests"
          ? { Dimensions: "325 / 335 / 365 × 80 mm" }
          : {}),
        ...(g.category === "Cables"
          ? { Connection: "USB-C to USB-A", Length: "1.8 m" }
          : {}),
        ...(g.category === "Bundles"
          ? { Includes: "FORM 75, mat, cable", Layout: "75%" }
          : {}),
        ...productDetails(g.category, title, i).specs,
      },
      variants: colors
        .slice(
          0,
          g.category === "Switches" || (g.category === "Wrist rests" && i >= 5)
            ? 1
            : 4,
        )
        .map((c, j) => ({
          id: `${id}-${j}`,
          name:
            g.category === "Switches"
              ? feel!
              : g.category === "Wrist rests" && i >= 5
                ? `${title.replace(" Wrist Rest", "")} · ${title.includes("Compact") ? "325" : "365"} mm`
                : j === 0 && themeColor(title)
                  ? title.replace(" PBT", "").replace(" Desk Mat", "")
                  : g.category === "Wrist rests"
                    ? `${c.name} · universal 365 mm`
                    : c.name,
          color:
            j === 0 && (themeColor(title) || g.category === "Wrist rests")
              ? color
              : c.hex,
          price: price + j * 300,
          stock: i === 5 && j === 3 ? 0 : 12,
          sku: `FL-${gi}${i}-${j}`,
        })),
    };
  }),
);
export const products: Product[] = seededProducts.map((p) =>
  p.variants.some((v) => v.color === p.color)
    ? p
    : {
        ...p,
        variants: [
          {
            id: `${p.id}-signature`,
            name: "Signature finish",
            color: p.color,
            price: p.price,
            stock: 12,
            sku: `FL-${p.id}-SIG`,
          },
          ...p.variants,
        ],
      },
);
export const categories = groups.map((g) => g.category);
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
export interface CatalogRepository {
  all(): Promise<Product[]>;
  find(slug: string): Promise<Product | undefined>;
}
export const catalogRepository: CatalogRepository = {
  all: async () => products,
  find: async (slug) => products.find((p) => p.slug === slug),
};
