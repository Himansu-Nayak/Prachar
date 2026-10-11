"use client";

import React, { useState } from "react";
import EditorialOdishaArtwork from "@/components/hero/EditorialOdishaArtwork";
import {
  BookOpen,
  CreditCard,
  MapPin,
  QrCode,
  Wifi,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function PhygitalShowcaseCanvas() {
  const [activeTab, setActiveTab] = useState<"booklet" | "card" | "map">("booklet");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [nfcTapped, setNfcTapped] = useState(false);

  // Trigger brief tactile feedback on NFC tap
  const triggerNfcTap = () => {
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 2400);
  };

  return (
    <section id="showcase" className="relative w-full bg-[#F7F7F4] py-12 sm:py-16 lg:py-20 px-4 sm:px-8 border-b border-black/5">
      {/* Outer Showcase Canvas with Brand Appart Large Radius */}
      <div className="relative w-full max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] bg-gradient-to-b from-[#141419] via-[#0F0F13] to-[#0A0A0D] border border-white/12 p-6 sm:p-10 lg:p-14 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden">
        {/* Subtle Atmospheric Ambient Lighting */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header: Clean Section Title + Perspective Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 relative z-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-semibold text-[#FFB703] block mb-1.5">
              Tangible Craftsmanship
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display">
              The Phygital Artifacts
            </h2>
          </div>

          {/* Clean Perspective Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-black/50 border border-white/10 p-1.5 rounded-full backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("booklet")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "booklet"
                  ? "bg-[#FFB703] text-black shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>01 • Print Booklet Spread</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "card"
                  ? "bg-[#FFB703] text-black shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>02 • Obsidian NFC Card</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("map")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "map"
                  ? "bg-[#FFB703] text-black shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>03 • Odisha Cartography</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 01: THE 50,000+ PRINT BOOKLET SPREAD */}
        {/* ============================================================== */}
        {activeTab === "booklet" && (
          <div className="pt-8 sm:pt-10 relative z-10 animate-fadeIn">
            {/* Honest Art Direction Label */}
            <div className="flex items-center justify-between pb-4 text-xs font-mono text-neutral-400">
              <span className="text-neutral-300 font-medium">170 GSM GLOSS ART SPREAD • CHANDAN PRINTERS UNIT-3 PRESS RUN</span>
              <span className="text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                Illustrative Press Spread Mockup
              </span>
            </div>

            {/* Realistic Magazine Double-Page Spread */}
            <div className="w-full">
              <div className="relative rounded-2xl bg-[#EFECE6] text-[#1A1A1A] p-5 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-neutral-300/80 overflow-hidden">
                {/* Four-Color CMYK Test Strips & Registration Crosshairs on Margins */}
                <div className="absolute top-2 left-6 right-6 flex items-center justify-between text-[9px] font-mono text-neutral-600 border-b border-neutral-300/60 pb-1 pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-cyan-500 inline-block rounded-xs" title="Cyan" />
                    <span className="w-2.5 h-2.5 bg-pink-500 inline-block rounded-xs" title="Magenta" />
                    <span className="w-2.5 h-2.5 bg-yellow-400 inline-block rounded-xs" title="Yellow" />
                    <span className="w-2.5 h-2.5 bg-black inline-block rounded-xs" title="Key/Black" />
                    <span className="ml-2 font-bold tracking-wider">CHANDAN PRINTERS • 18TH DISPATCH</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>180 × 250 MM TRIM</span>
                    <span className="font-bold text-neutral-800">50,000+ COPIES SATURATION</span>
                  </div>
                </div>

                {/* Vertical Center Spine Gutter Shadow (Realistic 3D book fold) */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 bg-gradient-to-r from-black/5 via-black/20 to-black/5 pointer-events-none z-20 shadow-inner" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-black/30 pointer-events-none z-20" />

                {/* Two-Page Spread Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 pt-6">
                  {/* ================= LEFT PAGE ================= */}
                  <div className="flex flex-col justify-between pr-0 md:pr-4">
                    {/* Left Page Masthead */}
                    <div className="border-b-2 border-black pb-2 mb-4">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700">
                        <span>ସାରସ୍ୱତ ଖବର • ପ୍ରଚାର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା</span>
                        <span>VOL. 18 • ISSUE 04</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-black font-display mt-1">
                        Bhubaneswar Commercial Directory
                      </h3>
                    </div>

                    {/* Ad Box 1: Traditional Odia Confectionery */}
                    <div className="bg-[#FAF8F5] border-2 border-neutral-900 rounded-xl p-5 shadow-sm relative overflow-hidden flex-1 flex flex-col justify-between">
                      <div className="absolute top-0 right-0 bg-neutral-900 text-white text-[9px] font-mono uppercase px-2.5 py-0.5 font-bold tracking-wider">
                        Sample Merchant Concept
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-900 uppercase">
                            Traditional Odia Confectionery Since 1984
                          </span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black text-black font-display leading-tight">
                          Puri Sweets &amp; Nimapada Chhena Poda
                        </h4>
                        <p className="text-xs font-serif text-amber-950/80 mt-0.5">
                          ସୁଆଦିଆ ଛେନାପୋଡ଼, ଖିରଗଜା ଓ ପାରମ୍ପରିକ ଓଡ଼ିଆ ମିଠା
                        </p>

                        <p className="text-xs text-neutral-700 mt-3 leading-relaxed">
                          Pure cow milk chhena poda baked fresh daily in sal leaf crust. Ghee-roasted khira gaja, rasabali, and festive sweet hampers delivered across Bhubaneswar.
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-medium text-neutral-800">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span>100% Pure Desi Ghee</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span>Same-Day Home Drop</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span>Bulk Wedding Orders</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                            <span>Hygienic Vacuum Pack</span>
                          </div>
                        </div>
                      </div>

                      {/* Optical QR Section */}
                      <div className="mt-5 pt-4 border-t border-neutral-300 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-white border border-neutral-400 p-1 rounded-md shadow-xs flex items-center justify-center relative flex-shrink-0">
                            <QrCode className="w-12 h-12 text-black" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-900 block">
                              1-Tap WhatsApp Order
                            </span>
                            <span className="text-[11px] font-semibold text-neutral-800 block">
                              +91 94370 12890
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              prachar.in/u/purisweets
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase block">Corridor</span>
                          <span className="text-xs font-bold text-black font-mono">Unit-1 &amp; Master Canteen</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-[10px] font-mono text-neutral-600">
                      <span>PAGE 14</span>
                      <span>PRACHAR BHUBANESWAR DISPATCH</span>
                    </div>
                  </div>

                  {/* ================= RIGHT PAGE ================= */}
                  <div className="flex flex-col justify-between pl-0 md:pl-4 space-y-4">
                    {/* Ad Box 2: Healthcare */}
                    <div className="bg-white border-2 border-neutral-900 rounded-xl p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-sky-900 text-white text-[9px] font-mono uppercase px-2.5 py-0.5 font-bold tracking-wider">
                        Sample Medical Concept
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                        <span className="text-[10px] font-mono font-bold tracking-widest text-sky-900 uppercase">
                          Advanced Family Healthcare &amp; Diagnostics
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-black font-display leading-tight">
                        Kalinga Multi-Specialty Clinic
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Cardiology, Orthopedics, Pediatrics &amp; Digital X-Ray. Doctor consultations from 7:00 AM to 10:00 PM.
                      </p>

                      <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-neutral-100 border border-neutral-400 p-1 rounded-md flex items-center justify-center relative flex-shrink-0">
                            <QrCode className="w-10 h-10 text-black" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-neutral-900 block">
                              Book OPD Appointment
                            </span>
                            <span className="text-[11px] font-mono text-neutral-800">
                              Plot 142/B, Nayapalli
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-sky-950">
                          0674-2551400
                        </span>
                      </div>
                    </div>

                    {/* Ad Box 3: Handloom */}
                    <div className="bg-[#FAF7F2] border-2 border-neutral-900 rounded-xl p-5 shadow-sm relative overflow-hidden flex-1 flex flex-col justify-between">
                      <div className="absolute top-0 right-0 bg-rose-900 text-white text-[9px] font-mono uppercase px-2.5 py-0.5 font-bold tracking-wider">
                        Sample Retail Concept
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-700" />
                          <span className="text-[10px] font-mono font-bold tracking-widest text-rose-900 uppercase">
                            Master Handloom Silk Weavers
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-black font-display leading-tight">
                          Royal Odissi Handloom &amp; Silk
                        </h4>
                        <p className="text-xs text-neutral-700 mt-1">
                          Authentic Sambalpuri Ikat, Bomkai Pattu, Berhampuri Patta, and bridal silks sourced straight from master weavers.
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-300 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white border border-neutral-400 p-1 rounded-md flex items-center justify-center flex-shrink-0">
                            <QrCode className="w-10 h-10 text-black" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-neutral-900 block">
                              Browse Festive Catalog
                            </span>
                            <span className="text-[10px] font-mono text-neutral-600">
                              prachar.in/u/royalodissi
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-rose-800 font-bold block">
                            Direct WhatsApp Desk
                          </span>
                          <span className="text-xs font-mono font-bold text-neutral-900">
                            +91 98610 88200
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-600">
                      <span>NEXT DISPATCH: 18TH CUTOFF</span>
                      <span>PAGE 15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 02: THE OBSIDIAN NFC CONTACTLESS CARD */}
        {/* ============================================================== */}
        {activeTab === "card" && (
          <div className="pt-8 sm:pt-10 relative z-10 animate-fadeIn">
            {/* Context narrative & interactive triggers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-xs font-mono text-neutral-400">
              <span className="text-neutral-300 font-medium">
                MATTE OBSIDIAN POLYMER • EMV GOLD CHIP • 13.56 MHz NTAG216 DUPLEX
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#FFB703]" />
                  <span>{cardFlipped ? "Show Card Front" : "Flip to Reverse"}</span>
                </button>
                <button
                  type="button"
                  onClick={triggerNfcTap}
                  className="inline-flex items-center gap-1.5 text-black font-bold bg-[#FFB703] hover:bg-amber-400 px-4 py-2 rounded-full transition-all shadow-sm"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Simulate Phone NFC Tap</span>
                </button>
              </div>
            </div>

            {/* Simulated Phone Tap Tactile Alert */}
            {nfcTapped && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-mono flex items-center justify-between gap-4 animate-slideDown shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    <strong>NFC TAP REGISTERED (13.56 MHz):</strong> Edge routing to verified public profile in 12ms.
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-bold">
                  vCard Synced
                </span>
              </div>
            )}

            {/* 3D Interactive Card Stage */}
            <div className="w-full flex items-center justify-center py-8 sm:py-14">
              <div className="w-full max-w-lg aspect-[1.586/1] relative select-none">
                <div
                  className="w-full h-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 ring-1 ring-white/10"
                  style={{
                    background: cardFlipped
                      ? "linear-gradient(135deg, #101014 0%, #09090C 100%)"
                      : "linear-gradient(135deg, #17171C 0%, #0E0E12 50%, #08080A 100%)",
                    boxShadow: `
                      0 40px 90px -20px rgba(0, 0, 0, 0.95),
                      0 0 0 1px rgba(255, 255, 255, 0.12),
                      inset 0 1px 1px 0 rgba(255, 255, 255, 0.25),
                      inset 0 -1px 1px 0 rgba(0, 0, 0, 0.9)
                    `,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

                  {!cardFlipped ? (
                    /* FRONT OF THE CARD */
                    <>
                      <div className="flex items-start justify-between relative z-10">
                        {/* Metallic Gold EMV Contact Chip */}
                        <div
                          className="w-12 sm:w-14 h-9 sm:h-11 rounded-lg relative overflow-hidden border border-amber-300/40 shadow-inner"
                          style={{
                            background: "linear-gradient(135deg, #FDE68A 0%, #D97706 40%, #B45309 70%, #F59E0B 100%)",
                            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.5)",
                          }}
                        >
                          <div className="absolute inset-x-0 top-1/2 h-px bg-amber-900/60" />
                          <div className="absolute inset-y-0 left-1/3 w-px bg-amber-900/60" />
                          <div className="absolute inset-y-0 right-1/3 w-px bg-amber-900/60" />
                          <div className="absolute top-1/4 left-1/3 right-1/3 bottom-1/4 border border-amber-900/60 rounded-xs" />
                        </div>

                        <div className="flex items-center gap-2">
                          <Wifi className="w-6 h-6 text-neutral-400 rotate-90" />
                        </div>
                      </div>

                      {/* Debossed Mark */}
                      <div className="my-auto relative z-10">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display"
                            style={{
                              textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 -1px 1px rgba(255,255,255,0.2)",
                            }}
                          >
                            PRACHAR
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#FFB703]" />
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                            Verified Member
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-neutral-500 mt-1">
                          NFC Phygital Business Identity
                        </p>
                      </div>

                      {/* Member Credentials */}
                      <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/5">
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-white font-mono tracking-wider block">
                            HIMANSU NAYAK
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                            FOUNDER • PRACHAR NETWORK
                          </span>
                        </div>

                        <div className="text-right font-mono text-[10px] text-neutral-400">
                          <span className="text-[#FFB703] font-bold block">#OD-BBI-0429</span>
                          <span>PERMANENT IDENTITY</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* REVERSE OF THE CARD */
                    <>
                      <div className="absolute top-6 inset-x-0 h-10 bg-black/90 border-y border-white/10" />

                      <div className="mt-14 flex items-center justify-between gap-4 relative z-10">
                        <div className="flex-1 bg-neutral-200 text-black px-4 py-2 rounded font-serif italic text-xs tracking-wider">
                          Himansu Nayak • Authorized Cardholder
                        </div>
                        <div className="w-16 h-16 bg-white p-1 rounded-md border border-neutral-400 flex items-center justify-center flex-shrink-0">
                          <QrCode className="w-14 h-14 text-black" />
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-neutral-400 space-y-1 relative z-10 pt-4">
                        <p>This card connects instantly to your verified Prachar public micro-profile.</p>
                        <p className="text-neutral-500">
                          Complies with ISO/IEC 14443 Type A • NFC Forum Type 2 Tag • Odia Media Network
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 03: ODISHA CARTOGRAPHY & DISTRIBUTION LOGISTICS */}
        {/* ============================================================== */}
        {activeTab === "map" && (
          <div className="pt-8 sm:pt-10 relative z-10 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex items-center justify-center">
                <EditorialOdishaArtwork />
              </div>

              <div className="lg:col-span-5 space-y-6 text-left">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block">
                  Distribution Architecture
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                  8 Saturation Corridors in Bhubaneswar
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  Each month, 50,000+ printed advertising booklets are handed directly to retail store owners, medical centers, professional chambers, and residential complexes by our logistical team.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-neutral-300">Saheed Nagar &amp; Janpath</span>
                    <span className="text-[#FFB703] font-bold">6,500+ Copies</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-neutral-300">Patia &amp; Infocity IT Corridor</span>
                    <span className="text-[#FFB703] font-bold">8,200+ Copies</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-neutral-300">Nayapalli &amp; Jayadev Vihar</span>
                    <span className="text-[#FFB703] font-bold">7,000+ Copies</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-neutral-300">Chandrasekharpur &amp; CS Pur</span>
                    <span className="text-[#FFB703] font-bold">7,500+ Copies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
