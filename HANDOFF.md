# Cinema Estate Handoff

Last updated: 2026-08-05

## Active implementation checkpoint

- Active plan: `docs/superpowers/plans/2026-08-05-cinema-estate-cro-closeout.md`.
- Goal: close the two remaining CRO copy regression gaps without changing the approved public copy, design, API, pricing, or deployment architecture.
- Preflight: complete. The eight required marketing skills and the copy-editing checklist were re-read before implementation.
- Task 1 — exact About section contract: **complete**.
- Task 2 — source-aware modal/form copy contract: **complete**.
- Task 3 — final gates, commit/push, Vercel and live verification: **in progress; local gates and scoped staging complete**.
- Resume point if interrupted: inspect `git diff --cached`, commit with `test: lock Cinema Estate CRO copy contracts`, and push `main`. Do not edit `app/page.tsx` or `app/api/early-access/route.ts`.

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

## Current repository and deployment state

- Checkout: `/Users/forex/cinema-estate`.
- Active branch: `main`.
- Local `main` was fast-forwarded to `origin/main` at `042b97d` before this plan began.
- The two remote commits found during preflight only changed `package-lock.json` to install/update Vercel Web Analytics dependencies.
- Production alias: `https://cinema-estate.vercel.app`.
- Production deployment before this closeout: `dpl_4HCv89xFN7yheyTgR7jSiCrkyXQE` (`https://cinema-estate-iqhpuhdv3-teamdonovin.vercel.app`), status `Ready`.
- Current Vercel CLI: `58.1.0`; upgrading is deferred maintenance and is not part of this plan.

## Verification for this plan

- Final `npm ci`: passed on 2026-08-05 after syncing `origin/main`.
- Final `npm run lint`: passed with no errors.
- Final `npm test`: passed with 6 tests and 0 failures; this includes a successful Vinext production build.
- Final `npx next build`: passed, including TypeScript and static generation for `/` and `/privacy` plus the dynamic `/api/early-access` route.
- The scoped `git diff --check` passed for all implementation, test, plan, and handoff files.
- Exactly seven authorized files are staged: five implementation/test files, this handoff, and the active plan. `.agents/`, `conductor/`, `opencode.json`, and `skills-lock.json` remain untracked and unstaged.
- `npm ci` reported 18 dependency audit findings (1 low, 4 moderate, 13 high). No automatic audit fix was run because dependency remediation is outside this focused copy-contract plan.
- Commit/push, production Ready confirmation, and live viewport verification still remain under Task 3.

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
