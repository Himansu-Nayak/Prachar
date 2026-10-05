import Link from "next/link";
import MasterCinematicHero from "@/components/hero/MasterCinematicHero";
import ProblemSection from "@/components/home/ProblemSection";
import PhygitalJourney from "@/components/home/PhygitalJourney";
import AdvertisingShowcase from "@/components/home/AdvertisingShowcase";
import InteractiveCardSandbox from "@/components/home/InteractiveCardSandbox";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TrustSection from "@/components/home/TrustSection";
import ReticleBox from "@/components/ui/ReticleBox";
import { fetchHealth } from "@/lib/api";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MapPin,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Printer,
  Calendar,
  Layers,
  ChevronRight,
  Users,
  Radio,
  Cpu,
  Radar,
  Share2,
} from "lucide-react";

export default async function HomePage() {
  const healthResult = await fetchHealth();

  const distributionHubs = [
    { name: "Saheed Nagar", type: "Commercial & Retail Hub", households: "6,500+ Copies", coordinates: "20.2882°N, 85.8456°E" },
    { name: "BJB Nagar & Lewis Road", type: "Residential & Institutional", households: "5,800+ Copies", coordinates: "20.2520°N, 85.8390°E" },
    { name: "Patia & Infocity Corridor", type: "Tech Hub & High-Street", households: "8,200+ Copies", coordinates: "20.3588°N, 85.8166°E" },
    { name: "Nayapalli & Jayadev Vihar", type: "Prime Central Commercial", households: "7,000+ Copies", coordinates: "20.3010°N, 85.8180°E" },
    { name: "Master Canteen & Unit-1", type: "Wholesale & Daily Markets", households: "5,400+ Copies", coordinates: "20.2644°N, 85.8375°E" },
    { name: "Khandagiri & Baramunda", type: "Transit & Residential Belt", households: "6,100+ Copies", coordinates: "20.2605°N, 85.7877°E" },
    { name: "Chandrasekharpur", type: "Cosmopolitan Residential", households: "7,500+ Copies", coordinates: "20.3245°N, 85.8190°E" },
    { name: "Old Town & Lingaraj Belt", type: "Heritage & Community Market", households: "4,500+ Copies", coordinates: "20.2384°N, 85.8335°E" },
  ];

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-[#000000] text-[#FFF3EA]">
      {/* 01. FULL-SCREEN CINEMATIC HERO (Three.js 3D Odisha Moon + Accurate Vector Cartography + Bhubaneswar Beacon) */}
      <MasterCinematicHero />

      {/* 02. THE MARKET REALITY & PROBLEM (Light Warm Ivory Editorial Rhythm) */}
      <ProblemSection />

      {/* 03. PRACHAR PHYGITAL DOCTRINE & FOUR PILLARS (Obsidian Technical #050811) */}
      <section className="relative w-full border-t border-[#E4B592]/20 bg-[#050811] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden">
        {/* Ambient Cosmic Background Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(228,181,146,0.05)_0%,transparent_60%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="reticle-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8800] animate-pulse" />
                  [SYS.PHYGITAL.ARCH]
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  SECTION 03 // FOUR PILLARS
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFF3EA] tracking-tight">
                The Phygital Publicity Architecture.
              </h2>
              <p className="text-xs sm:text-sm text-[#DAD0C8] font-mono mt-2 max-w-2xl leading-relaxed">
                Physical print builds enduring neighborhood trust. Digital dynamic infrastructure delivers instant conversion. PRACHAR synchronizes both into one cohesive identity stack.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-4 font-mono text-[11px] text-slate-400 border border-white/10 px-4 py-2 rounded-full bg-[#070B14]">
              <span className="text-[#E4B592]">STATUS:</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                BHUBANESWAR GRID ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Monthly Print Booklet */}
            <ReticleBox tag="SYS.PRINT.01" telemetry="50K+ COPIES" className="p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#FF8800]/10 border border-[#FF8800]/40 flex items-center justify-center text-[#FF8800] mb-6 shadow-[0_0_15px_rgba(255,136,0,0.15)]">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFF3EA] mb-1 font-mono tracking-wide">Monthly Print Booklet</h3>
                <p className="text-xs text-[#FF8800] font-serif mb-3">ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା</p>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Delivered door-to-door free of charge across residential societies, clinics, and business centers in Bhubaneswar. Tangible presence with zero scroll fatigue.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>PRESS: CHANDAN PRINTERS</span>
                <span className="text-[#E4B592]">UNIT-3 BBSR</span>
              </div>
            </ReticleBox>

            {/* Pillar 2: Dynamic QR Telemetry */}
            <ReticleBox tag="SYS.QR.02" telemetry="UUID ROUTER" className="p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-sky-950/40 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-6 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFF3EA] mb-1 font-mono tracking-wide">Dynamic QR Engine</h3>
                <p className="text-xs text-sky-400 font-serif mb-3">ସ୍ମାର୍ଟ ଡାଇନାମିକ କ୍ୟୁ.ଆର</p>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Permanent cloud routing (<code className="text-sky-300 font-mono">/qr/:uuid</code>). If your phone, menu, or offers change, update your destination in real time with zero reprinting costs.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>TELEMETRY: SCAN TRACKING</span>
                <span className="text-sky-400">ACTIVE</span>
              </div>
            </ReticleBox>

            {/* Pillar 3: Verified Micro-Profile */}
            <ReticleBox tag="SYS.PROFILE.03" telemetry="SEO INDEXED" className="p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFF3EA] mb-1 font-mono tracking-wide">Verified Micro-Profile</h3>
                <p className="text-xs text-emerald-400 font-serif mb-3">ଡିଜିଟାଲ ପ୍ରୋଫାଇଲ</p>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Search-indexed public vanity URL (<code className="text-emerald-300 font-mono">/u/:username</code>). One-tap WhatsApp chat, direct vCard address book saving, and catalog display.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>OPENGRAPH READY</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
            </ReticleBox>

            {/* Pillar 4: Contactless NFC Card */}
            <ReticleBox tag="SYS.NFC.04" telemetry="13.56 MHz" className="p-6 rounded-none flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 flex items-center justify-center text-[#E4B592] mb-6 shadow-[0_0_15px_rgba(228,181,146,0.15)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFF3EA] mb-1 font-mono tracking-wide">Tactile NFC Smart Card</h3>
                <p className="text-xs text-[#E4B592] font-serif mb-3">ସ୍ମାର୍ଟ ବିଜିନେସ କାର୍ଡ</p>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Precision matte-black card with integrated contactless NFC chip. Tap against any modern iPhone or Android for instant contact exchange without app installation.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>HARDWARE: TAP &amp; GO</span>
                <span className="text-[#E4B592]">ZERO APPS</span>
              </div>
            </ReticleBox>
          </div>
        </div>
      </section>

      {/* 04. ODISHA NETWORK: BHUBANESWAR HYPER-LOCAL CORRIDOR GRID */}
      <section className="relative w-full py-20 sm:py-28 border-t border-[#E4B592]/20 bg-[#000000] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="reticle-badge mb-3">
              [SECTION 04 // GEO.BBSR.SATURATION]
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFF3EA] tracking-tight">
              Bhubaneswar Hyper-Local Corridor Grid.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-3">
              50,000+ monthly copies distributed directly to doorsteps across prime commercial and residential sectors.
            </p>
          </div>

          {/* Editorial Logistical Corridor Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden shadow-2xl">
            {distributionHubs.map((hub, idx) => (
              <div
                key={idx}
                className="bg-[#070B14] p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors hover:bg-[#0B1222] group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-[#E4B592] bg-white/5 border border-white/10 w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-[#FF8800]/50 group-hover:text-[#FF8800] transition-colors">
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#FFF3EA] font-mono group-hover:text-white transition-colors">
                        {hub.name}
                      </h3>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">{hub.type}</p>
                    <span className="inline-block font-mono text-[10px] text-slate-500 mt-1">
                      {hub.coordinates}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono">
                  <span className="text-xs sm:text-sm font-bold text-[#E4B592] block">
                    {hub.households}
                  </span>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider">
                    DIRECT DROP
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Guaranteed Proprietary Logistics Banner */}
          <div className="mt-12 p-8 border border-[#E4B592]/30 bg-[#070B14] flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-sm bg-[#FF8800]/10 border border-[#FF8800]/50 flex items-center justify-center text-[#FF8800] flex-shrink-0 shadow-[0_0_20px_rgba(255,136,0,0.2)]">
                <Radar className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#FFF3EA] font-mono">
                  Direct Hand-to-Hand Distribution Fleet
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl font-sans">
                  Executed by dedicated Prachar logistical teams. We do not insert into third-party newspapers; booklets are handed directly to store owners, clinics, and residential doorsteps.
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="reticle-btn-secondary whitespace-nowrap"
            >
              <span>AUDIT PRINT FLEET &amp; PRESS</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 05. PHYGITAL CONVERSION JOURNEY (Physical -> Scan -> Cloud -> Lead) */}
      <PhygitalJourney />

      {/* 06. REAL ADVERTISING CAMPAIGN SHOWCASE & RATE CARD (P1–P5) */}
      <AdvertisingShowcase />

      {/* 07. HOW IT WORKS: PRESS SCHEDULE & LOGISTICAL CHOREOGRAPHY (Light Warm Ivory Editorial) */}
      <HowItWorksSection />

      {/* 08. TACTILE SMART CARD SANDBOX SIMULATOR */}
      <InteractiveCardSandbox />

      {/* 09. INSTITUTIONAL TRUST & STATUTORY ACCREDITATION */}
      <TrustSection />

      {/* 10. CONVERSION TERMINAL & MISSION REGISTRY (Radiant Light Container on Dark Canvas) */}
      <section className="relative w-full py-24 border-t border-[#E4B592]/20 bg-gradient-to-b from-[#050811] via-[#000000] to-[#000000] px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto p-10 sm:p-14 rounded-sm bg-gradient-to-br from-[#121A2D] to-[#090D18] border border-[#E4B592]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF8800] via-[#E4B592] to-[#0EA5E9]" />
          
          <span className="reticle-badge mb-4">
            [SECTION 10 // DEPLOYMENT.READY]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#FFF3EA] tracking-tight mt-3 mb-4">
            Claim Your Phygital Identity Today.
          </h2>
          <p className="text-sm text-[#DAD0C8] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Connect your business directly to 50,000+ Bhubaneswar residents. Reserve your search-indexed digital profile and secure your slot in the upcoming monthly print release before the 18th cutoff.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/register"
              className="reticle-btn-primary bg-[#FF8800] hover:bg-orange-500 text-black font-bold border-none"
            >
              <span>GET STARTED WITH PHONE OTP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="reticle-btn-secondary"
            >
              <span>OPEN CARD SIMULATOR</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. LIVE INFRASTRUCTURE TELEMETRY STRIP */}
      <section className="w-full border-t border-white/10 bg-[#000000] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#FF8800] font-bold">SYSTEM TELEMETRY:</span>
            <span>NEXT.JS 14 (APP ROUTER)</span>
            <span className="text-white/20">•</span>
            <span>SPRING BOOT 3.3.4 (JAVA 21)</span>
            <span className="text-white/20">•</span>
            <span>POSTGRESQL 16 &amp; FLYWAY</span>
          </div>

          <div className="flex items-center gap-3">
            <span>BACKEND STATUS:</span>
            {healthResult.success ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE ({healthResult.data?.status || "HEALTHY"})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#FF8800] font-bold bg-[#FF8800]/10 border border-[#FF8800]/40 px-2 py-0.5 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8800]" />
                API STANDBY (PORT 8080)
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
