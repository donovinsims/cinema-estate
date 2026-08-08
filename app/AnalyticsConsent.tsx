"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const consentKey = "cinema-estate.analytics-consent";

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);
  // True while a primary CTA or control marked `data-consent-avoid` (pricing
  // tier cards, hero media controls, a page's own hero) is anywhere in view —
  // the banner fades out rather than risking an overlap, and returns once the
  // visitor scrolls past.
  const [obscuring, setObscuring] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(consentKey);
    if (saved === "granted" || saved === "denied") window.setTimeout(() => setChoice(saved), 0);
  }, []);

  useEffect(() => {
    if (choice !== null) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-consent-avoid]"));
    if (targets.length === 0) return;
    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) intersecting.add(entry.target);
        else intersecting.delete(entry.target);
      }
      setObscuring(intersecting.size > 0);
    }, { threshold: 0 });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [choice]);

  useEffect(() => {
    if (choice !== "granted" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      persistence: "localStorage",
      capture_pageview: true,
      capture_pageleave: true,
      // Autocapture scoped to buttons/links/forms only (click events) — the
      // existing semantic track() calls remain the source of truth for
      // funnels; this is a supplement, not a replacement. Never widen to
      // 'input'/'textarea'/'select' or unscoped div/p text, since free-text
      // fields (e.g. the /listing-plan wizard's property notes) live there.
      autocapture: {
        dom_event_allowlist: ["click"],
        element_allowlist: ["a", "button", "form"],
      },
      // Session Replay. Recording only ever starts after this init() call
      // runs, which itself only runs once `choice === "granted"` — "No
      // thanks" still means zero PostHog activity of any kind.
      disable_session_recording: false,
      session_recording: {
        // Mask every <input>/<textarea>/<select> value site-wide (covers
        // email fields and the /listing-plan wizard's free-text inputs,
        // including its "property notes" textarea).
        maskAllInputs: true,
        // Defensive: /listing-plan's results screens can echo user-entered
        // free text (e.g. "what makes this property stand out") back as
        // plain rendered text outside of any input, in these containers.
        // Mask their text content too, even though we don't own/edit that
        // route directly.
        maskTextSelector: ".lp-insight-card, .lp-plan-summary, .lp-plan-section",
        // Belt-and-suspenders: even though request/response body capture is
        // off by default (recordBody/recordHeaders default false), strip
        // any captured body for the two endpoints that carry user-entered
        // data if body capture is ever turned on later (locally or via
        // remote config).
        maskCapturedNetworkRequestFn: (request) => {
          if (/\/api\/(listing-plan|early-access)/.test(String(request.name ?? ""))) {
            return { ...request, requestBody: undefined, responseBody: undefined };
          }
          return request;
        },
      },
      // Heatmaps — current posthog-js API (superseding the legacy
      // enable_heatmaps flag, still read as a fallback internally).
      capture_heatmaps: true,
      // Rage clicks are enabled by default in this posthog-js version, but
      // set explicitly so the behavior doesn't depend on an undocumented
      // default. Dead clicks default to remote project config; set
      // explicitly so slow/frustrated-interaction signal doesn't silently
      // depend on a dashboard toggle no one has looked at.
      rageclick: true,
      capture_dead_clicks: true,
      // Error tracking: capture unhandled errors and unhandled promise
      // rejections (not console.error — that can echo arbitrary, possibly
      // sensitive, logged values). This is the current posthog-js
      // mechanism; no manual window.onerror hook needed.
      capture_exceptions: true,
    });
  }, [choice]);

  function choose(nextChoice: "granted" | "denied") {
    window.localStorage.setItem(consentKey, nextChoice);
    setChoice(nextChoice);
  }

  return <>
    <Analytics />
    <SpeedInsights />
    {choice === null && <aside className={`analytics-consent${obscuring ? " is-obscuring" : ""}`} aria-label="Analytics privacy choice">
      <p>Allow optional PostHog analytics to help us understand buyer interest. <a href="/privacy">Learn more</a>.</p>
      <div><button type="button" onClick={() => choose("denied")}>No thanks</button><button type="button" onClick={() => choose("granted")}>Allow analytics</button></div>
    </aside>}
  </>;
}
