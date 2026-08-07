"use client";

import { ReactNode, useEffect, useRef } from "react";
import { track } from "./analytics";

type TierImpressionTrackerProps = {
  className: string;
  tier: string;
  price: string;
  children: ReactNode;
};

export function TierImpressionTracker({ className, tier, price, children }: TierImpressionTrackerProps) {
  const ref = useRef<HTMLElement>(null);
  const viewedRef = useRef(false);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewedRef.current) {
          viewedRef.current = true;
          track("tier_card_viewed", { tier, price });
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [tier, price]);

  function handlePointerEnter() {
    if (hoveredRef.current) return;
    hoveredRef.current = true;
    track("tier_card_hovered", { tier, price });
  }

  return (
    <article ref={ref} className={className} onPointerEnter={handlePointerEnter}>
      {children}
    </article>
  );
}
