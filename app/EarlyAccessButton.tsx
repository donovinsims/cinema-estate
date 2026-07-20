"use client";

import { ButtonHTMLAttributes } from "react";
import { track } from "./analytics";

type EarlyAccessButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  source: string;
};

export function EarlyAccessButton({ children, source, ...props }: EarlyAccessButtonProps) {
  function openModal() {
    track("early_access_cta_clicked", { source });
    window.dispatchEvent(new CustomEvent("cinemaestate:early-access", { detail: { source } }));
  }

  return (
    <button type="button" {...props} onClick={openModal}>
      {children}
    </button>
  );
}
