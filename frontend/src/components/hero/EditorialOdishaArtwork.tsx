"use client";

import React, { useState } from "react";
import { ODISHA_DISTRICTS, REGIONAL_HUBS, RegionalHub, DistrictGeometry } from "./odishaMapData";

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

  const handleHubClick = (hub: RegionalHub) => {
    setActiveHub(hub);
    if (onHubSelect) onHubSelect(hub);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-[#0F0F12] border border-white/10 p-5 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Top Editorial Artwork Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB703] block mb-1">
            Geographic Network
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white font-display">
            Odisha Phygital Cartography
          </h3>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-neutral-400 block">
            {hoveredDistrict ? hoveredDistrict.name : activeHub.name}
          </span>
          <span className="text-[11px] font-serif text-[#FFB703]">
            {hoveredDistrict ? hoveredDistrict.odiaName : activeHub.odiaName}
          </span>
        </div>
      </div>

      {/* Primary SVG Artwork */}
      <div className="relative my-4 flex items-center justify-center">
        <svg
          viewBox="0 0 800 680"
          className="w-full h-auto max-h-[380px] sm:max-h-[420px] select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle coastline background tint */}
          <path
            d="M 520 600 C 650 500, 750 350, 780 200 L 800 200 L 800 680 L 520 680 Z"
            fill="rgba(14, 165, 233, 0.03)"
          />
          <text
            x="700"
            y="540"
            fill="rgba(255, 255, 255, 0.15)"
            fontSize="12"
            letterSpacing="6"
            fontFamily="ui-monospace, monospace"
            transform="rotate(-40, 700, 540)"
          >
            BAY OF BENGAL
          </text>

          {/* 30 Authentic Odisha District Paths */}
          <g className="transition-all duration-300">
            {ODISHA_DISTRICTS.map((district) => {
              const isHovered = hoveredDistrict?.id === district.id;
              const isKhordha = district.id === "khordha";

              return (
                <path
                  key={district.id}
                  d={district.path}
                  onMouseEnter={() => setHoveredDistrict(district)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  className="transition-colors duration-200 cursor-pointer"
                  fill={
                    isHovered
                      ? "#2D2D32"
                      : isKhordha
                      ? "#1F1E1A"
                      : "#17171A"
                  }
                  stroke={
                    isHovered
                      ? "#FFB703"
                      : isKhordha
                      ? "rgba(255, 183, 3, 0.4)"
                      : "rgba(255, 255, 255, 0.1)"
                  }
                  strokeWidth={isHovered ? "1.5" : "0.75"}
                />
              );
            })}
          </g>

          {/* Regional Hub Markers */}
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
                {/* Bhubaneswar Subtle Emphasis (Not a giant radar) */}
                {isBbsr && (
                  <>
                    <circle
                      r="16"
                      fill="#FFB703"
                      fillOpacity="0.12"
                      className="animate-pulse"
                    />
                    <circle
                      r="8"
                      fill="#FFB703"
                      fillOpacity="0.25"
                    />
                  </>
                )}

                {/* Point dot */}
                <circle
                  r={isBbsr ? "4" : "2.5"}
                  fill={isBbsr ? "#FFB703" : isSelected ? "#FFFFFF" : "#A3A3A3"}
                  stroke="#0F0F12"
                  strokeWidth="1.5"
                />

                {/* Label */}
                <text
                  x="7"
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

      {/* Bottom Editorial Focal Metadata Strip */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFB703]" />
          <span className="text-white font-medium">Bhubaneswar:</span>
          <span>50,000+ Print Circulation Hub</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500">
          <span>20.2961° N, 85.8245° E</span>
          <span>•</span>
          <span className="text-neutral-300">8 Prime Sectors</span>
        </div>
      </div>
    </div>
  );
}
