"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { MyProfile, QRAnalytics, UpdateProfileInput, ProfileStatus, CardStatus, QRStatus } from "@/types";
import {
  fetchMyProfile,
  fetchQrAnalytics,
  getQrImageUrl,
  getQrRedirectUrl,
  updateProfile,
  updateProfileStatus,
  updateCardStatus,
  updateQrStatus,
} from "@/lib/api";

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

  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [analytics, setAnalytics] = useState<QRAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);

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
    }
  }, [token, authLoading, router]);

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

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400">Loading your phygital identity...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60">
          <span className="text-3xl mb-3 block">📇</span>
          <h2 className="text-lg font-bold text-white mb-2">Profile Setup Needed</h2>
          <p className="text-xs text-slate-400 mb-6">
            Your account ({user?.phoneNumber}) does not have an active phygital profile yet.
          </p>
          <Link
            href="/register"
            className="inline-block py-2.5 px-6 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition"
          >
            Create Your Profile Now
          </Link>
        </div>
      </div>
    );
  }

  const isProfileActive = profile.status === "ACTIVE";
  const isCardActive = profile.cardStatus === "ACTIVE";
  const isQrActive = profile.qrStatus === "ACTIVE";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Save Status Indicators (SAVED / SAVING / FAILED) */}
      {saveStatus === "SAVING" && (
        <div className="mb-6 p-3 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300 text-xs flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-semibold uppercase tracking-wider">SAVING...</span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {saveStatus === "SAVED" && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">✓ SAVED</span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {saveStatus === "FAILED" && (
        <div className="mb-6 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">✕ FAILED</span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                profile.status === "ACTIVE"
                  ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                  : profile.status === "INACTIVE"
                  ? "bg-amber-950 border border-amber-800 text-amber-400"
                  : "bg-rose-950 border border-rose-800 text-rose-400"
              }`}
            >
              PROFILE: {profile.status}
            </span>
            <span className="text-xs text-slate-500">
              {profile.city}, {profile.district ? `${profile.district}, ` : ""}{profile.state || "Odisha"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            {profile.displayName}
            {profile.businessName && (
              <span className="text-base font-normal text-slate-400 ml-2">({profile.businessName})</span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{profile.category} • /u/{profile.usernameSlug}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopySlug}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition flex items-center gap-1.5"
          >
            <span>🔗</span>
            <span>{copiedSlug ? "Copied Link!" : `/u/${profile.usernameSlug}`}</span>
          </button>
          <Link
            href={`/u/${profile.usernameSlug}`}
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs text-white font-medium transition"
          >
            Preview Public Profile ↗
          </Link>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 transition"
          >
            {isEditing ? "Close Editor" : "Edit Profile"}
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="px-3 py-1.5 rounded-lg border border-rose-900/50 bg-rose-950/40 hover:bg-rose-950 text-xs text-rose-300 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Lifecycle Status Management Control Bar */}
      <div className="mb-8 p-4 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-300 block">Identity Lifecycle Controls</span>
          <span className="text-[11px] text-slate-500">Toggle operational states for your profile, companion card, and dynamic QR.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Profile Status Toggle */}
          <button
            type="button"
            onClick={() => handleToggleProfileStatus(isProfileActive ? "INACTIVE" : "ACTIVE")}
            disabled={profile.status === "SUSPENDED"}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Digital Card Presentation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Companion Digital Card</h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              isCardActive ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-800 text-slate-400"
            }`}>
              {profile.cardStatus || "ACTIVE"}
            </span>
          </div>

          <div
            style={{ backgroundColor: profile.themeColor || "#0F172A" }}
            className="rounded-2xl p-6 shadow-2xl border border-white/10 text-white relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl select-none">
              P
            </div>
            <div className="flex items-center justify-between mb-8">
              <span className="text-[11px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                PRACHAR CARD
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/70">
                {profile.isNfcEnabled ? "NFC Active" : "NFC Ready"}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold leading-tight">{profile.displayName}</h3>
              {profile.businessName && (
                <p className="text-xs text-white/90 font-medium mt-0.5">{profile.businessName}</p>
              )}
              <p className="text-xs text-white/80 mt-1">{profile.category}</p>
              {profile.tagline && (
                <p className="text-[11px] text-white/70 italic mt-2 line-clamp-2">&quot;{profile.tagline}&quot;</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px]">
              <div>
                <p className="text-white/60 text-[9px] uppercase font-semibold">
                  {profile.city}, {profile.state || "Odisha"}
                </p>
                <p className="font-mono">{profile.primaryPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[9px] uppercase font-semibold">Vanity URL</p>
                <p className="font-mono text-orange-300">/u/{profile.usernameSlug}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400 space-y-2">
            <p className="flex justify-between">
              <span className="text-slate-500">Registered Phone:</span>
              <span className="text-slate-300 font-mono">{profile.primaryPhone}</span>
            </p>
            {profile.whatsappNumber && (
              <p className="flex justify-between">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="text-slate-300 font-mono">{profile.whatsappNumber}</span>
              </p>
            )}
            {profile.email && (
              <p className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-300">{profile.email}</span>
              </p>
            )}
            {profile.websiteUrl && (
              <p className="flex justify-between">
                <span className="text-slate-500">Website:</span>
                <span className="text-slate-300 truncate max-w-[180px]">{profile.websiteUrl}</span>
              </p>
            )}
            <p className="flex justify-between">
              <span className="text-slate-500">Member Since:</span>
              <span className="text-slate-300">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN") : "2026"}
              </span>
            </p>
          </div>
        </div>

        {/* Center/Right Column: Dynamic QR Subsystem + Profile Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR Telemetry & Download Section */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {profile.codeUuid ? (
                <div className="p-3 rounded-xl bg-white shadow-lg text-center flex-shrink-0">
                  {/* Real Dynamic QR Image from Backend */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getQrImageUrl(profile.codeUuid, 180)}
                    alt={`Dynamic QR code for ${profile.displayName}`}
                    width={180}
                    height={180}
                    className="w-36 h-36 mx-auto rounded"
                  />
                  <span className="block text-[10px] text-slate-600 mt-1 font-mono">Scan to Connect</span>
                </div>
              ) : (
                <div className="w-36 h-36 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                  QR Pending
                </div>
              )}

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                      Dynamic QR Code
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isQrActive ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-800 text-slate-400"
                    }`}>
                      {profile.qrStatus || "ACTIVE"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">Permanent Phygital Redirector</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Printed in Bhubaneswar booklet editions or physical companion cards. Redirects dynamically to your profile.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 py-2 border-y border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Scans</span>
                    <span className="text-2xl font-bold text-emerald-400 font-mono">
                      {analytics?.totalScans ?? profile.scanCount ?? 0}
                    </span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Dynamic Target</span>
                    <span className="text-xs text-slate-300 font-mono block truncate max-w-[200px]">
                      {profile.targetUrl || `/u/${profile.usernameSlug}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {profile.codeUuid && (
                    <a
                      href={getQrImageUrl(profile.codeUuid, 500)}
                      download={`prachar_qr_${profile.usernameSlug}.png`}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs text-white font-medium transition"
                    >
                      Download High-Res QR (PNG)
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyQr}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
                  >
                    {copiedQr ? "Copied Redirect URL!" : "Copy Redirect Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* QR Analytics Foundation (Part 10) */}
          {analytics && analytics.recentEvents && analytics.recentEvents.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Recent Scan Telemetry
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">
                  DPDP Act 2023 Compliant (SHA-256 Hashed)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500">
                      <th className="pb-2">Timestamp</th>
                      <th className="pb-2">Device</th>
                      <th className="pb-2">Referrer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {analytics.recentEvents.slice(0, 5).map((evt, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2 text-slate-300">
                          {new Date(evt.scannedAt).toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 text-slate-400">{evt.deviceFamily}</td>
                        <td className="py-2 text-slate-500 truncate max-w-[150px]">
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
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Edit Phygital Profile</h3>
                <span className="text-xs text-slate-400 font-mono">/u/{profile.usernameSlug}</span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-xs font-medium text-slate-300 mb-1">
                      Display Name *
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editForm.displayName || ""}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-business" className="block text-xs font-medium text-slate-300 mb-1">
                      Business Name
                    </label>
                    <input
                      id="edit-business"
                      type="text"
                      value={editForm.businessName || ""}
                      onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-category" className="block text-xs font-medium text-slate-300 mb-1">
                      Category *
                    </label>
                    <input
                      id="edit-category"
                      type="text"
                      value={editForm.category || ""}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-tagline" className="block text-xs font-medium text-slate-300 mb-1">
                      Tagline
                    </label>
                    <input
                      id="edit-tagline"
                      type="text"
                      value={editForm.tagline || ""}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-bio" className="block text-xs font-medium text-slate-300 mb-1">
                    Bio / Business Summary
                  </label>
                  <textarea
                    id="edit-bio"
                    rows={3}
                    value={editForm.bio || ""}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="edit-phone" className="block text-xs font-medium text-slate-300 mb-1">
                      Primary Phone *
                    </label>
                    <input
                      id="edit-phone"
                      type="tel"
                      value={editForm.primaryPhone || ""}
                      onChange={(e) => setEditForm({ ...editForm, primaryPhone: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-whatsapp" className="block text-xs font-medium text-slate-300 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      id="edit-whatsapp"
                      type="tel"
                      value={editForm.whatsappNumber || ""}
                      onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="edit-city" className="block text-xs font-medium text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      id="edit-city"
                      type="text"
                      value={editForm.city || ""}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-district" className="block text-xs font-medium text-slate-300 mb-1">
                      District (Odisha)
                    </label>
                    <input
                      id="edit-district"
                      type="text"
                      value={editForm.district || ""}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      placeholder="e.g. Khordha, Cuttack"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-state" className="block text-xs font-medium text-slate-300 mb-1">
                      State
                    </label>
                    <input
                      id="edit-state"
                      type="text"
                      value={editForm.state || "Odisha"}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-website" className="block text-xs font-medium text-slate-300 mb-1">
                      Website URL
                    </label>
                    <input
                      id="edit-website"
                      type="url"
                      value={editForm.websiteUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-address" className="block text-xs font-medium text-slate-300 mb-1">
                      Street Address
                    </label>
                    <input
                      id="edit-address"
                      type="text"
                      value={editForm.addressText || ""}
                      onChange={(e) => setEditForm({ ...editForm, addressText: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                {/* Social Links (Phase 3) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 block">Social Profiles</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="edit-ig" className="block text-[11px] text-slate-400 mb-1">Instagram (@handle or URL)</label>
                      <input
                        id="edit-ig"
                        type="text"
                        value={editForm.socialInstagram || ""}
                        onChange={(e) => setEditForm({ ...editForm, socialInstagram: e.target.value })}
                        placeholder="@username"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
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
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-tw" className="block text-[11px] text-slate-400 mb-1">Twitter / 𝕏 (@handle or URL)</label>
                      <input
                        id="edit-tw"
                        type="text"
                        value={editForm.socialTwitter || ""}
                        onChange={(e) => setEditForm({ ...editForm, socialTwitter: e.target.value })}
                        placeholder="@handle"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-li" className="block text-[11px] text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        id="edit-li"
                        type="text"
                        value={editForm.socialLinkedin || ""}
                        onChange={(e) => setEditForm({ ...editForm, socialLinkedin: e.target.value })}
                        placeholder="linkedin.com/in/..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Card Theme Color
                  </label>
                  <div className="flex items-center gap-3">
                    {THEME_COLORS.map((tc) => (
                      <button
                        key={tc.value}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, themeColor: tc.value })}
                        style={{ backgroundColor: tc.value }}
                        className={`w-7 h-7 rounded-full border-2 transition ${
                          editForm.themeColor === tc.value ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
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
                    className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition disabled:opacity-50"
                  >
                    {saveStatus === "SAVING" ? "Saving Changes..." : "Save Profile Updates"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Publication Synergy
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your digital profile is synchronized with Bhubaneswar Print Edition rate cards (P1–P5).
                Any print advertisement in the monthly booklet links directly to this micro-site via your dynamic QR code.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
                <span>Next Print Cutoff: <strong>18th of this month</strong></span>
                <Link href="/advertise" className="text-orange-400 hover:underline">
                  View Rate Card →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
