# Cinema Estate Handoff

Last updated: 2026-08-07

## Current state (read this first)

UX closeout branch: `codex/ux-conversion-closeout`, based on `origin/ux-review/conversion-fixes-wip` (`a1979e063d81ba2722a7983ded7cf21a6034416d`). It was merged by [PR #10](https://github.com/donovinsims/cinema-estate/pull/10) into `main` as `0da04c36d22ecf77ee3536d2e7cef9dfbad14cee` on 2026-08-06. Key commits include `88db72e` (copy contracts), `57edea6` (safe form and motion safeguards), and `844e921` (non-blocking payout follow-up).

- **Code gate:** verified locally on 2026-08-06: `npm run lint`, `npm test` (7/7), and `git diff --check` passed.
- **Local browser evidence:** at 375px and 1440px, header and hero pricing anchors reached `#pricing`; all three intended Polar links were present; blue purchase/pricing and dark email-capture CTA roles were distinct; pricing copy was readable; invalid email was stopped client-side; unavailable local email capture showed the safe server message; the 45%-scroll plus 35-second modal opened before pricing and remained suppressed after pricing; and the hero control was absent with reduced motion.
- **Checkout:** existing Polar links were navigation-tested only; no purchase was created.
- **Owner-only operational follow-up:** Polar Finance payouts are not yet confirmed connected/verified. The owner alone enters any bank/tax details; no agent handles payout credentials. This is not a merge, deployment, or release blocker.
- **Production deployment:** Vercel deployment `dpl_EqVSxHvSJKg9xoEDaNADivV5SoQC` is Ready at [cinema-estate-rhhfytwjx-teamdonovin.vercel.app](https://cinema-estate-rhhfytwjx-teamdonovin.vercel.app), with the canonical [cinema-estate.vercel.app](https://cinema-estate.vercel.app) alias attached.
- **Live verification (2026-08-06):** the canonical site returned HTTP 200. At 1440px, the header and hero pricing links reached `#pricing` and all three intended Polar links rendered. At 375px, pricing was single-column and reduced motion hid the hero video control. After viewing pricing, the 35-second automatic-modal rule remained suppressed. No email was submitted and no checkout was opened.
- **Sales-page-upgrade — MERGED (2026-08-07):** PR **[#13](https://github.com/donovinsims/cinema-estate/pull/13)** was merged by the owner into `main` as `fef7b24a6c4b14020a93e5c131a925635af941d5` on 2026-08-07. Post-merge live verification on `cinema-estate.vercel.app`: `/robots.txt` (user-agent `*`, Disallow `/api/`, sitemap ref), `/sitemap.xml` (3 routes: `/`, `/terms`, `/privacy`), homepage `<link rel="canonical">`, and Organization + FAQPage JSON-LD all serving correctly. See the workflow section below for the full record.
- **Post-merge fixes — MERGED (2026-08-07):** an independent review of PR #13 (performed by a fresh session with no access to the implementation session's context) found 7 issues: 1 MAJOR (the early-access modal's "See pricing" escape hatch fought its own `#pricing` navigation via an unconditional focus-restore `setTimeout`) and 6 MINOR/NIT (this HANDOFF.md's own stale "not merged" language; a `HeroVideo` reduced-motion race against async autoplay; `CheckoutStatus` over-stripping the return-URL query string; a `ComparisonExperience` Safari<14 `MediaQueryList` compat gap; a root-canonical trailing-slash mismatch against what's actually live in production; and a missing once-guard on `checkout_cta_clicked`). All 7 fixed in PR **[#14](https://github.com/donovinsims/cinema-estate/pull/14)**, merged into `main` as `efeea1a02fc19040172e6b6033fa8ec5753ddec0` on 2026-08-07. `npm run lint`, `npm test` (12/12), and `git diff --check` all passed; live-verified afterward that the modal no longer restores focus to the trigger element and that the root canonical now matches production. The branch `codex/sales-page-upgrade-2026-08-06` was deleted post-merge.

## Sales-page-upgrade workflow — 2026-08-06/07 (complete, merged)

Ran `/sales-page-upgrade full` per `.claude/skills/sales-page-upgrade/SKILL.md`. Branch: `codex/sales-page-upgrade-2026-08-06` (created off `main` at `7d86d40`). **All phases are done.** The six delegated tasks were implemented directly on the branch (the worktree-parallel plan was adapted after repeated sandbox aborts made parallel agents impractical) and committed in one commit `d776e4f` (15 files, +366/−17). PR [#13](https://github.com/donovinsims/cinema-estate/pull/13) was merged by the owner as `fef7b24` on 2026-08-07; the branch is deleted and the deployment is live-verified. Nothing remains.

### Phase 0 preflight — complete

All 15 required skills (`product-marketing`, `cro`, `hundred-million-offers`, `influence-psychology`, `storybrand-messaging`, `ux-heuristics`, `refactoring-ui`, `make-interfaces-feel-better`, `web-design-guidelines`, `seo-audit`, `analytics`, `ai-seo`, `copywriting`, `copy-editing`, `impeccable`) found and valid — no first-principles fallback needed.

### Phase 1 audits — complete (read-only, not persisted anywhere else — summarized here)

Three parallel agents (`cinema-estate-strategy-auditor`, `cinema-estate-ux-auditor`, `cinema-estate-growth-auditor`) ran against current `main`. Full findings only exist in that session's transcript; the load-bearing points that drove Phase 2/3 are captured in the synthesis below. Notable audit output not yet acted on (deferred, see below): mobile hero-wrap risk needing Phase 5 visual confirmation, `/pricing.md`/`/llms.txt` AI-extractability files, further FAQ expansion, About-before-Pricing section reorder.

### Phase 2 synthesis — complete

**Conflicts resolved:** (1) trust-before-ask — Strategy's lighter above-fold guarantee/identity line won over UX's full About-before-Pricing reorder (lower blast radius); (2) CheckoutButton stuck-loading-state fix (UX) and `checkout_completed`/`checkout_returned` events (Growth) merged into one bounded task instead of two agents touching the same file; (3) modal escape-hatch UI (UX, delegated) vs. spatially-wrong success copy (UX, in `early-access-copy.mjs`) — split so one agent doesn't own two files for one logical fix; (4) dead reduced-motion "Watch the transformation" control flagged by both UX §8 and §11 — deduped to one fix; (5) structured-data price drift — resolved via a new test-locked shared data module instead of a live cross-file import from `page.tsx` (avoids breaking single-owner file rules).

**Rejected/deferred, with reasons:** full About-before-Pricing section reorder (too high blast-radius for this pass — re-numbers all 8 section eyebrows again, already churned once in the last UX pass); merging Comparison+Proof sections (inferred redundancy only, no concrete defect); the "agent identity/license verification" and "independent second-pass QA" differentiators from `docs/pricing-strategy-plain-english.md` (**rejected outright** — unsupported by `PRODUCT.md`/guardrails, not confirmed built, flagged as a doc conflict, must never be surfaced in copy); fake scarcity/bonus-stacks/crew-superiority/outcome-guarantee/free-preview language (rejected outright per guardrails); `/pricing.md`, `/llms.txt`, further FAQ expansion beyond one new objection, mobile pull-quote/footer-grouping polish (deferred as secondary/cosmetic).

### Phase 3 implementation — lead-owned portion complete, delegated portion NOT YET STARTED

**Lead-owned files — DONE, uncommitted, verified only by re-reading the diffs (not yet built/tested):**

- `app/page.tsx`: hero eyebrow now reads "A self-produced demo package · 255 Eldon Ave, Columbus" (was "A real completed package…" — demo-disclosure guardrail fix); added a new `.hero-positioning` line ("The third option between flat photos and booking a film crew—so every listing makes you look like the best-marketed agent in the room."); `.hero-price` line now ends "…backed by the Review-First Guarantee."; `<header>` moved out of `<section className="hero">` to be a sibling before it (fixes keyboard tab-order — header links now focus before the hero video's play/pause toggle) and now wraps its links in a new `.site-header-inner section-shell` div; added a 4th FAQ item ("What if I can get this for $10–$40 with a cheaper AI tool?") answered only with guardrail-safe differentiators (real approved photos, review-first, refund guarantee — **not** the unsupported identity-verification/second-pass-QA claims from the pricing doc); Proof/Story tier `note` copy made more job-forward; closing waitlist section reworded ("Ready to buy? Pricing is above. Not ready yet? Leave your email…") with a new `.waitlist-actions` wrapper containing both a `#pricing` anchor button and the existing `EarlyAccessButton`; added `import { CheckoutStatus } from "./CheckoutStatus"` and `<CheckoutStatus />` at the bottom of `<main>` — **this import will break the build until the delegated CheckoutButton/CheckoutStatus task (below) creates that file.**
- `app/globals.css`: `.site-header` is now `position: fixed` (full-width, translucent blurred bar) with new `.site-header-inner` handling the centered flex layout; `.hero-content` min-height simplified from `calc(100% - 56px)` to `100%` (header no longer consumes in-flow space); new `.hero-positioning` and `.waitlist-actions` rules; `.tier-grid`/`.tier-card` converted to CSS Grid **subgrid** (`grid-template-rows: repeat(5, auto)` / `grid-row: span 5; grid-template-rows: subgrid`) so tier-card rows — and therefore the three "Buy" buttons — align across cards regardless of note/list text length (removes the old `.tier-note { min-height: 40px }` magic-number hack); recommended-tier now gets a stronger `box-shadow` + `translateY(-6px)` lift, not just a 2px outline; added a consolidated `:focus-visible` rule covering `.button`, `.header-link`, `.wordmark`, `.text-control`, `.modal-close`, `.modal-decline`, `.comparison-toggle button`, footer links, FAQ `summary`, consent-banner buttons; added `.button:active { transform: scale(.96) }`, global `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent` on links/buttons, `text-wrap: balance` on headings and `text-wrap: pretty` on body text, `-webkit-font-smoothing: antialiased` on body, `overscroll-behavior: contain` on the modal; normalized a few off-scale spacing values (proof-card padding/gap, deliverables padding, tier-card padding) to the 4/8/16/24/32 scale.
- `app/early-access-copy.mjs`: fixed the spatially-wrong `"early-access"` success string — "…or see pricing and buy now below." → "…or see pricing and buy anytime." (it was being shown from a trigger source, `final-cta`, that renders *after* pricing in DOM order, so "below" was sometimes false).
- `tests/rendered-html.test.mjs`: updated/added assertions for every copy change above, plus a new structural assertion that `class="site-header"` appears before `class="hero-media-toggle"` before `id="top"` in the rendered HTML (locks the tab-order fix).

**Not yet done — the six delegated bounded tasks (full specs, ready to dispatch with `isolation: "worktree"` agents exactly as planned, none started yet):**

1. **SEO routes** — new `app/robots.ts`, new `app/sitemap.ts` (Next App Router conventions; domain `https://cinema-estate.vercel.app`; sitemap lists `/`, `/terms`, `/privacy`; robots disallows `/api/`), new `tests/seo-routes.test.mjs` following the existing built-worker-fetch test pattern.
2. **Metadata + structured data + policy pages** — `app/layout.tsx` (add `alternates.canonical`, import/render a new `StructuredData` component), `app/terms/page.tsx` + `app/privacy/page.tsx` (unique `metadata.description` each; fix the dangling "contact path on this site" claim in `/terms` by removing the false claim, **not** inventing a new contact method — a monitored contact is still owner-blocked per the "External operational work" section below; update `/privacy`'s stale July 20 date/"early access"-only framing and add a factual Polar-as-payment-processor disclosure), new `app/product-data.mjs` (tier price/name data for JSON-LD only, manually kept in sync — not imported by `page.tsx`), new `app/StructuredData.tsx` (Organization + Product/Offer ×3 + FAQPage JSON-LD — **no** `Review`/`AggregateRating`, no fabricated ratings), new `tests/structured-data.test.mjs` that cross-checks JSON-LD prices against the rendered HTML's actual tier prices (anti-drift guard). Note: this agent's isolated worktree will only have the original 3 FAQ items — the lead will manually add the 4th FAQ item to the JSON-LD `FAQPage` list during integration.
3. **ComparisonExperience** — owns `app/ComparisonExperience.tsx` only. Fix: the "Watch the transformation" button (`revealFully`) is a dead control under `prefers-reduced-motion: reduce` (it only manipulates `.comparison-desktop`, which is `display:none` in that media state) — mirror the file's existing `matchMedia` check pattern to hide/disable it under reduced motion. Also add a `comparison_slider_interacted` analytics event (`method: "drag"|"keyboard"|"button"`), firing once on first real interaction.
4. **HeroVideo** — owns `app/HeroVideo.tsx` only. Add a JS-level `prefers-reduced-motion` check (pause the video via a `useEffect`, don't rely solely on CSS `display:none` to stop an already-autoplaying video). Add a `hero_video_toggled` event (`action: "played"|"paused"`).
5. **EarlyAccessModal** — owns `app/EarlyAccessModal.tsx` only (explicitly **not** `early-access-copy.mjs`, already fixed by the lead). Add a "See pricing" escape-hatch link/anchor to `#pricing` inside the modal (close without remembering dismissal). Add a `pricing_section_viewed` event inside the modal's existing `#pricing` `IntersectionObserver` callback (fire once).
6. **CheckoutButton + CheckoutStatus** — owns `app/CheckoutButton.tsx` (existing) + new `app/CheckoutStatus.tsx`. Fix the stuck "Opening checkout…" state by opening Polar checkout in a new tab (`target="_blank" rel="noopener noreferrer"`) and resetting `isNavigating` after a short delay. New `CheckoutStatus` component (client, no props, renders null) reads `?checkout=success|cancelled` on mount and fires `checkout_completed`/`checkout_returned` via `track()`. **The lead has already wired the import/JSX for this into `app/page.tsx`** — this agent's isolated worktree won't reference it yet, that's expected.

Task-tracking IDs for these six (from this session's task list, same numbering if resumed): SEO routes, metadata+structured-data+policy, ComparisonExperience, HeroVideo, EarlyAccessModal, CheckoutButton+CheckoutStatus.

### What's left after the six delegated tasks land

1. ~~Lead integrates every delegated worktree's diff~~ **DONE** — tasks were implemented directly on the branch; the 4th FAQ item was added to the `StructuredData` `FAQPage` list verbatim; the pre-wired `CheckoutStatus` import in `page.tsx` resolved once the file existed (no `page.tsx` edit needed).
2. ~~Run `npm ci --include=dev`, `npm run lint`, `npm test`, `git diff --check`~~ **DONE (2026-08-06):** lint clean, `npm test` 12/12 (build + node tests: `rendered-html`, `analytics-disclosures`, `terms`, `early-access-copy` ×2, `comparison-state`, `seo-routes` ×2, `structured-data` ×3), `git diff --check` clean. `npm ci --include=dev` was not needed (node_modules already valid).
3. ~~Phase 4 — copy finisher~~ **DONE:** only `/terms` "Changes and contact" → "Changes" heading (removed the false contact claim); nothing else changed.
4. ~~Phase 5 — visual reviewer~~ **DONE (2026-08-06, DOM/computed-style assertions + screenshots for human review):** at 1440/768/375 — no horizontal scroll; fixed translucent header (`rgba(10,10,10,.72)` + `blur(10px)`) legible over both the dark hero and white `.price-section`/`.waitlist-section`; hero H1 wraps cleanly on mobile (343px wide, 6 lines); tier cards exactly 511px tall with Buy buttons aligned at identical in-card offsets (429px; the 6px delta is the elevated recommended card); modal `a.modal-decline` escape hatch present; all three Polar checkout links `target="_blank"` + `rel="noopener noreferrer"`; 4 FAQ `details` rendered; reduced-motion emulation verified live — hero video paused and "Watch the transformation" button removed from DOM. Console clean apart from benign local-mode Vercel analytics 404s. Screenshots: `/tmp/cinema-qa/{desktop-top,desktop-pricing,tablet-top,mobile-top}.png`.
5. ~~Phase 6/7 — engineering review, commit, push, open PR~~ **DONE:** code-reviewer subagent was unavailable (free-buff proxy models failing), so the review was performed directly by the lead: one MAJOR defect found and fixed (root-layout `alternates.canonical: "/"` was inherited by `/terms` and `/privacy`, pointing both at the homepage — fixed with per-page `alternates: { canonical: "/terms" | "/privacy" }` and a new canonical-per-route regression test), plus one MINOR fix (`hero_video_toggled` "played" now tracked only after `play()` resolves). Committed `d776e4f`, pushed, PR [#13](https://github.com/donovinsims/cinema-estate/pull/13) opened, later **merged by the owner as `fef7b24` (2026-08-07)**; branch deleted post-merge. Installer artifacts (`.agents/`, `.freebuff/`, `conductor/`, `opencode.json`, `skills-lock.json`) were left untracked.

### Documentation hygiene pass — also done, same session

Beyond `HANDOFF.md` itself, checked every doc file for staleness against what's actually being built. Found and fixed two genuine inaccuracies the Phase 1 strategy audit had flagged as doc conflicts but not yet corrected at the source:

- `docs/pricing-strategy-plain-english.md`: removed the unsupported "we check who you are" (automatic agent identity/license/brokerage verification) and "a second, independent pass checks the work" (internal pre-delivery QA) differentiator claims — neither is built or documented in `docs/PRODUCT.md`/the guardrails file. Replaced with the two claims that are actually true and guardrail-safe (review-first, refund guarantee). Also fixed a residual "approve the preview" phrase in the guarantee description — the shipped flow has no preview-before-payment step.
- `docs/icp-audience-profile.md` §8: the same unsupported identity-verification/independent-QA claim was repeated in the objection-table answer for "I can get this for $10–$40 with a cheap AI tool" — replaced with the same guardrail-safe answer now live in the FAQ addition above, for consistency.
- Checked `CLAUDE.md` and `docs/PRODUCT.md` for staleness against this session's edits — neither needed changes; nothing they document (prices, deliverables, guarantee terms, file-level architecture) was altered, only presentation/UX/copy details neither file describes at that level of detail. `docs/superpowers/plans/*.md` are intentionally immutable historical records, not living docs, and were left alone.

### To resume

Nothing to resume — the workflow is complete. PR [#13](https://github.com/donovinsims/cinema-estate/pull/13) was merged by the owner as `fef7b24` (2026-08-07), the branch was deleted, and the canonical site is live-verified (robots/sitemap/canonical/JSON-LD serving). The six task specs above remain valid as a record of what was built (Task 1: SEO routes; Task 2: metadata/structured-data/policy pages; Task 3: ComparisonExperience; Task 4: HeroVideo; Task 5: EarlyAccessModal; Task 6: CheckoutButton + CheckoutStatus).

## Historical / superseded record

Everything below is retained for context. Earlier no-checkout, pre-pricing, uncommitted-WIP, and earlier test-count statements are historical only and must not override the current state above.

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
2. **Connect a real payout account in Polar (Finance → Account)** — needs owner banking details. Historical note: the former release-blocker framing is superseded; this remains owner-only operational follow-up.
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
- **Historical caveat, superseded as a release gate:** payout setup remains owner-only operational follow-up. It does not block branch review, merge, deployment, or release; agents must not handle banking or tax details.

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
