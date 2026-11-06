# FORM LAB

An original mechanical keyboard and desk accessory portfolio store. React 19, strict TypeScript, Vite, Tailwind CSS v4, React Router, Zustand, React Hook Form, Zod, Motion, and an on-demand React Three Fiber preview.

## Run locally

Use Node 22.12+ (recommended) and npm. A lockfile records resolved dependencies.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:5173.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

On Windows with an existing Playwright browser installation, set `PLAYWRIGHT_BROWSERS_PATH` to that installation directory before running browser tests. `npm run build` writes the static SPA to `dist`. Configure a hosting fallback from unknown paths to `index.html` for deep links. Nothing has been deployed or connected to a paid service.

## What to try

- Search and filter 116 products across seven categories with shareable query parameters; compare up to three objects within a category. The collection includes 24 keyboards, 24 keycap sets, 18 switch packs, 16 desk mats, 12 wrist rests, 12 cables, and 10 bundles.
- Select a product finish and quantity before adding it to the bag.
- Build a 65%, 75%, or TKL keyboard. Try a Cobalt case with a 65% layout or optical switches to review the compatibility explanation and proposed replacement price.
- Save a named build, duplicate it, share its versioned URL, add different builds to the bag, and edit a specific bag item.
- Complete the clearly marked demo checkout with fictional contact/address information. Refresh the order result to see its durable local receipt.
- Use the optional 3D material study or remain in the fast procedural 2D experience. Camera controls never affect the stored configuration.

## Demo boundaries

This is a fictional portfolio brand. All products, stock, feedback, and shipping policies are illustrative. No payment is taken, no email is sent, and no goods ship. Tax is explicitly not collected. Demo shipping estimates are $9 below $150 and free at or above $150.

The cart, current configuration, wishlist, named builds, and demo orders persist in this browser’s `localStorage`. Names and addresses are validated but not retained; the demo receipt retains the entered email. Use fictional details. Order references are local, not public access tokens. Clearing storage removes the data. Save links encode product choices only. Corrupt or unsupported persisted state recovers to defaults. Storage failures are shown to the user.

The `CatalogRepository` and domain types provide the fixture integration boundary. Optional payment/cloud integrations are intentionally unconfigured. Before accepting real orders, implement an authenticated server repository, authoritative pricing and inventory, transactional stock protection, order ownership checks, Stripe test Checkout session creation, signature-verified idempotent webhooks, and the additional integration tests in the supplied brief. Never use client totals or success redirects to establish payment.

## Design and limitations

Original warm ivory, graphite, cobalt, and sage design with procedural product assets, original generated campaign art, and system fonts. The 2D product images and 3D model share seeded key counts and layout geometry; the domain specifications define compatibility. The 3D model is an illustrative material study, with demand rendering, capped DPR, bounded controls, an error boundary, and a 2D fallback. It does not depict a manufacturing drawing.

This static SPA changes route titles and canonical paths in the browser and supplies base social metadata. It does not provide server-rendered product SEO, per-product social link previews, or search-engine guarantees. No fake rating or offer schema is emitted. Real performance requires representative device/network measurement; lab checks do not establish field Core Web Vitals.

See [architecture](docs/architecture.md), [tooling](docs/tooling.md), [assets](docs/assets.md), and [verification](docs/verification.md).
