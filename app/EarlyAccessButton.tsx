"use client";

import { ButtonHTMLAttributes } from "react";

type EarlyAccessButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  source: string;
};

export function EarlyAccessButton({ children, source, ...props }: EarlyAccessButtonProps) {
  function openModal() {
    window.dispatchEvent(new CustomEvent("cinemaestate:early-access", { detail: { source } }));
  }

  return (
    <button type="button" {...props} onClick={openModal}>
      {children}
    </button>
  );
}
