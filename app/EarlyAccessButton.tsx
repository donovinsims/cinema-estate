"use client";

import { ButtonHTMLAttributes } from "react";
import { track } from "./analytics";

type EarlyAccessButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: "early-access" | "listing";
  source: string;
};

export function EarlyAccessButton({ children, intent = "early-access", source, ...props }: EarlyAccessButtonProps) {
  function openModal() {
    track("early_access_cta_clicked", { intent, source });
    window.dispatchEvent(new CustomEvent("cinemaestate:early-access", { detail: { intent, source } }));
  }

  return (
    <button type="button" {...props} onClick={openModal}>
      {children}
    </button>
  );
}
