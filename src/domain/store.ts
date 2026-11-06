import { create } from "zustand";
import { z } from "zod";
import { products } from "./catalog";
import {
  configSchema,
  defaultConfig,
  encodeConfig,
  total,
  conflicts,
  layouts,
  switches,
  switchPacks,
} from "./builder";
import type { Config } from "./builder";
const lineSchema = z.object({
  id: z.string(),
  product: z.string().optional(),
  variant: z.string().optional(),
  config: configSchema.optional(),
  name: z.string(),
  option: z.string(),
  price: z.number().int().nonnegative(),
  quantity: z.number().int().min(1).max(10),
});
export type CartLine = z.infer<typeof lineSchema>;
const savedSchema = z.object({
  id: z.string(),
  name: z.string(),
  config: configSchema,
});
export type Saved = z.infer<typeof savedSchema>;
const orderSchema = z.object({
  reference: z.string(),
  date: z.string(),
  email: z.string().email(),
  lines: z.array(lineSchema),
  subtotal: z.number().int(),
  shipping: z.number().int(),
  total: z.number().int(),
});
export type Order = z.infer<typeof orderSchema>;
const dataSchema = z.object({
  version: z.literal(1),
  config: configSchema,
  cart: z.array(lineSchema),
  saved: z.array(savedSchema),
  orders: z.array(orderSchema),
  wishlist: z.array(z.string()),
});
type Data = z.infer<typeof dataSchema>;
const blank: Data = {
  version: 1,
  config: defaultConfig,
  cart: [],
  saved: [],
  orders: [],
  wishlist: [],
};
export function recover(raw: string | null): Data {
  try {
    if (!raw) return blank;
    const parsed = JSON.parse(raw);
    if (parsed.version === 0) {
      parsed.version = 1;
      parsed.wishlist ??= [];
      parsed.orders ??= [];
    }
    return dataSchema.parse(parsed);
  } catch {
    return { ...blank };
  }
}
function read() {
  try {
    return recover(localStorage.getItem("form-lab-v1"));
  } catch {
    return blank;
  }
}
export const lineIdentity = (
  line: Pick<CartLine, "product" | "variant" | "config">,
) =>
  line.config
    ? `build:${encodeConfig(line.config)}`
    : `product:${line.product}:${line.variant}`;
export function mergeLine(cart: CartLine[], line: CartLine): CartLine[] {
  const existing = cart.find((x) =>
    line.config || line.product
      ? lineIdentity(x) === lineIdentity(line)
      : x.id === line.id,
  );
  return existing
    ? cart.map((x) =>
        x.id === existing.id
          ? { ...x, quantity: Math.min(10, x.quantity + line.quantity) }
          : x,
      )
    : [
        ...cart,
        {
          ...line,
          id: cart.some((x) => x.id === line.id)
            ? crypto.randomUUID()
            : line.id,
        },
      ];
}
export function revalidate(lines: CartLine[]): string[] {
  const errors = lines.flatMap((line) => {
    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 10
    )
      return [`${line.name}: quantity must be between 1 and 10.`];
    if (line.config)
      return [
        ...conflicts(line.config),
        ...(total(line.config) !== line.price
          ? ["Build pricing changed. Edit this build to review current prices."]
          : []),
      ];
    const p = products.find((x) => x.id === line.product),
      v = p?.variants.find((x) => x.id === line.variant);
    return !v
      ? [`${line.name} is no longer available.`]
      : v.stock < line.quantity
        ? [`${line.name}: only ${v.stock} available.`]
        : v.price !== line.price
          ? [`${line.name}: price changed. Remove and add the current option.`]
          : [];
  });
  const packs = new Map<string, number>();
  for (const line of lines) {
    if (!line.config) continue;
    const sw = switches.find((x) => x.id === line.config!.switch)!;
    packs.set(
      sw.id,
      (packs.get(sw.id) || 0) +
        switchPacks(layouts[line.config.layout].keys, sw.pack) * line.quantity,
    );
  }
  for (const [id, quantity] of packs) {
    const sw = switches.find((x) => x.id === id)!;
    if (quantity > sw.stock)
      errors.push(
        `${sw.name}: your bag needs ${quantity} switch packs; only ${sw.stock} are available. Reduce your build quantities.`,
      );
  }
  return errors;
}
type State = Data & {
  storageError: boolean;
  notice: string;
  setConfig: (c: Config) => void;
  add: (line: CartLine, editId?: string) => void;
  quantity: (id: string, n: number) => void;
  remove: (id: string) => void;
  restore: (line: CartLine) => void;
  save: (name: string, c: Config, id?: string) => void;
  deleteSaved: (id: string) => void;
  restoreSaved: (saved: Saved) => void;
  wish: (id: string) => void;
  order: (email: string) => Order;
  notify: (s: string) => void;
};
export const useStore = create<State>((set, get) => ({
  ...read(),
  storageError: false,
  notice: "",
  setConfig: (config) => set({ config }),
  notify: (notice) => set({ notice }),
  add: (line, editId) =>
    set((s) => ({
      cart: editId
        ? s.cart.map((x) =>
            x.id === editId ? { ...line, id: editId, quantity: x.quantity } : x,
          )
        : mergeLine(s.cart, line),
      notice: editId ? "Your build has been updated." : "Added to your bag.",
    })),
  quantity: (id, n) =>
    set((s) => ({
      cart: s.cart.map((x) =>
        x.id === id
          ? { ...x, quantity: Math.max(1, Math.min(10, Math.floor(n) || 1)) }
          : x,
      ),
    })),
  remove: (id) =>
    set((s) => ({
      cart: s.cart.filter((x) => x.id !== id),
      notice: "Removed from your bag.",
    })),
  restore: (line) =>
    set((s) => ({ cart: mergeLine(s.cart, line), notice: "Item restored." })),
  save: (name, config, id) =>
    set((s) => ({
      saved:
        id && s.saved.some((x) => x.id === id)
          ? s.saved.map((x) =>
              x.id === id
                ? { ...x, name: name.trim() || "Untitled build", config }
                : x,
            )
          : [
              ...s.saved,
              {
                id: crypto.randomUUID(),
                name: name.trim() || "Untitled build",
                config,
              },
            ],
      notice: "Build saved on this device.",
    })),
  deleteSaved: (id) =>
    set((s) => ({ saved: s.saved.filter((x) => x.id !== id) })),
  restoreSaved: (saved) => set((s) => ({ saved: [...s.saved, saved] })),
  wish: (id) =>
    set((s) => ({
      wishlist: s.wishlist.includes(id)
        ? s.wishlist.filter((x) => x !== id)
        : [...s.wishlist, id],
    })),
  order: (email) => {
    const s = get();
    const errors = revalidate(s.cart);
    if (!s.cart.length || errors.length)
      throw new Error(errors[0] || "Your bag is empty.");
    const subtotal = s.cart.reduce((sum, x) => sum + x.price * x.quantity, 0),
      shipping = subtotal >= 15000 ? 0 : 900;
    const order: Order = {
      reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date: new Date().toISOString(),
      email,
      lines: structuredClone(s.cart),
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
    set({ orders: [...s.orders, order], cart: [] });
    return order;
  },
}));
useStore.subscribe((s) => {
  try {
    localStorage.setItem(
      "form-lab-v1",
      JSON.stringify({
        version: s.version,
        config: s.config,
        cart: s.cart,
        saved: s.saved,
        orders: s.orders,
        wishlist: s.wishlist,
      }),
    );
  } catch {
    if (!s.storageError) useStore.setState({ storageError: true });
  }
});
