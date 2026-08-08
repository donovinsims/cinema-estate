import assert from "node:assert/strict";
import test from "node:test";

/**
 * Route-level tests for /api/listing-plan (preview + generate), exercising the
 * built worker (dist/server/index.js) exactly like the render/SEO tests do.
 *
 * Sequenzy calls are intercepted by swapping global fetch, so `npm test` stays
 * fully offline. The consent-false invariant is asserted structurally: with
 * consent false, no request may ever reach the /subscribers marketing endpoint,
 * and the transactional payload must not carry marketing tags/lists.
 */

const PREVIEW_PROFILE = {
  propertyType: "Single-family",
  city: "Austin",
  state: "TX",
  listingStatus: "Preparing to list",
  launchTiming: "Within 30 days",
  differentiators: ["Renovated kitchen", "Waterfront view"],
  propertyNotes: "",
  assets: {
    photography: "Approved photography ready",
    floorPlan: "Not planned",
    propertyVideo: "Not planned",
    drone: "Not planned",
    propertyPage: "Not planned",
    social: "Not planned",
    email: "Not planned",
    print: "Not planned",
    openHouse: "Not planned",
    brandedAssets: "Not planned",
  },
  channels: ["MLS", "Instagram"],
  priorities: { primary: "Present the listing professionally" },
  marketingSupport: "No",
  photographyStatus: "Approved photography ready",
};

const PROFITABLE_BODY = JSON.stringify({ ...PREVIEW_PROFILE, email: "agent@example.com", marketingConsent: false });

async function buildWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

/** Replace global fetch with a recorder that answers Sequenzy's API, so no real network traffic occurs. */
function stubSequenzy({ transactionalStatus = 200, subscriberStatus = 200 } = {}) {
  const calls = [];
  const previous = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("api.sequenzy.com")) {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      calls.push({ url, body });
      if (url.endsWith("/transactional/send")) {
        return new Response(JSON.stringify({ emailSendId: "send_test_1" }), {
          status: transactionalStatus,
          headers: { "content-type": "application/json" },
        });
      }
      if (url.endsWith("/subscribers")) {
        return new Response(JSON.stringify({ id: "sub_test_1" }), {
          status: subscriberStatus,
          headers: { "content-type": "application/json" },
        });
      }
    }
    throw new Error(`unexpected fetch to ${url}`);
  };
  return { calls, restore() { globalThis.fetch = previous; } };
}

async function post(worker, pathname, body, headers = {}) {
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function readJson(response) {
  assert.match(response.headers.get("content-type") ?? "", /application\/json/i);
  return response.json();
}

test("preview returns a deterministic score, segment, strengths, gaps, doNow, and fit", async () => {
  const worker = await buildWorker();
  const res = await post(worker, "/api/listing-plan?action=preview", PREVIEW_PROFILE);
  assert.equal(res.status, 200);
  const data = await readJson(res);

  assert.equal(typeof data.score?.totalScore, "number");
  assert.ok(Array.isArray(data.strengths));
  assert.ok(Array.isArray(data.gaps));
  assert.ok(Array.isArray(data.doNow));
  assert.equal(typeof data.segment, "string");
  assert.equal(typeof data.readinessInterpretation, "string");
  assert.ok(["none", "possible", "strong"].includes(data.cinemaEstateFit?.strength));
});

test("generate returns the full plan and never drops the plan when delivery fails", async () => {
  const worker = await buildWorker();
  const stub = stubSequenzy({ transactionalStatus: 500 });
  try {
    process.env.SEQUENZY_API_KEY = "test-key";
    const res = await post(worker, "/api/listing-plan?action=generate", JSON.parse(PROFITABLE_BODY));
    const data = await readJson(res);

    assert.equal(data.deliveryStatus, "failed");
    assert.equal(data.marketingSubscribed, false);
    assert.equal(typeof data.sellerFacingSummary, "string");
    assert.ok(Array.isArray(data.beforeLaunch));
    assert.ok(Array.isArray(data.sellerTalkingPoints));
    assert.equal(data.cinemaEstateFit?.relevant, true, "photography-ready profile should get a fit recommendation");
  } finally {
    delete process.env.SEQUENZY_API_KEY;
    stub.restore();
  }
});

test("generate queues the transactional email and reports deliveryStatus queued on 2xx", async () => {
  const worker = await buildWorker();
  const stub = stubSequenzy();
  try {
    process.env.SEQUENZY_API_KEY = "test-key";
    const res = await post(worker, "/api/listing-plan?action=generate", JSON.parse(PROFITABLE_BODY));
    const data = await readJson(res);

    assert.equal(data.deliveryStatus, "queued");
    assert.equal(data.marketingSubscribed, false);
    assert.ok(stub.calls.some((c) => c.url.endsWith("/transactional/send")), "transactional send must be attempted");
  } finally {
    delete process.env.SEQUENZY_API_KEY;
    stub.restore();
  }
});

test("consent=false never calls the marketing subscriber endpoint", async () => {
  const worker = await buildWorker();
  const stub = stubSequenzy();
  try {
    process.env.SEQUENZY_API_KEY = "test-key";
    const res = await post(worker, "/api/listing-plan?action=generate", JSON.parse(PROFITABLE_BODY));
    assert.equal(res.status, 200);
    await readJson(res);

    assert.ok(
      stub.calls.every((c) => !c.url.endsWith("/subscribers")),
      "with consent false, no request may hit the /subscribers marketing endpoint",
    );
    const txn = stub.calls.find((c) => c.url.endsWith("/transactional/send"));
    assert.ok(txn, "transactional send must still be attempted");
    assert.equal(txn.body.tags, undefined, "transactional payload must not carry marketing tags");
    assert.equal(txn.body.lists, undefined, "transactional payload must not carry marketing lists");
    assert.ok(txn.body.to === "agent@example.com" && txn.body.subject && txn.body.body, "direct-HTML payload: to/subject/body");
  } finally {
    delete process.env.SEQUENZY_API_KEY;
    stub.restore();
  }
});

test("consent=true enrolls the marketing subscriber with listing-plan tags and no transactional tags", async () => {
  const worker = await buildWorker();
  const stub = stubSequenzy();
  try {
    process.env.SEQUENZY_API_KEY = "test-key";
    process.env.SEQUENZY_LISTING_PLAN_LIST_ID = "list_lp_1";
    const body = { ...JSON.parse(PROFITABLE_BODY), marketingConsent: true };
    const res = await post(worker, "/api/listing-plan?action=generate", body);
    const data = await readJson(res);

    assert.equal(data.marketingSubscribed, true);

    const txn = stub.calls.find((c) => c.url.endsWith("/transactional/send"));
    assert.equal(txn.body.tags, undefined, "transactional payload must not carry tags even with consent");
    assert.equal(txn.body.lists, undefined, "transactional payload must not carry lists even with consent");

    const sub = stub.calls.find((c) => c.url.endsWith("/subscribers"));
    assert.ok(sub, "consent=true must create/merge the marketing subscriber");
    assert.deepEqual(sub.body.tags, ["lead-magnet", "listing-plan", "cinema-estate-prospect"]);
    assert.deepEqual(sub.body.lists, ["list_lp_1"]);
    assert.equal(sub.body.duplicateStrategy, "merge");
  } finally {
    delete process.env.SEQUENZY_API_KEY;
    delete process.env.SEQUENZY_LISTING_PLAN_LIST_ID;
    stub.restore();
  }
});

test("invalid email is rejected with 400 and a clear message", async () => {
  const worker = await buildWorker();
  const res = await post(worker, "/api/listing-plan?action=generate", { ...PREVIEW_PROFILE, email: "not-an-email" });
  assert.equal(res.status, 400);
  const data = await readJson(res);
  assert.match(data.error ?? "", /valid email/i);
});

test("invalid JSON is rejected with 400", async () => {
  const worker = await buildWorker();
  const res = await post(worker, "/api/listing-plan?action=preview", "{not valid json");
  assert.equal(res.status, 400);
  const data = await readJson(res);
  assert.match(data.error ?? "", /invalid json/i);
});

test("invalid profile (missing required field) is rejected with 400", async () => {
  const worker = await buildWorker();
  const res = await post(worker, "/api/listing-plan?action=preview", { city: "Austin" });
  assert.equal(res.status, 400);
  const data = await readJson(res);
  assert.match(data.error ?? "", /property type is required/i);
});

test("oversized bodies are rejected with 413 regardless of the content-length header", async () => {
  const worker = await buildWorker();
  const bigProfile = { ...PREVIEW_PROFILE, propertyNotes: "x".repeat(70 * 1024) };
  // Deliberately do NOT send a content-length header; the route must enforce the cap on the read body.
  const res = await post(worker, "/api/listing-plan?action=preview", bigProfile);
  assert.equal(res.status, 413);
  const data = await readJson(res);
  assert.match(data.error ?? "", /too large/i);
});

test("honeypot submissions are accepted without running any work", async () => {
  const worker = await buildWorker();
  const res = await post(worker, "/api/listing-plan?action=generate", { ...JSON.parse(PROFITABLE_BODY), website: "http://spam.example" });
  assert.equal(res.status, 200);
  const data = await readJson(res);
  assert.deepEqual(data, { ok: true });
});

test("unknown action is rejected with 400", async () => {
  const worker = await buildWorker();
  const res = await post(worker, "/api/listing-plan?action=bogus", JSON.parse(PROFITABLE_BODY));
  assert.equal(res.status, 400);
  const data = await readJson(res);
  assert.match(data.error ?? "", /invalid action/i);
});
