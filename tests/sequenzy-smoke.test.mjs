import assert from "node:assert/strict";
import test from "node:test";

/**
 * Live smoke test for the Sequenzy email integration.
 *
 * `/api/early-access` is only fully live when it is deployed AND the server-only
 * `SEQUENZY_FORM_ENDPOINT` env var is configured on the host, so this test pings a
 * real deployed origin instead of the built worker:
 *   - invalid email  -> 400 (client-side validation ran)
 *   - missing email  -> 400 (validation ran)
 *   - valid email    -> 200 (env var is configured AND Sequenzy accepted the POST;
 *                       a missing env var would return 503, an upstream failure 502)
 *
 * Opt-in on purpose: without `SEQUENZY_SMOKE_URL` the tests skip, so the normal
 * `npm test` run stays offline and never writes to the Sequenzy dashboard. Each
 * run of the valid-email case sends ONE real submission to the owner's Sequenzy
 * dashboard (form "Cinema Estate — Early Access Waitlist") — delete the
 * `smoke-test-*@example.com` entries after verifying.
 *
 * Run (no build step needed):
 *   SEQUENZY_SMOKE_URL=https://cinema-estate.vercel.app node --test tests/sequenzy-smoke.test.mjs
 */
const baseUrl = (process.env.SEQUENZY_SMOKE_URL ?? "").replace(/\/+$/, "");
const skip = baseUrl
  ? false
  : "Set SEQUENZY_SMOKE_URL to the deployed origin (e.g. SEQUENZY_SMOKE_URL=https://cinema-estate.vercel.app) to run the live Sequenzy smoke test.";
const endpoint = `${baseUrl}/api/early-access`;

function post(email) {
  return fetch(endpoint, {
    method: "POST",
    body: new URLSearchParams(email ? { email } : {}),
    cache: "no-store",
  });
}

async function readJson(response) {
  assert.match(response.headers.get("content-type") ?? "", /application\/json/i);
  return response.json();
}

test("rejects an invalid email with 400 and the published validation message", { skip, timeout: 15000 }, async () => {
  const response = await post("not-an-email");
  assert.equal(response.status, 400);
  const payload = await readJson(response);
  assert.equal(payload.error, "Enter a valid email address.");
});

test("rejects a missing email with 400", { skip, timeout: 15000 }, async () => {
  const response = await post("");
  assert.equal(response.status, 400);
  const payload = await readJson(response);
  assert.equal(payload.error, "Enter a valid email address.");
});

test("accepts a valid email with 200, proving Sequenzy accepted the submission", { skip, timeout: 15000 }, async () => {
  const response = await post(`smoke-test-${Date.now()}@example.com`);
  assert.equal(response.status, 200);
  const payload = await readJson(response);
  assert.equal(payload.ok, true);
});
