import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/villa-siena") {
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

test("serves the Villa Siena route with correct metadata and external links", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();

  assert.match(html, /<title>Villa Siena — 607 Siena Way<\/title>/);
  assert.match(
    html,
    /<meta name="description" content="Villa Siena — 607 Siena Way, Bel-Air\. An architectural estate by Ardie Tavangarian offered at \$135,000,000\."/,
  );
  assert.match(html, /<link rel="canonical" href="https:\/\/cinema-estate\.vercel\.app\/villa-siena"/);

  // Google Fonts preconnect + stylesheet links must be preserved.
  assert.match(html, /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"/);
  assert.match(html, /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"/);
  assert.match(
    html,
    /<link[^>]*href="https:\/\/fonts\.googleapis\.com\/css2\?family=Manrope[^"]*Newsreader[^"]*"[^>]*rel="stylesheet"/,
  );

  // The official brokerage listing link must be preserved exactly.
  assert.match(
    html,
    /<a[^>]*href="https:\/\/thebeverlyhillsestates\.com\/listing\/607-siena-way\/"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[^>]*>View official listing<\/a>/,
  );
});

test("rewrites media paths to /media/villa-siena/ and never references the original relative asset paths", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  // Hero video: source + poster.
  assert.match(html, /<source src="\/media\/villa-siena\/00-WATCH-THIS-FINAL-FILM\.mp4" type="video\/mp4"/);
  assert.match(html, /poster="\/media\/villa-siena\/01-Night-Aerial-Exterior\.jpg"/);

  // The six photos.
  assert.match(html, /src="\/media\/villa-siena\/02-Great-Room-and-Garden\.jpg"/);
  assert.match(html, /src="\/media\/villa-siena\/03-Floating-Stair-and-Bronze-Wall\.jpg"/);
  assert.match(html, /src="\/media\/villa-siena\/05-Primary-Bath\.jpg"/);

  // Contact section background photo, referenced from the CSS module (asset URL, not inline here,
  // but confirm the image itself is not referenced via the old relative path anywhere in the HTML).
  assert.doesNotMatch(html, /\.\.\/02-Original-Images\//);
  assert.doesNotMatch(html, /\.\.\/03-New-Videos\//);
});

test("does not reference the narration audio (out of scope for this route)", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.doesNotMatch(html, /<audio/i);
  assert.doesNotMatch(html, /villa-siena-hero-narration\.wav/);
});
