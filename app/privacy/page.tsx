import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy — Cinema Estate" };

export default function PrivacyPage() {
  return <main className="policy-page section-shell">
    <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
    <p className="eyebrow">Privacy</p>
    <h1>Privacy for early access.</h1>
    <p>When you join the Cinema Estate early-access list, we collect your email address to send Cinema Estate updates.</p>
    <p>We use Sequenzy to manage the list. Vercel Analytics and Speed Insights are rendered on this site to understand site activity and performance. PostHog analytics are optional and start only if you choose to allow them. We do not send your email address to analytics providers.</p>
    <p>We will publish a dedicated privacy contact and email-preference process before making either available as a public promise.</p>
    <p>Last updated: July 20, 2026.</p>
  </main>;
}
