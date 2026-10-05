"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  MyProfile,
  QRAnalytics,
  UpdateProfileInput,
  ProfileStatus,
  CardStatus,
  QRStatus,
  Advertisement,
  AdvertisementSummary,
  CreatePaymentOrderResponse,
} from "@/types";
import {
  fetchMyProfile,
  fetchQrAnalytics,
  getQrImageUrl,
  getQrRedirectUrl,
  updateProfile,
  updateProfileStatus,
  updateCardStatus,
  updateQrStatus,
  fetchMyAdvertisements,
  fetchMyAdvertisementSummary,
  submitAdvertisement,
  cancelAdvertisement,
  createPaymentOrder,
  verifyPayment,
  loadRazorpayScript,
} from "@/lib/api";
import {
  ExternalLink,
  Copy,
  Edit3,
  LogOut,
  QrCode,
  Smartphone,
  Printer,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  CreditCard,
  Plus,
  Check,
  MapPin,
  Globe,
  Mail,
  FileText,
  AlertTriangle,
  Download,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const THEME_COLORS = [
  { name: "Slate Navy", value: "#0F172A" },
  { name: "Odisha Saffron", value: "#EA580C" },
  { name: "Emerald Forest", value: "#059669" },
  { name: "Crimson Rose", value: "#E11D48" },
  { name: "Royal Purple", value: "#7C3AED" },
  { name: "Amber Gold", value: "#D97706" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"IDENTITY" | "ADVERTISING">("IDENTITY");
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [analytics, setAnalytics] = useState<QRAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);

  // Advertising state (Phase 6)
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [adSummary, setAdSummary] = useState<AdvertisementSummary | null>(null);
  const [adLoading, setAdLoading] = useState(false);
  const [adActionMessage, setAdActionMessage] = useState<string | null>(null);

  // Payment engine state (Phase 7)
  const [payingAdId, setPayingAdId] = useState<string | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<CreatePaymentOrderResponse | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<string | null>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileInput>({});
  const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SAVED" | "FAILED">("IDLE");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
      return;
    }

    if (token) {
      loadProfileAndAnalytics(token);
      loadAdvertisements(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading, router]);

  const loadAdvertisements = async (authToken: string) => {
    setAdLoading(true);
    try {
      const [adsRes, summaryRes] = await Promise.all([
        fetchMyAdvertisements(authToken),
        fetchMyAdvertisementSummary(authToken),
      ]);
      if (adsRes.success && adsRes.data) {
        setAdvertisements(adsRes.data);
      }
      if (summaryRes.success && summaryRes.data) {
        setAdSummary(summaryRes.data);
      }
    } catch {
      console.error("Failed to load advertisements.");
    } finally {
      setAdLoading(false);
    }
  };

  const handleSubmitAd = async (adId: string) => {
    if (!token) return;
    setAdActionMessage("Submitting advertisement for review...");
    try {
      const res = await submitAdvertisement(token, adId);
      if (res.success) {
        setAdActionMessage("Advertisement submitted successfully for editorial review!");
        await loadAdvertisements(token);
        setTimeout(() => setAdActionMessage(null), 4000);
      } else {
        setAdActionMessage(`Submission failed: ${res.error?.message || "Error"}`);
      }
    } catch {
      setAdActionMessage("Network error during advertisement submission.");
    }
  };

  const handleCancelAd = async (adId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to cancel this advertisement?")) return;
    setAdActionMessage("Cancelling advertisement...");
    try {
      const res = await cancelAdvertisement(token, adId);
      if (res.success) {
        setAdActionMessage("Advertisement cancelled.");
        await loadAdvertisements(token);
        setTimeout(() => setAdActionMessage(null), 4000);
      } else {
        setAdActionMessage(`Cancel failed: ${res.error?.message || "Error"}`);
      }
    } catch {
      setAdActionMessage("Network error while cancelling advertisement.");
    }
  };

  const handleInitiatePayment = async (ad: Advertisement) => {
    if (!token) return;
    setPayingAdId(ad.id);
    setPaymentFeedback(null);
    try {
      const orderRes = await createPaymentOrder(token, ad.id);
      if (!orderRes.success || !orderRes.data) {
        setAdActionMessage(`Payment initiation failed: ${orderRes.error?.message || "Could not generate order"}`);
        setPayingAdId(null);
        return;
      }

      const orderData = orderRes.data;
      setPaymentOrder(orderData);

      const isLoaded = await loadRazorpayScript();
      const win = typeof window !== "undefined" ? (window as unknown as { Razorpay?: new (opts: unknown) => { open: () => void } }) : {};

      if (isLoaded && win.Razorpay) {
        const options = {
          key: orderData.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
          amount: orderData.amountMinor,
          currency: orderData.currency || "INR",
          name: "PRACHAR Phygital Platform",
          description: `${orderData.packageCode} Display Campaign: ${orderData.headline || "Print Edition"}`,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) {
            setVerifyingPayment(true);
            try {
              const verifyRes = await verifyPayment(token, {
                advertisementId: orderData.advertisementId,
                transactionId: orderData.transactionId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              if (verifyRes.success) {
                setAdActionMessage(`Payment of ₹${orderData.amount.toLocaleString("en-IN")} confirmed successfully! Reference: ${response.razorpay_payment_id}`);
                await loadAdvertisements(token);
                setTimeout(() => setAdActionMessage(null), 5000);
              } else {
                setAdActionMessage(`Payment verification failed: ${verifyRes.error?.message || "Signature mismatch"}`);
              }
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Payment verification error";
              setAdActionMessage(`Payment verification failed: ${msg}`);
            } finally {
              setVerifyingPayment(false);
              setPayingAdId(null);
            }
          },
          prefill: {
            name: profile?.businessName || user?.phoneNumber || "",
            contact: user?.phoneNumber || "",
          },
          theme: {
            color: "#ea580c",
          },
          modal: {
            ondismiss: function () {
              setPayingAdId(null);
            },
          },
        };

        const rzp = new win.Razorpay(options);
        rzp.open();
      } else {
        // Fallback / simulated checkout modal (offline dev or script blocked)
        setShowPaymentModal(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment initiation error";
      setAdActionMessage(`Payment error: ${msg}`);
      setPayingAdId(null);
    }
  };

  const handleSimulatePayment = async () => {
    if (!token || !paymentOrder) return;
    setVerifyingPayment(true);
    setPaymentFeedback(null);
    try {
      const simPaymentId = "pay_sim_" + Math.random().toString(36).substring(2, 12);
      const verifyRes = await verifyPayment(token, {
        advertisementId: paymentOrder.advertisementId,
        transactionId: paymentOrder.transactionId,
        razorpayOrderId: paymentOrder.razorpayOrderId,
        razorpayPaymentId: simPaymentId,
        razorpaySignature: "sim_test_signature_valid",
      });

      if (verifyRes.success) {
        setAdActionMessage(`Payment of ₹${paymentOrder.amount.toLocaleString("en-IN")} verified! Ref: ${simPaymentId}`);
        setShowPaymentModal(false);
        setPaymentOrder(null);
        setPayingAdId(null);
        await loadAdvertisements(token);
        setTimeout(() => setAdActionMessage(null), 5000);
      } else {
        setPaymentFeedback(verifyRes.error?.message || "Verification failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      setPaymentFeedback(msg);
    } finally {
      setVerifyingPayment(false);
    }
  };

  const loadProfileAndAnalytics = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMyProfile(authToken);
      if (res.success && res.data) {
        setProfile(res.data);
        populateForm(res.data);
      } else {
        setError(res.error?.message || "No active profile found. Please complete profile setup.");
      }

      // Fetch QR analytics foundation
      const aRes = await fetchQrAnalytics(authToken);
      if (aRes.success && aRes.data) {
        setAnalytics(aRes.data);
      }
    } catch {
      setError("Network error while loading profile details.");
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: MyProfile) => {
    setEditForm({
      displayName: data.displayName,
      businessName: data.businessName || "",
      category: data.category,
      tagline: data.tagline || "",
      bio: data.bio || "",
      primaryPhone: data.primaryPhone,
      whatsappNumber: data.whatsappNumber || "",
      email: data.email || "",
      websiteUrl: data.websiteUrl || "",
      addressText: data.addressText || "",
      city: data.city,
      district: data.district || "",
      state: data.state || "Odisha",
      socialInstagram: data.socialInstagram || "",
      socialFacebook: data.socialFacebook || "",
      socialTwitter: data.socialTwitter || "",
      socialLinkedin: data.socialLinkedin || "",
      themeColor: data.themeColor || "#0F172A",
      isPublic: data.isPublic,
    });
  };

  const handleCopySlug = () => {
    if (!profile) return;
    const url = `${window.location.origin}/u/${profile.usernameSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleCopyQr = () => {
    if (!profile || !profile.codeUuid) return;
    const url = getQrRedirectUrl(profile.codeUuid);
    navigator.clipboard.writeText(url);
    setCopiedQr(true);
    setTimeout(() => setCopiedQr(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaveStatus("SAVING");
    setStatusMessage("Saving profile updates...");
    setError(null);

    try {
      const res = await updateProfile(token, editForm);
      if (res.success && res.data) {
        setProfile(res.data);
        populateForm(res.data);
        setSaveStatus("SAVED");
        setStatusMessage("Profile updated successfully! All changes are live.");
        setIsEditing(false);
        setTimeout(() => setSaveStatus("IDLE"), 4000);
      } else {
        setSaveStatus("FAILED");
        setStatusMessage(res.error?.message || "Failed to update profile.");
      }
    } catch {
      setSaveStatus("FAILED");
      setStatusMessage("Network error while saving profile.");
    }
  };

  const handleToggleProfileStatus = async (newStatus: ProfileStatus) => {
    if (!token) return;
    setSaveStatus("SAVING");
    setStatusMessage(`Updating profile status to ${newStatus}...`);
    try {
      const res = await updateProfileStatus(token, newStatus);
      if (res.success && res.data) {
        setProfile(res.data);
        setSaveStatus("SAVED");
        setStatusMessage(`Profile status successfully set to ${newStatus}.`);
        setTimeout(() => setSaveStatus("IDLE"), 3000);
      } else {
        setSaveStatus("FAILED");
        setStatusMessage(res.error?.message || "Failed to update profile status.");
      }
    } catch {
      setSaveStatus("FAILED");
      setStatusMessage("Network error while updating profile status.");
    }
  };

  const handleToggleCardStatus = async (newStatus: CardStatus) => {
    if (!token) return;
    setSaveStatus("SAVING");
    setStatusMessage(`Updating digital card status to ${newStatus}...`);
    try {
      const res = await updateCardStatus(token, newStatus);
      if (res.success) {
        if (profile) {
          setProfile({ ...profile, cardStatus: newStatus });
        }
        setSaveStatus("SAVED");
        setStatusMessage(`Digital card status set to ${newStatus}.`);
        setTimeout(() => setSaveStatus("IDLE"), 3000);
      } else {
        setSaveStatus("FAILED");
        setStatusMessage(res.error?.message || "Failed to update card status.");
      }
    } catch {
      setSaveStatus("FAILED");
      setStatusMessage("Network error while updating card status.");
    }
  };

  const handleToggleQrStatus = async (newStatus: QRStatus) => {
    if (!token) return;
    setSaveStatus("SAVING");
    setStatusMessage(`Updating QR code status to ${newStatus}...`);
    try {
      const res = await updateQrStatus(token, newStatus);
      if (res.success) {
        if (profile) {
          setProfile({ ...profile, qrStatus: newStatus });
        }
        if (analytics) {
          setAnalytics({ ...analytics, qrStatus: newStatus });
        }
        setSaveStatus("SAVED");
        setStatusMessage(`QR code status set to ${newStatus}.`);
        setTimeout(() => setSaveStatus("IDLE"), 3000);
      } else {
        setSaveStatus("FAILED");
        setStatusMessage(res.error?.message || "Failed to update QR status.");
      }
    } catch {
      setSaveStatus("FAILED");
      setStatusMessage("Network error while updating QR status.");
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400">Loading your phygital identity...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-3xl border border-slate-800 bg-slate-900/90 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 mx-auto mb-4">
            <Smartphone className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
            Authentication Required
          </span>
          <h2 className="text-xl font-bold text-white mb-2">Access Merchant Console</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Sign in with your registered mobile number to manage your digital card, live dynamic QR telemetry, and Bhubaneswar print advertisements.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition shadow-lg shadow-orange-950/40"
            >
              Sign In with Mobile OTP
            </Link>
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              Claim Your Phygital Card
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400">Fetching verified merchant records...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-3xl border border-slate-800 bg-slate-900/90 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 mx-auto mb-4">
            <QrCode className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
            Profile Setup Needed
          </span>
          <h2 className="text-xl font-bold text-white mb-2">No Active Phygital Profile</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Your account ({user?.phoneNumber}) is authenticated, but your digital card and dynamic QR profile have not been set up yet.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition shadow-lg shadow-orange-950/40"
          >
            <span>Create Your Phygital Profile Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const isProfileActive = profile.status === "ACTIVE";
  const isCardActive = profile.cardStatus === "ACTIVE";
  const isQrActive = profile.qrStatus === "ACTIVE";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Save Status Indicators (SAVED / SAVING / FAILED) */}
      {saveStatus === "SAVING" && (
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-semibold uppercase tracking-wider">SAVING...</span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {saveStatus === "SAVED" && (
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">✓ SAVED</span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {saveStatus === "FAILED" && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">✕ FAILED</span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                profile.status === "ACTIVE"
                  ? "bg-emerald-950/80 border border-emerald-800 text-emerald-400"
                  : profile.status === "INACTIVE"
                  ? "bg-amber-950/80 border border-amber-800 text-amber-400"
                  : "bg-rose-950/80 border border-rose-800 text-rose-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${profile.status === "ACTIVE" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              PROFILE: {profile.status}
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800">
              <MapPin className="w-3 h-3 text-orange-400" />
              <span>{profile.city}, {profile.district ? `${profile.district}, ` : ""}{profile.state || "Odisha"}</span>
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified Merchant</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {profile.displayName}
            {profile.businessName && (
              <span className="text-lg font-normal text-slate-400 ml-2 font-sans">({profile.businessName})</span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span className="text-orange-400 font-semibold">{profile.category}</span>
            <span>•</span>
            <span className="font-mono text-slate-300">prachar.in/u/{profile.usernameSlug}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopySlug}
            className="px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 font-medium transition flex items-center gap-1.5 shadow-sm"
          >
            {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSlug ? "Copied Link!" : `/u/${profile.usernameSlug}`}</span>
          </button>

          <Link
            href={`/u/${profile.usernameSlug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-xs text-white font-bold transition flex items-center gap-1.5 shadow-lg shadow-orange-950/50"
          >
            <span>Preview Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl border border-slate-700/80 hover:bg-slate-800 text-xs text-slate-300 font-medium transition flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Close Editor" : "Edit Profile"}</span>
          </button>

          <button
            type="button"
            onClick={() => logout()}
            className="px-3 py-2 rounded-xl border border-rose-900/50 bg-rose-950/40 hover:bg-rose-950 text-xs text-rose-300 font-medium transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Dashboard Section Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("IDENTITY")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "IDENTITY"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-950/50"
                : "text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Digital Identity &amp; QR</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("ADVERTISING");
              if (token) loadAdvertisements(token);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === "ADVERTISING"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-950/50"
                : "text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Advertisements &amp; Campaigns</span>
            {adSummary && adSummary.total > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-950 text-orange-400 border border-orange-500/40 font-bold">
                {adSummary.total}
              </span>
            )}
          </button>
        </div>

        {activeTab === "ADVERTISING" && (
          <Link
            href="/advertise"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-950/50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New Advertisement</span>
          </Link>
        )}
      </div>

      {adActionMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-orange-950/70 border border-orange-800 text-orange-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📢</span>
            <span>{adActionMessage}</span>
          </div>
          <button type="button" onClick={() => setAdActionMessage(null)} className="text-orange-400 text-xs hover:underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {activeTab === "IDENTITY" ? (
        <>
          {/* Lifecycle Status Management Control Bar */}
          <div className="mb-8 p-5 rounded-3xl border border-slate-800/80 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Identity Lifecycle Controls</span>
              <span className="text-[11px] text-slate-400">Toggle operational states for your profile, companion card, and dynamic QR.</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Profile Status Toggle */}
              <button
                type="button"
                onClick={() => handleToggleProfileStatus(isProfileActive ? "INACTIVE" : "ACTIVE")}
                disabled={profile.status === "SUSPENDED"}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isProfileActive
                    ? "bg-amber-950/60 border-amber-800 hover:bg-amber-900 text-amber-300"
                    : "bg-emerald-950/60 border-emerald-800 hover:bg-emerald-900 text-emerald-300"
                }`}
              >
                {isProfileActive ? "Deactivate Profile" : "Activate Profile"}
              </button>

              {/* Digital Card Status Toggle */}
              <button
                type="button"
                onClick={() => handleToggleCardStatus(isCardActive ? "INACTIVE" : "ACTIVE")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isCardActive
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                    : "bg-emerald-950/60 border-emerald-800 hover:bg-emerald-900 text-emerald-300"
                }`}
              >
                Card: {isCardActive ? "Active (Disable)" : "Inactive (Enable)"}
              </button>

              {/* QR Status Toggle */}
              <button
                type="button"
                onClick={() => handleToggleQrStatus(isQrActive ? "INACTIVE" : "ACTIVE")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isQrActive
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                    : "bg-emerald-950/60 border-emerald-800 hover:bg-emerald-900 text-emerald-300"
                }`}
              >
                QR: {isQrActive ? "Active (Disable)" : "Inactive (Enable)"}
              </button>
            </div>
          </div>

          {/* Main Grid: Card + QR + Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Digital Card Presentation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Companion Digital Card</h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  isCardActive ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-800 text-slate-400"
                }`}>
                  {profile.cardStatus || "ACTIVE"}
                </span>
              </div>

              {/* Premium Realistic Phygital Card */}
              <div
                style={{ backgroundColor: profile.themeColor || "#0F172A" }}
                className="rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/15 text-white relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-orange-950/30"
              >
                {/* Glossy gradient reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-7xl select-none pointer-events-none">
                  P
                </div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                      PRACHAR CARD
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/80 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                    <span>{profile.isNfcEnabled ? "NFC Active" : "NFC Ready"}</span>
                  </div>
                </div>

                <div className="mb-6 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">{profile.displayName}</h3>
                  {profile.businessName && (
                    <p className="text-xs text-white/90 font-medium mt-1">{profile.businessName}</p>
                  )}
                  <p className="text-xs text-white/80 mt-1.5 font-medium">{profile.category}</p>
                  {profile.tagline && (
                    <p className="text-[11px] text-white/70 italic mt-2.5 line-clamp-2">&quot;{profile.tagline}&quot;</p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] relative z-10">
                  <div>
                    <p className="text-white/60 text-[9px] uppercase font-bold tracking-wider">
                      {profile.city}, {profile.state || "Odisha"}
                    </p>
                    <p className="font-mono text-white/95 mt-0.5">{profile.primaryPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-[9px] uppercase font-bold tracking-wider">Vanity URL</p>
                    <p className="font-mono text-amber-300 font-semibold mt-0.5">/u/{profile.usernameSlug}</p>
                  </div>
                </div>
              </div>

              {/* Business meta attributes */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-2.5 backdrop-blur-sm">
                <p className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Registered Phone:</span>
                  <span className="text-slate-200 font-mono font-semibold">{profile.primaryPhone}</span>
                </p>
                {profile.whatsappNumber && (
                  <p className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">WhatsApp:</span>
                    <span className="text-emerald-400 font-mono font-semibold">{profile.whatsappNumber}</span>
                  </p>
                )}
                {profile.email && (
                  <p className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="text-slate-300">{profile.email}</span>
                  </p>
                )}
                {profile.websiteUrl && (
                  <p className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Website:</span>
                    <span className="text-orange-400 truncate max-w-[200px]">{profile.websiteUrl}</span>
                  </p>
                )}
                <p className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-500 font-medium">Member Since:</span>
                  <span className="text-slate-300">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN") : "2026"}
                  </span>
                </p>
              </div>
            </div>

            {/* Center/Right Column: Dynamic QR Subsystem + Profile Editor */}
            <div className="lg:col-span-7 space-y-6">
              {/* QR Telemetry & Download Section */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-xl backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {profile.codeUuid ? (
                    <div className="p-3.5 rounded-2xl bg-white shadow-2xl text-center flex-shrink-0 border-4 border-white/80">
                      {/* Real Dynamic QR Image from Backend */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getQrImageUrl(profile.codeUuid, 180)}
                        alt={`Dynamic QR code for ${profile.displayName}`}
                        width={180}
                        height={180}
                        className="w-36 h-36 mx-auto rounded-lg"
                      />
                      <span className="block text-[10px] text-slate-800 mt-1.5 font-mono font-bold tracking-wider uppercase">
                        Scan to Connect
                      </span>
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-2xl bg-slate-800 flex flex-col items-center justify-center text-xs text-slate-500 gap-1 border border-slate-700">
                      <QrCode className="w-8 h-8 text-slate-600" />
                      <span>QR Pending</span>
                    </div>
                  )}

                  <div className="space-y-3.5 flex-1 text-center sm:text-left">
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                          Dynamic QR Code
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isQrActive ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-800 text-slate-400"
                        }`}>
                          {profile.qrStatus || "ACTIVE"}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white">Permanent Phygital Redirector</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Printed in Bhubaneswar booklet editions or physical companion cards. Redirects dynamically to your profile.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Total Scans</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
                          {(analytics?.totalScans ?? profile.scanCount ?? 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="border-l border-slate-800 pl-4">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Dynamic Target</span>
                        <span className="text-xs text-slate-300 font-mono block truncate max-w-[220px] mt-1">
                          {profile.targetUrl || `/u/${profile.usernameSlug}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                      {profile.codeUuid && (
                        <a
                          href={getQrImageUrl(profile.codeUuid, 500)}
                          download={`prachar_qr_${profile.usernameSlug}.png`}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-xs text-white font-bold transition flex items-center gap-1.5 shadow-lg shadow-orange-950/50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download High-Res QR (PNG)</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleCopyQr}
                        className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition flex items-center gap-1.5"
                      >
                        {copiedQr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedQr ? "Copied Redirect URL!" : "Copy Redirect Link"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Analytics Foundation */}
              {analytics && analytics.recentEvents && analytics.recentEvents.length > 0 && (
                <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Recent Scan Telemetry
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60">
                      DPDP Act 2023 Compliant (Hashed)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                          <th className="pb-2.5">Timestamp</th>
                          <th className="pb-2.5">Device</th>
                          <th className="pb-2.5">Referrer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        {analytics.recentEvents.slice(0, 5).map((evt, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition">
                            <td className="py-2.5 text-slate-300">
                              {new Date(evt.scannedAt).toLocaleString("en-IN")}
                            </td>
                            <td className="py-2.5 text-slate-400">{evt.deviceFamily}</td>
                            <td className="py-2.5 text-slate-500 truncate max-w-[150px]">
                              {evt.referrer || "Direct Scan"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Profile Editor (Conditional) */}
              {isEditing ? (
                <div className="p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest block">Profile Settings</span>
                      <h3 className="text-lg font-bold text-white">Edit Phygital Profile</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      /u/{profile.usernameSlug}
                    </span>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-300 mb-1">
                          Display Name *
                        </label>
                        <input
                          id="edit-name"
                          type="text"
                          value={editForm.displayName || ""}
                          onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-business" className="block text-xs font-semibold text-slate-300 mb-1">
                          Business Name
                        </label>
                        <input
                          id="edit-business"
                          type="text"
                          value={editForm.businessName || ""}
                          onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-category" className="block text-xs font-semibold text-slate-300 mb-1">
                          Category *
                        </label>
                        <input
                          id="edit-category"
                          type="text"
                          value={editForm.category || ""}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-tagline" className="block text-xs font-semibold text-slate-300 mb-1">
                          Tagline
                        </label>
                        <input
                          id="edit-tagline"
                          type="text"
                          value={editForm.tagline || ""}
                          onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edit-bio" className="block text-xs font-semibold text-slate-300 mb-1">
                        Bio / Business Summary
                      </label>
                      <textarea
                        id="edit-bio"
                        rows={3}
                        value={editForm.bio || ""}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="edit-phone" className="block text-xs font-semibold text-slate-300 mb-1">
                          Primary Phone *
                        </label>
                        <input
                          id="edit-phone"
                          type="tel"
                          value={editForm.primaryPhone || ""}
                          onChange={(e) => setEditForm({ ...editForm, primaryPhone: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-whatsapp" className="block text-xs font-semibold text-slate-300 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          id="edit-whatsapp"
                          type="tel"
                          value={editForm.whatsappNumber || ""}
                          onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-email" className="block text-xs font-semibold text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          id="edit-email"
                          type="email"
                          value={editForm.email || ""}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="edit-city" className="block text-xs font-semibold text-slate-300 mb-1">
                          City
                        </label>
                        <input
                          id="edit-city"
                          type="text"
                          value={editForm.city || ""}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-district" className="block text-xs font-semibold text-slate-300 mb-1">
                          District (Odisha)
                        </label>
                        <input
                          id="edit-district"
                          type="text"
                          value={editForm.district || ""}
                          onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                          placeholder="e.g. Khordha, Cuttack"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-state" className="block text-xs font-semibold text-slate-300 mb-1">
                          State
                        </label>
                        <input
                          id="edit-state"
                          type="text"
                          value={editForm.state || "Odisha"}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit-website" className="block text-xs font-semibold text-slate-300 mb-1">
                          Website URL
                        </label>
                        <input
                          id="edit-website"
                          type="url"
                          value={editForm.websiteUrl || ""}
                          onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-address" className="block text-xs font-semibold text-slate-300 mb-1">
                          Street Address
                        </label>
                        <input
                          id="edit-address"
                          type="text"
                          value={editForm.addressText || ""}
                          onChange={(e) => setEditForm({ ...editForm, addressText: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-300 block">Social Profiles</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="edit-ig" className="block text-[11px] text-slate-400 mb-1">Instagram (@handle or URL)</label>
                          <input
                            id="edit-ig"
                            type="text"
                            value={editForm.socialInstagram || ""}
                            onChange={(e) => setEditForm({ ...editForm, socialInstagram: e.target.value })}
                            placeholder="@username"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-fb" className="block text-[11px] text-slate-400 mb-1">Facebook URL</label>
                          <input
                            id="edit-fb"
                            type="text"
                            value={editForm.socialFacebook || ""}
                            onChange={(e) => setEditForm({ ...editForm, socialFacebook: e.target.value })}
                            placeholder="facebook.com/..."
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Card Theme Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        {THEME_COLORS.map((tc) => (
                          <button
                            key={tc.value}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, themeColor: tc.value })}
                            style={{ backgroundColor: tc.value }}
                            className={`w-7 h-7 rounded-full border-2 transition-transform ${
                              editForm.themeColor === tc.value ? "scale-110 shadow-lg ring-2 ring-white/50 border-white" : "border-transparent opacity-75 hover:opacity-100"
                            }`}
                            title={tc.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="submit"
                        disabled={saveStatus === "SAVING"}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition disabled:opacity-50 shadow-md shadow-orange-950/40"
                      >
                        {saveStatus === "SAVING" ? "Saving Changes..." : "Save Profile Updates"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Publication Synergy
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your digital profile is synchronized with Bhubaneswar Print Edition rate cards (P1–P5).
                    Any print advertisement in the monthly booklet links directly to this micro-site via your dynamic QR code.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                    <span>Next Print Cutoff: <strong className="text-orange-400">18th of this month</strong></span>
                    <Link href="/advertise" className="text-orange-400 font-semibold hover:underline">
                      View Rate Card →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Phase 6: Print Advertising & Phygital Campaigns Dashboard */
        <div className="space-y-8">
          {/* Advertising KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block font-semibold">Total Ads</span>
              <span className="text-2xl font-black text-white mt-1 block">{adSummary?.total || 0}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400 block font-semibold">Drafts</span>
              <span className="text-2xl font-black text-slate-300 mt-1 block">{adSummary?.drafts || 0}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-amber-400 block font-semibold">Submitted</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">{adSummary?.submitted || 0}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-amber-300 block font-semibold">Under Review</span>
              <span className="text-2xl font-black text-amber-300 mt-1 block">{adSummary?.underReview || 0}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-blue-400 block font-semibold">Approved</span>
              <span className="text-2xl font-black text-blue-400 mt-1 block">{adSummary?.approved || 0}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-purple-400 block font-semibold">Scheduled</span>
              <span className="text-2xl font-black text-purple-400 mt-1 block">{adSummary?.scheduled || 0}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-emerald-400 block font-semibold">Published</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">{adSummary?.published || 0}</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] text-orange-400 block font-semibold">Pay Pending</span>
              <span className="text-2xl font-black text-orange-400 mt-1 block">{adSummary?.paymentPending || 0}</span>
            </div>
          </div>

          {/* Advertisements List */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Your Print Directory Advertisements</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track editorial review, cutoff assignment, print scheduling, and payment status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => token && loadAdvertisements(token)}
                disabled={adLoading}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${adLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {adLoading ? (
              <div className="p-16 text-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-400">Loading campaign records...</p>
              </div>
            ) : advertisements.length === 0 ? (
              <div className="p-16 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 mx-auto mb-4">
                  <Printer className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">No Advertisements Booked Yet</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Expand your business presence beyond the screen. Reach 50,000+ local consumers across Bhubaneswar
                  with verified print placements (P1 to P5) paired directly with your dynamic QR micro-site.
                </p>
                <Link
                  href="/advertise"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition shadow-lg shadow-orange-950/50"
                >
                  <span>Book Print Advertisement (from ₹550)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 uppercase text-[10px] font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Ref ID / Package</th>
                      <th className="px-5 py-4">Headline &amp; Phygital Link</th>
                      <th className="px-5 py-4">Target Edition</th>
                      <th className="px-5 py-4">Display Amount</th>
                      <th className="px-5 py-4">Ad Status</th>
                      <th className="px-5 py-4">Payment</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {advertisements.map((ad) => {
                      const isDraft = ad.status === "DRAFT";
                      const isRejected = ad.status === "REJECTED";
                      const canCancel = isDraft || ad.status === "SUBMITTED" || ad.status === "UNDER_REVIEW";

                      return (
                        <tr key={ad.id} className="hover:bg-slate-800/30 transition">
                          <td className="px-5 py-4 align-top">
                            <span className="font-mono text-[11px] text-slate-400 block">
                              #{ad.id.substring(0, 8)}
                            </span>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-950/80 border border-orange-800 text-[10px]">
                                {ad.packageCode}
                              </span>
                              <span className="text-white font-semibold">{ad.packageName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {ad.editionCount === 1 ? "Single Edition" : "3-Edition Scheme"}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top max-w-xs">
                            <span className="font-bold text-white block">{ad.headline}</span>
                            {ad.businessName && (
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {ad.businessName} • {ad.city}
                              </span>
                            )}
                            {ad.usernameSlug && (
                              <Link
                                href={`/u/${ad.usernameSlug}`}
                                target="_blank"
                                className="text-[10px] text-orange-400 hover:underline block mt-1"
                              >
                                🔗 Bound: /u/{ad.usernameSlug}
                              </Link>
                            )}
                            {ad.hasCreative && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                                📎 {ad.creativeFilename || "Artwork Attached"}
                              </span>
                            )}
                            {ad.rejectionReason && (
                              <div className="mt-2 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px]">
                                <strong className="block text-rose-200">Editorial Feedback:</strong>
                                {ad.rejectionReason}
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span className="font-semibold text-white block">{ad.targetEdition}</span>
                            {ad.cutoffPassed && (
                              <span className="text-[10px] text-amber-400 block mt-0.5 font-medium">
                                (18th Rollover)
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span className="font-black text-white text-sm block">
                              ₹{ad.amount.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{ad.currency}</span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider inline-block ${
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
                              <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                                Sub: {new Date(ad.submittedAt).toLocaleDateString()}
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider inline-block ${
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
                              <span className="font-mono text-[9px] text-slate-500 block mt-1 truncate max-w-[100px]">
                                Ref: {ad.paymentReference}
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-top text-right space-y-1.5">
                            {(ad.paymentStatus === "PAYMENT_PENDING" || ad.paymentStatus === "PAYMENT_FAILED") &&
                              ad.status !== "CANCELLED" && (
                                <button
                                  type="button"
                                  onClick={() => handleInitiatePayment(ad)}
                                  disabled={payingAdId === ad.id}
                                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-[11px] font-bold transition block ml-auto shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5"
                                >
                                  {payingAdId === ad.id ? (
                                    <>
                                      <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                      <span>Opening...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="w-3 h-3" />
                                      <span>Pay ₹{ad.amount.toLocaleString("en-IN")}</span>
                                    </>
                                  )}
                                </button>
                              )}

                            {(isDraft || isRejected) && (
                              <button
                                type="button"
                                onClick={() => handleSubmitAd(ad.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold transition block ml-auto shadow-sm"
                              >
                                {isRejected ? "Resubmit Ad" : "Submit for Review"}
                              </button>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => handleCancelAd(ad.id)}
                                className="px-3 py-1 rounded-lg border border-rose-900/50 hover:bg-rose-950/40 text-rose-400 text-[10px] font-semibold transition block ml-auto"
                              >
                                Cancel
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
        </div>
      )}

      {/* Payment Checkout Fallback / Simulation Modal */}
      {showPaymentModal && paymentOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 font-bold">
                  💳
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Razorpay Secure Checkout</h3>
                  <span className="text-[10px] text-slate-400">PRACHAR Phygital Platform Gate</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPayingAdId(null);
                }}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
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
                <span className="text-emerald-400 font-black text-base">₹{paymentOrder.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-sans">Currency:</span>
                <span className="text-slate-400">{paymentOrder.currency}</span>
              </div>
            </div>

            {paymentFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{paymentFeedback}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
              Standard Razorpay script was either blocked or running in an offline environment. You can complete verification using the secure verification API.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={verifyingPayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                {verifyingPayment ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying Cryptographic Signature...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Verify Payment (₹{paymentOrder.amount.toLocaleString("en-IN")})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPayingAdId(null);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
