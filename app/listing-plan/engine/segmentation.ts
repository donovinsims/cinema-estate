import type { ListingProfile, PropertySegment } from "./types";

export function determineSegment(profile: ListingProfile): PropertySegment {
  if (profile.propertyType === "Land" || profile.propertyType === "Farm / acreage") {
    return "Land / Acreage";
  }

  if (profile.propertyType === "Multi-family") {
    return "Multi-family / Investment";
  }

  if (
    profile.propertyType === "Luxury residential" ||
    profile.priorities.primary === "Build a premium/luxury presentation" ||
    profile.differentiators.includes("Luxury finishes") ||
    profile.differentiators.includes("Historic character") ||
    profile.differentiators.includes("Waterfront") ||
    (profile.listPrice && profile.listPrice > 2_500_000)
  ) {
    return "Luxury / Distinctive";
  }

  if (
    (profile.listPrice && profile.listPrice > 1_000_000) ||
    profile.differentiators.includes("Architecture/design") ||
    profile.priorities.primary === "Showcase a distinctive property"
  ) {
    return "Premium Residential";
  }

  return "Standard Residential";
}
