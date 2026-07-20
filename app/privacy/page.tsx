import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy — Cinema Estate" };

export default function PrivacyPage() {
  return <main className="policy-page section-shell">
    <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
    <p className="eyebrow">Privacy</p>
    <h1>Privacy for early access.</h1>
    <p>When you join the Cinema Estate early-access list, we collect your email address to send your launch invite and relevant Cinema Estate updates.</p>
    <p>We use Sequenzy to manage the list and optional analytics to understand site interest. Analytics are enabled only when you choose to allow them. We do not send your email address to analytics providers.</p>
    <p>You can unsubscribe from marketing emails at any time. For access, correction, deletion, or privacy questions, contact <a href="mailto:privacy@sequenzy.com">privacy@sequenzy.com</a>.</p>
    <p>Last updated: July 20, 2026.</p>
  </main>;
}
