import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PRACHAR | Phygital Publicity Platform",
  description: "ଆମ ଅଂଚଳ ର ମାସିକ ବିଜ୍ଞାପନ ପୁସ୍ତିକା — Bhubaneswar's Premier Phygital Publicity & Digital Identity Platform",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "PRACHAR | Phygital Publicity Platform",
    description: "Bridging physical advertising booklets and smart cards with verified digital profiles in Bhubaneswar, Odisha.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
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
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition shadow-sm">
                Get Card
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold text-slate-200">PRACHAR — Phygital Publicity</p>
              <p>A Unit of Saroswati Khabar | PRGI Reg: ORORI/25/A3295 | Udyam: UDYAM-OD-04-0039313</p>
              <p>BJB Nagar, Bhubaneswar, Odisha | Printed at Chandan Printers, Unit-3</p>
            </div>
            <div className="text-right sm:text-right text-center">
              <p>&copy; {new Date().getFullYear()} PRACHAR. All rights reserved.</p>
              <p>Contact: 7077011733 / 9178898844 | pracharbbsr1@gmail.com</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
