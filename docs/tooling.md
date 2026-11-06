# Tools actually used

- Local shell and patch tools: inspected the empty Git workspace, read the supplied brief, authored source, installed dependencies, and ran checks.
- Official web documentation: verified Tailwind v4’s Vite plugin integration, React Three Fiber 9 / React 19 pairing, and Motion’s React entry point. References: https://tailwindcss.com/docs/installation/using-vite, https://r3f.docs.pmnd.rs/getting-started/installation, https://motion.dev/docs/react.
- npm registry: checked current React, Vite, Tailwind, Fiber, Node engine, and peer-dependency requirements; the lockfile is the resolved version record. Vitest is pinned to 4.1.12 to avoid an npm peer resolution failure encountered with the current latest package.
- Sites skill: local-only workflow, matching the brief’s instruction not to publish without authorization.
- Vercel React best-practices and verification skills: component boundaries, deferred 3D loading, semantic controls, persisted data validation, and user-flow verification.
- Playwright CLI and axe-core: committed end-to-end browser journeys and accessibility checks. Results are recorded in `verification.md`.
- Codex app MCP `open_in_codex`: requested opening the local preview beside the chat; the app returned a queued result. This UI handoff was separate from Playwright verification.
- Built-in imagegen tool and skill: created one original campaign image, then optimized it into two local WebP sizes using Sharp. Product configuration previews remain deterministic code-generated assets.

Available tool metadata was inventoried. Context7, Motion MCP, shadcn MCP, Playwright MCP, Chrome DevTools MCP, Stripe MCP, and GitHub MCP were not exposed in this session. Neon, Sites, and Vercel connector tools were discoverable, but no service-specific project or credentials were supplied or needed for the local application. No Neon database, Stripe account, GitHub remote, or Vercel deployment was accessed. Figma was not connected and no authorized design file was supplied. No MCP is a runtime dependency.
