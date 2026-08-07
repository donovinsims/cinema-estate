import assert from "node:assert/strict";
import test from "node:test";

const expectedAboutHeading = "Give your listing a cinematic story without another shoot.";
const expectedAboutParagraphs = [
  "Listing photos can be accurate and approved, and still feel flat on a screen—real video adds motion, but usually means booking a crew, coordinating property access, and managing another production schedule for every listing. Cinema Estate uses AI to handle that production work instead: the motion, narration, listing page, and final film. It does not invent rooms, move walls, replace finishes, or change what the property is—your already-approved listing photos remain the source.",
  "You send the photos you already have. Cinema Estate builds the four-part package, then you review every asset before anything is published. There is no reshoot, no crew to book, and no property-access schedule to coordinate.",
  "I’m Donovin, from Northern Illinois. After talking with 15–20 individual agents over the past year, I kept hearing the same tradeoff: use static photos or add another production to an already busy listing. I started Cinema Estate to give agents a third option: a stronger visual story built from work they have already approved. The 255 Eldon package on this page is a demo listing, not client work—here to show you a realistic example of what to expect, so you can judge the source photos, the cinematic treatment, and the complete package for yourself. AI-enhanced visualization is disclosed, local MLS and brokerage rules still apply, and nothing is published until you approve it.",
];
const expectedAboutCtaText = "Start with your listing";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Cinema Estate with an accessible comparison and waitlist", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cinema Estate/i);
  assert.match(html, /Turn your real listing photos into cinematic marketing\./i);
  assert.match(html, /A self-produced demo package · 255 Eldon Ave, Columbus/i);
  assert.doesNotMatch(html, /A real completed package/i);
  assert.match(
    html,
    /Video tours, narration, a listing page, and a final film—built from photos you.{1,2}ve already approved, so buyers don.{1,2}t scroll past your listing\./i,
  );
  assert.match(
    html,
    /The third option between flat photos and booking a film crew—so every listing makes you look like the best-marketed agent in the room\./i,
  );
  assert.match(html, /Plans from <strong>\$149<\/strong> per listing — delivered in 24 hours, backed by the Review-First Guarantee\./i);
  const siteHeaderPosition = html.indexOf('class="site-header"');
  const heroMediaTogglePosition = html.indexOf('class="hero-media-toggle"');
  const heroPricingAnchorPosition = html.indexOf('id="top"');
  assert.ok(siteHeaderPosition >= 0, "Site header must render");
  assert.ok(
    siteHeaderPosition < heroMediaTogglePosition && heroMediaTogglePosition < heroPricingAnchorPosition,
    "Header must render before the hero media toggle for correct keyboard tab order",
  );
  assert.match(html, /One real photo\. One cinematic move\./i);
  assert.match(html, /One cinematic move is one component of the complete package\./i);
  assert.match(html, /Four deliverables for your next listing launch\./i);
  assert.match(html, /so your listing shows motion, not just a static frame/i);
  assert.match(html, /so buyers understand what makes it worth seeing in person/i);
  assert.match(html, /instead of splitting attention across scattered photo links/i);
  assert.match(html, /one link that covers the whole story of the listing/i);
  assert.match(html, /Reviewed with you before anything is published\./i);
  assert.match(html, /Send the listing photos you.{1,2}ve already approved\./i);
  assert.match(html, /Cinema Estate builds the four-part package around them\./i);
  assert.match(html, /You review every asset before anything is published or shared\./i);
  const aboutSection = html.match(/<section class="about-section"[\s\S]*?<\/section>/);
  assert.ok(aboutSection, "About section must render");
  assert.ok(
    aboutSection[0].includes(`<h2 id="about-title">${expectedAboutHeading}</h2>`),
    "About heading must match the approved copy exactly",
  );
  const aboutCopy = aboutSection[0].match(/<div class="about-copy">([\s\S]*?)<\/div>/);
  assert.ok(aboutCopy, "About copy wrapper must render");
  const renderedAboutParagraphs = [...aboutCopy[1].matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
  assert.deepEqual(renderedAboutParagraphs, expectedAboutParagraphs, "About paragraphs must match the approved copy exactly and in order");
  const aboutCta = aboutSection[0].match(/class="button button-dark about-cta"[^>]*>([\s\S]*?)<\/button>/);
  assert.ok(aboutCta, "About CTA button must render");
  assert.match(aboutCta[1], new RegExp(`^${expectedAboutCtaText}\\s*<svg`, "i"), "About CTA text must match the approved copy exactly, followed by the arrow icon");
  assert.doesNotMatch(aboutCta[1], />→</, "About CTA arrow must render as the shared SVG icon, not a raw arrow character");
  assert.match(html, /src="\/media\/donovin-sims-640\.webp"/i);
  assert.match(html, /srcSet="\/media\/donovin-sims-320\.webp 320w, \/media\/donovin-sims-640\.webp 640w"/i);
  assert.match(html, /sizes="\(max-width: 720px\) calc\(100vw - 32px\), \(max-width: 1100px\) 38vw, 420px"/i);
  assert.match(html, /width="640"\s+height="798"\s+loading="lazy"\s+decoding="async"\s+alt="Donovin Sims, founder of Cinema Estate\."/i);
  const qualityPosition = html.indexOf('id="quality-title"');
  const aboutPosition = html.indexOf('id="about-title"');
  const answersPosition = html.indexOf('id="answers-title"');
  assert.ok(qualityPosition >= 0 && qualityPosition < aboutPosition, "Quality must render before About");
  assert.ok(aboutPosition < answersPosition, "About must render before FAQ");
  assert.match(html, /Give your next listing a stronger next move\./i);
  assert.match(html, /The Review-First Guarantee/i);
  assert.match(html, /nothing publishes to your listing until you.{1,2}ve reviewed and approved every asset yourself/i);
  assert.match(html, /If it doesn.{1,2}t match your approved photos, you get a full refund within 7 days\./i);
  assert.match(html, /<a href="\/terms">Full terms<\/a>/i);
  assert.match(html, /<a href="\/terms">Terms<\/a>/i);
  assert.match(html, /BEFORE\s*\/\s*STATIC LISTING IMAGE/i);
  assert.match(html, /AFTER\s*\/\s*ONE SLOW CAMERA MOVE/i);
  assert.match(html, /Drag to compare/i);
  assert.match(html, /Watch the transformation/i);
  assert.match(html, /Get early access/i);
  assert.match(html, /data-comparison-slider/i);
  assert.match(html, /aria-label="Reveal cinematic marketing"/i);
  assert.match(html, /<button[^>]*>Before<\/button>/i);
  assert.match(html, /<button[^>]*>After<\/button>/i);
  assert.match(html, /name="email"/i);
  assert.match(html, /name="website"/i);
  assert.match(html, /You’re on the early-access list\. I’ll personally follow up with next steps — or see pricing and buy anytime\./i);
  assert.match(html, /Ready to buy\? Pricing is above\. Not ready yet\? Leave your email and I.{1,2}ll personally follow up about your listing\./i);
  const waitlistSection = html.match(/<section class="waitlist-section"[\s\S]*?<\/section>/);
  assert.ok(waitlistSection, "Waitlist section must render");
  assert.match(waitlistSection[0], /<a class="button button-primary" href="#pricing">See pricing/i);
  assert.doesNotMatch(html, /\$99|next week|Unsubscribe anytime|privacy@sequenzy\.com/i);
  assert.match(html, /local MLS and brokerage rules apply/i);
  assert.match(html, /Will this look fake or gimmicky\?/i);
  assert.match(html, /Will AI-enhanced visualization cause MLS or disclosure trouble\?/i);
  assert.match(html, /What if I can get this for \$10–\$40 with a cheaper AI tool\?/i);
  assert.match(
    html,
    /Cinema Estate builds a defined package around your real, already-approved photos—nothing invented or altered/i,
  );
  assert.match(html, /It does not invent rooms, move walls, replace finishes, or change what the property is—your already-approved listing photos remain the source\./i);
  assert.match(html, /Plans from <span>\$149<\/span> per listing\./i);
  assert.match(html, /Delivered within 24 hours from your approved photos/i);
  assert.match(html, /Agents approve their assets before anything is published or shared\./i);
  assert.match(html, /Cinema Estate builds a defined package around your real, already-approved photos—nothing invented or altered\./i);
  assert.match(html, />Proof</);
  assert.match(html, />Story</);
  assert.match(html, />Signature</);
  assert.match(html, /\$149/);
  assert.match(html, /\$299/);
  assert.match(html, /\$549/);
  assert.match(html, /For a standard listing that needs to look sharp, fast\./i);
  assert.match(html, /The complete package for the listing you want your next seller to remember\./i);
  assert.match(html, /Reserved for luxury, architecturally distinctive, or high-stakes listings/i);
  assert.match(html, /<a href="https:\/\/buy\.polar\.sh\/polar_cl_r6UPLdTbK0UNuL4QCNH0sfQFdgcpi5DXVWLYn1W4pgw"[^>]*>Buy Proof/i);
  assert.match(html, /<a href="https:\/\/buy\.polar\.sh\/polar_cl_2qd3HGz4AhmpQCLcqKpYXzVFsWmyoM39lwg3s4BXGZi"[^>]*>Buy Story/i);
  assert.match(html, /<a href="https:\/\/buy\.polar\.sh\/polar_cl_5JvCDNNcFwSW9ZwYaAORoOxJqHucSEY7IuziO0bL3h7"[^>]*>Buy Signature/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders accurate analytics and privacy disclosures", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Vercel Analytics and Speed Insights are rendered on this site/i);
  assert.match(html, /PostHog analytics are optional and start only if you choose to allow them/i);
  assert.doesNotMatch(html, /privacy@sequenzy\.com|unsubscribe from marketing emails at any time/i);
});

test("renders terms with the Review-First Guarantee and delivery/refund commitments", async () => {
  const response = await render("/terms");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Terms &amp; refund policy\./i);
  assert.match(html, /within 24 hours of receiving your approved photos/i);
  assert.match(html, /one round for Proof and Story, two rounds for Signature/i);
  assert.match(html, /tell us within 7 days of delivery and we will refund your payment in full/i);
  assert.match(html, /payments are non-refundable once final assets have been delivered and approved/i);
});
