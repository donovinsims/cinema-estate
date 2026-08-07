"use client";

import { useEffect, useRef } from "react";
import { track } from "./analytics";

// Renders nothing. Reads the Polar checkout status from the URL (?checkout=success
// | cancelled) once on mount, reports it to analytics, then strips the query
// parameter so a refresh does not double-fire the event.
export function CheckoutStatus() {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    const status = new URLSearchParams(window.location.search).get("checkout");
    if (status === "success") {
      trackedRef.current = true;
      track("checkout_completed");
    } else if (status === "cancelled") {
      trackedRef.current = true;
      track("checkout_returned");
    } else {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return null;
}
