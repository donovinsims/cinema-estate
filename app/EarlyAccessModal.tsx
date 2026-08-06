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

export function EarlyAccessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [openedBy, setOpenedBy] = useState("cta");
  const [presentationIntent, setPresentationIntent] = useState<PresentationIntent>("early-access");
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const engagedRef = useRef(false);
  const elapsedRef = useRef(false);
  const autoOpenedRef = useRef(false);
  const hasInteractedRef = useRef(false);

  function open(source: string, intent: PresentationIntent = "early-access") {
    if (source !== "engaged") hasInteractedRef.current = true;
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenedBy(source);
    setPresentationIntent(intent);
    setIsOpen(true);
    track("early_access_modal_viewed", { intent, source });
  }

  function close(rememberDismissal = true) {
    if (rememberDismissal) {
      try {
        localStorage.setItem(dismissalKey, String(Date.now()));
      } catch {}
    }
    setIsOpen(false);
    track("early_access_modal_dismissed", { intent: presentationIntent, source: openedBy });
    window.setTimeout(() => lastFocusedElement.current?.focus(), 0);
  }

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ intent?: PresentationIntent; source?: string }>).detail;
      open(detail?.source ?? "cta", detail?.intent ?? "early-access");
    };
    window.addEventListener("cinemaestate:early-access", onOpen);

    if (!canShowAutomaticPopup()) {
      return () => window.removeEventListener("cinemaestate:early-access", onOpen);
    }

    const tryOpen = () => {
      if (elapsedRef.current && engagedRef.current && !autoOpenedRef.current && !hasInteractedRef.current) {
        autoOpenedRef.current = true;
        open("engaged");
      }
    };
    const timer = window.setTimeout(() => {
      elapsedRef.current = true;
      tryOpen();
    }, 35000);
    const onScroll = () => {
      const progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress >= 0.45) {
        engagedRef.current = true;
        tryOpen();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("cinemaestate:early-access", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>("input, button, [href], select, textarea, [tabindex]:not([tabindex='-1'])");
    firstFocusable?.focus();
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
  }

  const presentation = getEarlyAccessPresentation(presentationIntent);

  return (
    <div className="early-access-backdrop" style={{ zIndex: 40 }} onMouseDown={closeFromBackdrop} hidden={!isOpen}>
      <div ref={dialogRef} className="early-access-modal" role="dialog" aria-modal="true" aria-labelledby="early-access-modal-title" aria-describedby="early-access-modal-description" onKeyDown={trapFocus} data-opened-by={openedBy} data-presentation-intent={presentationIntent}>
        <button className="modal-close" type="button" onClick={() => close()} aria-label="Close early-access form">×</button>
        <p className="eyebrow">{presentation.eyebrow}</p>
        <h2 id="early-access-modal-title">{presentation.title}</h2>
        <p id="early-access-modal-description">{presentation.description}</p>
        <WaitlistForm variant="modal" intent={presentationIntent} onSuccess={handleSuccess} />
        <p className="modal-detail">Email only.</p>
        <button className="modal-decline" type="button" onClick={() => close()}>Maybe later</button>
      </div>
    </div>
  );
}
