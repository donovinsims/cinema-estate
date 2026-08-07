import type { ListingProfile, ReadinessResult } from "./types";

export function calculateReadinessScore(profile: ListingProfile): ReadinessResult {
  let foundationScore = 0; // max 25
  let presentationScore = 0; // max 25
  let distributionScore = 0; // max 20
  let sellerProfessionalismScore = 0; // max 15
  let launchPreparednessScore = 0; // max 15

  // Foundation (25)
  if (profile.photographyStatus === "Approved photography ready") foundationScore += 15;
  else if (profile.photographyStatus === "Photography scheduled") foundationScore += 10;

  if (profile.differentiators.length > 0) foundationScore += 5;
  if (profile.propertyNotes && profile.propertyNotes.trim().length > 10) foundationScore += 5;

  // Presentation (25)
  if (profile.assets.photography === "Ready") presentationScore += 10;
  else if (profile.assets.photography === "Planned") presentationScore += 5;

  if (profile.assets.propertyVideo === "Ready") presentationScore += 5;
  if (profile.assets.propertyPage === "Ready") presentationScore += 5;
  if (profile.assets.drone === "Ready" || profile.assets.floorPlan === "Ready") presentationScore += 5;

  // Distribution (20)
  const channelCount = profile.channels.length;
  if (channelCount >= 4) distributionScore += 20;
  else if (channelCount >= 2) distributionScore += 10;
  else if (channelCount === 1) distributionScore += 5;

  // Seller-facing professionalism (15)
  if (profile.assets.brandedAssets === "Ready") sellerProfessionalismScore += 5;
  else if (profile.assets.brandedAssets === "Planned") sellerProfessionalismScore += 3;

  if (profile.assets.print === "Ready") sellerProfessionalismScore += 5;
  if (profile.assets.social === "Ready") sellerProfessionalismScore += 5;

  // Launch preparedness (15)
  if (profile.launchTiming !== "Unsure") launchPreparednessScore += 5;

  if ((profile.launchTiming === "Within 48 hours" || profile.launchTiming === "Within 7 days") &&
      profile.photographyStatus !== "Approved photography ready") {
    launchPreparednessScore += 0;
  } else {
    launchPreparednessScore += 10;
  }

  foundationScore = Math.min(25, foundationScore);
  presentationScore = Math.min(25, presentationScore);
  distributionScore = Math.min(20, distributionScore);
  sellerProfessionalismScore = Math.min(15, sellerProfessionalismScore);
  launchPreparednessScore = Math.min(15, launchPreparednessScore);

  const totalScore = foundationScore + presentationScore + distributionScore + sellerProfessionalismScore + launchPreparednessScore;

  return {
    totalScore,
    categories: [
      { name: "Foundation", score: foundationScore, max: 25 },
      { name: "Presentation", score: presentationScore, max: 25 },
      { name: "Distribution", score: distributionScore, max: 20 },
      { name: "Professionalism", score: sellerProfessionalismScore, max: 15 },
      { name: "Preparedness", score: launchPreparednessScore, max: 15 },
    ],
  };
}
