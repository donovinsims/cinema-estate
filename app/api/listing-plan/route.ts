import { NextResponse } from "next/server";
import { generatePreview, generateFullPlan } from "../../listing-plan/engine/plan-builder";
import type { ListingProfile } from "../../listing-plan/engine/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_BODY_SIZE = 64 * 1024; // 64KB

/** Shared input validation for both preview and generate endpoints. */
function parseProfile(body: unknown): { profile: ListingProfile | null; error: string | null } {
  if (typeof body !== "object" || body === null) return { profile: null, error: "Invalid request body." };

  const raw = body as Record<string, unknown>;

  // Validate required fields
  if (!raw.propertyType || typeof raw.propertyType !== "string") return { profile: null, error: "Property type is required." };
  if (!raw.listingStatus || typeof raw.listingStatus !== "string") return { profile: null, error: "Listing status is required." };
  if (!raw.launchTiming || typeof raw.launchTiming !== "string") return { profile: null, error: "Launch timing is required." };

  // Sanitize free-text fields to prevent prompt injection
  const sanitize = (val: unknown, maxLen = 500): string =>
    typeof val === "string" ? val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").slice(0, maxLen) : "";

  const profile: ListingProfile = {
    propertyType: sanitize(raw.propertyType, 50) as ListingProfile["propertyType"],
    listPrice: typeof raw.listPrice === "number" && raw.listPrice > 0 ? raw.listPrice : undefined,
    city: sanitize(raw.city, 100),
    state: sanitize(raw.state, 50),
    listingStatus: sanitize(raw.listingStatus, 50) as ListingProfile["listingStatus"],
    launchTiming: sanitize(raw.launchTiming, 50) as ListingProfile["launchTiming"],
    differentiators: Array.isArray(raw.differentiators)
      ? raw.differentiators.filter((d): d is string => typeof d === "string").map((d) => sanitize(d, 200)).slice(0, 10)
      : [],
    propertyNotes: sanitize(raw.propertyNotes, 500),
    assets: {
      photography: (sanitize((raw.assets as Record<string, unknown> | undefined)?.photography ?? raw.photographyStatus, 50) || "Not planned") as ListingProfile["assets"]["photography"],
      floorPlan: (sanitize((raw.assets as Record<string, unknown> | undefined)?.floorPlan, 50) || "Not planned") as ListingProfile["assets"]["floorPlan"],
      propertyVideo: (sanitize((raw.assets as Record<string, unknown> | undefined)?.propertyVideo, 50) || "Not planned") as ListingProfile["assets"]["propertyVideo"],
      drone: (sanitize((raw.assets as Record<string, unknown> | undefined)?.drone, 50) || "Not planned") as ListingProfile["assets"]["drone"],
      propertyPage: (sanitize((raw.assets as Record<string, unknown> | undefined)?.propertyPage, 50) || "Not planned") as ListingProfile["assets"]["propertyPage"],
      social: (sanitize((raw.assets as Record<string, unknown> | undefined)?.social, 50) || "Not planned") as ListingProfile["assets"]["social"],
      email: (sanitize((raw.assets as Record<string, unknown> | undefined)?.email, 50) || "Not planned") as ListingProfile["assets"]["email"],
      print: (sanitize((raw.assets as Record<string, unknown> | undefined)?.print, 50) || "Not planned") as ListingProfile["assets"]["print"],
      openHouse: (sanitize((raw.assets as Record<string, unknown> | undefined)?.openHouse, 50) || "Not planned") as ListingProfile["assets"]["openHouse"],
      brandedAssets: (sanitize((raw.assets as Record<string, unknown> | undefined)?.brandedAssets, 50) || "Not planned") as ListingProfile["assets"]["brandedAssets"],
    },
    channels: (Array.isArray(raw.channels)
      ? raw.channels.filter((c): c is string => typeof c === "string").map((c) => sanitize(c, 50)).slice(0, 10)
      : []) as ListingProfile["channels"],
    priorities: {
      primary: (sanitize((raw.priorities as Record<string, unknown> | undefined)?.primary, 100) || "Present the listing professionally") as ListingProfile["priorities"]["primary"],
      secondary: sanitize((raw.priorities as Record<string, unknown> | undefined)?.secondary, 100) as ListingProfile["priorities"]["secondary"] || undefined,
    },
    marketingSupport: sanitize(raw.marketingSupport, 30) as ListingProfile["marketingSupport"] || "No",
    photographyStatus: sanitize(raw.photographyStatus, 50) as ListingProfile["photographyStatus"] || "Unsure",
  };

  return { profile, error: null };
}

export async function POST(request: Request) {
  // Check content-length early
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_SIZE) return NextResponse.json({ error: "Request too large." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  // Honeypot
  const honeypot = typeof body === "object" && body !== null ? String((body as Record<string, unknown>).website ?? "").trim() : "";
  if (honeypot) return NextResponse.json({ ok: true });

  const { profile, error } = parseProfile(body);
  if (!profile) return NextResponse.json({ error }, { status: 400 });

  if (action === "preview") {
    const preview = generatePreview(profile);
    return NextResponse.json(preview);
  }

  if (action === "generate") {
    const email = typeof body === "object" && body !== null
      ? String((body as Record<string, unknown>).email ?? "").trim().toLowerCase()
      : "";

    const marketingConsent = typeof body === "object" && body !== null
      ? Boolean((body as Record<string, unknown>).marketingConsent)
      : false;

    if (!emailPattern.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

    // Run full plan generation (deterministic only)
    const plan = generateFullPlan(profile);

    // Send transactional email via Sequenzy
    await sendTransactionalPlan(plan, email, profile);

    // Marketing subscriber (only with explicit consent)
    if (marketingConsent) {
      await sendMarketingSubscriber(plan, email, profile);
    }

    return NextResponse.json(plan);
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}

/**
 * Send the requested plan transactionally via Sequenzy form endpoint.
 * This is the transactional delivery — not marketing.
 */
async function sendTransactionalPlan(plan: Record<string, unknown>, email: string, profile: ListingProfile) {
  const endpoint = process.env.SEQUENZY_FORM_ENDPOINT;
  if (!endpoint) {
    console.error("SEQUENZY_FORM_ENDPOINT not configured — transactional plan not sent");
    return;
  }

  const score = (plan.score as { totalScore: number })?.totalScore ?? 0;
  const tier = score >= 80 ? "Strong" : score >= 60 ? "Solid" : score >= 40 ? "Developing" : "Early";

  const formData = new FormData();
  formData.set("email", email);
  formData.set("website", "");
  // Pass plan data as form fields for the Sequenzy form to capture
  formData.set("plan_readiness_score", String(score));
  formData.set("plan_readiness_tier", tier);
  formData.set("plan_property_type", profile.propertyType);
  formData.set("plan_generated_at", new Date().toISOString());

  try {
    const res = await fetch(endpoint, { method: "POST", body: formData, cache: "no-store" });
    if (!res.ok) console.error("Sequenzy transactional delivery failed:", res.status);
  } catch (err) {
    console.error("Sequenzy transactional delivery error:", err);
  }
}

/**
 * Create/update marketing subscriber in Sequenzy (only with explicit consent).
 */
async function sendMarketingSubscriber(plan: Record<string, unknown>, email: string, profile: ListingProfile) {
  const endpoint = process.env.SEQUENZY_FORM_ENDPOINT;
  if (!endpoint) return;

  const score = (plan.score as { totalScore: number })?.totalScore ?? 0;
  const tier = score >= 80 ? "Strong" : score >= 60 ? "Solid" : score >= 40 ? "Developing" : "Early";
  const ceFit = (plan.cinemaEstateFit as { strength: string })?.strength ?? "none";

  const formData = new FormData();
  formData.set("email", email);
  formData.set("website", "");
  // Marketing opt-in tags/attributes
  formData.set("tags", "lead-magnet,listing-plan,cinema-estate-prospect");
  formData.set("lead_source", "listing-plan");
  formData.set("listing_readiness_score", String(score));
  formData.set("listing_readiness_tier", tier);
  formData.set("cinema_estate_fit", ceFit);
  formData.set("property_type", profile.propertyType);
  formData.set("state", profile.state);
  formData.set("launch_timing", profile.launchTiming);
  formData.set("photography_status", profile.photographyStatus);
  formData.set("plan_generated_at", new Date().toISOString());

  try {
    const res = await fetch(endpoint, { method: "POST", body: formData, cache: "no-store" });
    if (!res.ok) console.error("Sequenzy marketing subscriber failed:", res.status);
  } catch (err) {
    console.error("Sequenzy marketing subscriber error:", err);
  }
}
