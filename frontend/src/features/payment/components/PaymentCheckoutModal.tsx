import React from "react";
import { CreatePaymentOrderResponse } from "@/types";
import { CreditCard, X, AlertTriangle, ShieldCheck } from "lucide-react";

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  paymentOrder: CreatePaymentOrderResponse | null;
  verifyingPayment: boolean;
  paymentFeedback: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function PaymentCheckoutModal({
  isOpen,
  paymentOrder,
  verifyingPayment,
  paymentFeedback,
  onConfirm,
  onClose,
}: PaymentCheckoutModalProps) {
  if (!isOpen || !paymentOrder) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Razorpay Secure Checkout</h3>
              <span className="text-[10px] text-slate-400">PRACHAR Phygital Platform Gate</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs mb-5 space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Order ID:</span>
            <span className="text-white font-semibold">{paymentOrder.razorpayOrderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-sans">Package:</span>
            <span className="text-orange-400 font-bold">{paymentOrder.packageCode}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-slate-400 font-sans">Payable Amount:</span>
            <span className="text-emerald-400 font-black text-base">
              ₹{paymentOrder.amount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 font-sans">Currency:</span>
            <span className="text-slate-400">{paymentOrder.currency}</span>
          </div>
        </div>

        {paymentFeedback && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{paymentFeedback}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Standard checkout fallback mode. Verification requests are cryptographically verified by PRACHAR API backend.
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            disabled={verifyingPayment}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
          >
            {verifyingPayment ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Cryptographic Signature...</span>
              </>
            ) : (
              <span>Confirm &amp; Verify Payment (₹{paymentOrder.amount.toLocaleString("en-IN")})</span>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
