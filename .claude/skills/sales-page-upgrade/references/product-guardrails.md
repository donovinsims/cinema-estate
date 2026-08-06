# Cinema Estate — Product Guardrails

Permanent factual source of truth for all sales-page-upgrade agents. Read this before
proposing or reviewing any positioning, copy, pricing, or claim.

## Source-of-truth order

When sources conflict, resolve in this order and **report the conflict** — never silently
pick the more convenient version:

1. `docs/PRODUCT.md`
2. `docs/pricing-strategy-plain-english.md`
3. `docs/icp-audience-profile.md`
4. Current legal/policy pages (`app/terms/page.tsx`, `app/privacy/page.tsx`)
5. Current implementation (`app/page.tsx` and related components)
6. `HANDOFF.md` — for temporary operational status only, never for permanent facts

## What Cinema Estate produces

A four-part cinematic marketing package built from a real-estate listing's **already-approved
photos**: (1) video tours — cinematic camera-move sequences generated from the supplied photos,
(2) narration — a listing story shaped around the real property, (3) a hosted listing page, and
(4) the final film. The real approved photos remain the source throughout; the product does not
invent rooms, move walls, replace finishes, or otherwise change what the property is. Nothing
publishes until the agent reviews and approves the assets.

## Primary buyer

Individual, independent or near-solo real-estate **listing agents** — roughly 8–20 seller-side
listings a year, who already pay for professional photography and have no in-house media team or
production budget. Not brokerages, not marketing teams, not agents without existing approved
listing photography. See `docs/icp-audience-profile.md` for the full profile, best-fit filter, and
objection table (confidence-labeled — most of this ICP is research-derived, not yet
customer-validated).

## Fidelity and non-invention requirement

Every deliverable is built from the agent's real, already-approved photos. Nothing is invented or
altered. This is a structural product commitment, not just marketing language — it directly
answers the primary buyer anxiety of "will this look fake or gimmicky."

## Exact package names, prices, and deliverables

One-time, per-listing purchases — **not a subscription**. Sold one at a time.

| Package | Price | Deliverables |
|---|---|---|
| **Proof** | $149 | Up to 12 approved photos; short cinematic film, branded and unbranded; hosted listing page; 1 round of revisions; delivered in 24 hours |
| **Story** (recommended tier) | $299 | Up to 25 approved photos; narrated film with a script from the listing's real facts; social teaser cut plus the full listing page; 1 round of revisions; delivered in 24 hours |
| **Signature** (luxury/high-stakes listings only, not a default upsell) | $549 | Up to 40 approved photos; custom narrative direction and voice option; multiple social cuts plus the listing page; 2 rounds of revisions; delivered in 24 hours |

Exact source: `tiers` array in `app/page.tsx`. Do not restate prices, package names, or deliverable
lists from memory — re-read that array before any copy or pricing-presentation work.

## Checkout provider and current order

Checkout is **live** via Polar (`app/CheckoutButton.tsx`). Each tier's "Buy" button links directly
to a real Polar checkout URL — these are real purchase buttons, not lead capture. The actual flow
is: **agent pays first**, then submits approved photos and listing details, then receives the
package within 24 hours, then reviews every asset before anything publishes.

There is **no free preview before payment**. An earlier proposal described "review a free preview
before you pay," but that was not built — Polar's hosted checkout doesn't support it. Do not
describe a free-preview-before-paying step; it does not exist in the shipped flow.

A secondary early-access email path (`WaitlistForm.tsx` → Sequenzy) still exists alongside
checkout for visitors who aren't ready to buy.

## Delivery commitment

24 hours from receipt of the agent's approved photos and required listing details — not 48 hours
(an earlier draft number). The clock starts when Cinema Estate has everything needed, not at order
placement.

## Agent review before publication

Nothing publishes to the listing until the agent reviews and approves every asset themselves. This
is a structural product guarantee, referenced in copy as "review-first," not merely a policy
statement.

## The Review-First Guarantee — exact scope

Source: `app/terms/page.tsx`. If the delivered package does not accurately reflect the approved
listing photos, the agent has 7 days from delivery to request a full refund, no questions asked.
This guarantee covers **accuracy to the source photos only**. It does not cover, and must never be
described as covering, any number of showings, inquiries, offers, or a faster sale — those outcomes
are explicitly outside the guarantee and outside the product's control.

Outside the accuracy guarantee, payments are non-refundable once final assets are delivered and
approved.

Revision rounds are part of the guarantee scope, not the refund: 1 round each for Proof and Story,
2 rounds for Signature. Revisions address accuracy/delivery issues within the original order's
scope — not a new creative direction.

## Business outcomes that must never be guaranteed

Per `docs/icp-audience-profile.md` §10, until real paid-customer evidence exists, never claim the
product:

- Drives more showings, inquiries, or offers
- Sells listings faster
- Wins more listing appointments
- Is accepted by every MLS or brokerage
- Is legally safe purely because it discloses AI use
- Looks indistinguishable from a real film crew's work
- Is something "agents want" as a settled fact
- Has a validated price

Safe claims: it starts from photos the agent already approved, produces a defined package (video,
narration, page, film), never requires a new property visit, and the agent reviews everything
before anything goes live.

## Demo disclosure requirement

The on-site example package (255 Eldon Ave, Columbus) is self-produced by the founder to
demonstrate realistic output. It must always be disclosed as a demo, not client work. Never let
copy or design implicitly suggest it is a real client result.

## Current customer-proof limitations

No real client testimonials or case studies exist yet. This is a known, tracked gap — not
something to paper over with implied or fabricated proof. Do not invent quotes, logos, review
scores, or "trusted by" claims.

## Photo-rights responsibility

Whoever took the listing photos usually owns them, even when the agent has permission to use them
for the listing — that permission does not automatically extend to turning the photos into a
video, script, and separate webpage. Per `HANDOFF.md`, this is currently covered inside `/terms`'
"Your responsibilities" section (agreed to at payment), not a separate checkout-flow checkbox.
Photo-rights confirmation is the agent's responsibility, not something Cinema Estate verifies or
assumes on their behalf.

## Brokerage-policy and MLS/disclosure responsibility

AI-enhanced visualization is disclosed plainly. Local MLS and brokerage rules still apply, and the
agent remains responsible for their own listing's compliance — Cinema Estate does not take that
responsibility away from them, and copy must never imply otherwise (e.g. never claim "accepted by
every MLS").

## AI-enhancement disclosure language

State plainly that AI is used for production assistance and that it does not invent or alter the
property. Do not soften or omit this disclosure to make output sound more like unassisted human
production, and do not oversell it as fully autonomous either.

## Claims that must never be invented

- Fabricated testimonials, case studies, customer counts, ratings, or "trusted by X agents" claims
- Fabricated authority badges or press mentions
- Fake scarcity or countdown timers
- Unsupported comparative claims (e.g. "better than any film crew")
- Unsupported legal claims (e.g. blanket MLS acceptance)
- Guarantees of showings, offers, faster sales, or sale price
- Any description of a free preview before payment (the shipped flow does not have one)
- Changed prices or package contents that don't trace back to `app/page.tsx`'s `tiers` array

## What belongs in HANDOFF.md / the implementation plan instead of here

Temporary operational status — Polar payout-account connection status, deployment issues, in-flight
internal tasks, sending-domain verification, welcome-email automation — is tracked in `HANDOFF.md`
and must never be encoded as a permanent product fact in this file or in public copy.
