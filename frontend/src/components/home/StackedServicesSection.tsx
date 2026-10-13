"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Smartphone, QrCode, Layers, CheckCircle2 } from "lucide-react";

interface ServiceTile {
  count: string;
  title: string;
  odia: string;
  description: string;
  quote: string;
  author: string;
  authorRole: string;
  colorClass: string;
  borderColor: string;
  deliverables: { title: string; subtitle: string }[];
  ctaLabel: string;
  ctaHref: string;
}

const TILES: ServiceTile[] = [
  {
    count: "(01)",
    title: "Tangible physical publicity that commands living room permanence.",
    odia: "ମାସିକ ୫୦,୦୦୦ ଘରେ ଘରେ ସିଧାସଳଖ ବଣ୍ଟନ",
    description:
      "We print 50,000+ bound monthly copies at Chandan Printers Unit-3 on four-color offset machinery with 170 GSM gloss art paper. Bound booklets stay on home tabletops and clinic waiting rooms for 30+ days—generating enduring brand recall that social feeds cannot match.",
    quote:
      "Working with Prachar gave our brand authentic neighborhood trust in Saheed Nagar that digital ads simply could not deliver.",
    author: "Bikram K. Sahu",
    authorRole: "Managing Partner • Puri Sweets, Unit-2",
    colorClass: "bg-[#16182B]",
    borderColor: "border-indigo-500/20",
    deliverables: [
      { title: "50,000+ Bound Copies", subtitle: "Door-to-door hand delivery" },
      { title: "170 GSM Gloss Art", subtitle: "Heavy coated magazine stock" },
      { title: "Chandan Printers Unit-3", subtitle: "Certified offset press run" },
      { title: "8 Saturation Corridors", subtitle: "Bhubaneswar commercial hubs" },
    ],
    ctaLabel: "View Rate Card",
    ctaHref: "/advertise",
  },
  {
    count: "(02)",
    title: "Search-indexed vanity profiles with 1-tap WhatsApp conversion.",
    odia: "ଡିଜିଟାଲ ପ୍ରୋଫାଇଲ ଏବଂ ହ୍ୱାଟ୍ସଆପ୍ ସଂଯୋଗ",
    description:
      "Every merchant claims a permanent vanity address (/u/:username). Optimized for lightning-fast mobile loading, Google search indexing, and 1-tap WhatsApp chat initiation, customers save your contact card directly to their phone address book with zero friction.",
    quote:
      "Our patients book OPD appointments directly via WhatsApp in one tap from their smartphones after picking up the booklet.",
    author: "Dr. S. K. Mohapatra",
    authorRole: "Medical Director • Utkal Healthcare",
    colorClass: "bg-[#241A0E]",
    borderColor: "border-amber-500/20",
    deliverables: [
      { title: "Vanity Slug /u/:slug", subtitle: "Permanent branded link" },
      { title: "1-Tap WhatsApp", subtitle: "Direct merchant chat" },
      { title: "RFC 6350 vCard", subtitle: "1-click phonebook save" },
      { title: "SEO Metadata", subtitle: "Google indexed presence" },
    ],
    ctaLabel: "Claim Your Profile",
    ctaHref: "/register",
  },
  {
    count: "(03)",
    title: "Dynamic edge cloud routing with zero reprint expenses.",
    odia: "ଡାଇନାମିକ କ୍ଲାଉଡ଼ ରାଉଟିଙ୍ଗ ଏବଂ ସ୍କାନ ତଥ୍ୟ",
    description:
      "Static print is fragile when offers or numbers change. Prachar pairs every printed ad with a dynamic cloud redirect gate (/qr/:uuid). Switch destination URLs, festive catalogs, or telephone lines in real time without ever reprinting your physical booklet creative.",
    quote:
      "We updated our Diwali festive offers mid-month without changing the printed QR code. Zero extra printing costs.",
    author: "Debashish Mohapatra",
    authorRole: "Proprietor • Odisha Handlooms",
    colorClass: "bg-[#261217]",
    borderColor: "border-rose-500/20",
    deliverables: [
      { title: "< 15ms Edge Latency", subtitle: "Instant 302 redirection" },
      { title: "Zero Reprint Cost", subtitle: "Live destination swapping" },
      { title: "Scan Telemetry", subtitle: "Real-time audit counters" },
      { title: "DPDP 2023 Compliant", subtitle: "Hashed privacy analytics" },
    ],
    ctaLabel: "Try QR Simulator",
    ctaHref: "/demo",
  },
  {
    count: "(04)",
    title: "Institutional rate cards with guaranteed monthly distribution.",
    odia: "ସ୍ୱଚ୍ଛ ଦର ତାଲିକା ଏବଂ ନିର୍ଭରଯୋଗ୍ୟ ବଣ୍ଟନ",
    description:
      "Transparent commercial rate cards from P1 (Full Page Premium Cover) to P5 (Business Card Directory Spot). Every booking follows a strict monthly calendar closing on the 18th at 18:00 IST, backed by statutory PRGI and MSME Udyam accreditations.",
    quote:
      "Transparent pricing and reliable press schedules make Prachar our go-to partner for every seasonal campaign.",
    author: "Pritam Jena",
    authorRole: "General Manager • Nexus Electronics",
    colorClass: "bg-[#181613]",
    borderColor: "border-neutral-500/20",
    deliverables: [
      { title: "P1 to P5 Formats", subtitle: "Transparent fixed pricing" },
      { title: "18th Monthly Cutoff", subtitle: "Strict press plate deadline" },
      { title: "Design Studio Support", subtitle: "Free creative layout service" },
      { title: "PRGI Accreditation", subtitle: "Govt-registered publication" },
    ],
    ctaLabel: "Explore Tiers",
    ctaHref: "/advertise",
  },
];

export default function StackedServicesSection() {
  const [activeTile, setActiveTile] = useState(0);

  return (
    <section id="services-stack" className="relative w-full bg-[#0A0A0A] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Headline (BrandAppart Hallmark Structure) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono">
                The Phygital Capability
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] font-display">
              <span className="text-neutral-400">What we ship.</span> <br />
              How we scale reach.
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Four interconnected systems designed to turn offline neighborhood density into direct digital customer acquisition for local Odisha businesses.
          </div>
        </div>

        {/* Stacked Cards Container */}
        <div className="space-y-8">
          {TILES.map((tile, idx) => (
            <div
              key={tile.count}
              className={`${tile.colorClass} border ${tile.borderColor} rounded-3xl p-8 sm:p-12 lg:p-16 transition-all duration-300 hover:border-white/30`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column: Number + Title + Description */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl sm:text-3xl font-black text-[#FFB703] font-display">
                      {tile.count}
                    </span>
                    <span className="text-xs font-serif text-neutral-400">
                      {tile.odia}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display tracking-tight leading-snug">
                    {tile.title}
                  </h3>

                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                    {tile.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={tile.ctaHref}
                      className="rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-xs sm:text-sm px-6 py-3 transition-all inline-flex items-center gap-2 shadow-md"
                    >
                      <span>{tile.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Client Quote & Deliverables Gallery */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-8 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-10 pt-8 lg:pt-0">
                  {/* Quote */}
                  <div className="space-y-4">
                    <blockquote className="text-sm sm:text-base text-neutral-200 italic leading-relaxed">
                      &ldquo;{tile.quote}&rdquo;
                    </blockquote>
                    <div className="text-xs text-neutral-400 font-mono">
                      <span className="text-white font-bold">{tile.author}</span> • {tile.authorRole}
                    </div>
                  </div>

                  {/* Deliverables Grid Mini-Gallery */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    {tile.deliverables.map((item, dIdx) => (
                      <div
                        key={dIdx}
                        className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1"
                      >
                        <span className="text-xs font-bold text-white font-display block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-400 block font-mono">
                          {item.subtitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
