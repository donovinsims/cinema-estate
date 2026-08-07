"use client";

import { useEffect } from "react";

/**
 * Adds the CSS-module "visible" class to every reveal-marked element as it
 * scrolls into view, matching the IntersectionObserver behavior from the
 * source Villa Siena landing page. Isolated as a client island so the rest
 * of the route can stay a server component.
 *
 * Elements to watch are marked with `data-reveal`, and each carries the
 * already-hashed CSS-module class to apply on reveal in
 * `data-reveal-visible-class` — this avoids introducing any un-hashed,
 * globally-scoped class name (e.g. a literal `.reveal`/`.visible`) that
 * could collide outside this route's CSS module.
 */
export default function RevealObserver() {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const visibleClass = target.dataset.revealVisibleClass;
            if (visibleClass) {
              target.classList.add(visibleClass);
            }
          }
        }
      },
      { threshold: 0.15 },
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
