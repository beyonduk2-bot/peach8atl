# Peach8 ATL Production Deploy Runbook

Last updated: 2026-06-06 EDT

Latest Production deployment:

- Public domain: `https://peach8atl.com`
- Public alias: `https://peach8atl.vercel.app`
- Status: Ready
- Post-deploy smoke check: Passed

Use this runbook only after the launch gates in `docs/launch-readiness.md` are cleared.

## Hard Stop Gates

Do not deploy Production while any of these are true:

- `.env.localopen` exists.
- Vercel Preview does not have `MARTA_API_KEY`.
- Vercel Production does not have `MARTA_API_KEY`.
- `npm run launch:preflight` reports `BLOCKER`.
- Hosted Preview fails `npm run launch:check-preview -- <preview-url>`.
- The hosted rail-arrivals API returns `isMock: true` after the hosted key is expected to be active.
- The user has not explicitly approved the Production deploy.

Note: Protected Preview URLs can return `401` to unauthenticated scripts. For protected Previews, verify with either a Vercel Shareable Link or Vercel-authenticated `vercel curl` requests.

## Step 1: Local Preflight

Run:

```bash
npm run typecheck
npm run lint
npm run launch:preflight
npm run build
```

Expected:

- Typecheck passes.
- Lint passes.
- Build passes.
- Preflight has no `BLOCKER`.

If preflight blocks only because `.env.localopen` exists, delete that file only after explicit approval.

## Step 2: Vercel Environment Variables

Add the server-only key to Vercel:

- Variable name: `MARTA_API_KEY`
- Environments: Preview and Production
- Do not use `NEXT_PUBLIC_`

This is an owner action. Do not paste the key into chat or commit it to the repo.

After saving variables, deploy a new Preview. Old Preview deployments may not pick up changed environment variables.

## Step 3: Preview Deploy

Deploy a Preview build first.

After Vercel returns the Preview URL, run:

```bash
npm run launch:check-preview -- <preview-url>
```

If the Preview is protected by Vercel Deployment Protection, either create a Shareable Link first or use authenticated Vercel checks:

```bash
npx --yes vercel@latest curl '/' --deployment <preview-url> -- --head
npx --yes vercel@latest curl '/plan?stationId=doraville' --deployment <preview-url> -- --head
npx --yes vercel@latest curl '/plan?stationId=north-springs' --deployment <preview-url> -- --head
npx --yes vercel@latest curl '/api/rail-arrivals?station=Doraville' --deployment <preview-url>
```

Expected:

- Home, plan, tips, sources, and privacy pages return 200.
- Doraville and North Springs plan pages render expected station text.
- `/api/rail-arrivals?station=Doraville` returns live rows, not sample data.

## Step 4: Manual Mobile QA

Open the Preview on a phone-width viewport and check:

- Home screen does not horizontally scroll.
- Match countdown card text is not clipped.
- Station finder CTA is clear.
- Plan page station card is readable.
- Rail map is visible inline.
- Soccer ball route overlay stays above station dots.
- Start and SEC District labels pulse only where intended.
- Bottom navigation does not cover key content.

## Step 5: Production Deploy

Deploy Production only after Preview passes automated and manual QA.

If `.vercel/output` was produced by a fresh `npx --yes vercel@latest build --prod --yes`, deploy the verified output:

```bash
npx --yes vercel@latest deploy --prebuilt --prod --yes
```

Otherwise, run a fresh Production deploy:

```bash
npx --yes vercel@latest deploy --prod --yes
```

Immediately after Production deploy, run:

```bash
npm run launch:check-preview -- <production-url>
```

Then manually check:

- `/`
- `/plan?stationId=doraville`
- `/plan?stationId=north-springs`
- `/privacy`
- `/sources`

## Rollback Plan

If Production fails:

1. Revert to the previous known-good Vercel deployment from the Vercel dashboard.
2. Re-run `npm run launch:check-preview -- <production-url>`.
3. Check `/api/rail-arrivals?station=Doraville` again.
4. Do not attempt a second Production deploy until the failing cause is identified locally or in Preview.

For hosted rollback, use Vercel's dashboard rollback/promote controls and re-check the public domain after rollback.

## Post-Launch Watch

During the first public day, watch for:

- Hosted API returning sample data unexpectedly.
- Mobile text clipping on the countdown or station cards.
- Map overlay route mismatch for different start stations.
- Official transit schedule or event guidance changes.
- Any copy that could imply official endorsement.
