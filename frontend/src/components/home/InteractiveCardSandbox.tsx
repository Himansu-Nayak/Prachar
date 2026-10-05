"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  Smartphone,
  Phone,
  MessageCircle,
  RotateCw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Radio,
  Wifi,
} from "lucide-react";
import { useCardTilt } from "@/lib/motion";

interface SandboxMerchant {
  id: string;
  name: string;
  odiaName: string;
  category: string;
  location: string;
  phone: string;
  whatsapp: string;
  themeColor: string;
  avatarText: string;
  services: { title: string; price: string }[];
}

const MERCHANTS: SandboxMerchant[] = [
  {
    id: "puri-sweets",
    name: "Puri Sweets & Caterers",
    odiaName: "ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ",
    category: "Sweets & Wedding Catering",
    location: "Plot 104, BJB Nagar, Bhubaneswar",
    phone: "+91 91788 98844",
    whatsapp: "+91 70770 11733",
    themeColor: "#EA580C",
    avatarText: "PS",
    services: [
      { title: "Special Nayagarh Chhena Poda", price: "₹450 / kg" },
      { title: "Wedding Catering Feast (500+ guests)", price: "Custom Quote" },
    ],
  },
  {
    id: "kalinga-clinic",
    name: "Kalinga Care Polyclinic & Lab",
    odiaName: "କଳିଙ୍ଗ କେୟାର ପଲିକ୍ଲିନିକ",
    category: "Specialist Doctors & Pathology",
    location: "Plot A-12, Saheed Nagar, Bhubaneswar",
    phone: "+91 674 2541200",
    whatsapp: "+91 70770 11733",
    themeColor: "#0284C7",
    avatarText: "KC",
    services: [
      { title: "Physician & Cardiologist OPD", price: "₹500 Consultation" },
      { title: "Complete Full-Body Health Check (68 tests)", price: "₹1,499" },
    ],
  },
  {
    id: "utkal-interiors",
    name: "Utkal Modular Interiors & Decor",
    odiaName: "ଉତ୍କଳ ମଡ୍ୟୁଲାର ଇଣ୍ଟିରିୟର୍ସ",
    category: "Acrylic Kitchens & Architecture",
    location: "Infocity Road, Patia, Bhubaneswar",
    phone: "+91 98610 55432",
    whatsapp: "+91 70770 11733",
    themeColor: "#8B5CF6",
    avatarText: "UI",
    services: [
      { title: "Bespoke Acrylic Modular Kitchen", price: "From ₹1.8 Lakh" },
      { title: "Complete 3BHK Turnkey Interior", price: "Turnkey Quote" },
    ],
  },
];

export default function InteractiveCardSandbox() {
  const [selectedMerchant, setSelectedMerchant] = useState(MERCHANTS[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [nfcTapped, setNfcTapped] = useState(false);

  // Controlled tilt: max 6 degrees for physical restraint
  const cardTiltRef = useCardTilt(6, 1.015);

  const handleSimulateTap = () => {
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 2400);
  };

  return (
    <section className="relative w-full border-t border-[#E4B592]/20 bg-[#000000] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden">
      {/* Subtle deep ambient atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(228,181,146,0.03)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="reticle-badge mb-3">
            [TACTILE_HARDWARE // SIMULATOR]
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFF3EA] tracking-tight">
            Tactile Smart Card Simulator.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-3">
            Physically believable matte-black NFC card with integrated NTAG215 wireless telemetry and dynamic QR router.
          </p>

          {/* Merchant Pill Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {MERCHANTS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMerchant(m);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                  selectedMerchant.id === m.id
                    ? "bg-[#E4B592] text-black font-bold border-[#E4B592] shadow-md shadow-[#E4B592]/20"
                    : "bg-[#070B14] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span>{m.name.split(" ")[0]}</span>
                <span className="text-[10px] opacity-70 ml-1">({m.category.split(" ")[0]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Physical Smart Card & Interaction Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Physically Grounded 3D Card Object */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {/* Card Pedestal with realistic ambient contact shadow */}
            <div className="relative p-4 sm:p-6 flex items-center justify-center">
              {/* Soft contact drop shadow casting on the surface */}
              <div
                className="absolute bottom-2 w-[320px] sm:w-[350px] h-6 rounded-full bg-black/90 blur-xl transition-all duration-300 pointer-events-none"
                style={{
                  transform: `scale(${isFlipped ? 0.95 : 1})`,
                }}
              />

              {/* 3D Card Object with ISO/IEC 7810 ID-1 standard aspect ratio (85.60 x 53.98 mm) */}
              <div
                ref={cardTiltRef}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-[340px] sm:w-[370px] h-[215px] sm:h-[233px] relative cursor-pointer select-none transition-transform duration-500"
                style={{
                  perspective: "1200px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Physical Card Front Face: Matte Obsidian Polymer */}
                <div
                  className={`absolute inset-0 rounded-xl p-6 card-matte-surface border border-[#E4B592]/30 flex flex-col justify-between transition-transform duration-600 ease-out backface-hidden ${
                    isFlipped ? "rotate-y-180 opacity-0 pointer-events-none" : "rotate-y-0 opacity-100"
                  }`}
                  style={{
                    boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.8), 0 20px 40px -10px rgba(0, 0, 0, 0.95)",
                  }}
                >
                  {/* Top: EMV Contact Chip & Contactless Wave Glyph */}
                  <div className="flex items-center justify-between">
                    {/* Realistic Gold EMV Contact Chip with segmented contact pads */}
                    <div className="w-11 h-8 rounded-xs emv-chip-gold border border-amber-900/60 relative p-1 grid grid-cols-2 gap-0.5 shadow-sm">
                      <div className="border-r border-b border-black/40" />
                      <div className="border-b border-black/40" />
                      <div className="border-r border-black/40" />
                      <div />
                    </div>

                    {/* Contactless Wave Glyphs (ISO 14443) */}
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#E4B592]">
                      <Wifi className="w-4 h-4 rotate-90" />
                      <span className="tracking-widest">NFC 13.56 MHz</span>
                    </div>
                  </div>

                  {/* Middle: Debossed Hot-Stamped Metallic Brand */}
                  <div>
                    <h4
                      className="text-lg font-bold text-[#FFF3EA] font-sans tracking-tight"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
                    >
                      {selectedMerchant.name}
                    </h4>
                    <p className="text-xs text-[#E4B592] font-serif">{selectedMerchant.odiaName}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedMerchant.category}</p>
                  </div>

                  {/* Bottom: Legal & Geographic Identifier */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[9px] text-slate-400">
                    <span className="truncate max-w-[200px]">{selectedMerchant.location}</span>
                    <span className="text-[#E4B592] flex-shrink-0">CLICK TO FLIP ↻</span>
                  </div>
                </div>

                {/* Physical Card Back Face: Dynamic QR Resolution Surface */}
                <div
                  className={`absolute inset-0 rounded-xl p-6 card-matte-surface border border-[#E4B592]/30 flex flex-col justify-between transition-transform duration-600 ease-out backface-hidden ${
                    isFlipped ? "rotate-y-0 opacity-100" : "-rotate-y-180 opacity-0 pointer-events-none"
                  }`}
                  style={{
                    boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.8), 0 20px 40px -10px rgba(0, 0, 0, 0.95)",
                  }}
                >
                  {/* Subtle NFC Internal Coil Trace Outline */}
                  <div className="absolute inset-2 border border-white/5 rounded-lg pointer-events-none" />

                  <div className="flex items-center justify-between font-mono text-[10px] text-[#E4B592]">
                    <span>PRACHAR DYNAMIC QR</span>
                    <span>UUID ROUTING</span>
                  </div>

                  {/* Central Crisp QR Code Block */}
                  <div className="flex items-center justify-center gap-5 my-auto">
                    <div className="w-20 h-20 bg-white p-1 rounded-xs shadow-xl flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-18 h-18 text-black" />
                    </div>
                    <div className="font-mono text-xs space-y-1">
                      <span className="text-white font-bold block">PERMANENT CLOUD URI</span>
                      <span className="text-[#E4B592] block">/qr/{selectedMerchant.id}</span>
                      <span className="text-[9px] text-slate-400 block font-sans">
                        Zero reprint cost on destination change
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[9px] text-slate-400">
                    <span>BHUBANESWAR PHYGITAL NETWORK</span>
                    <span className="text-[#E4B592]">CLICK TO FLIP ↻</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-3 mt-4 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>FLIP CARD</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateTap}
                className="px-4 py-2 rounded-full border border-[#E4B592] bg-[#E4B592]/10 hover:bg-[#E4B592] text-[#FFF3EA] hover:text-black font-bold transition flex items-center gap-1.5 shadow-md shadow-[#E4B592]/20"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SIMULATE PHONE TAP</span>
              </button>
            </div>
          </div>

          {/* Right: Resolved Digital Experience */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-sm border border-white/10 bg-[#070B14]/90 backdrop-blur-xl relative">
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#E4B592]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#E4B592]" />

            {/* Tap Notification Feedback */}
            {nfcTapped && (
              <div className="mb-4 p-3 rounded-xs bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>NFC TAP DETECTED // Resolved in 84ms to /u/{selectedMerchant.id}</span>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
              <span className="text-[#E4B592] font-bold">DIGITAL MICRO-PROFILE</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                VERIFIED PROFILE
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xs flex items-center justify-center font-bold text-white font-mono text-lg shadow-md"
                style={{ backgroundColor: selectedMerchant.themeColor }}
              >
                {selectedMerchant.avatarText}
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#FFF3EA] font-sans">
                  {selectedMerchant.name}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  prachar.in/u/{selectedMerchant.id}
                </p>
              </div>
            </div>

            {/* 1-Tap Actions */}
            <div className="grid grid-cols-2 gap-3 mt-5 font-mono text-xs">
              <a
                href={`https://wa.me/${selectedMerchant.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(selectedMerchant.name)},%20I%20saw%20your%20Prachar%20card`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>1-TAP WHATSAPP</span>
              </a>
              <a
                href={`tel:${selectedMerchant.phone.replace(/[^0-9]/g, "")}`}
                className="p-3 rounded-xs bg-white/10 hover:bg-white/15 text-[#FFF3EA] font-bold flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-[#E4B592]" />
                <span>DIRECT CALL</span>
              </a>
            </div>

            {/* Catalog Items */}
            <div className="mt-5 pt-4 border-t border-white/10 font-mono text-xs space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Featured Catalog Items:
              </span>
              {selectedMerchant.services.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xs bg-black/60 border border-white/5 flex items-center justify-between"
                >
                  <span className="text-slate-300 font-sans">{srv.title}</span>
                  <span className="text-[#E4B592] font-bold">{srv.price}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span>SCAN TELEMETRY: REAL-TIME TRACKING</span>
              <Link href="/demo" className="text-[#E4B592] hover:underline flex items-center gap-1">
                <span>FULL SIMULATOR</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
