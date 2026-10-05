"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { checkSlugAvailability, createProfile, requestOtp, verifyOtp } from "@/lib/api";
import {
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Sparkles,
  ArrowRight,
  Smartphone,
  Store,
  Palette,
  Check,
} from "lucide-react";

const PRESET_CATEGORIES = [
  "Retail Store & Supermarket",
  "Restaurant, Cafe & Sweets",
  "Printing, Media & Publishing",
  "Tuition, School & Coaching",
  "Clinic, Pharmacy & Healthcare",
  "Automobile & Repair Workshop",
  "Real Estate & Construction",
  "Professional Services & Consulting",
  "Beauty Salon & Spa",
  "Festival & Personal Greeting",
];

const THEME_COLORS = [
  { name: "Slate Navy", value: "#0F172A", border: "border-slate-500" },
  { name: "Odisha Saffron", value: "#EA580C", border: "border-orange-500" },
  { name: "Emerald Forest", value: "#059669", border: "border-emerald-500" },
  { name: "Crimson Rose", value: "#E11D48", border: "border-rose-500" },
  { name: "Royal Purple", value: "#7C3AED", border: "border-purple-500" },
  { name: "Amber Gold", value: "#D97706", border: "border-amber-500" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<"PHONE" | "OTP" | "PROFILE">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Profile fields
  const [slug, setSlug] = useState("");
  const [slugStatus, setSlugStatus] = useState<{ available?: boolean; message?: string } | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("Bhubaneswar");
  const [themeColor, setThemeColor] = useState(THEME_COLORS[1].value); // Default to Odisha Saffron

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      } else {
        setError(res.error?.message || "Failed to dispatch OTP. Please try again.");
      }
    } catch {
      setError("Network error while requesting verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.trim().length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const formatted = phone.trim().startsWith("+91") ? phone.trim() : `+91${phone.trim().replace(/^0+/, "")}`;
      const res = await verifyOtp(formatted, otp.trim());
      if (res.success && res.data) {
        login(res.data);
        setAuthToken(res.data.accessToken);

        if (res.data.hasProfile) {
          router.push("/dashboard");
        } else {
          setStep("PROFILE");
        }
      } else {
        setError(res.error?.message || "Invalid OTP code entered.");
      }
    } catch {
      setError("Error during verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleSlugBlur = async () => {
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    setSlug(cleanSlug);

    if (cleanSlug.length < 3) {
      setSlugStatus({ available: false, message: "Username must be at least 3 characters." });
      return;
    }

    setCheckingSlug(true);
    try {
      const res = await checkSlugAvailability(cleanSlug);
      if (res.success && res.data) {
        setSlugStatus(res.data);
      }
    } catch {
      setSlugStatus(null);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      setError("Session expired. Please restart registration.");
      setStep("PHONE");
      return;
    }

    if (!displayName.trim() || !slug.trim()) {
      setError("Business / Display Name and Vanity URL are required.");
      return;
    }

    if (slugStatus && !slugStatus.available) {
      setError("Please choose an available username slug.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formattedPhone = phone.trim().startsWith("+91") ? phone.trim() : `+91${phone.trim().replace(/^0+/, "")}`;
      const res = await createProfile(authToken, {
        usernameSlug: slug.trim().toLowerCase(),
        displayName: displayName.trim(),
        category,
        tagline: tagline.trim() || undefined,
        bio: bio.trim() || undefined,
        primaryPhone: formattedPhone,
        whatsappNumber: whatsapp.trim() || undefined,
        city: city.trim() || "Bhubaneswar",
        themeColor,
      });

      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error?.message || "Failed to create profile. Please check your inputs.");
      }
    } catch {
      setError("Network error while creating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Information Column (Desktop) */}
        <div className="lg:col-span-5 space-y-6 hidden lg:block pr-4 sticky top-28">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-950/40 text-xs font-semibold text-orange-400">
            <span className="font-serif text-[13px]">ଆମ ଅଂଚଳ ର ପ୍ରଚାର</span>
            <span>•</span>
            <span className="text-slate-300">Claim Phygital Card</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Elevate Your Business Across Odisha.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Create your permanent digital business micro-site, generate high-resolution dynamic QR codes, and connect directly to 50,000+ local consumers in Bhubaneswar.
          </p>

          {/* Stepper overview */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 font-bold text-xs flex-shrink-0">
                1
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Mobile Verification</span>
                <span className="text-[11px] text-slate-400">OTP-backed secure authentication without clunky passwords.</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 font-bold text-xs flex-shrink-0">
                2
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Vanity URL &amp; Profile</span>
                <span className="text-[11px] text-slate-400">Custom link at <code className="text-emerald-400">prachar.in/u/[you]</code> with instant WhatsApp routing.</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 font-bold text-xs flex-shrink-0">
                3
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Dynamic Vector QR</span>
                <span className="text-[11px] text-slate-400">Download high-DPI QR codes ready for store counters, posters &amp; print.</span>
              </div>
            </div>
          </div>

          {/* Trust credentials */}
          <div className="p-4 rounded-2xl border border-slate-800/60 bg-slate-950/60 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="text-[11px] text-slate-400 leading-snug">
              <span className="text-slate-200 font-medium block">Verified Odisha Local Commerce</span>
              PRGI Reg: ORORI/25/A3295 • MSME: UDYAM-OD-04-0039313
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 w-full max-w-xl mx-auto">
          <div className="p-7 sm:p-9 rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] shadow-2xl shadow-orange-950/20 backdrop-blur-xl relative overflow-hidden">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

            {/* Step Counter Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block">
                  {step === "PHONE" && "Step 1 of 3: Mobile Phone"}
                  {step === "OTP" && "Step 2 of 3: Enter Verification Code"}
                  {step === "PROFILE" && "Step 3 of 3: Setup Digital Identity"}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-0.5">
                  {step === "PHONE" && "Claim Phygital Card"}
                  {step === "OTP" && "Verify Your Number"}
                  {step === "PROFILE" && "Configure Your Profile"}
                </h2>
              </div>

              {/* Step indicator badges */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${step === "PHONE" ? "bg-orange-500 ring-4 ring-orange-500/20" : "bg-emerald-500"}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${step === "OTP" ? "bg-orange-500 ring-4 ring-orange-500/20" : step === "PROFILE" ? "bg-emerald-500" : "bg-slate-700"}`} />
                <span className={`w-2.5 h-2.5 rounded-full ${step === "PROFILE" ? "bg-orange-500 ring-4 ring-orange-500/20" : "bg-slate-700"}`} />
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
                <span className="text-base leading-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: PHONE */}
            {step === "PHONE" && (
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label htmlFor="reg-phone-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Indian Mobile Number *
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center gap-1.5 px-3.5 rounded-l-xl border border-r-0 border-slate-700/80 bg-slate-900 text-slate-300 text-xs font-medium">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </span>
                    <input
                      id="reg-phone-input"
                      type="tel"
                      placeholder="91788 98844"
                      value={phone.replace(/^\+91/, "")}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      disabled={loading}
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-r-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-slate-500" />
                    <span>We will send a 6-digit verification code. No spam, guaranteed.</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.replace(/^\+91/, "").length < 10}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm transition shadow-lg shadow-orange-950/50 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </span>
                  ) : (
                    <>
                      <span>Continue with Mobile OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === "OTP" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="reg-otp-input" className="block text-xs font-semibold text-slate-300">
                      6-Digit Verification Code *
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep("PHONE")}
                      className="text-xs text-orange-400 hover:underline font-medium"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    id="reg-otp-input"
                    type="text"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    disabled={loading}
                    autoFocus
                    maxLength={6}
                    className="w-full tracking-widest text-center text-2xl font-bold py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-mono"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-2 text-center">
                    Dispatched to <span className="text-white font-semibold">+91 {phone.replace(/^\+91/, "")}</span>. Valid for 5 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-950/50 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Verifying Code...</span>
                    </span>
                  ) : (
                    <>
                      <span>Verify &amp; Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: PROFILE */}
            {step === "PROFILE" && (
              <form onSubmit={handleCreateProfile} className="space-y-4">
                <div>
                  <label htmlFor="display-name-input" className="block text-xs font-semibold text-slate-300 mb-1">
                    Business / Professional Name *
                  </label>
                  <input
                    id="display-name-input"
                    type="text"
                    placeholder="e.g. Chandan Printers Unit-3"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"));
                      }
                    }}
                    disabled={loading}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label htmlFor="slug-input" className="block text-xs font-semibold text-slate-300 mb-1">
                    Vanity URL Handle *
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-700/80 bg-slate-900 text-slate-400 text-xs font-mono">
                      prachar.in/u/
                    </span>
                    <input
                      id="slug-input"
                      type="text"
                      placeholder="chandan-printers"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        setSlugStatus(null);
                      }}
                      onBlur={handleSlugBlur}
                      disabled={loading}
                      required
                      className="w-full px-3.5 py-2.5 rounded-r-xl bg-slate-950 border border-slate-700/80 text-sm text-white font-mono focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    {checkingSlug && <span className="text-slate-400">Verifying handle availability...</span>}
                    {!checkingSlug && slugStatus && (
                      <span className={slugStatus.available ? "text-emerald-400 font-semibold flex items-center gap-1" : "text-rose-400 font-semibold"}>
                        {slugStatus.available && <Check className="w-3 h-3" />}
                        {slugStatus.message}
                      </span>
                    )}
                    {!checkingSlug && !slugStatus && (
                      <span className="text-slate-500">Lowercase letters, numbers, and hyphens (3-30 chars).</span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="category-select" className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Business Category *
                  </label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tagline-input" className="block text-xs font-semibold text-slate-300 mb-1">
                    Tagline (Optional)
                  </label>
                  <input
                    id="tagline-input"
                    type="text"
                    placeholder="e.g. Quality Offset & Digital Printing in Bhubaneswar"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    disabled={loading}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="whatsapp-input" className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp Routing
                    </label>
                    <input
                      id="whatsapp-input"
                      type="tel"
                      placeholder="9178898844"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      disabled={loading}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="city-input" className="block text-xs font-semibold text-slate-300 mb-1">
                      City / Region
                    </label>
                    <input
                      id="city-input"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={loading}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Card Accent Theme
                  </label>
                  <div className="flex items-center gap-3">
                    {THEME_COLORS.map((tc) => (
                      <button
                        key={tc.value}
                        type="button"
                        onClick={() => setThemeColor(tc.value)}
                        style={{ backgroundColor: tc.value }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          themeColor === tc.value ? "scale-110 shadow-lg ring-2 ring-white/50 border-white" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        title={tc.name}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm transition shadow-lg shadow-orange-950/50 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Generating Card &amp; QR...</span>
                    </span>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Generate Phygital Profile &amp; QR</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Already registered your business?{" "}
                <Link href="/login" className="text-orange-400 font-semibold hover:underline">
                  Sign In to Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
