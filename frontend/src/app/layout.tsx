import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/lib/AuthContext";
import HeaderNav from "@/components/HeaderNav";
import { ArrowUpRight, ArrowRight } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PRACHAR — Phygital Publicity Platform | Bhubaneswar, Odisha",
    template: "%s | PRACHAR",
  },
  description:
    "ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା — PRACHAR bridges high-circulation physical advertising booklets and smart NFC business cards with verified, search-optimized digital profiles across Bhubaneswar and Odisha.",
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
    title: "PRACHAR — Phygital Publicity Platform | Bhubaneswar, Odisha",
    description:
      "Bridging physical advertising booklets and smart cards with verified digital profiles in Bhubaneswar, Odisha.",
    locale: "en_IN",
    type: "website",
    siteName: "PRACHAR",
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
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] selection:bg-[#FFB703] selection:text-black">
        <SmoothScrollProvider>
          <AuthProvider>
            <HeaderNav />
            <main className="flex-1">
              {children}
            </main>
          </AuthProvider>
        </SmoothScrollProvider>

        {/* Brand Appart-Style Editorial Closing Footer */}
        <footer className="relative border-t border-white/10 bg-[#0E0E10] text-sm text-neutral-400">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28">
            {/* Top Large Editorial Statement */}
            <div className="pb-16 border-b border-white/10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="max-w-2xl">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-4">
                  PUT YOUR BUSINESS ON THE MAP
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] font-display">
                  Make your business visible across Odisha.
                </h2>
                <p className="text-base sm:text-lg text-neutral-400 mt-4 leading-relaxed font-normal">
                  50,000+ monthly print copies distributed directly to doorsteps in Bhubaneswar, backed by permanent smart cloud profiles and instant WhatsApp conversion.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
                <Link
                  href="/register"
                  className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm px-7 py-3.5 transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Claim Digital Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/advertise"
                  className="rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm px-6 py-3.5 transition-all inline-flex items-center gap-2"
                >
                  <span>Explore Rate Card</span>
                </Link>
              </div>
            </div>

            {/* Navigation & Business Credentials Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/10">
              {/* Brand Col */}
              <div className="lg:col-span-2 space-y-4">
                <Link href="/" className="inline-block group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black tracking-tight text-white font-display">
                      PRACHAR
                    </span>
                    <span className="text-[10px] font-bold text-[#FFB703] px-2 py-0.5 rounded-full bg-[#FFB703]/10 border border-[#FFB703]/30 uppercase tracking-wider">
                      ODISHA
                    </span>
                  </div>
                </Link>
                <p className="text-sm font-serif text-[#FFB703]/90">
                  ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
                  The unified phygital network bridging high-circulation physical advertising booklets and tactile smart cards with verified digital identity infrastructure.
                </p>
                <div className="pt-2 text-xs text-neutral-500 space-y-1 font-mono">
                  <p>A Unit of <strong className="text-neutral-300">Saroswati Khabar</strong></p>
                  <p>PRGI Registration: <span className="text-neutral-300">ORORI/25/A3295</span></p>
                  <p>MSME Udyam: <span className="text-neutral-300">UDYAM-OD-04-0039313</span></p>
                </div>
              </div>

              {/* Col 1: Platform */}
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 font-mono">
                  Platform
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-400">
                  <li>
                    <Link href="/product" className="hover:text-white transition-colors">
                      Phygital Smart Cards
                    </Link>
                  </li>
                  <li>
                    <Link href="/advertise" className="hover:text-white transition-colors">
                      Rate Matrix (P1–P5)
                    </Link>
                  </li>
                  <li>
                    <Link href="/demo" className="hover:text-white transition-colors">
                      Interactive Simulator
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-white transition-colors">
                      Publicity Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-[#FFB703] hover:underline font-medium">
                      Claim Free Profile →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 2: Logistics */}
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 font-mono">
                  Circulation
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-400">
                  <li>
                    <span className="text-neutral-300 block font-medium">Distribution Hubs</span>
                    <span className="text-xs text-neutral-500">8 Bhubaneswar Sectors</span>
                  </li>
                  <li>
                    <span className="text-neutral-300 block font-medium">Monthly Circulation</span>
                    <span className="text-xs text-neutral-500">50,000+ Door-to-Door</span>
                  </li>
                  <li>
                    <span className="text-neutral-300 block font-medium">Next Press Cutoff</span>
                    <span className="text-xs text-[#FFB703] font-semibold">18th of Every Month</span>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors block pt-1">
                      Historical Heritage &amp; Team
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Direct Desks */}
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 font-mono">
                  Direct Desks
                </h3>
                <div className="space-y-3 text-xs sm:text-sm text-neutral-400">
                  <p className="text-neutral-300">
                    BJB Nagar, Bhubaneswar, Odisha — 751014
                  </p>
                  <div className="space-y-1">
                    <a href="tel:7077011733" className="block text-[#FFB703] hover:underline font-mono text-xs">
                      +91 70770 11733
                    </a>
                    <a href="tel:9178898844" className="block text-[#FFB703] hover:underline font-mono text-xs">
                      +91 91788 98844
                    </a>
                  </div>
                  <div>
                    <a href="mailto:pracharbbsr1@gmail.com" className="text-neutral-400 hover:text-white text-xs break-all">
                      pracharbbsr1@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
              <p>
                &copy; {new Date().getFullYear()} PRACHAR. All rights reserved. Published by Saroswati Khabar, Bhubaneswar.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/about" className="hover:text-neutral-300 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="hover:text-neutral-300 transition-colors">
                  Contact
                </Link>
                <Link href="/advertise" className="hover:text-neutral-300 transition-colors">
                  Rate Card
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
