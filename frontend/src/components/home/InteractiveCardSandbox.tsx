"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  QrCode,
  Smartphone,
  Phone,
  MessageCircle,
  RotateCw,
  CheckCircle2,
  Wifi,
} from "lucide-react";
import { isReducedMotion } from "@/lib/motion";

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
    odiaName: "ଉତ୍କଳ ମଡ୍ୟୁଲାର ଇଣ୍ଟିରିଅର୍ସ",
    category: "Modular Kitchens & Acrylic Wardrobes",
    location: "Patia Infocity Square, Bhubaneswar",
    phone: "+91 98610 55432",
    whatsapp: "+91 70770 11733",
    themeColor: "#E11D48",
    avatarText: "UI",
    services: [
      { title: "L-Shaped Acrylic Modular Kitchen", price: "₹1.25L Base" },
      { title: "Complete 3BHK False Ceiling & Lighting", price: "₹85,000" },
    ],
  },
];

export default function InteractiveCardSandbox() {
  const [selectedMerchant, setSelectedMerchant] = useState<SandboxMerchant>(MERCHANTS[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [nfcTapped, setNfcTapped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 14,
      ry: x * 16,
      px: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      py: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, px: 50, py: 50 });
  }, []);

  const handleSimulateTap = () => {
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 2400);
  };

  return (
    <section className="relative w-full bg-[#070709] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10 overflow-hidden">
      {/* Ambient Depth Background Spot */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
              Hardware Experience
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              Tactile Smart Card <br />
              <span className="text-neutral-400">interactive sandbox</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Physical matte-black NFC smart card with integrated contactless chip and permanent dynamic QR. Click to flip the card or simulate an instant mobile tap.
          </div>
        </div>

        {/* Merchant Switcher Pills */}
        <div className="flex items-center gap-3 pb-8 mb-10 border-b border-white/10 overflow-x-auto scrollbar-none">
          <span className="text-xs uppercase tracking-wider font-mono text-neutral-400 mr-2 flex-shrink-0">
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
                  ? "bg-white text-black font-bold shadow-lg"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              <span>{m.name}</span>
              <span className={selectedMerchant.id === m.id ? "text-neutral-600 text-[11px]" : "text-neutral-300 text-[11px]"}>
                ({m.category.split(" ")[0]})
              </span>
            </button>
          ))}
        </div>

        {/* 3D Physical Smart Card & Interaction Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#0F0F13] border border-white/12 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* Left: Tactile 3D Card Object */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative p-4 sm:p-6 flex items-center justify-center">
              {/* Dynamic Drop Shadow responding to tilt */}
              <div
                className="absolute bottom-0 w-[320px] sm:w-[350px] h-8 rounded-full bg-black/95 blur-xl pointer-events-none transition-transform duration-300"
                style={{
                  transform: `translateX(${-tilt.ry * 1.5}px) translateY(${Math.abs(tilt.rx) * 0.5}px) scale(${1 - Math.abs(tilt.rx) * 0.02})`,
                }}
              />

              {/* Physical Card Object with Dynamic Perspective */}
              <div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-[340px] sm:w-[370px] h-[215px] sm:h-[233px] relative cursor-pointer select-none transition-transform duration-300 ease-out"
                style={{
                  perspective: "1200px",
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry + (isFlipped ? 180 : 0)}deg)`,
                }}
              >
                {/* Front Face: Matte Black Polymer */}
                <div
                  className="absolute inset-0 rounded-2xl p-6 bg-gradient-to-br from-[#1C1C22] via-[#121217] to-[#0A0A0D] border border-white/20 flex flex-col justify-between overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    boxShadow: `
                      inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35),
                      inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.95),
                      0 30px 60px -15px rgba(0, 0, 0, 0.9)
                    `,
                  }}
                >
                  {/* Dynamic Specular Sheen */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                    style={{
                      background: `radial-gradient(circle 280px at ${tilt.px}% ${tilt.py}%, rgba(255, 255, 255, 0.12) 0%, transparent 70%)`,
                    }}
                  />

                  {/* Top: Architectural Satin Gold EMV Chip & NFC Wave */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-11 h-8 rounded-sm bg-gradient-to-br from-[#E6C687] via-[#D4AF37] to-[#996515] border border-[#8C6D23]/80 relative p-0.5 shadow-sm overflow-hidden flex flex-col justify-between">
                      {/* Realistic EMV Contact Pad Geometry */}
                      <div className="h-full w-full border border-black/25 rounded-xs grid grid-cols-3 grid-rows-2 gap-[1px] bg-black/20 p-[1px]">
                        <div className="bg-[#E6C687]/80 rounded-[1px]" />
                        <div className="bg-[#DFB76C]/90 rounded-[1px] row-span-2 my-auto h-3/4" />
                        <div className="bg-[#E6C687]/80 rounded-[1px]" />
                        <div className="bg-[#D4AF37]/80 rounded-[1px]" />
                        <div className="bg-[#D4AF37]/80 rounded-[1px]" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      <Wifi className="w-3.5 h-3.5 rotate-90 text-[#FFB703]" />
                      <span>NFC Contactless</span>
                    </div>
                  </div>

                  {/* Middle: Brand Header */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white font-display tracking-tight">
                      {selectedMerchant.name}
                    </h3>
                    <p className="text-xs text-[#FFB703] font-serif mt-0.5">{selectedMerchant.odiaName}</p>
                    <p className="text-xs text-neutral-400 font-mono mt-1">{selectedMerchant.category}</p>
                  </div>

                  {/* Bottom: Location & Flip prompt */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400 relative z-10">
                    <span className="truncate max-w-[200px]">{selectedMerchant.location}</span>
                    <span className="text-[#FFB703] font-semibold flex items-center gap-1">
                      Click to flip <RotateCw className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Back Face: Dynamic QR */}
                <div
                  className="absolute inset-0 rounded-2xl p-6 bg-gradient-to-br from-[#1C1C22] via-[#121217] to-[#0A0A0D] border border-white/20 flex flex-col justify-between overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    boxShadow: `
                      inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35),
                      inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.95),
                      0 30px 60px -15px rgba(0, 0, 0, 0.9)
                    `,
                  }}
                >
                  {/* Dynamic Specular Sheen for Back */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle 280px at ${100 - tilt.px}% ${tilt.py}%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`,
                    }}
                  />

                  <div className="flex items-center justify-between font-mono text-xs text-[#FFB703] relative z-10">
                    <span className="font-bold tracking-wider">PRACHAR DYNAMIC QR</span>
                    <span className="text-neutral-300 font-medium tracking-wide">• INSTANT REDIRECT</span>
                  </div>

                  <div className="flex items-center justify-center gap-5 my-auto relative z-10">
                    <div className="w-20 h-20 bg-white p-1.5 rounded-xl shadow-2xl flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-16 h-16 text-black" />
                    </div>
                    <div className="font-mono text-xs space-y-1">
                      <span className="text-white font-bold block">PERMANENT URI</span>
                      <span className="text-[#FFB703] block font-semibold">/qr/{selectedMerchant.id}</span>
                      <span className="text-[10px] text-neutral-400 block font-sans">
                        Zero reprint cost on offer changes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[10px] text-neutral-400 relative z-10">
                    <span>BHUBANESWAR PHYGITAL</span>
                    <span className="text-[#FFB703] font-semibold flex items-center gap-1">
                      Click to flip <RotateCw className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="rounded-full px-5 py-2.5 border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#FFB703]" />
                <span>Flip Card (180°)</span>
              </button>
              <button
                type="button"
                onClick={handleSimulateTap}
                className="rounded-full px-5 py-2.5 bg-[#FFB703] hover:bg-amber-400 text-black text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10 hover:-translate-y-0.5 duration-200"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulate Phone Tap</span>
              </button>
            </div>
          </div>

          {/* Right: Phone Instant Resolution Result */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto bg-[#16161B] border border-white/18 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
              {nfcTapped && (
                <div className="absolute inset-0 bg-[#FFB703]/10 border-2 border-[#FFB703] rounded-3xl flex items-center justify-center z-20 backdrop-blur-xs transition-all animate-in fade-in">
                  <div className="bg-black/95 p-5 rounded-2xl border border-white/20 text-center space-y-2 shadow-2xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <span className="font-bold text-white text-sm block">NFC Tap Detected!</span>
                    <span className="text-xs text-neutral-400 font-mono block">Opening /u/{selectedMerchant.id}</span>
                  </div>
                </div>
              )}

              {/* Verified Badge Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-neutral-400">Mobile Resolution</span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Profile
                </span>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFB703] text-black font-black flex items-center justify-center text-base shadow-md shadow-amber-500/20">
                    {selectedMerchant.avatarText}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg font-display">{selectedMerchant.name}</h3>
                    <p className="text-xs text-neutral-400 font-mono">prachar.in/u/{selectedMerchant.id}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-black/50 rounded-xl border border-white/10 space-y-1.5 text-xs shadow-inner">
                  <span className="text-neutral-400 font-mono block text-[11px]">Services &amp; Specialities:</span>
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
                    className="py-3 px-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 hover:bg-emerald-900/80 transition shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedMerchant.phone.replace(/[^0-9+]/g, "")}`}
                    className="py-3 px-3 bg-white/10 border border-white/15 rounded-xl text-center text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:bg-white/20 transition shadow-sm"
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
