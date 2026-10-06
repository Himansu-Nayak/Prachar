"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import EditorialOdishaArtwork from "./EditorialOdishaArtwork";
import { ArrowRight, BookOpen } from "lucide-react";
import { gsap, MOTION_EASE, isReducedMotion } from "@/lib/motion";

export default function MasterCinematicHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  // Restrained GSAP entrance
  useEffect(() => {
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.out } });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 }
      );

      tl.fromTo(
        subheadRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );

      tl.fromTo(
        ctaContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );

      tl.fromTo(
        artworkRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 1.0 },
        "-=0.7"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[88vh] lg:min-h-[94vh] bg-[#0A0A0A] text-[#EDEDED] flex flex-col justify-center px-4 sm:px-8 py-16 lg:py-24 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Typography-First Editorial Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FFB703]" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono">
              PRACHAR — PHYGITAL PUBLICITY FOR ODISHA
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="text-xs text-neutral-400 font-serif hidden sm:inline">
              ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା
            </span>
          </div>

          {/* Large Editorial Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.02] font-display"
          >
            Put your business <br />
            <span className="text-[#FFB703]">where Odisha</span> <br />
            sees it.
          </h1>

          {/* Supporting Copy */}
          <p
            ref={subheadRef}
            className="text-base sm:text-lg text-neutral-400 font-normal leading-relaxed max-w-xl"
          >
            50,000+ monthly printed advertising booklets delivered door-to-door across Bhubaneswar, synchronized with verified digital profiles and instant WhatsApp conversion.
          </p>

          {/* Action CTAs */}
          <div ref={ctaContainerRef} className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/register"
              className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm sm:text-base px-8 py-4 transition-all inline-flex items-center gap-2.5 shadow-lg shadow-amber-500/10"
            >
              <span>Get Your Digital Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/advertise"
              className="rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm sm:text-base px-7 py-4 transition-all inline-flex items-center gap-2"
            >
              <span>Explore Advertising</span>
              <BookOpen className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>

          {/* Key Trust & Distribution Metrics */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white font-display block">
                50,000+
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mt-1">
                Monthly Copies
              </span>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white font-display block">
                8 Hubs
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mt-1">
                Bhubaneswar Grid
              </span>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-bold text-white font-display block">
                18th
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mt-1">
                Monthly Cutoff
              </span>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#FFB703] font-display block">
                1-Tap
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider block mt-1">
                WhatsApp Connect
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Geographic Artwork */}
        <div ref={artworkRef} className="lg:col-span-5 w-full flex items-center justify-center">
          <EditorialOdishaArtwork />
        </div>
      </div>
    </section>
  );
}
