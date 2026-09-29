"use client";

import React, { useState } from "react";
import { PublicProfile } from "@/types";
import { getQrImageUrl } from "@/lib/api";

interface ProfileClientActionsProps {
  profile: PublicProfile;
}

export default function ProfileClientActions({ profile }: ProfileClientActionsProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate vCard RFC 6350 payload on demand
  const handleDownloadVCard = () => {
    const vCardLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.displayName}`,
      `ORG:${profile.displayName}`,
      `TITLE:${profile.category}`,
      `TEL;TYPE=CELL,VOICE:${profile.primaryPhone}`,
      profile.whatsappNumber ? `TEL;TYPE=WORK,MSG:${profile.whatsappNumber}` : "",
      profile.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : "",
      profile.websiteUrl ? `URL:${profile.websiteUrl}` : "",
      profile.addressText ? `ADR;TYPE=WORK:;;${profile.addressText};${profile.city};Odisha;751001;India` : `ADR;TYPE=WORK:;;;${profile.city};Odisha;;India`,
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
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} | PRACHAR Phygital Profile`,
          text: `Check out ${profile.displayName}'s verified digital profile on PRACHAR:`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to copy link
      }
    }
    handleCopyLink();
  };

  const handleDownloadQr = () => {
    if (!profile.qrCodeUuid) return;
    const link = document.createElement("a");
    link.href = getQrImageUrl(profile.qrCodeUuid, 500);
    link.download = `prachar-qr-${profile.usernameSlug}.png`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cleanPhone = profile.primaryPhone.replace(/\D/g, "");
  const cleanWa = profile.whatsappNumber ? profile.whatsappNumber.replace(/\D/g, "") : cleanPhone;

  return (
    <>
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <a
          href={`tel:${profile.primaryPhone}`}
          className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs text-center transition shadow-lg shadow-orange-950 flex items-center justify-center gap-2 focus:ring-2 focus:ring-orange-400"
          aria-label={`Call ${profile.displayName}`}
        >
          <span aria-hidden="true">📞</span>
          <span>Call Now</span>
        </a>

        <a
          href={`https://wa.me/${cleanWa}?text=${encodeURIComponent("Hello! Found your business profile on PRACHAR Phygital Platform.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 focus:ring-2 focus:ring-emerald-400"
          aria-label={`Chat with ${profile.displayName} on WhatsApp`}
        >
          <span aria-hidden="true">💬</span>
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button
          type="button"
          onClick={handleDownloadVCard}
          className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-slate-500"
        >
          <span aria-hidden="true">📥</span>
          <span>Save Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-slate-500"
        >
          <span aria-hidden="true">📱</span>
          <span>Scan / View QR</span>
        </button>
      </div>

      {/* Native Web Share & Copy Profile Link */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full mt-3 py-2 text-center text-xs font-medium text-slate-400 hover:text-orange-400 transition flex items-center justify-center gap-1.5"
      >
        <span>🔗</span>
        <span>{copiedLink ? "✓ Link Copied to Clipboard!" : "Share Phygital Profile"}</span>
      </button>

      {/* QR Modal */}
      {showQrModal && profile.qrCodeUuid && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-xs rounded-3xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
              PRACHAR PHYGITAL QR
            </span>
            <h3 className="text-base font-bold text-white mb-4">{profile.displayName}</h3>

            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getQrImageUrl(profile.qrCodeUuid, 260)}
                alt={`QR code for ${profile.displayName}`}
                width={200}
                height={200}
                className="w-48 h-48 mx-auto rounded"
              />
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Scan with any mobile camera or Google Lens to connect directly.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>💾</span>
                <span>Download QR Image</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
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
