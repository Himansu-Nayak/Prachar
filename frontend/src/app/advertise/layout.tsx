import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertising Rate Card — P1–P5 Monthly Publication Tiers",
  description:
    "Reserve verified print slots across 50,000+ Bhubaneswar doorsteps. Transparent pricing for P1 Mini-Quarter to P5 Premium Cover with dynamic QR codes.",
  alternates: {
    canonical: "https://prachar.in/advertise",
  },
  openGraph: {
    title: "Advertising Rate Card — P1–P5 Monthly Publication Tiers",
    description:
      "Reserve verified print slots across 50,000+ Bhubaneswar doorsteps. Transparent pricing for P1 Mini-Quarter to P5 Premium Cover with dynamic QR codes.",
    url: "https://prachar.in/advertise",
    type: "website",
    images: [{ url: "https://prachar.in/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertising Rate Card — P1–P5 Monthly Publication Tiers",
    description:
      "Reserve verified print slots across 50,000+ Bhubaneswar doorsteps. Transparent pricing for P1 Mini-Quarter to P5 Premium Cover with dynamic QR codes.",
    images: ["https://prachar.in/og-image.jpg"],
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
