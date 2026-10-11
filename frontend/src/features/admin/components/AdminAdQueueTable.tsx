import React from "react";
import Link from "next/link";
import { Advertisement, AdminReviewInput } from "@/types";

interface AdminAdQueueTableProps {
  advertisements: Advertisement[];
  loading: boolean;
  statusFilter: string;
  onReviewAction: (ad: Advertisement, action: AdminReviewInput["action"]) => void;
}

export default function AdminAdQueueTable({
  advertisements,
  loading,
  statusFilter,
  onReviewAction,
}: AdminAdQueueTableProps) {
  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-mono">Filtering advertisement entries...</p>
      </div>
    );
  }

  if (advertisements.length === 0) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs">
        <div className="text-3xl mb-2">📋</div>
        <p>No advertisements found matching filter &quot;{statusFilter || "ALL"}&quot;.</p>
      </div>
    );
  }

  return (
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
          {advertisements.map((ad) => (
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
                    ad.status === "PUBLISHED"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : ad.status === "APPROVED"
                      ? "bg-blue-950 text-blue-400 border border-blue-800"
                      : ad.status === "SCHEDULED"
                      ? "bg-purple-950 text-purple-400 border border-purple-800"
                      : ad.status === "SUBMITTED"
                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                      : ad.status === "UNDER_REVIEW"
                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                      : ad.status === "REJECTED"
                      ? "bg-rose-950 text-rose-400 border border-rose-800"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {ad.status.replace(/_/g, " ")}
                </span>
              </td>

              <td className="px-5 py-4 align-top">
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider inline-block ${
                    ad.paymentStatus === "PAYMENT_CONFIRMED"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : ad.paymentStatus === "PAYMENT_PENDING" || ad.paymentStatus === "PAYMENT_INITIATED"
                      ? "bg-orange-950 text-orange-400 border border-orange-800"
                      : ad.paymentStatus === "PAYMENT_REFUNDED"
                      ? "bg-purple-950 text-purple-400 border border-purple-800"
                      : "bg-rose-950 text-rose-400 border border-rose-800"
                  }`}
                >
                  {ad.paymentStatus.replace(/_/g, " ")}
                </span>
                {ad.paymentReference && (
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono truncate max-w-[120px]">
                    Ref: {ad.paymentReference}
                  </span>
                )}
              </td>

              <td className="px-5 py-4 align-top text-right space-y-1.5 whitespace-nowrap">
                {ad.status === "SUBMITTED" && (
                  <button
                    type="button"
                    onClick={() => onReviewAction(ad, "MARK_UNDER_REVIEW")}
                    className="block w-full text-center px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px] transition"
                  >
                    Start Review
                  </button>
                )}
                {(ad.status === "SUBMITTED" || ad.status === "UNDER_REVIEW") && (
                  <>
                    <button
                      type="button"
                      onClick={() => onReviewAction(ad, "APPROVE")}
                      className="block w-full text-center px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onReviewAction(ad, "REJECT")}
                      className="block w-full text-center px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] transition"
                    >
                      Reject
                    </button>
                  </>
                )}
                {ad.status === "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => onReviewAction(ad, "SCHEDULE")}
                    className="block w-full text-center px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px] transition"
                  >
                    Schedule to Press
                  </button>
                )}
                {ad.status === "SCHEDULED" && (
                  <button
                    type="button"
                    onClick={() => onReviewAction(ad, "PUBLISH")}
                    className="block w-full text-center px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition"
                  >
                    Mark Published
                  </button>
                )}
                {(ad.paymentStatus === "PAYMENT_PENDING" || ad.paymentStatus === "PAYMENT_INITIATED") && (
                  <button
                    type="button"
                    onClick={() => onReviewAction(ad, "CONFIRM_PAYMENT")}
                    className="block w-full text-center px-2.5 py-1 rounded border border-emerald-700 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 font-medium text-[11px] transition"
                  >
                    Confirm Pay
                  </button>
                )}
                {ad.paymentStatus === "PAYMENT_CONFIRMED" && ad.status === "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => onReviewAction(ad, "REFUND")}
                    className="block w-full text-center px-2.5 py-1 rounded border border-purple-700 bg-purple-950/60 hover:bg-purple-900 text-purple-300 font-medium text-[11px] transition"
                  >
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
