import React from "react";
import { EditionCutoff } from "@/types";
import { Clock, ShieldCheck } from "lucide-react";

interface EditionCutoffBannerProps {
  cutoff: EditionCutoff | null;
  className?: string;
}

export default function EditionCutoffBanner({
  cutoff,
  className = "",
}: EditionCutoffBannerProps) {
  if (!cutoff) return null;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#121214] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#FFB703]/10 text-[#FFB703] border border-[#FFB703]/20 flex-shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFB703] font-mono">
              Monthly Print Booking Window
            </span>
            {cutoff.cutoffPassed && (
              <span className="text-[10px] bg-amber-950/80 border border-amber-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                Booking for Next Cycle
              </span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white mt-1">
            Target Edition:{" "}
            <span className="text-[#FFB703]">
              {cutoff.cutoffPassed
                ? cutoff.nextAvailableEdition
                : cutoff.currentTargetEdition}
            </span>
          </h4>
          <p className="text-xs text-neutral-400 mt-1">{cutoff.message}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/10 text-xs text-neutral-400 font-mono">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Chandan Printers, Unit-3 • Bhubaneswar</span>
      </div>
    </div>
  );
}
