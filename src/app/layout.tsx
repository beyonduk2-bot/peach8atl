import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/app/globals.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Peach8 ATL · Your MARTA rail matchday cheat sheet",
  description: "A fan-made, phone-first guide to riding MARTA rail on Atlanta matchdays — less parking roulette, more actual soccer."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF7ED" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1117" }
  ]
};

const disclaimer =
  "Peach8 ATL is an unofficial, fan-made MARTA rail matchday guide. It is not affiliated with or endorsed by MARTA, FIFA, Mercedes-Benz Stadium, the City of Atlanta, or any official event organizer. Always double-check official sources before you head out.";

const themeBootScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("peach8-theme");
    const theme = stored === "dark" || stored === "light" ? stored : "light";
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

function Footer() {
  return (
    <footer className="mx-auto mt-6 w-full px-4 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
      <div className="text-center text-[0.68rem] font-semibold leading-4 text-slate-400">
        <p>{disclaimer}</p>
        <div className="mt-3 flex justify-center gap-4 text-[0.68rem] font-black uppercase tracking-[0.12em] text-ocean">
          <Link className="rounded-full focus-ring" href="/about">
            About
          </Link>
          <Link className="rounded-full focus-ring" href="/privacy">
            Privacy
          </Link>
          <Link className="rounded-full focus-ring" href="/sources">
            Sources
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable} data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <head>
        <Script id="peach8-theme-boot" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <div className="hidden border-b border-white/10 bg-[#211c16] px-4 py-3 text-center text-sm font-semibold text-[#ffb347] md:block">
          Peach8 was built for your phone — but it works just fine on the big screen too.
        </div>
        <ThemeProvider>
          <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#0d1117] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <AppHeader />
            {children}
            <Footer />
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
