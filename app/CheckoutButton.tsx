"use client";

import { AnchorHTMLAttributes } from "react";
import { track } from "./analytics";

type CheckoutButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tier: string;
  price: string;
};

export function CheckoutButton({ children, tier, price, href, ...props }: CheckoutButtonProps) {
  function trackClick() {
    track("checkout_cta_clicked", { tier, price });
  }

  return (
    <a href={href} {...props} onClick={trackClick}>
      {children}
    </a>
  );
}
