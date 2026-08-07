"use client";

import { AnchorHTMLAttributes, useRef } from "react";
import { track } from "./analytics";

type CheckoutButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tier: string;
  price: string;
};

export function CheckoutButton({ children, tier, price, href, ...props }: CheckoutButtonProps) {
  const trackedRef = useRef(false);

  function trackClick() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    track("checkout_cta_clicked", { tier, price });
  }

  return (
    <a href={href} {...props} rel="noopener noreferrer" onClick={trackClick}>
      {children}
    </a>
  );
}
