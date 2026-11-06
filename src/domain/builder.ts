import { z } from "zod";
import type { Layout } from "./catalog";
export const layouts: Record<
  Layout,
  { keys: number; width: number; price: number; system: string }
> = {
  "65%": { keys: 68, width: 325, price: 9900, system: "FORM-65" },
  "75%": { keys: 82, width: 335, price: 11900, system: "FORM-75" },
  TKL: { keys: 87, width: 365, price: 13900, system: "FORM-TKL" },
};
export const cases = [
  {
    id: "chalk",
    name: "Chalk aluminum",
    color: "#dedcd3",
    price: 0,
    layouts: ["65%", "75%", "TKL"],
  },
  {
    id: "graphite",
    name: "Graphite aluminum",
    color: "#464945",
    price: 1500,
    layouts: ["65%", "75%", "TKL"],
  },
  {
    id: "cobalt",
    name: "Cobalt aluminum",
    color: "#315bee",
    price: 2500,
    layouts: ["75%", "TKL"],
  },
  {
    id: "sage",
    name: "Sage aluminum",
    color: "#9cae97",
    price: 2000,
    layouts: ["65%", "75%"],
  },
];
export const switches = [
  {
    id: "cloud",
    name: "Cloud linear",
    feel: "Smooth, consistent travel. No tactile bump.",
    price: 1200,
    pack: 35,
    socket: "MX",
    stock: 20,
  },
  {
    id: "moss",
    name: "Moss tactile",
    feel: "A gentle bump you can feel with every press.",
    price: 1400,
    pack: 35,
    socket: "MX",
    stock: 20,
  },
  {
    id: "signal",
    name: "Signal clicky",
    feel: "A tactile bump with a distinct audible click.",
    price: 1300,
    pack: 35,
    socket: "MX",
    stock: 20,
  },
  {
    id: "optical",
    name: "Prism optical",
    feel: "Optical sensing; incompatible with FORM MX sockets.",
    price: 1100,
    pack: 35,
    socket: "Optical",
    stock: 20,
  },
];
export const keycaps = [
  {
    id: "chalk",
    name: "Chalk PBT",
    color: "#eeeae1",
    price: 4900,
    layouts: ["65%", "75%", "TKL"],
    sizes: ["1.75u", "6.25u"],
  },
  {
    id: "graphite",
    name: "After Hours PBT",
    color: "#5b5d59",
    price: 5900,
    layouts: ["65%", "75%", "TKL"],
    sizes: ["1.75u", "6.25u"],
  },
  {
    id: "cobalt",
    name: "Studio Blue PBT",
    color: "#a3b4da",
    price: 5500,
    layouts: ["65%", "75%"],
    sizes: ["1.75u", "6.25u"],
  },
];
export const configSchema = z
  .object({
    v: z.literal(1),
    layout: z.enum(["65%", "75%", "TKL"]),
    case: z.enum(["chalk", "graphite", "cobalt", "sage"]),
    switch: z.enum(["cloud", "moss", "signal", "optical"]),
    keycap: z.enum(["chalk", "graphite", "cobalt"]),
    mat: z.boolean(),
    rest: z.boolean(),
  })
  .strict();
export type Config = z.infer<typeof configSchema>;
export const defaultConfig: Config = {
  v: 1,
  layout: "75%",
  case: "chalk",
  switch: "cloud",
  keycap: "chalk",
  mat: false,
  rest: false,
};
export const switchPacks = (count: number, size: number) =>
  Math.ceil(count / size);
export function conflicts(c: Config): string[] {
  const errors: string[] = [];
  const ca = cases.find((x) => x.id === c.case)!;
  const sw = switches.find((x) => x.id === c.switch)!;
  const kc = keycaps.find((x) => x.id === c.keycap)!;
  if (!ca.layouts.includes(c.layout))
    errors.push(
      `${ca.name} does not support ${c.layout}. Each FORM case includes its matching PCB and plate.`,
    );
  if (sw.socket !== "MX")
    errors.push(
      "Prism optical switches need optical sensors. FORM PCBs use 5-pin MX hot-swap sockets.",
    );
  if (
    !kc.layouts.includes(c.layout) ||
    !kc.sizes.includes("6.25u") ||
    !kc.sizes.includes("1.75u")
  )
    errors.push(
      `${kc.name} does not include the required ${c.layout} coverage.`,
    );
  if (switchPacks(layouts[c.layout].keys, sw.pack) > sw.stock)
    errors.push("Not enough switch packs in stock.");
  if (c.rest && layouts[c.layout].width > 365)
    errors.push("Wrist rest is too short.");
  return errors;
}
export function compatibleReplacement(c: Config): Config {
  return {
    ...c,
    case: cases.find((x) => x.id === c.case)!.layouts.includes(c.layout)
      ? c.case
      : "chalk",
    switch: c.switch === "optical" ? "cloud" : c.switch,
    keycap: keycaps.find((x) => x.id === c.keycap)!.layouts.includes(c.layout)
      ? c.keycap
      : "chalk",
  };
}
export function bill(c: Config) {
  const s = switches.find((x) => x.id === c.switch)!;
  return [
    {
      name: `FORM ${c.layout} case / PCB / plate`,
      price:
        layouts[c.layout].price + cases.find((x) => x.id === c.case)!.price,
    },
    {
      name: `${s.name} · ${switchPacks(layouts[c.layout].keys, s.pack)} × ${s.pack}-switch packs`,
      price: switchPacks(layouts[c.layout].keys, s.pack) * s.price,
    },
    {
      name: keycaps.find((x) => x.id === c.keycap)!.name,
      price: keycaps.find((x) => x.id === c.keycap)!.price,
    },
    ...(c.mat ? [{ name: "Grid desk mat · 900 × 400 mm", price: 2900 }] : []),
    ...(c.rest ? [{ name: "Oak wrist rest · 365 mm", price: 3400 }] : []),
  ];
}
export const total = (c: Config) =>
  bill(c).reduce((sum, x) => sum + x.price, 0);
export const encodeConfig = (c: Config) =>
  [c.v, c.layout, c.case, c.switch, c.keycap, +c.mat, +c.rest].join("~");
export function decodeConfig(value: string): Config {
  const [v, layout, ca, sw, kc, mat, rest, ...extra] = value.split("~");
  if (extra.length || !["0", "1"].includes(mat) || !["0", "1"].includes(rest))
    throw new Error("This build link is incomplete or invalid.");
  const c = configSchema.parse({
    v: Number(v),
    layout,
    case: ca,
    switch: sw,
    keycap: kc,
    mat: mat === "1",
    rest: rest === "1",
  });
  if (conflicts(c).length)
    throw new Error(
      "This shared build has incompatible parts. Your current build is unchanged.",
    );
  return c;
}
