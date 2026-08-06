# Cinema Estate Sales-Page Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply every copy/structure improvement from the 2026-08-06 sales-page readiness review that does **not** require a fact or decision only the owner can supply — without adding pricing, checkout, guarantees beyond what's already true, turnaround claims, or proof that doesn't exist yet.

**Architecture:** All changes are within the existing single-page architecture (`app/page.tsx`, `app/globals.css`, `app/early-access-copy.mjs`). No new routes, no new dependencies, no schema or API changes. Each task follows this repo's established pattern: change the approved public copy, lock the exact new copy into `tests/rendered-html.test.mjs` (or `tests/early-access-copy.test.mjs` for Task 5) with a red/green proof, then commit.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, JavaScript ES modules, Node test runner, ESLint, Vinext, Vercel.

## Global Constraints

- Read `docs/PRODUCT.md` and `HANDOFF.md`'s "Sales-page readiness review — 2026-08-06" section before starting; they carry the facts this plan is grounded in.
- Do **not** add pricing, checkout, turnaround-time claims, guarantee terms beyond the existing review-before-publish policy, testimonials, customer results, or scarcity/urgency language. All of those are listed under "Blocked on owner input" in `HANDOFF.md` — if a task in this plan seems to need one of them, stop and flag it instead of inventing the fact.
- Every new or changed sentence of public copy must stay literally true to facts already approved elsewhere on the page (About section, Quality section) — do not introduce a new claim this plan didn't already ground.
- Re-read `copywriting`, `copy-editing` (including `references/checklist.md`), `cro`, `marketing-psychology`, `storybrand-messaging`, and `made-to-stick` before finalizing any wording change — this matches the project's established practice from the prior closeout plan.
- Do not touch `/api/early-access`, its email-only payload, or the Sequenzy integration.
- Preserve user-owned and installer state — do not stage `.agents/`, `conductor/`, `opencode.json`, or `skills-lock.json`.
- Stage files explicitly per task. Do not use `git add .`.
- Update `HANDOFF.md` with the closeout evidence when this plan completes, matching the pattern in the 2026-08-05 closeout.

---

## Task 1: Surface the "third option" framing in the hero

The "third option" positioning (static photos vs. hiring a videographer vs. Cinema Estate) is explicit and defensible today, but it only appears once, in the About section (page position 5 of 9). A visitor who doesn't scroll that far never sees the reframe that makes the offer make sense. This task echoes the *already-approved* concept from About (`app/page.tsx:111-112`) and Quality (`app/page.tsx:81-82`, "no reshoot, no crew to book, no property-access schedule") higher on the page, without introducing any new claim.

**Files:**

- Modify: `app/page.tsx:35-40` (hero content)
- Modify: `app/globals.css` (add a `.hero-alt` rule near the existing `.hero-deck` rule)
- Modify: `tests/rendered-html.test.mjs` (add an assertion for the new hero line)

- [x] **Step 1: Write the failing assertion**

In `tests/rendered-html.test.mjs`, add near the existing hero assertions:

```js
assert.match(html, /Not another photo shoot\. Not another crew to book\. A third option, built entirely from the listing photos you've already approved\./i);
```

Run:

```bash
npm test
```

Expected: FAIL because this text does not yet exist in `app/page.tsx`.

- [x] **Step 2: Add the hero line**

In `app/page.tsx`, inside `.hero-content` (around line 38-39), add a new paragraph between the `hero-deck` paragraph and the `EarlyAccessButton`:

```tsx
<p className="hero-deck">Video tours, narration, a listing page, and a final film—built from the property you are already marketing.</p>
<p className="hero-alt">Not another photo shoot. Not another crew to book. A third option, built entirely from the listing photos you&rsquo;ve already approved.</p>
<EarlyAccessButton className="button button-primary" source="hero">Get early access <span aria-hidden="true">↘</span></EarlyAccessButton>
```

- [x] **Step 3: Style the new line**

In `app/globals.css`, add a rule near `.hero-deck`:

```css
.hero-alt { max-width: 560px; margin-bottom: 30px; color: #c7d2ff; font-size: clamp(.92rem, 1.3vw, 1.02rem); }
```

- [x] **Step 4: Run the full suite and verify green**

```bash
npm test
```

Expected: all tests pass, including the new hero assertion.

- [x] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "copy: surface third-option positioning in the hero"
```

---

## Task 2: Rewrite FAQ questions into explicit objection language

The two buyer fears this product is built around — that the output looks fake/gimmicky, and that AI-enhanced media causes MLS/disclosure trouble — are already answered correctly in the FAQ (`app/page.tsx:124,126`), but the *questions* are softened into generic product-spec phrasing instead of naming the fear directly. This task changes only the two `<summary>` question strings; the answers (already-approved facts) are untouched.

**Files:**

- Modify: `app/page.tsx:124,126`
- Modify: `tests/rendered-html.test.mjs` (update the FAQ question assertions if present, or add them)

- [x] **Step 1: Write the failing assertion**

In `tests/rendered-html.test.mjs`, add:

```js
assert.match(html, /Will this look fake or gimmicky\?/i);
assert.match(html, /Will AI-enhanced visualization cause MLS or disclosure trouble\?/i);
```

Run:

```bash
npm test
```

Expected: FAIL — the current questions read "Does Cinema Estate redesign the property?" and "How is AI-enhanced visualization handled?".

- [x] **Step 2: Update the two question strings**

In `app/page.tsx`, change:

```tsx
<details open><summary>Does Cinema Estate redesign the property?</summary><p>No. The real listing images remain the source. Cinema Estate adds motion, narration, and a complete marketing package.</p></details>
<details><summary>Who approves what goes live?</summary><p>You do. Agents approve their assets before anything is published or shared.</p></details>
<details><summary>How is AI-enhanced visualization handled?</summary><p>AI-enhanced visualization is disclosed. Local MLS and brokerage rules apply, and agents remain responsible for their listing requirements.</p></details>
```

to:

```tsx
<details open><summary>Will this look fake or gimmicky?</summary><p>No. The real listing images remain the source. Cinema Estate adds motion, narration, and a complete marketing package.</p></details>
<details><summary>Who approves what goes live?</summary><p>You do. Agents approve their assets before anything is published or shared.</p></details>
<details><summary>Will AI-enhanced visualization cause MLS or disclosure trouble?</summary><p>AI-enhanced visualization is disclosed. Local MLS and brokerage rules apply, and agents remain responsible for their listing requirements.</p></details>
```

- [x] **Step 3: Run the full suite and verify green**

```bash
npm test
```

- [x] **Step 4: Commit**

```bash
git add app/page.tsx tests/rendered-html.test.mjs
git commit -m "copy: rewrite FAQ questions into explicit objection language"
```

---

## Task 3: Add an explicit "how it works" process to the Quality section

The process (send approved photos → Cinema Estate builds the package → agent reviews before publish) is already stated across About's prose (`app/page.tsx:109-111`), but never as a scannable numbered plan. This task adds it as an ordered list inside the existing Quality section (`app/page.tsx:76-85`) — no new section, no renumbering of the page's `0X /` eyebrows.

**Files:**

- Modify: `app/page.tsx:76-85`
- Modify: `app/globals.css` (style for the new ordered list, reusing `.quality-grid` conventions)
- Modify: `tests/rendered-html.test.mjs`

- [x] **Step 1: Write the failing assertion**

```js
assert.match(html, /Send the listing photos you.{1,2}ve already approved\./i);
assert.match(html, /Cinema Estate builds the four-part package around them\./i);
assert.match(html, /You review every asset before anything is published or shared\./i);
```

Run `npm test`. Expected: FAIL — this ordered list does not exist yet.

- [x] **Step 2: Add the ordered list to the Quality section**

In `app/page.tsx`, inside the `.quality-grid > div` (after the existing `<p>`, before the existing `<ul>`):

```tsx
<ol className="how-it-works">
  <li>Send the listing photos you&rsquo;ve already approved.</li>
  <li>Cinema Estate builds the four-part package around them.</li>
  <li>You review every asset before anything is published or shared.</li>
</ol>
```

- [x] **Step 3: Style the ordered list**

In `app/globals.css`, add near `.quality-grid`:

```css
.how-it-works { margin: 0 0 22px; padding-left: 22px; color: #d0d0d5; font-size: 1.02rem; }
.how-it-works li { padding: 6px 0; }
```

- [x] **Step 4: Run the full suite and verify green**

```bash
npm test
```

- [x] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "copy: add explicit how-it-works steps to the Quality section"
```

---

## Task 4: Name and elevate the existing review-before-publish policy as a guarantee

The Quality section already states, in substance, a real risk-reversal policy: nothing publishes until the agent approves it. Hormozi's offer framework (and this review's Value Equation analysis) flags this as unstated risk reversal — it exists but isn't named or placed near a CTA. This task names it and places it near the final waitlist CTA, using only the fact that's already true and already public. It does **not** add refund terms, a time window, or any commitment beyond what `app/page.tsx:79-84` already states.

**Files:**

- Modify: `app/page.tsx:130-135` (waitlist section)
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

- [x] **Step 1: Write the failing assertion**

```js
assert.match(html, /The Review-First Guarantee/i);
assert.match(html, /nothing publishes to your listing until you.{1,2}ve reviewed and approved every asset yourself/i);
```

Run `npm test`. Expected: FAIL.

- [x] **Step 2: Add the named guarantee to the waitlist section**

In `app/page.tsx`, inside the waitlist section's first `<div>` (after the existing `<h2>`):

```tsx
<div>
  <p className="eyebrow">Early access</p>
  <h2 id="waitlist-title">Give your next listing a stronger next move.</h2>
  <p className="guarantee-line"><strong>The Review-First Guarantee:</strong> nothing publishes to your listing until you&rsquo;ve reviewed and approved every asset yourself.</p>
</div>
```

- [x] **Step 3: Style the guarantee line**

In `app/globals.css`, add near `.waitlist-grid`:

```css
.guarantee-line { margin: 14px 0 0; color: #33333b; font-size: .92rem; }
.guarantee-line strong { color: #0a0a0a; }
```

- [x] **Step 4: Run the full suite and verify green**

```bash
npm test
```

- [x] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "copy: name the existing review-before-publish policy as a guarantee"
```

---

## Task 5: Give the early-access success message a concrete next step

`app/early-access-copy.mjs`'s `listing` variant already states a next step ("I'll follow up with the next step for sending the listing photos you already have"). The `early-access` variant doesn't ("We'll be in touch when there's an update") — it's vague and doesn't reduce post-signup anxiety. This task tightens it using a fact we already know is true (pricing and onboarding are coming) without inventing a timeframe or SLA.

**Files:**

- Modify: `app/early-access-copy.mjs:7`
- Modify: `tests/early-access-copy.test.mjs`

- [x] **Step 1: Write the failing assertion**

In `tests/early-access-copy.test.mjs`, update the expected `early-access` object's `success` field to:

```js
success: "You’re on the early-access list. I’ll personally follow up as pricing and onboarding are ready.",
```

Run:

```bash
node --test tests/early-access-copy.test.mjs
```

Expected: FAIL — current text is "You're on the early-access list. We'll be in touch when there's an update."

- [x] **Step 2: Update the presentation object**

In `app/early-access-copy.mjs`, change the `"early-access"` variant's `success` field to match the string above exactly.

- [x] **Step 3: Run the focused test and verify green**

```bash
node --test tests/early-access-copy.test.mjs
```

- [x] **Step 4: Run the full suite**

```bash
npm test
```

- [x] **Step 5: Commit**

```bash
git add app/early-access-copy.mjs tests/early-access-copy.test.mjs
git commit -m "copy: give the early-access success message a concrete next step"
```

---

## Task 6: Add benefit bridges to the package deliverables, and annotate the orphaned pricing CSS

The four package deliverables (`app/page.tsx:18-23`) list what each item is, not what it does for the agent — copy-editing's "So What" sweep flags exactly this pattern. This task adds a modest, factual bridge to each (what the deliverable functionally accomplishes, not a results claim). It also annotates the orphaned `.hero-price` / `.price-section` / `.price-grid` rules in `app/globals.css` so a future reader doesn't mistake reserved-for-later CSS for dead code to delete.

**Files:**

- Modify: `app/page.tsx:18-23`
- Modify: `app/globals.css` (comment only, no rule changes)
- Modify: `tests/rendered-html.test.mjs`

- [x] **Step 1: Write the failing assertions**

```js
assert.match(html, /so your listing shows motion, not just a static frame/i);
assert.match(html, /so buyers understand what makes it worth seeing in person/i);
assert.match(html, /instead of splitting attention across scattered photo links/i);
assert.match(html, /one link that covers the whole story of the listing/i);
```

Run `npm test`. Expected: FAIL.

- [x] **Step 2: Update the deliverables array**

In `app/page.tsx`, change the `deliverables` array to:

```tsx
const deliverables = [
  ["01", "Video tours", "Slow cinematic sequences from the photos you approve—so your listing shows motion, not just a static frame."],
  ["02", "Narration", "A clear listing story shaped around the real property—so buyers understand what makes it worth seeing in person."],
  ["03", "Listing page", "One focused destination to share with prospective buyers, instead of splitting attention across scattered photo links."],
  ["04", "Final film", "A complete, ready-to-review marketing package—one link that covers the whole story of the listing."],
];
```

- [x] **Step 3: Annotate the orphaned pricing CSS**

In `app/globals.css`, immediately above the `.hero-price` rule and immediately above the `.price-section, .price-grid` rules, add a one-line comment each:

```css
/* Reserved for the pricing section deferred by app/page.tsx's TODO(pricing) comment — not dead code. */
```

- [x] **Step 4: Run the full suite and verify green**

```bash
npm test
```

- [x] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "copy: add benefit bridges to package deliverables; annotate reserved pricing CSS"
```

---

## Task 7: Verify, release, and update the handoff

**Files:**

- Verify: `app/page.tsx`, `app/globals.css`, `app/early-access-copy.mjs`
- Verify: `tests/rendered-html.test.mjs`, `tests/early-access-copy.test.mjs`
- Modify: `HANDOFF.md`

- [ ] **Step 1: Run clean local gates**

```bash
npm ci
npm run lint
npm test
npx next build
```

Expected: install succeeds, lint is clean, all Node tests pass (including the Vinext build), and the native Next build succeeds.

- [ ] **Step 2: Review the full diff since the branch point**

```bash
git diff main --stat
```

Confirm only the six tasks' files plus this plan and `HANDOFF.md` changed — no accidental edits to `/api/early-access`, pricing, or checkout-adjacent files.

- [ ] **Step 3: Update HANDOFF.md with closeout evidence**

Add a dated entry recording: which of Tasks 1-6 landed, the final `npm test` result, and confirmation that nothing in the "Blocked on owner input" list was touched.

- [ ] **Step 4: Commit and push**

```bash
git add HANDOFF.md
git commit -m "docs: close out sales-page readiness copy pass"
git push origin main
```

- [ ] **Step 5: Verify the live deployment**

```bash
vercel inspect https://cinema-estate.vercel.app
```

Expected: target `production`, status `Ready`. Then manually check the live page at 375px and 1440px for the new hero line, FAQ questions, how-it-works steps, guarantee line, and package copy — all rendering as written, with no layout regressions.
