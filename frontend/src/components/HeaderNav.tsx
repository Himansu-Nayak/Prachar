"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function HeaderNav() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            PRACHAR <span className="text-xs text-orange-400 font-semibold px-2 py-0.5 rounded bg-orange-950/60 border border-orange-800/60">PHYGITAL</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link href="/product" className="hover:text-white transition">Product</Link>
          <Link href="/services" className="hover:text-white transition">Services</Link>
          <Link href="/advertise" className="hover:text-white transition">Advertise</Link>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <Link href="/demo" className="hover:text-white transition">Demo</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xs font-medium text-orange-400 border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg transition"
              >
                Dashboard
              </Link>
              {user.usernameSlug && (
                <Link
                  href={`/u/${user.usernameSlug}`}
                  className="hidden sm:inline-block text-xs text-slate-300 hover:text-white px-2 py-1"
                >
                  /u/{user.usernameSlug}
                </Link>
              )}
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition shadow-sm">
                Get Card
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
