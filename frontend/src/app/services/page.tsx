import type { Metadata } from "next";
import Link from "next/link";
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
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Publicity Services — Monthly Print & Digital Categories | PRACHAR",
  description:
    "Explore PRACHAR's commercial publicity solutions for Bhubaneswar: retail promotions, clinic announcements, coaching centers, festive greetings, and milestone celebrations across 50,000+ monthly doorstep copies.",
};

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: "retail",
      code: "01",
      icon: ShoppingBag,
      title: "Retail Stores, Dining & Commerce",
      odiaTitle: "ବ୍ୟବସାୟ, ଦୋକାନ ଓ ରେଷ୍ଟୁରାଣ୍ଟ",
      audience: "Supermarkets, sweet shops, apparel brands, jewelers, bakeries & electronics showrooms",
      corridors: "Saheed Nagar • Janpath • Nayapalli • Rasulgarh",
      description:
        "Announce seasonal discounts, new showroom openings, festive collections, and exclusive discount coupons directly to 50,000+ Bhubaneswar households.",
      features: ["Full-color CMYK photo placement", "Direct QR leading to WhatsApp ordering", "Door-to-door corridor delivery"],
    },
    {
      id: "healthcare",
      code: "02",
      icon: HeartPulse,
      title: "Clinics, Doctors & Diagnostics",
      odiaTitle: "ଡାକ୍ତରଖାନା, କ୍ଲିନିକ ଓ ପରୀକ୍ଷାଗାର",
      audience: "Polyclinics, specialist doctors, dental studios, physiotherapy, eye care & diagnostic labs",
      corridors: "AIIMS Square • Khandagiri • Nayapalli • Jayadev Vihar",
      description:
        "Build trusted local patient visibility. Publish visiting doctor schedules, specialized health checkup packages, and emergency ambulance hotlines.",
      features: ["Prescription booking QR", "Verified medical entity badge", "Permanent emergency hotline display"],
    },
    {
      id: "education",
      code: "03",
      icon: GraduationCap,
      title: "Schools, Coaching & Academies",
      odiaTitle: "କୋଚିଂ ସେଣ୍ଟର, ଟ୍ୟୁସନ ଓ ଶିକ୍ଷାନୁଷ୍ଠାନ",
      audience: "IIT/NEET coaching institutes, competitive exam centers, dance & music academies, English training",
      corridors: "Patia Infocity • Acharya Vihar • Master Canteen",
      description:
        "Launch annual admission drives and new batch announcements ahead of academic sessions. Direct parents to your syllabus brochure via dynamic QR.",
      features: ["Batch schedule timing tables", "One-tap parent inquiry hotline", "High student-pocket circulation density"],
    },
    {
      id: "professional",
      code: "04",
      icon: Briefcase,
      title: "Professional & Corporate Services",
      odiaTitle: "ପେସାଦାର ଓ ଘରୋଇ ସେବା",
      audience: "Advocates, chartered accountants, interior designers, architects, plumbers, electrical contractors",
      corridors: "BJB Nagar • Unit-3 • Saheed Nagar • Chandrasekharpur",
      description:
        "Ensure your name, credentials, and specialized service offerings are preserved on neighborhood desks and office tables all month long.",
      features: ["Direct vCard contact saving", "Pocket card size (P5) option", "Digital profile catalog listings"],
    },
    {
      id: "festivals",
      code: "05",
      icon: PartyPopper,
      title: "Festive Greetings & Community Wishes",
      odiaTitle: "ପର୍ବ ପର୍ବାଣି ର ଶୁଭେଚ୍ଛା",
      audience: "Community leaders, trade associations, corporate houses, socio-cultural clubs & prominent citizens",
      corridors: "Citywide 50,000+ Circulation All Corridors",
      description:
        "Publish warm greetings for Raja, Ratha Yatra, Durga Puja, Kali Puja, Kumar Purnima, Diwali, and New Year with rich regional Odia cultural aesthetic.",
      features: ["Vibrant thematic CMYK artwork", "Chief patron photo prominence", "Bilingual Odia & English formatting"],
    },
    {
      id: "milestones",
      code: "06",
      icon: Gift,
      title: "Personal Celebrations & Milestones",
      odiaTitle: "ଜନ୍ମଦିନ, ବିବାହ ବାର୍ଷିକୀ ଓ ଶ୍ରଦ୍ଧାଞ୍ଜଳି",
      audience: "Families, relatives, commemorative committees, alumni associations & personal tributes",
      corridors: "Selected Residential Societies & Postal Zones",
      description:
        "Honor loved ones on birthdays, 25th/50th wedding anniversaries, academic accomplishments, retirements, or memorable memorial tributes.",
      features: ["High-resolution photo print", "Custom commemorative typography", "Permanent digital keepsake URL"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-[#EDEDED] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
            <span>COMMERCIAL PUBLICITY SECTORS • BHUBANESWAR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] font-display">
            Tailored Publicity for Every Business &amp; Milestone.
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 mt-5 leading-relaxed font-normal">
            From high-density retail promotions across prime commercial corridors to intimate family milestone tributes, PRACHAR provides end-to-end print publication across 50,000+ doorstep copies and permanent digital identity.
          </p>
        </div>

        {/* 6 Core Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {serviceCategories.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-[#0E0E12] border border-white/10 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all group relative overflow-hidden"
              >
                {/* Subtle top accent hairline */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFB703]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFB703] group-hover:bg-[#FFB703]/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-500 group-hover:text-[#FFB703] transition-colors">
                      SECTOR {service.code}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-display mb-1.5">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#FFB703] font-serif italic mb-3">
                    {service.odiaTitle}
                  </p>
                  
                  <div className="mb-4 pb-3 border-b border-white/10 space-y-1.5 text-xs font-mono">
                    <p className="text-neutral-400">
                      <span className="text-neutral-200 font-semibold">Corridors:</span> {service.corridors}
                    </p>
                    <p className="text-neutral-400">
                      <span className="text-neutral-200 font-semibold">Audience:</span> {service.audience}
                    </p>
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed font-normal mb-6">
                    {service.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-2.5 pt-5 border-t border-white/10 text-xs text-neutral-300 mb-6 font-sans">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB703] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/advertise"
                    className="w-full rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium text-xs py-3 px-4 transition-all inline-flex items-center justify-center gap-2 group-hover:border-[#FFB703]/30"
                  >
                    <span>Reserve Package (P1–P5)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFB703]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Creative Studio Banner */}
        <div className="bg-[#0E0E12] border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FFB703] text-xs font-mono mb-4">
                <Palette className="w-3.5 h-3.5" />
                <span>COMPLIMENTARY CREATIVE STUDIO • BJB NAGAR</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-display mb-4">
                Don&apos;t Have a Designer? We Format &amp; Proof Your Ad for Free.
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6 font-normal">
                Simply send us your rough notes, storefront photos, logo, and contact details via WhatsApp. Our professional graphics desk at BJB Nagar formats a high-impact Odia/English layout and sends you a digital proof for approval before printing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-neutral-300">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Palette className="w-4 h-4 text-[#FFB703] flex-shrink-0" />
                  <span>Professional Typesetting</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Printer className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Chandan Printers Unit-3</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                  <CalendarCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Proof Approval by 18th</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <a
                href="https://wa.me/917077011733?text=Hello%20Prachar%2C%20I%20want%20to%20submit%20an%20ad%20for%20the%20upcoming%20Bhubaneswar%20booklet."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm py-3.5 px-6 transition-all inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Submit Copy on WhatsApp</span>
              </a>
              <Link
                href="/advertise"
                className="w-full rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium text-sm py-3 px-6 transition-all text-center"
              >
                Explore Rate Card Matrix
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly Cutoff Notice Card */}
        <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0E0E12] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFB703]/10 border border-[#FFB703]/20 flex items-center justify-center text-[#FFB703] flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-white text-base block font-display">
                Strict Monthly Cutoff: 18th of Every Month • 18:00 IST
              </span>
              <span className="text-xs text-neutral-400 font-sans mt-0.5 block">
                All advertising copy, proofs, and approvals close on the 18th for prompt 1st-of-month citywide door-to-door circulation.
              </span>
            </div>
          </div>

          <Link
            href="/contact"
            className="text-xs text-[#FFB703] hover:underline font-semibold font-mono whitespace-nowrap flex-shrink-0"
          >
            Contact Editorial Desk &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
