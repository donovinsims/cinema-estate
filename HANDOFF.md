# Cinema Estate Handoff

Last updated: 2026-08-06

## Current state (read this first)

This doc is a chronological log — everything below is historical record, oldest first. Start here instead of at "Active implementation checkpoint," which describes a 2026-08-05 plan that's long since superseded.

- **The site sells three real, live packages**: Proof $149, Story $299 (recommended), Signature $549 — one-time, per-listing, not a subscription. Delivery is committed at 24 hours from receipt of approved photos.
- **Checkout is real.** Each tier's "Buy" button links to a live Polar checkout page (`app/CheckoutButton.tsx`, see "Polar checkout wired" below for the exact product IDs/links).
- **The single most urgent open item: no payout account is connected in Polar.** A customer can complete a real charge today; the business cannot yet receive that money. Connect one in Polar (Finance → Account) before driving real traffic.
- **Guarantee and refund terms are published** at `/terms` (`app/terms/page.tsx`) — the Review-First Guarantee, a 7-day accuracy-based refund window, per-tier revision limits. Not lawyer-reviewed; drafted at the owner's request.
- **Still open, no urgency yet**: real client testimonials/case studies (none exist), sending-domain verification, welcome-email automation, a monitored privacy contact, email-preference handling, and flipping the Polar org from Private visibility to Public once ready to be listed.
- Canonical docs: `docs/PRODUCT.md` (what/why/who), `docs/icp-audience-profile.md` (target buyer research), `docs/pricing-strategy-plain-english.md` (pricing rationale — now describes the live state, see its own status note). This file is the detailed implementation history behind all of it.
- **IN PROGRESS, NOT YET SHIPPED (2026-08-06 session): a conversion-focused UX overhaul is mid-implementation, uncommitted, in the working tree right now.** See "UX overhaul session — 2026-08-06 (in progress)" at the bottom of this file for the full picture, exact file list, and the precise resume point. Do not assume the CTA/copy behavior described in earlier sections above is still current — it is being actively changed by this session.

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

## Pricing launch closeout — 2026-08-06

- Branch: `pricing/launch-real-offer`. Owner approved implementing real pricing, stronger hero framing, and drafting the guarantee/ToS content directly (items 1, 3, 4, 6, 7 above).
- Added a three-tier pricing section (`app/page.tsx`, reusing the previously-reserved `.price-section`/`.price-grid` CSS plus new `.tier-grid`/`.tier-card` rules): Proof $149, Story $299 (recommended), Signature $549.
- Added `app/terms/page.tsx` — Terms & refund policy, covering delivery timeline (24 hours), revisions, the Review-First Guarantee's refund terms, client responsibilities, AI-disclosure, liability, and governing law. Linked from the footer and from the waitlist section's guarantee line.
- Strengthened hero copy per owner approval and added a price line using the reserved `.hero-price` rule.
- CTAs on the new pricing tiers intentionally still route to the existing "listing" early-access capture flow, not a real purchase — marked with `TODO(checkout)` in `app/page.tsx`. Swap these for real Polar checkout links once product IDs/links exist (item 2 above).
- Each change followed the established red/green pattern in `tests/rendered-html.test.mjs`; a new test also locks the `/terms` content.
- Found and fixed a JSX rendering bug while writing tests: `${expr}` (literal `$` immediately followed by a JS expression) renders as `$<!-- -->149` in React's server output, not `$149` — the hydration comment marker between adjacent static/dynamic text nodes. Fixed by combining into a single template-literal expression (`` {`$${tier.price}`} ``); worth remembering for any future `$`-prefixed dynamic value.
- Final `npm ci --include=dev`, `npm run lint`, `npm test`: all clean, 7/7 tests passing. No `package-lock.json` drift this run.

### New reference docs

- `docs/PRODUCT.md` — canonical product overview (what it is, why it exists, who it's for), for onboarding future sessions without re-deriving this from the source.
- `docs/superpowers/plans/2026-08-06-cinema-estate-sales-page-readiness.md` — actionable implementation plan. Scoped to work that does **not** require owner-supplied facts or decisions; see the blocked list below for everything that does.

### Blocked on owner input

Items 1, 2, 3, 4, 6, and 7 were resolved by the owner on 2026-08-06 and implemented below. Items 5 and 8 remain open. Item 2's resolution carries its own caveat (no payout account connected yet) — see "Polar checkout wired" below before treating checkout as safe for real customers.

1. ~~Final pricing and packaging~~ — **resolved.** Three one-time, per-listing tiers: Proof $149, Story $299 (recommended), Signature $549 (luxury/distinctive listings only). Live in the pricing section (`app/page.tsx`). The Polar product created below should have its placeholder $1.00 price updated to match.
2. ~~Polar product and checkout link(s)~~ — **resolved 2026-08-06.** Three real, correctly-priced products now exist in Polar (superseding the earlier $1.00 placeholder — see "Polar checkout wired" below), and all three tier CTAs in `app/page.tsx` link directly to their real checkout URLs via a new `CheckoutButton` component. **Payments cannot yet settle** — no payout account is connected in Polar — see the caveat below before treating this as safe for real customers.
3. ~~Guarantee terms beyond the existing review-before-publish policy~~ — **resolved.** The Review-First Guarantee now includes a 7-day, accuracy-based full-refund window and per-tier revision limits (1 round for Proof/Story, 2 for Signature), documented in full at `/terms` (`app/terms/page.tsx`).
4. ~~Turnaround-time commitment~~ — **resolved.** 24 hours from receipt of approved photos and required listing details (supersedes the 48-hour figure floated in the pre-approval pricing draft below). Stated in the hero, the pricing section, and `/terms`.
5. **Real client testimonials or case studies** — still open; nothing actionable until real client work exists.
6. ~~Terms of Service / refund policy text~~ — **resolved.** Published at `/terms`, covering delivery timeline, revisions, the refund guarantee, client responsibilities (photo rights, MLS/Fair Housing compliance), AI-assisted production disclosure, limitation of liability, and governing law (Illinois — flagged to the owner as a reasonable default tied to the founder's Northern Illinois base, not a confirmed registered-entity state). **Not reviewed by a lawyer** — drafted at the owner's explicit request; recommend legal review before high-volume launch.
7. ~~Confirmation on outcome language~~ — **resolved.** Owner approved stronger, outcome-oriented framing. Hero deck now reads "so buyers don't scroll past your listing" (the exact candidate phrase this document proposed).
8. Carried forward from the prior checkpoint, still open: sending-domain verification, welcome-email automation, a monitored privacy contact, and email-preference handling (see "External operational work outside this plan" above).

## Polar organization and product setup — 2026-08-06

Done entirely through Kimi WebBridge browser automation against the owner's live, logged-in Polar session (no API keys, no code changes in this repo). This directly unblocks part of item 2 above but does **not** wire anything into the site yet — no code in `app/` was touched.

### What was created

- **Organization**: "Cinema Estate", slug `cinema-estate`, dashboard at `https://polar.sh/dashboard/cinema-estate`.
- **Organization profile**: Website set to `https://cinema-estate.vercel.app`; Support Email set to `emaildonovin@gmail.com` (a personal address — no dedicated business domain/work email exists yet, this was an explicit owner instruction, not a guess).
- **Product**: "Cinema Estate", one-time purchase, at `https://polar.sh/dashboard/cinema-estate/products/a4fc8817-ecea-4093-aa83-528495cd36c8`.
  - Price is **$1.00 USD — a placeholder, not the real price**. Polar's product form hard-rejects `$0.00` ("Price must be greater than 0"); there is no draft/blank-price state in the product model. $1.00 was chosen live, with the owner's explicit sign-off, specifically so the product record could exist ahead of real pricing.
  - Visibility is **Private** ("only purchasable via a direct checkout link") — the closest equivalent Polar has to a draft/unpublished state. It is not listed in any customer-facing portal. No checkout link has been generated for it, so it is not reachable by anyone yet.

### What was intentionally not touched

- No real banking, tax ID, or identity documents were entered anywhere — none exist yet, and none were fabricated.
- "Connect a payout account" (Stripe Connect) in Polar's Account Review checklist is still unstarted — needs owner-supplied banking info.
- "Submit for review" was not clicked — Polar's review requires the payout account step first.
- No checkout link was generated (Products → Checkout Links in Polar), so nothing here is purchasable by a customer today.

### What's left before this can go live

1. ~~Owner supplies the real price~~ / ~~generate checkout links~~ / ~~wire into `app/`~~ — **done, see "Polar checkout wired" below.**
2. **Connect a real payout account in Polar (Finance → Account)** — needs owner banking details. **This is the one remaining blocker before real customers can pay** — see the caveat below.
3. Flip product visibility from Private to Public once ready to be listed, and submit the org for Polar's review.
4. Optional cleanup: Polar's Account Review flags the support email as "Business email is preferred" / "domain does not match your organization website" — cosmetic-only until a real business email/domain exists.

## Polar checkout wired — 2026-08-06

- The Polar org's earlier $1.00-placeholder single product (above) was superseded by **three real, correctly-priced, one-time-purchase products**, created via the same Kimi WebBridge browser-automation approach against the owner's live Polar session:

  | Product | Product ID | Checkout link |
  |---|---|---|
  | Cinema Estate — Proof ($149) | `d277e3be-ad51-4aee-b278-2ea73d25c49d` | `https://buy.polar.sh/polar_cl_r6UPLdTbK0UNuL4QCNH0sfQFdgcpi5DXVWLYn1W4pgw` |
  | Cinema Estate — Story ($299) | `e581549a-7ce7-4ab7-8d96-b683512c7ced` | `https://buy.polar.sh/polar_cl_2qd3HGz4AhmpQCLcqKpYXzVFsWmyoM39lwg3s4BXGZi` |
  | Cinema Estate — Signature ($549) | `2c13ef9f-09b1-49da-b61b-c8ca78a52c66` | `https://buy.polar.sh/polar_cl_5JvCDNNcFwSW9ZwYaAORoOxJqHucSEY7IuziO0bL3h7` |

- All three remain **Private** visibility (reachable only via the direct checkout link above, not listed in any public Polar storefront) — consistent with the earlier placeholder's visibility, not a change in exposure.
- Each product's Success URL is `?checkout=success` and Return URL is `?checkout=cancelled` on `https://cinema-estate.vercel.app`. Note from the session that set these: Polar's "Return URL" is what fires on the checkout back-button, not a true post-cancel webhook-driven redirect — the closest available match, not an exact one.
- Site-side: added `app/CheckoutButton.tsx` (a thin client wrapper around a plain `<a>`, firing a `checkout_cta_clicked` PostHog event with `tier`/`price` before navigating — mirrors `EarlyAccessButton`'s tracking pattern). The three pricing-tier CTAs in `app/page.tsx` now use it instead of the early-access modal, linking directly to the checkout URLs above. Button copy changed from "Start with {tier}" to "Buy {tier}" to match — these are now real purchase buttons, not lead capture.
- Hit the same `${expr}` hydration-comment-marker bug as the earlier tier-price fix (see "Pricing launch closeout" above), this time in the button label (`Buy {tier.name} <span>...`) — same fix, combined into one template-literal expression.
- **Caveat carried forward, not resolved:** no payout account is connected in Polar. The session that wired these links reports checkout works end-to-end except settlement — meaning a customer could complete a real charge that the business cannot yet receive. Do not treat this as safe for real customer traffic until a payout account is connected in Polar (Finance → Account).

## Pricing strategy and ICP research drafted — 2026-08-06 (superseded by the pricing launch above)

- `docs/pricing-strategy-plain-english.md` and `docs/icp-audience-profile.md` landed via PR #3, drafting the same three tiers (Proof $149 / Story $299 / Signature $549) later approved and implemented in "Pricing launch closeout" above. **This section is a historical record of the draft, not the current state** — the owner has since given the go-ahead and the tiers are live.
- One number changed on implementation: the draft floated a 48-hour turnaround; the owner approved 24 hours instead, and 24 hours is what's live in the hero, pricing section, and `/terms`.
- The photo-rights gap this draft flagged (MLS permission doesn't grant photo-reuse rights) is addressed in `/terms`' "Your responsibilities" section as a confirmation the customer agrees to by paying — not yet a separate checkout-flow checkbox, which would need real checkout to exist first.
- Still true: no rights-confirmation checkbox exists in the (nonexistent) checkout flow itself yet — revisit once Polar checkout is wired (item 2 above).

## UX overhaul session — 2026-08-06 (in progress)

### What this session was asked to do

The owner ran `/ux-review` with the goal "maximize conversions and get users to buy with zero friction and ultimate clarity." Per that skill, a 10-expert panel (Dieter Rams, Jony Ive, Don Norman, Jakob Nielsen, Luke Wroblewski, Steve Krug, Irene Au, Jesse James Garrett, Erika Hall, Yael Levey) independently reviewed the full landing page source in Plan Mode. All 10 completed. The panel converged — unanimously on the #1 finding — on one root cause: **the page's CTA structure and copy still reflected its pre-revenue, waitlist-only era, even though real $149/$299/$549 pricing and working Polar checkout links already existed.** Every high-visibility CTA (header, hero, About, final section) routed to an email-capture modal instead of the purchase flow, and the modal's own copy told buyers pricing "isn't ready" while it was live two sections away.

The synthesized report had 5 High, 8 Medium, and 9 Low impact findings (22 total). The owner reviewed the report and chose **"Everything (High + Medium + Low)"** — all 22 findings approved for implementation. A full implementation plan was written and approved via `ExitPlanMode`; the plan file (9 implementation groups, verification checklist) is saved locally at `/Users/forex/.claude/plans/the-goal-is-to-velvety-feather.md` (outside this repo — not guaranteed to survive on another machine, hence this summary being self-contained here).

### What's been implemented (in the working tree, uncommitted)

All 22 findings have been coded. `git status --short` currently shows:
```
 M app/CheckoutButton.tsx
 M app/ComparisonExperience.tsx
 M app/EarlyAccessModal.tsx
 M app/WaitlistForm.tsx
 M app/early-access-copy.mjs
 M app/globals.css
 M app/page.tsx
 M tests/rendered-html.test.mjs
?? app/HeroVideo.tsx
```

Key changes by finding, most important first:

1. **CTA routing (the root-cause fix).** Header and hero primary CTAs no longer open the email modal — they're now plain anchors to `#pricing` (`See pricing` / `Pricing`), reusing existing `.button-primary`/`.header-link` classes. The pricing `<section>` got `id="pricing"` (`app/page.tsx`). The About and final-section CTAs still open the email modal (via `EarlyAccessButton`), which is now the correct, secondary use of that flow.
2. **Button-style reassignment.** `.button-primary` (blue) is now reserved for the real purchase path (hero/header pricing anchors, tier `CheckoutButton`s). The About CTA moved from `.button-primary` to `.button-dark` to visually distinguish "email" from "buy."
3. **Copy no longer contradicts live pricing.** `app/early-access-copy.mjs`'s `"early-access"` success string no longer says "as pricing and onboarding are ready" (rewritten to point back at pricing).
4. **Auto-popup no longer ambushes near-buyers.** `EarlyAccessModal.tsx` now has an `IntersectionObserver` on `#pricing`; once seen, the 35s/45%-scroll auto-open is suppressed.
5. **Section eyebrow numbering fixed** to match actual DOM order (was 01,02,03,04,**07**,**05**,**06**; now sequential 01–08, `app/page.tsx`).
6. **Accessibility/contrast:** pricing-section text color changed `#102663` → `#06133c` (was 3.81:1 against the blue background, now 4.84:1, passes WCAG AA). Touch targets bumped to ≥44px: `.modal-close`, `.comparison-handle span`, `.comparison-toggle button`, `.analytics-consent button`, `.modal-decline`/`.text-control` padding. Modal focus-on-open now targets the email `<input>` specifically instead of whatever's first in DOM order (was the ✕ close button). New `app/HeroVideo.tsx` client component adds a pause/play toggle for the autoplaying hero background video (WCAG 2.2.2).
7. **WaitlistForm robustness:** added client-side email-format validation (previously only checked non-empty); error message now points back to the pricing section as a fallback instead of a dead-end retry.
8. **Design-system consolidation in `globals.css`:** `.tier-card h3` now has an explicit `font-weight: 550` (was silently falling back to browser-bold 700); collapsed near-duplicate font sizes (`.88/.91/.95rem` → `.92rem`; `.58/.59/.62rem` micro-labels → the shared `.69rem`); normalized section vertical padding (`.comparison-section` 112/108px → 130px to match the standard rhythm; `.price-section` 90px → 100px to match `.waitlist-section`). Removed two stale CSS comments referencing a nonexistent `TODO(pricing)`. Removed the now-unused `.hero-alt` CSS rule.
9. **Remaining polish:** guarantee/refund text now also appears next to the pricing tier grid, not only in the final section three sections later. Hero's `hero-deck` and `hero-alt` paragraphs merged into one (removed the redundant "Not another photo shoot..." sentence — the "already-approved photos" idea survives in the merged sentence). Removed the redundant "Delivered in 24 hours" bullet from all three tier feature lists (still stated once in the pricing intro and hero). Standardized arrow glyphs: `→` for same-site/in-page actions (header, hero, About, final CTA, "Watch the transformation"), `↗` reserved for genuine external navigation (Buy buttons → Polar checkout, footer MLS link). `CheckoutButton` now shows a brief "Opening checkout…" state on click. Modal's "Maybe later" button becomes "Close" after a successful submission. `ComparisonExperience`'s drag-prompt now hides only after real user interaction (pointer/keyboard), not the automatic scroll-triggered reveal.

### ⚠️ Operational risk hit mid-session — read before continuing

Partway through implementation, every edit made via the Edit tool to `page.tsx`, `ComparisonExperience.tsx`, `EarlyAccessModal.tsx`, `WaitlistForm.tsx`, `CheckoutButton.tsx`, `early-access-copy.mjs`, and even a completed `globals.css` edit **silently reverted to the original git-HEAD content** — twice — for reasons that were not identified (not a git hook, not an obvious file watcher/formatter, not iCloud/Dropbox sync; a raw `echo >>` via Bash persisted fine when tested, so it was not a full-disk issue). All edits were redone as full-file `Write` calls (rather than incremental `Edit` calls) and immediately verified with `git diff --stat` after each one; all 8 files above are now confirmed present in the working tree as of this writing. **If you pick this up in a new session: run `git status --short` first and compare against the file list above before trusting anything in this repo matches what's described here.** If files have reverted again, the fix is straightforward — every change is re-described in detail above and in the plan file — but it needs to be reapplied and re-verified the same way (`Write` full file, then `git diff --stat` immediately).

### What's left to do (exact resume point)

1. **Finish updating `tests/rendered-html.test.mjs`.** Only the `expectedAboutCta` constant has been fixed so far (now `"Start with your listing <span aria-hidden=\"true\">→</span>"`). Still need to fix, in the same file:
   - The assertion `assert.match(html, /Not another photo shoot\. Not another crew to book\. A third option, built entirely from the listing photos you’ve already approved\./i);` — this exact sentence no longer renders (merged into `hero-deck`). Replace with an assertion against the new merged sentence, e.g. matching `built from photos you.{1,2}ve already approved` within `hero-deck`.
   - The assertion `assert.match(html, /You’re on the early-access list\. I’ll personally follow up as pricing and onboarding are ready\./i);` — this string was intentionally changed in `app/early-access-copy.mjs`. Update to match the new success copy.
2. **Update `tests/early-access-copy.test.mjs`** — its `"early-access"` presentation test still asserts the old `success` string (`"...as pricing and onboarding are ready."`). Update to the new string in `app/early-access-copy.mjs`.
3. **Not yet run:** `npm run lint` and `npm test` (which runs `npm run build` then the Node test suite). Must both pass clean before this is considered done, per this repo's standing gate. Remember this environment needs `npm ci --include=dev` if `NODE_ENV=production` is set (see "Sales-page readiness copy pass closeout" above) or the build breaks on missing devDependencies.
4. **Not yet visually verified.** No dev-server/browser pass has been done yet — need to check: the hero pause/play toggle doesn't visually collide with anything at 360/768/1024px, the mobile header "Pricing" link (now visible again, previously `display: none`) doesn't crowd the wordmark at 360px, the pricing-section contrast fix reads correctly, and the auto-popup genuinely stops firing once `#pricing` has been scrolled into view.
5. **Nothing committed or pushed.** All of the above is uncommitted working-tree state only.

Once 1–4 are done and green, this becomes a normal `/commit-push-pr`-shaped unit of work (single feature: "conversion-focused UX fixes from the 10-expert panel review").
