"use client";
/* eslint-disable @next/next/no-img-element -- the full-size local image layer must align exactly with the clipped video layer. */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  clampComparisonPosition,
  comparisonPositionFromKey,
} from "./comparison-state.mjs";
import { track } from "./analytics";

const initialPosition = 18;

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function ComparisonExperience() {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mobileView, setMobileView] = useState<"before" | "after">("before");
  const reducedMotion = usePrefersReducedMotion();
  const comparisonRef = useRef<HTMLDivElement>(null);
  const afterVideoRef = useRef<HTMLVideoElement>(null);
  const interactionTrackedRef = useRef(false);

  const trackFirstInteraction = (method: "drag" | "keyboard" | "button") => {
    if (interactionTrackedRef.current) return;
    interactionTrackedRef.current = true;
    track("comparison_slider_interacted", { method });
  };

  const setPositionFromPointer = (clientX: number) => {
    const bounds = comparisonRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setPosition(clampComparisonPosition(((clientX - bounds.left) / bounds.width) * 100));
  };

  const playAfter = () => {
    void afterVideoRef.current?.play().catch(() => undefined);
  };

  useEffect(() => {
    const element = comparisonRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRevealed) return;
        setHasRevealed(true);
        window.setTimeout(() => setPosition(58), 120);
        observer.disconnect();
      },
      { threshold: 0.42 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasRevealed]);

  const revealFully = () => {
    trackFirstInteraction("button");
    setHasRevealed(true);
    setHasInteracted(true);
    setPosition(100);
    window.setTimeout(playAfter, 1200);
  };

  return (
    <section className="comparison-section" aria-labelledby="comparison-title">
      <div className="section-shell comparison-heading">
        <div>
          <p className="eyebrow">01 / The transformation</p>
          <h2 id="comparison-title">One real photo. One cinematic move.</h2>
        </div>
        {!reducedMotion && (
          <button className="text-control" type="button" onClick={revealFully}>
            Watch the transformation <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      <div className="comparison-desktop" aria-label="Before and after comparison">
        <div
          ref={comparisonRef}
          className={`comparison-stage ${dragging ? "is-dragging" : ""} ${hasInteracted ? "has-revealed" : ""}`}
          style={{ "--comparison-position": `${position}%` } as React.CSSProperties}
          onPointerMove={(event) => {
            if (dragging) setPositionFromPointer(event.clientX);
          }}
          onPointerUp={() => {
            if (dragging) {
              setDragging(false);
              playAfter();
            }
          }}
        >
          <img
            className="comparison-before"
            src="/media/eldon-exterior-before.jpg"
            alt="Original listing photo of the exterior at 255 Eldon Avenue"
          />
          <div className="comparison-after" aria-hidden={position < 6}>
            <video
              ref={afterVideoRef}
              src="/media/eldon-exterior.mp4"
              poster="/media/eldon-exterior-poster.jpg"
              muted
              playsInline
              preload="metadata"
            />
          </div>
          <span className="comparison-label before-label">BEFORE / STATIC LISTING IMAGE</span>
          <span className="comparison-label after-label">AFTER / ONE SLOW CAMERA MOVE</span>
          <button
            className="comparison-handle"
            data-comparison-slider
            type="button"
            role="slider"
            aria-label="Reveal cinematic marketing"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            aria-valuetext={`${Math.round(position)}% cinematic marketing revealed`}
            onPointerDown={(event) => {
              try {
                event.currentTarget.setPointerCapture(event.pointerId);
              } catch {
                // Synthetic and assistive pointer events do not always expose an active pointer to capture.
              }
              trackFirstInteraction("drag");
              setDragging(true);
              setHasInteracted(true);
              setPositionFromPointer(event.clientX);
            }}
            onPointerUp={() => {
              setDragging(false);
              playAfter();
            }}
            onKeyDown={(event) => {
              const nextPosition = comparisonPositionFromKey(position, event.key);
              if (nextPosition !== position) {
                event.preventDefault();
                trackFirstInteraction("keyboard");
                setHasRevealed(true);
                setHasInteracted(true);
                setPosition(nextPosition);
                playAfter();
              }
            }}
          >
            <span aria-hidden="true">↔</span>
          </button>
          <span className="drag-prompt">Drag to compare</span>
        </div>
      </div>

      <div className="comparison-mobile">
        <div className="comparison-toggle" role="group" aria-label="Comparison view">
          <button
            type="button"
            className={mobileView === "before" ? "is-active" : ""}
            aria-pressed={mobileView === "before"}
            onClick={() => setMobileView("before")}
          >
            Before
          </button>
          <button
            type="button"
            className={mobileView === "after" ? "is-active" : ""}
            aria-pressed={mobileView === "after"}
            onClick={() => {
              setMobileView("after");
              playAfter();
            }}
          >
            After
          </button>
        </div>
        {mobileView === "before" ? (
          <img src="/media/eldon-exterior-before.jpg" alt="Original listing photo of 255 Eldon Avenue" />
        ) : (
          <video
            ref={afterVideoRef}
            src="/media/eldon-exterior.mp4"
            poster="/media/eldon-exterior-poster.jpg"
            controls
            muted
            playsInline
          />
        )}
      </div>

      <div className="comparison-reduced">
        <figure>
          <img src="/media/eldon-exterior-before.jpg" alt="Original listing photo of 255 Eldon Avenue" />
          <figcaption>Before / Static listing image</figcaption>
        </figure>
        <figure>
          <video src="/media/eldon-exterior.mp4" poster="/media/eldon-exterior-poster.jpg" controls muted playsInline />
          <figcaption>After / One slow camera move</figcaption>
        </figure>
      </div>

      <p className="comparison-caption section-shell">
        One cinematic move is one component of the complete package. The real listing image remains the source.
      </p>
    </section>
  );
}
