import React, { useState, useEffect } from "react";
import { Advertisement, AdminReviewInput } from "@/types";
import {
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import { fetchAdminCreativeBlob } from "@/lib/api/admin";
import { useAuth } from "@/lib/AuthContext";

interface AdminReviewModalProps {
  token?: string | null;
  activeAd: Advertisement | null;
  reviewAction: AdminReviewInput["action"];
  rejectionReason: string;
  setRejectionReason: (val: string) => void;
  adminNotes: string;
  setAdminNotes: (val: string) => void;
  paymentReference: string;
  setPaymentReference: (val: string) => void;
  isProcessing: boolean;
  actionFeedback: string | null;
  onExecute: () => void;
  onClose: () => void;
}

export default function AdminReviewModal({
  token: propToken,
  activeAd,
  reviewAction,
  rejectionReason,
  setRejectionReason,
  adminNotes,
  setAdminNotes,
  paymentReference,
  setPaymentReference,
  isProcessing,
  actionFeedback,
  onExecute,
  onClose,
}: AdminReviewModalProps) {
  const { token: contextToken } = useAuth();
  const token = propToken || contextToken;

  const [showPreview, setShowPreview] = useState(false);
  const [creativeBlobUrl, setCreativeBlobUrl] = useState<string | null>(null);
  const [creativeContentType, setCreativeContentType] = useState<string | null>(null);
  const [creativeFilename, setCreativeFilename] = useState<string | null>(null);
  const [isLoadingCreative, setIsLoadingCreative] = useState(false);
  const [creativeError, setCreativeError] = useState<string | null>(null);

  // Clean up object URLs on unmount or when blob URL changes
  useEffect(() => {
    return () => {
      if (creativeBlobUrl) {
        URL.revokeObjectURL(creativeBlobUrl);
      }
    };
  }, [creativeBlobUrl]);

  // Reset state on activeAd change
  useEffect(() => {
    setCreativeBlobUrl(null);
    setCreativeContentType(null);
    setCreativeFilename(null);
    setCreativeError(null);
    setIsLoadingCreative(false);
    setShowPreview(false);
  }, [activeAd?.id]);

  const handleFetchCreative = async () => {
    if (!token || !activeAd) return;
    setIsLoadingCreative(true);
    setCreativeError(null);

    try {
      const res = await fetchAdminCreativeBlob(token, activeAd.id);
      if (res.success && res.blob) {
        if (creativeBlobUrl) {
          URL.revokeObjectURL(creativeBlobUrl);
        }
        const objUrl = URL.createObjectURL(res.blob);
        setCreativeBlobUrl(objUrl);
        setCreativeContentType(res.contentType || activeAd.creativeContentType || "image/png");
        setCreativeFilename(res.filename || activeAd.creativeFilename || `creative-${activeAd.id}`);
      } else {
        setCreativeError(res.error?.message || "Failed to retrieve creative artwork from storage.");
      }
    } catch {
      setCreativeError("Network communication error while downloading creative artwork.");
    } finally {
      setIsLoadingCreative(false);
    }
  };

  const togglePreview = () => {
    if (!showPreview) {
      setShowPreview(true);
      if (!creativeBlobUrl) {
        handleFetchCreative();
      }
    } else {
      setShowPreview(false);
    }
  };

  const handleDownload = () => {
    if (!creativeBlobUrl || !activeAd) return;
    const a = document.createElement("a");
    a.href = creativeBlobUrl;
    a.download = creativeFilename || activeAd.creativeFilename || `creative-${activeAd.id}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!activeAd) return null;

  const isPdf =
    creativeContentType === "application/pdf" ||
    activeAd.creativeContentType === "application/pdf" ||
    Boolean(activeAd.creativeFilename && activeAd.creativeFilename.toLowerCase().endsWith(".pdf"));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 w-full shadow-2xl transition-all my-8 ${
          showPreview ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest font-mono">
              Editorial Decision
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Action: {reviewAction.replace(/_/g, " ")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review dialog"
            className="text-slate-400 hover:text-white p-1 transition rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs mb-4 space-y-1">
          <p className="text-white font-semibold">{activeAd.headline}</p>
          <p className="text-slate-400">
            Package: <span className="text-orange-400 font-semibold">{activeAd.packageCode}</span> • Target:{" "}
            <span className="text-white font-medium">{activeAd.targetEdition}</span> • Display Fee:{" "}
            <span className="text-white font-bold">₹{activeAd.amount.toLocaleString("en-IN")}</span>
          </p>
          <p className="text-slate-500 font-mono">
            Contact: {activeAd.contactPhone} ({activeAd.city})
          </p>
        </div>

        {/* Uploaded Creative Artwork Inspection Section */}
        <div className="mb-4">
          {!activeAd.hasCreative ? (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>No creative artwork file uploaded for this campaign. (Merchant opted for text copy or physical proof).</span>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-3 flex items-center justify-between gap-3 border-b border-slate-800/60 bg-slate-900/40">
                <div className="flex items-center gap-2 min-w-0">
                  {isPdf ? (
                    <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  <div className="truncate">
                    <span className="text-xs font-semibold text-white block truncate">
                      {activeAd.creativeFilename || "creative_artwork"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(Number(activeAd.creativeFileSize || 0) / 1024).toFixed(0)} KB •{" "}
                      {activeAd.creativeContentType || (isPdf ? "application/pdf" : "image")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                    aria-label={showPreview ? "Hide creative preview" : "View uploaded creative preview"}
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Preview</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>View Uploaded Creative</span>
                      </>
                    )}
                  </button>
                  {creativeBlobUrl && (
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Download creative artwork file"
                      aria-label="Download creative file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Preview Container */}
              {showPreview && (
                <div className="p-3 bg-black/40">
                  {isLoadingCreative && (
                    <div className="py-12 text-center">
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-[11px] text-slate-400 font-mono">
                        Retrieving secure binary stream from storage...
                      </p>
                    </div>
                  )}

                  {creativeError && (
                    <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{creativeError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleFetchCreative}
                        className="px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-white text-[10px] font-semibold flex items-center gap-1 transition"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry Download</span>
                      </button>
                    </div>
                  )}

                  {!isLoadingCreative && !creativeError && creativeBlobUrl && (
                    <div className="space-y-2">
                      {isPdf ? (
                        <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900">
                          <object
                            data={creativeBlobUrl}
                            type="application/pdf"
                            className="w-full h-80 rounded-lg"
                            aria-label="Creative PDF preview"
                          >
                            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                              <p>Inline PDF preview is not rendered directly in this browser frame.</p>
                              <button
                                type="button"
                                onClick={handleDownload}
                                className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition inline-flex items-center gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download PDF for Full Editorial Proofing</span>
                              </button>
                            </div>
                          </object>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950 p-2 text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={creativeBlobUrl}
                            alt={activeAd.headline || "Uploaded creative preview"}
                            className="max-h-80 w-auto mx-auto object-contain rounded"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>Secured with ephemeral blob stream (zero client credential leak)</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={creativeBlobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open Full View</span>
                          </a>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={handleDownload}
                            className="text-slate-400 hover:text-white underline flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download Artwork</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {actionFeedback && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Rejection Form Field */}
        {reviewAction === "REJECT" && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-rose-300 mb-1.5">
              Rejection Reason (Mandatory) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this advertisement was rejected (e.g. invalid phone number, artwork low resolution, inappropriate copy, missing shop establishment registration)..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              This exact explanation is shown to the merchant so they can correct and resubmit their advertisement.
            </p>
          </div>
        )}

        {/* Payment Reference Field */}
        {reviewAction === "CONFIRM_PAYMENT" && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
              Payment Reference / Transaction ID
            </label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="e.g. UPI-2026-BBSR-9988 or Bank Ref"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Refund Confirmation Banner */}
        {reviewAction === "REFUND" && (
          <div className="mb-4 p-3 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-300 text-xs leading-relaxed">
            ⚠️ You are issuing a full refund of <strong>₹{activeAd.amount.toLocaleString("en-IN")}</strong> for this advertisement campaign. Please provide refund notes below.
          </div>
        )}

        {/* Admin Notes Field */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Staff / Internal Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal verification notes (e.g. verified phone by call, artwork proof approved by editorial desk)..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onExecute}
            className={`px-5 py-2 rounded-lg text-xs font-semibold text-white transition disabled:opacity-50 ${
              reviewAction === "REJECT"
                ? "bg-rose-600 hover:bg-rose-500"
                : reviewAction === "APPROVE"
                ? "bg-blue-600 hover:bg-blue-500"
                : reviewAction === "SCHEDULE"
                ? "bg-purple-600 hover:bg-purple-500"
                : reviewAction === "CONFIRM_PAYMENT"
                ? "bg-emerald-600 hover:bg-emerald-500"
                : reviewAction === "REFUND"
                ? "bg-purple-600 hover:bg-purple-500"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
          >
            {isProcessing ? "Processing..." : `Confirm ${reviewAction.replace(/_/g, " ")}`}
          </button>
        </div>
      </div>
    </div>
  );
}
