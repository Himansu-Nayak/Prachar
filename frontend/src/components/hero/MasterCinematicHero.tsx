"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import CinematicOdishaMoon from "./CinematicOdishaMoon";
import { REGIONAL_HUBS, RegionalHub } from "./odishaMapData";
import { ArrowRight, BookOpen, Sparkles, MapPin, Radio, Shield, Compass, ChevronDown } from "lucide-react";
import { gsap, MOTION_EASE, isReducedMotion, useMagnetic } from "@/lib/motion";

interface MasterCinematicHeroProps {
  onHubSelect?: (hub: RegionalHub) => void;
  activeHubId?: string;
}

export default function MasterCinematicHero({
  onHubSelect,
  activeHubId = "bbsr",
}: MasterCinematicHeroProps) {
  const [selectedHub, setSelectedHub] = useState<RegionalHub>(
    REGIONAL_HUBS.find((h) => h.id === activeHubId) || REGIONAL_HUBS[0]
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);

  const primaryBtnRef = useMagnetic(0.2);
  const secondaryBtnRef = useMagnetic(0.12);

  const handleHubSelect = (hub: RegionalHub) => {
    setSelectedHub(hub);
    if (onHubSelect) onHubSelect(hub);
  };

  // GSAP Editorial Stagger Entrance
  useEffect(() => {
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.out } });

      // Telemetry badge fade down
      tl.fromTo(
        telemetryRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.8 }
      );

      // Line-masked headline reveal
      tl.fromTo(
        headlineRef.current?.querySelectorAll(".hero-line-inner") || [],
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.15, duration: 1.0 },
        "-=0.5"
      );

      // Subhead and Odia script reveal
      tl.fromTo(
        subheadRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );

      // CTAs reveal
      tl.fromTo(
        ctaContainerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[92vh] lg:min-h-[98vh] bg-[#000000] text-[#FFF3EA] flex flex-col justify-between select-none overflow-hidden border-b border-[#E4B592]/20 px-4 sm:px-8 py-5"
    >
      {/* 21hrs.space Museum Viewfinder Corner Brackets */}
      <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#E4B592]/80 pointer-events-none z-30" />
      <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#E4B592]/80 pointer-events-none z-30" />
      <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#E4B592]/80 pointer-events-none z-30" />
      <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#E4B592]/80 pointer-events-none z-30" />

      {/* Atmospheric Radial Gradient Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(228,181,146,0.06)_0%,rgba(255,136,0,0.025)_40%,transparent_75%)]" />

      {/* Top Technical Telemetry Strip */}
      <div
        ref={telemetryRef}
        className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-4 relative z-20 border-b border-white/5"
      >
        <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] text-slate-400">
          <span className="reticle-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8800] animate-pulse" />
            [SYS.GEO.SAT-01]
          </span>
          <span className="text-[#E4B592] font-semibold">ODISHA PHYGITAL RADAR</span>
          <span className="text-white/20">/</span>
          <span>CIRCULATION: 50,000+ COPIES</span>
        </div>

        <div className="hidden md:flex items-center gap-4 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="text-slate-500">PRESS:</span>
            <span className="text-slate-300">CHANDAN PRINTERS, UNIT-3</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#E4B592]">NEXT CUTOFF:</span>
            <span className="text-[#FF8800] font-bold">18TH MONTHLY</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            BBSR GRID ACTIVE
          </span>
        </div>
      </div>

      {/* Central Hero Stage: Split Narrative & 3D Celestial Moon */}
      <div className="relative w-full max-w-7xl mx-auto my-auto py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Column: Monumental Editorial Typography */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-6">
          {/* Monument Brand Display */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#FF8800] to-[#E4B592]" />
            <div>
              <span className="font-mono text-xs sm:text-sm tracking-[0.28em] text-[#E4B592] uppercase font-bold block">
                PHYGITAL PUBLICITY PLATFORM
              </span>
              <span className="font-serif text-xs text-slate-400">
                ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା
              </span>
            </div>
          </div>

          {/* Masked Editorial Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-[-0.035em] text-[#FFF3EA] leading-[0.98]"
          >
            <span className="hero-line-mask">
              <span className="hero-line-inner">PUBLICITY</span>
            </span>
            <span className="hero-line-mask">
              <span className="hero-line-inner text-transparent bg-clip-text bg-gradient-to-r from-[#FFF3EA] via-[#E4B592] to-[#FF8800]">
                FOR ODISHA.
              </span>
            </span>
          </h1>

          {/* Editorial Subtitle & Value Proposition */}
          <div ref={subheadRef} className="space-y-4 max-w-xl">
            <p className="text-sm sm:text-base text-[#DAD0C8] font-sans leading-relaxed font-normal">
              High-circulation door-to-door print advertising booklets synchronized with instant dynamic cloud routing and tactile NFC smart cards across Bhubaneswar and Odisha.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-slate-300 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8800]" /> 50,000+ Monthly Print
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Dynamic Cloud QR (<code className="text-sky-300">/qr/:uuid</code>)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Verified Profile (<code className="text-emerald-300">/u/:handle</code>)
              </span>
            </div>
          </div>

          {/* Interactive CTAs */}
          <div ref={ctaContainerRef} className="flex flex-wrap items-center gap-4 pt-2">
            <div ref={primaryBtnRef}>
              <Link
                href="/register"
                className="reticle-btn-primary shadow-lg shadow-orange-950/40"
              >
                <span>CLAIM PHYGITAL PROFILE</span>
                <ArrowRight className="w-4 h-4 text-[#FF8800]" />
              </Link>
            </div>

            <div ref={secondaryBtnRef}>
              <Link
                href="/advertise"
                className="reticle-btn-secondary"
              >
                <span>RATE CARD (P1–P5)</span>
                <BookOpen className="w-4 h-4 text-[#E4B592]" />
              </Link>
            </div>
          </div>

          {/* Regulatory & Press Accreditation Badges */}
          <div className="pt-4 flex flex-wrap items-center gap-4 font-mono text-[9px] text-slate-400">
            <span>REG: PRGI ORORI/25/A3295</span>
            <span>•</span>
            <span>MSME: UDYAM-OD-04-0039313</span>
            <span>•</span>
            <span>UNIT: SAROSWATI KHABAR</span>
          </div>
        </div>

        {/* Right Column: 3D Astronomical Odisha Moon Sphere */}
        <div className="lg:col-span-6 relative w-full h-[460px] sm:h-[560px] lg:h-[640px] flex items-center justify-center">
          <CinematicOdishaMoon
            onHubSelect={handleHubSelect}
            activeHubId={selectedHub.id}
          />
        </div>
      </div>

      {/* Bottom Technical Bar */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-[10px] text-slate-400 relative z-20">
        <div className="flex items-center gap-3">
          <span className="text-[#E4B592] font-semibold">EPICENTER:</span>
          <span className="text-[#FFF3EA] font-bold">BHUBANESWAR (20.2961°N, 85.8245°E)</span>
          <span className="text-white/20">|</span>
          <span>8 LOGISTICAL CORRIDORS</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[10px]">
          <span>SCROLL FOR PHYGITAL ARCHITECTURE</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#E4B592] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
