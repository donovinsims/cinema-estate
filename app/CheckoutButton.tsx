"use client";

import { AnchorHTMLAttributes, useEffect, useRef, useState } from "react";
import { track } from "./analytics";

type CheckoutButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tier: string;
  price: string;
};

const resetDelayMs = 2500;

export function CheckoutButton({ children, tier, price, href, ...props }: CheckoutButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  function trackClick() {
    track("checkout_cta_clicked", { tier, price });
    setIsNavigating(true);
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setIsNavigating(false), resetDelayMs);
  }

  return (
    <a
      href={href}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      aria-busy={isNavigating}
      onClick={trackClick}
    >
      {isNavigating ? "Opening checkout…" : children}
    </a>
  );
}
