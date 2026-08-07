## claude/cloud-work-repo-attachment-3r27ay

### Set up persistent engineering workflow (2026-08-07)

- [x] Add `/engineering-workflow` requirement to `CLAUDE.md` so it's invoked for every task, on any machine/session
- [x] Create `tasks/lessons.md` (tracked in git)
- [x] Create `tasks/todo.md` (tracked in git)

**Results:** `CLAUDE.md` now has an "Engineering workflow" section instructing use of
`/engineering-workflow` for every non-trivial task, with `tasks/todo.md` and
`tasks/lessons.md` tracked in git so plans/lessons persist across sessions and machines.
No app code changed.

## sales-page/02-cinematic-editorial-redesign

### Finish PR2: Tasks 4-9 + Villa Siena demo swap (2026-08-07)

Full plan: `HANDOFF.md`'s "PR2 — detailed task log" section is the primary tracker; this is a
lighter session checklist referencing it, not a fork of it.

- [x] Reconcile branch with `origin/main` (merge in `0cd16f5`'s engineering-workflow requirement)
- [ ] Baseline gate green (lint/test/next-build/diff-check)
- [ ] Villa Siena route worker dispatched (worktree-isolated) — `/villa-siena`
- [ ] Villa Siena homepage content swap (hero, ComparisonExperience pair, ProofReel, package
      section, About paragraph 3, docs, tests)
- [ ] Task 6 — pricing chrome rebuild (remove glow/gradient, Story-first-on-mobile)
- [ ] Task 7 — About pull-quote + FAQ chrome
- [ ] Task 8 — final CTA (`.waitlist-section`) chrome
- [ ] Task 9 — generic-SaaS sweep (remaining blue/glow leftovers)
- [ ] Integrate Villa worker's result into PR2 branch history
- [ ] Coherence pass across full buyer journey + new route
- [ ] Full verification: engineering gate + browser at 375/768/1440
- [ ] Update `HANDOFF.md`, push branch, open PR against `main` (do not merge)
