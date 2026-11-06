import sharp from "sharp";
import process from "node:process";
const source = process.argv[2];
if (!source) throw new Error("Pass the path to the generated campaign PNG.");
await Promise.all(
  [1536, 768].map((width) =>
    sharp(source)
      .resize({ width })
      .webp({ quality: 84 })
      .toFile(`public/desk-campaign-${width}.webp`),
  ),
);
