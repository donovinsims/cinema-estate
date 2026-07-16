import type { Metadata } from "next";
import { ComparisonExperience } from "./ComparisonExperience";
import { EarlyAccessButton } from "./EarlyAccessButton";
import { EarlyAccessModal } from "./EarlyAccessModal";

export const metadata: Metadata = {
  title: "Cinema Estate — Real listing photos, cinematic marketing",
  description: "Cinema Estate turns approved listing photography into a cinematic marketing package for real-estate agents.",
};

const proofClips = [
  { title: "Exterior", file: "eldon-exterior", note: "The approach" },
  { title: "Living room", file: "eldon-living-room", note: "One room, one slow move" },
  { title: "Kitchen", file: "eldon-kitchen", note: "Light, texture, and context" },
  { title: "Ravine", file: "eldon-ravine", note: "The neighborhood story" },
];

const deliverables = [
  ["01", "Video tours", "Slow cinematic sequences from the photos you approve."],
  ["02", "Narration", "A clear listing story shaped around the real property."],
  ["03", "Listing page", "One focused destination to share with prospective buyers."],
  ["04", "Final film", "A complete, ready-to-review marketing package."],
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
          <p className="hero-deck">Video tours, narration, a listing page, and a final film—built from the property you are already marketing.</p>
          <EarlyAccessButton className="button button-primary" source="hero">Get early access <span aria-hidden="true">↘</span></EarlyAccessButton>
          <p className="hero-price">Plans from <strong>$99</strong> per listing</p>
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
            <h2 id="package-title">Everything an agent needs to launch the story.</h2>
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
          <h2 id="quality-title">Reviewed for the details that change trust.</h2>
          <div>
            <p>Internal validation checks the supplied imagery, required deliverables, disclosure language, and publishing readiness. It is a quality gate—not a public score or a promise of performance.</p>
            <ul><li>Agent approval before publishing</li><li>Real listing imagery remains the source</li><li>Disclosure and delivery review</li></ul>
          </div>
        </div>
      </section>

      <section className="price-section">
        <div className="section-shell price-grid">
          <p className="eyebrow">05 / Simple start</p>
          <div><h2>Plans from <span>$99</span> per listing.</h2><p>Start with one approved listing. Full tier pricing arrives with launch.</p></div>
        </div>
      </section>

      <section className="answers-section section-shell" aria-labelledby="answers-title">
        <p className="eyebrow">06 / Clear answers</p>
        <h2 id="answers-title">Marketing with the right guardrails.</h2>
        <div className="answer-list">
          <details open><summary>Does Cinema Estate redesign the property?</summary><p>No. The real listing images remain the source. Cinema Estate adds motion, narration, and a complete marketing package.</p></details>
          <details><summary>Who approves what goes live?</summary><p>You do. Agents approve their assets before anything is published or shared.</p></details>
          <details><summary>How is AI-enhanced visualization handled?</summary><p>AI-enhanced visualization is disclosed. Local MLS and brokerage rules apply, and agents remain responsible for their listing requirements.</p></details>
        </div>
      </section>

      <section className="waitlist-section" id="early-access" aria-labelledby="waitlist-title">
        <div className="section-shell waitlist-grid">
          <div><p className="eyebrow">Launching next week</p><h2 id="waitlist-title">Be first to turn a listing into a film.</h2></div>
          <div><p>For individual agents ready to give their approved listing photos a stronger next move.</p><EarlyAccessButton className="button button-dark" source="final-cta">Get the launch invite <span aria-hidden="true">↗</span></EarlyAccessButton></div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <span>CINEMA ESTATE™</span><span>Built from real listing media.</span>
        <a href="https://www.nar.realtor/about-nar/policies/mls-policy/use-of-photographs-in-a-multiple-listing-service">MLS policy reference ↗</a>
      </footer>
      <EarlyAccessModal />
    </main>
  );
}
