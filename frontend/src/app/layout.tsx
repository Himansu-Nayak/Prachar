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

import { AuthProvider } from "@/lib/AuthContext";
import HeaderNav from "@/components/HeaderNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <HeaderNav />
          <main className="flex-1">
            {children}
          </main>
        </AuthProvider>

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
