const earlyAccessPresentations = Object.freeze({
  "early-access": Object.freeze({
    eyebrow: "Cinema Estate / Ask a question",
    title: "Not sure which package fits?",
    description: "Tell me about the listing and I’ll help you pick the right package — or buy directly from the pricing section anytime.",
    submit: "Send my question",
    success: "Got it — I’ll personally follow up about your listing. Ready to buy? Pricing is above anytime.",
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
