"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  CreditCard,
  QrCode,
  Phone,
  MessageCircle,
  Download,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
  Wifi,
  Radio,
  Share2,
} from "lucide-react";
import { useCardTilt } from "@/lib/motion";
import ReticleBox from "@/components/ui/ReticleBox";

interface DemoPreset {
  id: string;
  name: string;
  odiaName: string;
  tagline: string;
  category: string;
  location: string;
  phone: string;
  whatsapp: string;
  themeColor: string;
  avatarText: string;
  services: { title: string; price: string; desc: string }[];
}

const PRESETS: DemoPreset[] = [
  {
    id: "puri-sweets",
    name: "Puri Sweets & Caterers",
    odiaName: "ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ",
    tagline: "Authentic Odia Sweets, Chhena Poda & Premium Wedding Catering",
    category: "Restaurant, Sweets & Catering",
    location: "Plot 104, Near BJB College, BJB Nagar, Bhubaneswar",
    phone: "+91 91788 98844",
    whatsapp: "+91 70770 11733",
    themeColor: "#EA580C",
    avatarText: "PS",
    services: [
      { title: "Special Nayagarh Chhena Poda", price: "₹450 / kg", desc: "Slow baked over sal leaves with cardamom and cashew." },
      { title: "Wedding & Festive Bulk Catering", price: "Custom Quote", desc: "Complete Odia traditional feast for up to 2,000 guests." },
      { title: "Rasagola & Khira Gaja Gift Boxes", price: "From ₹250", desc: "Hygienic sealed souvenir boxes for transit & gifting." },
    ],
  },
  {
    id: "kalinga-clinic",
    name: "Kalinga Care Polyclinic & Lab",
    odiaName: "କଳିଙ୍ଗ କେୟାର ପଲିକ୍ଲିନିକ",
    tagline: "Consultant Physicians, Digital X-Ray & Comprehensive Pathology",
    category: "Clinic, Pharmacy & Healthcare",
    location: "Plot A-12, Opposite Rama Devi University, Saheed Nagar, Bhubaneswar",
    phone: "+91 674 2541200",
    whatsapp: "+91 70770 11733",
    themeColor: "#0284C7",
    avatarText: "KC",
    services: [
      { title: "Specialist OPD Consultation", price: "₹500", desc: "Cardiologist, Diabetologist & Pediatrician daily clinics." },
      { title: "Complete Full-Body Health Check", price: "₹1,499", desc: "68 Vital parameters including Lipid & Thyroid profile." },
      { title: "Home Blood Sample Collection", price: "Free in BBSR", desc: "Prompt morning technician visits across Bhubaneswar." },
    ],
  },
  {
    id: "utkal-interiors",
    name: "Utkal Modular Interiors & Decor",
    odiaName: "ଉତ୍କଳ ମଡ୍ୟୁଲାର ଇଣ୍ଟିରିୟର୍ସ",
    tagline: "Bespoke Acrylic Kitchens, Wardrobes & Complete Home Turnkey Execution",
    category: "Architecture, Interior & Home Decor",
    location: "Infocity Road, Near DLF Cybercity, Patia, Bhubaneswar",
    phone: "+91 98610 55432",
    whatsapp: "+91 70770 11733",
    themeColor: "#8B5CF6",
    avatarText: "UI",
    services: [
      { title: "Modular Kitchen Turnkey Package", price: "From ₹1.8 Lakh", desc: "Waterproof HDHMR carcass with Hafele soft-close fittings." },
      { title: "Full 3BHK False Ceiling & Lighting", price: "₹95 / sq.ft", desc: "Saint-Gobain gypsum boards with concealed COB LED strips." },
      { title: "3D Architectural Visualization", price: "Complimentary", desc: "Photorealistic 360-degree render before project execution." },
    ],
  },
];

export default function DemoPage() {
  const [activePreset, setActivePreset] = useState<DemoPreset>(PRESETS[0]);
  const [viewMode, setViewMode] = useState<"CARD" | "PHONE">("CARD");
  const [isFlipped, setIsFlipped] = useState(false);
  const [nfcTapped, setNfcTapped] = useState(false);
  const [interactionToast, setInteractionToast] = useState<string | null>(null);

  // Controlled tilt for card realism
  const cardTiltRef = useCardTilt(6, 1.015);

  const triggerToast = (msg: string) => {
    setInteractionToast(msg);
    setTimeout(() => setInteractionToast(null), 3200);
  };

  const handleSimulateTap = () => {
    setNfcTapped(true);
    triggerToast(`NFC Handshake 13.56MHz: ${activePreset.name} vCard resolved in 84ms`);
    setTimeout(() => setNfcTapped(false), 2400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 lg:py-20 text-[#FFF3EA]">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="reticle-badge mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4B592] animate-pulse" />
          [SIMULATOR // PHYGITAL_INTERFACE]
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#FFF3EA] tracking-tight leading-tight mt-2 mb-4">
          Tactile Smart Card &amp; Mobile Scanner.
        </h1>
        <p className="text-xs sm:text-sm text-[#DAD0C8] font-mono leading-relaxed max-w-xl mx-auto">
          Experience the full interaction loop: contactless 13.56 MHz NFC tap on matte polycarbonate, or high-density optical scan resolving to verified digital micro-profiles.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <span className="font-mono text-[10px] uppercase font-bold text-slate-400 mr-2 tracking-wider">
          SAMPLE MERCHANT:
        </span>
        {PRESETS.map((p) => {
          const isSelected = activePreset.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setActivePreset(p);
                setIsFlipped(false);
              }}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all border ${
                isSelected
                  ? "bg-[#E4B592] text-black font-bold border-[#E4B592] shadow-[0_0_15px_rgba(228,181,146,0.3)]"
                  : "bg-[#070B14] border-white/10 text-slate-400 hover:text-[#FFF3EA] hover:border-white/20"
              }`}
            >
              <span>{p.name.split(" ")[0]}</span>
              <span className="text-[10px] opacity-75 ml-1">({p.category.split(",")[0].trim()})</span>
            </button>
          );
        })}
      </div>

      {/* View Mode Toggle: Physical Card vs Scanned Mobile */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div className="p-1 rounded-full bg-[#070B14] border border-white/10 flex items-center font-mono text-xs">
          <button
            type="button"
            onClick={() => setViewMode("CARD")}
            className={`px-5 py-2 rounded-full transition-all flex items-center gap-2 ${
              viewMode === "CARD"
                ? "bg-[#E4B592] text-black font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>01. PHYSICAL NFC CARD</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("PHONE")}
            className={`px-5 py-2 rounded-full transition-all flex items-center gap-2 ${
              viewMode === "PHONE"
                ? "bg-[#E4B592] text-black font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>02. SCANNED MOBILE OLED</span>
          </button>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="flex flex-col items-center justify-center min-h-[480px]">
        {/* VIEW 1: PHYSICAL SMART CARD SIMULATOR */}
        {viewMode === "CARD" && (
          <div className="flex flex-col items-center gap-8 w-full">
            {/* Card Pedestal with realistic ambient contact shadow */}
            <div className="relative p-4 sm:p-6 flex items-center justify-center">
              {/* Soft ambient ground contact shadow */}
              <div className="absolute bottom-2 w-64 sm:w-80 h-8 bg-black/80 blur-xl rounded-full pointer-events-none" />

              {/* 3D Transform Container (ISO/IEC 7810 ID-1 standard ratio: 85.60 x 53.98mm) */}
              <div
                ref={cardTiltRef}
                style={{ perspective: "1200px" }}
                className="relative cursor-pointer transition-transform duration-200 ease-out"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className="w-[330px] sm:w-[440px] aspect-[1.586/1] relative rounded-2xl transition-all duration-700 [transform-style:preserve-3d] select-none"
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT FACE: Obsidian Matte Polycarbonate + Gold Foil & Chip */}
                  <div
                    className={`absolute inset-0 rounded-2xl p-6 sm:p-7 card-matte-surface border border-white/15 flex flex-col justify-between overflow-hidden backface-hidden ${
                      isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    {/* Controlled edge highlight */}
                    <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

                    {/* Antenna coil micro trace trace in perimeter */}
                    <div className="absolute inset-2 border border-white/[0.04] rounded-xl pointer-events-none" />

                    {/* Top Row: Metallic EMV Chip + Contactless Wave */}
                    <div className="flex items-center justify-between relative z-10">
                      {/* Realistic EMV Gold Contact Chip */}
                      <div className="w-11 h-8 rounded-sm emv-chip-gold relative overflow-hidden border border-amber-300/40 flex items-center justify-center shadow-md">
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 border-t border-b border-black/25">
                          <div className="border-r border-black/20" />
                          <div className="border-r border-black/20" />
                        </div>
                        <div className="w-3.5 h-3 rounded-2xs border border-black/30 bg-amber-400/30" />
                      </div>

                      {/* Contactless Wave Glyphs & Status */}
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 rotate-90 text-[#E4B592]" />
                        <span className="font-mono text-[9px] font-bold text-[#E4B592] uppercase tracking-wider">
                          13.56 MHz
                        </span>
                      </div>
                    </div>

                    {/* Center: Merchant Name & Odia Typography */}
                    <div className="relative z-10 my-auto">
                      <span className="font-mono text-[9px] text-[#E4B592] uppercase tracking-[0.2em] font-semibold block mb-0.5">
                        {activePreset.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#FFF3EA] tracking-tight leading-tight">
                        {activePreset.name}
                      </h3>
                      <p className="text-xs text-[#E4B592] font-serif mt-0.5">
                        {activePreset.odiaName}
                      </p>
                    </div>

                    {/* Bottom: Foil Stamped Brand & Security Code */}
                    <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#FFF3EA] tracking-wider">PRACHAR</span>
                        <span className="text-[#E4B592]">PHYGITAL</span>
                      </div>
                      <span className="tracking-widest text-slate-300">
                        NTAG215 • PRGI REG
                      </span>
                    </div>
                  </div>

                  {/* BACK FACE: High-Density ZXing Vector QR Target */}
                  <div
                    className={`absolute inset-0 rounded-2xl p-6 sm:p-7 card-matte-surface border border-white/15 flex flex-col justify-between overflow-hidden backface-hidden rotate-y-180 ${
                      isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* Top Row: Dynamic Routing Token Telemetry */}
                    <div className="flex items-center justify-between font-mono text-[9px] border-b border-white/10 pb-2 text-slate-400">
                      <span className="text-[#E4B592] font-bold">DYNAMIC CLOUD URI</span>
                      <span>UUID: 39a4...c81f</span>
                    </div>

                    {/* Center: High-Precision Vector QR in Matte Frame */}
                    <div className="flex items-center gap-5 my-auto relative z-10">
                      <div className="p-2.5 rounded-sm bg-white shadow-xl flex-shrink-0">
                        <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-black" />
                      </div>
                      <div className="space-y-1 text-left font-mono text-xs">
                        <div className="font-bold text-[#FFF3EA] text-sm">
                          SCAN TO CONNECT
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans leading-snug">
                          Optical camera redirection to verified Bhubaneswar merchant profile.
                        </p>
                        <div className="text-[10px] text-[#E4B592] pt-1">
                          prachar.in/qr/{activePreset.id}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Official Press Credentials */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-slate-400">
                      <span>CHANDAN PRINTERS • UNIT-3</span>
                      <span className="text-[#E4B592]">ORORI/25/A3295</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="reticle-btn-secondary"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#E4B592]" />
                <span>FLIP CARD ({isFlipped ? "VIEW FRONT" : "VIEW DYNAMIC QR"})</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateTap}
                className={`reticle-btn-primary ${
                  nfcTapped ? "ring-2 ring-emerald-400 bg-emerald-950/60" : ""
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${nfcTapped ? "animate-ping" : ""}`} />
                <span>SIMULATE CONTACTLESS TAP (13.56 MHz)</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: SCANNED MOBILE SCREEN SIMULATOR (FLAGSHIP OLED) */}
        {viewMode === "PHONE" && (
          <div className="w-full max-w-sm rounded-[42px] border-4 border-slate-700/80 bg-[#000000] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden font-sans">
            {/* Dynamic Island / Speaker Capsule */}
            <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-between px-3">
              <div className="w-2 h-2 rounded-full bg-slate-950" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
            </div>

            {/* Mobile Status Bar */}
            <div className="flex items-center justify-between px-3 font-mono text-[10px] text-slate-400 mb-3">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>●●●</span>
                <span>100%</span>
              </div>
            </div>

            {/* Verified Merchant Profile Card */}
            <div className="p-5 rounded-xl bg-[#070B14] border border-white/10 text-center relative overflow-hidden mb-3">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-[#FFF3EA] font-mono font-bold text-lg border border-[#E4B592]/50 bg-[#E4B592]/10 shadow-[0_0_15px_rgba(228,181,146,0.2)]">
                {activePreset.avatarText}
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-mono text-[9px] font-bold mb-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>VERIFIED BHUBANESWAR MERCHANT</span>
              </div>

              <h3 className="text-lg font-bold text-[#FFF3EA] leading-tight">
                {activePreset.name}
              </h3>
              <p className="text-xs text-[#E4B592] font-serif mt-0.5 mb-1.5">
                {activePreset.odiaName}
              </p>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                {activePreset.tagline}
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <MapPin className="w-3 h-3 text-[#E4B592] flex-shrink-0" />
                <span className="truncate">{activePreset.location}</span>
              </div>
            </div>

            {/* Direct Conversion Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-mono">
              <button
                type="button"
                onClick={() =>
                  triggerToast(`Opening WhatsApp chat with ${activePreset.name}...`)
                }
                className="py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-[#25D366]/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WHATSAPP</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  triggerToast(`vCard RFC 6350 exported: "${activePreset.name}" saved to contacts!`)
                }
                className="py-2.5 px-3 rounded-lg bg-[#E4B592] hover:bg-white text-black font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-[#E4B592]/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE VCARD</span>
              </button>
            </div>

            {/* Featured Services List */}
            <div className="space-y-2 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E4B592] block px-1">
                FEATURED SERVICES &amp; MENU
              </span>
              {activePreset.services.map((svc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#070B14] border border-white/5 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between font-bold text-[#FFF3EA] mb-0.5">
                    <span className="truncate mr-2">{svc.title}</span>
                    <span className="text-[#E4B592] font-mono shrink-0">{svc.price}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{svc.desc}</p>
                </div>
              ))}
            </div>

            {/* Verified Footer */}
            <div className="p-2 rounded-lg bg-[#070B14] border border-white/5 text-center font-mono text-[9px] text-slate-400">
              PRGI Reg: ORORI/25/A3295 • Powered by PRACHAR Phygital
            </div>
          </div>
        )}
      </div>

      {/* Floating HUD Feedback Notification */}
      {interactionToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-sm bg-[#070B14] border border-[#E4B592] text-[#FFF3EA] font-mono text-xs shadow-2xl flex items-center gap-3 backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{interactionToast}</span>
        </div>
      )}

      {/* Bottom Editorial Call-to-Action */}
      <div className="mt-20">
        <ReticleBox tag="MERCHANT.ONBOARDING" telemetry="INSTANT SETUP" className="p-8 sm:p-12 text-center max-w-2xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-[#FFF3EA] mb-2 font-mono">
            Deploy Phygital Identity For Your Practice.
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 font-mono">
            Claim your persistent username (<code className="text-[#E4B592]">prachar.in/u/yourhandle</code>) with free mobile OTP verification in under 2 minutes.
          </p>
          <Link
            href="/register"
            className="reticle-btn-primary"
          >
            <span>CLAIM YOUR PHYGITAL CARD</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ReticleBox>
      </div>
    </div>
  );
}
