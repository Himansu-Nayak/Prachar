import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Portal Login — Manage Ads & Profile Telemetry",
  description:
    "Access your verified merchant dashboard to update services, track QR scan analytics, review edition distribution dates, and manage booking receipts.",
  alternates: {
    canonical: "https://prachar.in/login",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Merchant Portal Login — Manage Ads & Profile Telemetry",
    description:
      "Access your verified merchant dashboard to update services, track QR scan analytics, review edition distribution dates, and manage booking receipts.",
    url: "https://prachar.in/login",
    type: "website",
    images: [{ url: "https://prachar.in/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merchant Portal Login — Manage Ads & Profile Telemetry",
    description:
      "Access your verified merchant dashboard to update services, track QR scan analytics, review edition distribution dates, and manage booking receipts.",
    images: ["https://prachar.in/og-image.jpg"],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
