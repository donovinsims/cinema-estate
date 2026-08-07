import assert from "node:assert/strict";
import test from "node:test";

import { getEarlyAccessPresentation } from "../app/early-access-copy.mjs";

test("returns the exact evergreen ask-a-question presentation", () => {
  assert.deepEqual(getEarlyAccessPresentation("early-access"), {
    eyebrow: "Cinema Estate / Ask a question",
    title: "Not sure which package fits?",
    description: "Tell me about the listing and I’ll help you pick the right package — or buy directly from the pricing section anytime.",
    submit: "Send my question",
    success: "Got it — I’ll personally follow up about your listing. Ready to buy? Pricing is above anytime.",
  });
});

test("returns the exact listing-handoff presentation", () => {
  assert.deepEqual(getEarlyAccessPresentation("listing"), {
    eyebrow: "Cinema Estate / Listing handoff",
    title: "Send me your listing.",
    description: "Leave your email and I’ll follow up with the next step for sending the listing photos you already have.",
    submit: "Start the listing handoff",
    success: "Thanks — I’ll follow up with the next step for sending the listing photos you already have.",
  });
});
