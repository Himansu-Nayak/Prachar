import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/lib/AuthContext";
import HeaderNav from "@/components/HeaderNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PRACHAR | Phygital Publicity Platform — Bhubaneswar, Odisha",
    template: "%s | PRACHAR Phygital Platform",
  },
  description:
    "ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା — PRACHAR bridges high-circulation physical advertising booklets and smart NFC business cards with responsive, search-optimized digital profiles across Bhubaneswar and Odisha.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  keywords: [
    "Prachar Bhubaneswar",
    "Odisha advertising booklet",
    "Phygital publicity",
    "Digital business card Bhubaneswar",
    "Smart NFC card Odisha",
    "Local advertising Bhubaneswar",
    "Saroswati Khabar",
    "Prachar rate card",
  ],
  authors: [{ name: "PRACHAR / Saroswati Khabar" }],
  creator: "Himansu Nayak",
  openGraph: {
    title: "PRACHAR | Phygital Publicity Platform — Bhubaneswar, Odisha",
    description:
      "Bridging physical advertising booklets and smart cards with verified digital profiles in Bhubaneswar, Odisha.",
    locale: "en_IN",
    type: "website",
    siteName: "PRACHAR Phygital Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRACHAR | Phygital Publicity Platform",
    description: "Bhubaneswar's premier phygital publicity and smart card network.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen bg-[#000000] text-[#FFF3EA] selection:bg-[#E4B592] selection:text-black space-grid-bg">
        {/* 21hrs.space Fixed Viewfinder Perimeter Corners */}
        <div className="fixed top-3 left-3 w-4 h-4 border-t border-l border-[#E4B592]/40 pointer-events-none z-50 hidden sm:block" />
        <div className="fixed top-3 right-3 w-4 h-4 border-t border-r border-[#E4B592]/40 pointer-events-none z-50 hidden sm:block" />
        <div className="fixed bottom-3 left-3 w-4 h-4 border-b border-l border-[#E4B592]/40 pointer-events-none z-50 hidden sm:block" />
        <div className="fixed bottom-3 right-3 w-4 h-4 border-b border-r border-[#E4B592]/40 pointer-events-none z-50 hidden sm:block" />

        <SmoothScrollProvider>
          <AuthProvider>
            <HeaderNav />
            <main className="flex-1">
              {children}
            </main>
          </AuthProvider>
        </SmoothScrollProvider>

        {/* 21hrs.space Museum-Grade Master Aerospace Footer */}
        <footer className="relative border-t border-[#E4B592]/20 bg-[#050811] text-xs text-slate-400 overflow-hidden">
          {/* Top Hairline Telemetry Divider */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#E4B592]/40 to-transparent" />

          {/* Corner reticle brackets for footer */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#E4B592]/60 pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#E4B592]/60 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            {/* Top Telemetry Header Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 border-b border-white/10 font-mono text-[11px]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#FFF3EA] font-bold tracking-wider">ODISHA PHYGITAL RADAR NETWORK</span>
                <span className="text-white/20">/</span>
                <span className="text-[#E4B592]">GRID: 20.2961°N, 85.8245°E</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[10px]">
                <span>CIRCULATION: 50,000+ COPIES</span>
                <span>•</span>
                <span>PRESS: CHANDAN PRINTERS, UNIT-3</span>
                <span>•</span>
                <span className="text-[#E4B592] font-semibold">18TH MONTHLY CUTOFF</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 my-10">
              {/* Brand & Mission Statement */}
              <div className="md:col-span-1 space-y-4">
                <Link href="/" className="inline-block group">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-[-0.03em] text-[#FFF3EA] group-hover:text-white transition">
                      PRACHAR
                    </span>
                    <span className="font-mono text-[9px] font-bold text-[#E4B592] px-1.5 py-0.5 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 uppercase tracking-widest">
                      PHYGITAL
                    </span>
                  </div>
                </Link>
                <p className="text-[13px] font-serif text-[#E4B592]/90">
                  ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  The unified phygital network bridging high-circulation physical advertising booklets and tactile smart cards with verified digital identity infrastructure across Bhubaneswar and Odisha.
                </p>
                <div className="pt-2 text-[10px] text-slate-400 space-y-1 font-mono border-t border-white/5">
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#E4B592]">REG:</span>
                    <span>PRGI ORORI/25/A3295</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#E4B592]">UDYAM:</span>
                    <span>UDYAM-OD-04-0039313</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-[#E4B592]">UNIT:</span>
                    <span>Saroswati Khabar, Bhubaneswar</span>
                  </p>
                </div>
              </div>

              {/* Platform Solutions */}
              <div className="font-mono">
                <h3 className="font-bold text-[#FFF3EA] text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="text-[#E4B592]">[01]</span> ARCHITECTURE
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li>
                    <Link href="/product" className="hover:text-[#E4B592] transition-colors flex items-center gap-1.5">
                      <span>→</span> Phygital Smart Cards
                    </Link>
                  </li>
                  <li>
                    <Link href="/advertise" className="hover:text-[#E4B592] transition-colors flex items-center gap-1.5">
                      <span>→</span> Rate Matrix (P1–P5)
                    </Link>
                  </li>
                  <li>
                    <Link href="/demo" className="hover:text-[#E4B592] transition-colors flex items-center gap-1.5">
                      <span>→</span> Interactive Simulator
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-[#E4B592] transition-colors flex items-center gap-1.5">
                      <span>→</span> Publicity Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-[#E4B592] hover:text-white transition-colors flex items-center gap-1.5 font-bold">
                      <span>★</span> Claim Phygital Profile
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Editorial & Circulation Grid */}
              <div className="font-mono">
                <h3 className="font-bold text-[#FFF3EA] text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="text-[#E4B592]">[02]</span> DISPATCH MATRIX
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li>
                    <span className="text-slate-300 font-semibold">Active Sector:</span>
                    <span className="block text-[11px] text-slate-400">Bhubaneswar (8 Hub Corridors)</span>
                  </li>
                  <li>
                    <span className="text-slate-300 font-semibold">Monthly Print Run:</span>
                    <span className="block text-[11px] text-slate-400">50,000+ Direct Distribution</span>
                  </li>
                  <li>
                    <span className="text-slate-300 font-semibold">Next Publication Cutoff:</span>
                    <span className="block text-[11px] text-[#E4B592] font-bold">18th of Every Month // 18:00 IST</span>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#E4B592] transition-colors flex items-center gap-1.5 pt-1">
                      <span>→</span> Historical Heritage &amp; Team
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Mission Dispatch & Bookings */}
              <div className="font-mono">
                <h3 className="font-bold text-[#FFF3EA] text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="text-[#E4B592]">[03]</span> COMMUNICATOR
                </h3>
                <div className="space-y-3 text-xs">
                  <p className="text-slate-300">
                    A Unit of <strong className="text-[#FFF3EA]">Saroswati Khabar</strong>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    BJB Nagar, Bhubaneswar, Odisha — 751014
                  </p>
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Direct Desks:</span>
                    <a href="tel:7077011733" className="block text-[#E4B592] hover:underline font-mono text-xs">
                      +91 70770 11733
                    </a>
                    <a href="tel:9178898844" className="block text-[#E4B592] hover:underline font-mono text-xs">
                      +91 91788 98844
                    </a>
                  </div>
                  <div>
                    <a href="mailto:pracharbbsr1@gmail.com" className="text-slate-400 hover:text-white text-[11px] break-all">
                      pracharbbsr1@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Technical Telemetry Bar */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-400">
              <p>
                &copy; {new Date().getFullYear()} PRACHAR PHYGITAL SYSTEM • SAROSWATI KHABAR • ALL RIGHTS RESERVED
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-[#E4B592]">FREE DISTRIBUTION</span>
                <span>•</span>
                <span>ODISHA STATEWIDE EXPANSION</span>
                <span>•</span>
                <span>ENGINEERED IN BHUBANESWAR</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
