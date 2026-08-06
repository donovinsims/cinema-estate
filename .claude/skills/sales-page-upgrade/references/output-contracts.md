# Sales-Page-Upgrade — Output Contracts

Compact required formats for each report type in the workflow. Every agent must structure its
final output this way so the lead session can synthesize without re-deriving format. These are
formats, not procedures — see `SKILL.md` for execution order.

## Audit finding standard

For every audit finding, include evidence (file, route, or observed UI), severity, priority,
recommended action, any guardrail conflict, unsupported ideas rejected, and exact likely files
affected. State an affected required skill as incomplete when its preflight is invalid or missing;
never report that named skill as executed.

## Strategy audit (`cinema-estate-strategy-auditor`)

Numbered 1–12 exactly as specified in the agent's own instructions (buyer/JTBD → positioning →
differentiation → narrative → above-the-fold → objection hierarchy → package differentiation → CTA
hierarchy → trust/risk-reversal → unsupported claims to avoid → prioritized recommendations →
documentation conflicts found). One synthesized voice — not five sub-reports per skill.

## UX audit (`cinema-estate-ux-auditor`)

Numbered 1–12 exactly as specified in the agent's own instructions (hierarchy problems → section
sequence → navigation → CTA/funnel friction → mobile risks → pricing-comparison problems →
form/modal friction → accessibility → typography/spacing → interaction states → motion/reduced-motion
→ prioritized changes). Each finding: what's wrong, why it matters, concrete fix.

## SEO and analytics audit (`cinema-estate-growth-auditor`)

Numbered 1–15 exactly as specified in the agent's own instructions. Every recommendation must name
the exact file(s) likely to change and how to verify it (build/test/manual check).

## Synthesized implementation plan (lead agent, Phase 2)

- **Conflicts resolved** — each audit disagreement, and which recommendation won and why
- **Rejected suggestions** — what was dropped as unsupported/excessive/contradictory, and why
- **Page strategy** — one coherent narrative, stated in a few sentences
- **Task list** — exact files touched, dependencies between tasks, tests to add/update, verification
  method per task
- **File ownership** — lead-owned files (positioning, `app/page.tsx`, shared styles, pricing
  presentation, funnel coherence) vs. delegable bounded tasks (metadata, sitemap/robots, analytics
  utilities, standalone components, policy/FAQ routes, tests, docs)

## Copy finishing report (`cinema-estate-copy-finisher`)

Numbered 1–7 exactly as specified in the agent's own instructions (section-by-section findings →
exact proposed revisions → reason per material revision → factual/compliance risks → terminology
inconsistencies → claims requiring removal/qualification → final CTA consistency). Every proposed
revision shown as before/after text, never a vague direction.

## Visual QA report (`cinema-estate-visual-reviewer`)

One entry per issue, each with: **severity** (blocker/major/minor), **viewport**, **location**
(section/component), **observed problem**, **recommended correction**, **blocks completion**
(yes/no). Grouped by review area from the agent's instructions. Concrete defects only — no
unrelated redesign proposals.

## Code-review report (Phase 6)

- Files changed and why, mapped to the implementation plan's task list
- Guardrail compliance check against `product-guardrails.md` (prices, claims, guarantee scope)
- Test coverage added/changed and results
- Any deviation from the synthesized plan, with justification

## Verification report (Phase 6)

- Exact commands run (build, lint, `npm test`, `git diff --check`) and their results
- Browser/visual checks performed, viewports covered
- Confirmation no prohibited claim, price, or flow change slipped in
- Known limitations or skipped checks, with reason

## Pull-request description

- Summary (1–3 bullets) of customer-facing change
- Test plan checklist
- Explicit confirmation: guardrails respected, no price/package/guarantee change without
  canonical-doc backing
- Never merge automatically — PR stays open and unmerged

## Final completion report

List these items explicitly: branch name; pull-request URL; customer-facing changes; material files
changed; every required skill and its execution status; agents used; analytics changes; SEO changes;
UX and accessibility changes; tests and commands with results; browser verification; review findings
and fixes; known limitations; owner actions; confirmation that `main` was not modified directly; and
confirmation that the PR remains open and unmerged.

For every required skill, distinguish found and valid, found but invalid, missing, successfully
mapped, and successfully executable. Do not fold agents used into the skill-status field.
