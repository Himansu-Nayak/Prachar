import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact PRACHAR — Editorial Booking Desk & Operations",
  description:
    "Connect with our BJB Nagar Bhubaneswar operations team for print reservations, artwork proofing, rate cards, and tactile NFC smart card support desks.",
  alternates: {
    canonical: "https://prachar.in/contact",
  },
  openGraph: {
    title: "Contact PRACHAR — Editorial Booking Desk & Operations",
    description:
      "Connect with our BJB Nagar Bhubaneswar operations team for print reservations, artwork proofing, rate cards, and tactile NFC smart card support desks.",
    url: "https://prachar.in/contact",
    type: "website",
    images: [{ url: "https://prachar.in/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PRACHAR — Editorial Booking Desk & Operations",
    description:
      "Connect with our BJB Nagar Bhubaneswar operations team for print reservations, artwork proofing, rate cards, and tactile NFC smart card support desks.",
    images: ["https://prachar.in/og-image.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
