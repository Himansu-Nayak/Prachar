import Link from "next/link";
import MasterCinematicHero from "@/components/hero/MasterCinematicHero";
import PhygitalShowcaseCanvas from "@/components/home/PhygitalShowcaseCanvas";
import ProblemSection from "@/components/home/ProblemSection";
import FeaturedWorkMosaique from "@/components/home/FeaturedWorkMosaique";
import StackedServicesSection from "@/components/home/StackedServicesSection";
import PhygitalJourney from "@/components/home/PhygitalJourney";
import AdvertisingShowcase from "@/components/home/AdvertisingShowcase";
import InteractiveCardSandbox from "@/components/home/InteractiveCardSandbox";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TrustSection from "@/components/home/TrustSection";
import EditorialStandardSection from "@/components/home/EditorialStandardSection";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { fetchHealth } from "@/lib/api";
import {
  ArrowRight,
  BookOpen,
  MapPin,
  CheckCircle2,
  Truck,
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
    <div className="flex flex-col items-center overflow-x-hidden bg-[#0A0A0A] text-[#EDEDED]">
      {/* Schema.org Organization, WebSite & LocalBusiness Structured Data */}
      <HomeJsonLd />

      {/* 01. TYPOGRAPHY-FIRST EDITORIAL HERO (Brand Appart Monumental Typography + Partner Marquee) */}
      <MasterCinematicHero />

      {/* 02. COLOSSAL ROUNDED SHOWCASE CANVAS (Brand Appart Section 2 Hallmark) */}
      <PhygitalShowcaseCanvas />

      {/* 03. EDITORIAL MARKET REALITY & PROBLEM (Warm Light Ivory Contrast) */}
      <ProblemSection />

      {/* 04. BRANDAPPART-STYLE FEATURED WORK MOSAIQUE (Authentic Local Case Studies & Testimonials) */}
      <FeaturedWorkMosaique />

      {/* 05. NUMBERED STACKED SERVICES (Brand Appart "What we ship" Architecture) */}
      <StackedServicesSection />

      {/* 05. BHUBANESWAR HYPER-LOCAL DISTRIBUTION NETWORK */}
      <section id="corridors" className="relative w-full py-24 sm:py-32 lg:py-40 bg-[#0E0E10] px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-20 gap-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
                Physical Distribution Grid
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
                Bhubaneswar <br />
                <span className="text-neutral-500">saturation corridors</span>
              </h2>
            </div>

            <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
              50,000+ monthly copies distributed directly to doorsteps across prime commercial and residential sectors by dedicated delivery teams.
            </div>
          </div>

          {/* Clean Editorial Distribution Ledger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {distributionHubs.map((hub, idx) => (
              <div
                key={idx}
                className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-7 flex items-center justify-between gap-4 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-[#FFB703] bg-white/5 border border-white/10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      {hub.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">{hub.type}</p>
                    <span className="inline-block font-mono text-[11px] text-neutral-400 mt-1">
                      {hub.coordinates}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono">
                  <span className="text-sm sm:text-base font-bold text-white block">
                    {hub.households}
                  </span>
                  <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">
                    Direct Drop
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Handover Fleet Banner */}
          <div className="mt-12 p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#121214] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFB703] flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-display">
                  Direct Hand-to-Hand Distribution Fleet
                </h4>
                <p className="text-sm text-neutral-400 mt-1 max-w-xl">
                  Executed by dedicated Prachar logistical teams. We do not insert flyers into third-party newspapers; booklets are handed directly to store owners, clinics, and residential doorsteps.
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm px-6 py-3 transition-all whitespace-nowrap flex-shrink-0"
            >
              Audit Fleet &amp; Press
            </Link>
          </div>
        </div>
      </section>

      {/* 05. PHYGITAL CONVERSION JOURNEY (Print -> Scan -> Connect -> Discover) */}
      <PhygitalJourney />

      {/* 06. REAL ADVERTISING CAMPAIGN SHOWCASE & RATE CARD (P1–P5) */}
      <AdvertisingShowcase />

      {/* 07. HOW IT WORKS: PRESS SCHEDULE & LOGISTICAL CHOREOGRAPHY */}
      <HowItWorksSection />

      {/* 08. TACTILE SMART CARD SANDBOX SIMULATOR */}
      <InteractiveCardSandbox />

      {/* 09. INSTITUTIONAL TRUST & STATUTORY ACCREDITATION & TESTIMONIAL */}
      <TrustSection />

      {/* 10. EDITORIAL DESIGN STANDARDS & CRAFT PRINCIPLES */}
      <EditorialStandardSection />

      {/* 11. GRAND EDITORIAL CLOSING CALLOUT */}
      <section className="relative w-full py-28 sm:py-36 px-4 sm:px-8 text-center bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block">
            Become Visible
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.02] font-display">
            Claim your phygital identity today.
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Connect your business directly to 50,000+ Bhubaneswar residents. Reserve your search-indexed digital profile and secure your slot in the upcoming monthly print release before the 18th cutoff.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm sm:text-base px-8 py-4 transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <span>Get Started with Mobile OTP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm sm:text-base px-7 py-4 transition-all"
            >
              Open Card Simulator
            </Link>
          </div>
        </div>
      </section>

      {/* 11. CLEAN SYSTEM HEALTH STRIP (PRESERVES API HEALTH CHECK CONTRACT) */}
      <div className="w-full border-t border-white/5 bg-[#0A0A0A] py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>PRACHAR PHYGITAL SYSTEM</span>
            <span className="text-neutral-700">•</span>
            <span>EDITION 2026</span>
          </div>

          <div className="flex items-center gap-2">
            <span>API Status:</span>
            {healthResult.success ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online ({healthResult.data?.status || "HEALTHY"})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Standby (Port 8080)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
