"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowIcon } from "../ArrowIcon";
import { track } from "../analytics";
import type { ListingProfile } from "./engine/types";

// ── Result types ─────────────────────────────────────────────────────────────

interface PreviewResult {
  score: { totalScore: number; categories: { name: string; score: number; max: number }[] };
  segment: string;
  strengths: string[];
  gaps: string[];
  doNow: string[];
  readinessInterpretation: string;
  cinemaEstateFit: { relevant: boolean; strength: "none" | "possible" | "strong"; reason: string };
  recommendations: { id: string; title: string; status: string; priority: string }[];
}

interface FullPlanResult {
  score: { totalScore: number };
  segment: string;
  cinemaEstateFit: { relevant: boolean; strength: "none" | "possible" | "strong"; reason: string };
  readinessInterpretation: string;
  sellerFacingSummary: string;
  strengths: string[];
  gaps: string[];
  beforeLaunch: string[];
  launchPlan: string[];
  afterLaunch: string[];
  sellerTalkingPoints: string[];
  /** "queued" if Sequenzy accepted the send; "failed" if it did not — the plan itself
   * is always returned either way. Inbox delivery is not confirmed server-side. */
  deliveryStatus?: "queued" | "failed";
  marketingSubscribed?: boolean;
}

// ── Default profile ──────────────────────────────────────────────────────────

const DEFAULT_PROFILE: Partial<ListingProfile> = {
  propertyType: "Single-family",
  city: "",
  state: "",
  listingStatus: "Preparing to list",
  launchTiming: "Within 30 days",
  differentiators: [],
  propertyNotes: "",
  assets: {
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
  },
  channels: [],
  priorities: {
    primary: "Present the listing professionally",
  },
  marketingSupport: "No",
  photographyStatus: "Unsure",
};

function loadSavedProfile(): Partial<ListingProfile> {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const saved = localStorage.getItem("lp_wizard_data");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ListingPlanClient() {
  const [phase, setPhase] = useState<"entry" | "wizard" | "preview" | "results">("entry");
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<ListingProfile>>(loadSavedProfile);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [fullPlan, setFullPlan] = useState<FullPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  // ── Entry-source + one-shot phase tracking ────────────────────────────────
  const entrySourceRef = useRef<string | undefined>(undefined);
  const viewedRef = useRef(false);
  const phaseRef = useRef(phase);

  // Capture entry source once on mount (the ?source= query param from the homepage
  // link that routed the user here). Read from window.location so this client-only
  // tool needs no Suspense boundary and never triggers a CSR bailout at prerender.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const src = new URLSearchParams(window.location.search).get("source");
      if (src) entrySourceRef.current = src;
    }
  }, []);

  // One-shot listing_plan_viewed — fires at most once, on entry mount.
  useEffect(() => {
    if (!viewedRef.current && phase === "entry") {
      viewedRef.current = true;
      track("listing_plan_viewed", { entry_source: entrySourceRef.current });
    }
  }, [phase]);

  // Phase-transition tracking (one-shot per transition).
  useEffect(() => {
    if (phaseRef.current !== phase) {
      if (phase === "preview") {
        track("listing_plan_email_gate_viewed", { readinessTier: preview?.score.totalScore !== undefined ? (preview.score.totalScore >= 80 ? "Strong" : preview.score.totalScore >= 60 ? "Solid" : preview.score.totalScore >= 40 ? "Developing" : "Early") : undefined });
      }
      if (phase === "results") {
        track("listing_plan_results_viewed", { deliveryStatus: fullPlan?.deliveryStatus, cinemaEstateFit: fullPlan?.cinemaEstateFit?.strength });
      }
      phaseRef.current = phase;
    }
  }, [phase, preview, fullPlan]);

  // Persist wizard data to localStorage on change
  const updateData = useCallback((updates: Partial<ListingProfile>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem("lp_wizard_data", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateAssets = useCallback((key: keyof ListingProfile["assets"], value: string) => {
    setData((prev) => {
      const next = { ...prev, assets: { ...(prev.assets ?? DEFAULT_PROFILE.assets!), [key]: value } };
      try { localStorage.setItem("lp_wizard_data", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const nextStep = () => {
    track("listing_plan_step_completed", { step });
    setStep((s) => Math.min(4, s + 1));
  };
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/listing-plan?action=preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRef.current),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Failed to generate preview.");
      }
      const result = await res.json() as PreviewResult;
      track("listing_plan_preview_generated", { readinessTier: result.score.totalScore >= 80 ? "Strong" : result.score.totalScore >= 60 ? "Solid" : result.score.totalScore >= 40 ? "Developing" : "Early", readinessScore: result.score.totalScore, cinemaEstateFit: result.cinemaEstateFit.strength, propertyType: dataRef.current.propertyType ?? "unknown", entry_source: entrySourceRef.current });
      setPreview(result);
      setPhase("preview");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Shared by the initial claim submit and the "retry sending email" action — both hit the
   * same endpoint with the same payload, since a retry is just another `?action=generate` call. */
  const submitClaim = useCallback(async () => {
    setClaimLoading(true);
    setClaimError(null);
    try {
      const res = await fetch("/api/listing-plan?action=generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dataRef.current, email, marketingConsent }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Failed to generate plan.");
      }
      const plan = await res.json() as FullPlanResult;
      track("listing_plan_claimed", { marketingConsent, cinemaEstateFit: plan.cinemaEstateFit.strength, readinessScore: plan.score.totalScore, deliveryStatus: plan.deliveryStatus ?? "unknown", entry_source: entrySourceRef.current });
      track("listing_plan_full_plan_generated", { cinemaEstateFit: plan.cinemaEstateFit.strength });
      setFullPlan(plan);
      setPhase("results");
    } catch (err: unknown) {
      setClaimError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      track("listing_plan_claim_failed", { reason: err instanceof Error ? err.message : "unknown" });
    } finally {
      setClaimLoading(false);
    }
  }, [email, marketingConsent]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Simple client-side email shape check before attempting the claim.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      track("listing_plan_validation_failed", { stage: "email_gate", reason: "invalid_email" });
      return;
    }
    track("listing_plan_claim_attempted", { entry_source: entrySourceRef.current, marketingConsent });
    await submitClaim();
  };

  const handleRetryDelivery = async () => {
    track("listing_plan_delivery_retry_attempted");
    await submitClaim();
  };

  // ── Entry screen ─────────────────────────────────────────────────────────

  if (phase === "entry") {
    return (
      <main className="lp-page">
        <header className="lp-header">
          <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
        </header>
        <div className="lp-entry section-shell">
          <p className="eyebrow">Free tool for listing agents</p>
          <h1>How ready is your next listing to launch?</h1>
          <p className="lp-entry-deck">Answer a few questions about the property and the marketing assets you already have. Get a practical readiness score and seller-ready launch plan.</p>
          <button className="button button-primary lp-start-btn" onClick={() => { track("listing_plan_started", { entry_source: entrySourceRef.current }); setPhase("wizard"); }}>
            Build my listing plan <ArrowIcon />
          </button>
          <p className="lp-entry-meta">Free · No account · Takes a few minutes</p>
        </div>
      </main>
    );
  }

  // ── Wizard ───────────────────────────────────────────────────────────────

  if (phase === "wizard") {
    const totalSteps = 4;
    const progress = Math.round((step / totalSteps) * 100);

    return (
      <main className="lp-page">
        <header className="lp-header">
          <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
        </header>
        <div className="lp-wizard section-shell">
          <div className="lp-progress">
            <div className="lp-progress-bar">
              <div className="lp-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="lp-progress-label">Step {step} of {totalSteps}</span>
          </div>

          {step === 1 && <WizardStep1 data={data} updateData={updateData} />}
          {step === 2 && <WizardStep2 data={data} updateData={updateData} updateAssets={updateAssets} />}
          {step === 3 && <WizardStep3 data={data} updateData={updateData} />}
          {step === 4 && <WizardStep4 data={data} updateData={updateData} />}

          {error && <p className="lp-error">{error}</p>}

          <div className="lp-wizard-nav">
            {step > 1 ? (
              <button className="button button-dark" onClick={prevStep}>Back</button>
            ) : <div />}
            {step < totalSteps ? (
              <button className="button button-primary" onClick={nextStep}>Next <ArrowIcon /></button>
            ) : (
              <button className="button button-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Building preview…" : <>Build my plan <ArrowIcon /></>}
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ── Preview ──────────────────────────────────────────────────────────────

  if (phase === "preview" && preview) {
    const { score, strengths, gaps, doNow, readinessInterpretation } = preview;
    const tier = score.totalScore >= 80 ? "Strong" : score.totalScore >= 60 ? "Solid" : score.totalScore >= 40 ? "Developing" : "Early";
    const tierColor = score.totalScore >= 60 ? "var(--tungsten-light)" : score.totalScore >= 40 ? "#c9bfa9" : "#a89c88";

    return (
      <main className="lp-page">
        <header className="lp-header">
          <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
        </header>
        <div className="lp-results section-shell">
          <div className="lp-preview">
            <p className="eyebrow">Your Listing Marketing Readiness</p>
            <div className="lp-score-ring" style={{ borderColor: tierColor }}>
              <span className="lp-score-num" style={{ color: tierColor }}>{score.totalScore}</span>
              <span className="lp-score-max">/100</span>
            </div>
            <p className="lp-score-label">{tier} foundation</p>
            <p className="lp-score-interpretation">{readinessInterpretation}</p>

            <div className="lp-insight-grid">
              {strengths.length > 0 && (
                <div className="lp-insight-card">
                  <h3>Strongest area</h3>
                  <p>{strengths[0]}</p>
                </div>
              )}
              {gaps.length > 0 && (
                <div className="lp-insight-card">
                  <h3>Largest gap</h3>
                  <p>{gaps[0]}</p>
                </div>
              )}
              {doNow.length > 0 && (
                <div className="lp-insight-card">
                  <h3>First step</h3>
                  <p>{doNow[0]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Email claim */}
          <div className="lp-claim-section">
            <h2>Your complete seller-ready plan is ready</h2>
            <p>
              Get your full launch roadmap: before-launch recommendations, launch-day plan, first-week actions,
              asset recommendations, a seller-facing summary, and seller talking points.
            </p>
            <form className="lp-claim-form" onSubmit={handleClaim}>
              <div className="lp-claim-inputs">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lp-email-input"
                />
                <button type="submit" className="button button-primary" disabled={claimLoading}>
                  {claimLoading ? "Sending…" : <>Email my full plan <ArrowIcon /></>}
                </button>
              </div>
              <label className="lp-consent-label">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                />
                <span>Send me occasional listing-marketing tips and Cinema Estate updates.</span>
              </label>
              {claimError && <p className="lp-error">{claimError}</p>}
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ── Full results ─────────────────────────────────────────────────────────

  if (phase === "results" && fullPlan) {
    const { score: rScore, cinemaEstateFit } = fullPlan;
    const ceFit = cinemaEstateFit;
    const deliveryFailed = fullPlan.deliveryStatus === "failed";

    return (
      <main className="lp-page">
        <header className="lp-header">
          <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
        </header>
        <div className="lp-results section-shell">
          <p className="eyebrow">Your listing marketing plan</p>
          <h1 className="lp-plan-title">Here&rsquo;s what your listing needs.</h1>

          {/* Delivery failures — claimError (fetch itself failed) supersedes deliveryFailed (accepted by API at some point). */}
          {claimError && (
            <p className="lp-error" role="alert">
              {claimError}{" "}
              <button type="button" className="button button-dark" onClick={handleRetryDelivery} disabled={claimLoading}>
                {claimLoading ? "Retrying…" : "Retry sending email"}
              </button>
            </p>
          )}
          {!claimError && deliveryFailed && (
            <p className="lp-error" role="alert">
              We couldn&rsquo;t email this plan to {email || "your inbox"} right now — but your plan is shown below and nothing is lost.{" "}
              <button type="button" className="button button-dark" onClick={handleRetryDelivery} disabled={claimLoading}>
                {claimLoading ? "Retrying…" : "Retry sending email"}
              </button>
            </p>
          )}

          {/* Marketing enrollment failed (only relevant when consent was true). */}
          {fullPlan.marketingSubscribed === false && (
            <p className="lp-error" role="alert">
              Marketing-tip enrollment didn&rsquo;t go through. You can opt in later from the email we sent.
            </p>
          )}

          {/* Score summary */}
          <div className="lp-plan-score">
            <span className="lp-plan-score-num">{rScore.totalScore}/100</span>
            <span>Readiness Score</span>
          </div>
          <p className="lp-plan-interpretation">{fullPlan.readinessInterpretation}</p>

          {/* Narrative */}
          <div className="lp-plan-body">
            <p className="lp-plan-summary">{fullPlan.sellerFacingSummary}</p>

            <div className="lp-plan-grid">
              <div className="lp-plan-card">
                <h3>Before launch</h3>
                <ul>{fullPlan.beforeLaunch?.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="lp-plan-card">
                <h3>Launch day</h3>
                <ul>{fullPlan.launchPlan?.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
              </div>
              <div className="lp-plan-card">
                <h3>First week</h3>
                <ul>{fullPlan.afterLaunch?.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
              </div>
            </div>

            {/* Strengths & Gaps */}
            {fullPlan.strengths?.length > 0 && (
              <div className="lp-plan-section">
                <h3>What&rsquo;s already working</h3>
                <ul>{fullPlan.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
              </div>
            )}
            {fullPlan.gaps?.length > 0 && (
              <div className="lp-plan-section">
                <h3>What still needs attention</h3>
                <ul>{fullPlan.gaps.map((g: string, i: number) => <li key={i}>{g}</li>)}</ul>
              </div>
            )}

            {/* Seller talking points */}
            {fullPlan.sellerTalkingPoints?.length > 0 && (
              <div className="lp-plan-section">
                <h3>Seller talking points</h3>
                <ul className="lp-talking-points">
                  {fullPlan.sellerTalkingPoints.map((pt: string, i: number) => (
                    <li key={i}><ArrowIcon variant="check" />{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Cinema Estate CTA */}
          {ceFit.relevant && (
            <div className="lp-ce-cta">
              {ceFit.strength === "strong" ? (
                <>
                  <h2>Turn your approved photos into a complete visual package.</h2>
                  <p>{ceFit.reason}</p>
                  <div className="lp-ce-actions">
                    <Link className="button button-primary" href="/#pricing?source=listing_plan" onClick={() => track("listing_plan_cinema_estate_cta_clicked", { cta: "story_package", fit: ceFit.strength })}>See the Story package &mdash; $299 <ArrowIcon direction="up-right" /></Link>
                    <Link className="button button-dark" href="/#pricing?source=listing_plan">Compare all packages</Link>
                  </div>
                </>
              ) : (
                <>
                  <h2>See what Cinema Estate could add to your listing.</h2>
                  <p>{ceFit.reason}</p>
                  <div className="lp-ce-actions">
                    <Link className="button button-dark" href="/#pricing?source=listing_plan" onClick={() => track("listing_plan_cinema_estate_cta_clicked", { cta: "explore_packages", fit: ceFit.strength })}>Explore packages <ArrowIcon direction="up-right" /></Link>
                    <Link className="button button-dark" href="/villa-siena">View the Villa Siena example <ArrowIcon direction="up-right" /></Link>
                  </div>
                </>
              )}
            </div>
          )}

          {!ceFit.relevant && (
            <div className="lp-ce-neutral">
              <p>{ceFit.reason} If your situation changes, you can always revisit.</p>
              <Link className="button button-dark" href="/">Back to Cinema Estate</Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  return null;
}

// ── Wizard Steps ─────────────────────────────────────────────────────────────

const PROPERTY_TYPES = ["Single-family", "Condo", "Townhome", "Multi-family", "Land", "Farm / acreage", "Luxury residential"];
const PHOTO_STATUSES = ["Approved photography ready", "Photography scheduled", "Photography not arranged", "Unsure"];
const ASSET_STATUSES = ["Ready", "Planned", "Not planned"];
const GOALS = ["Present the listing professionally", "Build a premium/luxury presentation", "Create stronger social content"];
const CHANNELS = ["MLS", "Instagram", "Facebook", "Email database", "Agent website", "Single-property page"] as const;

function WizardStep1({ data, updateData }: { data: Partial<ListingProfile>; updateData: (u: Partial<ListingProfile>) => void }) {
  return (
    <div className="lp-step">
      <h2 className="lp-step-title">Property basics</h2>
      <div className="lp-field">
        <label>Property type</label>
        <select value={data.propertyType ?? "Single-family"} onChange={(e) => updateData({ propertyType: e.target.value as ListingProfile["propertyType"] })}>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="lp-field-row">
        <div className="lp-field">
          <label>City</label>
          <input type="text" value={data.city ?? ""} onChange={(e) => updateData({ city: e.target.value })} />
        </div>
        <div className="lp-field">
          <label>State</label>
          <input type="text" value={data.state ?? ""} onChange={(e) => updateData({ state: e.target.value })} />
        </div>
      </div>
      <div className="lp-field">
        <label>Approximate list price</label>
        <input type="number" value={data.listPrice ?? ""} onChange={(e) => updateData({ listPrice: parseInt(e.target.value) || undefined })} placeholder="e.g. 500000" />
      </div>
      <div className="lp-field">
        <label>What makes this property stand out? (comma separated)</label>
        <input
          type="text"
          value={data.differentiators?.join(", ") ?? ""}
          onChange={(e) => updateData({ differentiators: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="e.g. Renovated kitchen, waterfront view"
        />
      </div>
    </div>
  );
}

function WizardStep2({ data, updateData, updateAssets }: {
  data: Partial<ListingProfile>;
  updateData: (u: Partial<ListingProfile>) => void;
  updateAssets: (k: keyof ListingProfile["assets"], v: string) => void;
}) {
  return (
    <div className="lp-step">
      <h2 className="lp-step-title">Marketing assets</h2>
      <div className="lp-field">
        <label>Photography status</label>
        <select value={data.photographyStatus ?? "Unsure"} onChange={(e) => updateData({ photographyStatus: e.target.value as ListingProfile["photographyStatus"] })}>
          {PHOTO_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="lp-field">
        <label>Property video</label>
        <select value={data.assets?.propertyVideo ?? "Not planned"} onChange={(e) => updateAssets("propertyVideo", e.target.value)}>
          {ASSET_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="lp-field">
        <label>Property page / single-property website</label>
        <select value={data.assets?.propertyPage ?? "Not planned"} onChange={(e) => updateAssets("propertyPage", e.target.value)}>
          {ASSET_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}

function WizardStep3({ data, updateData }: { data: Partial<ListingProfile>; updateData: (u: Partial<ListingProfile>) => void }) {
  return (
    <div className="lp-step">
      <h2 className="lp-step-title">Distribution &amp; goals</h2>
      <div className="lp-field">
        <label>Primary goal</label>
        <select value={data.priorities?.primary ?? "Present the listing professionally"} onChange={(e) => updateData({ priorities: { ...data.priorities!, primary: e.target.value as ListingProfile["priorities"]["primary"] } })}>
          {GOALS.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div className="lp-field">
        <label>Planned distribution channels</label>
        <div className="lp-checkbox-grid">
          {CHANNELS.map((ch) => (
            <label key={ch} className="lp-checkbox">
              <input
                type="checkbox"
                checked={data.channels?.includes(ch as ListingProfile["channels"][number]) ?? false}
                onChange={(e) => {
                  const current = data.channels ?? [];
                  if (e.target.checked) updateData({ channels: [...current, ch as ListingProfile["channels"][number]] });
                  else updateData({ channels: current.filter((c) => c !== ch) });
                }}
              />
              <span>{ch}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="lp-field">
        <label>Launch timing</label>
        <select value={data.launchTiming ?? "Within 30 days"} onChange={(e) => updateData({ launchTiming: e.target.value as ListingProfile["launchTiming"] })}>
          {["Within 48 hours", "Within 7 days", "Within 14 days", "Within 30 days", "More than 30 days", "Unsure"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function WizardStep4({ data, updateData }: { data: Partial<ListingProfile>; updateData: (u: Partial<ListingProfile>) => void }) {
  return (
    <div className="lp-step">
      <h2 className="lp-step-title">Anything else?</h2>
      <p className="lp-step-desc">We have enough to build a practical plan. Add any notes here if helpful.</p>
      <div className="lp-field">
        <label>Property notes (optional)</label>
        <textarea
          value={data.propertyNotes ?? ""}
          onChange={(e) => updateData({ propertyNotes: e.target.value })}
          placeholder="Any additional context about the property or your marketing situation…"
          rows={4}
        />
      </div>
    </div>
  );
}
