"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Advertisement } from "@/types";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { fetchMerchantCreativeBlob } from "@/lib/api/advertising";
import { useAuth } from "@/lib/AuthContext";

export interface CreativePreviewModalProps {
  isOpen: boolean;
  activeAd: Advertisement | null;
  onClose: () => void;
}

export default function CreativePreviewModal({
  isOpen,
  activeAd,
  onClose,
}: CreativePreviewModalProps) {
  const { token } = useAuth();

  const [creativeBlobUrl, setCreativeBlobUrl] = useState<string | null>(null);
  const [creativeContentType, setCreativeContentType] = useState<string | null>(null);
  const [creativeFilename, setCreativeFilename] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke object URL on cleanup or change
  useEffect(() => {
    return () => {
      if (creativeBlobUrl) {
        URL.revokeObjectURL(creativeBlobUrl);
      }
    };
  }, [creativeBlobUrl]);

  const loadCreative = useCallback(async () => {
    if (!token || !activeAd) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchMerchantCreativeBlob(token, activeAd.id);
      if (res.success && res.blob) {
        if (creativeBlobUrl) {
          URL.revokeObjectURL(creativeBlobUrl);
        }
        const objUrl = URL.createObjectURL(res.blob);
        setCreativeBlobUrl(objUrl);
        setCreativeContentType(res.contentType || activeAd.creativeContentType || "image/png");
        setCreativeFilename(res.filename || activeAd.creativeFilename || `creative-${activeAd.id}`);
      } else {
        setError(res.error?.message || "Failed to retrieve advertisement creative proof from secure storage.");
      }
    } catch {
      setError("Network communication error while fetching creative proof.");
    } finally {
      setIsLoading(false);
    }
  }, [token, activeAd, creativeBlobUrl]);

  // Load creative when modal opens or activeAd changes
  useEffect(() => {
    if (isOpen && activeAd) {
      loadCreative();
    } else {
      if (creativeBlobUrl) {
        URL.revokeObjectURL(creativeBlobUrl);
      }
      setCreativeBlobUrl(null);
      setCreativeContentType(null);
      setCreativeFilename(null);
      setError(null);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeAd?.id]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !activeAd) return null;

  const isPdf =
    creativeContentType === "application/pdf" ||
    activeAd.creativeContentType === "application/pdf" ||
    Boolean(activeAd.creativeFilename && activeAd.creativeFilename.toLowerCase().endsWith(".pdf"));

  const handleDownload = () => {
    if (!creativeBlobUrl || !activeAd) return;
    const a = document.createElement("a");
    a.href = creativeBlobUrl;
    a.download = creativeFilename || activeAd.creativeFilename || `creative-${activeAd.id}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="creative-preview-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 transition-all flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 md:p-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] text-orange-400 font-bold px-2 py-0.5 rounded bg-orange-950/80 border border-orange-800/60">
                {activeAd.packageCode}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                REF #{activeAd.id.substring(0, 8)}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                {activeAd.status}
              </span>
            </div>
            <h3
              id="creative-preview-title"
              className="text-base md:text-lg font-bold text-white leading-tight"
            >
              {activeAd.headline || "Advertisement Creative Proof"}
            </h3>
            {activeAd.businessName && (
              <p className="text-xs text-slate-400">
                {activeAd.businessName} {activeAd.city ? `• ${activeAd.city}` : ""}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition flex-shrink-0"
            aria-label="Close creative proof preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Metadata Bar */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            {isPdf ? (
              <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <ImageIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span className="font-mono text-slate-200 truncate max-w-xs md:max-w-md">
              {creativeFilename || activeAd.creativeFilename || "Artwork File"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 text-[11px] font-mono text-slate-400">
            {activeAd.creativeFileSize && (
              <span>{formatFileSize(activeAd.creativeFileSize)}</span>
            )}
            <span>•</span>
            <span className="uppercase text-[10px] text-slate-400">
              {isPdf ? "PDF" : (creativeContentType || activeAd.creativeContentType || "IMAGE").replace("image/", "")}
            </span>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 bg-slate-950/20">
          {isLoading && (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">
                Streaming secure creative proof from server storage...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs space-y-3 my-4">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-200">Unable to load creative proof</p>
                  <p className="text-rose-300/90 leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={loadCreative}
                className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading Proof</span>
              </button>
            </div>
          )}

          {!isLoading && !error && creativeBlobUrl && (
            <div className="space-y-3">
              {isPdf ? (
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900 shadow-inner">
                  <object
                    data={creativeBlobUrl}
                    type="application/pdf"
                    className="w-full h-96 rounded-xl"
                    aria-label="Creative PDF preview"
                  >
                    <div className="p-8 text-center text-xs text-slate-400 space-y-3">
                      <FileText className="w-10 h-10 text-orange-400 mx-auto opacity-80" />
                      <p className="font-medium text-slate-300">
                        Inline PDF preview is not supported directly by this browser view.
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        Download the full PDF proof to verify layout dimensions, high-resolution vector artwork, and typography.
                      </p>
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition inline-flex items-center gap-2 shadow-lg shadow-orange-950/40"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Full PDF Proof</span>
                      </button>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800/80 overflow-hidden bg-slate-950/90 p-3 text-center shadow-inner flex items-center justify-center min-h-[220px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={creativeBlobUrl}
                    alt={activeAd.headline || "Uploaded creative artwork preview"}
                    className="max-h-96 w-auto max-w-full mx-auto object-contain rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Security Banner */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ephemeral object stream • Zero token leakage • Owner protected</span>
                </span>
                {creativeBlobUrl && (
                  <a
                    href={creativeBlobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in Full Tab</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {activeAd.targetEdition && (
              <span>Target: <strong className="text-white">{activeAd.targetEdition}</strong></span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {creativeBlobUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-orange-950/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Artwork</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
