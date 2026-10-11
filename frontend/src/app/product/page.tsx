import type { Metadata } from "next";
import Link from "next/link";
import {
  Smartphone,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Zap,
  Layers,
  Sliders,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Product Architecture — Phygital Smart Identity Ecosystem | PRACHAR",
  description:
    "Explore the complete PRACHAR phygital stack: contactless NFC smart cards, dynamic QR edge redirect engine, and verified digital micro-profiles for Bhubaneswar businesses.",
};

export default function ProductPage() {
  const comparisonFeatures = [
    {
      feature: "Contact Sharing Protocol",
      traditional: "Single-use paper card that gets misplaced or discarded",
      prachar: "Contactless NFC tap or permanent dynamic QR code resolution",
    },
    {
      feature: "Dynamic Telemetry Updates",
      traditional: "Requires costly re-printing of 500+ physical cards",
      prachar: "Instant real-time update in dashboard (zero reprinting cost)",
    },
    {
      feature: "Direct Conversion Triggers",
      traditional: "Manual error-prone typing of 10-digit phone number",
      prachar: "1-Tap WhatsApp, 1-Tap Call, 1-Tap Save to Contacts (vCard RFC 6350)",
    },
    {
      feature: "Catalog & Service Display",
      traditional: "Restricted to microscopic text on 3.5\" × 2\" cardboard",
      prachar: "Rich multimedia digital profile with live services & pricing",
    },
    {
      feature: "Regional Print Reach",
      traditional: "Distributed individually by hand with limited recall",
      prachar: "Amplified across 50,000+ monthly print booklet door distribution",
    },
    {
      feature: "Scan Telemetry & Visibility",
      traditional: "Zero metric attribution on recipient engagement",
      prachar: "Live dashboard tracking scans, device types & referral channels",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-[#EDEDED] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Product Hero */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
            <span>PHYGITAL ARCHITECTURE • TELEMETRY &amp; HARDWARE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] font-display">
            Physical Presence Meets <br />
            <span className="text-neutral-400">Digital Agility.</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 mt-5 leading-relaxed font-normal mb-8">
            PRACHAR bridges high-trust tactile interactions with fast, search-indexed digital infrastructure across Bhubaneswar. Zero app downloads, zero paper waste, verified local reach.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm px-7 py-3.5 transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <span>Claim Phygital Card</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm px-6 py-3.5 transition-all"
            >
              <span>Open Card Simulator</span>
            </Link>
          </div>
        </div>

        {/* 3-Pillar Deep Dive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {/* Component 1: NFC Smart Card */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFB703]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFB703] mb-6 group-hover:bg-[#FFB703]/10 transition-colors">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-[#FFB703] font-bold uppercase tracking-wider block mb-1">
                HARDWARE LAYER • ISO/IEC 14443-A
              </span>
              <h2 className="text-xl font-bold text-white mb-1 font-display">
                Contactless NFC Card
              </h2>
              <p className="text-sm text-[#FFB703] font-serif italic mb-4">
                ସ୍ମାର୍ଟ ବିଜିନେସ କାର୍ଡ
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal mb-6">
                Machined from premium matte obsidian polymer with integrated NTAG215 contactless telemetry. Tap against any smartphone to project your profile in under 1 second.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-300 font-normal">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB703] flex-shrink-0" />
                  <span>Compatible with iOS &amp; modern Android</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB703] flex-shrink-0" />
                  <span>Waterproof, scratch-resistant matte finish</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB703] flex-shrink-0" />
                  <span>Laser-etched high-density reverse QR code</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-white/10 font-mono text-xs text-neutral-500">
              Zero app installation required for receivers.
            </div>
          </div>

          {/* Component 2: Dynamic QR Engine */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 mb-6 group-hover:bg-sky-400/10 transition-colors">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider block mb-1">
                ROUTING LAYER • EDGE TELEMETRY
              </span>
              <h2 className="text-xl font-bold text-white mb-1 font-display">
                Dynamic QR Engine
              </h2>
              <p className="text-sm text-sky-400 font-serif italic mb-4">
                ସ୍ମାର୍ଟ ଡାଇନାମିକ କ୍ୟୁ.ଆର ରାଉଟିଂ
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal mb-6">
                Unlike static QR codes that break if a link changes, PRACHAR uses persistent UUID routing tokens (<code className="text-sky-300 font-mono bg-white/5 px-1.5 py-0.5 rounded">/qr/:uuid</code>) that dynamically resolve to your active profile.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-300 font-normal">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>Printed codes never expire or go obsolete</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>Instant destination URL redirection updates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>Sub-50ms Redis-cached 302 redirection</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-white/10 font-mono text-xs text-neutral-500">
              High error-correction ZXing vector rendering.
            </div>
          </div>

          {/* Component 3: Verified Digital Micro-Profile */}
          <div className="bg-[#0E0E12] border border-white/10 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-400/10 transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                WEB EXPERIENCE LAYER • OPENGRAPH
              </span>
              <h2 className="text-xl font-bold text-white mb-1 font-display">
                Verified Micro-Profile
              </h2>
              <p className="text-sm text-emerald-400 font-serif italic mb-4">
                ଭେରିଫାଏଡ଼ ଡିଜିଟାଲ ପ୍ରୋଫାଇଲ
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal mb-6">
                Lightning-fast server-rendered digital profile (<code className="text-emerald-300 font-mono bg-white/5 px-1.5 py-0.5 rounded">/u/:username</code>). Optimized for Google search indexing, rich OpenGraph previews, and instant conversion.
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-300 font-normal">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>1-Tap WhatsApp chat with prefilled context</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>1-Click vCard RFC 6350 address book download</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Service listings, pricing &amp; store location</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-white/10 font-mono text-xs text-neutral-500">
              OpenGraph, Twitter card &amp; canonical URL ready.
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-24">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block mb-3">
              COMPARATIVE SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
              Traditional Paper vs. PRACHAR Phygital.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0E0E12]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-neutral-300 font-mono">
                  <th className="p-5 font-bold uppercase tracking-wider text-[#FFB703]">
                    Capability Specification
                  </th>
                  <th className="p-5 font-semibold text-neutral-400 uppercase tracking-wider">
                    Traditional Visiting Card
                  </th>
                  <th className="p-5 font-bold text-white uppercase tracking-wider">
                    PRACHAR Phygital Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-medium text-white font-display">
                      {row.feature}
                    </td>
                    <td className="p-5 text-neutral-400">
                      {row.traditional}
                    </td>
                    <td className="p-5 text-[#FFB703] font-semibold">
                      {row.prachar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Standards & Security Grid */}
        <div className="bg-[#0E0E12] border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB703]" />
              <span>SECURITY &amp; COMPLIANCE STANDARDS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Technical Reliability &amp; Governance.
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Engineered with modern resilient standards for Bhubaneswar commercial entities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm font-display">
                DPDP Act 2023 Compliant
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Strict Indian privacy compliance with explicit user consent, encrypted telemetry, and zero third-party broker sharing.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FFB703]/10 border border-[#FFB703]/20 flex items-center justify-center text-[#FFB703] mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm font-display">
                Sub-50ms Redirection
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Redis-backed dynamic routing engine ensures instantaneous scan loading at busy retail counters and clinics.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm font-display">
                Passive 13.56 MHz NFC
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                NTAG215 hardware operates without batteries or electrical charging, functioning reliably indefinitely across all environments.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm font-display">
                Merchant Governance
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Pause, reactivate, or update destination routing in seconds directly from the self-service merchant cockpit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
