import React from "react";
import { AdvertisementPackage } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface PackageSelectionCardProps {
  pkg: AdvertisementPackage;
  isSelected: boolean;
  selectedPlan: "SINGLE" | "THREE";
  onSelect: (pkg: AdvertisementPackage) => void;
}

export default function PackageSelectionCard({
  pkg,
  isSelected,
  selectedPlan,
  onSelect,
}: PackageSelectionCardProps) {
  const currentPrice = selectedPlan === "THREE" ? pkg.threeEditionPrice : pkg.singleEditionPrice;

  return (
    <div
      onClick={() => onSelect(pkg)}
      className={`cursor-pointer rounded-2xl border transition-all duration-200 p-5 sm:p-6 relative flex flex-col justify-between ${
        isSelected
          ? "border-[#FFB703] bg-[#161618] ring-2 ring-[#FFB703]/20 shadow-xl"
          : "border-white/10 bg-[#121214] hover:border-white/20 hover:bg-[#161618]"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-[#FFB703]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs font-bold text-[#FFB703] bg-[#FFB703]/10 px-2.5 py-0.5 rounded-full border border-[#FFB703]/30">
            {pkg.packageCode}
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {pkg.colorType.replace(/_/g, " ")}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {pkg.name}
        </h3>

        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
          {pkg.formatDescription}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-neutral-500 block">
            {selectedPlan === "THREE" ? "3 Editions Total" : "Single Edition"}
          </span>
          <span className="text-2xl font-black text-white font-mono">
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {selectedPlan === "THREE" && pkg.savingsAmount > 0 && (
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
            Save ₹{pkg.savingsAmount.toLocaleString("en-IN")}
          </span>
        )}
      </div>
    </div>
  );
}
