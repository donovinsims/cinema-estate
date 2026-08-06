import assert from "node:assert/strict";
import test from "node:test";

import { getEarlyAccessPresentation } from "../app/early-access-copy.mjs";

test("returns the exact evergreen early-access presentation", () => {
  assert.deepEqual(getEarlyAccessPresentation("early-access"), {
    eyebrow: "Cinema Estate / Early access",
    title: "Get early access.",
    description: "See how your next approved listing can become a cinematic marketing package.",
    submit: "Get early access",
    success: "You’re on the early-access list. I’ll personally follow up with next steps — or see pricing and buy now below.",
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
