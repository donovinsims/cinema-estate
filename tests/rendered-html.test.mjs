import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, /One real photo\. One cinematic move\./i);
  assert.match(html, /One cinematic move is one component of the complete package\./i);
  assert.match(html, /Four deliverables for your next listing launch\./i);
  assert.match(html, /Reviewed with you before anything is published\./i);
  assert.match(html, /Give your listing a cinematic story without another shoot\./i);
  assert.match(html, /Your listing photos can be accurate, approved, and still feel flat on a screen\./i);
  assert.match(html, /Cinema Estate uses AI to handle the repetitive production work/i);
  assert.match(html, /There is no reshoot, no crew to book, and no property-access schedule to coordinate\./i);
  assert.match(html, /I’m Donovin, from Northern Illinois\./i);
  assert.match(html, /15–20 individual agents over the past year/i);
  assert.match(html, /The 255 Eldon package on this page is a demo listing, not client work\./i);
  assert.match(html, /AI-enhanced visualization is disclosed, local MLS and brokerage rules still apply, and nothing is published until you approve it\./i);
  assert.match(html, /Send me a listing\s*<span[^>]*>→<\/span>/i);
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
