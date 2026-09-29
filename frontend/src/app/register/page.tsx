"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { checkSlugAvailability, createProfile, requestOtp, verifyOtp } from "@/lib/api";

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
  { name: "Slate Navy", value: "#0F172A" },
  { name: "Odisha Saffron", value: "#EA580C" },
  { name: "Emerald Forest", value: "#059669" },
  { name: "Crimson Rose", value: "#E11D48" },
  { name: "Royal Purple", value: "#7C3AED" },
  { name: "Amber Gold", value: "#D97706" },
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
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0].value);

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
      setError("Display Name and Username are required.");
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
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Digital Onboarding</span>
        <h1 className="text-2xl font-bold text-white mt-1 mb-2">Claim Your Phygital Card</h1>
        <p className="text-xs text-slate-400 mb-6">
          Set up your verified digital business micro-site paired with a dynamic QR code in Bhubaneswar.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {step === "PHONE" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="reg-phone-input" className="block text-xs font-medium text-slate-300 mb-1">
                Indian Mobile Number
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-800 bg-slate-950 text-slate-400 text-sm">
                  +91
                </span>
                <input
                  id="reg-phone-input"
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
              <p className="text-[11px] text-slate-500 mt-1">We will send a 6-digit OTP code to verify ownership.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition shadow-lg shadow-orange-950 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Proceed to OTP Verification"}
            </button>
          </form>
        )}

        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="reg-otp-input" className="block text-xs font-medium text-slate-300">
                  Verification Code (OTP)
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
                id="reg-otp-input"
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
                Dispatched to +91 {phone.replace(/^\+91/, "")}. Valid for 5 minutes.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg shadow-emerald-950 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Setup Identity"}
            </button>
          </form>
        )}

        {step === "PROFILE" && (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label htmlFor="display-name-input" className="block text-xs font-medium text-slate-300 mb-1">
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
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label htmlFor="slug-input" className="block text-xs font-medium text-slate-300 mb-1">
                Vanity Username URL *
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-800 bg-slate-950 text-slate-400 text-xs">
                  prachar.in/u/
                </span>
                <input
                  id="slug-input"
                  type="text"
                  placeholder="chandan-printers"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugStatus(null);
                  }}
                  onBlur={handleSlugBlur}
                  disabled={loading}
                  required
                  className="w-full px-3 py-2 rounded-r-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                {checkingSlug && <span className="text-slate-400">Checking availability...</span>}
                {!checkingSlug && slugStatus && (
                  <span className={slugStatus.available ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                    {slugStatus.message}
                  </span>
                )}
                {!checkingSlug && !slugStatus && (
                  <span className="text-slate-500">Lowercase letters, numbers, and hyphens (3-30 chars).</span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="category-select" className="block text-xs font-medium text-slate-300 mb-1">
                Primary Category *
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tagline-input" className="block text-xs font-medium text-slate-300 mb-1">
                Tagline (Optional)
              </label>
              <input
                id="tagline-input"
                type="text"
                placeholder="e.g. Quality Offset & Digital Printing in Bhubaneswar"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="whatsapp-input" className="block text-xs font-medium text-slate-300 mb-1">
                  WhatsApp Number
                </label>
                <input
                  id="whatsapp-input"
                  type="tel"
                  placeholder="9178898844"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
              <div>
                <label htmlFor="city-input" className="block text-xs font-medium text-slate-300 mb-1">
                  City / Location
                </label>
                <input
                  id="city-input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Card Theme Accent Color
              </label>
              <div className="flex items-center gap-3">
                {THEME_COLORS.map((tc) => (
                  <button
                    key={tc.value}
                    type="button"
                    onClick={() => setThemeColor(tc.value)}
                    style={{ backgroundColor: tc.value }}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      themeColor === tc.value ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    title={tc.name}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition shadow-lg shadow-orange-950 disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Create Phygital Profile & Generate QR"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
