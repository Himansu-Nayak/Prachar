import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchPublicQrResolution } from "@/lib/api";

interface QrRouteProps {
  params: {
    uuid: string;
  };
}

export const metadata: Metadata = {
  title: "Redirecting to Phygital Profile | PRACHAR",
  description: "Resolving permanent dynamic QR matrix to verified PRACHAR merchant profile.",
  robots: { index: false, follow: false },
};

export default async function QrResolutionPage({ params }: QrRouteProps) {
  const { uuid } = params;

  if (!uuid || uuid.trim() === "") {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-md text-center p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Invalid QR Identifier</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            No QR code identifier was provided in the URL. Please scan the QR code again using your mobile camera or Google Lens.
          </p>
          <Link
            href="/"
            className="inline-block py-2.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs text-white font-semibold transition shadow-lg shadow-orange-950/50"
          >
            Go to PRACHAR Home →
          </Link>
        </div>
      </div>
    );
  }

  const res = await fetchPublicQrResolution(uuid);

  if (res.success && res.data) {
    const { targetUrl, usernameSlug } = res.data;
    const destination = usernameSlug ? `/u/${usernameSlug}` : targetUrl;

    // Safety guard: only allow redirection to internal profile paths
    if (destination && destination.startsWith("/u/")) {
      redirect(destination);
    }
  }

  // Handle specific error states
  const errorCode = res.error?.code;
  const isNotFound = errorCode === "NOT_FOUND";
  const isInactive = errorCode === "INVALID_STATE";

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md text-center p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mx-auto mb-4">
          {isNotFound ? "❓" : isInactive ? "⏸️" : "⚠️"}
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-orange-950/60 border border-orange-800/60 text-orange-400 text-[11px] font-semibold mb-3">
          PRACHAR PHYGITAL QR
        </div>

        <h1 className="text-xl font-bold text-white mb-2">
          {isNotFound
            ? "QR Code Not Found"
            : isInactive
            ? "QR Code Inactive"
            : "Unable to Resolve QR"}
        </h1>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {isNotFound
            ? "This QR code is not recognized by the PRACHAR network. It may have expired, or the printed code may have been altered."
            : isInactive
            ? "This phygital presence is temporarily paused or undergoing an administrative update by the business owner."
            : res.error?.message || "A network communication error occurred while resolving this QR code. Please try again."}
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs text-white font-semibold transition shadow-lg shadow-orange-950/50"
          >
            Explore PRACHAR Platform →
          </Link>
          <Link
            href="/contact"
            className="block w-full py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition border border-slate-700"
          >
            Report an Issue / Support
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-[10px] text-slate-500">
          <p>Verified Phygital Identity Network • Odisha</p>
        </div>
      </div>
    </div>
  );
}
