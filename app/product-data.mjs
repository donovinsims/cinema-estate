// Tier pricing/name data for structured-data (JSON-LD) output only.
// Kept in sync by hand with the `tiers` array in app/page.tsx — do not import
// this module from app/page.tsx (single-owner file rules), and do not change
// a price here without updating app/page.tsx to match (the anti-drift test in
// tests/structured-data.test.mjs will fail otherwise).

export const productTiers = [
  { name: "Proof", price: 149, currency: "USD" },
  { name: "Story", price: 299, currency: "USD" },
  { name: "Signature", price: 549, currency: "USD" },
];
