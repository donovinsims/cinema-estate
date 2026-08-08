import type { Metadata } from "next";
import { AnswersAccordion } from "./AnswersAccordion";
import { ArrowIcon } from "./ArrowIcon";
import { CheckoutButton } from "./CheckoutButton";
import { CheckoutStatus } from "./CheckoutStatus";
import { ComparisonExperience } from "./ComparisonExperience";
import { EarlyAccessButton } from "./EarlyAccessButton";
import { EarlyAccessModal } from "./EarlyAccessModal";
import { HeroVideo } from "./HeroVideo";
import { ProofReel } from "./ProofReel";
import { ScrollDepthTracker } from "./ScrollDepthTracker";
import { StructuredData } from "./StructuredData";
import { TierImpressionTracker } from "./TierImpressionTracker";

export const metadata: Metadata = {
  title: "Cinema Estate — Real listing photos, cinematic marketing",
  description: "Cinema Estate turns approved listing photography into video tours, narration, a listing page, and a final film for real-estate agents.",
};

const tiers = [
  {
    name: "Proof",
    price: "149",
    note: "For a standard listing that needs to look sharp, fast.",
    items: ["Up to 12 approved photos", "Short cinematic film, branded and unbranded", "Hosted listing page", "1 round of revisions"],
    checkoutUrl: "https://buy.polar.sh/polar_cl_r6UPLdTbK0UNuL4QCNH0sfQFdgcpi5DXVWLYn1W4pgw",
  },
  {
    name: "Story",
    price: "299",
    note: "The complete package for the listing you want your next seller to remember.",
    items: ["Up to 25 approved photos", "Narrated film with a script from your listing's facts", "Social teaser cut plus the full listing page", "1 round of revisions"],
    recommended: true,
    checkoutUrl: "https://buy.polar.sh/polar_cl_2qd3HGz4AhmpQCLcqKpYXzVFsWmyoM39lwg3s4BXGZi",
  },
  {
    name: "Signature",
    price: "549",
    note: "Reserved for luxury, architecturally distinctive, or high-stakes listings.",
    items: ["Up to 40 approved photos", "Custom narrative direction and voice option", "Multiple social cuts plus the listing page", "2 rounds of revisions"],
    checkoutUrl: "https://buy.polar.sh/polar_cl_5JvCDNNcFwSW9ZwYaAORoOxJqHucSEY7IuziO0bL3h7",
  },
];

const deliverables = [
  {
    number: "01",
    title: "Video tours",
    detail: "Slow cinematic sequences from the photos you approve—so your listing shows motion, not just a static frame.",
    evidence: (
      <a className="deliverable-evidence" href="#proof-reel">
        Watch the generated scenes <ArrowIcon />
      </a>
    ),
  },
  {
    number: "02",
    title: "Narration",
    detail: "A clear listing story shaped around the real property—so buyers understand what makes it worth seeing in person.",
    evidence: (
      <div className="deliverable-evidence deliverable-audio">
        <audio src="/media/villa-siena/villa-siena-hero-narration.wav" controls preload="none" />
        <p className="deliverable-evidence-caption">A narration sample from the Villa Siena package—not a frame-matched cut of the film above.</p>
      </div>
    ),
  },
  {
    number: "03",
    title: "Listing page",
    detail: "One focused destination to share with prospective buyers, instead of splitting attention across scattered photo links.",
    evidence: (
      <a className="deliverable-evidence" href="/villa-siena">
        View the Villa Siena property page <ArrowIcon direction="up-right" />
      </a>
    ),
  },
  {
    number: "04",
    title: "Final film",
    detail: "A complete, ready-to-review marketing package—one link that covers the whole story of the listing.",
    evidence: (
      <a className="deliverable-evidence" href="#proof-reel">
        Watch the final film <ArrowIcon />
      </a>
    ),
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="site-header-inner section-shell">
          <a className="wordmark" href="#top" aria-label="Cinema Estate home">CINEMA ESTATE<span>™</span></a>
          <nav className="header-nav" aria-label="Page sections">
            <a className="header-link header-link-secondary" href="#transformation">Example</a>
            <a className="header-link header-link-secondary" href="#package">What you get</a>
            <a className="header-link header-link-secondary" href="#how-it-works">How it works</a>
            <a className="header-link header-link-secondary free-plan-link" href="/listing-plan?source=header">Free listing plan</a>
            <a className="header-link" href="#pricing">Pricing <ArrowIcon /></a>
          </nav>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid section-shell" id="top">
          <div className="hero-message">
            <p className="eyebrow hero-label">A real listing, shown with permission · Villa Siena, Bel-Air</p>
            <h1 id="hero-title">Turn your real listing photos into cinematic marketing.</h1>
            <p className="hero-deck">Video tours, narration, a listing page, and a final film&mdash;built from photos you&rsquo;ve already approved, giving every listing the same polished presentation you bring to your best work.</p>
            <p className="hero-meta">From $149 per listing &middot; delivered in 24 hours</p>
            <a className="button button-primary" href="#pricing">Choose your package <ArrowIcon /></a>
          </div>
          <div className="hero-media-column" data-consent-avoid>
            <div className="hero-media-frame">
              <HeroVideo src="/media/villa-siena/01-Night-Arrival.mp4" poster="/media/villa-siena/01-Night-Aerial-Exterior.jpg" />
              <p className="hero-media-caption"><span>Real photo</span><ArrowIcon /><span>Cinematic scene</span></p>
            </div>
            <p className="hero-media-disclosure">Villa Siena is a real, permission-cleared listing used as a demonstration—not paid Cinema Estate client work.</p>
          </div>
        </div>
      </section>

      <ComparisonExperience />

      <section className="proof-section section-shell" aria-labelledby="proof-title">
        <div className="section-intro">
          <p className="eyebrow">02 / Real-media fidelity</p>
          <h2 id="proof-title">The proof is in the source material.</h2>
          <p>Every clip below begins with approved photography from Villa Siena, a real Bel-Air listing shown with the listing team&rsquo;s permission. The camera moves, but the property remains the property.</p>
          <p>It does not invent rooms, move walls, replace finishes, or change what the property is—your already-approved listing photos remain the source.</p>
          <p className="proof-disclosure">Villa Siena&rsquo;s video and property page were produced using a separate production tool, not Cinema Estate&rsquo;s own process.</p>
        </div>
        <ProofReel />
      </section>

      <section className="package-section" id="package" aria-labelledby="package-title">
        <div className="section-shell package-grid">
          <div className="section-intro">
            <p className="eyebrow">03 / The package</p>
            <h2 id="package-title">Four deliverables for your next listing launch.</h2>
            <p>One coherent package, reviewed by you before anything is published.</p>
          </div>
          <div className="deliverables">
            {deliverables.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  {item.evidence}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="quality-section section-shell" id="how-it-works" aria-labelledby="quality-title">
        <p className="eyebrow">04 / How it works</p>
        <div className="quality-grid">
          <h2 id="quality-title">From approved photos to a finished package.</h2>
          <div>
            <p>One path from checkout to a package you review and approve before anything goes live.</p>
            <ol className="how-it-works">
              <li><span className="hiw-content"><strong>Choose your package.</strong> One-time, secure checkout for Proof, Story, or Signature.</span></li>
              <li><span className="hiw-content"><strong>Submit your listing.</strong> Send the approved photos and listing details required to build your package.</span></li>
              <li><span className="hiw-content"><strong>We build.</strong> Cinema Estate builds the package around your real, already-approved photos.</span></li>
              <li><span className="hiw-content"><strong>Review and approve.</strong> You review every asset. Nothing publishes until you approve it.</span></li>
            </ol>
            <p className="turnaround-note">Your 24-hour build window starts once we have your approved photos and the listing details required to build your package&mdash;not when you place the order.</p>
            <ul className="checklist">
              <li><ArrowIcon variant="check" />Agent approval before publishing</li>
              <li><ArrowIcon variant="check" />Real listing imagery remains the source</li>
              <li><ArrowIcon variant="check" />Disclosure and delivery review</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="price-section" id="pricing" aria-labelledby="price-title">
        <div className="section-shell">
          <div className="price-grid">
            <div>
              <p className="eyebrow">05 / Pricing</p>
              <h2 id="price-title">Plans from <span>$149</span> per listing.</h2>
            </div>
            <div>
              <p>Delivered within 24 hours from your approved photos. Reviewed by you before anything publishes, and backed by the Review-First Guarantee.</p>
              <p className="guarantee-line"><strong>The Review-First Guarantee:</strong> nothing publishes until you&rsquo;ve reviewed and approved every asset yourself. If it doesn&rsquo;t match your approved photos, you get a full refund within 7 days. <a href="/terms">Full terms</a>.</p>
              <ul className="price-reassurance">
                <li>Agents approve their assets before anything is published or shared.</li>
                <li>Cinema Estate builds a defined package around your real, already-approved photos—nothing invented or altered.</li>
              </ul>
            </div>
          </div>
          <div className="tier-grid" data-consent-avoid>
            {tiers.map((tier) => (
              <TierImpressionTracker className={tier.recommended ? "tier-card is-recommended" : "tier-card"} tier={tier.name} price={tier.price} key={tier.name}>
                {tier.recommended && <p className="tier-flag">Recommended</p>}
                <h3>{tier.name}</h3>
                <p className="tier-price">{`$${tier.price}`}<span className="tier-price-caption">One-time payment</span></p>
                <p className="tier-note">{tier.note}</p>
                <ul>
                  {tier.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <CheckoutButton className="button button-primary tier-cta" href={tier.checkoutUrl} tier={tier.name} price={tier.price} placement="pricing-card" section="pricing" route="/" source="pricing">{`Buy ${tier.name}`}<ArrowIcon direction="up-right" /></CheckoutButton>
              </TierImpressionTracker>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-title">
        <div className="section-shell about-grid">
          <figure className="about-portrait">
            {/* Native srcSet/sizes are intentional so the checked-in 320w and 640w assets remain explicit. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/donovin-sims-640.webp"
              srcSet="/media/donovin-sims-320.webp 320w, /media/donovin-sims-640.webp 640w"
              sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1100px) 38vw, 420px"
              width="640"
              height="798"
              loading="lazy"
              decoding="async"
              alt="Donovin Sims, founder of Cinema Estate."
            />
          </figure>
          <div className="about-story">
            <p className="eyebrow">06 / Why Cinema Estate</p>
            <h2 id="about-title">Give your listing a cinematic story without another shoot.</h2>
            <div className="about-copy">
              <p>Listing photos can be accurate and approved, and still feel flat on a screen—real video adds motion, but usually means booking a crew, coordinating property access, and managing another production schedule for every listing. Cinema Estate uses AI to handle that production work instead: the motion, narration, listing page, and final film. It does not invent rooms, move walls, replace finishes, or change what the property is—your already-approved listing photos remain the source.</p>
              <p>You send the photos you already have. Cinema Estate builds the four-part package, then you review every asset before anything is published. There is no reshoot, no crew to book, and no property-access schedule to coordinate.</p>
              <p>I’m Donovin, from Northern Illinois. After talking with 15–20 individual agents over the past year, I kept hearing the same tradeoff: use static photos or add another production to an already busy listing. <span className="about-pullquote">I started Cinema Estate to give agents a third option: a stronger visual story built from work they have already approved.</span> The Villa Siena package shown here is a real, permission-cleared listing used as a demonstration—its video and page were produced using a separate production tool, not delivered as paid Cinema Estate client work. AI-enhanced visualization is disclosed, local MLS and brokerage rules still apply, and nothing is published until you approve it.</p>
            </div>
            <EarlyAccessButton className="button button-dark about-cta" intent="listing" source="about">Start with your listing <ArrowIcon /></EarlyAccessButton>
          </div>
        </div>
      </section>

      <section className="answers-section section-shell" aria-labelledby="answers-title">
        <p className="eyebrow">07 / Clear answers</p>
        <h2 id="answers-title">Marketing with the right guardrails.</h2>
        <AnswersAccordion />
      </section>

      <section className="lm-section" aria-labelledby="lm-title">
        <div className="section-shell lm-grid">
          <div>
            <p className="eyebrow">Not ready to choose a package yet?</p>
            <h2 id="lm-title">See what your listing actually needs first.</h2>
          </div>
          <div>
            <p>Answer a few questions and get a free seller-ready listing marketing plan with your readiness score, launch priorities, and next steps.</p>
            <a className="button button-dark" href="/listing-plan?source=post-pricing" style={{marginTop: 24}}>Build my free listing plan <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="waitlist-section" id="early-access" aria-labelledby="waitlist-title">
        <div className="section-shell waitlist-grid">
          <div><p className="eyebrow">08 / The next step</p><h2 id="waitlist-title">Give your next listing a stronger next move.</h2><p>Delivered within 24 hours from your approved photos, reviewed by you before anything publishes.</p></div>
          <div>
            <p>Ready to buy? Story is the recommended starting point for a complete listing launch. Have a question first? Ask about your listing and I&rsquo;ll help you pick the right package.</p>
            <div className="waitlist-actions">
              <CheckoutButton className="button button-primary" href={tiers[1].checkoutUrl} tier={tiers[1].name} price={tiers[1].price} placement="final-cta" section="waitlist" route="/" source="final-cta">Buy Story <ArrowIcon direction="up-right" /></CheckoutButton>
              <a className="button button-dark" href="/listing-plan?source=final-cta">Build my free listing plan <ArrowIcon /></a>
              <EarlyAccessButton className="button button-dark" source="final-cta">Ask about my listing <ArrowIcon /></EarlyAccessButton>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <span>CINEMA ESTATE™</span><span>Built from real listing media.</span>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="https://www.nar.realtor/about-nar/policies/mls-policy/use-of-photographs-in-a-multiple-listing-service">MLS policy reference <ArrowIcon direction="up-right" /></a>
      </footer>
      <EarlyAccessModal />
      <CheckoutStatus />
      <ScrollDepthTracker />
      <StructuredData />
    </main>
  );
}
