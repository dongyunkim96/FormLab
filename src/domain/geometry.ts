import type { Layout } from "./catalog";
type Key = { label: string; x: number; y: number; width: number };
type RowItem = string | [string, number];
const letters = (s: string) => s.split("");
export function keyboardGeometry(layout: Layout): {
  keys: Key[];
  width: number;
  rows: number;
} {
  const compact: RowItem[][] = [
    ["Esc", ...letters("1234567890-="), ["Back", 2], "Del"],
    [["Tab", 1.5], ...letters("QWERTYUIOP[]\\"), "PgUp"],
    [["Caps", 1.75], ...letters("ASDFGHJKL;'"), ["Enter", 2.25], "PgDn"],
    [["Shift", 2.25], ...letters("ZXCVBNM,./"), ["Shift", 1.75], "↑", "End"],
    [
      ["Ctrl", 1.25],
      ["Win", 1.25],
      ["Alt", 1.25],
      ["Space", 6.25],
      "Alt",
      "Fn",
      "Ctrl",
      "←",
      "↓",
      "→",
    ],
  ];
  const fn = [
    "Esc",
    ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
    "Prt",
    "Scr",
    "Pause",
  ];
  const rows: RowItem[][] =
    layout === "TKL"
      ? [
          fn,
          [
            "`",
            ...letters("1234567890-="),
            ["Back", 2],
            ["Ins", 1.5],
            "Home",
            "PgUp",
          ],
          [
            ["Tab", 1.5],
            ...letters("QWERTYUIOP[]\\"),
            ["Del", 1.5],
            "End",
            "PgDn",
          ],
          [["Caps", 1.75], ...letters("ASDFGHJKL;'"), ["Enter", 2.25]],
          [
            ["Shift", 2.25],
            ...letters("ZXCVBNM,./"),
            ["Shift", 2.75],
            ["↑", 2.5],
          ],
          [
            ["Ctrl", 1.25],
            ["Win", 1.25],
            ["Alt", 1.25],
            ["Space", 6.25],
            ["Alt", 1.25],
            ["Win", 1.25],
            ["Menu", 1.25],
            ["Ctrl", 1.25],
            ["←", 1.5],
            "↓",
            "→",
          ],
        ]
      : layout === "75%"
        ? [[...fn.slice(0, 14)], ...compact]
        : compact;
  const keys: Key[] = [];
  let width = 0;
  rows.forEach((row, y) => {
    let x = 0;
    row.forEach((item) => {
      const [label, w] = typeof item === "string" ? [item, 1] : item;
      keys.push({ label, x, y, width: w });
      x += w;
    });
    width = Math.max(width, x);
  });
  return { keys, width, rows: rows.length };
}
