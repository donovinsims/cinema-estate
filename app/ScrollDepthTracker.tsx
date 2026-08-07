"use client";

import { useEffect, useRef } from "react";
import { track } from "./analytics";

const thresholds = [25, 50, 75, 100];

export function ScrollDepthTracker() {
  const reachedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
      for (const threshold of thresholds) {
        if (progress >= threshold && !reachedRef.current.has(threshold)) {
          reachedRef.current.add(threshold);
          track("scroll_depth_reached", { threshold });
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
