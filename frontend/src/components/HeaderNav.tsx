"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Menu, X, ArrowRight } from "lucide-react";

export default function HeaderNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Subtle background transition and scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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
    { href: "/product", label: "Platform" },
    { href: "/advertise", label: "Advertising" },
    { href: "/demo", label: "Simulator" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ];

  const isHomeTop = pathname === "/" && !isScrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 relative ${
        isScrolled
          ? "border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md py-3.5"
          : isHomeTop
          ? "border-b border-black/5 bg-[#F7F7F4] py-4 sm:py-5"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      {/* Brand Appart Signature Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent pointer-events-none z-50 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FFB703] via-[#FFAA00] to-[#FF8800] transition-all duration-75 ease-out relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {scrollProgress > 0 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#FFB703]" />
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Wordmark (Brand Appart simplicity) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className={`text-xl sm:text-2xl font-black tracking-tight font-display transition-colors ${
              isHomeTop
                ? "text-black group-hover:text-neutral-700"
                : "text-white group-hover:text-neutral-200"
            }`}
          >
            PRACHAR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
          <span
            className={`text-[10px] uppercase font-mono tracking-widest hidden sm:inline-block ${
              isHomeTop ? "text-neutral-600" : "text-neutral-400"
            }`}
          >
            Odisha
          </span>
        </Link>

        {/* Desktop Editorial Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB703] focus-visible:ring-offset-2 rounded-md px-1 py-0.5 ${
                  isHomeTop
                    ? isActive
                      ? "text-[#B45309] font-bold"
                      : "text-neutral-700 hover:text-black"
                    : isActive
                    ? "text-[#FFB703] font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.usernameSlug && (
                <Link
                  href={`/u/${user.usernameSlug}`}
                  className={`text-xs font-mono transition-colors rounded ${
                    isHomeTop
                      ? "text-neutral-600 hover:text-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="View your public profile"
                >
                  /u/{user.usernameSlug}
                </Link>
              )}
              <Link
                href="/dashboard"
                className={`rounded-full text-xs font-semibold px-4 py-2 transition-all ${
                  isHomeTop
                    ? "bg-black/10 hover:bg-black/15 text-black border border-black/15"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                }`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className={`text-xs transition-colors rounded ${
                  isHomeTop
                    ? "text-neutral-600 hover:text-rose-600"
                    : "text-neutral-400 hover:text-rose-400"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium px-2 py-1 transition-colors rounded-md ${
                  isHomeTop
                    ? "text-neutral-700 hover:text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className={`rounded-full text-xs sm:text-sm font-semibold px-5 py-2.5 transition-all inline-flex items-center gap-1.5 shadow-sm ${
                  isHomeTop
                    ? "bg-black hover:bg-neutral-800 text-white"
                    : "bg-white hover:bg-neutral-200 text-black"
                }`}
              >
                <span>Claim Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Minimal Menu Trigger */}
        <div className="flex items-center gap-3 md:hidden">
          {!user && (
            <Link
              href="/register"
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                isHomeTop
                  ? "bg-black text-white hover:bg-neutral-800"
                  : "text-black bg-[#FFB703] hover:bg-amber-400"
              }`}
            >
              Get Started
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full"
            >
              Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold px-2 py-1 transition-colors rounded ${
              isHomeTop
                ? "text-neutral-800 hover:text-black"
                : "text-neutral-300 hover:text-white"
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Editorial Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-full bg-[#0A0A0A]/98 border-b border-white/10 backdrop-blur-2xl px-6 py-8 shadow-2xl transition-all max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-bold tracking-tight transition-colors font-display flex items-center justify-between ${
                    isActive ? "text-[#FFB703]" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-neutral-600">0{idx + 1}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-8 mt-6 border-t border-white/10 flex flex-col gap-3">
            {user ? (
              <>
                {user.usernameSlug && (
                  <Link
                    href={`/u/${user.usernameSlug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-neutral-400 font-mono py-2 text-center"
                  >
                    Public Profile: /u/{user.usernameSlug}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-semibold rounded-full bg-white text-black"
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 text-center text-xs text-rose-400 hover:text-rose-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold rounded-full bg-[#FFB703] text-black"
                >
                  Claim Digital Profile
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-neutral-300 border border-white/15 rounded-full hover:bg-white/5"
                >
                  Sign In
                </Link>
              </div>
            )}

            <div className="pt-4 text-[11px] text-neutral-400 font-mono text-center">
              Saroswati Khabar • Bhubaneswar, Odisha
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
