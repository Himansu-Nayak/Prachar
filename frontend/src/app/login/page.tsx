"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { requestOtp, verifyOtp } from "@/lib/api";
import { CheckCircle2, ShieldCheck, Printer, ArrowRight, Sparkles } from "lucide-react";

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
        const onboardingStatus = res.data.onboardingStatus;
        if (onboardingStatus === "COMPLETED" || res.data.hasProfile) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Information Column (Desktop) */}
        <div className="lg:col-span-6 space-y-6 hidden lg:block pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-950/40 text-xs font-semibold text-orange-400">
            <span className="font-serif text-[13px]">ଆମ ଅଂଚଳ ର ପ୍ରଚାର</span>
            <span>•</span>
            <span className="text-slate-300">Bhubaneswar Phygital Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Manage Your Phygital Cards &amp; Print Bookings.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Sign in to access your live dynamic QR telemetry, update your digital profile vanity link, and track your advertisement placement in the Bhubaneswar monthly edition.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50">
              <div className="w-8 h-8 rounded-lg bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 flex-shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">50,000+ Print Circulation</span>
                <span className="text-[11px] text-slate-400">Door-to-door distribution printed at Chandan Printers, Unit-3</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Live Dynamic QR Telemetry</span>
                <span className="text-[11px] text-slate-400">Track consumer scans and route calls directly to WhatsApp</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50">
              <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Official Registrations</span>
                <span className="text-[11px] text-slate-400 font-mono">PRGI: ORORI/25/A3295 • MSME: UDYAM-OD-04-0039313</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="p-7 sm:p-9 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] shadow-2xl shadow-orange-950/20 backdrop-blur-xl">
            <div className="mb-6">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">
                Merchant Sign In
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Access PRACHAR Console
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Passwordless authentication via 6-digit SMS verification code.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
                <span className="text-sm">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2.5">
                <span className="text-sm">✓</span>
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {step === "PHONE" ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label htmlFor="phone-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Indian Mobile Number
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-700 bg-slate-950 text-slate-300 text-sm font-semibold">
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
                      autoFocus
                      className="w-full px-3.5 py-3 rounded-r-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition font-medium"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    We will send a 6-digit OTP code to this mobile number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition shadow-lg shadow-orange-600/30 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>{loading ? "Dispatching OTP..." : "Send Verification OTP"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="otp-input" className="block text-xs font-semibold text-slate-300">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep("PHONE")}
                      className="text-[11px] text-orange-400 hover:underline font-medium"
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
                    className="w-full tracking-[0.35em] text-center text-2xl font-black py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-700 focus:outline-none focus:border-orange-500 transition"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-2 text-center">
                    Dispatched to <span className="text-white font-semibold">+91 {phone.replace(/^\+91/, "")}</span>. Valid for 5 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-950 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? "Verifying Credentials..." : "Verify & Sign In"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition text-center"
                >
                  Didn&apos;t receive code? Resend OTP
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                New to PRACHAR?{" "}
                <Link href="/register" className="text-orange-400 font-semibold hover:underline">
                  Claim your free digital card &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
