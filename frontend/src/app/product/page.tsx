import type { Metadata } from "next";
import Link from "next/link";
import ReticleBox from "@/components/ui/ReticleBox";
import {
  Smartphone,
  BookOpen,
  QrCode,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Share2,
  RefreshCw,
  Sliders,
  Layers,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Product Architecture — Phygital Smart Identity Ecosystem",
  description:
    "Explore the complete PRACHAR phygital stack: contactless NFC smart cards, dynamic QR redirect engine, and verified digital micro-profiles for Bhubaneswar businesses.",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-[#FFF3EA]">
      {/* Product Hero */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <span className="reticle-badge mb-4">
          [ARCHITECTURE // SPECIFICATION]
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF3EA] tracking-tight leading-tight mt-3 mb-6">
          Physical Presence Meets{" "}
          <span className="text-[#E4B592]">
            Digital Agility.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#DAD0C8] font-mono leading-relaxed max-w-2xl mx-auto mb-10">
          PRACHAR bridges high-trust tactile interactions with fast, search-indexed digital infrastructure across Bhubaneswar. Zero app downloads, zero paper waste, verified local reach.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/register"
            className="reticle-btn-primary"
          >
            <span>CLAIM PHYGITAL CARD</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/demo"
            className="reticle-btn-secondary"
          >
            <span>LAUNCH CARD SIMULATOR</span>
          </Link>
        </div>
      </div>

      {/* 3-Pillar Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {/* Component 1: NFC Smart Card */}
        <ReticleBox tag="LAYER.01" telemetry="HARDWARE // 13.56 MHz" className="p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 flex items-center justify-center text-[#E4B592] mb-6 shadow-[0_0_15px_rgba(228,181,146,0.15)]">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] text-[#E4B592] font-bold uppercase tracking-widest block mb-1">
              HARDWARE LAYER
            </span>
            <h2 className="text-xl font-bold text-[#FFF3EA] mb-1 font-mono">Contactless NFC Card</h2>
            <p className="text-xs text-[#E4B592] font-serif mb-4">ସ୍ମାର୍ଟ ବିଜିନେସ କାର୍ଡ</p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
              Machined from premium matte obsidian polymer with integrated NTAG215 contactless telemetry. Tap against any smartphone to project your profile in under 1 second.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E4B592] flex-shrink-0" />
                <span>Compatible with iOS &amp; modern Android</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E4B592] flex-shrink-0" />
                <span>Waterproof, scratch-resistant matte finish</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E4B592] flex-shrink-0" />
                <span>Laser-etched high-density reverse QR code</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 mt-6 border-t border-white/5 font-mono text-[10px] text-slate-400">
            Zero app installation required for receivers.
          </div>
        </ReticleBox>

        {/* Component 2: Dynamic QR Engine */}
        <ReticleBox tag="LAYER.02" telemetry="ROUTER // REDIS 7.2" className="p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-sm bg-sky-950/40 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-6 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] text-sky-400 font-bold uppercase tracking-widest block mb-1">
              ROUTING INFRASTRUCTURE
            </span>
            <h2 className="text-xl font-bold text-[#FFF3EA] mb-1 font-mono">Dynamic QR Engine</h2>
            <p className="text-xs text-sky-400 font-serif mb-4">ସ୍ମାର୍ଟ ଡାଇନାମିକ କ୍ୟୁ.ଆର ରାଉଟିଂ</p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
              Unlike static QR codes that break if a link changes, PRACHAR uses persistent UUID routing tokens (<code className="text-sky-300 font-mono">/qr/:uuid</code>) that dynamically resolve to your active profile.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>Printed codes never expire or go obsolete</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>Instant destination URL redirection updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>Sub-50ms Redis-cached 302 redirection</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 mt-6 border-t border-white/5 font-mono text-[10px] text-slate-400">
            High error-correction ZXing vector rendering.
          </div>
        </ReticleBox>

        {/* Component 3: Verified Digital Micro-Profile */}
        <ReticleBox tag="LAYER.03" telemetry="WEB // NEXT.JS 14" className="p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-sm bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-1">
              WEB EXPERIENCE LAYER
            </span>
            <h2 className="text-xl font-bold text-[#FFF3EA] mb-1 font-mono">Verified Micro-Profile</h2>
            <p className="text-xs text-emerald-400 font-serif mb-4">ଭେରିଫାଏଡ଼ ଡିଜିଟାଲ ପ୍ରୋଫାଇଲ</p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
              Lightning-fast server-rendered digital profile (<code className="text-emerald-300 font-mono">/u/:username</code>). Optimized for Google search indexing, rich OpenGraph previews, and instant conversion.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>1-Tap WhatsApp chat with prefilled context</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>1-Click vCard address book download</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Service listings, pricing &amp; store location</span>
              </li>
            </ul>
          </div>
          <div className="pt-6 mt-6 border-t border-white/5 font-mono text-[10px] text-slate-400">
            OpenGraph, Twitter card &amp; canonical URL ready.
          </div>
        </ReticleBox>
      </div>

      {/* Feature Comparison Table */}
      <div className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="reticle-badge mb-3">
            [COMPARISON // MATRIX]
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#FFF3EA] tracking-tight">
            Traditional Paper vs. PRACHAR Phygital.
          </h2>
        </div>

        <ReticleBox tag="MATRIX.COMPARISON" telemetry="SIDE-BY-SIDE AUDIT" className="overflow-x-auto p-0">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#E4B592]/20 bg-[#000000] text-slate-300">
                <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-[#E4B592]">Capability Specification</th>
                <th className="p-4 sm:p-5 font-semibold text-slate-400 uppercase tracking-wider">Traditional Visiting Card</th>
                <th className="p-4 sm:p-5 font-bold text-[#FFF3EA] uppercase tracking-wider">PRACHAR Phygital Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition">
                  <td className="p-4 sm:p-5 font-mono font-bold text-[#FFF3EA]">{row.feature}</td>
                  <td className="p-4 sm:p-5 text-slate-400">{row.traditional}</td>
                  <td className="p-4 sm:p-5 text-[#E4B592] font-medium">{row.prachar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReticleBox>
      </div>

      {/* Technical Standards & Security Grid */}
      <ReticleBox tag="STANDARDS.GOVERNANCE" telemetry="DPDP ACT 2023 // CERTIFIED" className="p-8 sm:p-12">
        <div className="max-w-xl mb-10">
          <span className="reticle-badge mb-3">
            [SECURITY &amp; COMPLIANCE]
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#FFF3EA] tracking-tight">
            Technical Reliability &amp; Governance.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-2">
            Engineered with modern aerospace-grade resilience for Bhubaneswar commercial entities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          <div className="p-4 border border-white/10 bg-[#000000]/60">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="font-bold text-[#FFF3EA] text-xs uppercase tracking-wider">DPDP Act 2023 Compliant</h3>
            <p className="text-[11px] text-slate-400 mt-2 font-sans leading-relaxed">
              Strict Indian privacy compliance with explicit user consent, encrypted telemetry, and zero third-party data broker sharing.
            </p>
          </div>
          <div className="p-4 border border-white/10 bg-[#000000]/60">
            <Zap className="w-5 h-5 text-[#E4B592] mb-2" />
            <h3 className="font-bold text-[#FFF3EA] text-xs uppercase tracking-wider">Sub-50ms Redirection</h3>
            <p className="text-[11px] text-slate-400 mt-2 font-sans leading-relaxed">
              Redis-backed dynamic routing engine ensures instantaneous scan loading at busy retail storefronts and clinic reception desks.
            </p>
          </div>
          <div className="p-4 border border-white/10 bg-[#000000]/60">
            <Layers className="w-5 h-5 text-sky-400 mb-2" />
            <h3 className="font-bold text-[#FFF3EA] text-xs uppercase tracking-wider">Passive 13.56 MHz NFC</h3>
            <p className="text-[11px] text-slate-400 mt-2 font-sans leading-relaxed">
              NTAG215 hardware operates without batteries or electrical charging, functioning reliably indefinitely across all environments.
            </p>
          </div>
          <div className="p-4 border border-white/10 bg-[#000000]/60">
            <Sliders className="w-5 h-5 text-[#E4B592] mb-2" />
            <h3 className="font-bold text-[#FFF3EA] text-xs uppercase tracking-wider">Merchant Governance</h3>
            <p className="text-[11px] text-slate-400 mt-2 font-sans leading-relaxed">
              Pause, reactivate, or update destination routing in seconds directly from the self-service merchant cockpit.
            </p>
          </div>
        </div>
      </ReticleBox>
    </div>
  );
}
