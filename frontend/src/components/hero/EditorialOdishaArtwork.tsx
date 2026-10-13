"use client";

import React, { useState, useRef, useCallback } from "react";
import { ODISHA_DISTRICTS, REGIONAL_HUBS, RegionalHub, DistrictGeometry } from "./odishaMapData";
import { isReducedMotion } from "@/lib/motion";

interface EditorialOdishaArtworkProps {
  onHubSelect?: (hub: RegionalHub) => void;
  activeHubId?: string;
}

export default function EditorialOdishaArtwork({
  onHubSelect,
  activeHubId = "bbsr",
}: EditorialOdishaArtworkProps) {
  const [activeHub, setActiveHub] = useState<RegionalHub>(
    REGIONAL_HUBS.find((h) => h.id === activeHubId) || REGIONAL_HUBS[0]
  );
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeometry | null>(null);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth pointer-driven 3D perspective tilt
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion() || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setCardTilt({
      rx: -y * 8, // subtle 4 deg tilt
      ry: x * 10,  // subtle 5 deg tilt
      px: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      py: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setCardTilt({ rx: 0, ry: 0, px: 50, py: 50 });
    setHoveredDistrict(null);
  }, []);

  const handleHubClick = (hub: RegionalHub) => {
    setActiveHub(hub);
    if (onHubSelect) onHubSelect(hub);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-xl mx-auto rounded-3xl transition-transform duration-500 ease-out select-none"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        transform: `rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
      }}
    >
      {/* Background Layer 1: Ambient Radial Spotlight & Atmospheric Corona */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${cardTilt.px}% ${cardTilt.py}%, rgba(255, 183, 3, 0.18) 0%, rgba(228, 181, 146, 0.08) 45%, transparent 70%)`,
        }}
      />

      {/* Main Structural Chassis */}
      <div
        className="relative w-full rounded-3xl bg-[#0C0C0F] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md"
        style={{
          boxShadow: `
            0 25px 60px -15px rgba(0, 0, 0, 0.95),
            0 0 40px -10px rgba(255, 183, 3, 0.08),
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 1px 0 rgba(0, 0, 0, 0.8)
          `,
        }}
      >
        {/* Specular Highlight Sheen following cursor */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${cardTilt.px}% ${cardTilt.py}%, rgba(255, 255, 255, 0.06) 0%, transparent 80%)`,
          }}
        />

        {/* Top Header: Elevated Foreground */}
        <div
          className="flex items-center justify-between pb-4 border-b border-white/10 relative z-20"
          style={{ transform: "translateZ(16px)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB703]">
                Geographic Network
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Odisha Phygital Cartography
            </h3>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-neutral-300 block font-medium">
              {hoveredDistrict ? hoveredDistrict.name : activeHub.name}
            </span>
            <span className="text-[11px] font-serif text-[#FFB703]">
              {hoveredDistrict ? hoveredDistrict.odiaName : activeHub.odiaName}
            </span>
          </div>
        </div>

        {/* Middle-Ground: Primary Cartographic Surface */}
        <div
          className="relative my-4 flex items-center justify-center"
          style={{ transform: "translateZ(8px)" }}
        >
          <svg
            viewBox="0 0 800 680"
            className="w-full h-auto max-h-[380px] sm:max-h-[420px] select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subtle Warm Focal Beacon for Bhubaneswar */}
              <radialGradient id="bbsrGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFB703" stopOpacity="0.5"/>
                <stop offset="60%" stopColor="#FFB703" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#FFB703" stopOpacity="0"/>
              </radialGradient>

              {/* Coastline Water Gradient */}
              <linearGradient id="bayOfBengalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.06"/>
                <stop offset="60%" stopColor="#0369A1" stopOpacity="0.02"/>
                <stop offset="100%" stopColor="#082F49" stopOpacity="0"/>
              </linearGradient>

              {/* District Depth Filter (Ambient Occlusion) */}
              <filter id="districtElevation" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
              </filter>
            </defs>

            {/* Subtle Maritime Coastline Depth */}
            <path
              d="M 520 600 C 650 500, 750 350, 780 200 L 800 200 L 800 680 L 520 680 Z"
              fill="url(#bayOfBengalGrad)"
            />
            <text
              x="700"
              y="540"
              fill="rgba(255, 255, 255, 0.08)"
              fontSize="11"
              letterSpacing="5"
              fontFamily="ui-monospace, monospace"
              transform="rotate(-40, 700, 540)"
            >
              BAY OF BENGAL
            </text>

            {/* Coordinate Grid Rulers */}
            <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" strokeDasharray="4 6">
              <line x1="200" y1="50" x2="200" y2="650"/>
              <line x1="400" y1="50" x2="400" y2="650"/>
              <line x1="600" y1="50" x2="600" y2="650"/>
              <line x1="50" y1="200" x2="750" y2="200"/>
              <line x1="50" y1="400" x2="750" y2="400"/>
            </g>

            {/* 30 Authentic Odisha District Polygons with Layered Relief */}
            <g filter="url(#districtElevation)">
              {ODISHA_DISTRICTS.map((district) => {
                const isHovered = hoveredDistrict?.id === district.id;
                const isKhordha = district.id === "khordha";

                return (
                  <path
                    key={district.id}
                    d={district.path}
                    onMouseEnter={() => setHoveredDistrict(district)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className="transition-all duration-200 cursor-pointer"
                    fill={
                      isHovered
                        ? "#2C2C32"
                        : isKhordha
                        ? "#1E1C16"
                        : "#141418"
                    }
                    stroke={
                      isHovered
                        ? "#FFB703"
                        : isKhordha
                        ? "rgba(255, 183, 3, 0.45)"
                        : "rgba(255, 255, 255, 0.08)"
                    }
                    strokeWidth={isHovered ? "1.6" : isKhordha ? "1.1" : "0.75"}
                  />
                );
              })}
            </g>

            {/* Regional Hub Markers & Focal Beacon */}
            {REGIONAL_HUBS.map((hub) => {
              const isBbsr = hub.id === "bbsr";
              const isSelected = activeHub.id === hub.id;

              return (
                <g
                  key={hub.id}
                  transform={`translate(${hub.x}, ${hub.y})`}
                  className="cursor-pointer"
                  onClick={() => handleHubClick(hub)}
                >
                  {/* Bhubaneswar Soft Ambient Halo */}
                  {isBbsr && (
                    <circle
                      r="20"
                      fill="url(#bbsrGlow)"
                      className="transition-opacity duration-500"
                    />
                  )}

                  {/* Marker Center Dot */}
                  <circle
                    r={isBbsr ? "4.5" : "2.5"}
                    fill={isBbsr ? "#FFB703" : isSelected ? "#FFFFFF" : "#A3A3A3"}
                    stroke="#0C0C0F"
                    strokeWidth="1.5"
                  />

                  {/* Label */}
                  <text
                    x="8"
                    y="3"
                    fill={isBbsr ? "#FFB703" : isSelected ? "#FFFFFF" : "#8E8E93"}
                    fontSize={isBbsr ? "11" : "9"}
                    fontWeight={isBbsr ? "700" : "500"}
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.5"
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Foreground Layer 3: Elevated Floating Metadata Bar */}
        <div
          className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400 relative z-20"
          style={{ transform: "translateZ(24px)" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFB703]" />
            <span className="text-white font-semibold">Bhubaneswar:</span>
            <span className="text-neutral-300">50,000+ Print Circulation Hub</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
            <span className="text-neutral-300">20.2961° N, 85.8245° E</span>
            <span>•</span>
            <span className="text-[#FFB703] font-medium">8 Prime Corridors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
