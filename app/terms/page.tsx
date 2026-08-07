import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & refund policy — Cinema Estate",
  description:
    "Cinema Estate's terms and refund policy: the one-time per-listing fee, 24-hour delivery timeline, the Review-First Guarantee, revision rounds, and your responsibilities.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <main className="policy-page section-shell">
    <Link className="wordmark" href="/">CINEMA ESTATE<span>™</span></Link>
    <p className="eyebrow">Terms</p>
    <h1>Terms &amp; refund policy.</h1>
    <p>These terms cover a single purchase of a Cinema Estate package for one listing. By paying for a package, you agree to the terms below.</p>

    <h2>What you get</h2>
    <p>Cinema Estate turns listing photography you already own or have permission to use into a video package: a cinematic film, narration, a hosted listing page, and (depending on package) social cuts. Every package is built from the photos you approve — we do not schedule a shoot, invent rooms, move walls, or change what the property is.</p>

    <h2>Delivery timeline</h2>
    <p>We deliver your package within 24 hours of receiving your approved photos and the listing details required to build it. That clock starts when we have everything we need, not when you first place the order — if a required file or fact is missing, we will tell you what&rsquo;s outstanding before the 24 hours starts.</p>

    <h2>Review before publish</h2>
    <p>Nothing publishes to your listing until you review and approve every asset yourself. If something needs a change, each package includes a set number of revision rounds: one round for Proof and Story, two rounds for Signature. Revisions address accuracy and delivery issues within the scope of the original order, not a new creative direction.</p>

    <h2>The Review-First Guarantee</h2>
    <p>If the package we deliver does not accurately reflect the listing photos you approved, tell us within 7 days of delivery and we will refund your payment in full — no questions asked. This guarantee covers accuracy to your source photos. It does not cover and we do not promise any particular number of showings, inquiries, offers, or a faster sale — those outcomes are outside our control.</p>
    <p>Outside of that accuracy guarantee, payments are non-refundable once final assets have been delivered and approved, since the work has been completed as ordered.</p>

    <h2>Your responsibilities</h2>
    <p>You confirm that you own the listing photos you submit or have the rights holder&rsquo;s permission to use them this way. You remain responsible for complying with your MLS&rsquo;s rules, your brokerage&rsquo;s policies, Fair Housing advertising requirements, and any required AI-use disclosure in your market. Cinema Estate discloses that AI-assisted production is used in every package; you are responsible for how you present and distribute the finished assets.</p>

    <h2>AI-assisted production</h2>
    <p>Cinema Estate uses AI to help produce the motion, narration, and page around your source photos. It does not invent property features, move fixtures, alter finishes, or change condition, and every asset is reviewed against the source photos before you approve it.</p>

    <h2>Payment</h2>
    <p>Each package is a one-time, per-listing fee — not a subscription — processed by our payment provider. Prices are listed on the pricing section of this site at the time of purchase.</p>

    <h2>Limitation of liability</h2>
    <p>Cinema Estate&rsquo;s liability for any claim related to a package is limited to the amount you paid for that package. We are not liable for indirect, incidental, or consequential damages, including lost sales or lost listing opportunities.</p>

    <h2>Governing law</h2>
    <p>These terms are governed by the laws of the State of Illinois, without regard to conflict-of-laws principles.</p>

    <h2>Changes</h2>
    <p>We may update these terms as the product changes; the version in effect at the time of your order applies to that order.</p>

    <p>Last updated: August 6, 2026.</p>
  </main>;
}
