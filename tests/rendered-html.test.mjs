import assert from "node:assert/strict";
import test from "node:test";

const expectedAboutHeading = "Give your listing a cinematic story without another shoot.";
const expectedAboutParagraphs = [
  "Your listing photos can be accurate, approved, and still feel flat on a screen. Static images show the rooms one frame at a time. Real video adds motion, but it also means finding a crew, coordinating property access, and managing another production schedule for every listing.",
  "Cinema Estate uses AI to handle the repetitive production work behind the motion, narration, listing page, and final film. It does not invent rooms, move walls, replace finishes, or change what the property is. Your already-approved listing photos remain the source.",
  "You send the photos you already have. Cinema Estate builds the four-part package, then you review every asset before anything is published. There is no reshoot, no crew to book, and no property-access schedule to coordinate.",
  "I’m Donovin, from Northern Illinois. After talking with 15–20 individual agents over the past year, I kept hearing the same tradeoff: use static photos or add another production to an already busy listing. I started Cinema Estate to give agents a third option: a stronger visual story built from work they have already approved.",
  "The 255 Eldon package on this page is a demo listing, not client work. It is here to show you a realistic example of what to expect and let you judge the source photos, the cinematic treatment, and the complete package for yourself. AI-enhanced visualization is disclosed, local MLS and brokerage rules still apply, and nothing is published until you approve it.",
];
const expectedAboutCta = 'Send me a listing <span aria-hidden="true">→</span>';

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
  assert.match(html, /A real completed package · 255 Eldon Ave, Columbus/i);
  assert.match(html, /Not another photo shoot\. Not another crew to book\. A third option, built entirely from the listing photos you’ve already approved\./i);
  assert.match(html, /One real photo\. One cinematic move\./i);
  assert.match(html, /One cinematic move is one component of the complete package\./i);
  assert.match(html, /Four deliverables for your next listing launch\./i);
  assert.match(html, /Reviewed with you before anything is published\./i);
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
  assert.ok(
    aboutSection[0].includes(`>${expectedAboutCta}</button>`),
    "About CTA must match the approved copy exactly",
  );
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
  assert.match(html, /You’re on the early-access list\. We’ll be in touch when there’s an update\./i);
  assert.doesNotMatch(html, /\$99|next week|Unsubscribe anytime|privacy@sequenzy\.com/i);
  assert.match(html, /local MLS and brokerage rules apply/i);
  assert.match(html, /Will this look fake or gimmicky\?/i);
  assert.match(html, /Will AI-enhanced visualization cause MLS or disclosure trouble\?/i);
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
