"use client";

import React, { useState } from "react";

interface RegionalNode {
  id: string;
  name: string;
  odiaName: string;
  x: number;
  y: number;
  status: "ACTIVE_PRINT_DIGITAL" | "DIGITAL_NETWORK";
  coordinates: string;
  edition: string;
}

const REGIONAL_NODES: RegionalNode[] = [
  {
    id: "bbsr",
    name: "Bhubaneswar",
    odiaName: "ଭୁବନେଶ୍ୱର",
    x: 485,
    y: 350,
    status: "ACTIVE_PRINT_DIGITAL",
    coordinates: "20.2961° N, 85.8245° E",
    edition: "Print Edition 1 • Active Distribution",
  },
  {
    id: "cuttack",
    name: "Cuttack",
    odiaName: "କଟକ",
    x: 495,
    y: 330,
    status: "DIGITAL_NETWORK",
    coordinates: "20.4625° N, 85.8828° E",
    edition: "Twin City • Phygital Network",
  },
  {
    id: "puri",
    name: "Puri",
    odiaName: "ପୁରୀ",
    x: 485,
    y: 405,
    status: "DIGITAL_NETWORK",
    coordinates: "19.8135° N, 85.8312° E",
    edition: "Pilgrimage Hub • Phygital Network",
  },
  {
    id: "rourkela",
    name: "Rourkela",
    odiaName: "ରାଉରକେଲା",
    x: 385,
    y: 165,
    status: "DIGITAL_NETWORK",
    coordinates: "22.2604° N, 84.8536° E",
    edition: "Northern Industrial Corridor",
  },
  {
    id: "sambalpur",
    name: "Sambalpur",
    odiaName: "ସମ୍ବଲପୁର",
    x: 300,
    y: 250,
    status: "DIGITAL_NETWORK",
    coordinates: "21.4669° N, 83.9812° E",
    edition: "Western Regional Hub",
  },
  {
    id: "berhampur",
    name: "Berhampur",
    odiaName: "ବ୍ରହ୍ମପୁର",
    x: 385,
    y: 450,
    status: "DIGITAL_NETWORK",
    coordinates: "19.3150° N, 84.7941° E",
    edition: "Silk City • Southern Gateway",
  },
  {
    id: "balasore",
    name: "Balasore",
    odiaName: "ବାଲେଶ୍ୱର",
    x: 580,
    y: 220,
    status: "DIGITAL_NETWORK",
    coordinates: "21.4934° N, 86.9135° E",
    edition: "Coastal Commercial Hub",
  },
];

export default function OdishaHeroMap() {
  const [activeNode, setActiveNode] = useState<RegionalNode | null>(REGIONAL_NODES[0]);

  return (
    <div
      className="relative w-full aspect-[4/3] max-w-xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/80 p-4 sm:p-6 flex flex-col items-center justify-between text-center overflow-hidden shadow-2xl backdrop-blur-md group"
      aria-label="Interactive Odisha Phygital Map with Bhubaneswar Highlight"
    >
      {/* Background Matrix Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Regional Header */}
      <div className="relative z-10 w-full flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          Odisha Phygital Publicity Network
        </span>
        <span className="font-mono text-slate-500">20.2961° N, 85.8245° E</span>
      </div>

      {/* SVG Map Container (Lightweight <25 KB vector contour) */}
      <div className="relative w-full h-full flex items-center justify-center my-auto py-2">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-h-[380px] drop-shadow-2xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Odisha Landmass Gradients */}
            <linearGradient id="odishaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0F172A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="glowBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#F97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
            </linearGradient>

            {/* Bay of Bengal Ambient Gradient */}
            <radialGradient id="bayOfBengalGlow" cx="75%" cy="70%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Bay of Bengal Regional Curve Backdrop */}
          <path
            d="M 520 600 C 600 520, 720 400, 780 200 L 800 600 Z"
            fill="url(#bayOfBengalGlow)"
            className="pointer-events-none"
          />

          {/* Authentic Vector Contour of Odisha */}
          <path
            id="odisha-boundary"
            d="M 330 130 
               C 380 110, 480 110, 580 145
               C 625 160, 660 195, 620 230
               C 590 255, 570 280, 560 310
               C 555 330, 545 350, 530 375
               C 515 395, 490 415, 465 435
               C 440 455, 410 480, 390 515
               C 365 550, 320 580, 260 560
               C 210 540, 180 485, 200 440
               C 220 395, 235 365, 245 330
               C 255 295, 275 250, 290 215
               C 305 180, 315 150, 330 130 Z"
            fill="url(#odishaGradient)"
            stroke="url(#glowBorder)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="transition-all duration-700 hover:brightness-110 filter drop-shadow-[0_10px_25px_rgba(234,88,12,0.15)]"
          />

          {/* Chilika Lake Indentation Detail */}
          <path
            d="M 450 430 C 465 415, 475 425, 460 445 C 445 460, 440 440, 450 430 Z"
            fill="#0369A1"
            opacity="0.4"
          />

          {/* Phygital Connectivity Vector Lines from Bhubaneswar */}
          {REGIONAL_NODES.filter((n) => n.id !== "bbsr").map((node) => (
            <g key={`vector-${node.id}`} className="transition-opacity duration-300">
              <line
                x1={REGIONAL_NODES[0].x}
                y1={REGIONAL_NODES[0].y}
                x2={node.x}
                y2={node.y}
                stroke="#EA580C"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity={activeNode?.id === node.id ? "0.9" : "0.25"}
                className={activeNode?.id === node.id ? "animate-pulse" : ""}
              />
            </g>
          ))}

          {/* Regional Hub Nodes */}
          {REGIONAL_NODES.map((node) => {
            const isBbsr = node.id === "bbsr";
            const isSelected = activeNode?.id === node.id;

            return (
              <g
                key={node.id}
                tabIndex={0}
                role="button"
                aria-label={`${node.name}, ${node.odiaName}: ${node.edition}`}
                className="cursor-pointer group/node focus:outline-none"
                onClick={() => setActiveNode(node)}
                onMouseEnter={() => setActiveNode(node)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveNode(node);
                  }
                }}
              >
                {/* Bhubaneswar Pulsing Radar Waves */}
                {isBbsr && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="32"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      className="animate-ping"
                      style={{ animationDuration: "3s" }}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      fill="none"
                      stroke="#EA580C"
                      strokeWidth="1.5"
                      strokeOpacity="0.5"
                      className="animate-pulse"
                    />
                  </>
                )}

                {/* Node Outer Ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isBbsr ? "8" : isSelected ? "6" : "4.5"}
                  fill={isBbsr ? "#EA580C" : isSelected ? "#F97316" : "#475569"}
                  fillOpacity={isBbsr ? "1" : "0.85"}
                  stroke="#FFFFFF"
                  strokeWidth={isBbsr || isSelected ? "2" : "1"}
                  className="transition-all duration-200"
                />

                {/* Node Inner Core */}
                {isBbsr && (
                  <circle cx={node.x} cy={node.y} r="3" fill="#FFFFFF" />
                )}

                {/* City Name Label */}
                <text
                  x={node.x + (node.x > 500 ? -12 : 14)}
                  y={node.y + 4}
                  textAnchor={node.x > 500 ? "end" : "start"}
                  className={`text-[11px] font-bold select-none transition-all duration-200 ${
                    isBbsr
                      ? "fill-orange-400 font-extrabold text-[12px]"
                      : isSelected
                      ? "fill-white"
                      : "fill-slate-400 group-hover/node:fill-slate-200"
                  }`}
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Interactive Active Hub Detail Card */}
      <div className="relative z-10 w-full mt-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-950/80 border border-orange-800 flex items-center justify-center text-sm">
            {activeNode?.id === "bbsr" ? "🏛️" : "📍"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {activeNode?.name}
              </span>
              <span className="text-[11px] text-orange-400 font-serif">
                ({activeNode?.odiaName})
              </span>
              {activeNode?.id === "bbsr" && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Active Print Hub
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {activeNode?.edition} • {activeNode?.coordinates}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Cutoff Date</span>
          <span className="text-xs font-bold text-slate-200">18th of Every Month</span>
        </div>
      </div>
    </div>
  );
}
