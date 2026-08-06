# Cinema Estate CRO Copy Contract Closeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the two remaining regression-protection gaps in the implemented About and sitewide CRO pass without changing the approved public copy, visual design, form API, pricing, or deployment architecture.

**Architecture:** Keep the approved server-rendered About copy in `app/page.tsx`, but make its test assert all five paragraphs exactly and in order. Move the two client-side modal/form presentation variants into one small, framework-independent module so Node tests can lock the exact listing-handoff and evergreen early-access language while the existing components consume the same source of truth.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, JavaScript ES modules, Node test runner, ESLint, Vinext, Vercel.

## Global Constraints

- Re-read these installed skills before editing: `copywriting`, `copy-editing` (including `references/checklist.md`), `cro`, `offers`, `product-marketing`, `hundred-million-offers` (including its Value Equation guidance), `storybrand-messaging`, and `cro-methodology`.
- Preserve the approved public copy in `app/page.tsx` verbatim. The agent remains the hero; Cinema Estate and Donovin remain the guide.
- Do not add pricing, turnaround claims, testimonials, customer results, guarantees, scarcity, or public sections.
- Do not change `/api/early-access`, its email-only payload, or the Sequenzy integration.
- Preserve user-owned and installer state. The owner explicitly authorized rolling updates to `HANDOFF.md` for this execution; stage that file with the closeout. Do not stage `.agents/`, `conductor/`, `opencode.json`, or `skills-lock.json`.
- The Vercel CLI upgrade is deferred maintenance, not part of this closeout.

---

## Task 1: Lock the exact approved About copy

**Files:**

- Modify: `tests/rendered-html.test.mjs:25-72`
- Verify without changing: `app/page.tsx:89-118`

- [x] **Step 1: Replace fragment-only About assertions with an exact section-copy contract**

In `tests/rendered-html.test.mjs`, add an independent literal array containing the five approved paragraphs exactly as they appear in `app/page.tsx`. Extract the `<p>` elements inside `<div class="about-copy">` from the rendered HTML and compare the resulting array with `assert.deepEqual`. Also assert the exact case-sensitive heading and the exact CTA content `Send me a listing <span aria-hidden="true">→</span>` inside the About button.

The assertions must fail for any changed word, punctuation mark, capitalization, paragraph boundary, paragraph order, or CTA label. Keep the existing image, section-order, claim-absence, privacy, and comparison assertions.

- [x] **Step 2: Prove the strengthened test detects drift**

Temporarily change one word in one expected paragraph and run:

```bash
npm test
```

Expected: the rendered-HTML suite fails with an About copy mismatch.

- [x] **Step 3: Restore the approved literal and prove the suite passes**

```bash
npm test
```

Expected: all existing tests plus the exact five-paragraph contract pass.

---

## Task 2: Lock both source-aware modal and form variants

**Files:**

- Create: `app/early-access-copy.mjs`
- Create: `tests/early-access-copy.test.mjs`
- Modify: `app/EarlyAccessModal.tsx:128-143`
- Modify: `app/WaitlistForm.tsx:6-9,17-18,44-45,61,67-69`
- Verify without changing: `app/EarlyAccessButton.tsx:6-20`
- Verify without changing: `app/api/early-access/route.ts`

- [x] **Step 1: Write failing exact-copy tests for both intents**

Create `tests/early-access-copy.test.mjs`. Import the presentation resolver that will be created in the next step and assert the complete objects below with `assert.deepEqual`:

```js
{
  eyebrow: "Cinema Estate / Early access",
  title: "Get early access.",
  description: "See how your next approved listing can become a cinematic marketing package.",
  submit: "Get early access",
  success: "You’re on the early-access list. We’ll be in touch when there’s an update.",
}
```

```js
{
  eyebrow: "Cinema Estate / Listing handoff",
  title: "Send me your listing.",
  description: "Leave your email and I’ll follow up with the next step for sending the listing photos you already have.",
  submit: "Start the listing handoff",
  success: "Thanks — I’ll follow up with the next step for sending the listing photos you already have.",
}
```

Run:

```bash
node --test tests/early-access-copy.test.mjs
```

Expected: FAIL because `app/early-access-copy.mjs` does not exist yet.

- [x] **Step 2: Create one internal source of truth**

Create `app/early-access-copy.mjs` with an immutable map for `early-access` and `listing`, plus `getEarlyAccessPresentation(intent = "early-access")`. Return the early-access variant for the default and the listing variant only when `intent === "listing"`.

Keep this module free of React, browser APIs, analytics, form submission, and public API concerns so Node can test it directly.

- [x] **Step 3: Make both client components consume the presentation module**

In `EarlyAccessModal.tsx`, replace inline title/description/eyebrow conditionals with the object returned by `getEarlyAccessPresentation(presentationIntent)`.

In `WaitlistForm.tsx`, replace `successMessages` and the inline submit-label conditional with the same resolver. Preserve the current `intent` union, analytics properties, validation, honeypot, fetch target, payload, success behavior, and error behavior.

- [x] **Step 4: Run the focused copy contract**

```bash
node --test tests/early-access-copy.test.mjs
```

Expected: both intent contracts pass.

- [x] **Step 5: Verify the server API remained untouched**

```bash
git diff -- app/api/early-access/route.ts
```

Expected: no output.

---

## Task 3: Verify, release, and confirm production behavior

**Files:**

- Verify: `app/page.tsx`
- Verify: `app/EarlyAccessModal.tsx`
- Verify: `app/WaitlistForm.tsx`
- Verify: `app/early-access-copy.mjs`
- Verify: `tests/rendered-html.test.mjs`
- Verify: `tests/early-access-copy.test.mjs`
- Include in the focused commit: `docs/superpowers/plans/2026-08-05-cinema-estate-cro-closeout.md`
- Include in the focused commit: `HANDOFF.md`

- [x] **Step 1: Run clean local gates**

```bash
npm ci
npm run lint
npm test
npx next build
git diff --check -- HANDOFF.md app/EarlyAccessModal.tsx app/WaitlistForm.tsx app/early-access-copy.mjs tests/rendered-html.test.mjs tests/early-access-copy.test.mjs docs/superpowers/plans/2026-08-05-cinema-estate-cro-closeout.md
```

Expected: install succeeds; lint is clean; all Node tests pass; both Vinext and Next builds succeed; the scoped diff check reports nothing.

- [x] **Step 2: Review the focused diff and stage only owned files**

```bash
git diff -- HANDOFF.md app/EarlyAccessModal.tsx app/WaitlistForm.tsx app/early-access-copy.mjs tests/rendered-html.test.mjs tests/early-access-copy.test.mjs docs/superpowers/plans/2026-08-05-cinema-estate-cro-closeout.md
git add HANDOFF.md app/EarlyAccessModal.tsx app/WaitlistForm.tsx app/early-access-copy.mjs tests/rendered-html.test.mjs tests/early-access-copy.test.mjs docs/superpowers/plans/2026-08-05-cinema-estate-cro-closeout.md
git diff --cached --check
git status --short
```

Expected: only the five implementation/test files, this plan, and the owner-authorized `HANDOFF.md` are staged; installer artifacts remain unstaged.

- [ ] **Step 3: Commit and push the verified closeout**

```bash
git commit -m "test: lock Cinema Estate CRO copy contracts"
git push origin main
```

Expected: the commit lands on `origin/main` and triggers the existing Vercel production deployment.

- [ ] **Step 4: Wait for the exact production deployment to reach Ready**

```bash
vercel inspect https://cinema-estate.vercel.app
```

Expected: target `production`, status `Ready`, with `https://cinema-estate.vercel.app` listed as an alias.

- [ ] **Step 5: Verify the live page at 375px and 1440px**

At each viewport, verify:

- Quality → About → FAQ order.
- Portrait proportions; portrait appears before copy on mobile.
- All five About paragraphs and `Send me a listing →` are unchanged.
- The About CTA opens the listing-handoff eyebrow, title, description, submit label, and listing success copy.
- Header, hero, and final CTAs open the evergreen early-access variant.
- Tab stays trapped in the open dialog; Escape closes it; focus returns to the triggering CTA.
- Reduced-motion mode replaces motion-dependent comparison behavior with the accessible static/control presentation.
- Both WebP portrait candidates load without 404s and there are no new console errors.

- [ ] **Step 6: Record closeout evidence**

Report the commit SHA, `origin/main` push result, Vercel deployment URL/status, gate results, viewport checks, and the intentionally untouched dirty files. Explicitly separate code-gate green, production Ready, and live behavior verified.
