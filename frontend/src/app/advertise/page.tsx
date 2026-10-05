"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  AdvertisementPackage,
  EditionCutoff,
  MyProfile,
  Advertisement,
} from "@/types";
import {
  fetchAdvertisingPackages,
  fetchAdvertisingCutoff,
  fetchMyProfile,
  createAdvertisement,
  submitAdvertisement,
  uploadAdvertisementCreative,
} from "@/lib/api";
import ReticleBox from "@/components/ui/ReticleBox";
import { UploadCloud, FileText, X, ArrowRight, CheckCircle2 } from "lucide-react";

const FALLBACK_PACKAGES: AdvertisementPackage[] = [
  {
    id: "pkg-p1",
    packageCode: "P1",
    name: "Full Page Premium Cover",
    formatDescription: "180 mm × 250 mm • Back or inside cover placement. Maximum prestige and brand dominance.",
    colorType: "FULL_COLOUR",
    singleEditionPrice: 12000,
    threeEditionPrice: 30000,
    savingsAmount: 6000,
    active: true,
  },
  {
    id: "pkg-p2",
    packageCode: "P2",
    name: "Full Page Standard",
    formatDescription: "180 mm × 250 mm • High-resolution full page for healthcare, real estate, and retail chains.",
    colorType: "FULL_COLOUR",
    singleEditionPrice: 8000,
    threeEditionPrice: 20000,
    savingsAmount: 4000,
    active: true,
  },
  {
    id: "pkg-p3",
    packageCode: "P3",
    name: "Half Page Display",
    formatDescription: "180 mm × 120 mm • The most popular choice for boutiques, jewelry, and restaurants.",
    colorType: "FULL_COLOUR",
    singleEditionPrice: 4500,
    threeEditionPrice: 11500,
    savingsAmount: 2000,
    active: true,
  },
  {
    id: "pkg-p4",
    packageCode: "P4",
    name: "Quarter Page Grid",
    formatDescription: "88 mm × 120 mm • Crisp, focused visibility ideal for clinics, academies, and contractors.",
    colorType: "FULL_COLOUR",
    singleEditionPrice: 2500,
    threeEditionPrice: 6500,
    savingsAmount: 1000,
    active: true,
  },
  {
    id: "pkg-p5",
    packageCode: "P5",
    name: "Business Card Showcase",
    formatDescription: "88 mm × 55 mm • High-density directory slot for local service providers and independent pros.",
    colorType: "FULL_COLOUR",
    singleEditionPrice: 1200,
    threeEditionPrice: 3000,
    savingsAmount: 600,
    active: true,
  },
];

const FALLBACK_CUTOFF: EditionCutoff = {
  currentTargetEdition: "October 2026",
  cutoffDate: "2026-10-18T18:00:00Z",
  cutoffPassed: false,
  nextAvailableEdition: "November 2026",
  message: "Print bookings close on the 18th of every month at 6:00 PM for upcoming edition.",
  threeEditionSchedule: ["October 2026", "November 2026", "December 2026"],
};

export default function AdvertisePage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const isAuthenticated = !!token;

  const [packages, setPackages] = useState<AdvertisementPackage[]>(FALLBACK_PACKAGES);
  const [cutoff, setCutoff] = useState<EditionCutoff | null>(FALLBACK_CUTOFF);
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking Flow State
  const [selectedPackage, setSelectedPackage] = useState<AdvertisementPackage | null>(FALLBACK_PACKAGES[2]); // Default to P3 (Most Popular)
  const [editionCount, setEditionCount] = useState<1 | 3>(1);
  const [bookingStep, setBookingStep] = useState<"SELECT" | "DETAILS" | "CREATIVE" | "CONFIRMATION">("SELECT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdAd, setCreatedAd] = useState<Advertisement | null>(null);

  // Form Fields
  const [headline, setHeadline] = useState("");
  const [adText, setAdText] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [city, setCity] = useState("Bhubaneswar");
  const [linkProfile, setLinkProfile] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    try {
      const [pkgRes, cutoffRes] = await Promise.all([
        fetchAdvertisingPackages(),
        fetchAdvertisingCutoff(),
      ]);

      if (pkgRes.success && pkgRes.data && pkgRes.data.length > 0) {
        setPackages(pkgRes.data);
        if (!selectedPackage) {
          setSelectedPackage(pkgRes.data[0]);
        }
      }

      if (cutoffRes.success && cutoffRes.data) {
        setCutoff(cutoffRes.data);
      }

      if (token) {
        const profRes = await fetchMyProfile(token);
        if (profRes.success && profRes.data) {
          setProfile(profRes.data);
          setBusinessName(profRes.data.businessName || profRes.data.displayName || "");
          setCategory(profRes.data.category || "");
          setContactPhone(profRes.data.primaryPhone || "");
          setContactEmail(profRes.data.email || "");
          setCity(profRes.data.city || "Bhubaneswar");
        }
      }
    } catch {
      // Graceful fallback to authoritative constants
    }
  };

  const calculateCurrentPrice = () => {
    if (!selectedPackage) return 0;
    return editionCount === 1 ? selectedPackage.singleEditionPrice : selectedPackage.threeEditionPrice;
  };

  const handleCreateAndSubmit = async (autoSubmit: boolean) => {
    if (!token) {
      router.push("/login?redirect=/advertise");
      return;
    }

    if (!selectedPackage) {
      setBookingError("Please select an advertising package.");
      return;
    }

    if (!headline.trim()) {
      setBookingError("Headline is required.");
      return;
    }

    if (!contactPhone.trim()) {
      setBookingError("Contact phone number is required.");
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // 1. Create Draft with server-authoritative pricing
      const createRes = await createAdvertisement(token, {
        packageCode: selectedPackage.packageCode,
        editionCount,
        headline: headline.trim(),
        adText: adText.trim() || undefined,
        businessName: businessName.trim() || undefined,
        category: category.trim() || undefined,
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim() || undefined,
        city: city.trim() || "Bhubaneswar",
        profileId: linkProfile && profile ? profile.profileId : undefined,
      });

      if (!createRes.success || !createRes.data) {
        setBookingError(createRes.error?.message || "Failed to initialize advertisement draft.");
        setIsSubmitting(false);
        return;
      }

      let currentAd = createRes.data;

      // 2. Upload Creative if selected
      if (selectedFile) {
        const uploadRes = await uploadAdvertisementCreative(token, currentAd.id, selectedFile);
        if (uploadRes.success && uploadRes.data) {
          currentAd = uploadRes.data;
        } else {
          // Non-fatal, warn user
          console.warn("Creative upload note:", uploadRes.error?.message);
        }
      }

      // 3. Submit for Editorial Review if requested
      if (autoSubmit) {
        const submitRes = await submitAdvertisement(token, currentAd.id);
        if (submitRes.success && submitRes.data) {
          currentAd = submitRes.data;
        } else {
          setBookingError(submitRes.error?.message || "Saved as DRAFT, but automatic submission failed.");
          setCreatedAd(currentAd);
          setBookingStep("CONFIRMATION");
          setIsSubmitting(false);
          return;
        }
      }

      setCreatedAd(currentAd);
      setBookingStep("CONFIRMATION");
    } catch {
      setBookingError("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-[#FFF3EA]">
      {/* Cutoff & Rollover Telemetry Terminal Banner */}
      {cutoff && (
        <div
          className={`mb-10 p-5 border relative overflow-hidden transition-all ${
            cutoff.cutoffPassed
              ? "bg-[#070B14] border-amber-600/60 text-amber-200"
              : "bg-[#070B14] border-[#E4B592]/50 text-[#FFF3EA]"
          }`}
        >
          {/* Corner viewfinder brackets */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#E4B592]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#E4B592]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#E4B592]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#E4B592]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 flex items-center justify-center text-[#E4B592] text-xl shrink-0 mt-0.5">
                {cutoff.cutoffPassed ? "⏳" : "📢"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider px-2 py-0.5 bg-black border border-[#E4B592]/40 text-[#E4B592]">
                    TARGET EDITION: {cutoff.currentTargetEdition.toUpperCase()}
                  </span>
                  {cutoff.cutoffPassed ? (
                    <span className="font-semibold px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800">
                      18TH CUTOFF PASSED // ROLLOVER ACTIVE
                    </span>
                  ) : (
                    <span className="font-semibold px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                      ● CUTOFF ACTIVE // 18TH OF MONTH 18:00 IST
                    </span>
                  )}
                </div>
                <p className="text-xs mt-2 text-slate-300 font-sans">{cutoff.message}</p>
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400 sm:text-right shrink-0">
              <span className="block text-[10px] text-[#E4B592] uppercase tracking-wider">3-Edition Dispatch Series:</span>
              <span className="text-slate-200">{cutoff.threeEditionSchedule.join(" • ")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="reticle-badge mb-3">
            [FLIGHT_DECK // BOOKING_TERMINAL]
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#FFF3EA] tracking-tight mt-2">
            Book Print &amp; Phygital Advertising.
          </h1>
          <p className="text-xs sm:text-sm text-[#DAD0C8] font-mono mt-2 max-w-2xl leading-relaxed">
            Direct 50,000+ Bhubaneswar circulation with permanent dynamic QR telemetry and verified merchant identity.
          </p>
        </div>

        {isAuthenticated && (
          <Link
            href="/dashboard"
            className="reticle-btn-secondary shrink-0"
          >
            <span>VIEW MY CAMPAIGNS</span>
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-950/40 border border-rose-800 text-rose-300 font-mono text-xs">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 border-[#E4B592] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400 font-mono">Loading authoritative PRACHAR rate cards and schedules...</p>
        </div>
      ) : (
        <>
          {/* Interactive Package Cards */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-base sm:text-lg font-bold text-[#FFF3EA] font-mono flex items-center gap-2">
                <span className="text-[#E4B592]">[01]</span> SELECT ADVERTISING TIER (P1–P5)
              </h2>

              {/* Edition Toggle */}
              <div className="bg-[#070B14] border border-[#E4B592]/30 p-1 rounded-sm flex items-center font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setEditionCount(1)}
                  className={`px-3 py-1.5 transition ${
                    editionCount === 1
                      ? "bg-[#E4B592] text-black font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Single Edition (1x)
                </button>
                <button
                  type="button"
                  onClick={() => setEditionCount(3)}
                  className={`px-3 py-1.5 transition flex items-center gap-1.5 ${
                    editionCount === 3
                      ? "bg-[#E4B592] text-black font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  3-Edition Scheme (3x)
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] px-1.5 py-0.5 border border-emerald-700 font-bold">
                    SAVE
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {packages.map((pkg) => {
                const isSelected = selectedPackage?.packageCode === pkg.packageCode;
                const price = editionCount === 1 ? pkg.singleEditionPrice : pkg.threeEditionPrice;
                return (
                  <div
                    key={pkg.packageCode}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      if (bookingStep === "CONFIRMATION") setBookingStep("SELECT");
                    }}
                    className={`cursor-pointer p-5 border transition-all relative flex flex-col justify-between rounded-sm ${
                      isSelected
                        ? "bg-[#070B14] border-[#E4B592] shadow-[0_0_25px_rgba(228,181,146,0.25)] ring-1 ring-[#E4B592]"
                        : "bg-[#050811]/90 border-white/10 hover:border-[#E4B592]/40 hover:bg-[#070B14]"
                    }`}
                  >
                    {/* Viewfinder corner brackets only on the actively selected card */}
                    {isSelected && (
                      <>
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E4B592]" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#E4B592]" />
                        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#E4B592]" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E4B592]" />
                      </>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3 font-mono">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 border ${
                            isSelected
                              ? "bg-[#E4B592] text-black border-[#E4B592]"
                              : "bg-[#E4B592]/10 border-[#E4B592]/30 text-[#E4B592]"
                          }`}
                        >
                          {pkg.packageCode}
                        </span>
                        {pkg.colorType === "FULL_COLOUR" && (
                          <div className="flex items-center gap-1 font-mono text-[8px] font-bold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Cyan" />
                            <span className="w-1.5 h-1.5 rounded-full bg-magenta-400" title="Magenta" />
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" title="Yellow" />
                            <span className="w-1.5 h-1.5 rounded-full bg-black border border-white/40" title="Key/Black" />
                            <span className="ml-1 text-slate-400">CMYK</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-[#FFF3EA] text-sm mb-1 font-mono">{pkg.name}</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 font-sans">
                        {pkg.formatDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 font-mono">
                      <div className="text-xl font-black text-[#FFF3EA]">
                        ₹{price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {editionCount === 1 ? "1 Edition Rate" : "3 Editions Total"}
                      </div>
                      {editionCount === 3 && pkg.savingsAmount > 0 && (
                        <div className="mt-1.5 text-[10px] font-bold text-emerald-400">
                          Save ₹{pkg.savingsAmount.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Booking & Phygital Association Wizard */}
          {bookingStep !== "CONFIRMATION" ? (
            <ReticleBox tag="STEP.02" telemetry="ADVERTISEMENT COMPOSER" className="p-6 md:p-8 mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#E4B592] uppercase tracking-widest block">
                    STEP 02 // SUBMIT INFORMATION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#FFF3EA] mt-1 font-mono">
                    Ad Copy &amp; Merchant Specifications
                  </h2>
                </div>
                {selectedPackage && (
                  <div className="font-mono text-xs sm:text-right p-3 bg-black/60 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase">Active Allocation:</span>
                    <span className="font-bold text-[#FFF3EA]">
                      {selectedPackage.packageCode} ({editionCount === 1 ? "1 Edition" : "3 Editions"}) ={" "}
                      <span className="text-[#E4B592]">₹{calculateCurrentPrice().toLocaleString("en-IN")}</span>
                    </span>
                  </div>
                )}
              </div>

              {bookingError && (
                <div className="mb-6 p-4 bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-xs">
                  ⚠️ {bookingError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-mono">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Ad Headline / Title <span className="text-[#E4B592]">*</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Lingaraj Hardware & Paints — Festive Discount"
                    maxLength={200}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">
                    Clear, compelling title for your print directory entry (Max 200 characters).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Business / Display Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Lingaraj Hardware Pvt Ltd"
                    maxLength={150}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Ad Body Text / Description
                  </label>
                  <textarea
                    rows={3}
                    value={adText}
                    onChange={(e) => setAdText(e.target.value)}
                    placeholder="Describe your services, products, offers, warranties, and special deals for readers..."
                    maxLength={2000}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Contact Phone <span className="text-[#E4B592]">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 99370 12345"
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@business.com"
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Category / Industry
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Retail, Healthcare, Food, Hardware"
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Circulation City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bhubaneswar"
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                  />
                </div>

                {/* Creative Artwork Upload - Studio Dropzone */}
                <div className="md:col-span-2 p-5 bg-[#000000] border border-white/15">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#FFF3EA] font-mono uppercase tracking-wider">
                      Print Artwork / Camera-Ready Creative (Optional)
                    </label>
                    <span className="text-[10px] font-mono text-[#E4B592]">300 DPI CMYK READY</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-4 font-sans leading-relaxed">
                    Supported formats: High-res PDF, PNG, JPEG. Maximum file size: 10MB. If you do not have camera-ready artwork, our editorial graphics studio at BJB Nagar can format it complimentary.
                  </p>

                  {selectedFile ? (
                    <div className="p-4 border border-[#E4B592]/50 bg-[#E4B592]/5 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#E4B592]" />
                        <div>
                          <span className="font-bold text-[#FFF3EA] block">{selectedFile.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • READY FOR EDITORIAL ATTACHMENT
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-white/20 hover:border-[#E4B592]/60 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#070B14]/60 group">
                      <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-[#E4B592] transition-colors mb-2" />
                      <span className="font-mono text-xs text-[#FFF3EA] font-semibold">
                        CLICK TO BROWSE OR DRAG &amp; DROP ARTWORK
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 mt-1">
                        PDF, TIFF, PNG, or JPEG (Max 10MB)
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Phygital Identity Binding Toggle */}
                {profile && (
                  <div className="md:col-span-2 p-4 bg-[#E4B592]/5 border border-[#E4B592]/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#E4B592] block font-mono">
                        [SYNC] BIND PHYGITAL DIGITAL PROFILE &amp; DYNAMIC QR
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 font-sans">
                        Bind this print ad to your public profile (
                        <span className="text-white font-mono">/u/{profile.usernameSlug}</span>) so the printed
                        booklet QR directly resolves to your verified identity.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={linkProfile}
                      onChange={(e) => setLinkProfile(e.target.checked)}
                      className="w-5 h-5 rounded border-white/20 bg-black text-[#E4B592] focus:ring-[#E4B592] cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono">
                <div className="text-xs text-slate-400">
                  <span className="uppercase text-[10px] text-slate-400 block">Total Display Investment:</span>
                  <span className="text-xl font-black text-[#FFF3EA]">
                    ₹{calculateCurrentPrice().toLocaleString("en-IN")}
                  </span>
                  <span className="text-slate-400 text-[10px] ml-2">
                    (Target Edition: {cutoff?.currentTargetEdition || "Upcoming"})
                  </span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {isAuthenticated ? (
                    <>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleCreateAndSubmit(false)}
                        className="reticle-btn-secondary flex-1 sm:flex-none"
                      >
                        {isSubmitting ? "SAVING..." : "SAVE AS DRAFT"}
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleCreateAndSubmit(true)}
                        className="reticle-btn-primary flex-1 sm:flex-none"
                      >
                        {isSubmitting ? "SUBMITTING..." : "SUBMIT FOR EDITORIAL REVIEW"}
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login?redirect=/advertise"
                      className="w-full sm:w-auto px-6 py-3 bg-[#E4B592] hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[0_0_20px_rgba(228,181,146,0.3)] text-center flex items-center justify-center gap-2"
                    >
                      <span>SIGN IN WITH MOBILE OTP TO BOOK</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </ReticleBox>
          ) : (
            /* Confirmation State */
            <ReticleBox tag="MISSION.REGISTERED" telemetry="PAYMENT INITIALIZED" className="p-8 md:p-12 mb-12 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-sm bg-[#E4B592]/10 border border-[#E4B592] text-[#E4B592] text-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(228,181,146,0.3)]">
                ✓
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FFF3EA] mb-2 font-mono">Advertisement Registered!</h2>
              <p className="text-xs text-slate-400 mb-8 font-sans">
                Your placement campaign for <span className="text-[#E4B592] font-semibold">{createdAd?.targetEdition}</span> has been
                successfully saved.
              </p>

              <div className="bg-[#000000] p-5 border border-white/15 text-left text-xs mb-8 space-y-3 font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Campaign ID:</span>
                  <span className="font-mono text-white">{createdAd?.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Package &amp; Edition:</span>
                  <span className="text-white">
                    {createdAd?.packageName} ({createdAd?.editionCount} Edition{createdAd?.editionCount === 3 ? "s" : ""})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Total Display Amount:</span>
                  <span className="text-[#E4B592] font-bold">₹{createdAd?.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Current Lifecycle Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E4B592]/15 text-[#E4B592] border border-[#E4B592]/40">
                    {createdAd?.status}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white border border-white/20">
                    {createdAd?.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="reticle-btn-primary w-full sm:w-auto"
                >
                  <span>PROCEED TO PAY (₹{createdAd?.amount.toLocaleString("en-IN")})</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="reticle-btn-secondary w-full sm:w-auto"
                >
                  <span>TRACK CAMPAIGN</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedAd(null);
                    setHeadline("");
                    setAdText("");
                    setSelectedFile(null);
                    setBookingStep("SELECT");
                  }}
                  className="px-4 py-2.5 font-mono text-xs text-slate-400 hover:text-white transition"
                >
                  Book Another Placement
                </button>
              </div>
            </ReticleBox>
          )}

          {/* Historical Rate Card Table (Strict Phase 0 Preservation) */}
          <ReticleBox tag="ARCHIVE.RATE_CARD" telemetry="PRESERVED HISTORICAL RATES" className="overflow-x-auto p-0 mb-10">
            <div className="p-5 bg-[#000000] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
              <div>
                <h3 className="font-bold text-[#FFF3EA] text-xs uppercase tracking-widest">
                  Official Approved PRACHAR Print Rate Card
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Bhubaneswar Regular Circulation • Preserved Historical Rates
                </p>
              </div>
              <span className="text-xs text-[#E4B592] font-semibold">
                Cutoff: 18th of Every Month // 18:00 IST
              </span>
            </div>
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead className="bg-[#050811] uppercase text-[10px] text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-[#E4B592]">Package</th>
                  <th className="px-6 py-4">Format / Specification</th>
                  <th className="px-6 py-4">1st Edition</th>
                  <th className="px-6 py-4">3-Edition Scheme</th>
                  <th className="px-6 py-4">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {packages.map((pkg) => (
                  <tr key={pkg.packageCode} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#E4B592]">{pkg.packageCode}</td>
                    <td className="px-6 py-4 font-medium text-slate-100">{pkg.name}</td>
                    <td className="px-6 py-4 font-mono">₹{pkg.singleEditionPrice.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-white">
                      ₹{pkg.threeEditionPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-400">
                      Save ₹{pkg.savingsAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReticleBox>

          {/* Legal Disclaimers from BOOK COVER BBSR.docx */}
          <div className="p-6 bg-[#050811] border border-white/10 font-mono text-xs text-slate-400 space-y-2">
            <p className="font-bold text-[#FFF3EA] uppercase tracking-wider">Important Booking &amp; Editorial Guidelines:</p>
            <p>• All advertisements, logos, photos, and materials are submitted by Advertisers on their free will.</p>
            <p>• Display charges payable via digital modes (PhonePe, UPI, Razorpay) and cash.</p>
            <p>• Acceptance of matter is reserved with PRACHAR editorial management. Any dispute subject to Odisha Jurisdiction only.</p>
            <p>• Publication cutoff is strictly the 18th of each month. Submissions received after the 18th will be scheduled for the subsequent monthly edition.</p>
          </div>
        </>
      )}
    </div>
  );
}

