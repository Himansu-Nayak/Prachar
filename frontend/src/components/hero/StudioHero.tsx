"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ODISHA_DISTRICTS, REGIONAL_HUBS, RegionalHub, DistrictGeometry } from "./odishaMapData";
import {
  ArrowRight,
  BookOpen,
  QrCode,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Scan,
  PhoneCall,
  RotateCcw,
  Check,
} from "lucide-react";
import { gsap, MOTION_EASE, isReducedMotion, useMagnetic } from "@/lib/motion";

interface StudioHeroProps {
  onHubSelect?: (hub: RegionalHub) => void;
  activeHubId?: string;
}

export default function StudioHero({
  onHubSelect,
  activeHubId = "bbsr",
}: StudioHeroProps) {
  const [selectedHub, setSelectedHub] = useState<RegionalHub>(
    REGIONAL_HUBS.find((h) => h.id === activeHubId) || REGIONAL_HUBS[0]
  );
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeometry | null>(null);

  // Phygital transformation states: "print" | "approaching" | "scanning" | "digital" | "map"
  const [stageState, setStageState] = useState<"print" | "approaching" | "scanning" | "digital" | "map">("print");

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const stageViewportRef = useRef<HTMLDivElement>(null);
  const qrTargetRef = useRef<HTMLDivElement>(null);

  const primaryBtnRef = useMagnetic(0.18);
  const secondaryBtnRef = useMagnetic(0.12);

  // Subtle perspective tilt on pointer movement (restrained to 5 degrees)
  const [mouseTilt, setMouseTilt] = useState({ rx: 0, ry: 0 });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({
      rx: -y * 5,
      ry: x * 6,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseTilt({ rx: 0, ry: 0 });
    setHoveredDistrict(null);
  }, []);

  // Hub selection handler
  const handleSelectHub = (hub: RegionalHub) => {
    setSelectedHub(hub);
    if (onHubSelect) onHubSelect(hub);
  };

  // Continuous Phygital Cinematic Transformation Sequence:
  // PRINT -> Camera approaches QR -> QR becomes dominant -> Scan sweep -> Digital interface emerges -> Camera settles
  const handleRunPhygitalSequence = () => {
    if (stageState !== "print") return;

    if (isReducedMotion()) {
      setStageState("digital");
      return;
    }

    // Step 1: Camera approaches QR (zoom in on QR position)
    setStageState("approaching");

    setTimeout(() => {
      // Step 2: Optical scan reticle sweeps the QR code
      setStageState("scanning");

      setTimeout(() => {
        // Step 3: Digital interface emerges from scan target and camera pulls back
        setStageState("digital");
      }, 700);
    }, 450);
  };

  // Return to Print Creative
  const handleReturnToPrint = () => {
    setStageState("print");
  };

  // GSAP entrance timeline on mount
  useEffect(() => {
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.out } });

      // Staggered reveal of top telemetry bar
      tl.fromTo(
        telemetryRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.7 }
      );

      // Masked headline reveal (editorial line-reveal)
      tl.fromTo(
        headlineRef.current?.querySelectorAll(".hero-line-inner") || [],
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.14, duration: 0.95 },
        "-=0.4"
      );

      // Subhead and metric indicators
      tl.fromTo(
        subheadRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.75 },
        "-=0.5"
      );

      // Stage viewport reveal
      tl.fromTo(
        stageViewportRef.current,
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: MOTION_EASE.expo },
        "-=0.6"
      );
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroContainerRef}
      className="relative w-full min-h-[92vh] lg:min-h-[96vh] bg-[#000000] text-[#FFF3EA] flex flex-col justify-between select-none overflow-hidden border-b border-[#E4B592]/20 px-4 sm:px-8 py-6"
    >
      {/* Viewfinder Reticle Framing */}
      <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-[#E4B592]/70 pointer-events-none z-30" />
      <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-[#E4B592]/70 pointer-events-none z-30" />
      <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-[#E4B592]/70 pointer-events-none z-30" />
      <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-[#E4B592]/70 pointer-events-none z-30" />

      {/* Ambient background: deep warm atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(228,181,146,0.05)_0%,rgba(255,107,0,0.02)_40%,transparent_70%)]" />

      {/* Top Telemetry Header Ribbon */}
      <div
        ref={telemetryRef}
        className="w-full max-w-6xl mx-auto flex items-center justify-between pt-1 pb-3 relative z-20 font-mono text-[10px] sm:text-xs text-slate-400"
      >
        <div className="flex items-center gap-2.5 text-[#E4B592]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4B592] animate-pulse" />
          <span className="font-bold tracking-[0.22em] uppercase">PRACHAR PHYGITAL SYSTEM</span>
          <span className="hidden md:inline text-white/20">•</span>
          <span className="hidden md:inline text-slate-400 font-mono">BHUBANESWAR • 20.2961°N, 85.8245°E</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">MISSION: 50,000+ PRINT DROP</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
            BHUBANESWAR ACTIVE
          </span>
        </div>
      </div>

      {/* Central Visual Stage */}
      <div className="relative w-full max-w-7xl mx-auto my-auto py-4 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Solid Editorial Typography & Phygital Value Proposition */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          {/* Section Indicator Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="reticle-badge">
              [PHYGITAL.PLATFORM]
            </span>
            <span className="font-mono text-[11px] text-[#E4B592] font-serif">
              ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା
            </span>
          </div>

          {/* Masked Line-Reveal Headline (Solid, Human-Designed Editorial Aesthetic) */}
          <h1
            ref={headlineRef}
            className="text-3xl sm:text-5xl lg:text-[3.6rem] font-black tracking-[-0.035em] text-[#FFF3EA] leading-[1.08] mb-6"
          >
            <span className="block overflow-hidden">
              <span className="hero-line-inner block">Where Physical Reach</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block text-[#FFF3EA]">
                Becomes <span className="text-[#E4B592] font-semibold">Digital Power.</span>
              </span>
            </span>
          </h1>

          {/* Editorial Subtitle with Generous Spacing */}
          <p
            ref={subheadRef}
            className="text-sm sm:text-base text-[#DAD0C8] font-normal leading-relaxed max-w-xl mb-8 font-sans"
          >
            Connecting verified local commerce directly to 50,000+ Bhubaneswar households through monthly door-to-door print publication paired with permanent dynamic QR identity.
          </p>

          {/* Restrained Telemetry Bar (No excess colors) */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-sm border border-white/10 bg-[#070B14]/80 backdrop-blur-md mb-8 max-w-lg font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Monthly Circulation</span>
              <span className="text-base sm:text-lg font-bold text-[#FFF3EA]">50,000+</span>
              <span className="text-[9px] text-[#E4B592] block">Door-to-Door BBSR</span>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase">Conversion Speed</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400">&lt; 1 Tap</span>
              <span className="text-[9px] text-slate-400 block">WhatsApp Direct</span>
            </div>
            <div className="border-l border-white/10 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase">Press Cutoff</span>
              <span className="text-base sm:text-lg font-bold text-[#E4B592]">18th Monthly</span>
              <span className="text-[9px] text-slate-400 block">Chandan Printers</span>
            </div>
          </div>

          {/* Magnetic CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div ref={primaryBtnRef}>
              <Link
                href="/register"
                className="reticle-btn-primary w-full sm:w-auto px-7 py-3.5 shadow-[0_0_20px_rgba(228,181,146,0.25)]"
              >
                <span>CLAIM PHYGITAL CARD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div ref={secondaryBtnRef}>
              <Link
                href="/advertise"
                className="reticle-btn-secondary w-full sm:w-auto px-6 py-3.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#E4B592]" />
                <span>EXPLORE RATE CARD (P1–P5)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Unified Phygital Cinematic Stage */}
        <div
          ref={stageViewportRef}
          className="lg:col-span-6 relative flex flex-col items-center justify-center"
        >
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-md sm:max-w-lg relative transition-transform duration-300 ease-out"
            style={{
              perspective: "1100px",
              transform: `rotateX(${mouseTilt.rx}deg) rotateY(${mouseTilt.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Viewfinder Framing Container */}
            <div className="relative rounded-sm border border-[#E4B592]/30 bg-[#050811] p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
              {/* Corner reticle marks */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E4B592]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#E4B592]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#E4B592]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E4B592]" />

              {/* Stage Header: State Indicator & Mode Toggle */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E4B592] animate-pulse" />
                  <span className="text-[10px] text-[#E4B592] font-bold tracking-wider uppercase">
                    {stageState === "map"
                      ? "ODISHA CARTOGRAPHY"
                      : stageState === "digital"
                      ? "DIGITAL RESULT (/u/puri-sweets)"
                      : stageState === "scanning" || stageState === "approaching"
                      ? "OPTICAL SCAN IN PROGRESS..."
                      : "PHYSICAL PRINT ARTIFACT (P3)"}
                  </span>
                </div>

                <div className="flex items-center p-0.5 rounded-full bg-black/70 border border-white/10 text-[9px] sm:text-[10px]">
                  <button
                    type="button"
                    onClick={() => setStageState("print")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      stageState === "print" || stageState === "approaching" || stageState === "scanning"
                        ? "bg-[#E4B592] text-black font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    PRINT AD
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageState("digital")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      stageState === "digital"
                        ? "bg-[#E4B592] text-black font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    DIGITAL
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageState("map")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      stageState === "map"
                        ? "bg-[#E4B592] text-black font-bold shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ODISHA MAP
                  </button>
                </div>
              </div>

              {/* CONTINUOUS TRANSFORMATION STAGE */}
              {stageState !== "map" ? (
                <div
                  className={`relative rounded-sm border border-white/10 bg-[#080C16] p-5 overflow-hidden transition-all duration-500 ease-out ${
                    stageState === "approaching" || stageState === "scanning"
                      ? "scale-[1.03] ring-1 ring-[#E4B592]"
                      : "scale-100"
                  }`}
                >
                  {/* Subtle print paper grain */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 print-paper-stock" />

                  {/* Bleed & CMYK marks in corner */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 select-none pb-2 border-b border-white/5">
                    <span>+ CMYK 300 DPI • 180×120 MM</span>
                    <span className="text-[#E4B592]">CHANDAN PRINTERS UNIT-3</span>
                  </div>

                  {/* Stage 1: The Print Creative Face */}
                  {(stageState === "print" || stageState === "approaching" || stageState === "scanning") && (
                    <div className="pt-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#E4B592]/15 text-[#E4B592] border border-[#E4B592]/30 uppercase mb-1">
                            PURI SWEETS &amp; CATERERS
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-[#FFF3EA] font-sans tracking-tight">
                            Authentic Odia Chhena Poda &amp; Catering
                          </h3>
                          <p className="text-xs text-[#E4B592] font-serif">ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ • BJB Nagar</p>
                        </div>
                        <div className="w-10 h-10 rounded-xs bg-[#0F1422] border border-white/10 flex items-center justify-center text-[#E4B592] font-mono font-black text-sm flex-shrink-0">
                          PS
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3">
                        Slow-baked traditional Nayagarh Chhena Poda over sal leaves. Full marriage catering packages across Bhubaneswar for up to 2,000 guests.
                      </p>

                      {/* Phygital QR Bridge */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between bg-black/60 -mx-5 -mb-5 p-4 relative">
                        <div className="flex items-center gap-3">
                          {/* QR Code Target with Laser Scan Sweep on trigger */}
                          <div
                            ref={qrTargetRef}
                            className={`relative w-14 h-14 bg-white p-1 rounded-xs flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-300 ${
                              stageState === "scanning" ? "scale-110 ring-2 ring-[#E4B592]" : ""
                            }`}
                          >
                            <QrCode className="w-12 h-12 text-black" />
                            {stageState === "scanning" && (
                              <div className="absolute inset-0 bg-[#E4B592]/25 flex flex-col justify-center">
                                <div className="w-full h-0.5 bg-[#E4B592] shadow-[0_0_8px_#E4B592] animate-bounce" />
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-[#E4B592] font-bold block uppercase">
                              DYNAMIC QR ROUTER
                            </span>
                            <span className="text-xs text-slate-200 font-mono">/qr/puri-sweets</span>
                            <span className="text-[9px] text-slate-400 block font-sans">
                              {stageState === "scanning" ? "Decoding optical token..." : "Scan with camera for WhatsApp order"}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Trigger Button */}
                        <button
                          type="button"
                          onClick={handleRunPhygitalSequence}
                          disabled={stageState === "approaching" || stageState === "scanning"}
                          className="px-3.5 py-2 rounded-xs bg-[#E4B592] hover:bg-white text-black font-mono text-[10px] font-bold tracking-wider uppercase transition flex items-center gap-1.5 shadow-md flex-shrink-0"
                        >
                          {stageState === "scanning" ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                              <span>DECODING...</span>
                            </>
                          ) : (
                            <>
                              <Scan className="w-3.5 h-3.5" />
                              <span>SIMULATE SCAN</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stage 2: The Emerged Digital Profile Face */}
                  {stageState === "digital" && (
                    <div className="pt-2 animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-[10px]">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                          VERIFIED PHYGITAL IDENTITY
                        </span>
                        <span className="text-slate-400">EDGE ROUTED IN 12ms</span>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xs bg-[#E4B592]/20 border border-[#E4B592]/40 flex items-center justify-center text-[#E4B592] font-mono font-bold text-sm">
                          PS
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-[#FFF3EA] font-sans">
                            Puri Sweets &amp; Caterers
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">Plot 104, BJB Nagar, Bhubaneswar</p>
                        </div>
                      </div>

                      {/* 1-Tap WhatsApp Conversion Triggers */}
                      <div className="grid grid-cols-2 gap-2 mt-4 font-mono text-[11px]">
                        <a
                          href="https://wa.me/917077011733?text=Hi%20Puri%20Sweets,%20I%20saw%20your%20ad%20in%20Prachar"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition text-center"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>WHATSAPP ORDER</span>
                        </a>
                        <a
                          href="tel:+917077011733"
                          className="p-2.5 rounded-xs bg-white/10 hover:bg-white/15 text-[#FFF3EA] font-bold flex items-center justify-center gap-1.5 transition text-center"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#E4B592]" />
                          <span>DIRECT CALL</span>
                        </a>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 text-xs font-mono space-y-1">
                        <div className="flex justify-between py-0.5 text-slate-300">
                          <span>• Special Nayagarh Chhena Poda</span>
                          <span className="text-[#E4B592] font-bold">₹450 / kg</span>
                        </div>
                        <div className="flex justify-between py-0.5 text-slate-300">
                          <span>• Wedding Catering Feast (500+ pax)</span>
                          <span className="text-[#E4B592] font-bold">Custom Quote</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>SCAN TELEMETRY: ACTIVE</span>
                        <button
                          type="button"
                          onClick={handleReturnToPrint}
                          className="text-[#E4B592] hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>RETURN TO PRINT AD</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Authentic 30-District Survey of India Vector Map */
                <div className="relative rounded-sm bg-[#080C16] border border-white/10 p-4 h-[300px] flex items-center justify-center">
                  <svg
                    viewBox="0 0 800 680"
                    className="w-full h-full max-h-[290px] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                  >
                    <defs>
                      <radialGradient id="heroKhordhaGrad2" cx="566" cy="326" r="80" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#E4B592" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#0B1120" stopOpacity="0.1" />
                      </radialGradient>
                    </defs>

                    <g>
                      {ODISHA_DISTRICTS.map((d) => {
                        const isCapital = d.isCapitalDistrict;
                        const isHovered = hoveredDistrict?.id === d.id;
                        let fill = "rgba(10, 16, 28, 0.85)";
                        if (isCapital) fill = "url(#heroKhordhaGrad2)";
                        else if (isHovered) fill = "rgba(228, 181, 146, 0.35)";
                        else if (d.isCoastal) fill = "rgba(14, 165, 233, 0.12)";

                        let stroke = isCapital ? "#FFE259" : isHovered ? "#FFF3EA" : "rgba(228, 181, 146, 0.5)";

                        return (
                          <path
                            key={d.id}
                            d={d.path}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={isCapital ? 2.8 : 1.2}
                            onMouseEnter={() => setHoveredDistrict(d)}
                            className="cursor-pointer transition-colors"
                          />
                        );
                      })}
                    </g>

                    {/* Bhubaneswar epicenter pin & pulsing rings */}
                    <g>
                      <circle cx="566.2" cy="326.4" r="28" fill="none" stroke="#E4B592" strokeWidth="1.5" className="animate-ping" />
                      <circle cx="566.2" cy="326.4" r="6" fill="#FFFFFF" stroke="#E4B592" strokeWidth="2" />
                      <text x="580" y="322" fill="#E4B592" fontSize="13" fontFamily="monospace" fontWeight="bold">
                        BHUBANESWAR
                      </text>
                      <text x="580" y="338" fill="#E2E8F0" fontSize="9" fontFamily="monospace">
                        50,000+ COPIES DROP
                      </text>
                    </g>
                  </svg>
                </div>
              )}

              {/* Lower HUD Telemetry Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span className="text-slate-400">
                  DISTRIBUTION FLEET: <strong className="text-white">BHUBANESWAR SECTOR</strong>
                </span>
                <span className="text-[#E4B592]">CHANDAN PRINTERS UNIT-3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Focal Hub Ribbon */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-2 pt-3 relative z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1.5 px-3 rounded-full border border-white/10 bg-[#070A14]/90 backdrop-blur-xl shadow-2xl scrollbar-none">
          <span className="text-[10px] font-mono font-bold text-[#E4B592] uppercase tracking-widest px-2 hidden sm:inline">
            REGIONAL FOCAL NODES:
          </span>
          {REGIONAL_HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const isBhubaneswar = hub.id === "bbsr";

            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#E4B592] text-black font-bold shadow-md shadow-[#E4B592]/20 scale-105"
                    : "text-slate-400 hover:text-[#FFF3EA] hover:bg-white/5 border border-transparent"
                }`}
              >
                {isBhubaneswar && <span className="text-amber-800">★</span>}
                <span>{hub.name}</span>
                <span className="font-serif text-[11px] opacity-75">{hub.odiaName}</span>
              </button>
            );
          })}
        </div>

        <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ACTIVE SECTOR: {selectedHub.name.toUpperCase()} ({selectedHub.coordinates})</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>REGISTERED UNIT: SAROSWATI KHABAR</span>
            <span>•</span>
            <span className="text-[#E4B592]">PRGI ORORI/25/A3295</span>
          </div>
        </div>
      </div>
    </section>
  );
}
