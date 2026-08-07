# Cinema Estate

Cinema Estate turns agents' approved listing photography into a cinematic marketing package: video tours, narration, a listing page, and a final film. The public site is a Vinext/Next.js single page.

## Contributor setup

Requires Node.js 22.13 or newer. Install development dependencies explicitly because production-oriented shells can omit the tools Vinext and ESLint need:

```bash
npm ci --include=dev
npm run dev
```

## Verification

Run the release sequence before a review:

```bash
npm run lint
npm test
git diff --check
```

`npm test` builds the app and runs the full Node test suite. For UI work, also verify the local conversion journey at 375px and 1440px, including reduced motion.

To re-verify the live Sequenzy email integration on demand (opt-in; each run sends one real submission to the Sequenzy dashboard, labeled `smoke-test-*@example.com`):

```bash
SEQUENZY_SMOKE_URL=https://cinema-estate.vercel.app node --test tests/sequenzy-smoke.test.mjs
```

## Public routes and conversion paths

- `/` — marketing page; pricing is the primary action.
- `/privacy` and `/terms` — published policy and purchase terms.
- `/api/early-access` — first-party email-capture endpoint.

The three pricing cards send visitors to Polar hosted checkout. Early access is intentionally secondary: `WaitlistForm` posts only to `/api/early-access`, which forwards on the server using `SEQUENZY_FORM_ENDPOINT`. Never expose that server-only value or add it as a public client variable.

Polar checkout links can be verified by navigation only; do not create a real purchase. The owner alone completes Polar payout and tax/bank verification as an operational follow-up; it is not a branch-review, merge, or deployment blocker. A green branch, merged PR, deployed site, and live verification are separate release states.
