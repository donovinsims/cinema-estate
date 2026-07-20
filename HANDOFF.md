# Cinema Estate Handoff

Last updated: 2026-07-20

## Current state

- Product: Cinema Estate, a pre-launch sales page for individual real-estate agents.
- Active branch: `codex/cinema-estate-launch`.
- Latest commits: `a6be709 Add consent-safe early access capture`; `ea7aad7 Use Vercel production URL for site metadata`.
- Production: `https://cinema-estate.vercel.app`.
- Latest Vercel production deployment: `dpl_8hAYHNEjHpVyGTDShpLKcuXx82sh` (ready).
- Native `npx next build` and lint pass. The legacy `npm run build` Vinext build stalls during its client-bundle phase; do not report it as passing.

## What is implemented

- Accessible early-access modal with CTA, engaged-scroll prompt, focus trap, Escape/backdrop dismissal, 14-day dismissal cooldown, and no hard gate on the public demo.
- `/api/early-access` validates email and honeypot server-side and forwards to `SEQUENZY_FORM_ENDPOINT`; the endpoint is stored as a sensitive Vercel environment variable for preview and production.
- Privacy page at `/privacy`, consent UI, PostHog event hooks with no email/PII capture, and Vercel Analytics/Speed Insights components.
- Metadata and social URL are set to `https://cinema-estate.vercel.app`.
- All approved 255 Eldon media is local under `public/media`.

## Sequenzy

- Use **only** the Cinema Estate company: `v26iblogat0kdfyw581h1hb1`.
- Saved form already exists: `Cinema Estate — Early Access Waitlist`, ID `jmab7vbumu415ko0sfkig969`.
- Its public endpoint is already configured in Vercel; do not expose it as a `NEXT_PUBLIC_*` environment variable.
- The form has email input and `website` honeypot. Its form success screen currently uses a straight apostrophe; update it to the exact required copy: `You’re on the early-access list. Look for your launch invite next week.`
- Remaining Sequenzy work: create/enable the welcome-email automation, use the early-access list/tag, and run one real controlled signup after sender verification.
- The Sequenzy MCP is configured in Codex (`codex mcp get sequenzy`), but it was not surfaced as a callable tool in the previous active session. Browser access through Kimi WebBridge works with the supplied company URL.

## DNS and domains

- Website URL stays `https://cinema-estate.vercel.app`. Do **not** attach `ce.sequenzy.com` to Vercel.
- `ce.sequenzy.com` is exclusively the Sequenzy sending domain.
- Cloudflare zone is `sequenzy.com`. Add/verify the Sequenzy dashboard’s required records:
  - DKIM TXT: `sequenzy._domainkey.ce`
  - SPF TXT: `send.ce`
  - bounce MX: `send.ce`
- Keep the existing root DMARC record (`_dmarc.sequenzy.com`, policy `p=quarantine`). Do not replace it with Sequenzy’s optional `p=none` proposal.
- Provision and monitor `privacy@sequenzy.com` before public promotion.

## Remaining launch work

1. Add the Sequenzy sending-domain DNS records in Cloudflare and verify the domain in Sequenzy.
2. Provision `privacy@sequenzy.com`.
3. Add `NEXT_PUBLIC_POSTHOG_KEY` and optional `NEXT_PUBLIC_POSTHOG_HOST` to Vercel, then test consent-gated analytics.
4. Update the saved form success copy and create the welcome-email automation.
5. Submit a controlled real signup and verify Sequenzy list/tag membership, form success state, and delivery.
6. Resolve the GitHub push: `donovinsims/cinema-estate` is private, but pushes stalled during media upload. The local branch is ahead and contains the canonical source.

## Repository hygiene

- The project began with many duplicate local files named `* 2.*`; `.gitignore` now preserves them locally without tracking them. Do not add them to commits.
- Canonical files are under `app/`, `public/media/`, tests, `vercel.json`, and `tsconfig.vercel.json`.
- Remote `sites` remains the original ChatGPT Sites remote. GitHub `origin` is `https://github.com/donovinsims/cinema-estate.git`.
