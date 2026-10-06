import React from "react";

interface ReticleBoxProps {
  children: React.ReactNode;
  className?: string;
  tag?: string;
  telemetry?: string;
  cornerSize?: "sm" | "md" | "lg";
  accentColor?: string;
  glowOnHover?: boolean;
}

export default function ReticleBox({
  children,
  className = "",
  tag,
  telemetry,
}: ReticleBoxProps) {
  return (
    <div
      className={`relative group bg-[#111113] border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-xl ${className}`}
    >
      {/* Clean Editorial Eyebrow Tag if provided */}
      {(tag || telemetry) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5 text-xs text-neutral-400 select-none">
          {tag && (
            <span className="text-[#FFB703] font-mono text-[11px] font-semibold tracking-wider uppercase">
              {tag}
            </span>
          )}
          {telemetry && (
            <span className="tracking-wide text-neutral-400 font-mono text-[11px]">
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
