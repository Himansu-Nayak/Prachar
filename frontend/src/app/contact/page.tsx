"use client";

import React, { useState } from "react";
import Link from "next/link";
import ReticleBox from "@/components/ui/ReticleBox";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Radio,
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

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    // Simulate brief processing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-[#FFF3EA]">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <span className="reticle-badge mb-4">
          [COMMUNICATOR // MISSION_DISPATCH]
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFF3EA] tracking-tight leading-tight mt-3 mb-6">
          Connect with the Editorial &amp; Booking Desk.
        </h1>
        <p className="text-sm sm:text-base text-[#DAD0C8] font-mono leading-relaxed max-w-2xl mx-auto">
          Have inquiries regarding print booklet placements, rate cards, or your smart NFC business card? Connect directly with our Bhubaneswar operations team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <ReticleBox tag="CHANNELS.DIRECT" telemetry="HOTLINE 24/7" className="p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#FFF3EA] font-mono mb-4 flex items-center gap-2">
              <span className="text-[#E4B592]">[01]</span> DIRECT DESKS
            </h2>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 flex items-center justify-center text-[#E4B592] flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Telephone Hotlines</span>
                  <a href="tel:7077011733" className="text-sm font-bold text-white hover:text-[#E4B592] block transition">
                    +91 70770 11733
                  </a>
                  <a href="tel:9178898844" className="text-sm font-bold text-white hover:text-[#E4B592] block transition">
                    +91 91788 98844
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">WhatsApp Booking Desk</span>
                  <a
                    href="https://wa.me/917077011733?text=Hello%20Prachar%20Team%2C%20I%20would%20like%20to%20inquire%20about%20advertising%20in%20the%20upcoming%20Bhubaneswar%20edition."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:underline"
                  >
                    Chat on WhatsApp (+91 70770 11733) &rarr;
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-sky-950/40 border border-sky-500/40 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Official Dispatch Email</span>
                  <a href="mailto:pracharbbsr1@gmail.com" className="text-xs font-bold text-white hover:text-sky-400 transition">
                    pracharbbsr1@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#E4B592]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Editorial Headquarters</span>
                  <p className="text-xs text-white">Plot No. - BJB Nagar, Bhubaneswar, Odisha — 751014</p>
                  <p className="text-[10px] text-slate-400 mt-1">Jurisdiction: Bhubaneswar, Odisha only</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#E4B592]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Desk Working Hours</span>
                  <p className="text-xs text-white">Monday – Saturday: 9:30 AM – 7:30 PM IST</p>
                  <p className="text-[10px] text-[#E4B592] font-bold">24/7 Digital Intake Active</p>
                </div>
              </div>
            </div>
          </ReticleBox>
        </div>

        {/* Interactive Inquiry Form */}
        <div className="lg:col-span-7">
          <ReticleBox tag="DISPATCH.TERMINAL" telemetry="TRANSMISSION GATEWAY" className="p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFF3EA] font-mono mb-2">Send an Inquiry</h2>
            <p className="text-xs text-slate-400 mb-8 font-sans">
              Enter your details below and our editorial booking desk will respond within 2 operational hours.
            </p>

            {submitted ? (
              <div className="p-8 bg-[#000000] border border-[#E4B592]/50 text-center space-y-4">
                <div className="w-12 h-12 rounded-sm bg-[#E4B592]/10 border border-[#E4B592] flex items-center justify-center text-[#E4B592] mx-auto shadow-[0_0_20px_rgba(228,181,146,0.3)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#FFF3EA] font-mono">Inquiry Registered!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
                  Thank you, <strong className="text-white">{name}</strong>. Our editorial desk at BJB Nagar has received your message and will call you back at <strong className="text-[#E4B592]">{phone}</strong> shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setMessage("");
                    }}
                    className="text-xs text-[#E4B592] font-mono uppercase tracking-wider hover:underline"
                  >
                    Submit another inquiry &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-mono">
                {error && (
                  <div className="p-4 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Your Name / Business Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priyabrata Mohapatra"
                      className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. business@gmail.com"
                      className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Inquiry Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs focus:outline-none focus:border-[#E4B592] transition"
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
                  <label htmlFor="message" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Message / Campaign Specifications
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your business, preferred ad package or upcoming festival announcement..."
                    className="w-full px-4 py-3 bg-[#000000] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#E4B592] transition font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="reticle-btn-primary w-full text-center"
                >
                  {loading ? (
                    <span>TRANSMITTING...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>DISPATCH INQUIRY TO EDITORIAL DESK</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </ReticleBox>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="pt-16 border-t border-[#E4B592]/20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="reticle-badge mb-3">
            [KNOWLEDGE_BASE // FAQ]
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#FFF3EA] tracking-tight">
            Frequently Asked Questions.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <ReticleBox
                key={idx}
                tag={`QUERY.0${idx + 1}`}
                telemetry={isOpen ? "OPEN" : "COLLAPSED"}
                className="overflow-hidden p-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-mono text-xs sm:text-sm font-bold text-[#FFF3EA] hover:text-[#E4B592] transition"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-[#E4B592]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3 font-sans">
                    {faq.a}
                  </div>
                )}
              </ReticleBox>
            );
          })}
        </div>
      </div>
    </div>
  );
}
