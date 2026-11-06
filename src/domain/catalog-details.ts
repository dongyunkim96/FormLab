import type { Category } from "./catalog";
const palettes: Record<string, string> = {
  Chalk: "#dedcd3",
  "After Hours": "#464945",
  "Studio Blue": "#597cc3",
  "Field Notes": "#879f73",
  "Warm Sand": "#c7aa7c",
  Signal: "#d3b45a",
  Topography: "#9fae89",
  "Graph Paper": "#a9b6c8",
  Dune: "#cbb18a",
  Nightfall: "#424d65",
  Tidal: "#6eaaa8",
  Terrazzo: "#bca39a",
  Meadow: "#87a775",
  Horizon: "#c48f7d",
  "Dot Matrix": "#8d92b0",
  Walnut: "#806044",
  "Smoked Oak": "#685548",
  Oak: "#b79871",
  Maple: "#d0b78b",
  Bamboo: "#b9a475",
  Cherry: "#ad795d",
  Cork: "#b79b71",
  Ash: "#c6baa2",
  Ember: "#b87555",
  Pine: "#668473",
  Lagoon: "#6caaa7",
  Lavender: "#b3a3c6",
  Terracotta: "#bb806b",
  Glacier: "#adcad9",
  Porcelain: "#e9e5db",
  Midnight: "#434c62",
  Matcha: "#a5b782",
  Rosewood: "#ac7d83",
  Marigold: "#d3b25e",
  Blueprint: "#5d83b7",
  "Oat Milk": "#dfd2b8",
  Storm: "#8996a6",
  Clay: "#c59e8d",
  "Sea Glass": "#9bbdb2",
  Plum: "#8b7495",
  Espresso: "#867365",
};
export function themeColor(title: string): string | undefined {
  return Object.entries(palettes).find(([name]) => title.includes(name))?.[1];
}
// Each product has its own finish instead of cycling four builder colors.
const finishes: Record<Category, string[]> = {
  Keyboards: [
    "#dedcd3",
    "#43494c",
    "#315bee",
    "#a2bd8e",
    "#ca795b",
    "#8069b5",
    "#d6ad4b",
    "#367d85",
    "#91465e",
    "#b7cddd",
    "#254d3c",
    "#d6bca3",
    "#5a3a78",
    "#b9c854",
    "#bf939e",
    "#273b65",
    "#c64b35",
    "#72b9ad",
    "#74604b",
    "#77a8cd",
    "#ddd49d",
    "#9c617d",
    "#677b56",
    "#3c7370",
  ],
  Keycaps: [
    "#dedcd3",
    "#34383f",
    "#477cdb",
    "#7f963f",
    "#cfab71",
    "#e1cc38",
    "#c64a36",
    "#286248",
    "#32a3b5",
    "#af7cc9",
    "#d78354",
    "#b7d9eb",
    "#f1ede5",
    "#22365d",
    "#b3cb67",
    "#be738f",
    "#e7aa30",
    "#2b50a4",
    "#e5cba1",
    "#667c94",
    "#ad7c7f",
    "#8ccdb5",
    "#784c91",
    "#77503b",
  ],
  Switches: [
    "#a6cae8",
    "#65884b",
    "#e0b52d",
    "#b8a9d4",
    "#b4b783",
    "#354763",
    "#d388ae",
    "#c49a65",
    "#c4574b",
    "#63bab9",
    "#468a65",
    "#ae6842",
    "#cfdfeb",
    "#7a668d",
    "#cf8733",
    "#8e657b",
    "#6b727c",
    "#526b9a",
  ],
  "Desk mats": [
    "#b6c1a3",
    "#718caf",
    "#619882",
    "#42444b",
    "#b78cc4",
    "#d1b14c",
    "#e1dacb",
    "#c38c58",
    "#293852",
    "#3caaaa",
    "#ca8d86",
    "#93b85d",
    "#3e64b3",
    "#d98861",
    "#847aa8",
    "#c1a38c",
  ],
  "Wrist rests": [
    "#be995e",
    "#704a36",
    "#c7ab74",
    "#d7c9b1",
    "#45494c",
    "#ead2a3",
    "#a9af63",
    "#b96f49",
    "#55443c",
    "#779774",
    "#e9e3d7",
    "#926b51",
  ],
  Cables: [
    "#315bee",
    "#bc7157",
    "#9b69b8",
    "#d5bd34",
    "#557d44",
    "#a3b894",
    "#d64f32",
    "#243354",
    "#e5dcc6",
    "#2a9b9b",
    "#df9b3e",
    "#48494f",
  ],
  Bundles: [
    "#d4ceb9",
    "#5375bb",
    "#4d7b67",
    "#b46d87",
    "#848fa6",
    "#a4b65f",
    "#343c53",
    "#d6ac73",
    "#c68b69",
    "#2d53bd",
  ],
};
export function productFinish(category: Category, index: number): string {
  const color = finishes[category][index];
  if (!color)
    throw new Error(`Missing catalog finish for ${category} ${index}`);
  return color;
}
export function productDetails(
  category: Category,
  title: string,
  index: number,
): { description: string; specs: Record<string, string> } {
  if (category === "Keyboards") {
    const series = title.split(" ").slice(2).join(" ") || "Original";
    const plates: Record<string, string> = {
      Original: "Aluminum",
      Studio: "Polycarbonate",
      Essential: "Aluminum",
      Quiet: "Polycarbonate",
      Carbon: "FR4",
      Arc: "Polycarbonate",
      Atelier: "Brass",
      Pro: "FR4",
    };
    const notes: Record<string, string> = {
      Original: " An everyday all-rounder with a balanced aluminum plate.",
      Studio: " A flexible polycarbonate plate brings a softer bottom-out.",
      Essential:
        " A straightforward wired build with an aluminum plate and removable switches.",
      Quiet:
        " Silent linear switches and a damped case suit shared workspaces.",
      Carbon: " An FR4 plate and tactile switches provide distinct feedback.",
      Arc: " A softer plate and smooth linear switches keep the rhythm light.",
      Atelier:
        " A brass plate adds a firmer, more substantial typing response.",
      Pro: " An FR4 plate, tactile switches, and additional case damping round out the Pro series.",
    };
    return {
      description: notes[series] || "",
      specs: {
        Series: series,
        Plate: plates[series] || "Aluminum",
        "Included switches":
          series === "Quiet"
            ? "Silent linear"
            : series === "Carbon" || series === "Pro"
              ? "Tactile"
              : "Linear",
        "Included keycaps": "145-key PBT kit",
        "Case damping":
          series === "Essential" ? "Base foam" : "Plate and case foam",
      },
    };
  }
  if (category === "Keycaps")
    return {
      description: ` ${title.replace(" PBT", "")} pairs a themed base with contrasting accent keys.`,
      specs: {
        Theme: title.replace(" PBT", ""),
        "Key count": "145",
        Spacebar: "6.25u",
        "Right Shift": "1.75u",
      },
    };
  if (category === "Switches") {
    const force = [
      45, 55, 60, 45, 62, 50, 38, 58, 65, 42, 55, 63, 35, 67, 60, 48, 70, 55,
    ][index];
    const silent = /Silent|Quiet/.test(title);
    return {
      description: ` ${force} g actuation with ${silent ? "damped downstrokes and upstrokes" : title.includes("Clicky") ? "an audible click" : title.includes("Tactile") ? "a pronounced tactile bump" : "a smooth linear press"}.`,
      specs: {
        "Actuation force": `${force} g`,
        Travel: title.includes("Long-Pole") ? "3.5 mm" : "4.0 mm",
        Sound: silent
          ? "Damped"
          : title.includes("Clicky")
            ? "Clicky"
            : "Undamped",
        "Factory lubrication": title.includes("Clicky")
          ? "Unlubricated"
          : "Lightly lubricated",
      },
    };
  }
  if (category === "Desk mats") {
    const compact = title.includes("Compact");
    const size = compact
      ? "600 × 300 × 4 mm"
      : index % 3 === 1
        ? "800 × 350 × 4 mm"
        : "900 × 400 × 4 mm";
    return {
      description: ` ${title.replace(" Desk Mat", "")} artwork, stitched edges, and a ${compact ? "compact" : "generous"} footprint.`,
      specs: {
        Dimensions: size,
        Pattern: title.replace(" Desk Mat", ""),
        Base: "Natural rubber",
        "Edge finish": "Stitched",
      },
    };
  }
  if (category === "Wrist rests") {
    const material = title.replace(/ Wrist Rest$/, "").replace(" Compact", "");
    const compact = title.includes("Compact");
    return {
      description: ` ${material} finish with a gently rounded front edge.`,
      specs: {
        Material: material,
        Dimensions: compact ? "325 × 80 × 18 mm" : "365 × 80 × 18 mm",
        Compatibility: compact ? "FORM 65% only" : "FORM 65%, 75%, TKL",
        "Base pads": "Non-slip silicone",
      },
    };
  }
  if (category === "Cables") {
    const coiled = /Coil|Studio|Signal|Field/.test(title);
    const length = title.includes("Travel")
      ? "0.8 m"
      : coiled
        ? "1.8 m extended"
        : "1.8 m";
    return {
      description: ` ${coiled ? "A compact desk coil" : "A straight, easy-to-route cable"} with ${title.includes("Travel") ? "a shorter travel length" : "a woven jacket"}.`,
      specs: {
        Form: coiled ? "Coiled" : "Straight",
        Length: length,
        Jacket: "Woven nylon",
        "Connector housing": "Aluminum",
      },
    };
  }
  const quiet = title.includes("Quiet");
  const starter = title.includes("First Build");
  return {
    description: ` ${quiet ? "A silent-switch setup for a shared space" : starter ? "A compact starting point with matching desk essentials" : "A coordinated palette for a complete desk refresh"}.`,
    specs: {
      Includes: `FORM ${starter ? "65" : "75"}${quiet ? " Quiet" : ""}, ${index % 2 ? "Contour" : "Grid"} mat, ${index % 2 ? "straight" : "coiled"} USB-C cable`,
      Layout: starter ? "65%" : "75%",
      "Switch feel": quiet ? "Silent linear" : "Linear",
      "Keycap palette": title.replace(/^The | Set$/g, ""),
    },
  };
}
