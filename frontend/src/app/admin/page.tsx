"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Advertisement, AdvertisementSummary, AdminReviewInput } from "@/types";
import {
  fetchAdminAdvertisements,
  fetchAdminAdvertisementSummary,
  reviewAdvertisement,
} from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [summary, setSummary] = useState<AdvertisementSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review Modal State
  const [activeAd, setActiveAd] = useState<Advertisement | null>(null);
  const [reviewAction, setReviewAction] = useState<AdminReviewInput["action"]>("APPROVE");
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login?redirect=/admin");
      return;
    }

    if (token) {
      loadData(token, statusFilter);
    }
  }, [token, authLoading, statusFilter, router]);

  const loadData = async (authToken: string, filter: string) => {
    setLoading(true);
    setError(null);
    try {
      const [adsRes, summaryRes] = await Promise.all([
        fetchAdminAdvertisements(authToken, filter || undefined),
        fetchAdminAdvertisementSummary(authToken),
      ]);

      if (adsRes.success && adsRes.data) {
        setAdvertisements(adsRes.data);
      } else {
        setError(adsRes.error?.message || "Failed to load administrative advertisement queue.");
      }

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch {
      setError("Network communication failure while contacting admin console.");
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (ad: Advertisement, defaultAction: AdminReviewInput["action"]) => {
    setActiveAd(ad);
    setReviewAction(defaultAction);
    setRejectionReason(ad.rejectionReason || "");
    setAdminNotes(ad.adminNotes || "");
    setPaymentReference(ad.paymentReference || "");
    setActionFeedback(null);
  };

  const handleExecuteReview = async () => {
    if (!token || !activeAd) return;

    if (reviewAction === "REJECT" && !rejectionReason.trim()) {
      setActionFeedback("A rejection reason is strictly mandatory so the advertiser knows how to correct their matter.");
      return;
    }

    setIsProcessing(true);
    setActionFeedback(null);

    try {
      const res = await reviewAdvertisement(token, activeAd.id, {
        action: reviewAction,
        rejectionReason: rejectionReason.trim() || undefined,
        adminNotes: adminNotes.trim() || undefined,
        paymentReference: paymentReference.trim() || undefined,
      });

      if (res.success && res.data) {
        setActiveAd(null);
        await loadData(token, statusFilter);
      } else {
        setActionFeedback(res.error?.message || "Failed to execute review action.");
      }
    } catch {
      setActionFeedback("Network error while submitting administrative review.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isAdminOrStaff = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_STAFF";

  if (authLoading || (loading && !summary)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400">Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!isAdminOrStaff) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 text-2xl flex items-center justify-center mx-auto mb-4">
          ⛔
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          The PRACHAR Editorial &amp; Review Console is restricted to editorial staff and system administrators.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition"
        >
          Return to Merchant Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            Internal Operations Console
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5 tracking-tight">
            PRACHAR Editorial Review &amp; Print Scheduling
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bhubaneswar Regional Print Directory • Cutoff: 18th of Every Month • Chandan Printers Press Sync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => token && loadData(token, statusFilter)}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition flex items-center gap-1.5"
          >
            <span>🔄</span> Refresh Queue
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* KPI Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8 text-center">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[11px] text-slate-400 block font-medium">Total Ads</span>
          <span className="text-xl font-bold text-white mt-0.5 block">{summary?.total || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[11px] text-slate-400 block font-medium">Drafts</span>
          <span className="text-xl font-bold text-slate-300 mt-0.5 block">{summary?.drafts || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-800/80 bg-amber-950/20">
          <span className="text-[11px] text-amber-400 block font-medium">Submitted</span>
          <span className="text-xl font-bold text-amber-300 mt-0.5 block">{summary?.submitted || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-800/80 bg-amber-950/20">
          <span className="text-[11px] text-amber-400 block font-medium">Under Review</span>
          <span className="text-xl font-bold text-amber-300 mt-0.5 block">{summary?.underReview || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-blue-800/80 bg-blue-950/20">
          <span className="text-[11px] text-blue-400 block font-medium">Approved</span>
          <span className="text-xl font-bold text-blue-300 mt-0.5 block">{summary?.approved || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-purple-800/80 bg-purple-950/20">
          <span className="text-[11px] text-purple-400 block font-medium">Scheduled</span>
          <span className="text-xl font-bold text-purple-300 mt-0.5 block">{summary?.scheduled || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-emerald-800/80 bg-emerald-950/20">
          <span className="text-[11px] text-emerald-400 block font-medium">Published</span>
          <span className="text-xl font-bold text-emerald-300 mt-0.5 block">{summary?.published || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-orange-800/80 bg-orange-950/20">
          <span className="text-[11px] text-orange-400 block font-medium">Pay Pending</span>
          <span className="text-xl font-bold text-orange-300 mt-0.5 block">{summary?.paymentPending || 0}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 max-w-full overflow-x-auto text-xs">
        {[
          { label: "All Items", value: "" },
          { label: "Submitted", value: "SUBMITTED" },
          { label: "Under Review", value: "UNDER_REVIEW" },
          { label: "Approved", value: "APPROVED" },
          { label: "Scheduled", value: "SCHEDULED" },
          { label: "Published", value: "PUBLISHED" },
          { label: "Completed", value: "COMPLETED" },
          { label: "Rejected", value: "REJECTED" },
          { label: "Drafts", value: "DRAFT" },
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              statusFilter === f.value
                ? "bg-orange-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Editorial Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Filtering advertisement entries...</p>
          </div>
        ) : advertisements.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <div className="text-3xl mb-2">📋</div>
            <p>No advertisements found matching filter &quot;{statusFilter || "ALL"}&quot;.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Ref ID / User</th>
                  <th className="px-5 py-3.5">Package &amp; Copy</th>
                  <th className="px-5 py-3.5">Target Edition</th>
                  <th className="px-5 py-3.5">Display Fee</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5 text-right">Editorial Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {advertisements.map((ad) => {
                  return (
                    <tr key={ad.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-4 align-top">
                        <span className="font-mono text-[11px] text-slate-400 block font-semibold">
                          #{ad.id.substring(0, 8)}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          UID: {ad.userId.substring(0, 8)}
                        </span>
                        <span className="text-[11px] text-slate-300 block mt-1 font-mono">
                          {ad.contactPhone}
                        </span>
                        {ad.contactEmail && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                            {ad.contactEmail}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 align-top max-w-sm">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-bold text-orange-400 px-1.5 py-0.5 rounded bg-orange-950/80 border border-orange-800 text-[10px]">
                            {ad.packageCode}
                          </span>
                          <span className="text-white font-medium">{ad.packageName}</span>
                          <span className="text-[10px] text-slate-400">
                            ({ad.editionCount === 1 ? "1x" : "3x Series"})
                          </span>
                        </div>
                        <span className="font-semibold text-white block">{ad.headline}</span>
                        {ad.adText && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {ad.adText}
                          </p>
                        )}
                        {ad.usernameSlug && (
                          <Link
                            href={`/u/${ad.usernameSlug}`}
                            target="_blank"
                            className="text-[10px] text-orange-400 hover:underline block mt-1"
                          >
                            🔗 Bound Profile: /u/{ad.usernameSlug}
                          </Link>
                        )}
                        {ad.hasCreative && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-mono">
                            📎 {ad.creativeFilename} ({(Number(ad.creativeFileSize || 0) / 1024).toFixed(0)} KB)
                          </span>
                        )}
                        {ad.rejectionReason && (
                          <div className="mt-2 p-2 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px]">
                            <strong className="block text-rose-200">Rejection Notice:</strong>
                            {ad.rejectionReason}
                          </div>
                        )}
                        {ad.adminNotes && (
                          <div className="mt-1.5 text-[10px] text-slate-400 italic">
                            Staff Note: {ad.adminNotes}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span className="font-medium text-white block">{ad.targetEdition}</span>
                        {ad.cutoffPassed && (
                          <span className="text-[10px] text-amber-400 block mt-0.5">
                            (18th Rollover)
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 block mt-1">
                          City: {ad.city}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span className="font-bold text-white text-sm block">
                          ₹{ad.amount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-500">{ad.currency}</span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider inline-block ${
                            ad.status === "APPROVED"
                              ? "bg-blue-950 text-blue-300 border border-blue-800"
                              : ad.status === "SCHEDULED"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : ad.status === "PUBLISHED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : ad.status === "REJECTED"
                              ? "bg-rose-950 text-rose-300 border border-rose-800"
                              : ad.status === "SUBMITTED" || ad.status === "UNDER_REVIEW"
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {ad.status}
                        </span>
                        {ad.submittedAt && (
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Sub: {new Date(ad.submittedAt).toLocaleDateString()}
                          </span>
                        )}
                        {ad.reviewedAt && (
                          <span className="text-[10px] text-slate-500 block">
                            Rev: {new Date(ad.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase tracking-wider inline-block ${
                            ad.paymentStatus === "PAYMENT_CONFIRMED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : ad.paymentStatus === "PAYMENT_INITIATED"
                              ? "bg-sky-950 text-sky-300 border border-sky-800"
                              : ad.paymentStatus === "PAYMENT_FAILED"
                              ? "bg-rose-950 text-rose-300 border border-rose-800"
                              : ad.paymentStatus === "PAYMENT_REFUNDED"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : "bg-amber-950 text-amber-300 border border-amber-800"
                          }`}
                        >
                          {ad.paymentStatus}
                        </span>
                        {ad.paymentReference && (
                          <span className="font-mono text-[9px] text-slate-400 block mt-1 truncate max-w-[100px]">
                            Ref: {ad.paymentReference}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 align-top text-right space-y-1.5">
                        {/* Status Transition Triggers */}
                        {(ad.status === "SUBMITTED" || ad.status === "UNDER_REVIEW") && (
                          <>
                            <button
                              type="button"
                              onClick={() => openReviewModal(ad, "APPROVE")}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition block ml-auto"
                            >
                              Approve Ad
                            </button>
                            <button
                              type="button"
                              onClick={() => openReviewModal(ad, "REJECT")}
                              className="px-2.5 py-1 rounded border border-rose-800 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10px] transition block ml-auto"
                            >
                              Reject Matter
                            </button>
                          </>
                        )}

                        {ad.status === "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => openReviewModal(ad, "SCHEDULE")}
                            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition block ml-auto"
                          >
                            Schedule Print
                          </button>
                        )}

                        {ad.status === "SCHEDULED" && (
                          <button
                            type="button"
                            onClick={() => openReviewModal(ad, "PUBLISH")}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition block ml-auto"
                          >
                            Mark Published
                          </button>
                        )}

                        {ad.status === "PUBLISHED" && (
                          <button
                            type="button"
                            onClick={() => openReviewModal(ad, "COMPLETE")}
                            className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold transition block ml-auto"
                          >
                            Complete
                          </button>
                        )}

                        {/* Payment Verification Trigger */}
                        {ad.paymentStatus === "PAYMENT_PENDING" && (
                          <button
                            type="button"
                            onClick={() => openReviewModal(ad, "CONFIRM_PAYMENT")}
                            className="px-2.5 py-1 rounded border border-emerald-800 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-[10px] font-semibold transition block ml-auto"
                          >
                            Confirm Pay
                          </button>
                        )}

                        {/* Admin Refund Trigger */}
                        {ad.paymentStatus === "PAYMENT_CONFIRMED" && (
                          <button
                            type="button"
                            onClick={() => openReviewModal(ad, "REFUND")}
                            className="px-2 py-0.5 rounded border border-purple-900/60 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 text-[10px] font-semibold transition block ml-auto"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Action Modal */}
      {activeAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  Editorial Decision
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Action: {reviewAction.replace("_", " ")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveAd(null)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs mb-4 space-y-1">
              <p className="text-white font-semibold">{activeAd.headline}</p>
              <p className="text-slate-400">
                Package: <span className="text-orange-400">{activeAd.packageCode}</span> • Target:{" "}
                <span className="text-white">{activeAd.targetEdition}</span> • Display Fee:{" "}
                <span className="text-white font-bold">₹{activeAd.amount.toLocaleString("en-IN")}</span>
              </p>
              <p className="text-slate-500">Contact: {activeAd.contactPhone} ({activeAd.city})</p>
            </div>

            {actionFeedback && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                ⚠️ {actionFeedback}
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
                  placeholder="Explain why this advertisement was rejected (e.g. invalid phone number, copyright issue, inappropriate content, missing registration details)..."
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
                placeholder="Internal verification notes (e.g. verified phone by call, artwork sent to Chandan Printers, etc.)..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveAd(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecuteReview}
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
                {isProcessing ? "Processing..." : `Confirm ${reviewAction}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
