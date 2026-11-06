import { describe, it, expect } from "vitest";
import {
  defaultConfig,
  conflicts,
  switchPacks,
  total,
  bill,
  encodeConfig,
  decodeConfig,
  compatibleReplacement,
} from "./builder";
import { recover, lineIdentity, mergeLine, revalidate } from "./store";
import { money, products } from "./catalog";
import { keyboardGeometry } from "./geometry";
const line = {
  id: "one",
  name: "Test",
  option: "Chalk",
  price: 100,
  quantity: 1,
};
describe("compatibility and money", () => {
  it("renders each seeded key count with a real spacebar", () => {
    for (const layout of ["65%", "75%", "TKL"] as const) {
      const g = keyboardGeometry(layout);
      expect(g.keys.length).toBe(
        layout === "65%" ? 68 : layout === "75%" ? 82 : 87,
      );
      expect(g.keys.some((k) => k.label === "Space" && k.width === 6.25)).toBe(
        true,
      );
    }
  });
  it("seeds a compatible default for every layout", () => {
    for (const layout of ["65%", "75%", "TKL"] as const)
      expect(conflicts({ ...defaultConfig, layout })).toEqual([]);
  });
  it("rounds switch packs up at actual boundaries", () => {
    expect(switchPacks(68, 35)).toBe(2);
    expect(switchPacks(82, 35)).toBe(3);
    expect(switchPacks(87, 35)).toBe(3);
    expect(switchPacks(70, 35)).toBe(2);
  });
  it("rejects optical sockets and unsupported cases and cap coverage", () => {
    const c = {
      ...defaultConfig,
      layout: "TKL" as const,
      case: "sage" as const,
      switch: "optical" as const,
      keycap: "cobalt" as const,
    };
    expect(conflicts(c)).toHaveLength(3);
    expect(conflicts(compatibleReplacement(c))).toEqual([]);
  });
  it("uses integer prices and includes only selected accessories", () => {
    expect(total(defaultConfig)).toBe(20400);
    expect(total({ ...defaultConfig, mat: true, rest: true })).toBe(26700);
    expect(bill(defaultConfig).every((x) => Number.isInteger(x.price))).toBe(
      true,
    );
    expect(money(1299)).toBe("$12.99");
  });
  it("has 116 coherent products with unique IDs, slugs, variants, and SKUs", () => {
    expect(products.length).toBe(116);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    const expected = {
      Keyboards: 24,
      Keycaps: 24,
      Switches: 18,
      "Desk mats": 16,
      "Wrist rests": 12,
      Cables: 12,
      Bundles: 10,
    };
    for (const [category, count] of Object.entries(expected))
      expect(products.filter((p) => p.category === category)).toHaveLength(
        count,
      );
    const skus = products.flatMap((p) => p.variants.map((v) => v.sku));
    for (const category of Object.keys(expected)) {
      const group = products.filter((p) => p.category === category);
      expect(
        new Set(group.map((p) => p.color)).size,
        `${category}: distinct product finishes`,
      ).toBe(group.length);
      expect(
        group.every((p) => p.variants.some((v) => v.color === p.color)),
      ).toBe(true);
    }
    expect(new Set(skus).size).toBe(skus.length);
    for (const p of products) {
      expect(p.variants.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(60);
      expect(
        p.variants.every((v) => Number.isInteger(v.price) && v.price > 0),
      ).toBe(true);
      if (p.category === "Switches") {
        expect(p.feel).toBe(
          p.title.includes("Clicky")
            ? "Clicky"
            : p.title.includes("Tactile")
              ? "Tactile"
              : "Linear",
        );
        expect(p.specs["Actuation force"]).toMatch(/^\d+ g$/);
      }
    }
  });
});
describe("sharing and persistence", () => {
  it("round-trips every configuration field", () => {
    const c = {
      ...defaultConfig,
      layout: "65%" as const,
      case: "graphite" as const,
      switch: "moss" as const,
      keycap: "graphite" as const,
      mat: true,
      rest: true,
    };
    expect(decodeConfig(encodeConfig(c))).toEqual(c);
  });
  it("rejects malformed, unknown version, and incompatible imports", () => {
    for (const value of [
      "",
      "2~75%~chalk~cloud~chalk~0~0",
      "1~TKL~sage~cloud~chalk~0~0",
      "1~75%~chalk~cloud~chalk~2~0",
      "1~75%~chalk~cloud~chalk~0~0~extra",
    ])
      expect(() => decodeConfig(value)).toThrow();
  });
  it("recovers corrupted storage without crashing", () => {
    expect(recover("{broken").cart).toEqual([]);
    expect(recover('{"version":8}').config).toEqual(defaultConfig);
  });
  it("migrates version zero optional collections", () => {
    const old = { version: 0, config: defaultConfig, cart: [], saved: [] };
    expect(recover(JSON.stringify(old)).version).toBe(1);
    expect(recover(JSON.stringify(old)).wishlist).toEqual([]);
  });
});
describe("cart identity and validation", () => {
  it("does not merge the old configuration into an edited stable line", () => {
    const oldId = lineIdentity({ config: defaultConfig });
    const edited = {
      ...line,
      id: oldId,
      config: { ...defaultConfig, mat: true },
    };
    const cart = mergeLine([edited], {
      ...line,
      id: oldId,
      config: defaultConfig,
    });
    expect(cart).toHaveLength(2);
    expect(cart[0].config?.mat).toBe(true);
    expect(cart[1].config?.mat).toBe(false);
    expect(cart[0].id).not.toBe(cart[1].id);
  });
  it("merges a re-added configuration after a line was edited", () => {
    const existing = { ...line, id: "stable-edit-id", config: defaultConfig };
    const cart = mergeLine([existing], {
      ...existing,
      id: lineIdentity({ config: defaultConfig }),
    });
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
    expect(cart[0].id).toBe("stable-edit-id");
  });
  it("checks aggregate stock across different configurations", () => {
    const a = {
      ...line,
      config: defaultConfig,
      price: total(defaultConfig),
      quantity: 4,
    };
    const b = {
      ...a,
      id: "second",
      config: { ...defaultConfig, mat: true },
      price: total({ ...defaultConfig, mat: true }),
    };
    expect(revalidate([a, b]).join(" ")).toContain("24 switch packs");
  });
  it("merges identical snapshots and separates different builds", () => {
    const one = {
      ...line,
      id: lineIdentity({ config: defaultConfig }),
      config: defaultConfig,
    };
    const two = {
      ...one,
      id: lineIdentity({ config: { ...defaultConfig, mat: true } }),
      config: { ...defaultConfig, mat: true },
    };
    const cart = mergeLine(mergeLine(mergeLine([], one), one), two);
    expect(cart).toHaveLength(2);
    expect(cart[0].quantity).toBe(2);
    expect(cart[1].quantity).toBe(1);
  });
  it("distinguishes variants and caps quantities", () => {
    expect(lineIdentity({ product: "a", variant: "1" })).not.toBe(
      lineIdentity({ product: "a", variant: "2" }),
    );
    expect(mergeLine([{ ...line, quantity: 10 }], line)[0].quantity).toBe(10);
  });
  it("rejects removed products and stale or incompatible builds", () => {
    expect(revalidate([{ ...line, product: "missing" }])).toHaveLength(1);
    expect(revalidate([{ ...line, config: defaultConfig }])).toHaveLength(1);
    expect(
      revalidate([
        {
          ...line,
          config: { ...defaultConfig, switch: "optical" },
          price: total(defaultConfig),
        },
      ]).length,
    ).toBeGreaterThan(0);
  });
});
