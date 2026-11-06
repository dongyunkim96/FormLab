# Asset provenance

Product finishes are now color-treated at render time with an SVG luminance mask and per-product palette. This preserves source texture and shading while differentiating the catalog without additional image generation. Product-detail swatches update this treatment immediately. The color treatment is illustrative, not a claim of physical color accuracy.

Product studio images: one original AI-generated 4 × 2 contact sheet (`exec-d109f526-078c-4d5a-b194-cea27372e5ef.png`) was generated on November 6, 2026 and split into eight local WebP files under `public/products/` using `scripts/prepare-product-photos.mjs`. These representative category images are reused to reduce generation usage. Product detail pages identify them as generated and offer a separate deterministic selected-finish illustration. Builder and cart configuration previews retain their procedural visuals. No actual product photography or exact variant depiction is claimed.

All keyboard SVGs, keycap tiles, switches, cable paths, desk mats, and wrist rests are original procedural graphics authored in this repository. Their source lives in `src/ui/Keyboard.tsx`, `src/ui/Preview3D.tsx`, `src/domain/geometry.ts`, and `src/styles.css`. The favicon is original SVG source. No remote product models or stock photography are used.

The desk campaign image was generated for this project using the built-in imagegen tool on November 6, 2026. It depicts an imagined ivory/graphite keyboard on a sage desk mat in warm light. It is campaign artwork, not an exact configuration preview. Original generated filename: `exec-9f411800-d178-4f65-8d4c-8ccf30a69df2.png`. Optimized local assets: `public/desk-campaign-768.webp` and `public/desk-campaign-1536.webp`. `scripts/optimize-art.mjs` reproduces the responsive WebP conversion given the original file. No third-party source image was supplied.

Lucide icons come from `lucide-react` under the ISC license. The lockfile identifies the exact package. Font stacks use locally available Arial/Helvetica/system sans-serif and Courier New/monospace; no font files are redistributed or downloaded. The expressive display treatment uses size, weight, and tight tracking within the system stack.

The procedural 2D preview and optional 3D study share layout geometry with exact seeded key counts, staggered rows, and a 6.25u spacebar. They are illustrative, not manufacturing drawings or exact manufactured dimensions. Colors are approximations on screen. The specification and compatibility data define the selected product. All sample customer feedback is explicitly labeled fictional.

No audio is included, since no licensed, accurately labeled switch recordings were supplied. No premium Motion assets or Motion+ examples are used.
