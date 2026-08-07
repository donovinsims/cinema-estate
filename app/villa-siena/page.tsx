import type { Metadata } from "next";
import RevealObserver from "./RevealObserver";
import styles from "./villa-siena.module.css";

export const metadata: Metadata = {
  title: "Villa Siena — 607 Siena Way",
  description:
    "Villa Siena — 607 Siena Way, Bel-Air. An architectural estate by Ardie Tavangarian offered at $135,000,000.",
  alternates: { canonical: "/villa-siena" },
};

const MEDIA = "/media/villa-siena";

export default function VillaSienaPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Newsreader:opsz,wght@6..72,300;6..72,400&display=swap"
        rel="stylesheet"
        precedence="default"
      />
      <RevealObserver />

      <header className={styles.hero} id="film">
        <nav className={styles.nav}>
          <a className={styles.wordmark} href="#film">
            Villa Siena
          </a>
          <div className={styles.navLinks}>
            <a href="#residence">Residence</a>
            <a href="#amenities">Amenities</a>
            <a href="#inquire">Private inquiry</a>
          </div>
        </nav>
        <video controls playsInline poster={`${MEDIA}/01-Night-Aerial-Exterior.jpg`} aria-label="Villa Siena cinematic property film">
          <source src={`${MEDIA}/00-WATCH-THIS-FINAL-FILM.mp4`} type="video/mp4" />
        </video>
        <div className={styles.heroCopy}>
          <div className={styles.demoNotice}>A Cinema Estate demonstration using a real, permission-cleared listing—not the official brokerage listing site.</div>
          <div className={styles.eyebrow}>607 Siena Way · Bel-Air, California</div>
          <h1>
            Villa
            <span>Siena</span>
          </h1>
          <div className={styles.heroMeta}>
            <span>$135,000,000</span>
            <span>8 Bedrooms</span>
            <span>20 Bathrooms</span>
            <span>1.22 Acres</span>
          </div>
        </div>
        <div className={styles.scrollHint}>Scroll to enter</div>
      </header>

      <main>
        <section className={styles.intro} id="residence">
          <div className={styles.sectionNo}>01 / The Residence</div>
          <div>
            <h2>
              A home in conversation with <em>nature.</em>
            </h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              Conceived by visionary Ardie Tavangarian of Arya Group, Villa Siena is an architectural world shaped by
              landscape, light, fire, and water. Natural teak and stone establish a material language at once
              monumental and deeply grounded.
            </p>
            <p>
              Thirty-foot pivot doors open the interiors to the grounds. A four-story bronze-finished staircase,
              suspended to appear weightless, rises above a reflecting pool—architecture experienced as sculpture.
            </p>
          </div>
        </section>

        <section className={styles.facts} aria-label="Property facts">
          <div className={styles.fact}>
            <strong>8</strong>
            <span>Bedrooms</span>
          </div>
          <div className={styles.fact}>
            <strong>20</strong>
            <span>Bathrooms</span>
          </div>
          <div className={styles.fact}>
            <strong>1.22</strong>
            <span>Acres</span>
          </div>
          <div className={styles.fact}>
            <strong>6</strong>
            <span>Car auto gallery</span>
          </div>
        </section>

        <div className={styles.fullPhoto}>
          <img loading="lazy" src={`${MEDIA}/02-Great-Room-and-Garden.jpg`} alt="Villa Siena great room opening to mature trees and gardens" />
        </div>
        <div className={styles.caption}>
          <span>The great room</span>
          <span>Bel-Air · California</span>
        </div>

        <section className={styles.story}>
          <h2 className={styles.reveal} data-reveal data-reveal-visible-class={styles.visible}>
            Fire.
            <br />
            Water.
            <em>Light.</em>
          </h2>
          <div className={`${styles.storyBody} ${styles.reveal}`} data-reveal data-reveal-visible-class={styles.visible}>
            <p>Every element is choreographed to turn daily life into a sensory experience.</p>
            <ul className={styles.details}>
              <li>
                <span>Vision</span>
                <span>Ardie Tavangarian · Arya Group</span>
              </li>
              <li>
                <span>Materiality</span>
                <span>Teak · stone · bronze</span>
              </li>
              <li>
                <span>Signature</span>
                <span>Four-story suspended stair</span>
              </li>
              <li>
                <span>Connection</span>
                <span>Thirty-foot pivot doors</span>
              </li>
              <li>
                <span>Setting</span>
                <span>Bel-Air · 90077</span>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.diptych} aria-label="Villa Siena interiors">
          <figure>
            <img loading="lazy" src={`${MEDIA}/03-Floating-Stair-and-Bronze-Wall.jpg`} alt="Bronze-finished floating staircase at Villa Siena" />
          </figure>
          <figure>
            <img loading="lazy" src={`${MEDIA}/05-Primary-Bath.jpg`} alt="Stone-clad primary bath at Villa Siena" />
          </figure>
        </section>

        <section className={styles.amenities} id="amenities">
          <div className={styles.amenitiesHead}>
            <h2 className={styles.reveal} data-reveal data-reveal-visible-class={styles.visible}>
              A private
              <br />
              world.
            </h2>
            <div className={styles.count}>Signature experiences</div>
          </div>
          <div className={styles.amenityGrid}>
            <article className={styles.amenity}>
              <b>Sky</b>
              <p>A primary suite with a retractable roof opens for stargazing.</p>
            </article>
            <article className={styles.amenity}>
              <b>Wellness</b>
              <p>A forest-inspired spa with hot and cold plunges, hydrotherapy, and red-light therapy.</p>
            </article>
            <article className={styles.amenity}>
              <b>Sound</b>
              <p>A six-car auto gallery conceived as an intimate jazz club.</p>
            </article>
            <article className={styles.amenity}>
              <b>Cinema</b>
              <p>A dedicated screening room for private viewing.</p>
            </article>
            <article className={styles.amenity}>
              <b>Ritual</b>
              <p>A wine room entered through two-hundred-year-old antique doors.</p>
            </article>
            <article className={styles.amenity}>
              <b>Stillness</b>
              <p>A glass-walled outdoor sauna pod oriented toward the golf-course landscape.</p>
            </article>
          </div>
        </section>

        <section className={styles.quote}>
          <p className={styles.reveal} data-reveal data-reveal-visible-class={styles.visible}>
            &ldquo;The extraordinary is not imagined.
            <br />
            <em>It is here.</em>&rdquo;
          </p>
          <small>Villa Siena · 607 Siena Way</small>
        </section>

        <section className={styles.contact} id="inquire">
          <div className={styles.contactInner}>
            <div>
              <div className={styles.eyebrow}>Private showings by appointment</div>
              <h2>
                Enter
                <br />
                Villa Siena
              </h2>
            </div>
            <a className={styles.button} href="https://thebeverlyhillsestates.com/listing/607-siena-way/" target="_blank" rel="noopener noreferrer">
              View official listing
            </a>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div>
          607 Siena Way
          <br />
          Bel-Air, CA 90077
        </div>
        <div>
          Listing representation: Michael Fahimian and Branden Williams · The Beverly Hills Estates. Property
          information is from the listing and is deemed reliable but not guaranteed. Verify all details
          independently.
        </div>
        <div className={styles.right}>
          Offered at
          <br />
          $135,000,000
        </div>
      </footer>
    </div>
  );
}
