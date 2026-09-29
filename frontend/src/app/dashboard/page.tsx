"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { MyProfile, UpdateProfileInput } from "@/types";
import { fetchMyProfile, getQrImageUrl, getQrRedirectUrl, updateProfile } from "@/lib/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileInput>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
      return;
    }

    if (token) {
      loadProfile(token);
    }
  }, [token, authLoading, router]);

  const loadProfile = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMyProfile(authToken);
      if (res.success && res.data) {
        setProfile(res.data);
        setEditForm({
          displayName: res.data.displayName,
          category: res.data.category,
          tagline: res.data.tagline || "",
          bio: res.data.bio || "",
          primaryPhone: res.data.primaryPhone,
          whatsappNumber: res.data.whatsappNumber || "",
          email: res.data.email || "",
          websiteUrl: res.data.websiteUrl || "",
          addressText: res.data.addressText || "",
          city: res.data.city,
          themeColor: res.data.themeColor || "#0F172A",
          isPublic: res.data.isPublic,
        });
      } else {
        setError(res.error?.message || "No active profile found. Please complete profile setup.");
      }
    } catch {
      setError("Network error while loading profile details.");
    } finally {
      setLoading(false);
    }
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
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await updateProfile(token, editForm);
      if (res.success && res.data) {
        setProfile(res.data);
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(res.error?.message || "Failed to update profile.");
      }
    } catch {
      setError("Network error while saving profile.");
    } finally {
      setSaving(false);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 uppercase tracking-wider">
              {profile.status}
            </span>
            <span className="text-xs text-slate-500">Bhubaneswar Region</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{profile.displayName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{profile.category} • {profile.city}</p>
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
            View Live Micro-Site ↗
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

      {saveSuccess && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs">
          ✓ Profile updated successfully! Changes are live on your public micro-site.
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Main Grid: Card + QR + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Digital Card Presentation */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Companion Digital Card</h2>

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
              <p className="text-xs text-white/80 mt-1">{profile.category}</p>
              {profile.tagline && (
                <p className="text-[11px] text-white/70 italic mt-2 line-clamp-2">&quot;{profile.tagline}&quot;</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px]">
              <div>
                <p className="text-white/60 text-[9px] uppercase font-semibold">Bhubaneswar Region</p>
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
                  <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                    Dynamic QR Code
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">Permanent Phygital Redirector</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Printed in Bhubaneswar booklet editions or physical companion cards. Redirects dynamically to your profile.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 py-2 border-y border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Scans</span>
                    <span className="text-2xl font-bold text-emerald-400 font-mono">
                      {profile.scanCount ?? 0}
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

          {/* Profile Editor (Conditional) */}
          {isEditing ? (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4">Edit Phygital Profile</h3>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-whatsapp" className="block text-xs font-medium text-slate-300 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      id="edit-whatsapp"
                      type="tel"
                      value={editForm.whatsappNumber || ""}
                      onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
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
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition disabled:opacity-50"
                  >
                    {saving ? "Saving Changes..." : "Save Profile Updates"}
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
