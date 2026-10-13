"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { gsap, MOTION_EASE, isReducedMotion } from "@/lib/motion";

export default function MasterCinematicHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // Live IST Clock for authentic local dispatch presence (matching Brand Appart's "Paris, France 11:43 PM")
  const [bhubaneswarTime, setBhubaneswarTime] = useState<string>("Bhubaneswar, India • IST");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeFormatted = now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setBhubaneswarTime(`Bhubaneswar, India • ${timeFormatted} IST`);
      } catch {
        setBhubaneswarTime("Bhubaneswar, Odisha • Press Run Active");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance
  useEffect(() => {
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.out } });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.95 }
      );

      tl.fromTo(
        corridorRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.6"
      );

      tl.fromTo(
        subheadRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75 },
        "-=0.5"
      );

      tl.fromTo(
        ctaContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75 },
        "-=0.5"
      );

      tl.fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative w-full min-h-[82vh] lg:min-h-[86vh] bg-[#F7F7F4] text-[#121212] flex flex-col justify-between px-4 sm:px-8 pt-12 sm:pt-16 pb-10 sm:pb-14 overflow-hidden border-b border-black/5"
    >
      {/* Subtle Warm Focal Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[500px] bg-gradient-to-b from-[#FFB703]/10 via-transparent to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Eyebrow Category */}
      <div className="max-w-6xl mx-auto w-full text-center relative z-20 pt-2 pb-4">
        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-neutral-700 uppercase">
          PHYGITAL PUBLICITY NETWORK • BHUBANESWAR
        </span>
      </div>

      {/* Centerpiece: Brand Appart Monumental Display Typography */}
      <div className="max-w-6xl mx-auto w-full my-auto text-center py-6 lg:py-10 relative z-20 space-y-8 sm:space-y-10">
        {/* Monumental Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.8rem] font-black tracking-tight leading-[0.98] font-display text-[#111111] max-w-5xl mx-auto"
        >
          The phygital{" "}
          <span className="whitespace-nowrap inline-block">
            publicity
            <span className="inline-flex items-center justify-center align-middle ml-2 sm:ml-3 w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 border-amber-600/40 bg-amber-500/15 text-amber-700 text-xs sm:text-base font-mono font-bold shadow-sm">
              ©
            </span>
          </span>
          <br />
          partner for Odisha&apos;s leading businesses
        </h1>

        {/* Quiet Monochromatic Corridor Strip */}
        <div
          ref={corridorRef}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono tracking-widest text-neutral-700 uppercase max-w-3xl mx-auto"
        >
          <span>SAHEED NAGAR</span>
          <span className="text-neutral-300">•</span>
          <span>PATIA INFOCITY</span>
          <span className="text-neutral-300">•</span>
          <span>NAYAPALLI</span>
          <span className="text-neutral-300">•</span>
          <span>CHANDRASEKHARPUR</span>
          <span className="text-neutral-300">•</span>
          <span className="text-black font-bold">50,000+ COPIES</span>
        </div>

        {/* Continuous BrandAppart-Style Partner & Accreditation Marquee */}
        <div className="w-full overflow-hidden py-3 border-y border-black/5 bg-black/[0.02]">
          <div className="animate-marquee items-center gap-10 text-[11px] font-mono tracking-widest text-neutral-600 uppercase">
            <span>PRGI REG: ORORI/25/A3295</span>
            <span className="text-amber-600">•</span>
            <span>MSME UDYAM: UDYAM-OD-04-0039313</span>
            <span className="text-amber-600">•</span>
            <span>CHANDAN PRINTERS UNIT-3 OFFSET</span>
            <span className="text-amber-600">•</span>
            <span>50,000+ COPIES MONTHLY PRESS CIRCULATION</span>
            <span className="text-amber-600">•</span>
            <span>8 BHUBANESWAR SATURATION HUBS</span>
            <span className="text-amber-600">•</span>
            <span>18TH MONTHLY PRESS CUTOFF</span>
            <span className="text-amber-600">•</span>
            <span>DYNAMIC EDGE QR TELEMETRY</span>
            <span className="text-amber-600">•</span>
            <span>RFC 6350 VCARD INTEGRATION</span>
            <span className="text-amber-600">•</span>
            <span>PRGI REG: ORORI/25/A3295</span>
            <span className="text-amber-600">•</span>
            <span>MSME UDYAM: UDYAM-OD-04-0039313</span>
            <span className="text-amber-600">•</span>
            <span>CHANDAN PRINTERS UNIT-3 OFFSET</span>
            <span className="text-amber-600">•</span>
            <span>50,000+ COPIES MONTHLY PRESS CIRCULATION</span>
            <span className="text-amber-600">•</span>
            <span>8 BHUBANESWAR SATURATION HUBS</span>
            <span className="text-amber-600">•</span>
            <span>18TH MONTHLY PRESS CUTOFF</span>
            <span className="text-amber-600">•</span>
            <span>DYNAMIC EDGE QR TELEMETRY</span>
            <span className="text-amber-600">•</span>
            <span>RFC 6350 VCARD INTEGRATION</span>
            <span className="text-amber-600">•</span>
          </div>
        </div>

        {/* Centered Editorial Supporting Narrative */}
        <p
          ref={subheadRef}
          className="text-base sm:text-lg lg:text-xl text-neutral-600 font-normal leading-relaxed max-w-2xl mx-auto font-sans"
        >
          50,000+ monthly printed advertising booklets delivered door-to-door across Bhubaneswar, synchronized with verified digital profiles and instant WhatsApp conversion.
        </p>

        {/* Brand Appart Action Pills */}
        <div
          ref={ctaContainerRef}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/register"
            className="rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm sm:text-base px-8 sm:px-9 py-4 transition-all inline-flex items-center gap-2.5 shadow-xl hover:-translate-y-0.5 duration-200"
          >
            <span>Claim Your Digital Profile</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>

          <Link
            href="/advertise"
            className="rounded-full border border-neutral-300 hover:border-black bg-white/70 hover:bg-white text-neutral-900 font-medium text-sm sm:text-base px-7 sm:px-8 py-4 transition-all inline-flex items-center gap-2 hover:-translate-y-0.5 duration-200 shadow-sm"
          >
            <span>Explore Advertising Rates</span>
            <BookOpen className="w-4 h-4 text-neutral-600" />
          </Link>
        </div>
      </div>

      {/* Bottom Asymmetric Editorial Bar (Brand Appart Signature Rhythm) */}
      <div
        ref={bottomBarRef}
        className="max-w-7xl mx-auto w-full pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-600 relative z-20"
      >
        {/* Left: Press Dispatch Badge */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
            PR
          </div>
          <span>
            Founded in Bhubaneswar • Hand-to-hand delivery fleet across 8 prime corridors
          </span>
        </div>

        {/* Center: Scroll Indicator */}
        <div className="hidden md:flex items-center gap-2 text-neutral-600">
          <span>(↓)</span>
          <span className="uppercase tracking-widest text-[10px]">Scroll to Inspect the Craft</span>
        </div>

        {/* Right: Real-Time Local Clock */}
        <div className="flex items-center gap-2 text-neutral-800 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{bhubaneswarTime}</span>
        </div>
      </div>
    </section>
  );
}
