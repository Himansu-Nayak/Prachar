import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Sandbox — Tactile NFC & Dynamic QR Demo",
  description:
    "Experience PRACHAR's interactive simulator: test contactless NFC card taps, live dynamic QR redirects, and verified digital micro-profiles in real time.",
  alternates: {
    canonical: "https://prachar.in/demo",
  },
  openGraph: {
    title: "Interactive Sandbox — Tactile NFC & Dynamic QR Demo",
    description:
      "Experience PRACHAR's interactive simulator: test contactless NFC card taps, live dynamic QR redirects, and verified digital micro-profiles in real time.",
    url: "https://prachar.in/demo",
    type: "website",
    images: [{ url: "https://prachar.in/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Sandbox — Tactile NFC & Dynamic QR Demo",
    description:
      "Experience PRACHAR's interactive simulator: test contactless NFC card taps, live dynamic QR redirects, and verified digital micro-profiles in real time.",
    images: ["https://prachar.in/og-image.jpg"],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
