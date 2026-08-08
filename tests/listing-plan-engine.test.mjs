import assert from "node:assert/strict";
import test from "node:test";
// The engine modules are plain .ts files (no build step, mirroring comparison-state.mjs's
// no-build-needed pattern) but cross-import each other without file extensions, which Node's
// native TS type-stripping resolver won't follow. Register tsx's resolver (already present in
// node_modules via the toolchain) for this file only, then import dynamically so the
// registration takes effect before resolution happens.
const { register } = await import("tsx/esm/api");
register();

const { generatePreview, generateFullPlan } = await import("../app/listing-plan/engine/plan-builder.ts");
const { determineSegment } = await import("../app/listing-plan/engine/segmentation.ts");
const { determineCinemaEstateFit } = await import("../app/listing-plan/engine/cinema-estate-fit.ts");

// Unsupported-outcome / unsupported-asset language must never appear anywhere in generated copy —
// the engine is deterministic and has no basis to promise results or assert assets it wasn't told exist.
const UNSUPPORTED_OUTCOME_PATTERN = /guarantee|faster sale|sell(s|ing)? for more|higher price|best price|more (showings|offers|buyers)|maximum visibility|maximum exposure/i;

const DEFAULT_ASSETS = {
  photography: "Not planned",
  floorPlan: "Not planned",
  propertyVideo: "Not planned",
  drone: "Not planned",
  propertyPage: "Not planned",
  social: "Not planned",
  email: "Not planned",
  print: "Not planned",
  openHouse: "Not planned",
  brandedAssets: "Not planned",
};

/** Build a fully-formed ListingProfile fixture, with sensible defaults and targeted overrides. */
function buildProfile(overrides = {}) {
  const { assets: assetOverrides, priorities: priorityOverrides, ...rest } = overrides;
  return {
    propertyType: "Single-family",
    city: "",
    state: "",
    listingStatus: "Preparing to list",
    launchTiming: "Within 30 days",
    differentiators: [],
    propertyNotes: "",
    assets: { ...DEFAULT_ASSETS, ...assetOverrides },
    channels: [],
    priorities: { primary: "Present the listing professionally", ...priorityOverrides },
    marketingSupport: "No",
    photographyStatus: "Unsure",
    ...rest,
  };
}

function allCopy(plan) {
  return JSON.stringify(plan);
}

// ── Photography ready, video/page missing ───────────────────────────────────

test("photography ready + video/page missing: surfaces video/page gaps as recommended, not claimed as done", () => {
  const profile = buildProfile({
    photographyStatus: "Approved photography ready",
    assets: { ...DEFAULT_ASSETS, photography: "Ready" },
    channels: ["MLS", "Instagram"],
  });

  const plan = generateFullPlan(profile);

  const videoRec = plan.assetRecommendations.find((r) => r.id === "rec-video-1");
  const pageRec = plan.assetRecommendations.find((r) => r.id === "rec-page-1");
  assert.ok(videoRec, "expected a video recommendation");
  assert.ok(pageRec, "expected a property-page recommendation");
  assert.equal(videoRec.priority, "recommended", "video should be recommended (not blocked) once photography is ready");

  // Recommended-priority gaps must appear in beforeLaunch (the filter-bug fix).
  assert.ok(plan.beforeLaunch.includes(videoRec.title));
  assert.ok(plan.beforeLaunch.includes(pageRec.title));

  // Talking points may claim photography readiness, but must NOT claim the video/page exist.
  const talkingCopy = plan.sellerTalkingPoints.join(" ");
  assert.match(talkingCopy, /photography is ready/i);
  assert.doesNotMatch(talkingCopy, /video.*(is ready|ready to support)/i);
  assert.doesNotMatch(talkingCopy, /listing page.*(is ready|ready to support)/i);
});

// ── Photography not arranged ─────────────────────────────────────────────────

test("photography not arranged: critical photography gap is surfaced in beforeLaunch and doNow", () => {
  const profile = buildProfile({ photographyStatus: "Photography not arranged" });
  const plan = generateFullPlan(profile);

  const photoRec = plan.assetRecommendations.find((r) => r.id === "rec-photo-1");
  assert.ok(photoRec, "expected the critical photography recommendation");
  assert.equal(photoRec.priority, "critical");

  // This is the filter-bug regression test: critical items must not be silently excluded.
  assert.ok(plan.beforeLaunch.includes(photoRec.title), "critical photography gap must appear in beforeLaunch");
  assert.ok(plan.doNow.includes(photoRec.title));

  assert.match(plan.sellerTalkingPoints[0], /photography still needs to be completed/i);
  assert.doesNotMatch(plan.sellerTalkingPoints.join(" "), /photography is ready/i);
});

// ── Strong existing marketing package ────────────────────────────────────────

test("strong existing marketing package: no open critical/recommended gaps, Cinema Estate fit is none", () => {
  const profile = buildProfile({
    photographyStatus: "Approved photography ready",
    assets: {
      photography: "Ready",
      floorPlan: "Ready",
      propertyVideo: "Ready",
      drone: "Ready",
      propertyPage: "Ready",
      social: "Ready",
      email: "Ready",
      print: "Ready",
      openHouse: "Ready",
      brandedAssets: "Ready",
    },
    channels: ["MLS", "Portal syndication", "Instagram", "Facebook", "YouTube"],
    launchTiming: "Within 30 days",
    differentiators: ["Renovated kitchen"],
    propertyNotes: "Recently renovated top to bottom with permits on file.",
  });

  const plan = generateFullPlan(profile);

  assert.equal(plan.beforeLaunch.length, 0, "a fully-prepared listing should have nothing left before launch");
  assert.equal(plan.cinemaEstateFit.relevant, false);
  assert.equal(plan.cinemaEstateFit.strength, "none");
  assert.match(plan.cinemaEstateFit.reason, /already appears highly complete/i);
});

// ── Low readiness listing ────────────────────────────────────────────────────

test("low-readiness listing scores low and uses early-stage language", () => {
  const profile = buildProfile({ photographyStatus: "Photography not arranged", launchTiming: "Unsure" });
  const plan = generateFullPlan(profile);

  assert.ok(plan.score.totalScore < 40, `expected a low score, got ${plan.score.totalScore}`);
  assert.match(plan.readinessInterpretation, /significant marketing preparation/i);
  assert.match(plan.sellerTalkingPoints.join(" "), /still early/i);
});

// ── High readiness listing ───────────────────────────────────────────────────

test("high-readiness listing scores high and uses confident language", () => {
  const profile = buildProfile({
    photographyStatus: "Approved photography ready",
    assets: {
      photography: "Ready",
      floorPlan: "Ready",
      propertyVideo: "Ready",
      drone: "Ready",
      propertyPage: "Ready",
      social: "Ready",
      email: "Ready",
      print: "Ready",
      openHouse: "Ready",
      brandedAssets: "Ready",
    },
    channels: ["MLS", "Portal syndication", "Instagram", "Facebook"],
    launchTiming: "Within 30 days",
    differentiators: ["Waterfront", "Renovated kitchen"],
    propertyNotes: "A fully staged, move-in-ready home with a brand new roof.",
  });

  const plan = generateFullPlan(profile);

  assert.ok(plan.score.totalScore >= 80, `expected a high score, got ${plan.score.totalScore}`);
  assert.match(plan.readinessInterpretation, /well-prepared to launch with confidence/i);
});

// ── Luxury / high-end listing ────────────────────────────────────────────────

test("luxury listing segments as Luxury / Distinctive and can produce a strong Cinema Estate fit", () => {
  const profile = buildProfile({
    propertyType: "Luxury residential",
    listPrice: 4_500_000,
    photographyStatus: "Approved photography ready",
    assets: { ...DEFAULT_ASSETS, photography: "Ready" },
    priorities: { primary: "Build a premium/luxury presentation" },
  });

  assert.equal(determineSegment(profile), "Luxury / Distinctive");

  const fit = determineCinemaEstateFit(profile);
  assert.equal(fit.relevant, true);
  assert.equal(fit.strength, "strong");
});

// ── Land ──────────────────────────────────────────────────────────────────

test("land listings segment as Land / Acreage and never get a video recommendation", () => {
  const profile = buildProfile({
    propertyType: "Land",
    photographyStatus: "Photography not arranged",
    assets: { ...DEFAULT_ASSETS, propertyVideo: "Not planned" },
  });

  assert.equal(determineSegment(profile), "Land / Acreage");

  const plan = generateFullPlan(profile);
  const videoRec = plan.assetRecommendations.find((r) => r.category === "video");
  assert.equal(videoRec, undefined, "land listings should never get a property-video recommendation");
});

// ── Cinema Estate fit: strong / possible / none ──────────────────────────────

test("Cinema Estate fit is possible when photography is ready but video/page are missing without a premium goal", () => {
  const profile = buildProfile({
    photographyStatus: "Approved photography ready",
    assets: { ...DEFAULT_ASSETS, photography: "Ready" },
  });
  const fit = determineCinemaEstateFit(profile);
  assert.equal(fit.relevant, true);
  assert.equal(fit.strength, "possible");
});

test("Cinema Estate fit is none when photography is not ready", () => {
  const profile = buildProfile({ photographyStatus: "Photography not arranged" });
  const fit = determineCinemaEstateFit(profile);
  assert.equal(fit.relevant, false);
  assert.equal(fit.strength, "none");
});

// ── Malformed / contradictory input ──────────────────────────────────────────

test("contradictory input (photographyStatus says ready, assets.photography says not planned) does not throw and stays bounded", () => {
  const profile = buildProfile({
    photographyStatus: "Approved photography ready",
    assets: { ...DEFAULT_ASSETS, photography: "Not planned" },
    listPrice: -500,
    differentiators: ["", "  ", "Waterfront", "Waterfront"],
    channels: [],
  });

  assert.doesNotThrow(() => generateFullPlan(profile));
  const plan = generateFullPlan(profile);

  assert.ok(plan.score.totalScore >= 0 && plan.score.totalScore <= 100);
  assert.ok(Array.isArray(plan.beforeLaunch));
  assert.ok(Array.isArray(plan.sellerTalkingPoints));
});

// ── No unsupported asset claims when assets are missing ──────────────────────

test("no unsupported asset claims appear when assets are missing across a range of profiles", () => {
  const profiles = [
    buildProfile({ photographyStatus: "Photography not arranged" }),
    buildProfile({ photographyStatus: "Unsure" }),
    buildProfile({ propertyType: "Condo", photographyStatus: "Photography scheduled" }),
  ];

  for (const profile of profiles) {
    const plan = generateFullPlan(profile);
    const copy = plan.sellerTalkingPoints.join(" ");
    if (profile.assets.propertyVideo !== "Ready") {
      assert.doesNotMatch(copy, /property video is ready/i);
    }
    if (profile.assets.propertyPage !== "Ready") {
      assert.doesNotMatch(copy, /listing page.*is ready/i);
    }
    if (profile.photographyStatus !== "Approved photography ready" && profile.assets.photography !== "Ready") {
      assert.doesNotMatch(copy, /photography is ready/i);
    }
  }
});

// ── No unsupported performance-outcome language ever appears ─────────────────

test("no unsupported performance-outcome language appears across a range of profiles", () => {
  const profiles = [
    buildProfile({ photographyStatus: "Photography not arranged" }),
    buildProfile({
      photographyStatus: "Approved photography ready",
      assets: {
        photography: "Ready", floorPlan: "Ready", propertyVideo: "Ready", drone: "Ready", propertyPage: "Ready",
        social: "Ready", email: "Ready", print: "Ready", openHouse: "Ready", brandedAssets: "Ready",
      },
      channels: ["MLS", "Instagram", "Facebook", "YouTube"],
    }),
    buildProfile({ propertyType: "Luxury residential", listPrice: 6_000_000, priorities: { primary: "Build a premium/luxury presentation" } }),
    buildProfile({ propertyType: "Land" }),
  ];

  for (const profile of profiles) {
    const plan = generateFullPlan(profile);
    assert.doesNotMatch(allCopy(plan), UNSUPPORTED_OUTCOME_PATTERN);
    const preview = generatePreview(profile);
    assert.doesNotMatch(allCopy(preview), UNSUPPORTED_OUTCOME_PATTERN);
  }
});
