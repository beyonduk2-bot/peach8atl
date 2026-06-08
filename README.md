# Peach8 ATL

Peach8 ATL is a mobile-first, unofficial fan-made MARTA rail matchday companion. V1 is intentionally focused on one job: help a visitor see the next Atlanta match, find a nearby MARTA rail station, check the next train, and decide whether they need to move now.

## What is included

- Next.js App Router, TypeScript, and Tailwind CSS
- No database, no user accounts, no ads
- Static data in `src/data/matches.ts`, `src/data/stations.ts`, and `src/data/recommendationRules.ts`
- Compact widget-style Go screen with match chips across eight Atlanta matchdays
- MARTA-rail-station-first flow with `Find my nearest MARTA rail station`
- Nearest-station flow using browser geolocation after the user taps the CTA, or server-side address lookup through the free U.S. Census Geocoder
- Live/sample next-train hero with conservative kickoff buffer messaging
- Compact Google Maps, Apple Maps, Uber, and Lyft handoff links
- Pulsing mini MARTA rail map toward SEC District Station and the stadium area
- Light/dark theme toggle with a local UI preference only
- Atlanta stadium-area weather card using the public National Weather Service API
- Planner home at `/`
- Station detail page at `/plan`
- Tips, links, about, and privacy pages
- Server-only rail arrivals API proxy at `/api/rail-arrivals`
- Server-side weather proxy at `/api/weather`
- Server-side geocoding helper at `/api/geocode`; no paid maps API key is required
- Development-only analytics stub in `src/lib/analytics.ts`

## Legal and disclaimer notes

Peach8 ATL is an unofficial fan-made MARTA rail matchday guide. It is not affiliated with or endorsed by MARTA, FIFA, Mercedes-Benz Stadium, the City of Atlanta, or any official event organizer. Always check official sources before traveling.

This project intentionally does not use official logos, marks, emblems, mascots, trophy images, official patterns, or official brand assets. UI copy should continue to use neutral wording such as "Atlanta matchday", "soccer match", "stadium area", "MARTA rail", "transit", and "fan-made guide".

## Privacy posture

Version 1 does not store user addresses, ZIP codes, emails, location, or trip plans. There are no user accounts. Location permission is requested only after the user taps the station-finding CTA. Coordinates from browser geolocation stay in browser state for the current session. Typed starting points may be sent to the server-side geocoding helper and the U.S. Census Geocoder to estimate a nearby MARTA rail station, but Peach8 ATL does not store the text, coordinates, or trip plan. The theme toggle stores only `peach8-theme` as a local UI preference.

## Environment variables

Create `.env.local` in the project root to test live rail arrivals locally:

```bash
touch .env.local
```

Add the server-side key:

```bash
MARTA_API_KEY=your_marta_api_key_here
```

The key is read only inside `src/app/api/rail-arrivals/route.ts` and is not exposed to browser code. Do not prefix this variable with `NEXT_PUBLIC_`; variables with that prefix are bundled into client-side JavaScript. If no key is present, or if the key is not active yet, the route returns sample data with `isMock: true`.

`.env.local` is ignored by git. Never commit API keys, screenshots of keys, copied dashboard values, or deployment secrets.

### Deployment variables

For Vercel:

1. Open the Vercel project dashboard.
2. Go to Settings, then Environment Variables.
3. Add `MARTA_API_KEY` for the environments you need, usually Preview and Production.
4. Redeploy after saving the variable.

For Cloudflare:

1. Open the Cloudflare project dashboard.
2. Go to Workers & Pages, select the project, then Settings.
3. Add `MARTA_API_KEY` under Variables and Secrets for the target environment.
4. Redeploy after saving the variable.

Keep the variable name exactly `MARTA_API_KEY` in local and hosted environments.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the GitHub repo in Vercel.
3. Add the environment variable `MARTA_API_KEY` in Vercel Project Settings. Use the same name exactly and do not use `NEXT_PUBLIC_`.
4. Deploy a Preview build.
5. Test these Preview URLs:
   - `/`
   - `/plan`
   - `/tips`
   - `/sources`
   - `/privacy`

`.env.local` is local-only and should never be committed. Use Vercel environment variables for hosted previews and production.

### Current release gate

- Local live rail API works with the local `MARTA_API_KEY`.
- Vercel project settings are linked for `peach8atl`.
- Vercel Preview/Production currently need `MARTA_API_KEY` added before live rail timing will work outside local development.
- Latest local and Vercel production builds passed on 2026-06-06.
- See `docs/launch-readiness.md` for the current deployment checklist and remaining gates.
- See `docs/production-deploy-runbook.md` for the Preview-to-Production sequence and rollback notes.
- Local secret files are excluded by `.gitignore` and `.vercelignore`.
- Remove any accidental local secret copies before final handoff.

## Manual MVP QA

- Open `/` and confirm the Go tab defaults to the next upcoming Atlanta match.
- Toggle light/dark mode and confirm cards, bottom nav, and text remain readable.
- Confirm the Weather card loads an Atlanta stadium-area forecast or a clear unavailable state.
- Tap the `M1` through `M8` match chips and confirm any of the 8 matches can be previewed.
- Confirm no cover page, weather widget, language selector, video tutorial, bus-first route form, ads, or city-guide content appears in the Go flow.
- Confirm the station finder appears as the primary action.
- Tap `Find my nearest MARTA rail station` and confirm browser geolocation is requested only after the tap.
- If location is denied, confirm the helper says to enter a hotel, address, area, or station instead.
- Enter `EVEN Hotel Atlanta - Ballpark Area by IHG` and confirm the app suggests a north-side MARTA rail station, not Airport Station.
- Enter `airport`, `ATL`, or `Hartsfield` and confirm Airport Station guidance appears.
- Confirm mock/unavailable live data says to check the route before leaving and does not create fake urgency.
- On `/plan`, confirm the station card, specific route steps, mini MARTA rail path, live/sample train card, compact app buttons, and Before You Go accordion.
- Use the bottom nav to open `Go`, `Tips`, `Links`, and `About`.
- Confirm Google Maps buttons open `https://www.google.com/maps/dir/?api=1` URLs only.
- Confirm Apple Maps, Uber, and Lyft buttons open external app/web links.
- Confirm all travel, parking, and policy-related guidance asks users to check an official source before leaving.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Useful checks:

```bash
npm run typecheck
npm run lint
npm run launch:preflight
npm run build
```

After deploying a Preview, check the hosted URL:

```bash
npm run launch:check-preview -- https://your-preview-url.vercel.app
```

## Launch checklist

- Match dates and listed Atlanta matchdays were checked against MARTA and FIFA public schedule references on 2026-06-06.
- Station parking fields were checked against MARTA parking availability and parking fee pages on 2026-06-06.
- Verify event-day station access, walking routes, street closures, bag rules, and service alerts.
- Confirm live MARTA rail arrivals with an activated server-side API key.
- Confirm weather wording and NWS forecast behavior close to match week.
- Add a production analytics plan only after privacy review.
- Review every UI page for unofficial wording and absence of protected marks.
- Test map handoff links on iOS and Android.

## TODO

- TODO: Re-check match schedule data close to public launch and again during match week.
- TODO: Re-check MARTA parking and long-term parking status close to public launch.
- TODO: Confirm the best stadium-area exit station guidance for event-day operations.
- TODO: Expand place-name hints for hotels and visitor districts that public geocoding may not resolve reliably.
- TODO: Add copy review for legal/compliance before public deployment.
