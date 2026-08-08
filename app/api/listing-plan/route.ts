import { NextResponse } from "next/server";
import { generatePreview, generateFullPlan } from "../../listing-plan/engine/plan-builder";
import type { ListingProfile } from "../../listing-plan/engine/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_BODY_SIZE = 64 * 1024; // 64KB

// Sequenzy's documented REST API (https://docs.sequenzy.com/api-reference) — not the MCP
// tool surface, which only exists in an interactive agent session. The production app
// authenticates with its own SEQUENZY_API_KEY.
const SEQUENZY_API_BASE = "https://api.sequenzy.com/api/v1";

// New, listing-plan-specific marketing tags — never reuse the unrelated "Product Subscribers"
// list/tags that the early-access waitlist form uses.
const MARKETING_TAGS = ["lead-magnet", "listing-plan", "cinema-estate-prospect"];

type DeliveryResult = { ok: boolean; error?: string };

function deriveReadinessTier(score: number): string {
  return score >= 80 ? "Strong" : score >= 60 ? "Solid" : score >= 40 ? "Developing" : "Early";
}

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
  // Read body with a byte budget — not just content-length (which is absent for chunked
  // bodies and can be spoofed). A real 64KB cap is enforced on the actually-read buffer.
  let body: unknown;
  try {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > MAX_BODY_SIZE) return NextResponse.json({ error: "Request too large." }, { status: 413 });
    body = JSON.parse(new TextDecoder().decode(buf));
  } catch {
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
      ? (body as Record<string, unknown>).marketingConsent === true
      : false;

    if (!emailPattern.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

    // Run full plan generation (deterministic only)
    const plan = generateFullPlan(profile);

    // Transactional delivery — always attempted, regardless of marketing consent. A transactional
    // send may itself create/touch a Sequenzy subscriber record; that is not a marketing action.
    const transactionalResult = await sendTransactionalPlan(plan, email, profile);

    // Marketing subscriber (list/tag enrollment) — ONLY with explicit consent. This must never
    // run when marketingConsent is false, and must never touch the plan delivery outcome above.
    let marketingResult: DeliveryResult | null = null;
    if (marketingConsent) {
      marketingResult = await sendMarketingSubscriber(plan, email, profile);
    }

    return NextResponse.json({
      ...plan,
      // Truthful delivery state: "queued" means Sequenzy accepted the send (jobId returned);
      // inbox delivery is not confirmed server-side. The plan is always returned even on
      // failure, so the requester never loses their generated result.
      deliveryStatus: transactionalResult.ok ? "queued" : "failed",
      marketingSubscribed: marketingConsent ? Boolean(marketingResult?.ok) : false,
    });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}

/**
 * Build a plain HTML email body from the deterministic plan data. The email carries the
 * listing-plan content directly — no template dependency, no external asset requests.
 * This is the transactional delivery body, not a marketing message.
 */
function buildPlanEmailBody(plan: Record<string, unknown>, score: number, tier: string): string {
  const summary = typeof plan.sellerFacingSummary === "string" ? plan.sellerFacingSummary : "";
  const strengths = Array.isArray(plan.strengths) ? (plan.strengths as string[]).slice(0, 3) : [];
  const gaps = Array.isArray(plan.gaps) ? (plan.gaps as string[]).slice(0, 3) : [];
  const beforeLaunch = Array.isArray(plan.beforeLaunch) ? (plan.beforeLaunch as string[]) : [];
  const talkingPoints = Array.isArray(plan.sellerTalkingPoints) ? (plan.sellerTalkingPoints as string[]) : [];

  const listify = (items: string[]) =>
    items.length > 0 ? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : "<p><em>Nothing listed.</em></p>";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
<h1 style="font-size:1.4rem">Your Listing Marketing Plan</h1>
<p style="font-size:1.1rem;color:#555">Readiness Score: <strong>${score}/100</strong> &mdash; ${tier} foundation</p>
<p>${escapeHtml(summary)}</p>
${strengths.length > 0 ? `<h2 style="font-size:1.1rem;margin-top:24px">What's already working</h2>${listify(strengths)}` : ""}
${gaps.length > 0 ? `<h2 style="font-size:1.1rem;margin-top:24px">What still needs attention</h2>${listify(gaps)}` : ""}
${beforeLaunch.length > 0 ? `<h2 style="font-size:1.1rem;margin-top:24px">Before launch</h2>${listify(beforeLaunch)}` : ""}
${talkingPoints.length > 0 ? `<h2 style="font-size:1.1rem;margin-top:24px">Seller talking points</h2>${listify(talkingPoints)}` : ""}
<hr style="margin-top:32px;border:none;border-top:1px solid #eee">
<p style="font-size:.85rem;color:#888">Generated by <a href="https://cinema-estate.vercel.app">Cinema Estate</a> &mdash; free listing-marketing plan tool for agents.</p>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Send the requested plan transactionally via Sequenzy's transactional-send REST API
 * (https://docs.sequenzy.com/api-reference/transactional/send) in DIRECT-HTML mode — no
 * template dependency. This is the transactional delivery (not marketing) and runs on
 * every `?action=generate` call regardless of marketingConsent. Template mode can be a
 * later operational improvement once the template is provisioned and verified.
 */
async function sendTransactionalPlan(plan: Record<string, unknown>, email: string, profile: ListingProfile): Promise<DeliveryResult> {
  const apiKey = process.env.SEQUENZY_API_KEY;
  if (!apiKey) {
    console.error("listing-plan: SEQUENZY_API_KEY not configured — transactional plan not sent");
    return { ok: false, error: "not_configured" };
  }

  const score = (plan.score as { totalScore: number } | undefined)?.totalScore ?? 0;
  const tier = deriveReadinessTier(score);
  const cityState = [profile.city, profile.state].filter((part) => part && part.trim().length > 0).join(", ");
  const subject = `Your listing marketing plan — ${score}/100 readiness${cityState ? ` | ${cityState}` : ""}`;
  const body = buildPlanEmailBody(plan, score, tier);

  try {
    const res = await fetch(`${SEQUENZY_API_BASE}/transactional/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: email, subject, body }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`listing-plan: transactional send failed with status ${res.status}`);
      return { ok: false, error: `status_${res.status}` };
    }
    // A 2xx response means Sequenzy accepted/queued the send — inbox delivery is not
    // confirmed here (bounces, spam, etc. are downstream). The response carries a jobId
    // for tracking; capture it as a stable reference.
    const json = await res.json() as { emailSendId?: string };
    if (json.emailSendId) {
      console.info(`listing-plan: transactional send queued (jobId=${json.emailSendId})`);
    }
    return { ok: true };
  } catch (err) {
    console.error("listing-plan: transactional send threw", err instanceof Error ? err.message : "unknown error");
    return { ok: false, error: "network_error" };
  }
}

/**
 * Create/update a marketing subscriber in Sequenzy via the REST API
 * (https://docs.sequenzy.com/api-reference/subscribers/create) — ONLY called when
 * marketingConsent === true. Adds listing-plan-specific tags (auto-created by name if they
 * don't yet exist) and, if a dedicated list has been provisioned, enrolls the subscriber in it.
 * Never reuses the pre-existing "Product Subscribers" list.
 */
async function sendMarketingSubscriber(plan: Record<string, unknown>, email: string, profile: ListingProfile): Promise<DeliveryResult> {
  const apiKey = process.env.SEQUENZY_API_KEY;
  if (!apiKey) {
    console.error("listing-plan: SEQUENZY_API_KEY not configured — marketing subscriber not added");
    return { ok: false, error: "not_configured" };
  }

  const score = (plan.score as { totalScore: number } | undefined)?.totalScore ?? 0;
  const tier = deriveReadinessTier(score);
  const ceFit = (plan.cinemaEstateFit as { strength: string } | undefined)?.strength ?? "none";

  // Optional: a dedicated "Listing Plan Leads" list, provisioned separately (list creation
  // requires a Sequenzy scope this integration's tooling did not have — see HANDOFF.md). Tags
  // are passed by name and are auto-created by Sequenzy if they don't already exist.
  const listId = process.env.SEQUENZY_LISTING_PLAN_LIST_ID;

  try {
    const res = await fetch(`${SEQUENZY_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        tags: MARKETING_TAGS,
        lists: listId ? [listId] : [],
        customAttributes: {
          lead_source: "listing-plan",
          listing_readiness_score: score,
          listing_readiness_tier: tier,
          cinema_estate_fit: ceFit,
          property_type: profile.propertyType,
          state: profile.state,
          launch_timing: profile.launchTiming,
          photography_status: profile.photographyStatus,
        },
        duplicateStrategy: "merge",
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`listing-plan: marketing subscriber failed with status ${res.status}`);
      return { ok: false, error: `status_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("listing-plan: marketing subscriber threw", err instanceof Error ? err.message : "unknown error");
    return { ok: false, error: "network_error" };
  }
}
