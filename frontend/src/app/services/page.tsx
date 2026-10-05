import type { Metadata } from "next";
import Link from "next/link";
import ReticleBox from "@/components/ui/ReticleBox";
import {
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Briefcase,
  PartyPopper,
  Gift,
  ArrowRight,
  Palette,
  Clock,
  Printer,
  CalendarCheck,
  CheckCircle2,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Publicity Services — Monthly Print & Digital Categories",
  description:
    "Explore PRACHAR's commercial publicity solutions for Bhubaneswar: retail promotions, clinic announcements, coaching centers, festive greetings, and milestone celebrations.",
};

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: "retail",
      code: "SECTOR.01",
      icon: ShoppingBag,
      title: "Retail Stores, Dining & Commerce",
      odiaTitle: "ବ୍ୟବସାୟ, ଦୋକାନ ଓ ରେଷ୍ଟୁରାଣ୍ଟ",
      audience: "Supermarkets, sweet shops, apparel brands, jewelers, bakeries & electronics showrooms",
      description:
        "Announce seasonal discounts, new showroom openings, festive collections, and exclusive discount coupons directly to 50,000+ Bhubaneswar households.",
      features: ["Full-color photo placement", "Direct QR leading to WhatsApp ordering", "Targeted neighborhood distribution"],
    },
    {
      id: "healthcare",
      code: "SECTOR.02",
      icon: HeartPulse,
      title: "Clinics, Doctors & Diagnostics",
      odiaTitle: "ଡାକ୍ତରଖାନା, କ୍ଲିନିକ ଓ ପରୀକ୍ଷାଗାର",
      audience: "Polyclinics, specialist doctors, dental studios, physiotherapy, eye care & diagnostic labs",
      description:
        "Build trusted local patient visibility. Publish visiting doctor schedules, specialized health checkup packages, and emergency ambulance hotlines.",
      features: ["Prescription booking QR", "Verified medical entity badge", "Permanent emergency hotline display"],
    },
    {
      id: "education",
      code: "SECTOR.03",
      icon: GraduationCap,
      title: "Schools, Coaching & Academies",
      odiaTitle: "କୋଚିଂ ସେଣ୍ଟର, ଟ୍ୟୁସନ ଓ ଶିକ୍ଷାନୁଷ୍ଠାନ",
      audience: "IIT/NEET coaching institutes, competitive exam centers, dance & music academies, English training",
      description:
        "Launch annual admission drives and new batch announcements ahead of academic sessions. Direct parents to your syllabus brochure via dynamic QR.",
      features: ["Batch schedule timing tables", "One-tap parent inquiry hotline", "High student-pocket circulation density"],
    },
    {
      id: "professional",
      code: "SECTOR.04",
      icon: Briefcase,
      title: "Professional & Home Services",
      odiaTitle: "ପେସାଦାର ଓ ଘରୋଇ ସେବା",
      audience: "Advocates, chartered accountants, interior designers, architects, plumbers, electrical contractors",
      description:
        "Ensure your name, credentials, and specialized service offerings are preserved on neighborhood desks and office tables all month long.",
      features: ["Direct vCard contact saving", "Pocket card size (P5) option", "Digital profile catalog listings"],
    },
    {
      id: "festivals",
      code: "SECTOR.05",
      icon: PartyPopper,
      title: "Festive Greetings & Community Wishes",
      odiaTitle: "ପର୍ବ ପର୍ବାଣି ର ଶୁଭେଚ୍ଛା",
      audience: "Community leaders, trade associations, corporate houses, socio-cultural clubs & prominent citizens",
      description:
        "Publish warm greetings for Raja, Ratha Yatra, Durga Puja, Kali Puja, Kumar Purnima, Diwali, and New Year with rich regional Odia cultural aesthetic.",
      features: ["Vibrant thematic artwork", "Chief patron photo prominence", "Bilingual Odia & English formatting"],
    },
    {
      id: "milestones",
      code: "SECTOR.06",
      icon: Gift,
      title: "Personal Celebrations & Milestones",
      odiaTitle: "ଜନ୍ମଦିନ, ବିବାହ ବାର୍ଷିକୀ ଓ ଶ୍ରଦ୍ଧାଞ୍ଜଳି",
      audience: "Families, relatives, commemorative committees, alumni associations & personal tributes",
      description:
        "Honor loved ones on birthdays, 25th/50th wedding anniversaries, academic accomplishments, retirements, or memorable memorial tributes.",
      features: ["High-resolution photo print", "Custom commemorative typography", "Permanent digital keepsake URL"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-[#FFF3EA]">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <span className="reticle-badge mb-4">
          [COMMERCIAL_SERVICES // BHUBANESWAR_GRID]
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF3EA] tracking-tight leading-tight mt-3 mb-6">
          Tailored Publicity for Every Business &amp; Milestone.
        </h1>
        <p className="text-sm sm:text-base text-[#DAD0C8] font-mono leading-relaxed max-w-2xl mx-auto">
          From retail storefront promotions across prime commercial hubs to intimate family milestone tributes, PRACHAR provides end-to-end print publication and permanent digital identity.
        </p>
      </div>

      {/* 6 Core Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {serviceCategories.map((service) => {
          const Icon = service.icon;
          return (
            <ReticleBox
              key={service.id}
              tag={service.code}
              telemetry="ODISHA GRID"
              className="p-8 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 flex items-center justify-center text-[#E4B592] mb-6 shadow-[0_0_15px_rgba(228,181,146,0.15)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#FFF3EA] mb-1 font-mono">{service.title}</h3>
                <p className="text-xs text-[#E4B592] font-serif mb-3">{service.odiaTitle}</p>
                <p className="text-[11px] text-slate-400 font-mono mb-3 border-b border-white/5 pb-2">
                  <span className="text-[#E4B592]">TARGET:</span> {service.audience}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                  {service.description}
                </p>
              </div>

              <div>
                <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-slate-300 font-sans mb-6">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E4B592] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/advertise"
                  className="reticle-btn-secondary w-full text-center"
                >
                  <span>SELECT AD PACKAGE (P1–P5)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E4B592]" />
                </Link>
              </div>
            </ReticleBox>
          );
        })}
      </div>

      {/* In-House Design & Production Support Banner */}
      <ReticleBox tag="STUDIO.SUPPORT" telemetry="CHANDAN PRINTERS PRESS" className="p-8 sm:p-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <span className="reticle-badge mb-3">
              [COMPLIMENTARY CREATIVE STUDIO]
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#FFF3EA] tracking-tight mt-2 mb-4">
              Don&apos;t Have a Designer? We Format &amp; Proof Your Ad for Free.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              Simply send us your rough notes, shop photos, logo, and contact details via WhatsApp. Our professional graphics desk at BJB Nagar will format a high-impact Odia/English advertisement layout and send you a proof before printing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-[#E4B592] flex-shrink-0" />
                <span>Professional Typesetting</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Chandan Printers Unit-3</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Proof Approval by 18th</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 font-mono">
            <a
              href="https://wa.me/917077011733?text=Hello%20Prachar%2C%20I%20want%20to%20submit%20an%20ad%20for%20the%20upcoming%20Bhubaneswar%20booklet."
              target="_blank"
              rel="noopener noreferrer"
              className="reticle-btn-primary w-full text-center"
            >
              <span>SUBMIT COPY ON WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/advertise"
              className="reticle-btn-secondary w-full text-center"
            >
              <span>EXPLORE RATE CARDS</span>
            </Link>
          </div>
        </div>
      </ReticleBox>

      {/* Editorial Calendar & Deadlines */}
      <div className="p-6 bg-[#070B14] border border-[#E4B592]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#E4B592] flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-bold text-[#FFF3EA] text-sm block">Strict Monthly Cutoff: 18th of Every Month // 18:00 IST</span>
            <span className="text-slate-400">All copy, proofs, and approvals close on the 18th for prompt 1st-of-month city circulation.</span>
          </div>
        </div>

        <Link
          href="/contact"
          className="text-[#E4B592] hover:text-white transition-colors whitespace-nowrap font-bold"
        >
          CONTACT EDITORIAL DESK &rarr;
        </Link>
      </div>
    </div>
  );
}
