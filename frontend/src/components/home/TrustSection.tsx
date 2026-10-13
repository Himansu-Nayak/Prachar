"use client";

import React from "react";
import { Award, FileCheck2, Lock, Printer, CheckCircle2 } from "lucide-react";

export default function TrustSection() {
  const accreditations = [
    {
      code: "PRGI",
      title: "Press Registrar General of India",
      reg: "ORORI/25/A3295",
      description: "Official statutory registration for print periodical circulation and commercial publicity.",
      icon: Award,
    },
    {
      code: "MSME UDYAM",
      title: "Government of India Udyam",
      reg: "UDYAM-OD-04-0039313",
      description: "Verified micro-enterprise registered under Ministry of MSME, Govt of India.",
      icon: FileCheck2,
    },
    {
      code: "PRESS AUDIT",
      title: "Chandan Printers, Unit-3",
      reg: "50,000+ COPIES AUDITED",
      description: "Direct four-color sheet-fed offset press run audited and certified monthly in Bhubaneswar.",
      icon: Printer,
    },
    {
      code: "DPDP 2023",
      title: "Data Protection Compliance",
      reg: "SHA-256 IP HASHING",
      description: "QR scan telemetry strictly hashes IP addresses. Zero personal profiling or third-party cookies.",
      icon: Lock,
    },
  ];

  return (
    <section className="relative w-full bg-[#0E0E10] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
              Credibility &amp; Compliance
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              Built on verified proof. <br />
              <span className="text-neutral-400">Not algorithms.</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Every edition of PRACHAR operates under statutory government registrations and verified street-level distribution audits in Bhubaneswar.
          </div>
        </div>

        {/* Large Numbers Trust Strip (Phase 10) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-white/10">
          <div>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display block">
              50,000+
            </span>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono mt-2 block">
              Monthly Print Copies
            </span>
          </div>

          <div>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display block">
              8 Hubs
            </span>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono mt-2 block">
              Bhubaneswar Corridors
            </span>
          </div>

          <div>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display block">
              18th
            </span>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono mt-2 block">
              Monthly Press Cutoff
            </span>
          </div>

          <div>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FFB703] font-display block">
              100%
            </span>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono mt-2 block">
              Direct Doorstep Drop
            </span>
          </div>
        </div>

        {/* Statutory Accreditation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accreditations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#121214] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FFB703]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {item.code}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    <h3 className="text-lg font-bold text-white font-display">
                      {item.title}
                    </h3>
                    <code className="text-xs font-mono text-[#FFB703] bg-black/40 px-2.5 py-1 rounded inline-block">
                      {item.reg}
                    </code>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed pt-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-neutral-400">
                  Saroswati Khabar • Bhubaneswar Jurisdiction
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase 11 — Editorial Testimonial (Brand Appart style large quote) */}
        <div className="bg-[#141417] border border-white/10 rounded-3xl p-8 sm:p-14 lg:p-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-6 font-mono">
            Social Proof &amp; Local Partner
          </span>
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight font-display tracking-tight">
            &ldquo;In local healthcare, social media ads vanish the second someone scrolls. Having our hospital featured in Prachar&apos;s monthly print directory with a direct QR to our OPD booking gave us real, lasting patients from Saheed Nagar and Nayapalli.&rdquo;
          </blockquote>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-base font-bold text-white font-display">
                Dr. S. K. Mohapatra
              </div>
              <div className="text-xs text-neutral-400">
                Medical Director • Utkal Healthcare Network, Nayapalli
              </div>
            </div>

            <div className="text-xs font-mono text-[#FFB703]">
              Featured Client • 6 Consecutive Editions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
