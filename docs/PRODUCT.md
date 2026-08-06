# Cinema Estate — Product Overview

*Last updated: 2026-08-06 (revised same day — pricing launched and checkout wired since the first version of this doc)*

This is the canonical answer to "what is this, why does it exist, and who is it for." Other docs (`HANDOFF.md`, plan files under `docs/superpowers/plans/`) assume this context; read it first in a new session before touching product copy or positioning.

## What it is

Cinema Estate turns a real-estate listing's **already-approved photography** into a four-part cinematic marketing package:

1. **Video tours** — slow cinematic camera-move sequences generated from the photos the agent supplies.
2. **Narration** — a listing story shaped around the real property.
3. **Listing page** — one focused destination to share with prospective buyers.
4. **Final film** — the complete, ready-to-review marketing package.

The listing's real, approved photos remain the source throughout. Cinema Estate does not invent rooms, move walls, replace finishes, or otherwise change what the property is — it adds motion, narration, and packaging to work the agent has already shot and approved. Nothing publishes until the agent reviews and approves the assets.

The site (`https://cinema-estate.vercel.app`) now sells three one-time, per-listing packages directly — Proof ($149), Story ($299, the recommended tier), and Signature ($549, luxury/high-stakes listings only) — each with a real "Buy" button linking to a live Polar checkout. An early-access email form still exists alongside it for visitors who aren't ready to buy. The on-site demo package (255 Eldon Ave, Columbus) is self-produced to show a realistic example of the work — it is explicitly disclosed as a demo, not client work, and there are no client testimonials or case studies yet.

## Why it exists

The founder (Donovin Sims, Northern Illinois) talked with 15-20 individual real-estate agents over the course of a year and kept hearing the same tradeoff:

- **Static listing photos** are accurate and already approved, but they don't drive showings — they show a room one frame at a time and don't move.
- **Real video** fixes that, but means booking a crew, coordinating property access, and running another production schedule — roughly a week of added lead time — for every single listing, on top of an already busy schedule.

Cinema Estate exists to give agents a **third option**: a stronger visual story built entirely from work they've already approved, with the AI production work handling the repetitive parts behind the motion, narration, listing page, and final film. No reshoot, no crew to book, no property-access schedule to coordinate.

Two specific fears shape the product's design and public commitments, and any future copy or feature work should keep resolving them, not create new versions of them:

- **Looking gimmicky or fake.** The product's answer is structural, not just a claim: the real photos stay the source, nothing is invented or altered, and the agent approves every asset before anything goes live.
- **MLS / disclosure trouble from AI-enhanced media.** The product's answer: AI-enhanced visualization is disclosed, local MLS and brokerage rules still apply, and the agent remains responsible for their own listing requirements — Cinema Estate doesn't take that responsibility away from them.

## Who it's for

**Individual real estate agents** — not brokerages, not marketing teams, not agents without their own approved listing photography yet. The best-fit buyer:

- Already has listing photos shot and approved (Cinema Estate is not a photography service).
- Is marketing a listing solo or near-solo, without an in-house production team or budget for a videographer on every listing.
- Wants stronger marketing on a listing without adding another production commitment (crew, access scheduling, a week of lead time) to an already busy workload.
- Cares about staying inside their MLS's and brokerage's disclosure rules, and needs to trust that the output won't look fake or get them in trouble before they'll use it on a live listing.

Explicitly **not** the target today: brokerages or teams buying at scale, agents without existing approved photography, or anyone looking for a tool that redesigns or stages the property itself rather than marketing the real one.

## Where the business model stands today

- **Pricing:** finalized and live. Three one-time, per-listing tiers — Proof $149, Story $299 (recommended), Signature $549 (luxury/distinctive listings only) — not a subscription. Delivery is committed at 24 hours from receipt of approved photos and listing details.
- **Guarantee:** the Review-First Guarantee — nothing publishes until the agent approves it, and a full refund within 7 days if the result doesn't match the approved photos. It explicitly does not promise showings, faster sales, or more offers. Full terms, revisions policy, and refund conditions are published at `/terms` (not yet reviewed by a lawyer — drafted at the owner's request; flagged for legal review before high-volume launch).
- **Checkout:** live. Each pricing tier's "Buy" button links directly to a real, working Polar checkout page (`app/CheckoutButton.tsx`). **Important caveat: no payout account is connected in Polar yet.** A customer can complete a real charge today, but the business cannot yet receive that money — connecting a payout account (Finance → Account in Polar) is the single most urgent open item, ahead of any further copy or growth work.
- **Proof:** no real client testimonials or case studies exist yet — the demo package on the site is self-made and disclosed as such. This is a known, tracked gap, not an oversight.
- **ICP:** documented in `docs/icp-audience-profile.md` — a research-derived (not yet customer-validated) profile of the primary buyer: an independent or near-solo listing agent handling roughly 8-20 seller-side listings a year, who already pays for professional photography and has no in-house media team.
- **Distribution today:** both the three-tier checkout above and the original early-access/waitlist funnel (email capture via Sequenzy) are live side by side.

See `HANDOFF.md` for full implementation history, the Polar setup details, and the current "Blocked on owner input" list — the payout account is now the top item.
