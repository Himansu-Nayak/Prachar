import React from "react";
import { AdvertisementSummary } from "@/types";
import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface AdSummaryMetricsProps {
  summary: AdvertisementSummary | null;
  className?: string;
}

export default function AdSummaryMetrics({
  summary,
  className = "",
}: AdSummaryMetricsProps) {
  if (!summary) return null;

  const cards = [
    {
      label: "Total Bookings",
      value: summary.total,
      icon: FileText,
      color: "text-white",
      bg: "bg-white/5",
    },
    {
      label: "Published",
      value: summary.published,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40",
    },
    {
      label: "Under Review",
      value: summary.underReview + summary.submitted,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-950/40",
    },
    {
      label: "Payment Pending",
      value: summary.paymentPending,
      icon: AlertCircle,
      color: "text-rose-400",
      bg: "bg-rose-950/40",
    },
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#121214] flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] text-neutral-400 font-medium block">
                {card.label}
              </span>
              <span className={`text-2xl font-black font-mono mt-1 block ${card.color}`}>
                {card.value}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
