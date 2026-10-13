import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Merchant Account — Claim Your Digital Handle",
  description:
    "Claim your verified username and digital business card profile with OTP verification in 2 minutes. Publish your catalogs, WhatsApp chat, and tap links.",
  alternates: {
    canonical: "https://prachar.in/register",
  },
  openGraph: {
    title: "Register Merchant Account — Claim Your Digital Handle",
    description:
      "Claim your verified username and digital business card profile with OTP verification in 2 minutes. Publish your catalogs, WhatsApp chat, and tap links.",
    url: "https://prachar.in/register",
    type: "website",
    images: [{ url: "https://prachar.in/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Register Merchant Account — Claim Your Digital Handle",
    description:
      "Claim your verified username and digital business card profile with OTP verification in 2 minutes. Publish your catalogs, WhatsApp chat, and tap links.",
    images: ["https://prachar.in/og-image.jpg"],
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
