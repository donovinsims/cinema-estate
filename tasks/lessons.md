# Lessons

Patterns learned from user corrections. Append entries here per the
`/engineering-workflow` skill — root cause + concrete rule, not "be more careful."

## 2026-08-07 — Inline style beats CSS class for transforms

**Root cause:** In PR3, ArrowIcon applied `transform: rotate(-45deg)` as an inline `style`
(specificity 1,0,0,0). A CSS class rule `.button:hover [data-motion="external"] { transform:
rotate(-45deg) translate(3px, -3px); }` (specificity 0,3,0) was meant to override it on hover.
The inline style always won — external arrows never animated.

**Rule:** When an element's base transform needs to be overridable by a CSS class (e.g., a hover
state), apply the base transform via a CSS rule targeting a data attribute
(`[data-direction="up-right"] { transform: rotate(-45deg); }`), never via inline `style`.
A class + pseudo-class selector (0,3,0) beats a single data-attr selector (0,1,0), but nothing
beats inline (1,0,0,0) short of `!important`.
