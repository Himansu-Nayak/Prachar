import React from "react";
import { AdvertisementStatus, CardStatus, ProfileStatus } from "@/types";

export type AnyBadgeStatus = AdvertisementStatus | CardStatus | ProfileStatus | string;

interface StatusBadgeProps {
  status: AnyBadgeStatus;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusBadge({
  status,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  const getBadgeStyle = (st: string) => {
    switch (st) {
      case "ACTIVE":
      case "APPROVED":
      case "CONFIRMED":
      case "PAID":
      case "PAYMENT_CONFIRMED":
        return "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";

      case "PENDING_REVIEW":
      case "SUBMITTED":
      case "PENDING_PAYMENT":
      case "ORDER_CREATED":
        return "bg-amber-950/60 border-amber-500/40 text-amber-300";

      case "DRAFT":
        return "bg-slate-800/60 border-slate-700 text-slate-300";

      case "REJECTED":
      case "FAILED":
      case "SUSPENDED":
        return "bg-rose-950/60 border-rose-500/40 text-rose-300";

      case "INACTIVE":
      case "CANCELLED":
      case "REFUNDED":
      case "DECOMMISSIONED":
        return "bg-neutral-800/80 border-neutral-700 text-neutral-400";

      default:
        return "bg-slate-900 border-slate-700 text-slate-300";
    }
  };

  const formatStatusText = (st: string) => {
    return st.replace(/_/g, " ");
  };

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 tracking-wider"
      : "text-xs px-2.5 py-1 tracking-wider";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold uppercase ${sizeClasses} ${getBadgeStyle(
        normalized
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {formatStatusText(normalized)}
    </span>
  );
}
