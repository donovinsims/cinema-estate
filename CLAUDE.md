# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Cinema Estate" — a marketing landing page (real-estate listing photos turned into
cinematic video packages) built on `vinext` (Next.js App Router running on a Cloudflare
Worker instead of the standard Next.js server). It started from the `vinext-starter`
template, so generic starter scaffolding (D1/R2 bindings, Drizzle, ChatGPT sign-in
helpers) is present but currently unused by the actual site content.

## Commands

- `npm ci --include=dev` — install the required Vinext, test, and lint tooling in this production-oriented shell
- `npm run dev` — start local dev (vinext dev, backed by Miniflare/Wrangler)
- `npm run build` — production build (`vinext build`); required before `npm test`
- `npm run start` — run the built worker (`vinext start`)
- `npm test` — runs `npm run build` then `node --test tests/*.test.mjs`
- Run a single test file directly (after building): `node --test tests/rendered-html.test.mjs`
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npm run db:generate` — generate Drizzle migrations into `./drizzle` from `db/schema.ts`

There is no plain `next dev`/`next build` — everything routes through `vinext`, which
wraps Vite + the Cloudflare Vite plugin.

## Architecture

### Request flow (Cloudflare Worker, not a Node server)

`worker/index.ts` is the actual fetch entry point. It intercepts `/_vinext/image` for
on-the-fly image optimization (via `vinext/server/image-optimization`, using the `IMAGES`
binding) and otherwise delegates to `vinext/server/app-router-entry`, which runs the
Next.js App Router (`app/`) as RSC/SSR inside the worker.

### Build/dev wiring (`vite.config.ts`)

- `vinext()` — the framework plugin that turns `app/` into a Next-compatible worker build.
- `sites()` (`build/sites-vite-plugin.ts`) — a `closeBundle` hook that copies
  `.openai/hosting.json` and the `drizzle/` migrations folder into `dist/.openai` after
  build, so the hosting platform can read binding config and apply migrations.
- `@cloudflare/vite-plugin` — simulates the Worker's bindings (D1, R2) locally for dev,
  configured from `.openai/hosting.json`'s `d1`/`r2` fields (both currently `null`, i.e.
  no database/bucket is provisioned for this site yet).

### Optional D1/Drizzle layer (currently unused)

`db/schema.ts` is intentionally empty (`export {}`). `db/index.ts#getDb()` wraps
`drizzle-orm/d1` and throws a descriptive error if the `DB` binding isn't present —
enable it by setting `d1` in `.openai/hosting.json` and adding tables to `db/schema.ts`,
then `npm run db:generate` to produce migrations under `drizzle/`.

### ChatGPT/SIWC auth helpers (currently unused by any route)

`app/chatgpt-auth.ts` provides `getChatGPTUser()` / `requireChatGPTUser(returnTo)` for
reading identity from the `oai-authenticated-user-email` / `oai-authenticated-user-full-name`
request headers that the hosting platform ("Dispatch") injects for signed-in ChatGPT
users. Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, and
associated cookies — do not add app routes at those paths. Pages that call
`requireChatGPTUser` must set `export const dynamic = "force-dynamic"` since they depend
on per-request headers. Routes that never call these helpers stay anonymous/publicly
cacheable.

### Page content (`app/`)

`app/page.tsx` is the single landing page, composed of server-rendered marketing sections
plus a few client islands:

- `ComparisonExperience.tsx` — draggable before/after image↔video slider. Pure slider math
  (clamping, keyboard nav) lives in `app/comparison-state.mjs`, a plain `.mjs` module kept
  free of React/JSX specifically so `tests/comparison-state.test.mjs` can unit-test it with
  `node --test` and no build step.
- `EarlyAccessButton.tsx` — dispatches a `window` CustomEvent (`cinemaestate:early-access`)
  rather than holding modal state itself.
- `EarlyAccessModal.tsx` — listens for that event; also auto-opens once based on a
  scroll-depth + dwell-time heuristic, gated by a `localStorage` dismissal/conversion
  cooldown (`cinema-estate.waitlist-dismissed-at` / `-converted`).
- `WaitlistForm.tsx` — secondary email capture only. It posts to the first-party
  `/api/early-access` route, displays a non-empty JSON `error` from that route, and otherwise
  uses a purchase-forward fallback. Never render raw exceptions. The route alone reads the
  server-only `SEQUENZY_FORM_ENDPOINT` value and returns only intentional safe messages.
- `HeroVideo.tsx` — keeps its control synchronized with the video's real play/pause state. In
  `prefers-reduced-motion: reduce`, both `.hero-film` and `.hero-media-toggle` must be hidden.
- `CheckoutButton.tsx` — thin client wrapper around a plain `<a>`; fires a
  `checkout_cta_clicked` PostHog event (`track()` from `app/analytics.ts`) with `tier`/`price`
  before navigating. Used by the three pricing-tier CTAs (`tiers` array in `app/page.tsx`),
  each linking directly to a real, live Polar checkout URL — these are real purchase buttons,
  not lead capture. See `HANDOFF.md`'s "Polar checkout wired" section for the product IDs and
  the outstanding payout-account caveat before treating checkout as safe for real customers.

Pricing is the primary CTA hierarchy: blue pricing/purchase controls lead to Polar checkout;
dark controls open the secondary Sequenzy email path. Do not change checkout APIs, add routes,
or expose provider configuration during conversion work.

### Current conversion verification

Use `npm ci --include=dev`, `npm run lint`, `npm test`, and `git diff --check`. Then verify the
local page at 375px and 1440px: pricing anchors, CTA hierarchy, all three checkout links and
their transient launch state, safe form errors, the automatic modal's pricing suppression, and
the absent hero control under reduced motion. Do not run a real checkout.

`app/terms/page.tsx` is a second top-level route (alongside `app/privacy/page.tsx`), reusing
the same `.policy-page` CSS pattern. It publishes the Terms & refund policy — delivery
timeline, revision limits, the Review-First Guarantee's refund terms, and liability — and is
linked from the footer and the pricing section's guarantee line.

### Tests (`tests/*.test.mjs`, run with Node's built-in test runner)

- `comparison-state.test.mjs` imports `app/comparison-state.mjs` directly — no build
  needed.
- `rendered-html.test.mjs` imports the **built** worker output
  (`dist/server/index.js`) and calls `worker.fetch(...)` directly with a fake `ASSETS`/
  `ExecutionContext`, then asserts against the rendered HTML string. This is why `npm test`
  always builds first — editing `app/` content requires a rebuild before this test reflects
  the change.

### Generated/ignored directories

`dist/`, `.wrangler/`, `.vinext/`, `outputs/`, `work/` are build artifacts or scratch
output and are gitignored — don't hand-edit them.
