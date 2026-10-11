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
import EditionCutoffBanner from "@/features/advertising/components/EditionCutoffBanner";
import { UploadCloud, FileText, X, ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

const FALLBACK_PACKAGES: AdvertisementPackage[] = [
  {
    id: "pkg-p1",
    packageCode: "P1",
    name: "B&W Mini-Quarter",
    formatDescription: "Mini-Quarter Page (Black & White) • Cost-effective localized publicity slot for merchants and local services.",
    colorType: "BLACK_AND_WHITE",
    singleEditionPrice: 550,
    threeEditionPrice: 1500,
    savingsAmount: 150,
    active: true,
  },
  {
    id: "pkg-p2",
    packageCode: "P2",
    name: "B&W Quarter",
    formatDescription: "Quarter Page (Black & White) • Compact display with dedicated branding, phone, and dynamic QR placement.",
    colorType: "BLACK_AND_WHITE",
    singleEditionPrice: 1030,
    threeEditionPrice: 3000,
    savingsAmount: 90,
    active: true,
  },
  {
    id: "pkg-p3",
    packageCode: "P3",
    name: "B&W Half Page",
    formatDescription: "Half Page (Black & White) • Balanced editorial canvas for retail, education academies, and clinics.",
    colorType: "BLACK_AND_WHITE",
    singleEditionPrice: 2050,
    threeEditionPrice: 6000,
    savingsAmount: 150,
    active: true,
  },
  {
    id: "pkg-p4",
    packageCode: "P4",
    name: "B&W Full Page",
    formatDescription: "Full Page (Black & White) • Dominant full-page print visibility across 50,000+ doorstep editions.",
    colorType: "BLACK_AND_WHITE",
    singleEditionPrice: 4100,
    threeEditionPrice: 12000,
    savingsAmount: 300,
    active: true,
  },
  {
    id: "pkg-p5",
    packageCode: "P5",
    name: "Colour Full Page",
    formatDescription: "Full Page (Premium Four-Colour) • Maximum prestige full-color artwork placement for major brand campaigns.",
    colorType: "FULL_COLOUR",
    singleEditionPrice: 6000,
    threeEditionPrice: 15000,
    savingsAmount: 3000,
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
    <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDED] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Editorial Cutoff & Dispatch Schedule Banner */}
        <EditionCutoffBanner cutoff={cutoff} className="mb-12 shadow-xl" />

        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono">
                Print &amp; Phygital Booking Desk • Bhubaneswar
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              Monthly Print Directory &amp; <br />
              <span className="text-neutral-500 font-serif italic font-normal">Rate Matrix (P1–P5)</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-400 mt-4 leading-relaxed font-normal">
              Secure prominent placement across 50,000+ monthly copies printed at Chandan Printers (Unit-3) and delivered door-to-door in Bhubaneswar, synchronized with your permanent dynamic QR cloud profile.
            </p>
          </div>

          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm px-6 py-3 transition-all inline-flex items-center gap-2 shrink-0 self-start md:self-end"
            >
              <span>View Active Campaigns</span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 font-mono text-xs">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-[#FFB703] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-400 font-mono">Loading authoritative PRACHAR rate cards and schedules...</p>
          </div>
        ) : (
          <>
            {/* Step 01: Interactive Package Cards */}
            <div className="mb-16">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500 block mb-1">
                    01 • FORMAT SELECTION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Select Advertising Format (P1–P5)
                  </h2>
                </div>

                {/* Edition Toggle */}
                <div className="bg-[#121216] border border-white/10 p-1.5 rounded-full flex items-center font-mono text-xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setEditionCount(1)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      editionCount === 1
                        ? "bg-[#FFB703] text-black font-bold shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Single Edition (1x)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditionCount(3)}
                    className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                      editionCount === 3
                        ? "bg-[#FFB703] text-black font-bold shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <span>3-Edition Scheme (3x)</span>
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-bold">
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
                      className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#16161D] border-[#FFB703] shadow-[0_12px_32px_-8px_rgba(255,183,3,0.2)] ring-1 ring-[#FFB703]"
                          : "bg-[#121216] border-white/10 hover:border-white/20 hover:bg-[#141419]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4 font-mono">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                              isSelected
                                ? "bg-[#FFB703] text-black border-[#FFB703]"
                                : "bg-white/5 border-white/10 text-neutral-300"
                            }`}
                          >
                            {pkg.packageCode}
                          </span>
                          {pkg.colorType === "FULL_COLOUR" && (
                            <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-neutral-400">
                              <span className="w-2 h-2 rounded-full bg-cyan-400" title="Cyan" />
                              <span className="w-2 h-2 rounded-full bg-pink-500" title="Magenta" />
                              <span className="w-2 h-2 rounded-full bg-yellow-400" title="Yellow" />
                              <span className="w-2 h-2 rounded-full bg-black border border-white/30" title="Key/Black" />
                              <span className="ml-1">CMYK</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-white text-base mb-1 font-display">{pkg.name}</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-sans">
                          {pkg.formatDescription}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 font-mono">
                        <div className="text-2xl font-black text-white">
                          ₹{price.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-1">
                          {editionCount === 1 ? "1 Edition Rate" : "3 Editions Total"}
                        </div>
                        {editionCount === 3 && pkg.savingsAmount > 0 && (
                          <div className="mt-2 text-xs font-bold text-emerald-400">
                            Save ₹{pkg.savingsAmount.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 02: Booking Form & Phygital Binding */}
            {bookingStep !== "CONFIRMATION" ? (
              <div className="bg-[#121216] border border-white/10 rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#FFB703] uppercase tracking-widest block mb-1">
                      02 • DETAILS &amp; ARTWORK
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                      Ad Copy &amp; Merchant Specifications
                    </h2>
                  </div>
                  {selectedPackage && (
                    <div className="font-mono text-xs sm:text-right p-4 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-neutral-400 block text-[10px] uppercase">Selected Placement:</span>
                      <span className="font-bold text-white text-sm">
                        {selectedPackage.packageCode} ({editionCount === 1 ? "1 Edition" : "3 Editions"}) ={" "}
                        <span className="text-[#FFB703]">₹{calculateCurrentPrice().toLocaleString("en-IN")}</span>
                      </span>
                    </div>
                  )}
                </div>

                {bookingError && (
                  <div className="mb-6 p-4 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 font-mono text-xs">
                    ⚠️ {bookingError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-sans">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Ad Headline / Title <span className="text-[#FFB703]">*</span>
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Lingaraj Hardware & Paints — Festive Discount"
                      maxLength={200}
                      className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                      Clear title for your print directory entry (Max 200 characters).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Business / Display Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Lingaraj Hardware Pvt Ltd"
                      maxLength={150}
                      className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Ad Body Text / Description
                    </label>
                    <textarea
                      rows={3}
                      value={adText}
                      onChange={(e) => setAdText(e.target.value)}
                      placeholder="Describe your services, products, offers, warranties, and special deals for readers..."
                      maxLength={2000}
                      className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Primary Contact Phone <span className="text-[#FFB703]">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 99370 12345"
                      className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contact@business.com"
                      className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Category / Industry
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Retail, Healthcare, Food, Hardware"
                      className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono">
                      Circulation City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bhubaneswar"
                      className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition"
                    />
                  </div>

                  {/* Creative Artwork Upload - Studio Dropzone */}
                  <div className="md:col-span-2 p-6 rounded-2xl bg-[#0A0A0E] border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                        Print Artwork / Camera-Ready Creative (Optional)
                      </label>
                      <span className="text-[10px] font-mono text-[#FFB703] bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        300 DPI CMYK READY
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4 font-sans leading-relaxed">
                      Supported formats: High-res PDF, PNG, JPEG. Maximum file size: 10MB. If you do not have camera-ready artwork, our editorial graphics studio at BJB Nagar can format it complimentary.
                    </p>

                    {selectedFile ? (
                      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#FFB703]" />
                          <div>
                            <span className="font-bold text-white block">{selectedFile.name}</span>
                            <span className="text-[10px] text-neutral-400">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • READY FOR EDITORIAL ATTACHMENT
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="p-1.5 text-neutral-400 hover:text-rose-400 transition"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-white/15 hover:border-[#FFB703]/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-black/20 group">
                        <UploadCloud className="w-8 h-8 text-neutral-500 group-hover:text-[#FFB703] transition-colors mb-3" />
                        <span className="font-mono text-xs text-white font-semibold">
                          Click to browse or drag &amp; drop artwork
                        </span>
                        <span className="font-mono text-[10px] text-neutral-500 mt-1">
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
                    <div className="md:col-span-2 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-[#FFB703] block font-mono">
                          BIND PHYGITAL DIGITAL PROFILE &amp; DYNAMIC QR
                        </span>
                        <p className="text-xs text-neutral-400 mt-1 font-sans">
                          Bind this print ad to your public profile (
                          <span className="text-white font-mono">/u/{profile.usernameSlug}</span>) so the printed
                          booklet QR directly resolves to your verified identity.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={linkProfile}
                        onChange={(e) => setLinkProfile(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 bg-black text-[#FFB703] focus:ring-[#FFB703] cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono">
                  <div className="text-xs text-neutral-400">
                    <span className="uppercase text-[10px] text-neutral-500 block">Total Display Investment:</span>
                    <span className="text-2xl font-black text-white">
                      ₹{calculateCurrentPrice().toLocaleString("en-IN")}
                    </span>
                    <span className="text-neutral-500 text-[11px] ml-2 font-sans">
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
                          className="flex-1 sm:flex-none rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs px-6 py-3.5 transition-all"
                        >
                          {isSubmitting ? "SAVING..." : "SAVE AS DRAFT"}
                        </button>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleCreateAndSubmit(true)}
                          className="flex-1 sm:flex-none rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-xs px-7 py-3.5 transition-all shadow-lg shadow-amber-500/10"
                        >
                          {isSubmitting ? "SUBMITTING..." : "SUBMIT FOR REVIEW"}
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login?redirect=/advertise"
                        className="w-full sm:w-auto px-7 py-3.5 bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-xs rounded-full transition-all text-center flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>SIGN IN WITH PHONE OTP TO BOOK</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Confirmation State */
              <div className="bg-[#121216] border border-white/10 rounded-3xl p-8 md:p-12 mb-16 text-center max-w-2xl mx-auto shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  ✓
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display">Advertisement Registered!</h2>
                <p className="text-sm text-neutral-400 mb-8 font-sans">
                  Your placement campaign for <span className="text-[#FFB703] font-semibold">{createdAd?.targetEdition}</span> has been
                  successfully initialized.
                </p>

                <div className="bg-[#0A0A0E] p-6 rounded-2xl border border-white/10 text-left text-xs mb-8 space-y-3 font-mono">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Campaign ID:</span>
                    <span className="font-mono text-white">{createdAd?.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Package &amp; Edition:</span>
                    <span className="text-white">
                      {createdAd?.packageName} ({createdAd?.editionCount} Edition{createdAd?.editionCount === 3 ? "s" : ""})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Total Display Amount:</span>
                    <span className="text-[#FFB703] font-bold text-sm">₹{createdAd?.amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-400">Current Lifecycle Status:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFB703]/10 text-[#FFB703] border border-[#FFB703]/30">
                      {createdAd?.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Payment Status:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                      {createdAd?.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-xs px-7 py-3.5 transition-all w-full sm:w-auto"
                  >
                    <span>PROCEED TO PAY (₹{createdAd?.amount.toLocaleString("en-IN")})</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-white/20 hover:border-white/40 bg-white/5 text-white font-medium text-xs px-6 py-3.5 transition-all w-full sm:w-auto"
                  >
                    <span>Track Campaign</span>
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
                    className="px-4 py-2.5 font-mono text-xs text-neutral-400 hover:text-white transition"
                  >
                    Book Another Placement
                  </button>
                </div>
              </div>
            )}

            {/* Approved Official PRACHAR Rate Card Reference Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121216] mb-12 shadow-xl">
              <div className="p-6 bg-[#0E0E12] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider font-display">
                    Official Approved PRACHAR Print Rate Card
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-sans">
                    Bhubaneswar Regular Door-to-Door Circulation • 50,000+ Verified Monthly Copies
                  </p>
                </div>
                <span className="text-xs text-[#FFB703] font-semibold">
                  Press Cutoff: 18th of Every Month at 18:00 IST
                </span>
              </div>
              <table className="w-full text-left font-mono text-xs text-neutral-300">
                <thead className="bg-[#0A0A0E] uppercase text-[10px] text-neutral-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-[#FFB703]">Package</th>
                    <th className="px-6 py-4">Format / Dimensions</th>
                    <th className="px-6 py-4">1st Edition</th>
                    <th className="px-6 py-4">3-Edition Scheme</th>
                    <th className="px-6 py-4">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {packages.map((pkg) => (
                    <tr key={pkg.packageCode} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-[#FFB703]">{pkg.packageCode}</td>
                      <td className="px-6 py-4 font-medium text-white">{pkg.name}</td>
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
            </div>

            {/* Statutory & Editorial Guidelines */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0E0E12] border border-white/10 font-sans text-xs text-neutral-400 space-y-2.5">
              <p className="font-bold text-white uppercase tracking-wider font-mono">
                Important Booking &amp; Editorial Guidelines:
              </p>
              <p>• All advertisements, artwork, and commercial copy are submitted by advertisers on their voluntary accord.</p>
              <p>• Display charges payable via digital modes (UPI, Razorpay, Net Banking) and cash with formal printed receipt.</p>
              <p>• Acceptance of matter is reserved with PRACHAR editorial management. Any dispute subject to Odisha Jurisdiction only.</p>
              <p>• Publication cutoff is strictly the 18th of each month. Submissions received after the cutoff will be scheduled for the subsequent monthly edition.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

