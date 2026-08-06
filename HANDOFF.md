# Cinema Estate Handoff

Last updated: 2026-08-06

## Active implementation checkpoint

- Active plan: `docs/superpowers/plans/2026-08-05-cinema-estate-cro-closeout.md`.
- Goal: close the two remaining CRO copy regression gaps without changing the approved public copy, design, API, pricing, or deployment architecture.
- Preflight: complete. The eight required marketing skills and the copy-editing checklist were re-read before implementation.
- Task 1 — exact About section contract: **complete**.
- Task 2 — source-aware modal/form copy contract: **complete**.
- Task 3 — final gates, commit/push, Vercel and live verification: **complete**.
- Resume point if interrupted: none for this plan. The CRO copy-contract closeout is complete; begin a new focused task for any external operational work listed below.

### Task 1 evidence

- `tests/rendered-html.test.mjs` now checks the exact case-sensitive About heading, all five approved paragraphs in order, and the exact `Send me a listing →` CTA markup.
- Red proof: changing expected `photos` to `photographs` caused the rendered-HTML test to fail with the intended About copy mismatch.
- Green proof: after restoring `photos`, `npm test` passed with 4 tests and 0 failures, including the Vinext build.
- `git diff -- app/page.tsx` produced no output; the approved public copy was not changed.

### Task 2 evidence

- Added `app/early-access-copy.mjs` as the immutable internal source of truth for the evergreen early-access and listing-handoff presentation variants.
- `app/EarlyAccessModal.tsx` and `app/WaitlistForm.tsx` now consume that shared presentation object; analytics intent, form validation, honeypot, fetch target, payload, and error handling remain unchanged.
- Added `tests/early-access-copy.test.mjs` with exact object contracts for both variants.
- Red proof: the focused Node test failed with `ERR_MODULE_NOT_FOUND` before the presentation module existed.
- Green proof: `node --test tests/early-access-copy.test.mjs` passed 2 tests with 0 failures after implementation.
- `git diff -- app/api/early-access/route.ts` produced no output; the server API and Sequenzy integration were not changed.

### Task 3 evidence

- Code-gate green: final `npm ci`, lint, `npm test` (6 tests, 0 failures, including Vinext), native `npx next build`, and the scoped diff check all passed.
- Git: application/test closeout commit `f00a95f` (`test: lock Cinema Estate CRO copy contracts`) was pushed to `origin/main`.
- Production Ready: Vercel deployment `dpl_94P6PRhjLPScVm2xW9u1Eu3kZxt9` at `https://cinema-estate-nrfkfmszw-teamdonovin.vercel.app` reached `Ready` and received the canonical `https://cinema-estate.vercel.app` alias.
- Live 375px: Quality → About → FAQ order passed; the 343px portrait stacks before the 343px copy column; the exact heading, five paragraphs, and CTA render; the About CTA opens the listing-handoff variant.
- Live 1440px: Quality → About → FAQ order passed; the portrait and copy are top-aligned in a two-column layout (approximately 383px and 680px); the desktop header CTA is visible and opens the evergreen early-access variant.
- CTA behavior: About, hero, final, and header sources reported the correct listing or early-access intent and exact title/description/submit/success copy.
- Keyboard behavior: focus enters the dialog, Shift+Tab and Tab wrap between the last and first controls, Escape closes the dialog, and focus returns to the triggering About CTA.
- Reduced motion: the hero film and interactive desktop/mobile comparison are hidden; the two-figure reduced-motion comparison renders instead.
- Assets and runtime: both `donovin-sims-320.webp` and `donovin-sims-640.webp` returned HTTP 200 as `image/webp`; no framework error overlay or browser console errors were detected.

## Current repository and deployment state

- Checkout: `/Users/forex/cinema-estate`.
- Active branch: `main`.
- Local `main` was fast-forwarded to `origin/main` at `042b97d` before this plan began, then the closeout was committed and pushed as `f00a95f`.
- The two remote commits found during preflight only changed `package-lock.json` to install/update Vercel Web Analytics dependencies.
- Production alias: `https://cinema-estate.vercel.app`.
- Production deployment for the application closeout: `dpl_94P6PRhjLPScVm2xW9u1Eu3kZxt9` (`https://cinema-estate-nrfkfmszw-teamdonovin.vercel.app`), status `Ready`.
- Current Vercel CLI: `58.1.0`; upgrading is deferred maintenance and is not part of this plan.

## Verification for this plan

- Final `npm ci`: passed on 2026-08-05 after syncing `origin/main`.
- Final `npm run lint`: passed with no errors.
- Final `npm test`: passed with 6 tests and 0 failures; this includes a successful Vinext production build.
- Final `npx next build`: passed, including TypeScript and static generation for `/` and `/privacy` plus the dynamic `/api/early-access` route.
- The scoped `git diff --check` passed for all implementation, test, plan, and handoff files.
- The seven authorized implementation/test/documentation files were committed in `f00a95f`. `.agents/`, `conductor/`, `opencode.json`, and `skills-lock.json` remain untracked and were not committed.
- `npm ci` reported 18 dependency audit findings (1 low, 4 moderate, 13 high). No automatic audit fix was run because dependency remediation is outside this focused copy-contract plan.
- The active closeout plan has no remaining implementation or verification steps.

## Implemented public experience

- The approved About section renders between Quality and FAQ with Donovin’s portrait, Northern Illinois origin, the owner-confirmed 15–20 agent conversations, and the 255 Eldon demo disclosure.
- AI is stated plainly as production assistance; the copy says it does not invent or alter the property.
- The page states that approved listing photos remain the source and that the workflow requires no reshoot, crew, or property-access scheduling.
- Public pricing, stale launch timing, unverified unsubscribe language, and the unmonitored privacy mailbox have been removed.
- The About CTA opens a listing-handoff variant; other CTAs open evergreen early-access language.
- `/api/early-access` remains email-only with server-side email/honeypot validation and the existing Sequenzy forwarding integration.
- Vercel Analytics and Speed Insights render sitewide; PostHog remains consent-gated.

## Active plan files and boundaries

- Planned implementation files: `app/early-access-copy.mjs`, `app/EarlyAccessModal.tsx`, `app/WaitlistForm.tsx`, `tests/early-access-copy.test.mjs`, and `tests/rendered-html.test.mjs`.
- Documentation files authorized for this work: this `HANDOFF.md` and the active plan.
- Verify but do not change: `app/page.tsx`, `app/EarlyAccessButton.tsx`, and `app/api/early-access/route.ts`.
- Do not stage installer/user artifacts: `.agents/`, `conductor/`, `opencode.json`, or `skills-lock.json`.

## Sales-page readiness copy pass closeout — 2026-08-06

- Active plan: `docs/superpowers/plans/2026-08-06-cinema-estate-sales-page-readiness.md`.
- Tasks 1-6 landed: hero third-option line, FAQ questions rewritten into explicit objection language, how-it-works steps added to the Quality section, the existing review-before-publish policy named as "The Review-First Guarantee," the early-access success message given a concrete next step, and benefit bridges added to the four package deliverables. The orphaned `.hero-price` / `.price-section` / `.price-grid` CSS was annotated as reserved, not dead code.
- Each task followed the plan's red/green pattern: a failing assertion added to `tests/rendered-html.test.mjs` (or `tests/early-access-copy.test.mjs` for the success-message task), confirmed failing, then the copy change implemented and confirmed passing before commit.
- Final `npm run lint`: clean. Final `npm test`: 6 tests, 0 failures, including the Vinext production build.
- Confirmed nothing in the "Blocked on owner input" list above was touched: no pricing, no checkout, no turnaround-time claim, no guarantee terms beyond the existing review-before-publish policy, no testimonials, no scarcity/urgency language.
- Environment note: this checkout's shell has `NODE_ENV=production` set, which makes `npm ci` silently omit `devDependencies` (including `vinext`, `vite`, `wrangler`, `typescript`, `eslint`) and breaks the build. Use `npm ci --include=dev` (or equivalent) in this environment. `package-lock.json` churn from a plain `npm install` in that environment was reverted before committing — it only stripped `"dev": true` flags on optional platform packages, not a real dependency change.

## External operational work outside this plan

- Sequenzy company: `v26iblogat0kdfyw581h1hb1`.
- Saved form: `Cinema Estate — Early Access Waitlist`, ID `jmab7vbumu415ko0sfkig969`.
- `SEQUENZY_FORM_ENDPOINT` is stored as a sensitive Vercel environment variable; never expose it as `NEXT_PUBLIC_*` or copy it into documentation.
- Sending-domain verification, welcome-email automation, a monitored privacy contact, email-preference handling, and one controlled real signup remain separate operational work and must be verified before being claimed publicly.
- `ce.sequenzy.com` is only the Sequenzy sending domain; the website stays on `https://cinema-estate.vercel.app`.

## Repository hygiene

- Canonical application files are under `app/`, `public/media/`, and `tests/`.
- Duplicate local files named `* 2.*` are intentionally ignored; do not add them to commits.
- Remote `sites` remains the original ChatGPT Sites remote. GitHub `origin` is `https://github.com/donovinsims/cinema-estate.git`.
- Stage files explicitly. Do not use `git add .` for this plan.

## Sales-page readiness review — 2026-08-06

The site is currently a waitlist page. The owner's goal is a live sales page an individual agent can land on, trust, and pay from, unassisted. A full review was run against eight marketing-strategy skills (`cro`, `copywriting`, `copy-editing`, `pricing`, `marketing-psychology`, `product-marketing`, `hundred-million-offers`, `storybrand-messaging`, `cro-methodology`, `obviously-awesome`, `made-to-stick`, `influence-psychology`, `monetizing-innovation`) plus the live site and full source. Full findings live in the session transcript; this is the durable summary.

### The core gap

There is no purchase mechanism anywhere in the codebase or on the live site. Every CTA (`app/page.tsx:39,115,133`, `app/EarlyAccessButton.tsx`, `app/EarlyAccessModal.tsx`) dispatches to an email-only modal that posts to Sequenzy (`app/api/early-access/route.ts`). No Polar integration, no checkout route, no price object exists. **This is architectural, not a copy problem** — no amount of headline or trust-signal polish converts a sale while there is nothing to click that takes money.

### Framework scores (current state)

| Framework | Score | Weakest point |
|---|---|---|
| Value Equation (Hormozi) | Effort/Sacrifice strong (8/10, "no reshoot, no crew, no property-access schedule" is genuinely well done); Dream Outcome 4/10 (states process, not outcome); **Perceived Likelihood weakest at 2/10** (zero proof — the on-site demo is explicitly disclosed as non-client work); Time Delay 2/10 (no turnaround claim anywhere) | Perceived Likelihood — the one lever a strong guarantee can raise without needing real client proof yet |
| Grand Slam Offer diagnostic (7-row) | ~2-3/10 | Only "starving crowd" (individual agents, acute pain, targetable) clearly passes; no guarantee named, no bonuses, no pricing/packaging |
| StoryBrand SB7 | ~4-5/10 | Character/external-problem present; internal problem, explicit process plan, and failure/success stakes are all missing or implicit only |
| Made to Stick SUCCESs | ~29/60 ("forgettable" band) | Unexpected (3/10) and Credible (4/10) are lowest; Simple (7/10) is the strength |
| CRO / cro-methodology | ~5-6/10 | Proof at friction points is the biggest gap; single clear action and FAQ objection-handling are partial passes |
| Positioning (Obviously Awesome) | "Third option" framing (`app/page.tsx:112`) is explicit and defensible — it names both real alternatives (static photos, hiring a videographer/crew) — but it appears once, in the About section (page position 5 of 9), and is never echoed in the hero |

### Highest-leverage change

Ship a real offer and point every CTA at it: finalize pricing → wire Polar checkout → swap CTA copy from "Get early access" to a purchase action. Everything else in this review (proof, guarantee, positioning placement, headline) makes a good sales page better; only this makes it a sales page at all.

### What's already working and should survive any rebuild

- The before/after comparison slider (`app/ComparisonExperience.tsx`) — the most persuasive asset on the page; concrete and credible without needing a testimonial.
- The four real production clips in the proof grid (`app/page.tsx:45-59`).
- The MLS-policy outbound link in the footer (`app/page.tsx:140`) — real, verifiable authority.
- The founder story and "third option" framing in About (`app/page.tsx:105-118`) — good material, currently under-placed.
- The review-before-publish policy (`app/page.tsx:79-84`) — real risk reversal already exists in substance, just isn't named as a guarantee yet.
- The honest disclosure that the 255 Eldon package is a demo, not client work (`app/page.tsx:113`) — protects trust; do not let sales pressure erode this before real client proof exists.
- The `early-access-copy.mjs` / `EarlyAccessButton` intent-dispatch architecture — built so the CTA target can be swapped to a real purchase action later without a rewrite.

### New reference docs

- `docs/PRODUCT.md` — canonical product overview (what it is, why it exists, who it's for), for onboarding future sessions without re-deriving this from the source.
- `docs/superpowers/plans/2026-08-06-cinema-estate-sales-page-readiness.md` — actionable implementation plan. Scoped to work that does **not** require owner-supplied facts or decisions; see the blocked list below for everything that does.

### Blocked on owner input

Nothing in this list can be implemented correctly without the owner supplying the fact or decision — do not guess or draft final copy for these:

1. **Final pricing and packaging** — single price vs. tiers, what's included at each tier. Blocks checkout, any on-page price display, and the final CTA-copy swap from "Get early access" to a purchase verb.
2. **Polar product and checkout link(s)**, plus success/cancel redirect targets — blocks wiring the checkout itself.
3. **Guarantee terms beyond the existing review-before-publish policy** — e.g., refund conditions, revision limits, how long the guarantee window is. (The plan does include naming and elevating the *existing* review-before-publish policy as a guarantee, since that requires no new commitment — this item is for anything stronger.)
4. **Turnaround-time commitment** — how many days per listing. Needed to close the Value Equation's Time Delay gap and to make a "how it works" timeline concrete.
5. **Real client testimonials or case studies**, once real client work exists — nothing actionable here until then; do not fabricate or imply proof that doesn't exist.
6. **Terms of Service / refund policy text** the owner is comfortable publishing — required before Polar checkout can credibly go live, and before item 3's guarantee is legally meaningful.
7. **Confirmation on outcome language** for the hero/headline beyond what's already approved (e.g., is he comfortable with output-outcome framing like "so buyers don't scroll past your listing," or does he want to hold the line on process-only language until there's data to back an outcome claim).
8. Carried forward from the prior checkpoint, still open: sending-domain verification, welcome-email automation, a monitored privacy contact, and email-preference handling (see "External operational work outside this plan" above).
