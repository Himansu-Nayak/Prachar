"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, FileCheck2, Lock, Scale, Printer, CheckCircle2 } from "lucide-react";
import ReticleBox from "@/components/ui/ReticleBox";

export default function TrustSection() {
  const accreditations = [
    {
      code: "PRGI",
      title: "Press Registrar General of India",
      reg: "ORORI/25/A3295",
      description: "Official statutory registration for print periodical circulation and advertising.",
      icon: Award,
    },
    {
      code: "MSME",
      title: "Government of India Udyam",
      reg: "UDYAM-OD-04-0039313",
      description: "Verified micro-enterprise registered under Ministry of MSME, Odisha.",
      icon: FileCheck2,
    },
    {
      code: "DPDP 2023",
      title: "Data Protection Act Compliance",
      reg: "SHA-256 IP HASHING",
      description: "QR scan telemetry strictly hashes IP addresses. Zero personal profiling or cookie trackers.",
      icon: Lock,
    },
    {
      code: "PRESS SYNC",
      title: "Chandan Printers, Unit-3",
      reg: "50,000+ COPIES CERTIFIED",
      description: "Direct four-color offset press run audited and certified monthly in Bhubaneswar.",
      icon: Printer,
    },
  ];

  return (
    <section className="relative w-full border-t border-[#E4B592]/20 bg-[#050811] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(228,181,146,0.04)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="reticle-badge mb-3">
            [SYS.REGULATORY.AUDIT]
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFF3EA] tracking-tight">
            Institutional Trust &amp; Accreditation.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-3">
            PRACHAR operates under official statutory registrations and verified circulation audits.
          </p>
        </div>

        {/* Statutory Accreditation Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden shadow-2xl">
          {accreditations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#070B14] p-6 sm:p-8 flex flex-col justify-between transition-colors hover:bg-[#0B1222] group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#E4B592] group-hover:border-[#FF8800]/50 group-hover:text-[#FF8800] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#FF8800] uppercase tracking-wider">
                        {item.code}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      VERIFIED
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                      {item.title}
                    </h3>
                    <div className="font-mono text-xs text-[#E4B592] font-semibold bg-white/5 px-2.5 py-1.5 rounded-sm inline-block my-3 border border-white/5">
                      {item.reg}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-white/5 font-mono text-[10px] text-slate-500 flex items-center justify-between">
                  <span>STATUTORY AUDIT: VERIFIED</span>
                  <span className="text-slate-400">BHUBANESWAR JURISDICTION</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
