"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, X, CheckCircle2, Info } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  year: string;
  category: string;
  odia: string;
  image: string;
  reach: string;
  conversion: string;
  quote: string;
  client: string;
  clientRole: string;
  location: string;
  adTier: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "puri-sweets",
    title: "Puri Sweets & Confectionery",
    year: "2026",
    category: "Retail & Confectionery",
    odia: "ପୁରୀ ସୁଇଟ୍ସ • ୟୁନିଟ-୨",
    image: "/editorial/puri-sweets.svg",
    reach: "Bhubaneswar Doorsteps",
    conversion: "High Seasonal Order Volume",
    quote: "Our festive boxes reached thousands of households across Saheed Nagar and Nayapalli through PRACHAR's monthly doorstep distribution.",
    client: "Bikram K. Sahu",
    clientRole: "Managing Partner • Puri Sweets, Unit-2",
    location: "Unit-2 Market Building, Bhubaneswar",
    adTier: "P2 Half Page Spread",
  },
  {
    id: "kalinga-clinic",
    title: "Kalinga Super-Specialty Clinic",
    year: "2026",
    category: "Healthcare & Diagnostics",
    odia: "କଳିଙ୍ଗ କ୍ଲିନିକ୍ • ନୟାପଲ୍ଲୀ",
    image: "/editorial/kalinga-clinic.svg",
    reach: "Nayapalli & IRC Village",
    conversion: "Verified OPD Scan Inquiries",
    quote: "Social media ads vanish instantly. A permanent print directory in living rooms with a direct QR to our OPD booking gives lasting patient trust.",
    client: "Dr. S. K. Mohapatra",
    clientRole: "Medical Director • Utkal Healthcare",
    location: "Plot 104, IRC Village, Nayapalli",
    adTier: "P1 Full Page Cover",
  },
  {
    id: "odisha-handloom",
    title: "Odisha Handloom Emporium",
    year: "2026",
    category: "Textiles & Artisan Guild",
    odia: "ଓଡ଼ିଶା ହ୍ୟାଣ୍ଡଲୁମ୍ • ସହିଦ ନଗର",
    image: "/editorial/odisha-handloom.svg",
    reach: "Saheed Nagar & BJB Belt",
    conversion: "Direct vCard & WhatsApp Contacts",
    quote: "Bridal shoppers saved our vCard directly from the booklet QR. We experienced strong footfall surges across our showroom.",
    client: "Debashish Mohapatra",
    clientRole: "Master Weaver & Proprietor",
    location: "Saheed Nagar Commercial Strip",
    adTier: "P3 Quarter Page",
  },
  {
    id: "nexus-tech",
    title: "Nexus Electronics & Appliances",
    year: "2026",
    category: "Consumer Tech & Retail",
    odia: "ନେକ୍ସସ ଇଲେକ୍ଟ୍ରୋନିକ୍ସ • ପଟିଆ",
    image: "/editorial/nexus-electronics.svg",
    reach: "Patia Infocity Corridor",
    conversion: "One-Tap Google Maps Routing",
    quote: "PRACHAR's Patia Infocity distribution drove local walk-ins directly through our doors with zero intermediary aggregator commissions.",
    client: "Pritam Jena",
    clientRole: "Store General Manager",
    location: "Infocity Square, Patia Corridor",
    adTier: "P4 Directory Spot",
  },
];

export default function FeaturedWorkMosaique() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Accessible keyboard trap, ESC listener, scroll lock, and focus restoration
  useEffect(() => {
    if (!selectedCase) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCase(null);
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Initial focus into modal close button
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const closeBtn = modalRef.current.querySelector<HTMLElement>('button[aria-label="Close dialog"]');
        closeBtn?.focus();
      }
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      triggerRef.current?.focus();
    };
  }, [selectedCase]);

  return (
    <section id="work" className="relative w-full bg-[#08080A] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10 overflow-hidden">
      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* BrandAppart Hallmark Section Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono">
                Publication Tier Specimens
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] font-display">
              Featured <br />
              <span className="text-neutral-400">formats</span>
            </h2>
          </div>

          <div className="max-w-md space-y-4">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
              <ArrowDown className="w-4 h-4" />
            </div>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
              Representative specimens illustrating P1–P4 physical booklet tiers and dynamic cloud routing formats deployed across Bhubaneswar distribution corridors.
            </p>
          </div>
        </div>

        {/* BrandAppart Staggered Mosaique Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 01: Puri Sweets */}
          <article
            aria-labelledby={`case-title-${CASE_STUDIES[0].id}`}
            onClick={() => {
              triggerRef.current = document.getElementById(`inspect-btn-${CASE_STUDIES[0].id}`);
              setSelectedCase(CASE_STUDIES[0]);
            }}
            className="group cursor-pointer bg-[#121215] border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h3 id={`case-title-${CASE_STUDIES[0].id}`} className="text-xl sm:text-2xl font-black text-white font-display group-hover:text-[#FFB703] transition-colors">
                    {CASE_STUDIES[0].title}
                  </h3>
                  <p className="text-xs font-serif text-amber-500/90 mt-0.5">{CASE_STUDIES[0].odia}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400">{CASE_STUDIES[0].year}</span>
                  <span className="text-neutral-600" aria-hidden="true">•</span>
                  <span className="text-neutral-400">{CASE_STUDIES[0].category}</span>
                </div>
              </div>

              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/11] mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={CASE_STUDIES[0].image}
                  alt={CASE_STUDIES[0].title}
                  width={800}
                  height={550}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    type="button"
                    id={`inspect-btn-${CASE_STUDIES[0].id}`}
                    aria-haspopup="dialog"
                    aria-label={`Inspect format for ${CASE_STUDIES[0].title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerRef.current = e.currentTarget;
                      setSelectedCase(CASE_STUDIES[0]);
                    }}
                    className="rounded-full bg-[#FFB703] text-black font-bold text-xs px-4 py-2 inline-flex items-center gap-1.5 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>Inspect Format</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">{CASE_STUDIES[0].adTier}</span>
              <span className="text-emerald-400 font-bold">{CASE_STUDIES[0].conversion}</span>
            </div>
          </article>

          {/* Card 02: Kalinga Clinic */}
          <article
            aria-labelledby={`case-title-${CASE_STUDIES[1].id}`}
            onClick={() => {
              triggerRef.current = document.getElementById(`inspect-btn-${CASE_STUDIES[1].id}`);
              setSelectedCase(CASE_STUDIES[1]);
            }}
            className="group cursor-pointer bg-[#121215] border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h3 id={`case-title-${CASE_STUDIES[1].id}`} className="text-xl sm:text-2xl font-black text-white font-display group-hover:text-[#38BDF8] transition-colors">
                    {CASE_STUDIES[1].title}
                  </h3>
                  <p className="text-xs font-serif text-sky-400/90 mt-0.5">{CASE_STUDIES[1].odia}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400">{CASE_STUDIES[1].year}</span>
                  <span className="text-neutral-600" aria-hidden="true">•</span>
                  <span className="text-neutral-400">{CASE_STUDIES[1].category}</span>
                </div>
              </div>

              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/11] mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={CASE_STUDIES[1].image}
                  alt={CASE_STUDIES[1].title}
                  width={800}
                  height={550}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    type="button"
                    id={`inspect-btn-${CASE_STUDIES[1].id}`}
                    aria-haspopup="dialog"
                    aria-label={`Inspect format for ${CASE_STUDIES[1].title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerRef.current = e.currentTarget;
                      setSelectedCase(CASE_STUDIES[1]);
                    }}
                    className="rounded-full bg-[#38BDF8] text-black font-bold text-xs px-4 py-2 inline-flex items-center gap-1.5 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>Inspect Format</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">{CASE_STUDIES[1].adTier}</span>
              <span className="text-emerald-400 font-bold">{CASE_STUDIES[1].conversion}</span>
            </div>
          </article>

          {/* Interspersed BrandAppart Testimonial Card (Vibrant Indigo Surface) */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#1E1B4B] via-[#17133B] to-[#0F0D24] border border-indigo-500/25 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-indigo-400/15">
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-300">
                  REPRESENTATIVE CLIENT PROFILE &amp; IMPACT
                </span>
                <span className="text-xs font-mono text-indigo-300">Nayapalli Health Corridor</span>
              </div>

              <blockquote className="mt-8 text-xl sm:text-2xl lg:text-3xl font-serif font-normal text-white leading-relaxed">
                &ldquo;Digital display banners get lost in noisy feeds. A permanent print directory resting in Bhubaneswar living rooms with instant QR scanning establishes an enduring bond of neighbourhood credibility.&rdquo;
              </blockquote>
            </div>

            <div className="mt-10 pt-6 border-t border-indigo-400/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-base font-bold text-white">Dr. Debashis Tripathy</p>
                <p className="text-xs text-indigo-300 font-mono">Medical Director • Kalinga Diagnostics &amp; Care</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono">
                <Info className="w-4 h-4 text-indigo-300 shrink-0" aria-hidden="true" />
                <span>Illustrative profile representing local healthcare phygital adoption</span>
              </div>
            </div>
          </div>

          {/* Card 03: Odisha Handloom */}
          <article
            aria-labelledby={`case-title-${CASE_STUDIES[2].id}`}
            onClick={() => {
              triggerRef.current = document.getElementById(`inspect-btn-${CASE_STUDIES[2].id}`);
              setSelectedCase(CASE_STUDIES[2]);
            }}
            className="group cursor-pointer bg-[#121215] border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h3 id={`case-title-${CASE_STUDIES[2].id}`} className="text-xl sm:text-2xl font-black text-white font-display group-hover:text-[#FB7185] transition-colors">
                    {CASE_STUDIES[2].title}
                  </h3>
                  <p className="text-xs font-serif text-rose-400/90 mt-0.5">{CASE_STUDIES[2].odia}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400">{CASE_STUDIES[2].year}</span>
                  <span className="text-neutral-600" aria-hidden="true">•</span>
                  <span className="text-neutral-400">{CASE_STUDIES[2].category}</span>
                </div>
              </div>

              <div className="relative aspect-[16/11] mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={CASE_STUDIES[2].image}
                  alt={CASE_STUDIES[2].title}
                  width={800}
                  height={550}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    type="button"
                    id={`inspect-btn-${CASE_STUDIES[2].id}`}
                    aria-haspopup="dialog"
                    aria-label={`Inspect format for ${CASE_STUDIES[2].title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerRef.current = e.currentTarget;
                      setSelectedCase(CASE_STUDIES[2]);
                    }}
                    className="rounded-full bg-[#FB7185] text-black font-bold text-xs px-4 py-2 inline-flex items-center gap-1.5 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>Inspect Format</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">{CASE_STUDIES[2].adTier}</span>
              <span className="text-emerald-400 font-bold">{CASE_STUDIES[2].conversion}</span>
            </div>
          </article>

          {/* Card 04: Nexus Tech */}
          <article
            aria-labelledby={`case-title-${CASE_STUDIES[3].id}`}
            onClick={() => {
              triggerRef.current = document.getElementById(`inspect-btn-${CASE_STUDIES[3].id}`);
              setSelectedCase(CASE_STUDIES[3]);
            }}
            className="group cursor-pointer bg-[#121215] border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h3 id={`case-title-${CASE_STUDIES[3].id}`} className="text-xl sm:text-2xl font-black text-white font-display group-hover:text-[#34D399] transition-colors">
                    {CASE_STUDIES[3].title}
                  </h3>
                  <p className="text-xs font-serif text-emerald-400/90 mt-0.5">{CASE_STUDIES[3].odia}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400">{CASE_STUDIES[3].year}</span>
                  <span className="text-neutral-600" aria-hidden="true">•</span>
                  <span className="text-neutral-400">{CASE_STUDIES[3].category}</span>
                </div>
              </div>

              <div className="relative aspect-[16/11] mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={CASE_STUDIES[3].image}
                  alt={CASE_STUDIES[3].title}
                  width={800}
                  height={550}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    type="button"
                    id={`inspect-btn-${CASE_STUDIES[3].id}`}
                    aria-haspopup="dialog"
                    aria-label={`Inspect format for ${CASE_STUDIES[3].title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerRef.current = e.currentTarget;
                      setSelectedCase(CASE_STUDIES[3]);
                    }}
                    className="rounded-full bg-[#34D399] text-black font-bold text-xs px-4 py-2 inline-flex items-center gap-1.5 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>Inspect Format</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">{CASE_STUDIES[3].adTier}</span>
              <span className="text-emerald-400 font-bold">{CASE_STUDIES[3].conversion}</span>
            </div>
          </article>
        </div>
      </div>

      {/* Interactive Case Detail Modal */}
      {selectedCase && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-case-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedCase(null)}
        >
          <div
            ref={modalRef}
            className="bg-[#121215] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-10 relative space-y-6 shadow-2xl focus:outline-none"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCase(null)}
              aria-label="Close dialog"
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB703]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-xs uppercase font-mono font-semibold text-[#FFB703]">
                {selectedCase.category} • {selectedCase.adTier}
              </span>
              <h3 id="modal-case-title" className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
                {selectedCase.title}
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">{selectedCase.location}</p>
            </div>

            {/* Specimen Disclaimer Notice */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 text-xs text-amber-200/90 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FFB703] shrink-0" />
              <span>Representative publication specimen illustrating print placement &amp; dynamic cloud routing.</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">CIRCULATION FOCUS</span>
                <span className="text-lg sm:text-xl font-bold text-white font-display block mt-1">
                  {selectedCase.reach}
                </span>
              </div>
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">PHYGITAL IMPACT</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400 font-display block mt-1">
                  {selectedCase.conversion}
                </span>
              </div>
            </div>

            <blockquote className="text-base sm:text-lg text-neutral-300 font-normal italic leading-relaxed">
              &ldquo;{selectedCase.quote}&rdquo;
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-sm font-bold text-white block">{selectedCase.client}</span>
                <span className="text-xs text-neutral-400">{selectedCase.clientRole}</span>
              </div>

              <Link
                href="/advertise"
                onClick={() => setSelectedCase(null)}
                className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-xs sm:text-sm px-6 py-3 transition-all inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB703]"
              >
                <span>Book This Format</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
