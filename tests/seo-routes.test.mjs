import assert from "node:assert/strict";
import test from "node:test";

async function fetchPath(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`),
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

test("serves robots.txt with the expected rules and sitemap reference", async () => {
  const response = await fetchPath("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /text\/plain/i);

  const body = await response.text();
  assert.match(body, /User-?agent:\s*\*/i);
  assert.match(body, /Disallow:\s*\/api\//);
  assert.match(body, /Sitemap:\s*https:\/\/cinema-estate\.vercel\.app\/sitemap\.xml/);
});

test("serves sitemap.xml listing the three public routes", async () => {
  const response = await fetchPath("/sitemap.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /application\/xml|text\/xml/i);

  const body = await response.text();
  assert.match(body, /<loc>https:\/\/cinema-estate\.vercel\.app<\/loc>/);
  assert.match(body, /<loc>https:\/\/cinema-estate\.vercel\.app\/terms<\/loc>/);
  assert.match(body, /<loc>https:\/\/cinema-estate\.vercel\.app\/privacy<\/loc>/);
});
