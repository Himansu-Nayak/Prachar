"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { requestOtp, verifyOtp } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    try {
      const formatted = cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone.replace(/^0+/, "")}`;
      const res = await requestOtp(formatted);
      if (res.success) {
        setStep("OTP");
        setSuccessMsg("Verification OTP dispatched. Please enter the 6-digit code.");
      } else {
        setError(res.error?.message || "Failed to dispatch OTP. Please try again.");
      }
    } catch {
      setError("Network error while contacting authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const formatted = phone.trim().startsWith("+91") ? phone.trim() : `+91${phone.trim().replace(/^0+/, "")}`;
      const res = await verifyOtp(formatted, cleanOtp);
      if (res.success && res.data) {
        login(res.data);
        if (res.data.hasProfile) {
          router.push("/dashboard");
        } else {
          router.push("/dashboard?onboarding=true");
        }
      } else {
        setError(res.error?.message || "Invalid or expired OTP code.");
      }
    } catch {
      setError("Error during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Account Access</span>
        <h1 className="text-2xl font-bold text-white mt-1 mb-2">Sign in to PRACHAR</h1>
        <p className="text-xs text-slate-400 mb-6">
          Access your digital identity card, live dynamic QR telemetry, and profile settings.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {step === "PHONE" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="phone-input" className="block text-xs font-medium text-slate-300 mb-1">
                Indian Mobile Number
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-800 bg-slate-950 text-slate-400 text-sm">
                  +91
                </span>
                <input
                  id="phone-input"
                  type="tel"
                  placeholder="91788 98844"
                  value={phone.replace(/^\+91/, "")}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  maxLength={10}
                  className="w-full px-3 py-2.5 rounded-r-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">We will transmit a 6-digit verification code via OTP.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition shadow-lg shadow-orange-950 disabled:opacity-50"
            >
              {loading ? "Dispatching OTP..." : "Send Verification OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="otp-input" className="block text-xs font-medium text-slate-300">
                  Enter 6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep("PHONE")}
                  className="text-[11px] text-orange-400 hover:underline"
                >
                  Change Number
                </button>
              </div>
              <input
                id="otp-input"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={loading}
                autoFocus
                className="w-full tracking-widest text-center text-xl font-bold py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-700 focus:outline-none focus:border-orange-500 transition"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                Dispatched to mobile +91 {phone.replace(/^\+91/, "")}. Valid for 5 minutes.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg shadow-emerald-950 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition"
            >
              Didn&apos;t receive code? Resend OTP
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don&apos;t have a profile yet?{" "}
            <Link href="/register" className="text-orange-400 font-medium hover:underline">
              Create your phygital card
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
