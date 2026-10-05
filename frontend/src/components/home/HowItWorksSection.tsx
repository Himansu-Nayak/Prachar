"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Printer, Truck, ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      tag: "SYS.SCHEDULE.01",
      title: "Monthly Editorial Cutoff",
      odia: "ମାସିକ ୧୮ ତାରିଖ ବୁକିଂ",
      headline: "18th of Every Month // 18:00 IST",
      description:
        "Select your advertising format (P1 Full Page Cover to P5 Business Card). Upload high-resolution print creative (PDF/TIFF/JPEG at 300 DPI) or collaborate with our in-house layout team. Editorial review and proofs completed within 24 hours.",
      highlight: "Strict Monthly Cutoff for Press Plate Preparation",
      icon: Calendar,
      meta: "DEADLINE: 18TH 18:00 IST",
    },
    {
      num: "02",
      tag: "SYS.PRESS.02",
      title: "Precision Press Synchronization",
      odia: "ଚନ୍ଦନ ପ୍ରିଣ୍ଟର୍ସ, ୟୁନିଟ-୩",
      headline: "Chandan Printers, Unit-3 Press, Bhubaneswar",
      description:
        "Printed on high-grade art paper with vibrant four-color offset machinery at Chandan Printers, Unit-3. High-definition color reproduction ensures sharp typography and crystal-clear dynamic vector QR code scannability.",
      highlight: "50,000+ Verified Circulation Print Run",
      icon: Printer,
      meta: "PRESS: CHANDAN PRINTERS",
    },
    {
      num: "03",
      tag: "SYS.FLEET.03",
      title: "Direct Door-to-Door Logistics",
      odia: "ଘରେ ଘରେ ସିଧାସଳଖ ବଣ୍ଟନ",
      headline: "Proprietary Hand-to-Hand Delivery Fleet",
      description:
        "We do not loosely insert leaflets into third-party newspapers. Dedicated, uniform Prachar distribution teams hand-deliver bound booklets directly to doorsteps, commercial offices, retail stores, and clinic waiting rooms across 8 Bhubaneswar corridors.",
      highlight: "Zero Discard Rate • Direct Handover",
      icon: Truck,
      meta: "FLEET: DIRECT HANDOVER",
    },
  ];

  return (
    <section className="relative w-full section-light-warm py-24 sm:py-32 px-4 sm:px-8 overflow-hidden border-t border-b border-black/10">
      {/* Subtle fine print-grid background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(rgba(15,23,42,0.06)_1px,transparent_0)] bg-[size:16px_16px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] tracking-[0.24em] font-bold text-[#FF8800] uppercase bg-[#FF8800]/10 border border-[#FF8800]/30 px-2.5 py-1 rounded-sm">
                [SECTION 07 // LOGISTICAL CHOREOGRAPHY]
              </span>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                HOW IT WORKS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.05]">
              From Digital Reservation <br />
              <span className="text-[#FF8800]">To 50,000 Doorsteps.</span>
            </h2>
          </div>

          <div className="max-w-md font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every edition adheres to a strict calendar synchronized with Chandan Printers Unit-3 press operations and proprietary street-level delivery teams.
          </div>
        </div>

        {/* Editorial Process Progression Track */}
        <div className="hidden md:flex items-center justify-between mb-8 px-6 py-3.5 bg-black/5 border border-black/10 rounded-sm font-mono text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8800]" />
            <span className="font-bold text-[#0F172A]">[01] 18TH EDITORIAL CUTOFF</span>
          </div>
          <span className="text-slate-400">──────────▶</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
            <span className="font-bold text-[#0F172A]">[02] UNIT-3 OFFSET PRESS RUN</span>
          </div>
          <span className="text-slate-400">──────────▶</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-bold text-[#0F172A]">[03] DIRECT CORRIDOR HANDOVER</span>
          </div>
        </div>

        {/* 3-Step Interactive Connected Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const topColors = [
              "from-[#FF8800] to-amber-500",
              "from-[#0EA5E9] to-cyan-500",
              "from-emerald-500 to-teal-500",
            ];

            return (
              <div
                key={idx}
                className="p-8 rounded-sm bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 relative overflow-hidden group"
              >
                {/* Top phase accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${topColors[idx]}`} />

                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <span className="font-mono text-2xl font-black text-[#0F172A]">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:bg-[#FF8800]/10 group-hover:border-[#FF8800]/30 group-hover:text-[#FF8800] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <span className="font-mono text-[10px] text-[#FF8800] uppercase font-bold tracking-widest block">
                      {step.title}
                    </span>
                    <h3 className="text-lg font-bold text-[#0F172A] font-sans">
                      {step.headline}
                    </h3>
                    <p className="font-serif text-xs text-slate-500 pb-2">
                      {step.odia}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span className="text-emerald-700 font-semibold">{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guaranteed Distribution Banner */}
        <div className="mt-12 p-8 rounded-sm bg-[#0E1424] text-[#FFF3EA] border border-[#E4B592]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                VERIFIED PHYSICAL DELIVERY AUDIT
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white font-sans">
              Book Your Slot Before the 18th Monthly Editorial Cutoff
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans">
              Print slots in P1 (Cover) and P2 (Full Page) sell out rapidly every month. Once plates are set, bookings roll over to the following monthly edition.
            </p>
          </div>

          <Link
            href="/advertise"
            className="reticle-btn-primary whitespace-nowrap bg-[#FF8800] hover:bg-orange-500 text-black font-bold border-none"
          >
            <span>RESERVE PRINT SPACE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
