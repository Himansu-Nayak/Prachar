"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Smartphone,
  Phone,
  MessageCircle,
  RotateCw,
  CheckCircle2,
  ArrowRight,
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
    themeColor: "#FFB703",
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

  const cardTiltRef = useCardTilt(5, 1.01);

  const handleSimulateTap = () => {
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 2400);
  };

  return (
    <section className="relative w-full bg-[#0A0A0A] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
              Hardware Experience
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              Tactile Smart Card <br />
              <span className="text-neutral-500">interactive sandbox</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Physical matte-black NFC smart card with integrated contactless chip and permanent dynamic QR. Click to flip the card or simulate an instant mobile tap.
          </div>
        </div>

        {/* Merchant Switcher Pills */}
        <div className="flex items-center gap-3 pb-8 mb-10 border-b border-white/10 overflow-x-auto scrollbar-none">
          <span className="text-xs uppercase tracking-wider font-mono text-neutral-500 mr-2 flex-shrink-0">
            Sample Profile:
          </span>
          {MERCHANTS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedMerchant(m);
                setIsFlipped(false);
              }}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex-shrink-0 flex items-center gap-2 ${
                selectedMerchant.id === m.id
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              <span>{m.name}</span>
              <span className="text-[11px] opacity-60">({m.category.split(" ")[0]})</span>
            </button>
          ))}
        </div>

        {/* 3D Physical Smart Card & Interaction Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#121214] border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Left: Tactile 3D Card Object */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative p-4 sm:p-6 flex items-center justify-center">
              {/* Drop Shadow */}
              <div className="absolute bottom-2 w-[320px] sm:w-[350px] h-6 rounded-full bg-black/90 blur-xl pointer-events-none" />

              {/* Physical Card Object */}
              <div
                ref={cardTiltRef}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-[340px] sm:w-[370px] h-[215px] sm:h-[233px] relative cursor-pointer select-none transition-transform duration-500"
                style={{
                  perspective: "1200px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front Face: Matte Black Polymer */}
                <div
                  className={`absolute inset-0 rounded-2xl p-6 card-matte-surface border border-white/15 flex flex-col justify-between transition-transform duration-600 ease-out backface-hidden ${
                    isFlipped ? "rotate-y-180 opacity-0 pointer-events-none" : "rotate-y-0 opacity-100"
                  }`}
                >
                  {/* Top: EMV Chip & NFC Wave */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-8 rounded-xs emv-chip-gold border border-amber-900/60 relative p-1 grid grid-cols-2 gap-0.5 shadow-sm">
                      <div className="border-r border-b border-black/40" />
                      <div className="border-b border-black/40" />
                      <div className="border-r border-black/40" />
                      <div />
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                      <Wifi className="w-3.5 h-3.5 rotate-90 text-[#FFB703]" />
                      <span>NFC 13.56 MHz</span>
                    </div>
                  </div>

                  {/* Middle: Brand Header */}
                  <div>
                    <h4 className="text-xl font-bold text-white font-display tracking-tight">
                      {selectedMerchant.name}
                    </h4>
                    <p className="text-xs text-[#FFB703] font-serif mt-0.5">{selectedMerchant.odiaName}</p>
                    <p className="text-xs text-neutral-400 font-mono mt-1">{selectedMerchant.category}</p>
                  </div>

                  {/* Bottom: Location & Flip prompt */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400">
                    <span className="truncate max-w-[200px]">{selectedMerchant.location}</span>
                    <span className="text-[#FFB703]">Click to flip ↻</span>
                  </div>
                </div>

                {/* Back Face: Dynamic QR */}
                <div
                  className={`absolute inset-0 rounded-2xl p-6 card-matte-surface border border-white/15 flex flex-col justify-between transition-transform duration-600 ease-out backface-hidden ${
                    isFlipped ? "rotate-y-0 opacity-100" : "-rotate-y-180 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs text-[#FFB703]">
                    <span>PRACHAR DYNAMIC QR</span>
                    <span>EDGE ROUTED</span>
                  </div>

                  <div className="flex items-center justify-center gap-5 my-auto">
                    <div className="w-20 h-20 bg-white p-1 rounded-lg shadow-xl flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-18 h-18 text-black" />
                    </div>
                    <div className="font-mono text-xs space-y-1">
                      <span className="text-white font-bold block">PERMANENT URI</span>
                      <span className="text-[#FFB703] block">/qr/{selectedMerchant.id}</span>
                      <span className="text-[10px] text-neutral-400 block font-sans">
                        Zero reprint cost on offer changes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400">
                    <span>BHUBANESWAR PHYGITAL</span>
                    <span className="text-[#FFB703]">Click to flip ↻</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="rounded-full px-5 py-2.5 border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip Card</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateTap}
                className="rounded-full px-5 py-2.5 bg-[#FFB703] hover:bg-amber-400 text-black text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulate Phone Tap</span>
              </button>
            </div>
          </div>

          {/* Right: Phone Instant Resolution Result */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto bg-[#18181B] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
              {nfcTapped && (
                <div className="absolute inset-0 bg-[#FFB703]/10 border-2 border-[#FFB703] rounded-3xl flex items-center justify-center z-20 backdrop-blur-xs transition-all">
                  <div className="bg-black/90 p-5 rounded-2xl border border-white/20 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <span className="font-bold text-white text-sm block">NFC Tap Detected!</span>
                    <span className="text-xs text-neutral-400 font-mono block">Opening /u/{selectedMerchant.id}</span>
                  </div>
                </div>
              )}

              {/* Verified Badge Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-neutral-400">Mobile Resolution</span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Profile
                </span>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFB703] text-black font-bold flex items-center justify-center text-base">
                    {selectedMerchant.avatarText}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-lg font-display">{selectedMerchant.name}</h5>
                    <p className="text-xs text-neutral-400 font-mono">prachar.in/u/{selectedMerchant.id}</p>
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1 text-xs">
                  <span className="text-neutral-400 font-mono">Services &amp; Specialities:</span>
                  {selectedMerchant.services.map((s, i) => (
                    <div key={i} className="flex justify-between text-neutral-200">
                      <span>• {s.title}</span>
                      <span className="text-[#FFB703] font-semibold">{s.price}</span>
                    </div>
                  ))}
                </div>

                {/* Instant Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`https://wa.me/${selectedMerchant.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 hover:bg-emerald-900/80 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedMerchant.phone.replace(/[^0-9+]/g, "")}`}
                    className="py-3 px-3 bg-white/10 border border-white/15 rounded-xl text-center text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:bg-white/20 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Direct</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/register"
                  className="text-xs text-[#FFB703] hover:underline font-medium"
                >
                  Claim your business smart card &amp; profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
