"use client";

import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { WaitlistForm } from "./WaitlistForm";
import { track } from "./analytics";
import { getEarlyAccessPresentation } from "./early-access-copy.mjs";

type PresentationIntent = "early-access" | "listing";

const cooldownMs = 14 * 24 * 60 * 60 * 1000;
const dismissalKey = "cinema-estate.waitlist-dismissed-at";
const conversionKey = "cinema-estate.waitlist-converted";

function canShowAutomaticPopup() {
  try {
    if (localStorage.getItem(conversionKey)) return false;
    const dismissedAt = Number(localStorage.getItem(dismissalKey) ?? 0);
    return !dismissedAt || Date.now() - dismissedAt > cooldownMs;
  } catch {
    return false;
  }
}

const closeAnimationMs = 180;

export function EarlyAccessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openedBy, setOpenedBy] = useState("cta");
  const [presentationIntent, setPresentationIntent] = useState<PresentationIntent>("early-access");
  const [hasConverted, setHasConverted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const focusOnOpenRef = useRef(true);
  const autoOpenedRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const sawPricingRef = useRef(false);
  const pricingTrackedRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  function open(source: string, intent: PresentationIntent = "early-access") {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (source !== "engaged") hasInteractedRef.current = true;
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    focusOnOpenRef.current = source !== "engaged";
    setOpenedBy(source);
    setPresentationIntent(intent);
    setHasConverted(false);
    setIsClosing(false);
    setIsOpen(true);
    track("early_access_modal_viewed", { intent, source });
  }

  function close(rememberDismissal = true, restoreFocus = true) {
    if (rememberDismissal) {
      try {
        localStorage.setItem(dismissalKey, String(Date.now()));
      } catch {}
    }
    track("early_access_modal_dismissed", { intent: presentationIntent, source: openedBy });
    setIsClosing(true);
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, closeAnimationMs);
    if (restoreFocus) window.setTimeout(() => lastFocusedElement.current?.focus(), 0);
  }

  useEffect(() => {
    const priceSection = document.getElementById("pricing");
    if (!priceSection || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sawPricingRef.current = true;
          if (!pricingTrackedRef.current) {
            pricingTrackedRef.current = true;
            track("pricing_section_viewed");
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(priceSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ intent?: PresentationIntent; source?: string }>).detail;
      open(detail?.source ?? "cta", detail?.intent ?? "early-access");
    };
    window.addEventListener("cinemaestate:early-access", onOpen);

    if (!canShowAutomaticPopup()) {
      return () => window.removeEventListener("cinemaestate:early-access", onOpen);
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) {
      return () => window.removeEventListener("cinemaestate:early-access", onOpen);
    }

    const tryOpen = () => {
      if (autoOpenedRef.current || hasInteractedRef.current || !sawPricingRef.current) return;
      autoOpenedRef.current = true;
      open("engaged");
    };
    const onMouseOut = (event: MouseEvent) => {
      if (event.clientY <= 0 && !event.relatedTarget) tryOpen();
    };
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("cinemaestate:early-access", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !focusOnOpenRef.current) return;
    const emailInput = dialogRef.current?.querySelector<HTMLElement>('input[type="email"]');
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>("input, button, [href], select, textarea, [tabindex]:not([tabindex='-1'])");
    (emailInput ?? firstFocusable)?.focus();
  }, [isOpen]);

  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("input, button, [href], select, textarea, [tabindex]:not([tabindex='-1'])") ?? []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) close();
  }

  function handleSuccess() {
    try {
      localStorage.setItem(conversionKey, "true");
    } catch {}
    setHasConverted(true);
  }

  const presentation = getEarlyAccessPresentation(presentationIntent);

  return (
    <div className={isClosing ? "early-access-backdrop is-closing" : "early-access-backdrop"} style={{ zIndex: 40 }} onMouseDown={closeFromBackdrop} hidden={!isOpen && !isClosing}>
      <div ref={dialogRef} className="early-access-modal" role="dialog" aria-modal="true" aria-labelledby="early-access-modal-title" aria-describedby="early-access-modal-description" tabIndex={-1} onKeyDown={trapFocus} data-opened-by={openedBy} data-presentation-intent={presentationIntent}>
        <button className="modal-close" type="button" onClick={() => close()} aria-label="Close early-access form">×</button>
        <p className="eyebrow">{presentation.eyebrow}</p>
        <h2 id="early-access-modal-title">{presentation.title}</h2>
        <p id="early-access-modal-description">{presentation.description}</p>
        <WaitlistForm variant="modal" intent={presentationIntent} onSuccess={handleSuccess} />
        <p className="modal-detail">Email only.</p>
        <a className="modal-decline" href="#pricing" onClick={() => close(false, false)}>See pricing <span aria-hidden="true">→</span></a>
        <button className="modal-decline" type="button" onClick={() => close()}>{hasConverted ? "Close" : "Maybe later"}</button>
      </div>
    </div>
  );
}
