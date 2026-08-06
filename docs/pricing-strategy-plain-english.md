# Cinema Estate Pricing Strategy — Plain English

*A rewrite of this session's pricing work in simple terms, ending with what I'll actually build next.*

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

## How it works (three steps)

1. **Drop in your listing URL or photos.**
2. **Review a free preview before you pay anything.**
3. **Approve it, and get your finished package within 48 hours.**

That's the whole process. No production appointment, no waiting on a crew's schedule.

---

## How I plan to implement this

The live site right now is a waitlist page, not a working checkout — so "implementing this" means updating what the page says, not building payments. Concretely, here's what I'd do next, as a separate follow-up once you sign off:

1. **Fix the price mismatch.** The live site currently says "Plans from $99 per listing" in two places (`app/page.tsx` hero line and the pricing section). That number predates this whole conversation and needs to change to reflect the $149 / $299 / $549 structure.
2. **Rewrite the pricing section** to introduce the three tiers, using the one-liner and three-step plan above instead of the current single price line.
3. **Add the rights-confirmation line to the FAQ.** The page already has a compliance-focused FAQ block (source photos, who approves what, how AI use is disclosed) — a rights-attestation question fits right in next to those.
4. **Update the existing "quality gate" section** ("Reviewed for the details that change trust") to state the finalized guarantee wording above, instead of its current vaguer language.
5. **Nothing here touches payment logic.** The form still just collects emails for the waitlist (via Sequenzy) — this is a content update, not a checkout build.
6. I'll hold off on making any of these edits until you've reviewed this document and given the go-ahead — that's a normal follow-up turn, not something to do inside this planning pass.
