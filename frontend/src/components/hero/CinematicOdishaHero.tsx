"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ODISHA_DISTRICTS, REGIONAL_HUBS, RegionalHub, DistrictGeometry } from "./odishaMapData";
import { ArrowRight, BookOpen, MapPin, Radio, Activity, Compass, Sparkles } from "lucide-react";

interface CinematicOdishaHeroProps {
  onHubSelect?: (hub: RegionalHub) => void;
  activeHubId?: string;
}

export default function CinematicOdishaHero({
  onHubSelect,
  activeHubId = "bbsr",
}: CinematicOdishaHeroProps) {
  const [selectedHub, setSelectedHub] = useState<RegionalHub>(
    REGIONAL_HUBS.find((h) => h.id === activeHubId) || REGIONAL_HUBS[0]
  );
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeometry | null>(null);
  const [mouseTilt, setMouseTilt] = useState({ rx: 0, ry: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tilt parallax
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseTilt({
      rx: -y * 12, // tilt up/down up to 6 deg
      ry: x * 14,  // tilt left/right up to 7 deg
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseTilt({ rx: 0, ry: 0 });
    setHoveredDistrict(null);
  }, []);

  const handleSelectHub = (hub: RegionalHub) => {
    setSelectedHub(hub);
    if (onHubSelect) onHubSelect(hub);
  };

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-[98vh] bg-[#000000] text-[#FFF3EA] flex flex-col justify-between select-none overflow-hidden border-b border-white/10 px-4 sm:px-8 py-5">
      {/* 21hrs.space Signature Viewfinder Reticle Corner Brackets (Copper/Brass #E4B592) */}
      <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-[#E4B592]/80 pointer-events-none z-30" />
      <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-[#E4B592]/80 pointer-events-none z-30" />
      <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#E4B592]/80 pointer-events-none z-30" />
      <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#E4B592]/80 pointer-events-none z-30" />

      {/* Subtle deep space ambient background gradient centered on Odisha */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(228,181,146,0.06)_0%,rgba(255,136,0,0.03)_35%,transparent_70%)]" />

      {/* Top Technical Reticle Line (Inspired by 21hrs.space "21HRS ON THE") */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-4 pt-2 pb-3 relative z-20">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E4B592]/30 to-[#E4B592]/70" />
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.28em] text-[#E4B592] uppercase font-medium whitespace-nowrap flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4B592] animate-pulse" />
          PRACHAR PHYGITAL SYSTEM • ODISHA 20°N 85°E
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#E4B592]/30 to-[#E4B592]/70" />
      </div>

      {/* Central Visual Stage */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center my-auto z-10">
        {/* Monumental Giant Display Headline Behind Map (21hrs.space "MOON" scale) */}
        <h1 className="text-[16vw] sm:text-[14vw] lg:text-[12.8rem] font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3EA] via-[#D9D9D9]/40 to-[#2A3442]/10 select-none pointer-events-none leading-[0.82] text-center drop-shadow-2xl opacity-90">
          PRACHAR
        </h1>

        {/* 3D Perspective Map Centerpiece Container */}
        <div
          ref={mapContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-4xl h-[360px] sm:h-[440px] lg:h-[520px] -mt-[13vw] sm:-mt-[10vw] lg:-mt-[9rem] relative z-20 flex items-center justify-center cursor-crosshair"
          style={{ perspective: "1100px" }}
        >
          {/* Map Surface in 3D Perspective Tilt with Smooth Parallax */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${22 + mouseTilt.rx}deg) rotateY(${mouseTilt.ry}deg) rotateZ(-1.5deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <svg
              viewBox="0 0 800 680"
              className="w-full h-full max-h-[520px] filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Luminous Glow Filter for Bhubaneswar Epicenter */}
                <filter id="bhubaneswarGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Subtle border circuit glow */}
                <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Vertical Celestial Light Beam Gradient */}
                <linearGradient id="beaconBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#E4B592" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#FFE259" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                {/* Coastal Shelf Depth Gradient */}
                <linearGradient id="oceanShelfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.25" />
                </linearGradient>

                {/* Capital District Khordha Radial Pulse Fill */}
                <radialGradient id="khordhaGoldGrad" cx="566" cy="326" r="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF9900" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#FF6B00" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#0B1120" stopOpacity="0.05" />
                </radialGradient>

                {/* Cartographic Coordinate Grid Pattern */}
                <pattern id="cartoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(228, 181, 146, 0.08)" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Background Cartographic Coordinate Grid */}
              <rect x="150" y="50" width="550" height="580" fill="url(#cartoGrid)" />

              {/* Bay of Bengal Coastal Shelf & Bathymetric Contours */}
              <g className="opacity-90">
                <path
                  d="M 560 200 Q 690 270 750 370 T 800 520 L 800 680 L 490 680 Z"
                  fill="url(#oceanShelfGrad)"
                />
                <path
                  d="M 580 210 Q 705 280 765 380 T 815 530"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.6)"
                  strokeWidth="1.6"
                  strokeDasharray="6 6"
                />
                <path
                  d="M 600 220 Q 720 290 780 390 T 830 540"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.35)"
                  strokeWidth="1.2"
                  strokeDasharray="4 8"
                />
                {/* Coastal Shelf Monospace Watermark */}
                <text
                  x="720"
                  y="490"
                  fill="rgba(56, 189, 248, 0.5)"
                  fontSize="10"
                  fontFamily="monospace"
                  letterSpacing="0.2em"
                  transform="rotate(45, 720, 490)"
                >
                  BAY OF BENGAL SHELF • 20°N
                </text>
              </g>

              {/* 30 Authentic Survey of India Districts of Odisha */}
              <g className="transition-all duration-300">
                {ODISHA_DISTRICTS.map((district) => {
                  const isCapital = district.isCapitalDistrict;
                  const isHovered = hoveredDistrict?.id === district.id;

                  // Fill color logic
                  let fill = "rgba(10, 16, 28, 0.85)"; // obsidian terrain base
                  if (isCapital) {
                    fill = "url(#khordhaGoldGrad)";
                  } else if (isHovered) {
                    fill = "rgba(228, 181, 146, 0.32)";
                  } else if (district.isCoastal) {
                    fill = "rgba(14, 165, 233, 0.12)";
                  }

                  // Stroke border logic
                  let stroke = "rgba(228, 181, 146, 0.55)";
                  let strokeWidth = 1.2;
                  if (isCapital) {
                    stroke = "#FFE259";
                    strokeWidth = 3.2;
                  } else if (isHovered) {
                    stroke = "#FFF3EA";
                    strokeWidth = 2.4;
                  } else if (district.isCoastal) {
                    stroke = "rgba(56, 189, 248, 0.85)";
                    strokeWidth = 1.6;
                  }

                  return (
                    <path
                      key={district.id}
                      d={district.path}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      filter={isCapital || isHovered ? "url(#circuitGlow)" : undefined}
                      className="cursor-pointer transition-colors duration-200"
                      onMouseEnter={() => setHoveredDistrict(district)}
                    />
                  );
                })}
              </g>

              {/* Chilika Lake Lagoon - Luminous Blue Watermark */}
              <g>
                <path
                  d="M 508 410 Q 525 395 540 405 Q 555 418 548 435 Q 532 445 515 432 Z"
                  fill="rgba(6, 182, 212, 0.75)"
                  stroke="#38BDF8"
                  strokeWidth="2.2"
                />
                <text
                  x="525"
                  y="428"
                  fill="#E0F2FE"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                  opacity="0.8"
                >
                  CHILIKA
                </text>
              </g>

              {/* Network Connection Lines between Bhubaneswar & Regional Hubs */}
              <g className="pointer-events-none opacity-40">
                {REGIONAL_HUBS.filter((h) => h.id !== "bbsr").map((hub) => (
                  <line
                    key={`line-${hub.id}`}
                    x1="566.2"
                    y1="326.4"
                    x2={hub.x}
                    y2={hub.y}
                    stroke="#E4B592"
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                  />
                ))}
              </g>

              {/* Regional Secondary Hub Nodes */}
              {REGIONAL_HUBS.filter((h) => h.id !== "bbsr").map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <g
                    key={hub.id}
                    className="cursor-pointer group"
                    onClick={() => handleSelectHub(hub)}
                  >
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected ? "7" : "4.5"}
                      fill={isSelected ? "#FFF3EA" : "#38BDF8"}
                      stroke="#000000"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected ? "14" : "9"}
                      fill="none"
                      stroke={isSelected ? "#E4B592" : "rgba(56, 189, 248, 0.6)"}
                      strokeWidth="1.2"
                    />
                    <text
                      x={hub.x + 12}
                      y={hub.y + 4}
                      fill={isSelected ? "#FFF3EA" : "#94A3B8"}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight={isSelected ? "bold" : "normal"}
                      letterSpacing="0.05em"
                    >
                      {hub.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* ────────────────────────────────────────────────────────── */}
              {/* BHUBANESWAR HIGHLIGHT & RADIANT EPICENTER (566.2, 326.4) */}
              {/* ────────────────────────────────────────────────────────── */}
              <g id="bhubaneswarEpicenter" className="cursor-pointer" onClick={() => handleSelectHub(REGIONAL_HUBS[0])}>
                {/* 1. Vertical Celestial Light Ray shooting into the void */}
                <rect
                  x="564.2"
                  y="60"
                  width="4"
                  height="266.4"
                  fill="url(#beaconBeamGrad)"
                  opacity="0.85"
                />
                <line
                  x1="566.2"
                  y1="50"
                  x2="566.2"
                  y2="326.4"
                  stroke="#FFE259"
                  strokeWidth="1.5"
                  opacity="0.9"
                />

                {/* 2. Expanding Pulse Ripple Rings */}
                <circle
                  cx="566.2"
                  cy="326.4"
                  r="52"
                  fill="none"
                  stroke="#FFAA00"
                  strokeWidth="1.4"
                  opacity="0.25"
                  className="animate-ping"
                  style={{ animationDuration: "3s" }}
                />
                <circle
                  cx="566.2"
                  cy="326.4"
                  r="34"
                  fill="none"
                  stroke="#FFAA00"
                  strokeWidth="2"
                  opacity="0.5"
                  className="animate-ping"
                  style={{ animationDuration: "2s" }}
                />
                <circle
                  cx="566.2"
                  cy="326.4"
                  r="20"
                  fill="rgba(255, 170, 0, 0.25)"
                  stroke="#FFE259"
                  strokeWidth="2.5"
                  filter="url(#bhubaneswarGlow)"
                />

                {/* 3. Reticle Crosshair Centered on Bhubaneswar */}
                <line x1="536" y1="326.4" x2="554" y2="326.4" stroke="#FFF3EA" strokeWidth="1.5" />
                <line x1="578.4" y1="326.4" x2="596.4" y2="326.4" stroke="#FFF3EA" strokeWidth="1.5" />
                <line x1="566.2" y1="296.2" x2="566.2" y2="314.2" stroke="#FFF3EA" strokeWidth="1.5" />
                <line x1="566.2" y1="338.6" x2="566.2" y2="356.6" stroke="#FFF3EA" strokeWidth="1.5" />

                {/* 4. Radiant White-Hot Core Pin */}
                <circle cx="566.2" cy="326.4" r="6" fill="#FFFFFF" stroke="#FF8800" strokeWidth="2" />
                <circle cx="566.2" cy="326.4" r="2.5" fill="#FF4500" />

                {/* 5. Bhubaneswar Permanent Luminous HUD Badge on Map */}
                <g transform="translate(585, 305)">
                  <rect
                    x="0"
                    y="0"
                    width="180"
                    height="48"
                    rx="8"
                    fill="#050811"
                    fillOpacity="0.92"
                    stroke="#E4B592"
                    strokeWidth="1.2"
                    filter="url(#circuitGlow)"
                  />
                  {/* Copper corner accent */}
                  <rect x="0" y="0" width="6" height="6" fill="#E4B592" />
                  <text x="14" y="18" fill="#FFAA00" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    BHUBANESWAR • ଭୁବନେଶ୍ୱର
                  </text>
                  <text x="14" y="32" fill="#E2E8F0" fontSize="9" fontFamily="monospace">
                    20.2961° N, 85.8245° E
                  </text>
                  <text x="14" y="42" fill="#34D399" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    50,000+ PRINT DROP CAPITAL
                  </text>
                </g>
              </g>

              {/* Hover Tooltip Overlay for any hovered district */}
              {hoveredDistrict && hoveredDistrict.id !== "khordha" && (
                <g transform="translate(220, 100)">
                  <rect
                    x="0"
                    y="0"
                    width="200"
                    height="44"
                    rx="6"
                    fill="#070B14"
                    fillOpacity="0.95"
                    stroke="#E4B592"
                    strokeWidth="1"
                  />
                  <text x="12" y="18" fill="#FFF3EA" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    DISTRICT: {hoveredDistrict.name.toUpperCase()}
                  </text>
                  <text x="12" y="32" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                    {hoveredDistrict.odiaName} • {hoveredDistrict.isCoastal ? "Coastal Zone" : "Inland Zone"}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Flanking Technical Metadata & Center Subtitle (21hrs.space Structure) */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 relative z-20">
          {/* Left Metadata: Edition & Circulation */}
          <div className="md:col-span-3 text-left font-mono text-xs space-y-1 hidden md:block">
            <div className="text-[10px] uppercase tracking-widest text-[#E4B592]/80 font-semibold">
              MISSION EDITION
            </div>
            <div className="text-white font-bold text-sm tracking-wide">Prachar Print 01</div>
            <div className="text-slate-400 text-[11px]">50,000+ Monthly Drop</div>
          </div>

          {/* Center Editorial Subtitle */}
          <div className="md:col-span-6 text-center px-4">
            <p className="text-sm sm:text-base text-[#DAD0C8] font-normal leading-relaxed max-w-lg mx-auto">
              Connecting Bhubaneswar&apos;s verified commerce directly to 50,000+ local households through monthly door-to-door print publication paired with permanent dynamic QR identity.
            </p>
          </div>

          {/* Right Metadata: Coordinates & PRGI */}
          <div className="md:col-span-3 text-right font-mono text-xs space-y-1 hidden md:block">
            <div className="text-[10px] uppercase tracking-widest text-[#E4B592]/80 font-semibold">
              REGIONAL GRID
            </div>
            <div className="text-white font-bold text-sm tracking-wide">20.2961° N, 85.8245° E</div>
            <div className="text-slate-400 text-[11px]">PRGI: ORORI/25/A3295</div>
          </div>
        </div>

        {/* Reticle Wireframe Action Buttons (21hrs.space Button Aesthetics) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-7 relative z-20 w-full px-4">
          <Link
            href="/register"
            className="group relative px-8 py-3.5 rounded-full border border-[#E4B592] bg-[#E4B592]/10 hover:bg-[#E4B592] text-[#FFF3EA] hover:text-[#000000] font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-xl flex items-center gap-2 backdrop-blur-md"
          >
            <span>CLAIM PHYGITAL CARD</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/advertise"
            className="px-7 py-3.5 rounded-full border border-white/20 bg-black/60 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-400" />
            <span>EXPLORE RATE CARDS (P1–P5)</span>
          </Link>
        </div>
      </div>

      {/* Bottom Interactive Focal Node Ribbon & Telemetry Footer */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-2.5 pt-4 relative z-20">
        {/* Focal Nodes Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1.5 px-3 rounded-full border border-white/10 bg-[#070A14]/90 backdrop-blur-xl shadow-2xl scrollbar-none">
          <span className="text-[10px] font-mono font-bold text-[#E4B592]/90 uppercase tracking-widest px-2 hidden sm:inline">
            FOCAL NODES:
          </span>
          {REGIONAL_HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const isBhubaneswar = hub.id === "bbsr";

            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#E4B592] text-[#000000] shadow-lg shadow-orange-950/60 ring-1 ring-white/50 scale-105 font-bold"
                    : "text-slate-400 hover:text-[#FFF3EA] hover:bg-white/5 border border-transparent"
                }`}
              >
                {isBhubaneswar && <span className="text-amber-700">⭐</span>}
                <span>{hub.name}</span>
                <span className="font-serif text-[11px] opacity-75">{hub.odiaName}</span>
              </button>
            );
          })}
        </div>

        {/* Telemetry Footer Line */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ACTIVE FOCAL: {selectedHub.name.toUpperCase()} ({selectedHub.coordinates})</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>PRINTING PRESS: CHANDAN PRINTERS, UNIT-3</span>
          </div>
        </div>
      </div>
    </section>
  );
}
