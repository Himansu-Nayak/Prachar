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
    };
  }

  const profile = res.data;
  const title = `${profile.displayName} | PRACHAR Phygital Profile`;
  const description = profile.tagline || profile.bio || `${profile.category} in ${profile.city}, Odisha. Verified by PRACHAR Phygital Platform.`;
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
  const initials = profile.displayName
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            <p className="text-xs text-orange-400 font-medium mt-1 uppercase tracking-wider">{profile.category}</p>
            <p className="text-xs text-slate-400 mt-0.5">{profile.city}, Odisha</p>

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

            {/* Interactive Actions (Call, WhatsApp, vCard, QR Modal) */}
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
