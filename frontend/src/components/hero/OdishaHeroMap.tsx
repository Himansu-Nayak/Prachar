"use client";

import React, { useState, useEffect } from "react";
import { ODISHA_DISTRICTS, REGIONAL_HUBS, RegionalHub, DistrictGeometry } from "./odishaMapData";

export default function OdishaHeroMap() {
  const [activeHub, setActiveHub] = useState<RegionalHub>(REGIONAL_HUBS[0]);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeometry | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0D1424] via-[#090E1A] to-[#070A12] p-3 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xl shadow-orange-950/20 backdrop-blur-xl group select-none"
      aria-label="Geographically accurate interactive Odisha Phygital Map with Bhubaneswar Highlight"
    >
      {/* Background Matrix Dot Pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Dynamic Ambient Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-8 w-64 h-64 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Map Control Bar / Header */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 border-b border-slate-800/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
          </span>
          <span className="font-bold text-slate-200 tracking-wider uppercase text-[11px]">
            Odisha Phygital Network
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-orange-950/80 text-orange-300 border border-orange-800/50">
            30 Districts
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-[10px] sm:text-[11px]">
          {hoveredDistrict ? (
            <span className="font-medium text-orange-400 transition-opacity flex items-center gap-1">
              <span>📍</span> {hoveredDistrict.name} ({hoveredDistrict.odiaName})
            </span>
          ) : (
            <span className="text-slate-400 font-mono">
              HQ: {activeHub.name} ({activeHub.coordinates})
            </span>
          )}
        </div>
      </div>

      {/* Quick Hub Selector Pills for Mobile & Accessibility */}
      <div className="relative z-10 flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-b border-slate-800/40">
        <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 flex-shrink-0">
          Hubs:
        </span>
        {REGIONAL_HUBS.map((hub) => {
          const isSelected = activeHub.id === hub.id;
          const isBbsr = hub.id === "bbsr";
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => setActiveHub(hub)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                isSelected
                  ? isBbsr
                    ? "bg-orange-600 text-white shadow-sm shadow-orange-600/40 font-bold"
                    : "bg-slate-700 text-white border border-slate-600"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {isBbsr && <span className="text-[10px]">⭐</span>}
              <span>{hub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Primary SVG Canvas: 100% Mathematically Projected Geometry */}
      <div className="relative w-full my-auto py-2 flex items-center justify-center">
        <svg
          viewBox="0 0 800 680"
          className="w-full h-auto max-h-[380px] sm:max-h-[420px] drop-shadow-[0_12px_36px_rgba(0,0,0,0.7)] map-canvas"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for District Surfaces */}
            <linearGradient id="districtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#111827" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#0B111E" stopOpacity="0.98" />
            </linearGradient>

            <linearGradient id="capitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5E1E09" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#2E1207" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#1A1D2B" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="activeHubDistrict" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
            </linearGradient>

            {/* Bay of Bengal Ambient Oceanic Shimmer */}
            <radialGradient id="bayOfBengalGrad" cx="80%" cy="80%" r="65%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#0369A1" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>

            {/* Subtle radar gradient */}
            <radialGradient id="bbsrRadarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#EA580C" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
            </radialGradient>

            {/* Pulsing beacon glow filter */}
            <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Bay of Bengal Region & Coastal Curve */}
          <path
            d="M 540 680 C 620 580, 720 440, 785 240 L 800 680 Z"
            fill="url(#bayOfBengalGrad)"
            className="pointer-events-none"
          />

          {/* Watermark Label for Bay of Bengal */}
          <g className="select-none pointer-events-none opacity-45">
            <text
              x="690"
              y="550"
              textAnchor="middle"
              className="fill-sky-300 font-bold tracking-widest text-[13px] uppercase"
              transform="rotate(-36, 690, 550)"
            >
              Bay of Bengal
            </text>
            <text
              x="690"
              y="568"
              textAnchor="middle"
              className="fill-sky-400 font-serif text-[11px]"
              transform="rotate(-36, 690, 550)"
            >
              (ବଙ୍ଗୋପସାଗର)
            </text>
          </g>

          {/* All 30 Authentically Projected Odisha Districts */}
          <g id="odisha-districts" className="transition-all duration-300">
            {ODISHA_DISTRICTS.map((d) => {
              const isHovered = hoveredDistrict?.id === d.id;
              const isCapital = d.isCapitalDistrict;

              return (
                <path
                  key={d.id}
                  id={`district-${d.id}`}
                  d={d.path}
                  fill={isCapital ? "url(#capitalGradient)" : "url(#districtGradient)"}
                  stroke={
                    isHovered
                      ? "#F97316"
                      : isCapital
                      ? "#EA580C"
                      : "rgba(148, 163, 184, 0.28)"
                  }
                  strokeWidth={isHovered ? "2.0" : isCapital ? "1.6" : "0.85"}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200 hover:brightness-125"
                  onMouseEnter={() => setHoveredDistrict(d)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  <title>{`${d.name} (${d.odiaName})`}</title>
                </path>
              );
            })}
          </g>

          {/* Chilika Lake Landmark Arc */}
          <ellipse
            cx="542"
            cy="420"
            rx="20"
            ry="9"
            transform="rotate(-38, 542, 420)"
            fill="#0284C7"
            fillOpacity="0.55"
            stroke="#38BDF8"
            strokeWidth="1"
            className="pointer-events-none"
          >
            <title>Chilika Lake (ଚିଲିକା ହ୍ରଦ)</title>
          </ellipse>
          <text
            x="516"
            y="435"
            className="fill-sky-300 text-[10px] font-sans font-semibold pointer-events-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            Chilika
          </text>

          {/* Inter-City Phygital Network Corridor Lines from Bhubaneswar */}
          <g id="connectivity-vectors" className="pointer-events-none">
            {REGIONAL_HUBS.filter((h) => h.id !== "bbsr").map((hub) => {
              const isSelected = activeHub.id === hub.id;
              const bbsr = REGIONAL_HUBS[0];

              return (
                <g key={`corridor-${hub.id}`}>
                  {/* Subtle Background Glow Line */}
                  <line
                    x1={bbsr.x}
                    y1={bbsr.y}
                    x2={hub.x}
                    y2={hub.y}
                    stroke="#EA580C"
                    strokeWidth={isSelected ? "2.5" : "1"}
                    strokeOpacity={isSelected ? "0.85" : "0.22"}
                    strokeDasharray={isSelected ? "6 3" : "4 4"}
                    className={isSelected ? "animate-pulse" : ""}
                  />
                  {/* Dynamic Floating Data Packet */}
                  {isSelected && isClient && (
                    <circle r="3" fill="#FDBA74">
                      <animateMotion
                        path={`M ${bbsr.x} ${bbsr.y} L ${hub.x} ${hub.y}`}
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* Regional Hub Markers */}
          <g id="regional-hubs">
            {REGIONAL_HUBS.map((hub) => {
              const isBbsr = hub.id === "bbsr";
              const isSelected = activeHub.id === hub.id;

              return (
                <g
                  key={hub.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${hub.name} (${hub.odiaName}) - ${hub.edition}`}
                  className="cursor-pointer group/node focus:outline-none"
                  onClick={() => setActiveHub(hub)}
                  onMouseEnter={() => setActiveHub(hub)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveHub(hub);
                    }
                  }}
                >
                  {/* BHUBANESWAR SPECIAL HIGHLIGHT — Multi-Ring Pulsing Radar Beacon */}
                  {isBbsr && (
                    <g className="pointer-events-none">
                      {/* Radar sweep field */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="52"
                        fill="url(#bbsrRadarGrad)"
                      />
                      {/* Concentric Wave 1 */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="38"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="1.4"
                        strokeOpacity="0.55"
                        className="animate-ping motion-reduce:hidden"
                        style={{ animationDuration: "3.2s" }}
                      />
                      {/* Concentric Wave 2 */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="24"
                        fill="none"
                        stroke="#F97316"
                        strokeWidth="1.6"
                        strokeOpacity="0.8"
                        className="animate-pulse motion-reduce:hidden"
                        style={{ animationDuration: "2s" }}
                      />
                      {/* Anchor Ring */}
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="13"
                        fill="#C2410C"
                        fillOpacity="0.35"
                        stroke="#FDBA74"
                        strokeWidth="1.2"
                      />
                    </g>
                  )}

                  {/* Standard Node Outer Glow if selected */}
                  {!isBbsr && isSelected && (
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="16"
                      fill="#EA580C"
                      fillOpacity="0.28"
                      stroke="#F97316"
                      strokeWidth="1.2"
                      className="animate-ping motion-reduce:hidden"
                      style={{ animationDuration: "2s" }}
                    />
                  )}

                  {/* Node Outer Circle */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isBbsr ? "9" : isSelected ? "7" : "5.5"}
                    fill={isBbsr ? "#EA580C" : isSelected ? "#F97316" : "#334155"}
                    stroke="#FFFFFF"
                    strokeWidth={isBbsr || isSelected ? "2.4" : "1.4"}
                    filter={isBbsr ? "url(#beaconGlow)" : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Inner Pure-White Core */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isBbsr ? "4" : "2.5"}
                    fill="#FFFFFF"
                    className="pointer-events-none"
                  />

                  {/* Geographically Anchored City Label with crisp contrast backdrop */}
                  <text
                    x={
                      hub.id === "balasore" || hub.id === "cuttack"
                        ? hub.x - 16
                        : hub.id === "berhampur" || hub.id === "sambalpur"
                        ? hub.x + 16
                        : hub.x + (hub.x > 540 ? 16 : -16)
                    }
                    y={hub.y + 4.5}
                    textAnchor={
                      hub.id === "balasore" || hub.id === "cuttack"
                        ? "end"
                        : hub.id === "berhampur" || hub.id === "sambalpur"
                        ? "start"
                        : hub.x > 540
                        ? "start"
                        : "end"
                    }
                    className={`select-none transition-all duration-200 pointer-events-none ${
                      isBbsr
                        ? "fill-orange-400 font-black text-[14px] drop-shadow-[0_2px_6px_rgba(0,0,0,1)]"
                        : isSelected
                        ? "fill-white font-extrabold text-[13px] drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                        : "fill-slate-200 font-semibold text-[11px] group-hover/node:fill-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                    }`}
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Bottom Interactive Active Hub Detail Card — Robust Responsive Layout */}
      <div className="relative z-10 w-full mt-2 p-3 sm:p-4 rounded-2xl bg-[#0B101E]/95 border border-slate-800 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xl backdrop-blur-md">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-800/80 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
            {activeHub.id === "bbsr" ? "🏛️" : "📍"}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                {activeHub.name}
              </span>
              <span className="text-xs text-orange-400 font-serif font-bold">
                {activeHub.odiaName}
              </span>
              {activeHub.id === "bbsr" ? (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Print Hub (P1–P5)
                </span>
              ) : (
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Phygital Gateway
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-300 mt-1 font-medium line-clamp-1">
              {activeHub.edition}
            </p>
            <p className="text-[10px] text-slate-400 line-clamp-1">
              <span className="text-slate-500 font-semibold">Distribution:</span> {activeHub.coverage}
            </p>
          </div>
        </div>

        <div className="flex items-center sm:flex-col justify-between sm:justify-center sm:items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 text-right">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Monthly Print Cutoff</span>
            <span className="text-xs font-bold text-orange-400">18th of Every Month</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            PRGI: ORORI/25/A3295
          </span>
        </div>
      </div>
    </div>
  );
}
