import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-3xl border border-white/10 bg-[#121214] max-w-lg mx-auto ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center text-[#FFB703]">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-bold text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-xs sm:text-sm px-6 py-2.5 transition shadow-sm"
        >
          {actionText}
        </Link>
      )}

      {actionText && !actionHref && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-xs sm:text-sm px-6 py-2.5 transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
