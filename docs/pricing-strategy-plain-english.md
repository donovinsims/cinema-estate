# Cinema Estate Pricing Strategy — Plain English

*A rewrite of this session's pricing work in simple terms, ending with what I'll actually build next.*

> **Status — live as of 2026-08-06.** Everything below was a proposal when this doc was written; the owner approved it and it's now implemented and live on the site, including real Polar checkout. Two details changed on implementation, corrected inline below: turnaround is **24 hours**, not 48, and checkout does **not** include a free-preview-before-paying step — the agent pays first, then submits photos, per the guarantee flow described in "What's live now" at the bottom. See `HANDOFF.md`'s "Pricing launch closeout" and "Polar checkout wired" sections for full implementation detail; see `docs/PRODUCT.md` for the current one-page summary.

---

## The one-liner

**We help solo listing agents who can't justify booking a film crew turn photos they already have into a premium marketing package — so they look like the best-marketed agent in the room, every time they pitch a new seller.**

Say that out loud once and you can repeat it. That's the test. Everything below just unpacks it.

---

## What we're selling, and to whom

Three packages, all built from photos the agent already has and already got approved. No new photo shoot, ever.

| Package | Price | What's in it |
|---|---|---|
| **Proof** | $149 | A shorter film, both branded and unbranded versions, a hosted page, one round of changes |
| **Story** (the one to lead with) | $299 | A longer narrated film, a script written from the real listing facts, a teaser cut for social, a full listing page, one round of changes |
| **Signature** | $549 | Everything in Story, plus a custom voice option, multiple social cuts, and two rounds of changes — **only offered on luxury, unusual, or high-stakes listings**, not as a default upsell |

Sold one at a time, per listing. Not a subscription. An agent buys it when they have a listing that deserves it, not every month whether they need it or not.

---

## Why these three prices, and not others

Two completely different ways of checking arrived at the same three numbers, which is a good sign:

1. **What else is out there.** Cheap AI tools that just animate photos cost $10–$40. A real film crew costs $600–$1,650. Our packages sit in the gap between those two — cheaper than a crew, but clearly more than a $15 photo animator, because it does more than either one.
2. **What a market-research report on this exact product independently recommended.** Working from real competitor prices and real agent behavior, it landed on the same $149 / $299 / $549 numbers, with the same warning: nobody's actually paid these prices yet, so treat them as a strong starting point, not gospel.

We are not trying to be the cheapest option. We're not trying to be the most expensive either. We're the only one in the middle that's actually reviewed by a person and checked against the real facts before it goes out — that's the whole reason the price is defensible.

---

## What actually makes someone want to buy this

Not "it has AI in it." Not "it looks cinematic." The real hook is simpler:

**Every listing an agent markets is also an audition for their next listing.** A seller picking an agent looks at how that agent has marketed properties before. An agent showing up with a package like this looks like they have a marketing team behind them — even if it's just them and their phone. That's the thing worth paying for: not "this house sells faster," but "I look like the agent who takes this seriously."

Three things make this defensible instead of just another AI gimmick:

- **We check who you are.** The listing page automatically pulls and verifies the agent's real name, brokerage, license, and contact info — nobody else in this price range does that.
- **A second, independent pass checks the work before it ships.** Wrong facts, invented details, or anything misleading gets caught and blocked — it doesn't just get generated and handed over.
- **We stay inside the rules.** Real-estate advertising has real legal guardrails (Fair Housing, MLS rules, "no misleading images"). We build inside those, not around them.

---

## The safety net

If you approve the preview and the final result doesn't actually match the real photos you gave us, you get your money back. Full stop.

We do **not** promise your listing will sell faster, get more showings, or get more offers — nobody can honestly promise that, and we're not going to pretend otherwise. The guarantee covers what we control (did we build what we said we'd build), not what we don't (whether a buyer shows up).

---

## The one catch we have to handle

Here's something easy to miss: **whoever took the listing photos usually owns them**, even if the agent has full permission to use them for the listing. That permission doesn't automatically extend to us turning those photos into a video, a script, and a separate webpage.

So at checkout, the agent has to confirm they're allowed to use their photos this way. It's one checkbox, not a legal maze — but skipping it isn't an option. Done right, this is actually a selling point: it signals we take this seriously when a lot of competitors don't even ask.

---

## How it works (as originally proposed — see correction below)

1. **Drop in your listing URL or photos.**
2. **Review a free preview before you pay anything.**
3. **Approve it, and get your finished package within 48 hours.**

That's the whole process. No production appointment, no waiting on a crew's schedule.

**This is not exactly what shipped.** The free-preview-before-paying step wasn't built — Polar checkout doesn't support that flow, and building a custom preview-then-pay system was out of scope for the launch. What's actually live: the agent pays first (real Polar checkout), submits approved photos, gets the package within 24 hours, and reviews every asset before anything publishes — with a full refund within 7 days if the result doesn't match the submitted photos (the Review-First Guarantee, published in full at `/terms`). The risk this step was meant to cover — "will it look fake before I've paid" — ended up covered by the refund guarantee instead of a pre-payment preview.

---

## What's live now (2026-08-06)

Everything in "How I plan to implement this" (the original version of this section) has shipped:

1. ~~Fix the price mismatch~~ — done. The site now shows the real $149 / $299 / $549 tiers in the hero and a dedicated pricing section, not the old placeholder $99 line.
2. ~~Rewrite the pricing section~~ — done. Three tier cards (Proof, Story, Signature) with what's included, each with a real "Buy" button.
3. **Rights confirmation didn't become an FAQ question** — instead it's covered in `/terms`' "Your responsibilities" section, which the customer agrees to by paying. No separate checkout-flow checkbox exists (Polar's hosted checkout doesn't expose a custom-checkbox field we've configured) — worth revisiting if this turns out to need to be more explicit than "covered in the terms you agreed to."
4. ~~Update the guarantee wording~~ — done, and named: "The Review-First Guarantee," with concrete refund terms, live at `/terms` and linked from the pricing section.
5. ~~Nothing here touches payment logic~~ — superseded. Real Polar checkout is now wired (`app/CheckoutButton.tsx`); this was a deliberate later phase, not part of the original pricing-copy launch. See `HANDOFF.md`'s "Polar checkout wired" section — payments work end-to-end except settlement, since no payout account is connected yet.
6. Turnaround shipped as **24 hours**, not the 48 hours floated above — the owner approved the faster number when giving the go-ahead.
