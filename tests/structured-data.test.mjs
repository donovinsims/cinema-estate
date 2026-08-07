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

function jsonLdNodes(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    (match) => JSON.parse(match[1]),
  );
  return blocks.flatMap((block) => (Array.isArray(block["@graph"]) ? block["@graph"] : [block]));
}

test("structured data includes Organization, three Products, and a FAQPage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  const nodes = jsonLdNodes(html);
  assert.ok(nodes.length > 0, "expected at least one JSON-LD node");

  const organization = nodes.find((node) => node["@type"] === "Organization");
  assert.ok(organization, "Organization must be present");
  assert.equal(organization.name, "Cinema Estate");
  assert.equal(organization.url, "https://cinema-estate.vercel.app");

  const products = nodes.filter((node) => node["@type"] === "Product");
  assert.equal(products.length, 3, "exactly three Product nodes");
  assert.deepEqual(
    products.map((product) => product.offers?.price).sort((a, b) => a - b),
    [149, 299, 549],
    "Product offers must carry the real tier prices",
  );

  const faqPage = nodes.find((node) => node["@type"] === "FAQPage");
  assert.ok(faqPage, "FAQPage must be present");
  assert.ok(
    Array.isArray(faqPage.mainEntity) && faqPage.mainEntity.length >= 4,
    "FAQPage must include at least the four live FAQ questions",
  );

  assert.equal(
    nodes.some((node) => node["@type"] === "Review" || node["@type"] === "AggregateRating"),
    false,
    "no fabricated reviews or aggregate ratings may be emitted",
  );
});

test("JSON-LD prices match the rendered tier prices (anti-drift guard)", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  const jsonLdPrices = jsonLdNodes(html)
    .filter((node) => node["@type"] === "Product")
    .map((product) => String(product.offers?.price));

  assert.deepEqual(jsonLdPrices.sort(), ["149", "299", "549"], "JSON-LD must carry the three canonical prices");
  for (const price of jsonLdPrices) {
    assert.ok(html.includes(`$${price}`), `rendered HTML must show $${price} to stay in sync with JSON-LD`);
  }
});

test("each public route declares its own canonical URL", async () => {
  const expected = [
    ["/", "/"],
    ["/terms", "/terms"],
    ["/privacy", "/privacy"],
  ];
  for (const [pathname, canonicalPath] of expected) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} must respond 200`);
    const html = await response.text();
    const match = html.match(/<link rel="canonical" href="([^"]*)"/);
    assert.ok(match, `${pathname} must emit a canonical link`);
    assert.ok(
      match[1].endsWith(canonicalPath),
      `${pathname} canonical must end with ${canonicalPath}, got ${match[1]}`,
    );
  }
});
