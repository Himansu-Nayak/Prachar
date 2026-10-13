import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Printer,
  Award,
  Phone,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";

import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "About PRACHAR — Editorial Heritage & Publishing Press",
  description:
    "Explore the story of PRACHAR, a unit of Saroswati Khabar. Discover our PRGI registration, leadership team, Chandan Printers press, and Odisha mission.",
  alternates: {
    canonical: "https://prachar.in/about",
  },
  openGraph: {
    title: "About PRACHAR — Editorial Heritage & Publishing Press",
    description:
      "Explore the story of PRACHAR, a unit of Saroswati Khabar. Discover our PRGI registration, leadership team, Chandan Printers press, and Odisha mission.",
    url: "https://prachar.in/about",
    type: "website",
    images: [{ url: "https://prachar.in/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PRACHAR — Editorial Heritage & Publishing Press",
    description:
      "Explore the story of PRACHAR, a unit of Saroswati Khabar. Discover our PRGI registration, leadership team, Chandan Printers press, and Odisha mission.",
    images: ["https://prachar.in/og-image.jpg"],
  },
};

export default function AboutPage() {
  const leadership = [
    {
      name: "Purusottam Sahu",
      role: "Publisher & Owner",
      phone: "+91 91788 98844",
      bio: "Founding publisher directing the physical door-to-door booklet distribution logistics and merchant network across Bhubaneswar.",
    },
    {
      name: "Ashutosh Mahalik",
      role: "Chief Editor",
      phone: "+91 79789 43757",
      bio: "Editorial lead overseeing community announcements, commercial verification, and Odia script typography standards.",
    },
    {
      name: "Himansu Nayak",
      role: "Lead Systems Architect",
      phone: "+91 70770 11733",
      bio: "Architect behind PRACHAR's cloud platform, dynamic QR routing engine, and contactless NFC digital identity infrastructure.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} className="mb-8" />

        {/* Header Title */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block mb-4">
            EDITORIAL HERITAGE &amp; CREDENTIALS
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] font-display">
            Rooted in Bhubaneswar. <br />
            <span className="text-neutral-400">Engineered for Modern Odisha.</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 mt-5 leading-relaxed font-normal">
            PRACHAR bridges high-trust neighborhood commercial publicity with enduring physical print and verified, search-indexed digital identity infrastructure.
          </p>
        </div>

        {/* Statutory Accreditation Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase font-bold text-neutral-400 block tracking-wider font-mono">
              PRGI REGISTRATION
            </span>
            <span className="text-lg font-bold text-white block mt-1 font-mono">
              ORORI/25/A3295
            </span>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Press Registrar General of India certified registered publication.
            </p>
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase font-bold text-neutral-400 block tracking-wider font-mono">
              MSME UDYAM
            </span>
            <span className="text-lg font-bold text-white block mt-1 font-mono">
              UDYAM-OD-04-0039313
            </span>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Ministry of MSME, Government of India accredited enterprise.
            </p>
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FFB703]/10 border border-[#FFB703]/20 flex items-center justify-center text-[#FFB703] mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase font-bold text-neutral-400 block tracking-wider font-mono">
              PUBLISHING HOUSE
            </span>
            <span className="text-lg font-bold text-white block mt-1 font-display">
              Saroswati Khabar
            </span>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              BJB Nagar, Bhubaneswar, Odisha — 751014.
            </p>
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Printer className="w-5 h-5" />
            </div>
            <span className="text-[11px] uppercase font-bold text-neutral-400 block tracking-wider font-mono">
              PRINTING PRESS
            </span>
            <span className="text-lg font-bold text-white block mt-1 font-display">
              Chandan Printers
            </span>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Gopabandhu Chhak, Unit-3, Bhubaneswar.
            </p>
          </div>
        </div>

        {/* Narrative & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-24">
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block mb-3">
                DISTRIBUTION PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-4">
                Why Free Door-to-Door Delivery Beats Newspaper Inserts.
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                When loose flyers are inserted inside daily newspapers, over 80% fall out unnoticed onto streets and entryways without ever being read.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                PRACHAR engineered a permanent alternative: a standalone, high-finish color publication designed to be retained on study tables and reception counters throughout the entire month.
              </p>

              <div className="space-y-3 pt-6 border-t border-white/10 text-sm text-neutral-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FFB703] flex-shrink-0" />
                  <span>Zero clutter: Only verified local Bhubaneswar businesses and community announcements</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FFB703] flex-shrink-0" />
                  <span>Full-color printing on heavy art-card paper at Chandan Printers, Unit-3</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FFB703] flex-shrink-0" />
                  <span>Strict 18th monthly submission cutoff guaranteeing 1st-of-month citywide circulation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block mb-3">
                THE PHYGITAL ARCHITECTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-4">
                From Static Print to Connected Digital Identity.
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                In 2026, under the technical architecture of Himansu Nayak, PRACHAR introduced the contactless smart card and dynamic edge QR architecture.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                Now, every business featured in the booklet automatically receives a permanent, search-indexed digital profile (<code className="text-[#FFB703] font-mono bg-white/5 px-2 py-0.5 rounded">/u/:username</code>) with zero reprinting overhead when contact details change.
              </p>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-xs text-neutral-300 space-y-2.5 font-mono">
                <p className="font-bold text-[#FFB703] uppercase tracking-wider">The Phygital Conversion Loop:</p>
                <p>1. Resident reads your full-color ad in the monthly physical directory.</p>
                <p>2. Resident scans your dynamic QR with their phone camera.</p>
                <p>3. Opens your verified cloud card, initiates 1-tap WhatsApp chat, and exports RFC 6350 vCard into contacts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership & Editorial Team */}
        <div className="mb-24">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block mb-3">
              LEADERSHIP &amp; DESK
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
              Editorial Board &amp; Operations.
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Committed to community transparency, fair pricing, and state-of-the-art publicity technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((person, idx) => (
              <div
                key={idx}
                className="bg-[#121214] border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFB703] font-mono font-bold text-sm mb-5">
                    {person.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {person.name}
                  </h3>
                  <span className="text-xs text-[#FFB703] font-mono font-semibold block mb-3">
                    {person.role}
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-normal">
                    {person.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 text-xs font-mono">
                  <a
                    href={`tel:${person.phone.replace(/[^0-9]/g, "")}`}
                    className="text-neutral-300 hover:text-[#FFB703] flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FFB703]" />
                    <span>{person.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational HQ & Jurisdiction Card */}
        <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#FFB703] font-mono block mb-1">
              OPERATIONAL HEADQUARTERS
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white font-display">
              Saroswati Khabar • Bhubaneswar, Odisha
            </h4>
            <p className="text-sm text-neutral-400 mt-1">
              Plot No. - BJB Nagar, Bhubaneswar, Odisha — 751014
            </p>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Legal Jurisdiction: All business activities governed under Bhubaneswar, Odisha courts.
            </p>
          </div>

          <Link
            href="/contact"
            className="rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm px-7 py-3.5 transition-all inline-flex items-center gap-2 flex-shrink-0 shadow-sm"
          >
            <span>Contact Booking Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
