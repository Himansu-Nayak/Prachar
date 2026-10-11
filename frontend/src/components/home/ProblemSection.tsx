"use client";

import React from "react";
import { TrendingDown, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProblemSection() {
  return (
    <section id="reality" className="relative w-full bg-[#F9F8F5] text-[#121212] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-black/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500 block mb-3 font-mono">
              The Market Reality
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121212] tracking-tight leading-[1.04] font-display">
              Digital noise drowns. <br />
              <span className="text-neutral-500">Physical presence endures.</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            Local businesses in Bhubaneswar spend tens of thousands on social media ads that disappear in 1.2 seconds. PRACHAR restores tangible commercial permanence where real buying decisions happen — in living rooms and on business desks.
          </div>
        </div>

        {/* Editorial Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Card 1: The Digital Trap */}
          <div className="group bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-2xl p-8 sm:p-12 flex flex-col justify-between shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
            {/* Subtle top edge paper highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent" />
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-2.5 text-rose-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-wider font-mono">
                    The Digital-Only Trap
                  </span>
                </div>
                <span className="text-xs font-mono text-neutral-500">1.2s Attention</span>
              </div>

              <div className="mt-8 space-y-8">
                <div className="flex items-start gap-5">
                  <span className="text-xs font-mono text-neutral-400 font-bold mt-1">01</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                      Instant Feed Scroll &amp; Ad Fatigue
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">
                      Social feeds refresh every second. Customers scroll past sponsored posts without registering your brand, while browser adblockers hide display banners entirely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <span className="text-xs font-mono text-neutral-400 font-bold mt-1">02</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                      Algorithmic Rent-Seeking
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">
                      The day you stop paying daily pay-per-click charges, your brand visibility drops to zero. You never own the audience or the distribution channel.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <span className="text-xs font-mono text-neutral-400 font-bold mt-1">03</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                      Anonymous Local Credibility
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">
                      Sponsored feeds feel distant and unverified. Residents in Bhubaneswar trust neighborhood recommendations that they can inspect and touch in their hands.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>Audience Retention</span>
              <span className="text-rose-600 font-bold">Ephemeral (0–2 seconds)</span>
            </div>
          </div>

          {/* Card 2: The Phygital Model */}
          <div className="group bg-gradient-to-b from-[#18181D] via-[#141417] to-[#0E0E11] text-white border border-neutral-800/80 rounded-2xl p-8 sm:p-12 flex flex-col justify-between shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,183,3,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden">
            {/* Warm top rim specular highlight */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFB703]/50 to-transparent" />
            {/* Subtle atmospheric ambient glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#FFB703]/5 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5 text-[#FFB703]">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs uppercase font-bold tracking-wider font-mono">
                    The PRACHAR Phygital Model
                  </span>
                </div>
                <span className="text-xs font-mono text-[#FFB703] bg-[#FFB703]/10 px-2 py-0.5 rounded border border-[#FFB703]/20">
                  30-Day Tabletop Life
                </span>
              </div>

              <div className="mt-8 space-y-8">
                <div className="flex items-start gap-5">
                  <span className="text-xs font-mono text-[#FFB703] font-bold mt-1">01</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      50,000+ Doorstep Placement
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">
                      Delivered free of charge directly to residential societies, clinics, and business centers across 8 prime Bhubaneswar corridors. Zero discard rate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <span className="text-xs font-mono text-[#FFB703] font-bold mt-1">02</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      Tangible Tabletop Life Cycle
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">
                      High-quality printed booklets sit on tea tables and office desks for a full month, repeatedly viewed by multiple family members and visitors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <span className="text-xs font-mono text-[#FFB703] font-bold mt-1">03</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display">
                      Instant Optical Conversion
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">
                      A simple scan with any phone camera connects the reader directly to your verified digital profile, WhatsApp chat, and 1-tap address book save.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 relative z-10">
              <span>Audience Retention</span>
              <span className="text-[#FFB703] font-bold">30 Days Physical Presence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
