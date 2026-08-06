import type { Metadata } from "next";
import { ComparisonExperience } from "./ComparisonExperience";
import { EarlyAccessButton } from "./EarlyAccessButton";
import { EarlyAccessModal } from "./EarlyAccessModal";

export const metadata: Metadata = {
  title: "Cinema Estate — Real listing photos, cinematic marketing",
  description: "Cinema Estate turns approved listing photography into video tours, narration, a listing page, and a final film for real-estate agents.",
};

const proofClips = [
  { title: "Exterior", file: "eldon-exterior", note: "The approach" },
  { title: "Living room", file: "eldon-living-room", note: "One room, one slow move" },
  { title: "Kitchen", file: "eldon-kitchen", note: "Light, texture, and context" },
  { title: "Ravine", file: "eldon-ravine", note: "The neighborhood story" },
];

const tiers = [
  {
    name: "Proof",
    price: "149",
    note: "For a standard listing that needs to look sharp.",
    items: ["Up to 12 approved photos", "Short cinematic film, branded and unbranded", "Hosted listing page", "1 round of revisions", "Delivered in 24 hours"],
  },
  {
    name: "Story",
    price: "299",
    note: "The complete package for most listings.",
    items: ["Up to 25 approved photos", "Narrated film with a script from your listing's facts", "Social teaser cut plus the full listing page", "1 round of revisions", "Delivered in 24 hours"],
    recommended: true,
  },
  {
    name: "Signature",
    price: "549",
    note: "Reserved for luxury, architecturally distinctive, or high-stakes listings.",
    items: ["Up to 40 approved photos", "Custom narrative direction and voice option", "Multiple social cuts plus the listing page", "2 rounds of revisions", "Delivered in 24 hours"],
  },
];

const deliverables = [
  ["01", "Video tours", "Slow cinematic sequences from the photos you approve—so your listing shows motion, not just a static frame."],
  ["02", "Narration", "A clear listing story shaped around the real property—so buyers understand what makes it worth seeing in person."],
  ["03", "Listing page", "One focused destination to share with prospective buyers, instead of splitting attention across scattered photo links."],
  ["04", "Final film", "A complete, ready-to-review marketing package—one link that covers the whole story of the listing."],
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <video className="hero-film" src="/media/eldon-hero-film.mp4" poster="/media/eldon-hero-poster.jpg" muted autoPlay loop playsInline preload="metadata" />
        <div className="hero-scrim" />
        <header className="site-header section-shell">
          <a className="wordmark" href="#top" aria-label="Cinema Estate home">CINEMA ESTATE<span>™</span></a>
          <EarlyAccessButton className="header-link" source="header">Early access <span aria-hidden="true">↘</span></EarlyAccessButton>
        </header>
        <div className="hero-content section-shell" id="top">
          <p className="eyebrow hero-label">A real completed package · 255 Eldon Ave, Columbus</p>
          <h1 id="hero-title">Turn your real listing photos into cinematic marketing.</h1>
          <p className="hero-deck">Video tours, narration, a listing page, and a final film—so buyers don&rsquo;t scroll past your listing.</p>
          <p className="hero-alt">Not another photo shoot. Not another crew to book. A third option, built entirely from the listing photos you&rsquo;ve already approved.</p>
          <p className="hero-price">Plans from <strong>$149</strong> per listing — delivered in 24 hours.</p>
          <EarlyAccessButton className="button button-primary" source="hero">Get early access <span aria-hidden="true">↘</span></EarlyAccessButton>
        </div>
      </section>

      <ComparisonExperience />

      <section className="proof-section section-shell" aria-labelledby="proof-title">
        <div className="section-intro">
          <p className="eyebrow">02 / Real-media fidelity</p>
          <h2 id="proof-title">The proof is in the source material.</h2>
          <p>Every frame below begins with approved photography from the actual listing. The camera moves, but the property remains the property.</p>
        </div>
        <div className="proof-grid">
          {proofClips.map((clip) => (
            <article className="proof-card" key={clip.file}>
              <video src={`/media/${clip.file}.mp4`} poster={`/media/${clip.file}-poster.jpg`} controls muted playsInline preload="metadata" />
              <div><span>{clip.title}</span><p>{clip.note}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="package-section" aria-labelledby="package-title">
        <div className="section-shell package-grid">
          <div className="section-intro">
            <p className="eyebrow">03 / The package</p>
            <h2 id="package-title">Four deliverables for your next listing launch.</h2>
            <p>One coherent package, reviewed by you before anything is published.</p>
          </div>
          <div className="deliverables">
            {deliverables.map(([number, title, detail]) => (
              <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="quality-section section-shell" aria-labelledby="quality-title">
        <p className="eyebrow">04 / Quality gate</p>
        <div className="quality-grid">
          <h2 id="quality-title">Reviewed with you before anything is published.</h2>
          <div>
            <p>You review the package before anything is published or shared. That review keeps the supplied imagery, required deliverables, disclosure language, and publishing details aligned with the listing.</p>
            <ol className="how-it-works">
              <li>Send the listing photos you&rsquo;ve already approved.</li>
              <li>Cinema Estate builds the four-part package around them.</li>
              <li>You review every asset before anything is published or shared.</li>
            </ol>
            <ul><li>Agent approval before publishing</li><li>Real listing imagery remains the source</li><li>Disclosure and delivery review</li></ul>
          </div>
        </div>
      </section>

      <section className="price-section" aria-labelledby="price-title">
        <div className="section-shell">
          <div className="price-grid">
            <div>
              <p className="eyebrow">07 / Pricing</p>
              <h2 id="price-title">Plans from <span>$149</span> per listing.</h2>
            </div>
            <div>
              <p>Delivered within 24 hours from your approved photos. Reviewed by you before anything publishes, and backed by the Review-First Guarantee.</p>
            </div>
          </div>
          <div className="tier-grid">
            {tiers.map((tier) => (
              <article className={tier.recommended ? "tier-card is-recommended" : "tier-card"} key={tier.name}>
                {tier.recommended && <p className="tier-flag">Most listings choose this</p>}
                <h3>{tier.name}</h3>
                <p className="tier-price">{`$${tier.price}`}</p>
                <p className="tier-note">{tier.note}</p>
                <ul>
                  {tier.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {/* TODO(checkout): swap for a real Polar checkout link once product/checkout IDs exist. */}
                <EarlyAccessButton className="button button-primary tier-cta" intent="listing" source={`pricing-${tier.name.toLowerCase()}`}>Start with {tier.name} <span aria-hidden="true">→</span></EarlyAccessButton>
              </article>
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
            <p className="eyebrow">05 / Why Cinema Estate</p>
            <h2 id="about-title">Give your listing a cinematic story without another shoot.</h2>
            <div className="about-copy">
              <p>Your listing photos can be accurate, approved, and still feel flat on a screen. Static images show the rooms one frame at a time. Real video adds motion, but it also means finding a crew, coordinating property access, and managing another production schedule for every listing.</p>
              <p>Cinema Estate uses AI to handle the repetitive production work behind the motion, narration, listing page, and final film. It does not invent rooms, move walls, replace finishes, or change what the property is. Your already-approved listing photos remain the source.</p>
              <p>You send the photos you already have. Cinema Estate builds the four-part package, then you review every asset before anything is published. There is no reshoot, no crew to book, and no property-access schedule to coordinate.</p>
              <p>I’m Donovin, from Northern Illinois. After talking with 15–20 individual agents over the past year, I kept hearing the same tradeoff: use static photos or add another production to an already busy listing. I started Cinema Estate to give agents a third option: a stronger visual story built from work they have already approved.</p>
              <p>The 255 Eldon package on this page is a demo listing, not client work. It is here to show you a realistic example of what to expect and let you judge the source photos, the cinematic treatment, and the complete package for yourself. AI-enhanced visualization is disclosed, local MLS and brokerage rules still apply, and nothing is published until you approve it.</p>
            </div>
            <EarlyAccessButton className="button button-primary about-cta" intent="listing" source="about">Send me a listing <span aria-hidden="true">→</span></EarlyAccessButton>
          </div>
        </div>
      </section>

      <section className="answers-section section-shell" aria-labelledby="answers-title">
        <p className="eyebrow">06 / Clear answers</p>
        <h2 id="answers-title">Marketing with the right guardrails.</h2>
        <div className="answer-list">
          <details open><summary>Will this look fake or gimmicky?</summary><p>No. The real listing images remain the source. Cinema Estate adds motion, narration, and a complete marketing package.</p></details>
          <details><summary>Who approves what goes live?</summary><p>You do. Agents approve their assets before anything is published or shared.</p></details>
          <details><summary>Will AI-enhanced visualization cause MLS or disclosure trouble?</summary><p>AI-enhanced visualization is disclosed. Local MLS and brokerage rules apply, and agents remain responsible for their listing requirements.</p></details>
        </div>
      </section>

      <section className="waitlist-section" id="early-access" aria-labelledby="waitlist-title">
        <div className="section-shell waitlist-grid">
          <div><p className="eyebrow">Early access</p><h2 id="waitlist-title">Give your next listing a stronger next move.</h2><p className="guarantee-line"><strong>The Review-First Guarantee:</strong> nothing publishes to your listing until you&rsquo;ve reviewed and approved every asset yourself. If it doesn&rsquo;t match your approved photos, you get a full refund within 7 days. <a href="/terms">Full terms</a>.</p></div>
          <div><p>For individual agents ready to turn approved listing photos into a cinematic marketing package.</p><EarlyAccessButton className="button button-dark" source="final-cta">Get early access <span aria-hidden="true">↗</span></EarlyAccessButton></div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <span>CINEMA ESTATE™</span><span>Built from real listing media.</span>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="https://www.nar.realtor/about-nar/policies/mls-policy/use-of-photographs-in-a-multiple-listing-service">MLS policy reference ↗</a>
      </footer>
      <EarlyAccessModal />
    </main>
  );
}
