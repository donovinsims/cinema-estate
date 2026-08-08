"use client";

import { AnchorHTMLAttributes, useRef } from "react";
import { track } from "./analytics";

type CheckoutButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tier: string;
  price: string;
  /** Which UI context the checkout link lives in (pricing-card / final-cta). */
  placement?: string;
  /** The page section that anchors this link (pricing / waitlist). */
  section?: string;
  /** The route the link was rendered on. */
  route?: string;
  /** Attribution source when the link was reached from another page/flow. */
  source?: string;
};

export function CheckoutButton({ children, tier, price, href, placement, section, route, source, ...props }: CheckoutButtonProps) {
  const trackedRef = useRef(false);

  function trackClick() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    track("checkout_cta_clicked", { tier, price, placement, section, route, source });
  }

  return (
    <a href={href} {...props} rel="noopener noreferrer" onClick={trackClick}>
      {children}
    </a>
  );
}
