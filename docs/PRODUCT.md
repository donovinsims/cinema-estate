# Cinema Estate — Product Overview

*Last updated: 2026-08-06*

This is the canonical answer to "what is this, why does it exist, and who is it for." Other docs (`HANDOFF.md`, plan files under `docs/superpowers/plans/`) assume this context; read it first in a new session before touching product copy or positioning.

## What it is

Cinema Estate turns a real-estate listing's **already-approved photography** into a four-part cinematic marketing package:

1. **Video tours** — slow cinematic camera-move sequences generated from the photos the agent supplies.
2. **Narration** — a listing story shaped around the real property.
3. **Listing page** — one focused destination to share with prospective buyers.
4. **Final film** — the complete, ready-to-review marketing package.

The listing's real, approved photos remain the source throughout. Cinema Estate does not invent rooms, move walls, replace finishes, or otherwise change what the property is — it adds motion, narration, and packaging to work the agent has already shot and approved. Nothing publishes until the agent reviews and approves the assets.

Today the site is a pre-revenue marketing/waitlist page (`https://cinema-estate.vercel.app`): visitors leave an email through an early-access form, not a purchase. The on-site demo package (255 Eldon Ave, Columbus) is self-produced to show a realistic example of the work — it is explicitly disclosed as a demo, not client work, and there are no client testimonials or case studies yet.

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

- **Pricing:** not finalized, not published. No price appears anywhere on the live site.
- **Checkout:** not built. There is no payment integration in the codebase; checkout is planned through Polar (polar.sh), pending product/checkout links from the owner.
- **Proof:** no real client testimonials or case studies exist yet — the demo package on the site is self-made and disclosed as such. This is a known, tracked gap (see `HANDOFF.md`'s "Blocked on owner input"), not an oversight.
- **Distribution today:** an early-access/waitlist funnel (email capture via Sequenzy) is the only live conversion path.

See `HANDOFF.md` for current implementation status and `docs/superpowers/plans/2026-08-06-cinema-estate-sales-page-readiness.md` for what's actionable next versus what's blocked on the owner.
