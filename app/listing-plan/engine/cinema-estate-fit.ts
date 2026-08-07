import type { ListingProfile, CinemaEstateFit } from "./types";

export function determineCinemaEstateFit(profile: ListingProfile): CinemaEstateFit {
  const photoReady = profile.photographyStatus === "Approved photography ready" || profile.assets.photography === "Ready";

  if (!photoReady) {
    return {
      relevant: false,
      strength: "none",
      reason: "Professional photography is not yet available.",
    };
  }

  const wantsPremium = profile.priorities.primary === "Build a premium/luxury presentation" ||
                       profile.priorities.secondary === "Build a premium/luxury presentation";

  const wantsSocial = profile.priorities.primary === "Create stronger social content";
  const wantsReduceCoordination = profile.priorities.primary === "Reduce production coordination";

  const lacksVideo = profile.assets.propertyVideo !== "Ready";
  const lacksPage = profile.assets.propertyPage !== "Ready";

  if (lacksVideo || lacksPage || wantsSocial) {
    if (wantsPremium || wantsReduceCoordination) {
      return {
        relevant: true,
        strength: "strong",
        reason: "You have photography ready but need a stronger visual presentation without coordinating another shoot.",
      };
    }
    return {
      relevant: true,
      strength: "possible",
      reason: "You can turn your existing photography into a complete visual package.",
    };
  }

  return {
    relevant: false,
    strength: "none",
    reason: "Your marketing package already appears highly complete.",
  };
}
