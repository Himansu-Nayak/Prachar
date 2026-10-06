"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Printer, Smartphone, QrCode, MapPin } from "lucide-react";

interface Pillar {
  number: string;
  tag: string;
  title: string;
  odia: string;
  summary: string;
  metrics: { label: string; value: string }[];
  visualType: "print" | "profile" | "qr" | "corridor";
  ctaText: string;
  ctaHref: string;
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    tag: "Physical Publicity",
    title: "The Monthly Print Booklet",
    odia: "ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା",
    summary:
      "50,000+ bound copies printed monthly on four-color offset machinery at Chandan Printers Unit-3 and delivered door-to-door across Bhubaneswar. High tactile permanence with zero scroll fatigue.",
    metrics: [
      { label: "Circulation", value: "50,000+ Copies" },
      { label: "Paper Stock", value: "170 GSM Gloss Art" },
      { label: "Tabletop Life", value: "30 Days Tabletop" },
    ],
    visualType: "print",
    ctaText: "Explore Advertising Tiers",
    ctaHref: "/advertise",
  },
  {
    number: "02",
    tag: "Digital Presence",
    title: "Verified Micro-Profile",
    odia: "ଡିଜିଟାଲ ପ୍ରୋଫାଇଲ",
    summary:
      "Search-indexed public vanity URL (/u/:username). Delivers instant 1-tap WhatsApp messaging, direct telephone dialing, and instant vCard saving directly into customer address books.",
    metrics: [
      { label: "Direct Action", value: "1-Tap WhatsApp" },
      { label: "Address Book", value: "RFC 6350 vCard" },
      { label: "Search Index", value: "SEO Optimized" },
    ],
    visualType: "profile",
    ctaText: "Claim Your Digital Profile",
    ctaHref: "/register",
  },
  {
    number: "03",
    tag: "Optical Connection",
    title: "Dynamic Cloud Router",
    odia: "ଡାଇନାମିକ କ୍ଲାଉଡ ରାଉଟିଙ୍ଗ",
    summary:
      "Permanent cloud routing token (/qr/:uuid). If your festive offers, contact numbers, or price lists change, update your destination in real time without ever paying reprinting fees.",
    metrics: [
      { label: "Reprint Cost", value: "₹0 (Zero Reprint)" },
      { label: "Routing Latency", value: "< 15 ms Edge" },
      { label: "Analytics", value: "Live Scan Telemetry" },
    ],
    visualType: "qr",
    ctaText: "Test Interactive Simulator",
    ctaHref: "/demo",
  },
  {
    number: "04",
    tag: "Local Discovery",
    title: "Bhubaneswar Saturation Grid",
    odia: "୮ ପ୍ରମୁଖ କରିଡର ବଣ୍ଟନ",
    summary:
      "Proprietary hand-to-hand distribution fleet. We do not insert into third-party newspapers. Dedicated teams deliver bound booklets directly to store owners, clinics, and residential doorsteps.",
    metrics: [
      { label: "Active Hubs", value: "8 Prime Corridors" },
      { label: "Logistics", value: "Direct Handover" },
      { label: "Cutoff", value: "18th Monthly 18:00" },
    ],
    visualType: "corridor",
    ctaText: "Audit Corridor Distribution",
    ctaHref: "/about",
  },
];

export default function FeaturedPillarsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const currentPillar = PILLARS[activeTab];

  return (
    <section id="work" className="relative w-full bg-[#0A0A0A] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header (Brand Appart style) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
              The Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              Featured <br />
              <span className="text-neutral-500">story &amp; capabilities</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            PRACHAR bridges high-trust physical print with high-conversion cloud identity. Every element is designed to drive lasting neighborhood recall and immediate local response.
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-8 mb-10 border-b border-white/10">
          {PILLARS.map((pillar, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={pillar.number}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`text-left p-4 sm:p-5 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-white/10 border border-white/20 text-white shadow-lg"
                    : "bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between mb-2 font-mono text-xs">
                  <span className={isSelected ? "text-[#FFB703] font-bold" : "text-neutral-500"}>
                    {pillar.number}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500">
                    {pillar.tag}
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base font-display text-white">
                  {pillar.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Case Study Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#121214] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16">
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-[#FFB703] font-bold">
                {currentPillar.number}
              </span>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
                / {currentPillar.tag}
              </span>
              <span className="text-xs font-serif text-[#FFB703]">
                {currentPillar.odia}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-display">
              {currentPillar.title}
            </h3>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
              {currentPillar.summary}
            </p>

            {/* Metrics List */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              {currentPillar.metrics.map((m, i) => (
                <div key={i}>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider block font-mono">
                    {m.label}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white block mt-1">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Case Action Link */}
            <div className="pt-2">
              <Link
                href={currentPillar.ctaHref}
                className="rounded-full bg-white hover:bg-neutral-200 text-black text-sm font-semibold px-6 py-3.5 transition-all inline-flex items-center gap-2"
              >
                <span>{currentPillar.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Editorial Visual Showcase */}
          <div className="lg:col-span-6 flex items-center justify-center">
            {currentPillar.visualType === "print" && (
              <div className="w-full max-w-md bg-[#18181B] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-neutral-400">
                  <span className="text-[#FFB703] font-bold">PRACHAR MONTHLY BOOKLET</span>
                  <span>50,000+ PRINT RUN</span>
                </div>
                <div className="my-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#FFB703] font-mono">
                    COVER EXCLUSIVE • EDITION 10/26
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Kalinga Grand Residences
                  </h4>
                  <p className="text-xs text-[#FFB703] font-serif">
                    କଳିଙ୍ଗ ଗ୍ରାଣ୍ଡ ରେସିଡେନ୍ସି • ଇନଫୋସିଟି କରିଡର
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed pt-2">
                    High-definition 170 GSM gloss paper stock ensures crisp typography, brilliant image reproduction, and instant QR camera scannability.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>Press: Chandan Printers, Unit-3</span>
                  <span className="text-[#FFB703]">Bhubaneswar</span>
                </div>
              </div>
            )}

            {currentPillar.visualType === "profile" && (
              <div className="w-full max-w-sm bg-[#18181B] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFB703] text-black font-bold flex items-center justify-center text-lg">
                    PK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-base font-display">Puri Sweets &amp; Caterers</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">/u/puri-sweets</span>
                  </div>
                </div>

                <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1 text-xs">
                  <span className="text-[#FFB703] font-serif block">ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ</span>
                  <p className="text-neutral-300">Special Nayagarh Chhena Poda &amp; Marriage Catering</p>
                  <span className="text-[11px] text-neutral-500 font-mono block">Plot 104, BJB Nagar, Bhubaneswar</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="py-2.5 px-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center text-xs font-semibold text-emerald-400">
                    WhatsApp Chat
                  </div>
                  <div className="py-2.5 px-3 bg-white/10 border border-white/15 rounded-xl text-center text-xs font-semibold text-white">
                    Save vCard
                  </div>
                </div>
              </div>
            )}

            {currentPillar.visualType === "qr" && (
              <div className="w-full max-w-md bg-[#18181B] border border-white/15 rounded-2xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-28 h-28 mx-auto bg-white p-3 rounded-xl flex items-center justify-center shadow-lg">
                  <QrCode className="w-full h-full text-black" />
                </div>
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#FFB703] block mb-1">
                    Permanent Edge Token
                  </span>
                  <code className="text-sm font-mono text-neutral-300 bg-black/50 px-3 py-1 rounded-md border border-white/10">
                    prachar.in/qr/2026-c78f
                  </code>
                </div>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Update destination URLs, seasonal offers, and catalog documents dynamically without reprinting a single copy.
                </p>
              </div>
            )}

            {currentPillar.visualType === "corridor" && (
              <div className="w-full max-w-md bg-[#18181B] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                  <span className="text-[#FFB703] font-bold">BHUBANESWAR SECTORS</span>
                  <span className="text-neutral-400">50,000+ COPIES</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-white font-medium">Saheed Nagar &amp; RD Women&apos;s</span>
                    <span className="text-[#FFB703] font-mono">6,500+</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-white font-medium">Patia &amp; Infocity Belt</span>
                    <span className="text-[#FFB703] font-mono">8,200+</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-white font-medium">Nayapalli &amp; Jayadev Vihar</span>
                    <span className="text-[#FFB703] font-mono">7,000+</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-white font-medium">BJB Nagar &amp; Lewis Road</span>
                    <span className="text-[#FFB703] font-mono">5,800+</span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] text-neutral-500 font-mono text-center">
                  Direct Hand-to-Hand Delivery Fleet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
