import type { ListingProfile, Recommendation, RecommendationStatus } from "./types";

export function generateRecommendations(profile: ListingProfile): Recommendation[] {
  const recs: Recommendation[] = [];

  const photoReady = profile.photographyStatus === "Approved photography ready" || profile.assets.photography === "Ready";
  const photoMissing = profile.photographyStatus === "Photography not arranged";

  // Photography
  if (photoMissing || profile.assets.photography === "Not planned") {
    recs.push({
      id: "rec-photo-1",
      category: "photography",
      priority: "critical",
      title: "Complete professional photography first",
      reason: "Several downstream marketing assets depend on strong approved listing imagery.",
      trigger: "Photography not ready",
      status: "missing" as RecommendationStatus,
    });
  } else if (profile.assets.photography === "Ready") {
    recs.push({
      id: "rec-photo-2",
      category: "photography",
      priority: "optional",
      title: "Photography is ready",
      reason: "You have professional photos ready for distribution.",
      trigger: "Photography ready",
      status: "complete" as RecommendationStatus,
    });
  }

  // Video
  if (profile.assets.propertyVideo !== "Ready") {
    const isLand = profile.propertyType === "Land" || profile.propertyType === "Farm / acreage";
    if (!isLand) {
      recs.push({
        id: "rec-video-1",
        category: "video",
        priority: photoReady ? "recommended" : "optional",
        title: "Add a visual storytelling layer",
        reason: "Video creates stronger emotional engagement and stops the scroll on social media.",
        trigger: "No property video",
        status: (photoReady ? (profile.assets.propertyVideo === "Planned" ? "planned" : "missing") : "blocked") as RecommendationStatus,
      });
    }
  }

  // Property Page
  if (profile.assets.propertyPage !== "Ready" && profile.assets.propertyPage !== "Not applicable") {
    recs.push({
      id: "rec-page-1",
      category: "destination",
      priority: "recommended",
      title: "Create one focused destination for the listing",
      reason: "A single property page removes distractions and gives you a single link to share everywhere.",
      trigger: "No property page",
      status: (profile.assets.propertyPage === "Planned" ? "planned" : "missing") as RecommendationStatus,
    });
  }

  // Social
  if (profile.assets.social !== "Ready" && profile.assets.social !== "Not applicable") {
    recs.push({
      id: "rec-social-1",
      category: "social",
      priority: "recommended",
      title: "Prepare social launch content",
      reason: "Social media is critical for reaching local buyers and impressing your seller.",
      trigger: "No social content",
      status: (photoReady ? (profile.assets.social === "Planned" ? "planned" : "missing") : "blocked") as RecommendationStatus,
    });
  }

  // Distribution
  if (profile.channels.length === 0) {
    recs.push({
      id: "rec-dist-1",
      category: "distribution",
      priority: "critical",
      title: "Define your distribution channels",
      reason: "You need a plan for where this listing will be seen.",
      trigger: "No channels selected",
      status: "missing" as RecommendationStatus,
    });
  }

  return recs;
}
