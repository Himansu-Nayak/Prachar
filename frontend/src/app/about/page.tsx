import type { Metadata } from "next";
import Link from "next/link";
import ReticleBox from "@/components/ui/ReticleBox";
import {
  ShieldCheck,
  Building2,
  Printer,
  Users,
  Award,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Editorial Heritage & Publishing Credentials",
  description:
    "Discover the story of PRACHAR, a registered unit of Saroswati Khabar. Learn about our PRGI registration, leadership team, printing press at Unit-3, and our free door-to-door distribution mission.",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-[#FFF3EA]">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <span className="reticle-badge mb-4">
          [FOUNDATION // ARCHIVE]
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF3EA] tracking-tight leading-tight mt-3 mb-6">
          Rooted in Bhubaneswar.{" "}
          <span className="text-[#E4B592]">
            Engineered for Modern Odisha.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#DAD0C8] font-mono leading-relaxed max-w-2xl mx-auto">
          PRACHAR bridges local neighborhood commerce with enduring physical print and verified digital identity infrastructure.
        </p>
      </div>

      {/* Legal Credentials Card */}
      <ReticleBox tag="REGISTRY.ACCREDITATION" telemetry="PRGI // UDYAM CERTIFIED" className="p-8 sm:p-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          <div className="p-5 border border-white/10 bg-[#000000]">
            <ShieldCheck className="w-6 h-6 text-sky-400 mb-3" />
            <span className="text-[10px] uppercase font-bold text-[#E4B592] block tracking-widest">PRGI REGISTRATION</span>
            <span className="text-base font-bold text-[#FFF3EA]">ORORI/25/A3295</span>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">Press Registrar General of India certified publication</p>
          </div>

          <div className="p-5 border border-white/10 bg-[#000000]">
            <Award className="w-6 h-6 text-amber-400 mb-3" />
            <span className="text-[10px] uppercase font-bold text-[#E4B592] block tracking-widest">MSME UDYAM</span>
            <span className="text-base font-bold text-[#FFF3EA]">UDYAM-OD-04-0039313</span>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">Ministry of MSME, Government of India accredited</p>
          </div>

          <div className="p-5 border border-white/10 bg-[#000000]">
            <Building2 className="w-6 h-6 text-[#E4B592] mb-3" />
            <span className="text-[10px] uppercase font-bold text-[#E4B592] block tracking-widest">PUBLISHING HOUSE</span>
            <span className="text-base font-bold text-[#FFF3EA]">Saroswati Khabar</span>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">BJB Nagar, Bhubaneswar, Odisha — 751014</p>
          </div>

          <div className="p-5 border border-white/10 bg-[#000000]">
            <Printer className="w-6 h-6 text-emerald-400 mb-3" />
            <span className="text-[10px] uppercase font-bold text-[#E4B592] block tracking-widest">PRINTING PRESS</span>
            <span className="text-base font-bold text-[#FFF3EA]">Chandan Printers</span>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">Gopabandhu Chhak, Unit-3, Bhubaneswar</p>
          </div>
        </div>
      </ReticleBox>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-24">
        <ReticleBox tag="PHILOSOPHY.PRINT" telemetry="DOOR-TO-DOOR CIRCULATION" className="lg:col-span-6 p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="reticle-badge mb-2">
              [DISTRIBUTION PHILOSOPHY]
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#FFF3EA] tracking-tight">
              Why Free Door-to-Door Delivery Beats Newspaper Inserts.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              When flyers are loosely inserted inside daily newspapers, over 80% slip out unnoticed onto floors and street corners without ever being read.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              PRACHAR created a permanent alternative: a standalone, high-finish color publication designed to be retained on study tables and store counters throughout the entire month.
            </p>
            <div className="space-y-2.5 pt-4 border-t border-white/10 font-sans text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#E4B592] flex-shrink-0" />
                <span>Zero clutter: Only verified local Bhubaneswar commerce and announcements</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#E4B592] flex-shrink-0" />
                <span>Full-color printing on heavy art-card stock at Chandan Printers, Unit-3</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#E4B592] flex-shrink-0" />
                <span>Strict 18th monthly submission cutoff ensuring 1st-of-month city circulation</span>
              </div>
            </div>
          </div>
        </ReticleBox>

        {/* Phygital Leap */}
        <ReticleBox tag="EVOLUTION.2026" telemetry="SMART CARDS &amp; QR ROUTER" className="lg:col-span-6 p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="reticle-badge mb-2">
              [THE 2026 LEAP]
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#FFF3EA] tracking-tight">
              The Phygital Leap: From Static Print to Connected Living Identity.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              In 2026, under the technical architecture of Himansu Nayak, PRACHAR introduced the smart card and dynamic QR architecture. Now, every business published in the booklet automatically receives a permanent, responsive digital identity profile (<code className="text-[#E4B592] font-mono">/u/:username</code>).
            </p>
            <div className="p-5 bg-[#000000] border border-white/15 text-xs text-slate-300 space-y-2.5 font-mono">
              <p className="font-bold text-[#E4B592] uppercase tracking-wider">The Phygital Feedback Loop:</p>
              <p>1. Reader views your advertisement in the physical booklet.</p>
              <p>2. Reader scans your dynamic QR with their smartphone camera.</p>
              <p>3. Opens your verified digital card, triggers instant WhatsApp chat, and downloads your vCard into contacts.</p>
            </div>
          </div>
        </ReticleBox>
      </div>

      {/* Leadership & Editorial Team */}
      <div className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="reticle-badge mb-3">
            [LEADERSHIP // BOARD]
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#FFF3EA] tracking-tight">
            Editorial Board &amp; Operations.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-2">
            Committed to community trust, fair pricing, and state-of-the-art technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((person, idx) => (
            <ReticleBox
              key={idx}
              tag={`EXECUTIVE.0${idx + 1}`}
              telemetry={person.role.toUpperCase()}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 flex items-center justify-center text-[#E4B592] font-mono font-bold text-sm mb-4 shadow-[0_0_15px_rgba(228,181,146,0.15)]">
                  {person.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="text-lg font-bold text-[#FFF3EA] font-mono">{person.name}</h3>
                <span className="text-xs text-[#E4B592] font-mono font-semibold block mb-3">{person.role}</span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">{person.bio}</p>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs font-mono">
                <a
                  href={`tel:${person.phone.replace(/[^0-9]/g, "")}`}
                  className="text-slate-300 hover:text-[#E4B592] flex items-center gap-2 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E4B592]" />
                  <span>{person.phone}</span>
                </a>
              </div>
            </ReticleBox>
          ))}
        </div>
      </div>

      {/* Office & Legal Dispatch */}
      <ReticleBox tag="HQ.COORDINATES" telemetry="BHUBANESWAR // JURISDICTION" className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-slate-400">
        <div>
          <span className="font-bold text-[#FFF3EA] block text-sm mb-1 uppercase tracking-wider">PRACHAR Operational Headquarters</span>
          <p className="text-slate-300">Plot No. - BJB Nagar, Bhubaneswar, Odisha — 751014</p>
          <p className="text-slate-500 mt-1">Legal Jurisdiction: All disputes subject to Bhubaneswar, Odisha courts only.</p>
        </div>

        <Link
          href="/contact"
          className="reticle-btn-primary whitespace-nowrap"
        >
          <span>CONTACT EDITORIAL DESK</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </ReticleBox>
    </div>
  );
}
