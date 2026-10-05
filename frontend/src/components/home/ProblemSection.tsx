"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, TrendingDown, EyeOff, Smartphone, Clock, Sparkles } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="relative w-full section-light-ivory py-24 sm:py-32 px-4 sm:px-8 overflow-hidden border-t border-b border-black/10">
      {/* Editorial Dawn Transition Bar from Cosmic Darkness to Print Ivory */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#000000] via-[#000000]/25 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#050811] via-[#050811]/25 to-transparent pointer-events-none z-20" />

      {/* Subtle fine print-grid background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(rgba(15,23,42,0.06)_1px,transparent_0)] bg-[size:16px_16px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] tracking-[0.24em] font-bold text-[#E53935] uppercase bg-[#E53935]/10 border border-[#E53935]/30 px-2.5 py-1 rounded-sm">
                [SECTION 02 // THE MARKET REALITY]
              </span>
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                THE LOCAL VISIBILITY CRISIS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.05]">
              Digital Noise Drowns Local Businesses. <br />
              <span className="text-[#FF8800]">Physical Presence Endures.</span>
            </h2>
          </div>

          <div className="max-w-md font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
            Neighborhood businesses spend heavily on social media ads that disappear in half a second. PRACHAR restores tangible commercial permanence where purchasing decisions actually happen — in homes and on office desks.
          </div>
        </div>

        {/* High-Contrast Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-10">
          {/* Left: The Digital Problem (Broken Economics) */}
          <div className="p-8 sm:p-10 rounded-sm bg-white border border-rose-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-400" />
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-rose-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="font-mono text-xs font-bold tracking-wider uppercase">
                    Digital-Only Advertising Trap
                  </span>
                </div>
                <span className="font-mono text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  HIGH CHURN
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    01
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">82% Ad-Blindness &amp; Adblockers</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Social media feeds refresh instantly. Users scroll past sponsored posts without reading, while adblockers intercept display banners entirely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    02
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Algorithmic Rent-Seeking</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      The moment you stop paying pay-per-click fees, your visibility drops to zero. You never own your distribution channel.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    03
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Zero Neighborhood Trust</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Generic sponsored feeds feel anonymous and spammy. Local residents in Bhubaneswar trust what they can touch and inspect in their community.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between font-mono text-[11px] text-rose-600">
              <span>AVERAGE ATTENTION SPAN:</span>
              <span className="font-bold">1.2 SECONDS (FEED SCROLL)</span>
            </div>
          </div>

          {/* Right: The Prachar Phygital Solution */}
          <div className="p-8 sm:p-10 rounded-sm bg-[#0E1424] text-[#FFF3EA] border border-[#E4B592]/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF8800] via-[#E4B592] to-[#0EA5E9]" />
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5 text-[#FF8800]">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-mono text-xs font-bold tracking-wider uppercase">
                    The Prachar Phygital System
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  GUARANTEED RETENTION
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-[#FF8800]/10 border border-[#FF8800]/40 text-[#FF8800] flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    01
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">50,000+ Door-to-Door Living Room Placement</h3>
                    <p className="text-xs text-[#DAD0C8] mt-1 leading-relaxed">
                      Delivered free of charge directly to residential societies, clinics, and business centers across prime Bhubaneswar corridors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-[#E4B592]/10 border border-[#E4B592]/40 text-[#E4B592] flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    02
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">30-Day Tabletop Life Cycle</h3>
                    <p className="text-xs text-[#DAD0C8] mt-1 leading-relaxed">
                      Physical booklets sit on tea tables, desks, and reception counters for a full month. Viewed repeatedly by multiple family members and visitors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-sky-950/60 border border-sky-500/40 text-sky-400 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    03
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Instant Optical Conversion via QR</h3>
                    <p className="text-xs text-[#DAD0C8] mt-1 leading-relaxed">
                      Readers scan the printed dynamic QR code with any smartphone camera to open a verified digital card with 1-tap WhatsApp chat and direct vCard save.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-[#E4B592]">
              <span>AVERAGE RETENTION:</span>
              <span className="font-bold text-white">30 DAYS TABLETOP RESIDENCY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
