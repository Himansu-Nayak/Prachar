"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, BookOpen, QrCode } from "lucide-react";

interface AdTier {
  code: string;
  name: string;
  odiaName: string;
  badge: string;
  specs: string;
  dimensions: string;
  paperStock: string;
  description: string;
  singlePrice: string;
  threePrice: string;
  savings: string;
  recommendedCategory: string;
  features: string[];
  printCreative: {
    publisherHeader: string;
    brandTitle: string;
    odiaSubtitle: string;
    headline: string;
    bodyCopy: string;
    locationPhone: string;
    registrationToken: string;
    themeBadge: string;
  };
}

const TIERS: AdTier[] = [
  {
    code: "P1",
    name: "Full Page Premium Cover",
    odiaName: "କଭର ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "Maximum Visibility",
    specs: "180 mm × 250 mm • Full Color Gloss",
    dimensions: "180 × 250 mm",
    paperStock: "170 GSM Premium Gloss Art Paper",
    description:
      "Back cover or inside front cover placement. Complete single-brand regional dominance across 50,000+ Bhubaneswar living rooms.",
    singlePrice: "₹12,000",
    threePrice: "₹30,000",
    savings: "Save ₹6,000",
    recommendedCategory: "Real Estate Developers, Jewelry Houses & Major Hospitals",
    features: [
      "Exclusive single-brand cover presence",
      "Permanent Verified Digital Identity + NFC Link",
      "Dynamic high-density QR with scan analytics",
      "Free creative adaptation by Prachar Studio",
    ],
    printCreative: {
      publisherHeader: "PRACHAR MONTHLY BOOKLET • COVER EXCLUSIVE • EDITION 10/26",
      brandTitle: "KALINGA GRAND RESIDENCES",
      odiaSubtitle: "କଳିଙ୍ଗ ଗ୍ରାଣ୍ଡ ରେସିଡେନ୍ସି • ଇନଫୋସିଟି",
      headline: "Ultra-Luxury 3 & 4 BHK Smart Condominiums at Infocity Corridor",
      bodyCopy:
        "Designed for visionary families. RERA Odisha approved township featuring private terrace decks, infinity sky pool, and EV charging bays. 5 minutes from KIIT & DLF CyberCity.",
      locationPhone: "Infocity Road, Patia, Bhubaneswar • Direct Desk: +91 91788 98844",
      registrationToken: "ODISHA RERA: RERA-OD-2026-0812 • PRGI CERTIFIED",
      themeBadge: "REAL ESTATE",
    },
  },
  {
    code: "P2",
    name: "Full Page Standard",
    odiaName: "ସମ୍ପୂର୍ଣ୍ଣ ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "High Impact",
    specs: "180 mm × 250 mm • High-Res Matte",
    dimensions: "180 × 250 mm",
    paperStock: "130 GSM High-Bulk Matte Coated",
    description:
      "Dedicated full-page visual canvas for educational academies, automobile dealerships, and multi-specialty healthcare networks.",
    singlePrice: "₹8,000",
    threePrice: "₹20,000",
    savings: "Save ₹4,000",
    recommendedCategory: "Automobile Showrooms, IIT/NEET Academies & Supermarkets",
    features: [
      "Uncluttered full-page visual storytelling",
      "Digital profile with interactive catalog",
      "One-tap WhatsApp & phone direct routing",
      "Included in monthly 50,000+ door-to-door drop",
    ],
    printCreative: {
      publisherHeader: "PRACHAR COMMERCIAL DIRECTORY • HEALTHCARE SPECIAL",
      brandTitle: "UTKAL ADVANCED MULTI-SPECIALTY HOSPITAL",
      odiaSubtitle: "ଉତ୍କଳ ଆଡଭାନ୍ସଡ଼ ହସ୍ପିଟାଲ • ନୟାପଲ୍ଲୀ",
      headline: "24/7 Cardiac Emergency, Digital Trauma Care & Robotic Knee Surgery",
      bodyCopy:
        "Comprehensive healthcare with 150 critical care beds, NABH certified pathology, and visiting specialist consultations across cardiology, neurology, and pediatrics.",
      locationPhone: "VIP Area, Nayapalli, Bhubaneswar • Emergency Hotline: 0674 2541200",
      registrationToken: "NABH ACCREDITED • CHANDAN PRINTERS PRESS RUN",
      themeBadge: "HEALTHCARE",
    },
  },
  {
    code: "P3",
    name: "Half Page Display",
    odiaName: "ଅର୍ଦ୍ଧେକ ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "Most Popular",
    specs: "180 mm × 120 mm (Horizontal) • Full Color",
    dimensions: "180 × 120 mm",
    paperStock: "130 GSM Coated Art Stock",
    description:
      "The ideal balance of visual dominance and cost efficiency for restaurants, wedding caterers, jewelers, and lifestyle boutiques.",
    singlePrice: "₹4,500",
    threePrice: "₹11,500",
    savings: "Save ₹2,000",
    recommendedCategory: "Restaurants, Sweets Makers, Boutiques & Diagnostic Labs",
    features: [
      "Prominent mid-booklet position",
      "Dynamic QR leading to digital menu/offers",
      "vCard direct address book saving for readers",
      "Guaranteed 18th monthly edition dispatch",
    ],
    printCreative: {
      publisherHeader: "PRACHAR DINING & COMMERCE SECTION • BBSR CENTRAL",
      brandTitle: "PURI SWEETS & CATERERS",
      odiaSubtitle: "ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ • BJB ନଗର",
      headline: "Authentic Odia Nayagarh Chhena Poda & 2,000-Pax Wedding Feast Catering",
      bodyCopy:
        "Slow-baked over traditional sal leaves with fragrant green cardamom and cashew nuts. Special souvenir gift boxes for transit. Complete Odia traditional marriage catering across Bhubaneswar.",
      locationPhone: "Plot 104, BJB Nagar, Bhubaneswar • WhatsApp: +91 70770 11733",
      registrationToken: "FSSAI LIC: 12023004000192 • DISPATCH: 18TH OCT",
      themeBadge: "CATERING & DINING",
    },
  },
  {
    code: "P4",
    name: "Quarter Page Grid",
    odiaName: "ଚତୁର୍ଥାଂଶ ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "Value Choice",
    specs: "88 mm × 120 mm • Full Color",
    dimensions: "88 × 120 mm",
    paperStock: "130 GSM Coated Art Stock",
    description:
      "Crisp, focused advertisement perfect for diagnostic clinics, chartered accountants, legal consultants, and home contractors.",
    singlePrice: "₹2,500",
    threePrice: "₹6,500",
    savings: "Save ₹1,000",
    recommendedCategory: "Coaching Centers, CAs, Architects & Clinics",
    features: [
      "High-density commercial neighborhood targeting",
      "Live QR scan tracking in merchant dashboard",
      "One-tap call mobile integration",
      "Ideal for recurring monthly local recall",
    ],
    printCreative: {
      publisherHeader: "PRACHAR DIRECTORY GRID • SAHEED NAGAR",
      brandTitle: "KALINGA CARE POLYCLINIC & LAB",
      odiaSubtitle: "କଳିଙ୍ଗ କେୟାର ପଲିକ୍ଲିନିକ • ସହୀଦ ନଗର",
      headline: "Physician Consultations & Complete 68-Parameter Health Package ₹1,499",
      bodyCopy:
        "Daily morning/evening OPD by specialist doctors. Free morning home blood sample collection anywhere in Bhubaneswar.",
      locationPhone: "Opp. Rama Devi Univ, Saheed Nagar • Tel: 0674 2541200",
      registrationToken: "NABL CERTIFIED LAB • 50,000+ HOUSEHOLD DROP",
      themeBadge: "DIAGNOSTICS",
    },
  },
  {
    code: "P5",
    name: "Business Card Showcase",
    odiaName: "କାର୍ଡ ସାଇଜ ବିଜ୍ଞାପନ",
    badge: "Entry Starter",
    specs: "88 mm × 55 mm • Pocket Format",
    dimensions: "88 × 55 mm",
    paperStock: "130 GSM Directory Section Stock",
    description:
      "Low-barrier entry for independent professionals, salon artists, home technicians, and neighborhood retail outlets.",
    singlePrice: "₹1,200",
    threePrice: "₹3,000",
    savings: "Save ₹600",
    recommendedCategory: "Independent Pros, Electrical & Plumbing, Tailors, Studios",
    features: [
      "High-density directory section placement",
      "Permanent digital profile link (/u/:username)",
      "Physical NFC card add-on capability",
      "Bhubaneswar-wide print circulation",
    ],
    printCreative: {
      publisherHeader: "PRACHAR HOME SERVICES DIRECTORY • PATIA",
      brandTitle: "UTKAL MODULAR INTERIORS",
      odiaSubtitle: "ଉତ୍କଳ ମଡ୍ୟୁଲାର ଇଣ୍ଟିରିୟର୍ସ • ପଟିଆ",
      headline: "Bespoke Acrylic Modular Kitchens & Turnkey 3BHK Decor",
      bodyCopy: "German hardware fittings with 10-year warranty. Free 3D design consultation.",
      locationPhone: "Infocity Road, Patia, BBSR • Mob: +91 98610 55432",
      registrationToken: "MSME UDYAM REGISTERED • EDITION 10/26",
      themeBadge: "INTERIORS",
    },
  },
];

export default function AdvertisingShowcase() {
  const [selectedTierCode, setSelectedTierCode] = useState("P3");
  const selectedTier = TIERS.find((t) => t.code === selectedTierCode) || TIERS[2];

  return (
    <section id="advertising" className="relative w-full bg-[#0A0A0A] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              Advertising <br />
              <span className="text-neutral-500">rate matrix (P1–P5)</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            No hidden fees. Every slot includes high-definition print in 50,000+ Bhubaneswar booklets, dynamic QR tracking, and a permanent search-indexed digital profile.
          </div>
        </div>

        {/* Tier Selector Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 border-b border-white/10 scrollbar-none">
          {TIERS.map((tier) => {
            const isSelected = selectedTierCode === tier.code;
            return (
              <button
                key={tier.code}
                type="button"
                onClick={() => setSelectedTierCode(tier.code)}
                className={`flex-shrink-0 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#FFB703] text-black shadow-md shadow-amber-500/10 font-bold"
                    : "bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <span>{tier.code}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{tier.name}</span>
                <span className="text-[11px] opacity-75 font-mono">({tier.singlePrice})</span>
              </button>
            );
          })}
        </div>

        {/* Active Tier Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#121214] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-mono text-[#FFB703] font-bold">
                  PACKAGE {selectedTier.code}
                </span>
                <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {selectedTier.badge}
                </span>
                <span className="text-xs font-serif text-[#FFB703]">
                  {selectedTier.odiaName}
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
                {selectedTier.name}
              </h3>

              {/* Price Callout */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-4xl sm:text-5xl font-black text-white font-display">
                  {selectedTier.singlePrice}
                </span>
                <span className="text-sm text-neutral-400">/ single month edition</span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Quarterly (3 editions): <strong className="text-neutral-300">{selectedTier.threePrice}</strong> • {selectedTier.savings}
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {selectedTier.description}
            </p>

            {/* Technical Specifications */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 text-xs font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>Print Dimensions:</span>
                <span className="text-white font-semibold">{selectedTier.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span>Paper Material:</span>
                <span className="text-white font-semibold">{selectedTier.paperStock}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Sectors:</span>
                <span className="text-white font-semibold">{selectedTier.recommendedCategory}</span>
              </div>
            </div>

            {/* Features Checkmarks */}
            <div className="space-y-3 pt-2">
              {selectedTier.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-5 h-5 rounded-full bg-[#FFB703]/10 text-[#FFB703] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/advertise"
                className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm px-8 py-3.5 transition-all inline-flex items-center gap-2"
              >
                <span>Book {selectedTier.code} Placement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 hover:border-white/40 text-white text-sm font-medium px-6 py-3.5 transition-all"
              >
                Speak with Press Team
              </Link>
            </div>
          </div>

          {/* Right: Print Creative Preview Simulation */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Physical Print Sheet Layered Mockup */}
            <div className="relative group">
              {/* Stacked Sheet Underlayer for authentic physical paper depth */}
              <div className="absolute -inset-1.5 translate-y-1.5 translate-x-1.5 bg-white/[0.02] border border-white/5 rounded-2xl -z-10 blur-[1px]" />
              
              <div className="w-full bg-[#141418] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                {/* Subtle paper top edge sheen */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="pb-4 border-b border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFB703] font-semibold tracking-wide">DIRECTORY PRINT PREVIEW</span>
                    <span className="text-white/20">•</span>
                    <span>{selectedTier.dimensions}</span>
                  </div>

                  <span className="text-[11px] text-neutral-400 font-mono">
                    {selectedTier.paperStock.split(" ")[0]} GSM Coated
                  </span>
                </div>

                <div className="my-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#FFB703] font-mono block">
                    {selectedTier.printCreative.themeBadge}
                  </span>

                  <h4 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {selectedTier.printCreative.brandTitle}
                  </h4>

                  <p className="text-xs text-[#FFB703] font-serif">
                    {selectedTier.printCreative.odiaSubtitle}
                  </p>

                  <p className="text-sm font-semibold text-neutral-200 pt-1">
                    {selectedTier.printCreative.headline}
                  </p>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {selectedTier.printCreative.bodyCopy}
                  </p>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-neutral-300 font-mono">
                    {selectedTier.printCreative.locationPhone}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>{selectedTier.printCreative.registrationToken}</span>
                  <span className="text-[#FFB703]">Verified Slot</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-neutral-500 font-mono">
              Next print cutoff: 18th of this month at 18:00 IST
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
