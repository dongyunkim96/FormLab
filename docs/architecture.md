# Architecture

`src/domain/catalog.ts` contains deterministic products, integer-cent variants, SKUs, specifications, and a typed asynchronous catalog repository interface. Product presentation consumes the same fixtures that cart revalidation checks.

`src/domain/builder.ts` owns the versioned configuration schema, exact seeded layout counts (68 / 82 / 87), case/PCB systems, MX sockets, keycap layout and required-size coverage, switch pack stock and ceiling rounding, accessory sizing, replacement proposals, bill of materials, and share serialization. Pure functions do not depend on React.

`src/domain/store.ts` owns local state through Zustand. Persisted input passes Zod validation. Version zero is migrated; malformed/unknown versions reset safely. Storage access failures do not crash the application and write failures show a warning. Each cart line retains an immutable part selection and price snapshot. Current fixtures revalidate compatibility, pricing, and stock before creating a local order. Snapshot prices are not a real purchasing authority.

Pages are separated into catalog, product, builder, cart, checkout, and saved-build experiences. Shared native modal dialogs provide focus confinement, Escape dismissal, and focus restoration without adding a UI kit. Search/filter query parameters are the applied source of truth; the modal edits a separate draft until Apply. Browser back retains the previous filtered URL.

The builder is functional in ordinary HTML with an SVG preview. Its optional `Preview3D` chunk loads on request. React Three Fiber runs with `frameloop="demand"`, DPR capped at 1.5, simple geometry/materials, no continuous animation, and declarative resource lifetimes. Offscreen idle scenes require no render loop. Reduced-motion users default to 2D. An error boundary, Suspense poster, and context-loss handler preserve the ordinary build controls. Rotation and zoom state are ephemeral and bounded. Touch scrolling is preserved; zoom uses buttons.

Checkout uses React Hook Form and Zod. It validates a demo US address, requests acknowledgment of the simulation, revalidates the cart, snapshots an order, and clears the cart atomically in the store. It never accepts card numbers. Only the fictional email is retained with the local receipt; names and addresses are not stored. Client storage has no security or multi-device guarantee.

## Connecting services later

Implement the repository on a server and keep all secrets there. Payment session creation should accept SKU/configuration identifiers and quantity, not trusted prices. Recalculate stock, compatibility, tax, shipping, and prices. Use transactional inventory reservations and release/expiry. The payment webhook must verify signatures, deduplicate provider event IDs, create one order per session, and expose status only after checking ownership. Do not mark orders paid from browser navigation. Add tests for tampering, stock conflicts, ownership, cancellation, duplicate events, and delayed settlement. None of these services is claimed as implemented in this local demo.
