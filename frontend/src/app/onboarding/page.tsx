"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  fetchOnboardingStatus,
  checkSlugAvailability,
  createProfile,
} from "@/lib/api";
import { OnboardingStatusData, CreateProfileInput } from "@/types";

/* ─── Constants ───────────────────────────────────────────────── */

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
  "Jewellery & Accessories",
  "Electronics & Mobile Repair",
];

const THEME_COLORS = [
  { name: "Slate Navy", value: "#0F172A" },
  { name: "Odisha Saffron", value: "#EA580C" },
  { name: "Emerald Forest", value: "#059669" },
  { name: "Crimson Rose", value: "#E11D48" },
  { name: "Royal Purple", value: "#7C3AED" },
  { name: "Amber Gold", value: "#D97706" },
];

const STEP_META = [
  { step: 1, label: "Verified",  icon: "✅", title: "Phone Verified",      description: "Your Odisha mobile identity is confirmed." },
  { step: 2, label: "Business",  icon: "🏪", title: "Merchant Details",    description: "Tell PRACHAR about your business." },
  { step: 3, label: "URL",       icon: "🔗", title: "Claim Your URL",      description: "Reserve your unique prachar.in/u/[:slug] address." },
  { step: 4, label: "Card",      icon: "🃏", title: "Digital Card Theme",  description: "Choose a visual identity for your phygital card." },
  { step: 5, label: "QR",        icon: "📱", title: "Dynamic QR Code",     description: "Your smart QR matrix will route visitors to your profile." },
  { step: 6, label: "Live!",     icon: "🚀", title: "You're Live!",        description: "Your PRACHAR phygital profile is ready." },
];

/* ─── Types ───────────────────────────────────────────────────── */

interface WizardFormData {
  displayName: string;
  businessName: string;
  category: string;
  tagline: string;
  bio: string;
  primaryPhone: string;
  whatsappNumber: string;
  email: string;
  websiteUrl: string;
  addressText: string;
  city: string;
  district: string;
  usernameSlug: string;
  themeColor: string;
}

/* ─── Step indicator ──────────────────────────────────────────── */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="step-indicator">
      {STEP_META.map((s, idx) => {
        const done = currentStep > s.step;
        const active = currentStep === s.step;
        return (
          <React.Fragment key={s.step}>
            <div className={`step-dot ${done ? "done" : active ? "active" : "pending"}`}>
              {done ? "✓" : s.icon}
              <span className="step-dot-label">{s.label}</span>
            </div>
            {idx < STEP_META.length - 1 && (
              <div className={`step-connector ${done ? "done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slug check state
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "taken" | "error">("idle");
  const [slugMsg, setSlugMsg] = useState("");

  const [form, setForm] = useState<WizardFormData>({
    displayName: "",
    businessName: "",
    category: "",
    tagline: "",
    bio: "",
    primaryPhone: "",
    whatsappNumber: "",
    email: "",
    websiteUrl: "",
    addressText: "",
    city: "Bhubaneswar",
    district: "Khordha",
    usernameSlug: "",
    themeColor: "#0F172A",
  });

  /* ── Bootstrap: redirect if not logged-in, fetch status ──── */
  const loadStatus = useCallback(async () => {
    if (!user?.accessToken) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    const res = await fetchOnboardingStatus(user.accessToken);
    setLoading(false);
    if (res.success && res.data) {
      setOnboardingData(res.data);
      // If already completed, send to dashboard
      if (res.data.completed) {
        router.replace("/dashboard");
        return;
      }
      // Pre-fill phone from onboarding data
      setForm((f) => ({
        ...f,
        primaryPhone: res.data!.phoneNumber ?? "",
        whatsappNumber: res.data!.phoneNumber ?? "",
      }));
      // Jump to correct step based on status
      const status = res.data.onboardingStatus;
      if (status === "NOT_STARTED" || status === "IN_PROGRESS") setCurrentStep(2);
      else if (status === "PROFILE_CREATED") setCurrentStep(4);
      else if (status === "CARD_CREATED") setCurrentStep(5);
      else if (status === "QR_CREATED") setCurrentStep(6);
      else setCurrentStep(1);
    } else {
      setError(res.error?.message ?? "Failed to load onboarding status.");
    }
  }, [user, router]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  /* ── Helpers ─────────────────────────────────────────────── */

  const updateField = (field: keyof WizardFormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const checkSlug = useCallback(async (slug: string) => {
    const clean = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean.length < 3) { setSlugStatus("error"); setSlugMsg("Minimum 3 characters"); return; }
    setSlugStatus("checking"); setSlugMsg("Checking…");
    const res = await checkSlugAvailability(clean);
    if (res.success && res.data) {
      if (res.data.available) { setSlugStatus("ok"); setSlugMsg("✓ Available!"); }
      else { setSlugStatus("taken"); setSlugMsg("✗ Already taken"); }
    } else {
      setSlugStatus("error"); setSlugMsg("Could not verify");
    }
  }, []);

  /* ── Step navigation ─────────────────────────────────────── */

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 6));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  /* ── Submit: create profile (covers steps 2-5 data) ─────── */

  const handleSubmitProfile = async () => {
    if (!user?.accessToken) return;
    if (!form.displayName.trim()) { setError("Display name is required."); return; }
    if (!form.category) { setError("Please select a business category."); return; }
    if (slugStatus !== "ok") { setError("Please claim a valid, available URL slug."); return; }

    setSaving(true); setError(null);
    const payload: CreateProfileInput = {
      displayName: form.displayName.trim(),
      businessName: form.businessName.trim() || undefined,
      category: form.category,
      tagline: form.tagline.trim() || undefined,
      bio: form.bio.trim() || undefined,
      primaryPhone: form.primaryPhone.trim(),
      whatsappNumber: form.whatsappNumber.trim() || undefined,
      email: form.email.trim() || undefined,
      websiteUrl: form.websiteUrl.trim() || undefined,
      addressText: form.addressText.trim() || undefined,
      city: form.city.trim() || "Bhubaneswar",
      district: form.district.trim() || undefined,
      state: "Odisha",
      usernameSlug: form.usernameSlug.trim().toLowerCase(),
      themeColor: form.themeColor,
    };
    const res = await createProfile(user.accessToken, payload);
    setSaving(false);
    if (res.success) {
      goNext(); // Step 5 → QR view
    } else {
      setError(res.error?.message ?? "Failed to create profile. Please try again.");
    }
  };

  /* ── Step 6: finish → dashboard ─────────────────────────── */

  const handleFinish = () => router.replace("/dashboard");

  /* ── Loading / error guard ───────────────────────────────── */

  if (loading) {
    return (
      <div className="onboarding-shell">
        <div className="onboarding-loading">
          <div className="spinner-ring" />
          <p>Loading your onboarding…</p>
        </div>
      </div>
    );
  }

  const stepMeta = STEP_META[currentStep - 1];

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className="onboarding-shell">
      {/* Top brand bar */}
      <header className="onboarding-header">
        <div className="onboarding-logo">
          <span className="logo-p">P</span>RACHAR
        </div>
        <p className="onboarding-header-sub">Phygital Publicity Platform · Odisha</p>
      </header>

      {/* Step progress */}
      <StepIndicator currentStep={currentStep} />

      {/* Card */}
      <main className="onboarding-card">
        {/* Card header */}
        <div className="onboarding-card-header">
          <span className="step-icon-big">{stepMeta.icon}</span>
          <div>
            <h1 className="step-title">{stepMeta.title}</h1>
            <p className="step-desc">{stepMeta.description}</p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="onboarding-error">
            <span>⚠</span> {error}
            <button onClick={() => setError(null)} className="error-dismiss">×</button>
          </div>
        )}

        {/* ── STEP 1: Phone Verified (read-only) ── */}
        {currentStep === 1 && (
          <div className="step-body">
            <div className="verified-badge">
              <span className="verified-badge-icon">📱</span>
              <div>
                <p className="verified-phone">{onboardingData?.phoneNumber}</p>
                <p className="verified-caption">Verified Odisha mobile number</p>
              </div>
            </div>
            <p className="step-info">
              Welcome to PRACHAR! Your phone number is your phygital identity. Let&apos;s set up your
              merchant profile in a few quick steps.
            </p>
            <button className="btn-primary" onClick={goNext}>
              Let&apos;s Begin →
            </button>
          </div>
        )}

        {/* ── STEP 2: Merchant Details ── */}
        {currentStep === 2 && (
          <div className="step-body">
            <div className="form-grid">
              <label className="form-label">
                Display Name <span className="required">*</span>
                <input
                  className="form-input"
                  placeholder="e.g. Ravi Kumar or Kumar Electronics"
                  value={form.displayName}
                  onChange={(e) => updateField("displayName", e.target.value)}
                />
              </label>
              <label className="form-label">
                Business / Shop Name
                <input
                  className="form-input"
                  placeholder="e.g. Kumar Electronics & Gadgets"
                  value={form.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                />
              </label>
              <label className="form-label full-width">
                Business Category <span className="required">*</span>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">— Select a category —</option>
                  {PRESET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="form-label full-width">
                Tagline
                <input
                  className="form-input"
                  placeholder="e.g. Your trusted electronics partner in Bhubaneswar"
                  value={form.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                />
              </label>
              <label className="form-label full-width">
                About / Bio
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  placeholder="A brief description of your business…"
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                />
              </label>
              <label className="form-label">
                Primary Phone <span className="required">*</span>
                <input
                  className="form-input"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.primaryPhone}
                  onChange={(e) => updateField("primaryPhone", e.target.value)}
                />
              </label>
              <label className="form-label">
                WhatsApp Number
                <input
                  className="form-input"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.whatsappNumber}
                  onChange={(e) => updateField("whatsappNumber", e.target.value)}
                />
              </label>
              <label className="form-label">
                Email
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </label>
              <label className="form-label">
                Website URL
                <input
                  className="form-input"
                  placeholder="https://yourwebsite.com"
                  value={form.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                />
              </label>
              <label className="form-label full-width">
                Address
                <input
                  className="form-input"
                  placeholder="Shop no., street, landmark…"
                  value={form.addressText}
                  onChange={(e) => updateField("addressText", e.target.value)}
                />
              </label>
              <label className="form-label">
                City
                <input
                  className="form-input"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </label>
              <label className="form-label">
                District
                <input
                  className="form-input"
                  placeholder="e.g. Khordha"
                  value={form.district}
                  onChange={(e) => updateField("district", e.target.value)}
                />
              </label>
            </div>
            <div className="step-nav">
              <button className="btn-ghost" onClick={goPrev}>← Back</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (!form.displayName.trim()) { setError("Display name is required."); return; }
                  if (!form.category) { setError("Please select a business category."); return; }
                  setError(null); goNext();
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Claim Your URL ── */}
        {currentStep === 3 && (
          <div className="step-body">
            <div className="slug-claim-box">
              <p className="slug-url-preview">
                prachar.in/u/<strong>{form.usernameSlug || "your-slug"}</strong>
              </p>
              <div className="slug-input-row">
                <input
                  className="form-input slug-input"
                  placeholder="your-business-slug"
                  value={form.usernameSlug}
                  onChange={(e) => {
                    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                    updateField("usernameSlug", clean);
                    setSlugStatus("idle"); setSlugMsg("");
                  }}
                />
                <button
                  className="btn-secondary slug-check-btn"
                  onClick={() => checkSlug(form.usernameSlug)}
                  disabled={slugStatus === "checking" || form.usernameSlug.length < 3}
                >
                  {slugStatus === "checking" ? "…" : "Check"}
                </button>
              </div>
              {slugMsg && (
                <p className={`slug-msg slug-msg-${slugStatus}`}>{slugMsg}</p>
              )}
              <ul className="slug-rules">
                <li>Lowercase letters, numbers, and hyphens only</li>
                <li>Minimum 3 characters, maximum 40</li>
                <li>Cannot be changed after going live</li>
              </ul>
            </div>
            <div className="step-nav">
              <button className="btn-ghost" onClick={goPrev}>← Back</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (slugStatus !== "ok") { setError("Please check slug availability first."); return; }
                  setError(null); goNext();
                }}
              >
                Claim & Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Card Theme ── */}
        {currentStep === 4 && (
          <div className="step-body">
            <p className="step-info">
              Pick a primary theme colour for your digital business card. This shapes the first
              impression your card makes when someone scans your QR.
            </p>
            <div className="color-grid">
              {THEME_COLORS.map((tc) => (
                <button
                  key={tc.value}
                  className={`color-tile ${form.themeColor === tc.value ? "color-tile-active" : ""}`}
                  style={{ background: tc.value }}
                  onClick={() => updateField("themeColor", tc.value)}
                  title={tc.name}
                >
                  {form.themeColor === tc.value && <span className="color-check">✓</span>}
                  <span className="color-name">{tc.name}</span>
                </button>
              ))}
            </div>
            {/* Preview chip */}
            <div className="card-preview" style={{ borderColor: form.themeColor }}>
              <div className="card-preview-strip" style={{ background: form.themeColor }} />
              <div className="card-preview-body">
                <p className="card-preview-name">{form.displayName || "Your Name"}</p>
                <p className="card-preview-biz">{form.businessName || form.category || "Business Category"}</p>
                <p className="card-preview-slug" style={{ color: form.themeColor }}>
                  prachar.in/u/{form.usernameSlug || "your-slug"}
                </p>
              </div>
            </div>
            <div className="step-nav">
              <button className="btn-ghost" onClick={goPrev}>← Back</button>
              <button
                className="btn-primary"
                onClick={handleSubmitProfile}
                disabled={saving}
              >
                {saving ? "Creating Profile…" : "Create My Profile →"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: QR Code ── */}
        {currentStep === 5 && (
          <div className="step-body center">
            <div className="qr-preview-box">
              <div className="qr-placeholder">
                <span className="qr-icon">📱</span>
                <p>Your Dynamic QR Code</p>
                <p className="qr-sub">has been generated</p>
              </div>
            </div>
            <p className="step-info">
              Your PRACHAR QR code is now live and routes anyone who scans it straight to your
              digital business card at{" "}
              <strong>prachar.in/u/{form.usernameSlug}</strong>.
            </p>
            <div className="step-nav center-nav">
              <button className="btn-primary" onClick={goNext}>
                View My Profile →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: You're Live! ── */}
        {currentStep === 6 && (
          <div className="step-body center">
            <div className="success-burst">
              <span className="success-icon">🚀</span>
              <h2 className="success-title">You&apos;re Live on PRACHAR!</h2>
              <p className="success-sub">
                Your phygital identity is active at
              </p>
              <a
                className="success-url"
                href={`/u/${form.usernameSlug}`}
                target="_blank"
                rel="noreferrer"
              >
                prachar.in/u/{form.usernameSlug}
              </a>
            </div>
            <div className="success-checklist">
              {STEP_META.slice(0, 5).map((s) => (
                <div key={s.step} className="success-check-row">
                  <span className="check-green">✓</span>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary btn-large" onClick={handleFinish}>
              Go to My Dashboard →
            </button>
          </div>
        )}
      </main>

      {/* ── Scoped styles ── */}
      <style jsx>{`
        /* Shell */
        .onboarding-shell {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem 4rem;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: #e2e8f0;
        }

        /* Header */
        .onboarding-header { text-align: center; margin-bottom: 2rem; }
        .onboarding-logo {
          font-size: 2rem; font-weight: 800; letter-spacing: -1px;
          color: #fff;
        }
        .logo-p { color: #f97316; }
        .onboarding-header-sub { font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem; }

        /* Step indicator */
        .step-indicator {
          display: flex; align-items: center; gap: 0; margin-bottom: 2rem;
          overflow-x: auto; padding-bottom: 0.5rem;
        }
        .step-dot {
          display: flex; flex-direction: column; align-items: center;
          font-size: 1.25rem; gap: 4px; min-width: 56px;
          transition: all 0.3s;
        }
        .step-dot-label { font-size: 0.6rem; font-weight: 600; color: #64748b; letter-spacing: 0.05em; }
        .step-dot.active .step-dot-label { color: #f97316; }
        .step-dot.done .step-dot-label { color: #22c55e; }
        .step-connector {
          flex: 1; height: 2px; background: #334155; min-width: 20px;
          transition: background 0.3s;
        }
        .step-connector.done { background: #22c55e; }

        /* Card */
        .onboarding-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 2rem;
          width: 100%; max-width: 680px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.4);
        }
        .onboarding-card-header {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 1.5rem; padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .step-icon-big { font-size: 2.5rem; }
        .step-title { font-size: 1.4rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .step-desc { font-size: 0.85rem; color: #94a3b8; margin: 0.25rem 0 0; }

        /* Error */
        .onboarding-error {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4);
          color: #fca5a5; border-radius: 10px; padding: 0.75rem 1rem;
          margin-bottom: 1.25rem; font-size: 0.9rem;
        }
        .error-dismiss {
          margin-left: auto; background: none; border: none; color: #fca5a5;
          cursor: pointer; font-size: 1.2rem; line-height: 1;
        }

        /* Step body */
        .step-body { display: flex; flex-direction: column; gap: 1.25rem; }
        .step-info { color: #94a3b8; font-size: 0.9rem; line-height: 1.6; }

        /* Form grid */
        .form-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        .form-label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.82rem; font-weight: 600; color: #cbd5e1; }
        .form-label.full-width { grid-column: 1 / -1; }
        .required { color: #f97316; }
        .form-input {
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px; padding: 0.6rem 0.85rem; color: #f1f5f9;
          font-size: 0.9rem; outline: none; transition: border-color 0.2s;
          font-family: inherit;
        }
        .form-input:focus { border-color: #f97316; }
        .form-input::placeholder { color: #475569; }
        .form-textarea { resize: vertical; }
        select.form-input option { background: #1e293b; }

        /* Slug claim */
        .slug-claim-box {
          background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.2);
          border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
        }
        .slug-url-preview {
          font-size: 1.1rem; color: #f97316; font-weight: 600;
          word-break: break-all;
        }
        .slug-input-row { display: flex; gap: 0.5rem; align-items: center; }
        .slug-input { flex: 1; }
        .slug-check-btn {
          padding: 0.6rem 1rem; border: 1px solid #f97316; border-radius: 8px;
          background: transparent; color: #f97316; font-weight: 600; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .slug-check-btn:hover:not(:disabled) { background: #f97316; color: #fff; }
        .slug-check-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .slug-msg { font-size: 0.85rem; font-weight: 600; }
        .slug-msg-ok { color: #22c55e; }
        .slug-msg-taken, .slug-msg-error { color: #ef4444; }
        .slug-msg-checking { color: #94a3b8; }
        .slug-rules { list-style: disc; padding-left: 1.25rem; color: #64748b; font-size: 0.8rem; line-height: 1.8; margin: 0; }

        /* Color grid */
        .color-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
        }
        .color-tile {
          border: 2px solid transparent; border-radius: 12px; padding: 1rem 0.5rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .color-tile:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
        .color-tile-active { border-color: #fff !important; box-shadow: 0 0 0 3px rgba(255,255,255,0.2); }
        .color-check { font-size: 1.2rem; }
        .color-name { font-size: 0.7rem; color: rgba(255,255,255,0.9); font-weight: 600; text-align: center; }

        /* Card preview */
        .card-preview {
          border: 2px solid; border-radius: 14px; overflow: hidden;
          transition: border-color 0.3s; max-width: 340px; margin: 0 auto;
        }
        .card-preview-strip { height: 8px; }
        .card-preview-body { padding: 1rem 1.25rem; }
        .card-preview-name { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .card-preview-biz { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0.5rem; }
        .card-preview-slug { font-size: 0.78rem; font-weight: 600; }

        /* QR preview */
        .step-body.center { align-items: center; text-align: center; }
        .qr-preview-box {
          background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.15);
          border-radius: 16px; padding: 2rem; min-width: 200px;
        }
        .qr-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .qr-icon { font-size: 4rem; }
        .qr-sub { color: #64748b; font-size: 0.85rem; margin: 0; }
        .center-nav { flex-direction: row; justify-content: center; }

        /* Success */
        .success-burst {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          padding: 1.5rem; text-align: center;
        }
        .success-icon { font-size: 4rem; }
        .success-title { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; margin: 0; }
        .success-sub { color: #94a3b8; font-size: 0.9rem; margin: 0.25rem 0 0; }
        .success-url {
          font-size: 1rem; font-weight: 700; color: #f97316;
          text-decoration: underline; word-break: break-all;
        }
        .success-checklist { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
        .success-check-row {
          display: flex; align-items: center; gap: 0.75rem;
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
          border-radius: 8px; padding: 0.6rem 1rem; font-size: 0.9rem; color: #e2e8f0;
        }
        .check-green { color: #22c55e; font-size: 1rem; }

        /* Buttons */
        .step-nav { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .btn-primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #fff; border: none; border-radius: 10px;
          padding: 0.75rem 1.75rem; font-weight: 700; font-size: 0.95rem;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(249,115,22,0.4); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary.btn-large { padding: 1rem 2.5rem; font-size: 1.05rem; }
        .btn-ghost {
          background: transparent; color: #94a3b8; border: 1px solid #334155;
          border-radius: 10px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .btn-ghost:hover { border-color: #64748b; color: #e2e8f0; }
        .btn-secondary {
          background: transparent; color: #f97316; border: 1px solid #f97316;
          border-radius: 8px; padding: 0.6rem 1rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }

        /* Loading */
        .onboarding-loading {
          display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
          margin-top: 20vh; color: #94a3b8;
        }
        .spinner-ring {
          width: 48px; height: 48px; border: 4px solid rgba(249,115,22,0.2);
          border-top-color: #f97316; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Verified badge */
        .verified-badge {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
          border-radius: 12px; padding: 1rem 1.25rem;
        }
        .verified-badge-icon { font-size: 2rem; }
        .verified-phone { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin: 0; }
        .verified-caption { font-size: 0.8rem; color: #22c55e; margin: 0.25rem 0 0; }

        /* Responsive */
        @media (max-width: 480px) {
          .onboarding-card { padding: 1.25rem; }
          .form-grid { grid-template-columns: 1fr; }
          .form-label.full-width { grid-column: 1; }
          .color-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
