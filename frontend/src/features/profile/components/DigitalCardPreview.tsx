import React from "react";
import { MyProfile } from "@/types";

interface DigitalCardPreviewProps {
  profile: MyProfile;
  isCardActive?: boolean;
  className?: string;
}

export default function DigitalCardPreview({
  profile,
  isCardActive = true,
  className = "",
}: DigitalCardPreviewProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Companion Digital Card
        </h2>
        <span
          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${
            isCardActive
              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {profile.cardStatus || (isCardActive ? "ACTIVE" : "INACTIVE")}
        </span>
      </div>

      {/* Premium Realistic Phygital Card */}
      <div
        style={{ backgroundColor: profile.themeColor || "#0F172A" }}
        className="rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/15 text-white relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-orange-950/30"
      >
        {/* Glossy gradient reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-7xl select-none pointer-events-none font-display">
          P
        </div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 font-mono">
              PRACHAR CARD
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/80 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-md font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
            <span>{profile.isNfcEnabled ? "NFC Active" : "NFC Ready"}</span>
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <h3 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
            {profile.displayName}
          </h3>
          {profile.businessName && (
            <p className="text-xs text-white/90 font-medium mt-1">{profile.businessName}</p>
          )}
          <p className="text-xs text-white/80 mt-1.5 font-medium">{profile.category}</p>
          {profile.tagline && (
            <p className="text-[11px] text-white/70 italic mt-2.5 line-clamp-2">
              &quot;{profile.tagline}&quot;
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] relative z-10">
          <div>
            <p className="text-white/60 text-[9px] uppercase font-bold tracking-wider">
              {profile.city}, {profile.state || "Odisha"}
            </p>
            <p className="font-mono text-white/95 mt-0.5">{profile.primaryPhone}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-[9px] uppercase font-bold tracking-wider">Vanity URL</p>
            <p className="font-mono text-amber-300 font-semibold mt-0.5">
              /u/{profile.usernameSlug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
