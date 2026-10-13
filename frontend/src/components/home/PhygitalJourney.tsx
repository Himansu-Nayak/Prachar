"use client";

import React, { useState } from "react";
import { Printer, QrCode, Smartphone, ArrowRight, MessageSquare, Phone, Check } from "lucide-react";
import Link from "next/link";

interface JourneyStage {
  step: string;
  action: string;
  title: string;
  odia: string;
  description: string;
  detail: string;
  metrics: string;
}

const STAGES: JourneyStage[] = [
  {
    step: "01",
    action: "PRINT",
    title: "Door-to-Door Living Room Placement",
    odia: "ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା",
    description:
      "50,000+ copies delivered directly to homes, clinics, and offices across Bhubaneswar. Physical booklets sit on tea tables and desks for 30 full days.",
    detail: "High-grade 170 GSM gloss paper stock ensures visual dominance and zero algorithmic decay.",
    metrics: "50,000+ COPIES • 30-DAY RETENTION",
  },
  {
    step: "02",
    action: "SCAN",
    title: "Native Smartphone Camera Scan",
    odia: "ସ୍ମାର୍ଟ କ୍ୟାମେରା ସ୍କାନ",
    description:
      "Readers point any standard iPhone or Android camera at the printed advertisement. Zero app downloads required — opens natively in the browser in under 120ms.",
    detail: "Compatible with 99.8% of modern mobile devices. High-contrast vector QR scannable even in low light.",
    metrics: "0 APPS REQUIRED • < 120MS DECODE",
  },
  {
    step: "03",
    action: "CONNECT",
    title: "Dynamic Edge Cloud Routing",
    odia: "ଡାଇନାମିକ କ୍ଲାଉଡ ରାଉଟିଙ୍ଗ",
    description:
      "Your printed code links to a permanent cloud URI (/qr/:uuid). Update menus, seasonal discounts, or phone numbers anytime in your merchant dashboard.",
    detail: "Never pay to reprint promotional materials again when your contact or catalogue changes.",
    metrics: "₹0 REPRINT COST • INSTANT UPDATES",
  },
  {
    step: "04",
    action: "DISCOVER",
    title: "Verified 1-Tap Customer Conversion",
    odia: "ଡିଜିଟାଲ ପ୍ରୋଫାଇଲ ଓ ଅର୍ଡର",
    description:
      "High-intent readers arrive at your verified profile (/u/:username) to chat on WhatsApp, place orders, or save your direct contact card with one tap.",
    detail: "Includes direct vCard address book syncing and Google search indexing for long-term organic discovery.",
    metrics: "1-TAP WHATSAPP • VCARD ADDRESS BOOK",
  },
];

export default function PhygitalJourney() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="relative w-full bg-[#0E0E10] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
              Continuous Flow
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              The Phygital <br />
              <span className="text-neutral-400">conversion journey</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Physical print builds enduring neighborhood trust. Digital dynamic infrastructure delivers instant conversion. PRACHAR synchronizes both into one seamless customer journey.
          </div>
        </div>

        {/* 4 Sequential Editorial Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map((stage, idx) => {
            const isCurrent = activeStage === idx;
            return (
              <div
                key={stage.step}
                onClick={() => setActiveStage(idx)}
                className={`cursor-pointer rounded-2xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between ${
                  isCurrent
                    ? "bg-[#18181C] border border-[#FFB703]/50 shadow-xl"
                    : "bg-[#121214] border border-white/10 hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <span className="text-3xl font-black text-white font-display">
                      {stage.step}
                    </span>
                    <span
                      className={`text-xs uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-full ${
                        isCurrent
                          ? "bg-[#FFB703] text-black"
                          : "bg-white/5 text-neutral-400 border border-white/10"
                      }`}
                    >
                      {stage.action}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white font-display leading-snug">
                      {stage.title}
                    </h3>
                    <p className="text-xs font-serif text-[#FFB703]">
                      {stage.odia}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-2">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>{stage.metrics}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Expanded Showcase */}
        <div className="mt-12 p-8 sm:p-12 rounded-3xl bg-[#141417] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono text-[#FFB703] uppercase tracking-widest block">
              Stage {STAGES[activeStage].step} In Detail
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {STAGES[activeStage].title}
            </h3>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {STAGES[activeStage].detail}
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm px-7 py-3.5 transition-all inline-flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-white/20 hover:border-white/40 text-white text-sm font-medium px-6 py-3.5 transition-all"
            >
              Try Simulator
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
