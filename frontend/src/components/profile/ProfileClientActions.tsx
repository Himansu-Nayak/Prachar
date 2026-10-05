"use client";

import React, { useState, useEffect } from "react";
import { PublicProfile } from "@/types";
import { getQrImageUrl } from "@/lib/api";

interface ProfileClientActionsProps {
  profile: PublicProfile;
}

export default function ProfileClientActions({ profile }: ProfileClientActionsProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowQrModal(false);
      }
    };
    if (showQrModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showQrModal]);

  // Generate vCard RFC 6350 payload on demand
  const handleDownloadVCard = () => {
    const vCardLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.displayName}`,
      `ORG:${profile.businessName || profile.displayName}`,
      `TITLE:${profile.category}`,
      `TEL;TYPE=CELL,VOICE:${profile.primaryPhone}`,
      profile.whatsappNumber ? `TEL;TYPE=WORK,MSG:${profile.whatsappNumber}` : "",
      profile.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : "",
      profile.websiteUrl ? `URL:${profile.websiteUrl}` : "",
      profile.addressText
        ? `ADR;TYPE=WORK:;;${profile.addressText};${profile.city};${profile.district || profile.state || "Odisha"};;India`
        : `ADR;TYPE=WORK:;;;${profile.city};${profile.district || profile.state || "Odisha"};;India`,
      `NOTE:${profile.tagline || profile.bio || "PRACHAR Phygital Business Card"}`,
      "END:VCARD",
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([vCardLines], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.usernameSlug}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} | PRACHAR Phygital Profile`,
          text: `Check out ${profile.displayName}'s verified digital card on PRACHAR:`,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }
    handleCopyLink();
  };

  const handleDownloadQr = () => {
    if (!profile.qrCodeUuid) return;
    const link = document.createElement("a");
    link.href = getQrImageUrl(profile.qrCodeUuid, 600);
    link.download = `prachar-qr-${profile.usernameSlug}.png`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sanitize values
  const cleanPhone = profile.primaryPhone.replace(/[^0-9+]/g, "");
  const cleanWa = (profile.whatsappNumber || profile.primaryPhone).replace(/[^0-9]/g, "");
  const cleanEmail = profile.email ? profile.email.trim().replace(/[^\w.@+-]/g, "") : null;

  return (
    <>
      {/* Primary Action Buttons (Call Now & WhatsApp) */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <a
          href={`tel:${cleanPhone}`}
          className="min-h-[44px] py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs text-center transition shadow-lg shadow-orange-950 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
          aria-label={`Call ${profile.displayName}`}
        >
          <span aria-hidden="true" className="text-sm">📞</span>
          <span>Call Now</span>
        </a>

        <a
          href={`https://wa.me/${cleanWa}?text=${encodeURIComponent("Hello! Found your business profile on PRACHAR Phygital Platform.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          aria-label={`Chat with ${profile.displayName} on WhatsApp`}
        >
          <span aria-hidden="true" className="text-sm">💬</span>
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Secondary Row: Email (if available) & Save Contact */}
      <div className={`grid ${cleanEmail ? "grid-cols-2" : "grid-cols-1"} gap-3 mt-3`}>
        {cleanEmail && (
          <a
            href={`mailto:${cleanEmail}?subject=${encodeURIComponent("Inquiry via PRACHAR Profile")}`}
            className="min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:outline-none"
            aria-label={`Email ${profile.displayName}`}
          >
            <span aria-hidden="true" className="text-sm">✉️</span>
            <span>Send Email</span>
          </a>
        )}

        <button
          type="button"
          onClick={handleDownloadVCard}
          className="min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:outline-none"
          aria-label="Save contact card (vCard)"
        >
          <span aria-hidden="true" className="text-sm">📥</span>
          <span>Save Contact</span>
        </button>
      </div>

      {/* Tertiary Row: QR Code Viewer */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="w-full min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-700/80 bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs font-medium transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:outline-none"
          aria-label="View and scan dynamic QR code"
        >
          <span aria-hidden="true" className="text-sm">📱</span>
          <span>Scan / View Phygital QR</span>
        </button>
      </div>

      {/* Native Web Share & Copy Profile Link */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full min-h-[44px] mt-2 py-2 text-center text-xs font-medium text-slate-400 hover:text-orange-400 transition flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none rounded-lg"
        aria-label="Share this profile"
      >
        <span aria-hidden="true">🔗</span>
        <span>{copiedLink ? "✓ Link Copied to Clipboard!" : "Share Phygital Profile"}</span>
      </button>

      {/* QR Code Modal with Accessible Backdrop */}
      {showQrModal && profile.qrCodeUuid && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`QR Code for ${profile.displayName}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="w-full max-w-xs rounded-3xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-1">
              PRACHAR PHYGITAL QR
            </span>
            <h3 className="text-base font-bold text-white mb-4">{profile.displayName}</h3>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getQrImageUrl(profile.qrCodeUuid, 280)}
                alt={`QR code for ${profile.displayName}`}
                width={200}
                height={200}
                className="w-48 h-48 mx-auto rounded"
              />
            </div>

            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Scan with any mobile camera or Google Lens to connect directly.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-orange-950/50"
              >
                <span>💾</span>
                <span>Download QR Image</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
