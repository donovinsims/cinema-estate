---
name: sales-page-upgrade
description: Orchestrates Cinema Estate sales-page strategy, CRO, offer design, psychology, UX, SEO, analytics, copy refinement, implementation review, and visual QA. Use for comprehensive Cinema Estate landing-page audits and upgrades.
disable-model-invocation: true
argument-hint: "[audit|plan|implement|review|full]"
---

Costly, deliberate, multi-agent workflow. Only starts on explicit invocation:
`/sales-page-upgrade [audit|plan|implement|review|full]`. If no mode is given, run `full`.

Permanent product facts live in `references/product-guardrails.md` — every phase that touches
copy, pricing, claims, or positioning must read it first and never contradict it. Output formats
for every report in this workflow live in `references/output-contracts.md`.

## Required-skill preflight

Before invoking an agent or claiming a named skill ran, inspect the 15 required directories under
`~/.claude/skills`. A skill is executable only when its `SKILL.md` is nonempty, begins with valid
YAML frontmatter, and contains meaningful Markdown instructions. Treat HTML, a GitHub 404 page,
empty content, or malformed frontmatter as **found but invalid**.

Report every required skill as one of: found and valid, found but invalid, or missing; separately
report whether it is successfully mapped and successfully executable. Preserve every expected name
in the workflow even when it is invalid or missing. Do not fetch, repair, reinstall, replace, or
silently substitute a global skill.

`make-interfaces-feel-better` and `impeccable` are required dependencies. If either fails this
preflight, do not claim it ran. Continue an audit, plan, or implementation phase that can safely
proceed, mark the affected UX or visual-skill portion incomplete, and perform an explicitly labeled
first-principles review for temporary continuity. The named skill remains unresolved until its own
installed file passes this preflight.

## Modes

- **audit** — Phase 0 + Phase 1 only. Return the three consolidated audit findings. No plan, no
  changes.
- **plan** — Phases 0–2. Run or reuse existing audits, then produce the synthesized, verified
  implementation plan. No implementation.
- **implement** — Phase 3 only, against an already-approved plan (from a prior `plan` run or one
  the user supplies). Preserve every guardrail in this file and in `product-guardrails.md`.
- **review** — Phases 4–6. Copy finishing, visual QA, engineering review, verification — against
  an already-implemented change.
- **full** — Phases 0–7 end to end, finishing with an open, unmerged pull request. Default mode.

## Phase 0 — Repository inspection (read-only)

Read before doing anything else: `CLAUDE.md`, `HANDOFF.md`, `docs/PRODUCT.md`,
`docs/icp-audience-profile.md`, `docs/pricing-strategy-plain-english.md`, the current landing-page
implementation (`app/page.tsx` and the components/routes it composes), `tests/`, `git status`,
deployment/build config (`vite.config.ts`, `worker/index.ts`, `.openai/hosting.json`), and existing
analytics (`app/analytics.ts` and its call sites). **Do not write code during this phase.**

## Phase 1 — Parallel read-only audits

Run these three project agents **in parallel**, not fifteen independent skill-agents:

1. `cinema-estate-strategy-auditor` (`product-marketing`, `cro`, `hundred-million-offers`,
   `influence-psychology`, `storybrand-messaging`)
2. `cinema-estate-ux-auditor` (`ux-heuristics`, `refactoring-ui`, `make-interfaces-feel-better`,
   `web-design-guidelines`)
3. `cinema-estate-growth-auditor` (`seo-audit`, `analytics`, `ai-seo`)

Each stays read-only and returns concise findings in the format defined in
`references/output-contracts.md`. The three coherent audit contexts exist specifically to avoid
duplicated exploration and conflicting recommendations that fifteen independent single-skill agents
would produce.

If the preflight finds an agent's mapped skill invalid or missing, invoke the agent only for the
valid mapped skills and the required labeled first-principles continuity review; include the
incomplete named-skill status in the agent result and lead synthesis.

## Phase 2 — Lead synthesis

The lead session (not a subagent) must:

1. Reconcile the three audits.
2. Resolve conflicts between skill recommendations — state which recommendation won and why.
3. Reject unsupported, excessive, or contradictory suggestions — state what was dropped and why.
4. Produce one coherent page strategy.
5. Produce a concise implementation plan: exact files, dependencies between tasks, tests to
   add/update, and a verification method per task.
6. Define file ownership per the rule below.

The lead agent is the **final authority** for: positioning, page narrative, overall information
architecture, `app/page.tsx`, shared styles, pricing presentation, final copy integration, and
funnel coherence. These are never delegated to a subagent.

## Phase 3 — Implementation

Implement the synthesized plan. Subagents may only take bounded tasks with **non-overlapping file
ownership** — e.g. metadata/structured data, sitemap/robots, analytics utilities and their tests,
standalone components, policy/FAQ routes, general test additions, documentation updates.

Rules:

- Use isolated git worktrees for any parallel agent that modifies files.
- **Never** let more than one agent modify: `app/page.tsx`, the same shared stylesheet, the same
  pricing component, the same copy section, or the same analytics utility.
- The lead agent reviews every delegated diff before integrating it.

## Phase 4 — Copy finishing

Run `cinema-estate-copy-finisher` (`copywriting`, `copy-editing`) only after positioning, page
structure, the offer, and implementation are stable. It may improve clarity, concision, rhythm,
consistency, and scanability. It may **not** alter prices, package contents, delivery commitments,
guarantee conditions, legal responsibilities, product capabilities, checkout order, or any
unsupported factual claim — see `product-guardrails.md`. The lead agent reviews and applies its
recommendations.

## Phase 5 — Visual QA

Run `cinema-estate-visual-reviewer` (`impeccable`). It inspects the running application with the
available browser tooling at representative desktop and mobile viewport sizes and reports concrete
defects, not an unrelated redesign. The lead agent applies material fixes and re-runs visual
verification when it does. If `impeccable` remains invalid, label the visual-skill phase incomplete
and run the review as an explicit first-principles QA pass; never describe it as an `impeccable`
execution.

## Phase 6 — Engineering review and verification

Use installed workflows where available: `/superpowers:requesting-code-review`,
`/superpowers:receiving-code-review`, `/superpowers:verification-before-completion`,
`/superpowers:finishing-a-development-branch`, `/commit-push-pr`,
`/claude-md-management:revise-claude-md`. If a namespaced form differs, locate the installed
equivalent. If a convenience command is unavailable, perform its underlying steps directly rather
than stopping. **Never merge automatically** — the pull request stays open and unmerged.

## Phase 7 — Git and pull request

After the lead has reviewed the final diff and all required verification passes, commit only the
approved, task-owned files; push the feature branch; and open a pull request targeting `main`.
Include the pull-request contract from `references/output-contracts.md`. Never commit directly to
`main`, merge the pull request, or enable auto-merge. A `full` run is complete only when the PR is
open for owner review.

## Final response contract

Every mode's final response follows `references/output-contracts.md`'s relevant section. `full`
specifically ends with the "Final completion report" contract: branch name, PR URL, customer-facing
changes, material files changed, each required skill and its execution status, agents used,
analytics changes, SEO changes, UX/accessibility changes, tests and verification commands with
results, browser/visual checks performed, review findings and applied fixes, known limitations,
required owner actions, confirmation `main` was not modified directly, and confirmation the PR
remains unmerged.
