"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Printer, Truck, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Monthly Editorial Cutoff",
      odia: "ମାସିକ ୧୮ ତାରିଖ ବୁକିଂ",
      schedule: "18th of Every Month at 18:00 IST",
      description:
        "Select your advertising format (P1 Full Page Cover to P5 Business Card). Upload your creative artwork or collaborate with our in-house designers. Digital proofs approved within 24 hours.",
      highlight: "Strict Monthly Cutoff for Press Plate Preparation",
      icon: Calendar,
    },
    {
      num: "02",
      title: "Precision Press Run",
      odia: "ଚନ୍ଦନ ପ୍ରିଣ୍ଟର୍ସ, ୟୁନିଟ-୩",
      schedule: "Chandan Printers Unit-3 Press, Bhubaneswar",
      description:
        "Printed on high-grade coated art stock using vibrant four-color offset machinery. High-definition reproduction ensures sharp typography and crystal-clear QR scannability.",
      highlight: "50,000+ Verified Circulation Print Run",
      icon: Printer,
    },
    {
      num: "03",
      title: "Direct Doorstep Logistics",
      odia: "ଘରେ ଘରେ ସିଧାସଳଖ ବଣ୍ଟନ",
      schedule: "Dedicated Prachar Delivery Fleet",
      description:
        "We do not loosely insert flyers into newspapers. Dedicated, uniform delivery teams hand-deliver bound booklets directly to doorsteps, offices, retail stores, and clinic waiting rooms.",
      highlight: "Zero Discard Rate • Direct Handover",
      icon: Truck,
    },
  ];

  return (
    <section className="relative w-full bg-[#F3F1EC] text-[#121212] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-black/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-24 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500 block mb-3 font-mono">
              The Press Choreography
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121212] tracking-tight leading-[1.04] font-display">
              From reservation <br />
              <span className="text-neutral-500">to 50,000 doorsteps.</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            Every edition follows a disciplined, verified calendar synchronized with Chandan Printers Unit-3 offset press operations and dedicated street-level logistics teams.
          </div>
        </div>

        {/* 3 Editorial Process Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white border border-neutral-200/80 rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                    <span className="text-3xl font-black text-neutral-900 font-display">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <h3 className="text-xl font-bold text-neutral-900 font-display">
                      {step.title}
                    </h3>
                    <p className="text-xs font-serif text-amber-700">
                      {step.odia}
                    </p>
                    <p className="text-xs font-mono text-neutral-500 font-medium">
                      {step.schedule}
                    </p>
                    <p className="text-sm text-neutral-600 leading-relaxed pt-2">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-100 text-xs font-mono font-semibold text-neutral-800">
                  {step.highlight}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-8 sm:p-10 bg-white border border-neutral-200/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-neutral-900 font-display">
              Reserve your slot for the upcoming monthly edition.
            </h4>
            <p className="text-sm text-neutral-600 mt-1">
              Press plates close promptly on the 18th at 18:00 IST. Creative layout assistance available.
            </p>
          </div>

          <Link
            href="/advertise"
            className="rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-sm px-7 py-3.5 transition-all inline-flex items-center gap-2 flex-shrink-0"
          >
            <span>View Rate Card</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
