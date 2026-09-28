"use client";

import React from "react";

/**
 * HeroMapPlaceholder Component (Phase 1 Foundation)
 * 
 * Architectural container for the future interactive Odisha Map with Bhubaneswar highlight.
 * Preserves exact layout dimensions and aspect ratio to ensure zero Cumulative Layout Shift (CLS).
 * In Phase 2, this container will host the lightweight vector SVG path contour and GSAP timeline.
 */
export default function HeroMapPlaceholder() {
  return (
    <div 
      className="relative w-full aspect-[4/3] max-w-lg mx-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl backdrop-blur-sm"
      aria-label="Odisha Map with Bhubaneswar Highlight visual container"
    >
      {/* Decorative regional coordinate grid placeholder */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

      {/* Stylized Vector Visual Anchor */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-orange-500/40 animate-ping absolute"></div>
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
          </div>
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-950/70 border border-orange-800/80 px-2.5 py-1 rounded-full mb-2">
          Odisha Regional Hub
        </span>
        <h3 className="text-lg font-bold text-slate-100">Bhubaneswar (20.2961° N, 85.8245° E)</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Architectural viewport for interactive SVG contour drawing, radar pulse, and phygital connectivity vector.
        </p>
      </div>

      {/* Floating Phygital Indicator */}
      <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Print Edition 1: Bhubaneswar
        </span>
        <span className="text-orange-400 font-medium">Free Distribution</span>
      </div>
    </div>
  );
}
