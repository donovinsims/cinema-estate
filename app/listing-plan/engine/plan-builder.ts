import type { ListingProfile } from "./types";
import { determineSegment } from "./segmentation";
import { calculateReadinessScore } from "./scoring";
import { generateRecommendations } from "./recommendations";
import { determineCinemaEstateFit } from "./cinema-estate-fit";

/** Run the deterministic engine — returns preview data. */
export function generatePreview(profile: ListingProfile) {
  const segment = determineSegment(profile);
  const readiness = calculateReadinessScore(profile);
  const recommendations = generateRecommendations(profile);
  const cinemaEstateFit = determineCinemaEstateFit(profile);

  const strengths: string[] = [];
  if (profile.differentiators.length > 0) strengths.push(`Notable features: ${profile.differentiators.slice(0, 3).join(", ")}`);
  if (readiness.categories[0].score >= 15) strengths.push("Photography foundation is strong");
  if (readiness.categories[1].score >= 18) strengths.push("Presentation assets are well-prepared");
  if (readiness.categories[2].score >= 15) strengths.push("Distribution channels are well-defined");

  const gaps = recommendations.filter((r) => r.status === "missing" || r.status === "blocked").map((r) => r.title);
  const doNow = recommendations.filter((r) => r.priority === "critical").map((r) => r.title);

  let readinessInterpretation: string;
  if (readiness.totalScore >= 80) readinessInterpretation = "Your listing marketing is strong — you're well-prepared to launch with confidence.";
  else if (readiness.totalScore >= 60) readinessInterpretation = "You have a solid foundation. A few targeted improvements will make your launch even stronger.";
  else if (readiness.totalScore >= 40) readinessInterpretation = "There are several gaps worth addressing before launch to present this listing at its best.";
  else readinessInterpretation = "Your listing needs significant marketing preparation. Focus on the critical steps below before launch.";

  return {
    score: readiness,
    segment,
    strengths,
    gaps,
    doNow,
    readinessInterpretation,
    cinemaEstateFit,
    recommendations,
  };
}

/** Full plan generation — deterministic only. */
export function generateFullPlan(profile: ListingProfile) {
  const preview = generatePreview(profile);
  const { segment, score: readiness, recommendations, cinemaEstateFit } = preview;

  return {
    summary: `Based on the details provided, this ${profile.propertyType.toLowerCase()} listing has a readiness score of ${readiness.totalScore}/100.`,
    sellerFacingSummary: `We have a structured marketing approach ready for your ${profile.propertyType.toLowerCase()}, focusing on the unique aspects of the property.`,
    strengths: preview.strengths,
    gaps: preview.gaps,
    doNow: preview.doNow,
    readinessInterpretation: preview.readinessInterpretation,
    beforeLaunch: recommendations.filter((r) => r.priority === "recommended").map((r) => r.title),
    launchPlan: profile.channels.map((ch) => `List on ${ch}`),
    afterLaunch: ["Review initial market response", "Adjust distribution if needed", "Follow up with interested buyers"],
    assetRecommendations: recommendations,
    sellerTalkingPoints: [
      "Professional photography and marketing materials have been prepared for this listing.",
      "A targeted launch plan ensures maximum visibility across key channels.",
      "The listing is positioned to stand out with a complete visual and written presentation.",
    ],
    cinemaEstateFit,
    score: readiness,
    segment,
  };
}
