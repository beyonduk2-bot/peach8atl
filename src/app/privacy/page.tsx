import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | Peach8 ATL"
};

export default function PrivacyPage() {
  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <section className="rounded-[2rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#ffb347]">
          <LockKeyhole aria-hidden="true" size={17} />
          Privacy
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f0f6fc]">No accounts. No saved trip plans.</h1>
        <div className="mt-5 space-y-4 text-base font-semibold leading-7 text-[#8b949e]">
          <p>Peach8 ATL has no user accounts in v1 — there&apos;s nothing to sign up for.</p>
          <p>It doesn&apos;t store your addresses, ZIP codes, email addresses, locations, or trip plans.</p>
          <p>
            Your browser location stays in app memory for the current session only — just long enough to estimate a nearby
            station. Anything you type may be sent to a server-side geocoding helper and the U.S. Census Geocoder to find a
            nearby rail station, but the text, coordinates, and trip plan are never saved.
          </p>
          <p>Your light/dark preference is saved locally as a UI setting only — it never touches the server.</p>
          <p>Analytics are off in v1. No ad tracking, no saved trip history, no profile building.</p>
        </div>
      </section>
    </main>
  );
}
