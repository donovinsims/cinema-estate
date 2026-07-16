import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /BEFORE\s*\/\s*STATIC LISTING IMAGE/i);
  assert.match(html, /AFTER\s*\/\s*ONE SLOW CAMERA MOVE/i);
  assert.match(html, /Drag to compare/i);
  assert.match(html, /Watch the transformation/i);
  assert.match(html, /data-comparison-slider/i);
  assert.match(html, /aria-label="Reveal cinematic marketing"/i);
  assert.match(html, /<button[^>]*>Before<\/button>/i);
  assert.match(html, /<button[^>]*>After<\/button>/i);
  assert.match(html, /name="email"/i);
  assert.match(html, /name="website"/i);
  assert.match(html, /You’re on the early-access list\. Look for your launch invite next week\./i);
  assert.match(html, /Plans from\s*<span>\$99<\/span>\s*per listing/i);
  assert.match(html, /local MLS and brokerage rules apply/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});
