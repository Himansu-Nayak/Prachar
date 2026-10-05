import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchPublicProfile } from "@/lib/api";
import ProfileClientActions from "@/components/profile/ProfileClientActions";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = params;
  if (!username) {
    return {
      title: "Profile Not Found | PRACHAR",
      robots: { index: false, follow: false },
    };
  }

  const res = await fetchPublicProfile(username);

  if (!res.success || !res.data) {
    return {
      title: "Profile Not Found | PRACHAR",
      description: "The requested phygital publicity profile is not available on PRACHAR.",
      robots: { index: false, follow: false },
    };
  }

  const profile = res.data;

  if (profile.status === "INACTIVE") {
    return {
      title: `${profile.displayName} (Inactive) | PRACHAR`,
      description: "This phygital profile is currently inactive.",
      robots: { index: false, follow: false },
    };
  }

  if (profile.status === "SUSPENDED") {
    return {
      title: "Profile Suspended | PRACHAR",
      description: "This phygital profile has been suspended by administration.",
      robots: { index: false, follow: false },
    };
  }

  const title = profile.businessName
    ? `${profile.displayName} (${profile.businessName}) | PRACHAR`
    : `${profile.displayName} | PRACHAR Phygital Profile`;

  const locationStr = [profile.city, profile.district, profile.state || "Odisha"].filter(Boolean).join(", ");
  const description =
    profile.tagline ||
    profile.bio ||
    `${profile.displayName} - ${profile.category} in ${locationStr}. Verified by PRACHAR Phygital Platform.`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prachar.in";
  const canonicalUrl = `${appUrl}/u/${profile.usernameSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "PRACHAR Phygital Platform",
      locale: "en_IN",
      type: "profile",
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = params;

  if (!username || username.trim() === "") {
    notFound();
  }

  const res = await fetchPublicProfile(username);
  if (!res.success || !res.data) {
    notFound();
  }

  const profile = res.data;

  // Handle Suspended Profile State
  if (profile.status === "SUSPENDED") {
    return (
      <main className="min-h-screen py-16 px-4 flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-md text-center p-8 rounded-3xl border border-rose-900/60 bg-slate-900/90 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center text-3xl mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Profile Suspended</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            This digital profile is currently suspended due to policy or administrative review. If you believe this is an error, please contact PRACHAR support.
          </p>
          <Link
            href="/"
            className="inline-block py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition border border-slate-700"
          >
            Return to PRACHAR Home
          </Link>
        </div>
      </main>
    );
  }

  // Handle Inactive Profile State
  if (profile.status === "INACTIVE") {
    return (
      <main className="min-h-screen py-16 px-4 flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-md text-center p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mx-auto mb-4">
            ⏸️
          </div>
          <h1 className="text-xl font-bold text-white mb-1">{profile.displayName}</h1>
          <p className="text-xs text-orange-400 font-medium mb-3 uppercase tracking-wider">{profile.category}</p>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold mb-4">
            Profile Temporarily Inactive
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            The profile owner has temporarily paused this phygital profile. Contact details and card services are currently unavailable. Please check back later.
          </p>
          <Link
            href="/"
            className="inline-block py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition border border-slate-700"
          >
            Explore PRACHAR →
          </Link>
        </div>
      </main>
    );
  }

  // Active Profile Rendering
  const initials = profile.displayName
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const locationDisplay = [profile.city, profile.district, profile.state || "Odisha"].filter(Boolean).join(", ");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prachar.in";
  const canonicalUrl = `${appUrl}/u/${profile.usernameSlug}`;

  // Safe external URL builders
  const safeWebsiteUrl =
    profile.websiteUrl && /^https?:\/\//i.test(profile.websiteUrl)
      ? profile.websiteUrl
      : profile.websiteUrl && !/^[a-z]+:/i.test(profile.websiteUrl)
      ? `https://${profile.websiteUrl}`
      : null;

  const safeInstagram =
    profile.socialInstagram && /^https?:\/\//i.test(profile.socialInstagram)
      ? profile.socialInstagram
      : profile.socialInstagram && !/^[a-z]+:/i.test(profile.socialInstagram)
      ? `https://instagram.com/${profile.socialInstagram.replace(/^@/, "")}`
      : null;

  const safeFacebook =
    profile.socialFacebook && /^https?:\/\//i.test(profile.socialFacebook)
      ? profile.socialFacebook
      : profile.socialFacebook && !/^[a-z]+:/i.test(profile.socialFacebook)
      ? `https://${profile.socialFacebook}`
      : null;

  const safeTwitter =
    profile.socialTwitter && /^https?:\/\//i.test(profile.socialTwitter)
      ? profile.socialTwitter
      : profile.socialTwitter && !/^[a-z]+:/i.test(profile.socialTwitter)
      ? `https://x.com/${profile.socialTwitter.replace(/^@/, "")}`
      : null;

  const safeLinkedin =
    profile.socialLinkedin && /^https?:\/\//i.test(profile.socialLinkedin)
      ? profile.socialLinkedin
      : profile.socialLinkedin && !/^[a-z]+:/i.test(profile.socialLinkedin)
      ? `https://${profile.socialLinkedin}`
      : null;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: profile.displayName,
    alternateName: profile.businessName || undefined,
    description: profile.tagline || profile.bio || `${profile.category} in ${locationDisplay}`,
    url: canonicalUrl,
    telephone: profile.primaryPhone,
    email: profile.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: profile.addressText || undefined,
      addressLocality: profile.city,
      addressRegion: profile.district || profile.state || "Odisha",
      addressCountry: "IN",
    },
    image: profile.avatarUrl || undefined,
    sameAs: [safeWebsiteUrl, safeInstagram, safeFacebook, safeTwitter, safeLinkedin].filter(Boolean),
  };

  const theme = profile.themeColor || "#0F172A";

  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 flex items-center justify-center bg-[#000000] text-[#FFF3EA] space-grid-bg relative">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Hairline Telemetry Indicator */}
      <div className="w-full max-w-lg mx-auto">
        {/* Main 21hrs.space Phygital Smart Identity Chassis */}
        <article className="relative bg-[#050811]/95 border border-[#E4B592]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden">
          {/* 4 Precision Copper Corner Viewfinder Reticles */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E4B592] pointer-events-none z-30" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#E4B592] pointer-events-none z-30" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#E4B592] pointer-events-none z-30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E4B592] pointer-events-none z-30" />

          {/* Top Telemetry Header Band */}
          <div className="px-5 py-2.5 bg-[#000000]/80 border-b border-[#E4B592]/20 flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 text-[#E4B592] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E4B592] animate-pulse" />
              PHYGITAL IDENTITY CARD
            </span>
            <span className="tracking-wider text-slate-400">
              {profile.city.toUpperCase()} {"//"} 20°N 85°E
            </span>
          </div>

          {/* Header Accent Band with Theme Color */}
          <div
            style={{
              background: `linear-gradient(135deg, ${theme} 0%, #050811 100%)`,
            }}
            className="h-28 w-full relative flex items-center justify-between px-6 border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase bg-black/60 text-[#E4B592] px-2.5 py-1 border border-[#E4B592]/30">
                TOKEN: /u/{profile.usernameSlug}
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-mono tracking-wider">
              PRGI: ORORI/25/A3295
            </span>
          </div>

          {/* Profile Identity Body */}
          <div className="px-6 sm:px-8 pb-8 pt-0 -mt-12 text-center relative z-10">
            {/* Avatar Chassis */}
            <div
              className="w-24 h-24 rounded-sm bg-[#000000] border-2 border-[#E4B592] mx-auto mb-4 flex items-center justify-center text-2xl font-black text-[#FFF3EA] shadow-[0_0_25px_rgba(228,181,146,0.3)] overflow-hidden relative"
            >
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-mono tracking-wider text-[#E4B592]">{initials}</span>
              )}
            </div>

            {/* Odisha Regional Verification Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E4B592]/10 border border-[#E4B592]/40 text-[#E4B592] text-[11px] font-mono font-bold tracking-wider uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ପ୍ରଚାର ପ୍ରମାଣିତ // VERIFIED IDENTITY</span>
            </div>

            {/* Display Name & Meta */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#FFF3EA] tracking-tight leading-tight break-words font-sans">
              {profile.displayName}
            </h1>
            {profile.businessName && (
              <p className="text-sm font-medium text-slate-300 mt-1 break-words font-sans">
                {profile.businessName}
              </p>
            )}
            <p className="font-mono text-xs text-[#E4B592] mt-1.5 uppercase tracking-widest">
              {profile.category} • {locationDisplay}
            </p>

            {/* Tagline */}
            {profile.tagline && (
              <p className="text-xs italic text-slate-300 mt-3 px-2 leading-relaxed break-words font-sans">
                &ldquo;{profile.tagline}&rdquo;
              </p>
            )}

            {/* Bio Narrative */}
            {profile.bio && (
              <div className="mt-5 p-4 bg-[#000000]/60 border border-white/10 text-left font-sans">
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line break-words">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Address & Website details */}
            {(profile.addressText || safeWebsiteUrl) && (
              <div className="mt-4 space-y-2 text-left text-xs font-mono text-slate-300 bg-[#000000]/40 p-3.5 border border-white/10">
                {profile.addressText && (
                  <p className="flex items-start gap-2 break-words">
                    <span className="text-[#E4B592] flex-shrink-0" aria-hidden="true">GEO:</span>
                    <span>{profile.addressText}</span>
                  </p>
                )}
                {safeWebsiteUrl && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#E4B592] flex-shrink-0" aria-hidden="true">WEB:</span>
                    <a
                      href={safeWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E4B592] hover:underline truncate"
                      aria-label={`Visit ${profile.displayName}'s website`}
                    >
                      {safeWebsiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                )}
              </div>
            )}


            {/* Social Links */}
            {(safeInstagram || safeFacebook || safeTwitter || safeLinkedin) && (
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-2">Connect On Social</p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {safeInstagram && (
                    <a
                      href={safeInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="min-h-[36px] px-3 py-1.5 rounded-full bg-slate-800 hover:bg-pink-900/50 border border-slate-700 hover:border-pink-600 text-xs text-slate-300 hover:text-white transition font-medium flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-pink-500"
                    >
                      <span>📸</span>
                      <span>Instagram</span>
                    </a>
                  )}
                  {safeFacebook && (
                    <a
                      href={safeFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="min-h-[36px] px-3 py-1.5 rounded-full bg-slate-800 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-600 text-xs text-slate-300 hover:text-white transition font-medium flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span>👥</span>
                      <span>Facebook</span>
                    </a>
                  )}
                  {safeTwitter && (
                    <a
                      href={safeTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter / X"
                      className="min-h-[36px] px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 hover:text-white transition font-medium flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <span>𝕏</span>
                      <span>Twitter</span>
                    </a>
                  )}
                  {safeLinkedin && (
                    <a
                      href={safeLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="min-h-[36px] px-3 py-1.5 rounded-full bg-slate-800 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-600 text-xs text-slate-300 hover:text-white transition font-medium flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span>💼</span>
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Client Actions (Call, WhatsApp, Email, Save Contact, QR, Share) */}
            <ProfileClientActions profile={profile} />

            {/* Footer Attribution to Publisher */}
            <footer className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
              <p>
                A Unit of <strong>Saroswati Khabar</strong> • Reg: ORORI/25/A3295
              </p>
              <p>
                Printed at Chandan Printers, Unit-3, Bhubaneswar
              </p>
              <div className="pt-2">
                <Link href="/" className="text-orange-400 hover:underline font-medium">
                  Create your own Phygital Card on PRACHAR →
                </Link>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </main>
  );
}
