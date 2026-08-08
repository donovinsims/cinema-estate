import type { ListingProfile, ReadinessResult, Recommendation } from "./types";
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

/**
 * Build a seller-facing summary grounded in the actual submitted profile — never asserts
 * assets exist (photography, video, page, marketing materials) unless the profile says so,
 * and never promises an outcome (showings, offers, sale speed, sale price) the deterministic
 * engine has no basis to predict.
 */
function buildSellerFacingSummary(profile: ListingProfile, readiness: ReadinessResult, recommendations: Recommendation[]): string {
  const propertyLabel = profile.propertyType.toLowerCase();
  const location = [profile.city, profile.state].filter((part) => part && part.trim().length > 0).join(", ");
  const locationPhrase = location ? ` in ${location}` : "";
  const criticalOpenCount = recommendations.filter(
    (r) => r.priority === "critical" && (r.status === "missing" || r.status === "blocked"),
  ).length;

  if (criticalOpenCount > 0) {
    return `This ${propertyLabel}${locationPhrase} has ${criticalOpenCount} critical marketing gap${criticalOpenCount === 1 ? "" : "s"} to resolve before launch. The plan below outlines what to prioritize first.`;
  }
  if (readiness.totalScore >= 70) {
    return `This ${propertyLabel}${locationPhrase} has a strong marketing foundation based on the details provided. The plan below outlines the remaining steps to round out the launch.`;
  }
  if (readiness.totalScore >= 40) {
    return `This ${propertyLabel}${locationPhrase} has a developing marketing foundation based on the details provided. The plan below outlines what to prioritize before launch.`;
  }
  return `This ${propertyLabel}${locationPhrase} is early in marketing preparation based on the details provided. The plan below outlines the critical steps to complete first.`;
}

/**
 * Build seller talking points that only assert what the submitted profile actually supports.
 * No claim of prepared photography/video/page/marketing appears unless the corresponding
 * asset status is "Ready" (or, for photography, the photography question was answered
 * "Approved photography ready"). No guaranteed-outcome language (showings, offers, sale
 * speed, sale price, "maximum visibility") is used — the engine has no basis to promise
 * results, only to describe current readiness.
 */
function buildSellerTalkingPoints(profile: ListingProfile, readiness: ReadinessResult): string[] {
  const points: string[] = [];

  const photoReady = profile.photographyStatus === "Approved photography ready" || profile.assets.photography === "Ready";
  const photoScheduled = profile.photographyStatus === "Photography scheduled";

  if (photoReady) {
    points.push("Professional photography is ready and can support the rest of the marketing package.");
  } else if (photoScheduled) {
    points.push("Photography is scheduled — the marketing package can move forward once it's delivered.");
  } else {
    points.push("Photography still needs to be completed before other listing marketing assets can be finalized.");
  }

  const videoReady = profile.assets.propertyVideo === "Ready";
  const pageReady = profile.assets.propertyPage === "Ready";
  if (videoReady && pageReady) {
    points.push("A property video and a dedicated listing page are both ready to support this launch.");
  } else if (videoReady) {
    points.push("A property video is ready to support this launch.");
  } else if (pageReady) {
    points.push("A dedicated listing page is ready to support this launch.");
  }

  if (profile.channels.length > 0) {
    points.push(`Distribution is planned across ${profile.channels.length} channel${profile.channels.length === 1 ? "" : "s"}: ${profile.channels.join(", ")}.`);
  } else {
    points.push("Distribution channels still need to be defined before launch.");
  }

  if (profile.differentiators.length > 0) {
    points.push(`The listing's standout features (${profile.differentiators.slice(0, 3).join(", ")}) are documented and ready to highlight.`);
  }

  if (readiness.totalScore >= 70) {
    points.push("Overall marketing readiness is strong heading into launch.");
  } else if (readiness.totalScore >= 40) {
    points.push("Marketing readiness is developing — a few more steps will round out the package.");
  } else {
    points.push("Marketing readiness is still early — the recommendations below outline what to prioritize first.");
  }

  return points;
}

/** Full plan generation — deterministic only. */
export function generateFullPlan(profile: ListingProfile) {
  const preview = generatePreview(profile);
  const { segment, score: readiness, recommendations, cinemaEstateFit } = preview;

  return {
    summary: `Based on the details provided, this ${profile.propertyType.toLowerCase()} listing has a readiness score of ${readiness.totalScore}/100.`,
    sellerFacingSummary: buildSellerFacingSummary(profile, readiness, recommendations),
    strengths: preview.strengths,
    gaps: preview.gaps,
    doNow: preview.doNow,
    readinessInterpretation: preview.readinessInterpretation,
    // Include both critical and recommended items — critical gaps (e.g. "Complete professional
    // photography first") must never be silently excluded from what happens before launch.
    beforeLaunch: recommendations.filter((r) => r.priority === "critical" || r.priority === "recommended").map((r) => r.title),
    launchPlan: profile.channels.map((ch) => `List on ${ch}`),
    afterLaunch: ["Review initial market response", "Adjust distribution if needed", "Follow up with interested buyers"],
    assetRecommendations: recommendations,
    sellerTalkingPoints: buildSellerTalkingPoints(profile, readiness),
    cinemaEstateFit,
    score: readiness,
    segment,
  };
}
