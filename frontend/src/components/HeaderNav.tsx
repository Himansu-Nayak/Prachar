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

  // Subtle background transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    { href: "/product", label: "Platform" },
    { href: "/advertise", label: "Advertising" },
    { href: "/demo", label: "Simulator" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md py-3.5"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Wordmark (Brand Appart simplicity) */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display group-hover:text-neutral-200 transition-colors">
            PRACHAR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 hidden sm:inline-block">
            Odisha
          </span>
        </Link>

        {/* Desktop Editorial Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-[#FFB703] font-semibold"
                    : "hover:text-white text-neutral-400"
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
                  className="text-xs text-neutral-400 hover:text-white font-mono transition-colors"
                  title="View your public profile"
                >
                  /u/{user.usernameSlug}
                </Link>
              )}
              <Link
                href="/dashboard"
                className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold px-4 py-2 transition-all"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-300 hover:text-white px-2 py-1 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-semibold px-5 py-2.5 transition-all inline-flex items-center gap-1.5 shadow-sm"
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
              className="text-xs font-semibold text-black bg-[#FFB703] hover:bg-amber-400 px-3.5 py-1.5 rounded-full transition-all"
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
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white px-2 py-1 transition-colors"
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
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#0A0A0A]/98 border-b border-white/10 backdrop-blur-2xl px-6 py-8 shadow-2xl transition-all">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
                    className="text-xs text-neutral-400 font-mono py-2 text-center"
                  >
                    Public Profile: /u/{user.usernameSlug}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="w-full py-3 text-center text-sm font-semibold rounded-full bg-white text-black"
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full py-2.5 text-center text-xs text-rose-400 hover:text-rose-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className="w-full py-3 text-center text-sm font-bold rounded-full bg-[#FFB703] text-black"
                >
                  Claim Digital Profile
                </Link>
                <Link
                  href="/login"
                  className="w-full py-2.5 text-center text-sm font-medium text-neutral-300 border border-white/15 rounded-full hover:bg-white/5"
                >
                  Sign In
                </Link>
              </div>
            )}

            <div className="pt-4 text-[11px] text-neutral-500 font-mono text-center">
              Saroswati Khabar • Bhubaneswar, Odisha
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
