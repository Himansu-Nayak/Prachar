"use client";

import React, { useState } from "react";
import {
  Printer,
  QrCode,
  Smartphone,
  Share2,
  CheckCircle2,
  ArrowRight,
  Scan,
  PhoneCall,
  Check,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useCardTilt } from "@/lib/motion";

interface StepDetail {
  code: string;
  tag: string;
  title: string;
  odiaTitle: string;
  headline: string;
  description: string;
  metrics: { label: string; value: string }[];
  stageType: "print" | "scan" | "router" | "profile";
}

const JOURNEY_STEPS: StepDetail[] = [
  {
    code: "01",
    tag: "SYS.STAGE.01",
    title: "Physical Print Dominance",
    odiaTitle: "ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା",
    headline: "50,000+ copies delivered directly to Bhubaneswar doorsteps",
    description:
      "Physical advertisements bypass digital adblockers, algorithmic noise, and social media feed fatigue. Hand-delivered to doorsteps across 8 prime Bhubaneswar corridors, establishing tangible local trust.",
    metrics: [
      { label: "Circulation", value: "50,000+ Copies" },
      { label: "Retention Period", value: "30 Days Tabletop" },
      { label: "Delivery Fleet", value: "Dedicated Prachar Logistics" },
    ],
    stageType: "print",
  },
  {
    code: "02",
    tag: "SYS.STAGE.02",
    title: "Instant Optical Scan",
    odiaTitle: "ସ୍ମାର୍ଟ କ୍ୟାମେରା ସ୍କାନ",
    headline: "Native smartphone camera reads high-density micro-QR",
    description:
      "No app installation required. Readers point any iOS or Android camera at the printed advertisement. The optical sensor instantly decodes the secure cryptographic URL token in milliseconds.",
    metrics: [
      { label: "App Download", value: "Zero (Native Camera)" },
      { label: "Decode Latency", value: "< 120 ms" },
      { label: "Compatibility", value: "99.8% iOS & Android" },
    ],
    stageType: "scan",
  },
  {
    code: "03",
    tag: "SYS.STAGE.03",
    title: "Dynamic Cloud Router",
    odiaTitle: "ଡାଇନାମିକ କ୍ଲାଉଡ ରାଉଟିଙ୍ଗ",
    headline: "Permanent redirect token updates without reprint costs",
    description:
      "Your printed QR code points to a permanent cloud URI (/qr/:uuid). If your festival offers, phone number, or menu change, you update your destination instantly in the merchant dashboard.",
    metrics: [
      { label: "Reprinting Cost", value: "₹0 (Zero Reprint)" },
      { label: "Telemetry Tracking", value: "Live Scan Analytics" },
      { label: "Routing Latency", value: "< 15 ms via Edge" },
    ],
    stageType: "router",
  },
  {
    code: "04",
    tag: "SYS.STAGE.04",
    title: "Verified Conversion",
    odiaTitle: "ଡିଜିଟାଲ ପ୍ରୋଫାଇଲ ଓ ଅର୍ଡର",
    headline: "1-Tap WhatsApp chat, vCard save, and interactive catalog",
    description:
      "The scan resolves to your verified business profile (/u/:handle). High-intent customers tap once to message your business on WhatsApp, call directly, or save your contact into their phone's address book.",
    metrics: [
      { label: "Conversion Action", value: "1-Tap WhatsApp" },
      { label: "vCard Protocol", value: "RFC 6350 Direct Save" },
      { label: "SEO Visibility", value: "Google Search Indexed" },
    ],
    stageType: "profile",
  },
];

export default function PhygitalJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = JOURNEY_STEPS[activeStepIndex];
  const cardTiltRef = useCardTilt(5, 1.01);

  return (
    <section className="relative w-full border-t border-[#E4B592]/20 bg-[#000000] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(228,181,146,0.035)_0%,transparent_65%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="reticle-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E4B592] animate-pulse" />
                [SYS.PHYGITAL.TRANSITION]
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                PHYSICAL ↔ DIGITAL INTERACTION MODEL
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFF3EA] tracking-tight">
              The Phygital Conversion Loop.
            </h2>
            <p className="text-xs sm:text-sm text-[#DAD0C8] font-mono mt-2 max-w-2xl leading-relaxed">
              How a physical print creative in a reader&apos;s living room transforms into an active, verified digital commercial transaction within 3 seconds.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] text-slate-400 border border-white/10 px-4 py-2 rounded-full bg-[#070B14]">
            <span className="text-[#E4B592]">PROGRESSION:</span>
            <span className="text-slate-300">01 PRINT</span>
            <span className="text-[#E4B592]">→</span>
            <span className="text-slate-300">02 SCAN</span>
            <span className="text-[#E4B592]">→</span>
            <span className="text-slate-300">03 CLOUD</span>
            <span className="text-[#E4B592]">→</span>
            <span className="text-emerald-400 font-bold">04 LEAD</span>
          </div>
        </div>

        {/* Continuous Process Pipeline Bar */}
        <div className="relative mb-10">
          {/* Connecting track line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          <div
            className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-[#E4B592] -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${(activeStepIndex / (JOURNEY_STEPS.length - 1)) * 100}%` }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
            {JOURNEY_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              const isPast = idx < activeStepIndex;

              return (
                <button
                  key={step.code}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 text-left rounded-sm border transition-all duration-300 font-mono relative ${
                    isActive
                      ? "bg-[#0B1222] border-[#E4B592] shadow-[0_0_20px_-5px_rgba(228,181,146,0.3)] ring-1 ring-[#E4B592]/50"
                      : isPast
                      ? "bg-[#070B14] border-[#E4B592]/30 text-slate-300"
                      : "bg-[#050811] border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold ${
                        isActive ? "text-[#E4B592]" : isPast ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      PHASE {step.code}
                    </span>
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-slate-500">{step.tag}</span>
                    )}
                  </div>
                  <h4
                    className={`text-sm font-bold truncate ${
                      isActive ? "text-[#FFF3EA]" : "text-slate-300"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-[#E4B592]/80 font-serif truncate mt-0.5">
                    {step.odiaTitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Connected Stage for Selected Phase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Narrative Specification */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-sm border border-white/10 bg-[#070B14]/90 backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 font-mono text-xs">
                <span className="text-[#E4B592] font-bold">
                  PHASE {activeStep.code} OF 04 // {activeStep.tag}
                </span>
                <span className="text-slate-400">{activeStep.odiaTitle}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#FFF3EA] font-sans tracking-tight mb-3 leading-snug">
                {activeStep.headline}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-8">
                {activeStep.description}
              </p>

              {/* Verified Metrics */}
              <div className="space-y-3 font-mono text-xs">
                {activeStep.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xs border border-white/5 bg-black/40 flex items-center justify-between"
                  >
                    <span className="text-slate-400">{metric.label}</span>
                    <span className="text-[#E4B592] font-bold">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Step Switcher */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <button
                type="button"
                onClick={() =>
                  setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : JOURNEY_STEPS.length - 1))
                }
                className="text-slate-400 hover:text-white transition flex items-center gap-1.5"
              >
                <span>← PREVIOUS PHASE</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveStepIndex((prev) => (prev < JOURNEY_STEPS.length - 1 ? prev + 1 : 0))
                }
                className="text-[#E4B592] hover:text-white font-bold transition flex items-center gap-1.5"
              >
                <span>NEXT PHASE →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Stage with Shared Artifact Continuity */}
          <div
            ref={cardTiltRef}
            className="lg:col-span-6 relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-sm border border-[#E4B592]/30 bg-[#070B14] overflow-hidden shadow-2xl"
          >
            {/* Viewfinder corner brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#E4B592]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#E4B592]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#E4B592]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#E4B592]" />

            {/* Stage Visual 1: Physical Print on Tabletop */}
            {activeStep.stageType === "print" && (
              <div className="w-full max-w-sm space-y-4">
                <div className="p-5 rounded-xs bg-[#090D18] border border-white/10 shadow-xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-[10px]">
                    <span className="text-[#E4B592] font-bold">PRACHAR BOOKLET • P3 HALF PAGE</span>
                    <span className="text-slate-400">CHANDAN PRINTERS</span>
                  </div>

                  <div className="mt-3 p-4 rounded-2xs bg-white text-black font-sans space-y-2">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-2xs bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                      JEWELRY &amp; GOLD
                    </span>
                    <h5 className="font-black text-sm text-slate-900 leading-tight">
                      Utkal Gold &amp; Diamond Emporium
                    </h5>
                    <p className="text-[11px] text-slate-600">
                      Saheed Nagar High-Street • Special 0% Making Charge on Akshay Tritiya
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <QrCode className="w-10 h-10 text-black" />
                      <span className="text-[9px] font-mono text-slate-500">SCAN FOR WHATSAPP OFFERS</span>
                    </div>
                  </div>

                  <div className="mt-3 text-center text-[10px] font-mono text-emerald-400">
                    ✓ Delivered door-to-door to 50,000+ Bhubaneswar homes
                  </div>
                </div>
              </div>
            )}

            {/* Stage Visual 2: Optical Camera Scan Lock */}
            {activeStep.stageType === "scan" && (
              <div className="w-full max-w-sm flex flex-col items-center justify-center py-4">
                <div className="relative w-52 h-52 rounded-sm border border-[#E4B592]/50 p-6 flex flex-col items-center justify-center bg-black/90 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-hidden">
                  {/* Optical reticle corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E4B592]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#E4B592]" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#E4B592]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E4B592]" />

                  {/* Optical HUD Crosshair */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-full h-[1px] bg-[#E4B592]/15" />
                    <div className="absolute h-full w-[1px] bg-[#E4B592]/15" />
                    <div className="w-8 h-8 rounded-full border border-[#E4B592]/30" />
                  </div>

                  {/* High-Precision Laser Scan Sweep with Controlled Deceleration */}
                  <div className="absolute left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#E4B592] to-transparent shadow-[0_0_12px_#E4B592] animate-laser-sweep pointer-events-none z-20" />

                  <QrCode className="w-24 h-24 text-white opacity-90 relative z-10" />
                  <div className="mt-3 flex items-center gap-1.5 relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-[#E4B592] font-bold tracking-wider">
                      OPTICAL LOCK // NATIVE CAMERA
                    </span>
                  </div>
                </div>
                <div className="mt-4 px-3 py-1.5 rounded-full bg-[#0B1222] border border-[#E4B592]/30 font-mono text-[10px] text-slate-300 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">120ms DECODE:</span>
                  <span className="text-[#FFF3EA]">prachar.in/qr/utkal-gold</span>
                </div>
              </div>
            )}

            {/* Stage Visual 3: Dynamic Edge Cloud Router */}
            {activeStep.stageType === "router" && (
              <div className="w-full max-w-sm space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xs bg-black/90 border border-white/10 space-y-3">
                  <div className="text-[10px] text-slate-400">EDGE INCOMING SCAN REQUEST:</div>
                  <div className="p-2.5 rounded-xs bg-sky-950/70 border border-sky-800 text-sky-300">
                    GET /qr/utkal-gold
                  </div>
                  <div className="flex items-center justify-center text-[#E4B592] py-1 text-[11px]">
                    ↓ Dynamic Redis Rule (Zero Reprint Cost)
                  </div>
                  <div className="p-2.5 rounded-xs bg-emerald-950/70 border border-emerald-800 text-emerald-300">
                    HTTP 302 → /u/utkal-gold?src=booklet_p3
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center font-sans">
                  Merchant can update destination phone, menu, or offers anytime via dashboard.
                </p>
              </div>
            )}

            {/* Stage Visual 4: Verified WhatsApp Conversion */}
            {activeStep.stageType === "profile" && (
              <div className="w-full max-w-sm space-y-3">
                <div className="p-5 rounded-xs bg-[#090D18] border border-emerald-500/40 shadow-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xs bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold font-mono">
                      UG
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#FFF3EA]">Utkal Gold Emporium</h5>
                      <span className="text-[10px] font-mono text-emerald-400">✓ VERIFIED BBSR MERCHANT</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-[10px]">
                    <div className="p-2.5 rounded-xs bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5 text-center">
                      <Smartphone className="w-3 h-3" />
                      <span>WHATSAPP (1-TAP)</span>
                    </div>
                    <div className="p-2.5 rounded-xs bg-white/10 text-[#FFF3EA] font-bold flex items-center justify-center gap-1.5 text-center">
                      <PhoneCall className="w-3 h-3 text-[#E4B592]" />
                      <span>SAVE VCARD</span>
                    </div>
                  </div>
                </div>
                <div className="text-center font-mono text-[10px] text-emerald-400">
                  Lead lands directly inside merchant WhatsApp chat with prefilled context!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
