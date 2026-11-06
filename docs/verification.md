# Verification

Verified on November 6, 2026, on Windows with Node 20.19.3 and headless Chromium 158 through Playwright. Node 22.12+ is recommended for new installations.

- Production build and strict TypeScript compilation pass. The on-demand Three.js chunk produces a bundle-size warning (about 938 kB minified / 248 kB gzip); it is loaded only after explicitly enabling 3D. The store and all purchase actions work without it.
- ESLint passes with no warnings. One targeted suppression documents Three.js's intentionally mutable camera API; camera changes update in place rather than recreating WebGL.
- 16 domain tests pass: compatible defaults, exact geometry counts and spacebar width, optical/case/keycap conflicts, pack rounding, cent calculations, fixture/SKU uniqueness, complete URL round-trips, malformed/versioned import rejection, storage recovery/migration, variant/configuration identity, re-adding old configurations after edits, quantity limits, aggregate switch stock, and stale/removed items.
- 11 Chromium browser tests pass: query-filter/back navigation; exact variant and quantity persistence; named build/share/component/total recovery; incompatibility replacement; editing one of two builds; form validation and keyboard entry; durable demo receipt; saved-build editing and delete undo; mobile draft filter Apply/Cancel and empty-state recovery; 3D rotation/zoom/reset/explosion; WebGL failure with reduced motion; dialog Escape/focus restoration; normal-route uncaught-error/failed-asset checks; and responsive overflow checks.
- axe-core WCAG 2 A/AA, 2.1 AA, and 2.2 AA rule scans report no violations on the fully loaded home, shop, and builder. Checkout is also scanned after validation errors. This is automated evidence, not a guarantee of complete WCAG conformance.
- Keyboard checks cover dialog entry, Escape, focus restoration, checkout field input/Tab behavior, and native controls. Screen reader behavior and every assistive-technology combination have not been exhaustively tested.
- Home, shop, and builder were rendered at 360, 390, 768, 1024, and 1440 px. No horizontal page overflow was found. Screenshots of the desktop homepage, mobile builder, and exploded 3D study were visually inspected. Saved screenshots are in ignored `test-results/`; stable homepage previews are in `docs/home-desktop.png` and `docs/home-mobile.png`.

## Performance lab observation

Catalog expansion follow-up: increased the seed catalog from 37 to 116 products while retaining existing product IDs. The production build, lint, and 16 domain tests passed. Four targeted Chromium journeys passed for new-product discovery/specifications/cart actions, filtered back navigation, existing variant persistence, and mobile filter Apply/Cancel/reset. Homepage collection cards were expanded to show eight featured objects. The performance observation below predates the catalog expansion.

`docs/performance-lab.json` records a single production-preview run: local Windows machine, headless Chromium, 1440 × 1000 viewport, no CPU or network throttling. LCP was **268 ms**, CLS **0**. These are optimistic local lab observations, not mobile-network or field guarantees. INP requires representative interactions and field data and was not measured. Reproduce with a production build, a preview server on `127.0.0.1:4174`, and `node scripts/measure.mjs`. Campaign images are responsive WebP loaded below the fold; the SVG hero is inline and immediately rendered.

`npm audit --omit=dev` reported zero production-dependency vulnerabilities during implementation. npm reported moderate development-tool advisories; these are not a claim that development tooling or future versions are risk-free.

Live payment, webhooks, server inventory, cloud persistence, and authenticated order ownership are unconfigured and untested. This is a local demo, not a production commerce service.
