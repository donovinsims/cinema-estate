"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const consentKey = "cinema-estate.analytics-consent";

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(consentKey);
    if (saved === "granted" || saved === "denied") window.setTimeout(() => setChoice(saved), 0);
  }, []);

  useEffect(() => {
    if (choice !== "granted" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      persistence: "localStorage",
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, [choice]);

  function choose(nextChoice: "granted" | "denied") {
    window.localStorage.setItem(consentKey, nextChoice);
    setChoice(nextChoice);
  }

  return <>
    <Analytics />
    <SpeedInsights />
    {choice === null && <aside className="analytics-consent" aria-label="Analytics privacy choice">
      <p>We use optional analytics to understand early-access interest. <a href="/privacy">Learn more</a>.</p>
      <div><button type="button" onClick={() => choose("denied")}>No thanks</button><button type="button" onClick={() => choose("granted")}>Allow analytics</button></div>
    </aside>}
  </>;
}
