const earlyAccessPresentations = Object.freeze({
  "early-access": Object.freeze({
    eyebrow: "Cinema Estate / Early access",
    title: "Get early access.",
    description: "See how your next approved listing can become a cinematic marketing package.",
    submit: "Get early access",
    success: "You’re on the early-access list. I’ll personally follow up with next steps — or see pricing and buy anytime.",
  }),
  listing: Object.freeze({
    eyebrow: "Cinema Estate / Listing handoff",
    title: "Send me your listing.",
    description: "Leave your email and I’ll follow up with the next step for sending the listing photos you already have.",
    submit: "Start the listing handoff",
    success: "Thanks — I’ll follow up with the next step for sending the listing photos you already have.",
  }),
});

/**
 * @param {"early-access" | "listing"} [intent]
 */
export function getEarlyAccessPresentation(intent = "early-access") {
  return intent === "listing" ? earlyAccessPresentations.listing : earlyAccessPresentations["early-access"];
}
