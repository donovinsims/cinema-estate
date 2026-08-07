export type PropertyType =
  | "Single-family"
  | "Condo"
  | "Townhome"
  | "Multi-family"
  | "Land"
  | "Farm / acreage"
  | "Luxury residential"
  | "Other residential";

export type ListingStatus = "Preparing to list" | "Coming soon" | "Active" | "Back on market" | "Other";

export type LaunchTiming = "Within 48 hours" | "Within 7 days" | "Within 14 days" | "Within 30 days" | "More than 30 days" | "Unsure";

export type AssetStatus = "Ready" | "Planned" | "Not planned" | "Not sure" | "Not applicable";

export type MarketingChannel =
  | "MLS"
  | "Portal syndication"
  | "Instagram"
  | "Facebook"
  | "YouTube"
  | "Email database"
  | "Agent website"
  | "Single-property page"
  | "Print"
  | "Open house"
  | "Paid social"
  | "Brokerage network"
  | "Other";

export type MarketingPriority =
  | "Present the listing professionally"
  | "Give the seller confidence in my marketing"
  | "Create stronger social content"
  | "Create more reusable listing assets"
  | "Showcase a distinctive property"
  | "Build a premium/luxury presentation"
  | "Reduce production coordination"
  | "Prepare a complete launch quickly"
  | "Other";

export type MarketingSupport = "Yes" | "No" | "Sometimes / outsourced";

export type PhotographyStatus = "Approved photography ready" | "Photography scheduled" | "Photography not arranged" | "Unsure";

export type ListingProfile = {
  propertyType: PropertyType;
  listPrice?: number;
  city: string;
  state: string;
  listingStatus: ListingStatus;
  launchTiming: LaunchTiming;
  differentiators: string[];
  propertyNotes?: string;
  assets: {
    photography: AssetStatus;
    floorPlan: AssetStatus;
    propertyVideo: AssetStatus;
    drone: AssetStatus;
    propertyPage: AssetStatus;
    social: AssetStatus;
    email: AssetStatus;
    print: AssetStatus;
    openHouse: AssetStatus;
    brandedAssets: AssetStatus;
  };
  channels: MarketingChannel[];
  priorities: {
    primary: MarketingPriority;
    secondary?: MarketingPriority;
  };
  marketingSupport: MarketingSupport;
  photographyStatus: PhotographyStatus;
};

export type RecommendationCategory = "photography" | "video" | "destination" | "social" | "distribution" | "print" | "strategy";
export type RecommendationPriority = "critical" | "recommended" | "optional";
export type RecommendationStatus = "ready" | "planned" | "missing" | "blocked" | "complete";

export type Recommendation = {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  title: string;
  reason: string;
  trigger: string;
  status: RecommendationStatus;
};

export type CinemaEstateFit = {
  relevant: boolean;
  strength: "none" | "possible" | "strong";
  reason: string;
};

export type PropertySegment =
  | "Standard Residential"
  | "Premium Residential"
  | "Luxury / Distinctive"
  | "Land / Acreage"
  | "Multi-family / Investment";

export type ScoreCategory = {
  name: string;
  score: number;
  max: number;
};

export type ReadinessResult = {
  totalScore: number;
  categories: ScoreCategory[];
};
