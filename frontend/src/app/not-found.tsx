import Link from "next/link";
import {
  ArrowRight,
  Home,
  FileText,
  ShoppingBag,
  Smartphone,
  Info,
  Phone,
  HelpCircle,
} from "lucide-react";

export default function NotFound() {
  const sections = [
    {
      title: "Advertising Rate Card (P1–P5)",
      description: "Book monthly print slots across 50,000+ Bhubaneswar doorsteps.",
      href: "/advertise",
      icon: FileText,
    },
    {
      title: "Commercial Services",
      description: "Explore publicity categories for retail, clinics, and education.",
      href: "/services",
      icon: ShoppingBag,
    },
    {
      title: "Phygital Architecture",
      description: "Learn how NFC smart cards and dynamic QR codes route customers.",
      href: "/product",
      icon: Smartphone,
    },
    {
      title: "Editorial Heritage",
      description: "Discover our Saroswati Khabar publishing background and press.",
      href: "/about",
      icon: Info,
    },
    {
      title: "Booking Desk & FAQ",
      description: "Speak with our Bhubaneswar team or get answers on press cutoffs.",
      href: "/contact",
      icon: Phone,
    },
    {
      title: "Interactive Sandbox",
      description: "Test live card taps and QR redirects in our real-time simulator.",
      href: "/demo",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="min-h-[80vh] bg-[#0A0A0A] text-[#EDEDED] py-20 px-4 sm:px-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto w-full text-center">
        {/* Eyebrow Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#FFB703] text-xs font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703] animate-pulse" />
          <span>ERROR 404 • DISPATCH NOT FOUND</span>
        </div>

        {/* Big Branded 404 Graphic */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white font-display tracking-tight mb-4">
          404 <span className="text-neutral-500 font-serif italic font-normal">Lost in Print</span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed mb-10 font-normal">
          The requested PRACHAR resource or digital profile could not be located. It may have moved, expired, or been updated in our latest press cycle.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/"
            className="rounded-full bg-[#FFB703] hover:bg-[#FFAA00] text-black font-bold text-sm px-7 py-3.5 inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm px-7 py-3.5 inline-flex items-center gap-2 transition-colors"
          >
            <span>Contact Booking Desk</span>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </Link>
        </div>

        {/* Main Section Navigation Directory */}
        <div className="text-left border-t border-white/10 pt-12">
          <span className="text-xs uppercase font-mono tracking-wider text-neutral-500 block mb-6 text-center sm:text-left">
            Or Explore Authoritative PRACHAR Sections:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <Link
                  key={sec.href}
                  href={sec.href}
                  className="p-5 rounded-2xl bg-[#121214] border border-white/10 hover:border-[#FFB703]/40 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FFB703] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-white group-hover:text-[#FFB703] transition-colors">
                      {sec.title}
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {sec.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
