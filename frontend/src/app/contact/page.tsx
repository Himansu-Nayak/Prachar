"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Ad Booking (P1–P5)");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Contact & Editorial Booking Desk | PRACHAR";
  }, []);

  const faqs = [
    {
      q: "What is the monthly submission cutoff date?",
      a: "All advertisement bookings, creative artwork, and proof approvals strictly close on the 18th of every month at 18:00 IST. This ensures our printing schedule at Chandan Printers (Unit-3) completes on time for free direct door-to-door distribution starting on the 1st of the next month.",
    },
    {
      q: "I don't have an advertisement design ready. Can PRACHAR design it?",
      a: "Yes! PRACHAR provides complimentary creative studio support. Simply send your shop photos, offers, logo, and text via WhatsApp to +91 70770 11733. Our graphics desk at BJB Nagar will format a professional Odia or English layout and send you a proof for approval before printing.",
    },
    {
      q: "Where is the physical booklet distributed in Bhubaneswar?",
      a: "Over 50,000 copies are hand-delivered across major commercial corridors (Saheed Nagar, Patia Infocity, Master Canteen, Jayadev Vihar, Nayapalli) and prominent residential societies (BJB Nagar, Chandrasekharpur, Khandagiri).",
    },
    {
      q: "How does the Dynamic QR code on my printed ad work?",
      a: "Your printed ad includes a dedicated QR code (/qr/:uuid). When customers scan it, it immediately redirects to your verified PRACHAR digital card (/u/:username) where they can start a direct WhatsApp chat, call you with one tap, or save your business card to their contacts.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim();
    if (!name.trim()) {
      setError("Please provide your full name or business name.");
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number so we can contact you.");
      return;
    }

    setLoading(true);
    // Simulate immediate smooth intake confirmation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header Title Section */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block mb-4">
            COMMUNICATION DESK
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] font-display">
            Connect with the Editorial &amp; Booking Desk.
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 mt-5 leading-relaxed font-normal">
            Have questions regarding print placements, P1–P5 rate cards, or your contactless NFC business card? Connect directly with our Bhubaneswar operations desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-24">
          {/* Direct Desks Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121214] border border-white/10 rounded-2xl p-7 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white font-display">
                  Direct Operational Channels
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FFB703]/10 text-[#FFB703] font-semibold border border-[#FFB703]/20">
                  Bhubaneswar
                </span>
              </div>

              <div className="space-y-5 text-sm text-neutral-300">
                {/* Phones */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFB703] flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-xs uppercase tracking-wider font-mono">
                      Telephone Hotlines
                    </span>
                    <a
                      href="tel:7077011733"
                      className="text-base font-bold text-white hover:text-[#FFB703] block transition mt-0.5"
                    >
                      +91 70770 11733
                    </a>
                    <a
                      href="tel:9178898844"
                      className="text-sm font-semibold text-neutral-300 hover:text-[#FFB703] block transition"
                    >
                      +91 91788 98844
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-xs uppercase tracking-wider font-mono">
                      WhatsApp Booking Desk
                    </span>
                    <a
                      href="https://wa.me/917077011733?text=Hello%20Prachar%20Team%2C%20I%20would%20like%20to%20inquire%20about%20advertising%20in%20the%20upcoming%20Bhubaneswar%20edition."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <span>Chat on WhatsApp (+91 70770 11733)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-xs uppercase tracking-wider font-mono">
                      Official Dispatch Email
                    </span>
                    <a
                      href="mailto:pracharbbsr1@gmail.com"
                      className="text-sm font-semibold text-white hover:text-sky-300 transition mt-0.5 block break-all"
                    >
                      pracharbbsr1@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#FFB703]" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-xs uppercase tracking-wider font-mono">
                      Editorial Headquarters
                    </span>
                    <p className="text-sm text-white font-medium mt-0.5">
                      BJB Nagar, Bhubaneswar, Odisha — 751014
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Legal jurisdiction: Bhubaneswar, Odisha only
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#FFB703]" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-xs uppercase tracking-wider font-mono">
                      Desk Working Hours
                    </span>
                    <p className="text-sm text-white font-medium mt-0.5">
                      Monday – Saturday: 9:30 AM – 7:30 PM IST
                    </p>
                    <p className="text-xs text-[#FFB703] font-semibold mt-0.5">
                      24/7 Digital Intake Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Accreditation Card */}
            <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFB703]/10 border border-[#FFB703]/20 flex items-center justify-center text-[#FFB703]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono">
                    Statutory Accreditation
                  </h3>
                  <p className="text-xs text-neutral-400">
                    PRGI: ORORI/25/A3295 • Udyam: UDYAM-OD-04-0039313
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                className="text-xs text-[#FFB703] hover:underline font-semibold flex-shrink-0"
              >
                View Archive &rarr;
              </Link>
            </div>
          </div>

          {/* Inquiry Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-[#121214] border border-white/10 rounded-2xl p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-white font-display mb-2">
                Send an Online Inquiry
              </h2>
              <p className="text-sm text-neutral-400 mb-8 font-normal leading-relaxed">
                Provide your campaign specifications below. Our editorial booking desk will review your submission and contact you within 2 business hours.
              </p>

              {submitted ? (
                <div className="p-8 bg-black/60 border border-emerald-500/30 rounded-2xl text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed font-normal">
                    Thank you, <strong className="text-white">{name}</strong>. Our editorial team at BJB Nagar has logged your request and will call you back at <strong className="text-[#FFB703]">{phone}</strong> shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setPhone("");
                        setEmail("");
                        setMessage("");
                      }}
                      className="rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-6 py-2.5 transition-all"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono"
                      >
                        Name / Business Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priyabrata Mohapatra"
                        className="w-full px-4 py-3 bg-[#18181B] border border-white/10 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono"
                      >
                        10-Digit Mobile Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 bg-[#18181B] border border-white/10 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono"
                      >
                        Email Address (Optional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. business@gmail.com"
                        className="w-full px-4 py-3 bg-[#18181B] border border-white/10 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono"
                      >
                        Inquiry Category
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-[#18181B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFB703] transition-colors"
                      >
                        <option>Ad Booking (P1–P5)</option>
                        <option>NFC Smart Business Card</option>
                        <option>Distribution &amp; Delivery Inquiry</option>
                        <option>Editorial / Community Announcement</option>
                        <option>Press / Partnership Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 font-mono"
                    >
                      Message / Campaign Specifications
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your business, preferred advertising package, or specific requirements..."
                      className="w-full px-4 py-3 bg-[#18181B] border border-white/10 rounded-xl text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:border-[#FFB703] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#FFB703] hover:bg-amber-400 text-black font-bold text-sm sm:text-base py-3.5 transition-all inline-flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Dispatch Inquiry to Editorial Desk</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions (FAQ) Section */}
        <div className="pt-20 border-t border-white/10">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] font-mono block mb-3">
              KNOWLEDGE BASE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
              Frequently Asked Questions.
            </h2>
            <p className="text-sm text-neutral-400 mt-3">
              Essential answers regarding production deadlines, distribution corridors, and dynamic QR routing.
            </p>
          </div>

          <div className="max-w-3xl space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#121214] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 text-base font-bold text-white hover:text-[#FFB703] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-[#FFB703]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
