import sharp from "sharp";
import process from "node:process";
import fs from "node:fs/promises";
const source = process.argv[2];
if (!source) throw new Error("Provide the generated 4 × 2 contact sheet.");
const { width, height } = await sharp(source).metadata();
const names = [
  "keyboard-chalk",
  "keyboard-graphite",
  "keycaps",
  "switches",
  "desk-mat",
  "wrist-rest",
  "cable",
  "bundle",
];
await fs.mkdir("public/products", { recursive: true });
for (const [i, name] of names.entries()) {
  const left = Math.round(((i % 4) * width) / 4),
    top = Math.round((Math.floor(i / 4) * height) / 2);
  const w = Math.round((((i % 4) + 1) * width) / 4) - left,
    h = Math.round(((Math.floor(i / 4) + 1) * height) / 2) - top;
  await sharp(source)
    .extract({ left, top, width: w, height: h })
    .resize(768, 768, { fit: "cover" })
    .webp({ quality: 85 })
    .toFile(`public/products/${name}.webp`);
}
