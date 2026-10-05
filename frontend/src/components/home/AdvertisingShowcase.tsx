"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  QrCode,
  MapPin,
  Phone,
} from "lucide-react";
import { useCardTilt } from "@/lib/motion";

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
  popular: boolean;
  printCreative: {
    publisherHeader: string;
    brandTitle: string;
    odiaSubtitle: string;
    headline: string;
    bodyCopy: string;
    locationPhone: string;
    registrationToken: string;
    qrUri: string;
    themeBadge: string;
  };
}

const TIERS: AdTier[] = [
  {
    code: "P1",
    name: "Full Page Premium Cover",
    odiaName: "କଭର ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "MAX VISIBILITY",
    specs: "180 mm × 250 mm • Full Color Gloss",
    dimensions: "180 × 250 mm",
    paperStock: "170 GSM Premium Gloss Art Paper",
    description:
      "Back cover or inside front cover placement. Complete single-brand exclusivity and regional dominance across 50,000+ Bhubaneswar homes.",
    singlePrice: "₹12,000",
    threePrice: "₹30,000",
    savings: "Save ₹6,000",
    recommendedCategory: "Real Estate Developers, Jewelry Houses & Major Hospitals",
    features: [
      "Exclusive single-brand cover presence",
      "Permanent Verified Digital Identity + NFC Link",
      "Dynamic high-density QR with telemetry",
      "Free creative adaptation by Prachar Studio",
    ],
    popular: false,
    printCreative: {
      publisherHeader: "PRACHAR MONTHLY BOOKLET • COVER EXCLUSIVE • EDITION 10/26",
      brandTitle: "KALINGA GRAND RESIDENCES",
      odiaSubtitle: "କଳିଙ୍ଗ ଗ୍ରାଣ୍ଡ ରେସିଡେନ୍ସି • ଇନଫୋସିଟି",
      headline: "Ultra-Luxury 3 & 4 BHK Smart Condominiums at Infocity Corridor",
      bodyCopy:
        "Designed for visionary families. RERA Odisha approved township featuring private terrace decks, infinity sky pool, and EV charging bays. 5 minutes from KIIT & DLF CyberCity.",
      locationPhone: "Infocity Road, Patia, Bhubaneswar • Direct Desk: +91 91788 98844",
      registrationToken: "ODISHA RERA: RERA-OD-2026-0812 • PRGI CERTIFIED",
      qrUri: "/qr/kalinga-grand",
      themeBadge: "REAL ESTATE",
    },
  },
  {
    code: "P2",
    name: "Full Page Standard",
    odiaName: "ସମ୍ପୂର୍ଣ୍ଣ ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "HIGH IMPACT",
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
      "Uncluttered full-page storytelling",
      "Digital profile with interactive catalog",
      "One-tap WhatsApp & phone direct routing",
      "Included in monthly 50,000+ door-to-door drop",
    ],
    popular: false,
    printCreative: {
      publisherHeader: "PRACHAR COMMERCIAL DIRECTORY • HEALTHCARE SPECIAL",
      brandTitle: "UTKAL ADVANCED MULTI-SPECIALTY HOSPITAL",
      odiaSubtitle: "ଉତ୍କଳ ଆଡଭାନ୍ସଡ଼ ହସ୍ପିଟାଲ • ନୟାପଲ୍ଲୀ",
      headline: "24/7 Cardiac Emergency, Digital Trauma Care & Robotic Knee Surgery",
      bodyCopy:
        "Comprehensive healthcare with 150 critical care beds, NABH certified pathology, and visiting specialist consultations across cardiology, neurology, and pediatrics.",
      locationPhone: "VIP Area, Nayapalli, Bhubaneswar • Emergency Hotline: 0674 2541200",
      registrationToken: "NABH ACCREDITED • CHANDAN PRINTERS PRESS RUN",
      qrUri: "/qr/utkal-hospital",
      themeBadge: "HEALTHCARE",
    },
  },
  {
    code: "P3",
    name: "Half Page Display",
    odiaName: "ଅର୍ଦ୍ଧେକ ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "MOST SELECTED",
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
    popular: true,
    printCreative: {
      publisherHeader: "PRACHAR DINING & COMMERCE SECTION • BBSR CENTRAL",
      brandTitle: "PURI SWEETS & CATERERS",
      odiaSubtitle: "ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ • BJB ନଗର",
      headline: "Authentic Odia Nayagarh Chhena Poda & 2,000-Pax Wedding Feast Catering",
      bodyCopy:
        "Slow-baked over traditional sal leaves with fragrant green cardamom and cashew nuts. Special souvenir gift boxes for transit. Complete Odia traditional marriage catering across Bhubaneswar.",
      locationPhone: "Plot 104, BJB Nagar, Bhubaneswar • WhatsApp: +91 70770 11733",
      registrationToken: "FSSAI LIC: 12023004000192 • DISPATCH: 18TH OCT",
      qrUri: "/qr/puri-sweets",
      themeBadge: "CATERING & DINING",
    },
  },
  {
    code: "P4",
    name: "Quarter Page Grid",
    odiaName: "ଚତୁର୍ଥାଂଶ ପୃଷ୍ଠା ବିଜ୍ଞାପନ",
    badge: "VALUE CHOICE",
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
    popular: false,
    printCreative: {
      publisherHeader: "PRACHAR DIRECTORY GRID • SAHEED NAGAR",
      brandTitle: "KALINGA CARE POLYCLINIC & LAB",
      odiaSubtitle: "କଳିଙ୍ଗ କେୟାର ପଲିକ୍ଲିନିକ • ସହୀଦ ନଗର",
      headline: "Physician Consultations & Complete 68-Parameter Health Package ₹1,499",
      bodyCopy:
        "Daily morning/evening OPD by specialist doctors. Free morning home blood sample collection anywhere in Bhubaneswar.",
      locationPhone: "Opp. Rama Devi Univ, Saheed Nagar • Tel: 0674 2541200",
      registrationToken: "NABL CERTIFIED LAB • 50,000+ HOUSEHOLD DROP",
      qrUri: "/qr/kalinga-clinic",
      themeBadge: "DIAGNOSTICS",
    },
  },
  {
    code: "P5",
    name: "Business Card Showcase",
    odiaName: "କାର୍ଡ ସାଇଜ ବିଜ୍ଞାପନ",
    badge: "STARTER MATRIX",
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
    popular: false,
    printCreative: {
      publisherHeader: "PRACHAR HOME SERVICES DIRECTORY • PATIA",
      brandTitle: "UTKAL MODULAR INTERIORS",
      odiaSubtitle: "ଉତ୍କଳ ମଡ୍ୟୁଲାର ଇଣ୍ଟିରିୟର୍ସ • ପଟିଆ",
      headline: "Bespoke Acrylic Modular Kitchens & Turnkey 3BHK Decor",
      bodyCopy: "German hardware fittings with 10-year warranty. Free 3D design consultation.",
      locationPhone: "Infocity Road, Patia, BBSR • Mob: +91 98610 55432",
      registrationToken: "MSME UDYAM REGISTERED • EDITION 10/26",
      qrUri: "/qr/utkal-interiors",
      themeBadge: "INTERIORS",
    },
  },
];

export default function AdvertisingShowcase() {
  const [selectedTierCode, setSelectedTierCode] = useState("P3");
  const selectedTier = TIERS.find((t) => t.code === selectedTierCode) || TIERS[2];

  // Restrained tilt: max 5 degrees
  const cardTiltRef = useCardTilt(5, 1.01);

  return (
    <section className="relative w-full border-t border-[#E4B592]/20 bg-[#050811] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(228,181,146,0.04)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="reticle-badge">
                [CAMPAIGN_STUDIO.P1_P5]
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                OFFICIAL RATE SPECIFICATIONS &amp; PRINT FORMATS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFF3EA] tracking-tight">
              Real Campaign Formats. Measured Impact.
            </h2>
            <p className="text-xs sm:text-sm text-[#DAD0C8] font-mono mt-2 max-w-xl">
              From pocket directory cards to full-page luxury covers. Every placement includes print door distribution, permanent dynamic QR routing, and verified digital identity.
            </p>
          </div>

          <Link href="/advertise" className="reticle-btn-secondary">
            <span>OPEN BOOKING FLIGHT DECK</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E4B592]" />
          </Link>
        </div>

        {/* Tier Selector Navigation Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-4 mb-8 scrollbar-none font-mono">
          {TIERS.map((tier) => {
            const isSelected = selectedTier.code === tier.code;
            return (
              <button
                key={tier.code}
                type="button"
                onClick={() => setSelectedTierCode(tier.code)}
                className={`px-4 py-2.5 rounded-xs text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? "bg-[#E4B592] text-black border-[#E4B592] shadow-md shadow-[#E4B592]/20"
                    : "bg-[#070B14] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span>{tier.code}</span>
                <span>•</span>
                <span>{tier.name}</span>
                {tier.popular && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/30 text-white font-normal">
                    POPULAR
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tier Interactive Master Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Authentic Commercial Print Creative Mockup inside Physical Space */}
          <div
            ref={cardTiltRef}
            className="lg:col-span-7 p-6 sm:p-8 rounded-sm border border-[#E4B592]/30 bg-[#070B14] relative flex flex-col justify-between shadow-2xl"
          >
            {/* Corner reticle marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#E4B592]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#E4B592]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#E4B592]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#E4B592]" />

            {/* Prepress Registration Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-[10px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-[#E4B592] font-bold">
                  {selectedTier.code} SPEC // {selectedTier.dimensions}
                </span>
                <span className="text-white/20">•</span>
                <span>{selectedTier.paperStock}</span>
              </div>
              {/* CMYK Calibration Blocks */}
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-2xs" title="Cyan" />
                <div className="w-2.5 h-2.5 bg-pink-500 rounded-2xs" title="Magenta" />
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-2xs" title="Yellow" />
                <div className="w-2.5 h-2.5 bg-black rounded-2xs border border-white/20" title="Key Black" />
              </div>
            </div>

            {/* Authentic Commercial Advertisement Canvas (Real Print Stock & Physical Booklet Spine) */}
            <div className="my-5 p-6 sm:p-8 rounded-xs border border-white/15 bg-[#090D18] relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[280px]">
              {/* Left-edge realistic spine drop shadow */}
              <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

              {/* Top Prepress Trim Bleed Marks */}
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pb-2 border-b border-white/5 select-none">
                <span>⊕ 3MM TRIM BLEED • OFFSET PRESS CHANDAN UNIT-3</span>
                <span className="text-[#E4B592]">{selectedTier.printCreative.themeBadge}</span>
              </div>

              {/* Publisher & Edition Header Line */}
              <div className="mt-3 text-[9px] font-mono text-[#E4B592] tracking-wider uppercase">
                {selectedTier.printCreative.publisherHeader}
              </div>

              {/* Merchant Title & Bilingual Branding */}
              <div className="mt-2">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-lg sm:text-2xl font-black text-[#FFF3EA] font-sans tracking-tight">
                    {selectedTier.printCreative.brandTitle}
                  </h4>
                </div>
                <p className="text-xs text-[#E4B592] font-serif mt-0.5">
                  {selectedTier.printCreative.odiaSubtitle}
                </p>
                <h5 className="text-sm font-semibold text-slate-200 mt-2 font-sans leading-snug">
                  {selectedTier.printCreative.headline}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                  {selectedTier.printCreative.bodyCopy}
                </p>
              </div>

              {/* Bottom Print Footer with High-Density Dynamic QR Token */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 bg-white p-1 rounded-2xs shadow-lg flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-11 h-11 text-black" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#E4B592] font-bold block uppercase">
                      DYNAMIC TELEMETRY ROUTER
                    </span>
                    <span className="text-xs text-slate-200 font-mono">
                      {selectedTier.printCreative.qrUri}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-sans">
                      1-Tap WhatsApp order &amp; vCard direct save
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block text-right font-mono text-[9px] text-slate-400">
                  <span className="text-emerald-400 font-bold block">✓ 50,000+ COPIES DROP</span>
                  <span>{selectedTier.printCreative.registrationToken}</span>
                </div>
              </div>
            </div>

            {/* Canvas Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span>TARGET AUDIENCE: {selectedTier.recommendedCategory}</span>
              <span className="text-[#E4B592]">CHANDAN PRINTERS UNIT-3</span>
            </div>
          </div>

          {/* Right: Authoritative Rate Specifications & Pricing HUD */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-sm border border-white/10 bg-[#070B14] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-[#E4B592]/20 text-[#E4B592] border border-[#E4B592]/40">
                  {selectedTier.code} SPECIFICATION
                </span>
                <span className="font-mono text-xs text-emerald-400 font-bold">
                  {selectedTier.savings}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#FFF3EA] font-mono mb-1">
                {selectedTier.name}
              </h3>
              <p className="text-xs text-[#E4B592] font-serif mb-3">
                {selectedTier.odiaName}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                {selectedTier.description}
              </p>

              {/* Pricing HUD Box */}
              <div className="p-4 rounded-xs bg-black/90 border border-white/10 mb-6 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                    Single Edition
                  </span>
                  <span className="text-xl font-extrabold text-[#FFF3EA]">
                    {selectedTier.singlePrice}
                  </span>
                  <span className="text-[9px] text-slate-500 block">1 Month Reach</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#E4B592] block font-semibold">
                    3-Edition Saver
                  </span>
                  <span className="text-xl font-extrabold text-[#E4B592]">
                    {selectedTier.threePrice}
                  </span>
                  <span className="text-[9px] text-emerald-400 block">Quarterly Recall</span>
                </div>
              </div>

              {/* Guaranteed Feature Checklist */}
              <div className="space-y-2.5 mb-8 text-xs text-slate-300 font-sans">
                {selectedTier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E4B592] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Booking Link */}
            <Link
              href={`/advertise?package=${selectedTier.code}`}
              className="reticle-btn-primary w-full text-center py-3.5"
            >
              <span>RESERVE {selectedTier.code} PLACEMENT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
