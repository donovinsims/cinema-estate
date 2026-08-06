"use client";

import { AnchorHTMLAttributes, useState } from "react";
import { track } from "./analytics";

type CheckoutButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tier: string;
  price: string;
};

export function CheckoutButton({ children, tier, price, href, ...props }: CheckoutButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  function trackClick() {
    track("checkout_cta_clicked", { tier, price });
    setIsNavigating(true);
  }

  return (
    <a href={href} {...props} aria-busy={isNavigating} onClick={trackClick}>
      {isNavigating ? "Opening checkout…" : children}
    </a>
  );
}
