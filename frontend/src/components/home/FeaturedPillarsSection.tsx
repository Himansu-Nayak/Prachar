"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, QrCode } from "lucide-react";

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
    <section id="work" className="relative w-full bg-[#08080A] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10 overflow-hidden">
      {/* Ambient Depth Background Radial Spot */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono">
                The Architecture &amp; Case Studies
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.98] font-display">
              Featured <br />
              <span className="text-neutral-400 font-serif italic font-normal">work &amp; capabilities</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal flex flex-col justify-between">
            <p>
              PRACHAR bridges high-trust physical print with high-conversion cloud identity. Every element is designed to drive lasting neighborhood recall and immediate local response.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#FFB703]">
              <span>(↓)</span>
              <span className="uppercase tracking-widest text-[11px]">Inspect Core Capabilities</span>
            </div>
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
                className={`text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 relative ${
                  isSelected
                    ? "bg-[#141418] border border-white/20 text-white shadow-xl shadow-black/80"
                    : "bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB703] to-transparent" />
                )}
                <div className="flex items-center justify-between mb-2 font-mono text-xs">
                  <span className={isSelected ? "text-[#FFB703] font-bold" : "text-neutral-400"}>
                    {pillar.number}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400">
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

        {/* Active Case Study Presentation with Editorial Chassis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#0F0F13] border border-white/12 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
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
                <div key={i} className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono">
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
                className="rounded-full bg-white hover:bg-neutral-200 text-black text-sm font-semibold px-7 py-4 transition-all inline-flex items-center gap-2.5 shadow-lg shadow-white/5 hover:-translate-y-0.5 duration-200"
              >
                <span>{currentPillar.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Editorial Visual Showcase with Convincing Material Depth */}
          <div className="lg:col-span-6 flex items-center justify-center">
            {currentPillar.visualType === "print" && (
              <div
                className="w-full max-w-md bg-[#16161A] border border-white/20 rounded-2xl p-6 sm:p-8 relative select-none"
                style={{
                  boxShadow: `
                    inset 18px 0 28px -6px rgba(0, 0, 0, 0.85),
                    inset 0 1px 1px 0 rgba(255, 255, 255, 0.2),
                    3px 3px 0 #27272A,
                    6px 6px 0 #18181B,
                    0 30px 60px -15px rgba(0, 0, 0, 0.95)
                  `,
                }}
              >
                {/* Book Spine Bevel Highlight */}
                <div className="absolute top-0 bottom-0 left-0 w-2.5 rounded-l-2xl bg-gradient-to-r from-amber-500/25 via-white/10 to-transparent" />

                {/* Cover Specular Gloss Light Sheen */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-white/[0.08] via-transparent to-black/40" />

                <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-neutral-400 relative z-10">
                  <span className="text-[#FFB703] font-bold">PRACHAR MONTHLY BOOKLET</span>
                  <span className="text-neutral-400">50,000+ COPIES</span>
                </div>

                <div className="my-6 space-y-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#FFB703] font-mono">
                      COVER EXCLUSIVE • EDITION 10/26
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Kalinga Grand Residences
                  </h4>
                  <p className="text-xs text-[#FFB703] font-serif">
                    କଳିଙ୍ଗ ଗ୍ରାଣ୍ଡ ରେସିଡେନ୍ସି • ଇନଫୋସିଟି କରିଡର
                  </p>
                  <p className="text-xs text-neutral-300 leading-relaxed pt-2">
                    High-definition 170 GSM gloss paper stock ensures crisp typography, brilliant image reproduction, and instant QR camera scannability.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono relative z-10">
                  <span>Press: Chandan Printers, Unit-3</span>
                  <span className="text-[#FFB703] font-medium">Bhubaneswar</span>
                </div>
              </div>
            )}

            {currentPillar.visualType === "profile" && (
              <div
                className="w-full max-w-sm bg-[#15151A] border border-white/18 rounded-3xl p-6 sm:p-7 space-y-5 relative select-none"
                style={{
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.9),
                    inset 0 1px 1px rgba(255, 255, 255, 0.25)
                  `,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFB703] text-black font-black flex items-center justify-center text-lg shadow-md shadow-amber-500/20">
                    PK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-base font-display">Puri Sweets &amp; Caterers</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">/u/puri-sweets</span>
                  </div>
                </div>

                <div className="p-4 bg-black/50 rounded-2xl border border-white/10 space-y-1.5 text-xs shadow-inner">
                  <span className="text-[#FFB703] font-serif block">ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ</span>
                  <p className="text-neutral-200">Special Nayagarh Chhena Poda &amp; Marriage Catering</p>
                  <span className="text-[11px] text-neutral-400 font-mono block">Plot 104, BJB Nagar, Bhubaneswar</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="py-3 px-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-400 shadow-sm">
                    WhatsApp Chat
                  </div>
                  <div className="py-3 px-3 bg-white/10 border border-white/15 rounded-xl text-center text-xs font-bold text-white shadow-sm">
                    Save vCard
                  </div>
                </div>
              </div>
            )}

            {currentPillar.visualType === "qr" && (
              <div
                className="w-full max-w-md bg-[#15151A] border border-white/18 rounded-3xl p-8 text-center space-y-6 relative"
                style={{
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.9),
                    inset 0 1px 1px rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <div className="w-32 h-32 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center shadow-2xl relative">
                  <QrCode className="w-full h-full text-black" />
                  <div className="absolute -inset-1 rounded-2xl border border-[#FFB703]/30 pointer-events-none" />
                </div>
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#FFB703] block mb-1">
                    Permanent Edge Token
                  </span>
                  <code className="text-sm font-mono text-neutral-200 bg-black/60 px-3.5 py-1.5 rounded-lg border border-white/10 inline-block">
                    prachar.in/qr/2026-c78f
                  </code>
                </div>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed">
                  Update destination URLs, seasonal offers, and catalog documents dynamically without reprinting a single copy.
                </p>
              </div>
            )}

            {currentPillar.visualType === "corridor" && (
              <div
                className="w-full max-w-md bg-[#15151A] border border-white/18 rounded-3xl p-6 sm:p-8 space-y-4 relative"
                style={{
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.9),
                    inset 0 1px 1px rgba(255, 255, 255, 0.2)
                  `,
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                  <span className="text-[#FFB703] font-bold">BHUBANESWAR SECTORS</span>
                  <span className="text-neutral-400">50,000+ COPIES</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between p-3 bg-black/50 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                    <span className="text-white font-medium">Saheed Nagar &amp; RD Women&apos;s</span>
                    <span className="text-[#FFB703] font-mono font-bold">6,500+</span>
                  </div>
                  <div className="flex justify-between p-3 bg-black/50 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                    <span className="text-white font-medium">Patia &amp; Infocity Belt</span>
                    <span className="text-[#FFB703] font-mono font-bold">8,200+</span>
                  </div>
                  <div className="flex justify-between p-3 bg-black/50 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                    <span className="text-white font-medium">Nayapalli &amp; Jayadev Vihar</span>
                    <span className="text-[#FFB703] font-mono font-bold">7,000+</span>
                  </div>
                  <div className="flex justify-between p-3 bg-black/50 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                    <span className="text-white font-medium">BJB Nagar &amp; Lewis Road</span>
                    <span className="text-[#FFB703] font-mono font-bold">5,800+</span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] text-neutral-400 font-mono text-center">
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
