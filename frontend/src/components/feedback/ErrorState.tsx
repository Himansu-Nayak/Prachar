import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Error Encountered",
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-rose-200 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-900/40 text-rose-400 flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
          <p className="text-xs text-rose-300 leading-relaxed break-words">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-white transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Operation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
