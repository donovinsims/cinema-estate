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

## 2026-08-08 — CSP directives must be checked per actual resource type, not per domain

**Root cause:** Added a Content-Security-Policy in `next.config.ts` and allow-listed
`va.vercel-scripts.com` (Vercel Analytics/Speed Insights) in `connect-src` only, reasoning
about it as "the domain analytics beacons post to." In dev mode, `@vercel/analytics` and
`@vercel/speed-insights` actually load a `<script src="https://va.vercel-scripts.com/...">`
tag — a `script-src` concern, not `connect-src`. A visual-QA subagent caught the resulting
blocked script via live console errors; verifying only "does the CSP header appear" would
have missed it.

**Rule:** When adding a third-party origin to a CSP, trace what that origin is actually used
for at the resource level (script tag src, XHR/fetch target, image src, stylesheet href,
font src) and add it to every directive that specific runtime behavior needs — not just the
directive that matches your first mental model of "what this integration does." Verify by
loading the real page with DevTools console open (or an agent doing the same), not just by
inspecting the header value.
