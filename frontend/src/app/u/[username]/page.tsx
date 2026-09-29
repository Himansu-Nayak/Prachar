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
      description: "This phygital profile has been suspended.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${profile.displayName}${profile.businessName ? ` (${profile.businessName})` : ""} | PRACHAR Phygital Profile`;
  const locationStr = [profile.city, profile.district, profile.state || "Odisha"].filter(Boolean).join(", ");
  const description = profile.tagline || profile.bio || `${profile.category} in ${locationStr}. Verified by PRACHAR Phygital Platform.`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonicalUrl = `${appUrl}/u/${profile.usernameSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "PRACHAR Phygital Platform",
      locale: "en_IN",
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
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
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
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
            className="inline-block py-2.5 px-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition"
          >
            Return to PRACHAR Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle Inactive Profile State
  if (profile.status === "INACTIVE") {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
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
            The profile owner has temporarily deactivated this phygital profile. Contact details and card services are currently unavailable. Please check back later.
          </p>
          <Link
            href="/"
            className="inline-block py-2.5 px-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition"
          >
            Explore PRACHAR →
          </Link>
        </div>
      </div>
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

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Main Phygital Card Container */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header Accent Band */}
          <div
            style={{ backgroundColor: profile.themeColor || "#0F172A" }}
            className="h-28 w-full relative flex items-center justify-between px-6 transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-black/40 text-white/90 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                PHYGITAL CARD
              </span>
            </div>
            <span className="text-[10px] text-white/80 font-mono tracking-wider">
              {profile.city}, OD
            </span>
          </div>

          {/* Profile Identity Body */}
          <div className="px-6 pb-8 pt-0 -mt-12 text-center relative z-10">
            {/* Avatar Circle */}
            <div
              style={{ borderColor: profile.themeColor || "#0F172A" }}
              className="w-24 h-24 rounded-full bg-slate-950 border-4 mx-auto mb-3 flex items-center justify-center text-2xl font-black text-white shadow-xl overflow-hidden"
            >
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="tracking-wider">{initials}</span>
              )}
            </div>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-800/80 text-orange-400 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>ପ୍ରଚାର ପ୍ରମାଣିତ (Verified Identity)</span>
            </div>

            {/* Display Name & Meta */}
            <h1 className="text-2xl font-bold text-white leading-tight">{profile.displayName}</h1>
            {profile.businessName && (
              <p className="text-sm font-medium text-slate-300 mt-0.5">{profile.businessName}</p>
            )}
            <p className="text-xs text-orange-400 font-medium mt-1 uppercase tracking-wider">{profile.category}</p>
            <p className="text-xs text-slate-400 mt-0.5">{locationDisplay}</p>

            {/* Tagline */}
            {profile.tagline && (
              <p className="text-xs italic text-slate-300 mt-3 px-4 leading-relaxed">
                &ldquo;{profile.tagline}&rdquo;
              </p>
            )}

            {/* Bio Narrative */}
            {profile.bio && (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left">
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </div>
            )}

            {/* Address & Website details */}
            {(profile.addressText || profile.websiteUrl) && (
              <div className="mt-4 space-y-1.5 text-left text-xs text-slate-400 bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
                {profile.addressText && (
                  <p className="flex items-start gap-2">
                    <span className="text-slate-500">📍</span>
                    <span>{profile.addressText}</span>
                  </p>
                )}
                {profile.websiteUrl && (
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500">🌐</span>
                    <a
                      href={profile.websiteUrl.startsWith("http") ? profile.websiteUrl : `https://${profile.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline truncate"
                    >
                      {profile.websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* Social Links */}
            {(profile.socialInstagram || profile.socialFacebook || profile.socialTwitter || profile.socialLinkedin) && (
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-2">Connect On Social</p>
                <div className="flex items-center justify-center gap-3">
                  {profile.socialInstagram && (
                    <a
                      href={profile.socialInstagram.startsWith("http") ? profile.socialInstagram : `https://instagram.com/${profile.socialInstagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-pink-900/50 border border-slate-700 hover:border-pink-600 text-xs text-slate-300 hover:text-white transition font-medium"
                    >
                      Instagram
                    </a>
                  )}
                  {profile.socialFacebook && (
                    <a
                      href={profile.socialFacebook.startsWith("http") ? profile.socialFacebook : `https://${profile.socialFacebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-600 text-xs text-slate-300 hover:text-white transition font-medium"
                    >
                      Facebook
                    </a>
                  )}
                  {profile.socialTwitter && (
                    <a
                      href={profile.socialTwitter.startsWith("http") ? profile.socialTwitter : `https://x.com/${profile.socialTwitter.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter / X"
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 hover:text-white transition font-medium"
                    >
                      𝕏 (Twitter)
                    </a>
                  )}
                  {profile.socialLinkedin && (
                    <a
                      href={profile.socialLinkedin.startsWith("http") ? profile.socialLinkedin : `https://${profile.socialLinkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-600 text-xs text-slate-300 hover:text-white transition font-medium"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Actions (Call, WhatsApp, Share, Download QR) */}
            <ProfileClientActions profile={profile} />

            {/* Footer Attribution */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
