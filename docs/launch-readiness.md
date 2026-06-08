# Peach8 ATL Launch Readiness

Last checked: 2026-06-06 EDT

## Current Status

Peach8 ATL is deployed to Production and has passed post-deploy smoke checks on the public Production alias.

Continue post-launch monitoring during the first public day.

## Verified

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run launch:preflight` passes with no blockers.
- `npm run launch:check-preview -- <preview-url>` is available for hosted Preview smoke checks.
- `npm run build` passes locally when run outside the restricted sandbox.
- `npx --yes vercel@latest build --prod --yes` passes and creates `.vercel/output`.
- Node is pinned through `package.json` and `package-lock.json` with `>=24 <25`.
- Runtime dependencies are pinned to exact versions.
- `.env.example` contains only the placeholder `MARTA_API_KEY` example.
- Vercel project linking is present locally for `peach8atl`.
- Vercel has `MARTA_API_KEY` encrypted for both Preview and Production.
- `.env`, `.env.*`, `.env.local*`, `.next`, `.vercel`, and `node_modules` are excluded from Vercel upload through `.vercelignore`.
- `.env.local*` and `.vercel` are ignored locally through `.gitignore`.
- `.env.localopen` has been deleted.
- The uploaded/static background rail map image has been removed from the app surface; the inline rail map now renders from the custom SVG component.
- The plan page renders the station card and rail map without horizontal overflow on the checked local Doraville route.
- User-facing placeholder copy found in the official-check card and privacy page has been replaced.
- Local `/api/rail-arrivals?station=Doraville` returns `isMock: false` with live arrival rows when the local key is present.
- Latest protected Preview passed authenticated smoke checks.
- Vercel-authenticated Preview smoke checks return `HTTP 200` for:
  - `/`
  - `/plan?stationId=doraville`
  - `/plan?stationId=north-springs`
  - `/tips`
  - `/sources`
  - `/privacy`
- Vercel-authenticated Preview `/api/rail-arrivals?station=Doraville` returns `isMock: false` with live arrival rows.
- Production is Ready:
  - Public domain: `https://peach8atl.com`
  - Vercel alias: `https://peach8atl.vercel.app`
- `npm run launch:check-preview -- https://peach8atl.vercel.app` passes for:
  - `/`
  - `/plan?stationId=doraville`
  - `/plan?stationId=north-springs`
  - `/tips`
  - `/sources`
  - `/privacy`
  - `/api/rail-arrivals?station=Doraville`
- Production `/api/rail-arrivals?station=Doraville` returns `isMock: false` with live arrival rows.

## Remaining Gates

- Do one final mobile pass on the public Production URL.
- Continue first-day post-launch watch for hosted API, mobile text clipping, route overlay mismatches, and copy/compliance issues.

## Deployment Notes

- The rail-arrivals API reads `MARTA_API_KEY` only on the server.
- Never rename the key to `NEXT_PUBLIC_MARTA_API_KEY`.
- Production deployment used the verified Vercel output from `.vercel/output`.
- If Vercel environment variables are added or changed, redeploy after saving them.
- The current Preview is protected by Vercel Deployment Protection. Direct unauthenticated `launch:check-preview` calls return `401`; use a Shareable Link for external review or Vercel-authenticated `vercel curl` checks for internal smoke testing.
- Use `docs/production-deploy-runbook.md` for the Preview, Production, rollback, and post-launch sequence.
