"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "./analytics";

type CheckoutOutcome = "none" | "success" | "cancelled";

// Reads the Polar checkout status from the URL (?checkout=success | cancelled)
// once on mount, reports it to analytics, strips the query parameter so a
// refresh does not double-fire the event, and shows a visible confirmation so
// the buyer knows their purchase landed.
export function CheckoutStatus() {
  const [outcome, setOutcome] = useState<CheckoutOutcome>("none");
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    const status = new URLSearchParams(window.location.search).get("checkout");
    if (status !== "success" && status !== "cancelled") return;
    trackedRef.current = true;
    track(status === "success" ? "checkout_completed" : "checkout_returned");
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    queueMicrotask(() => setOutcome(status));
  }, []);

  if (outcome === "none") return null;

  return (
    <div className={`checkout-status ${outcome}`} role="status" aria-live="polite">
      {outcome === "success" ? (
        <p>Order confirmed. I&rsquo;ll follow up to collect your approved photos and listing details — your 24-hour build window starts once I have everything, and you&rsquo;ll review every asset before it publishes.</p>
      ) : (
        <p>Checkout cancelled — no charge was made. <a href="#pricing">Back to pricing</a></p>
      )}
    </div>
  );
}
