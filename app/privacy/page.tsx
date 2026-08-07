import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Cinema Estate",
  description:
    "How Cinema Estate handles your email address when you contact us, optional analytics, and payment information processed by Polar.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main className="policy-page section-shell">
    <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
    <p className="eyebrow">Privacy</p>
    <h1>Privacy.</h1>
    <p>When you contact us to ask about your listing, we collect your email address to follow up.</p>
    <p>Purchases are processed by Polar, our payment provider. When you buy a package, Polar handles your payment and order information under its own privacy policy; we do not receive or store your card details on this site.</p>
    <p>We use Sequenzy to manage that contact list. Vercel Analytics and Speed Insights are rendered on this site to understand site activity and performance. PostHog analytics are optional and start only if you choose to allow them. We do not send your email address to analytics providers.</p>
    <p>We will publish a dedicated privacy contact and email-preference process before making either available as a public promise.</p>
    <p>Last updated: August 6, 2026.</p>
  </main>;
}
