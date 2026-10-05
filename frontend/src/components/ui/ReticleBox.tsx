import React from "react";

interface ReticleBoxProps {
  children: React.ReactNode;
  className?: string;
  tag?: string;
  telemetry?: string;
  cornerSize?: "sm" | "md" | "lg";
  accentColor?: string; // default #E4B592
  glowOnHover?: boolean;
}

export default function ReticleBox({
  children,
  className = "",
  tag,
  telemetry,
  cornerSize = "md",
  accentColor = "#E4B592",
  glowOnHover = true,
}: ReticleBoxProps) {
  const sizeMap = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const cornerClass = sizeMap[cornerSize];

  return (
    <div
      className={`relative group bg-[#070B14]/80 backdrop-blur-xl border border-[${accentColor}]/20 transition-all duration-300 ${
        glowOnHover ? "hover:border-[#E4B592]/50 hover:shadow-[0_0_35px_-8px_rgba(228,181,146,0.25)]" : ""
      } ${className}`}
      style={{ borderColor: "rgba(228, 181, 146, 0.2)" }}
    >
      {/* 4 Precision Viewfinder Corner Brackets */}
      <div
        className={`absolute -top-[1px] -left-[1px] ${cornerClass} border-t-2 border-l-2 pointer-events-none transition-all duration-300 group-hover:scale-110`}
        style={{ borderColor: accentColor }}
      />
      <div
        className={`absolute -top-[1px] -right-[1px] ${cornerClass} border-t-2 border-r-2 pointer-events-none transition-all duration-300 group-hover:scale-110`}
        style={{ borderColor: accentColor }}
      />
      <div
        className={`absolute -bottom-[1px] -left-[1px] ${cornerClass} border-b-2 border-l-2 pointer-events-none transition-all duration-300 group-hover:scale-110`}
        style={{ borderColor: accentColor }}
      />
      <div
        className={`absolute -bottom-[1px] -right-[1px] ${cornerClass} border-b-2 border-r-2 pointer-events-none transition-all duration-300 group-hover:scale-110`}
        style={{ borderColor: accentColor }}
      />

      {/* Optional Telemetry Header Ribbon */}
      {(tag || telemetry) && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/[0.02] text-[10px] font-mono text-slate-400 select-none">
          {tag && (
            <span className="flex items-center gap-1.5 text-[#E4B592] font-semibold tracking-widest uppercase">
              <span className="w-1 h-1 rounded-full bg-[#E4B592] animate-pulse" />
              {tag}
            </span>
          )}
          {telemetry && (
            <span className="tracking-wider text-slate-400 ml-auto font-mono text-[9px]">
              {telemetry}
            </span>
          )}
        </div>
      )}

      {/* Container Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
