"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error securely without leaking PII
    console.error("Client Error Boundary captured error:", error.message);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-400 mb-6 max-w-md">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition"
      >
        Try Again
      </button>
    </div>
  );
}
