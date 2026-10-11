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
import AdminReviewModal from "@/features/admin/components/AdminReviewModal";
import AdminAdQueueTable from "@/features/admin/components/AdminAdQueueTable";

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
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-mono">Verifying administrative credentials...</p>
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
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest font-mono">
            Internal Operations Console
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5 tracking-tight font-display">
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
        <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* KPI Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8 text-center font-mono">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[11px] text-slate-400 block font-medium font-sans">Total Ads</span>
          <span className="text-xl font-bold text-white mt-0.5 block">{summary?.total || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <span className="text-[11px] text-slate-400 block font-medium font-sans">Drafts</span>
          <span className="text-xl font-bold text-slate-300 mt-0.5 block">{summary?.drafts || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-800/80 bg-amber-950/20">
          <span className="text-[11px] text-amber-400 block font-medium font-sans">Submitted</span>
          <span className="text-xl font-bold text-amber-300 mt-0.5 block">{summary?.submitted || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-800/80 bg-amber-950/20">
          <span className="text-[11px] text-amber-400 block font-medium font-sans">Under Review</span>
          <span className="text-xl font-bold text-amber-300 mt-0.5 block">{summary?.underReview || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-blue-800/80 bg-blue-950/20">
          <span className="text-[11px] text-blue-400 block font-medium font-sans">Approved</span>
          <span className="text-xl font-bold text-blue-300 mt-0.5 block">{summary?.approved || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-purple-800/80 bg-purple-950/20">
          <span className="text-[11px] text-purple-400 block font-medium font-sans">Scheduled</span>
          <span className="text-xl font-bold text-purple-300 mt-0.5 block">{summary?.scheduled || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-emerald-800/80 bg-emerald-950/20">
          <span className="text-[11px] text-emerald-400 block font-medium font-sans">Published</span>
          <span className="text-xl font-bold text-emerald-300 mt-0.5 block">{summary?.published || 0}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-orange-800/80 bg-orange-950/20">
          <span className="text-[11px] text-orange-400 block font-medium font-sans">Pay Pending</span>
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
        <AdminAdQueueTable
          advertisements={advertisements}
          loading={loading}
          statusFilter={statusFilter}
          onReviewAction={openReviewModal}
        />
      </div>

      {/* Review Action Modal */}
      <AdminReviewModal
        token={token}
        activeAd={activeAd}
        reviewAction={reviewAction}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        paymentReference={paymentReference}
        setPaymentReference={setPaymentReference}
        isProcessing={isProcessing}
        actionFeedback={actionFeedback}
        onExecute={handleExecuteReview}
        onClose={() => setActiveAd(null)}
      />
    </div>
  );
}
