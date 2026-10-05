"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Menu, X, Sparkles, BookOpen, Layers, PhoneCall, HelpCircle, User, Radio, Compass } from "lucide-react";

export default function HeaderNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll progress and scroll state for adaptive header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: "/product", label: "PRODUCT", code: "01", icon: Layers },
    { href: "/services", label: "SERVICES", code: "02", icon: Sparkles },
    { href: "/advertise", label: "RATE CARD (P1–P5)", code: "03", icon: BookOpen },
    { href: "/demo", label: "DEMO", code: "04", icon: HelpCircle },
    { href: "/blog", label: "ARCHIVE", code: "05", icon: BookOpen },
    { href: "/about", label: "FOUNDATION", code: "06", icon: User },
    { href: "/contact", label: "MISSION DISPATCH", code: "07", icon: PhoneCall },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#E4B592]/20 bg-[#000000]/90 backdrop-blur-xl shadow-lg shadow-black/50"
          : "border-b border-white/5 bg-[#000000]/40 backdrop-blur-sm"
      }`}
    >
      {/* Top Hairline Telemetry Guide */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#E4B592]/30 to-transparent" />

      {/* Dynamic Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#E4B592] to-[#FF8C38] transition-all duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Subtle reticle corner ticks at navbar edges */}
        <div className="absolute top-1 left-2 w-2 h-2 border-t border-l border-[#E4B592]/40 hidden md:block" />
        <div className="absolute top-1 right-2 w-2 h-2 border-t border-r border-[#E4B592]/40 hidden md:block" />

        {/* Brand Logo & Aerospace Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-sm border border-[#E4B592]/80 bg-[#070B14] flex items-center justify-center text-[#FFF3EA] font-mono font-bold text-sm shadow-[0_0_15px_rgba(228,181,146,0.25)] group-hover:border-[#E4B592] group-hover:shadow-[0_0_20px_rgba(228,181,146,0.5)] transition-all">
            <span className="text-[#E4B592]">P</span>
            {/* Viewfinder corner brackets on icon */}
            <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-[#E4B592]" />
            <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-[#E4B592]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-[-0.03em] text-[#FFF3EA] leading-none group-hover:text-white transition-colors">
                PRACHAR
              </span>
              <span className="font-mono text-[9px] font-bold text-[#E4B592] px-1.5 py-0.5 rounded-sm bg-[#E4B592]/10 border border-[#E4B592]/40 uppercase tracking-[0.2em]">
                PHYGITAL
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-serif leading-none mt-1 hidden sm:block tracking-wide">
              ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା • 20.2961°N, 85.8245°E
            </span>
          </div>
        </Link>

        {/* Live Orbit Telemetry Badge (Center Viewport on larger screens) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#070B14]/80 font-mono text-[10px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold tracking-wider">ODISHA GEODETIC GRID</span>
          <span className="text-white/20">|</span>
          <span className="text-[#E4B592]">BHUBANESWAR HUB</span>
          <span className="text-white/20">|</span>
          <span className="text-slate-400">50K+ CIRCULATION</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 font-mono text-[11px] tracking-wider text-slate-300" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1 transition-all duration-200 relative group flex items-center gap-1 ${
                  isActive
                    ? "text-[#E4B592] font-bold"
                    : "hover:text-[#FFF3EA] text-slate-400"
                }`}
              >
                <span className="text-[9px] text-[#E4B592]/50 group-hover:text-[#E4B592] transition-colors">
                  {link.code}
                </span>
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#E4B592] shadow-[0_0_8px_#E4B592]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="font-mono text-[11px] font-bold text-[#E4B592] border border-[#E4B592]/50 bg-[#E4B592]/10 hover:bg-[#E4B592] hover:text-[#000000] px-4 py-2 rounded-full transition-all tracking-wider shadow-[0_0_15px_rgba(228,181,146,0.15)] flex items-center gap-1.5"
              >
                <Radio className="w-3 h-3 animate-pulse" />
                <span>DASHBOARD</span>
              </Link>
              {user.usernameSlug && (
                <Link
                  href={`/u/${user.usernameSlug}`}
                  className="text-xs text-slate-300 hover:text-white px-2 py-1 font-mono hover:underline"
                  title="View your public profile"
                >
                  /u/{user.usernameSlug}
                </Link>
              )}
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 font-mono transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono text-xs text-slate-300 hover:text-white px-3 py-1.5 transition tracking-wider"
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="reticle-btn-primary"
              >
                <span>CLAIM PHYGITAL CARD</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger & Quick CTA */}
        <div className="flex items-center gap-2.5 lg:hidden">
          {!user && (
            <Link
              href="/register"
              className="text-[10px] font-mono font-bold tracking-wider text-black bg-[#E4B592] hover:bg-white px-3 py-1.5 rounded-full shadow-sm transition"
            >
              CLAIM CARD
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="text-[10px] font-mono font-bold text-[#E4B592] border border-[#E4B592]/50 bg-[#E4B592]/10 px-2.5 py-1 rounded-full"
            >
              DASHBOARD
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition border border-white/10"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#E4B592]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E4B592]/20 bg-[#000000]/98 backdrop-blur-2xl px-5 pt-4 pb-7 space-y-4 transition-all">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-[#E4B592]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E4B592] animate-pulse" />
              BHUBANESWAR • 20.2961°N, 85.8245°E
            </span>
            <span className="font-serif text-slate-300">ପ୍ରଚାର — ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-sm text-[11px] transition ${
                    isActive
                      ? "bg-[#E4B592]/15 text-[#E4B592] border border-[#E4B592]/50 font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#E4B592]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 font-mono">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 px-1">
                  COMMUNICATOR ID: <span className="font-semibold text-slate-200">{user.phoneNumber}</span>
                </div>
                {user.usernameSlug && (
                  <Link
                    href={`/u/${user.usernameSlug}`}
                    className="block w-full py-2 px-3 text-center text-xs font-mono text-[#E4B592] bg-[#070B14] rounded border border-[#E4B592]/30"
                  >
                    PUBLIC PROFILE (/u/{user.usernameSlug})
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full py-2 text-center text-xs text-rose-400 hover:bg-rose-950/30 rounded border border-rose-900/40 transition"
                >
                  TERMINATE SESSION (LOGOUT)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-200 bg-[#070B14] border border-white/15 rounded hover:border-[#E4B592]/50 transition"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 text-center text-xs font-bold text-black bg-[#E4B592] rounded hover:bg-white transition shadow-lg shadow-[#E4B592]/20"
                >
                  CLAIM CARD
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
