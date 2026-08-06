# Cinema Estate Handoff

Last updated: 2026-08-05

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
