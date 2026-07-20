"use client";

import posthog from "posthog-js";

type EventProperties = Record<string, string | number | boolean | undefined>;

export function track(event: string, properties?: EventProperties) {
  if (typeof window === "undefined" || window.localStorage.getItem("cinema-estate.analytics-consent") !== "granted") return;
  posthog.capture(event, properties);
}
