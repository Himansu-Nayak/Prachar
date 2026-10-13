import React from "react";

export function HomeJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://prachar.in/#organization",
        name: "PRACHAR",
        alternateName: ["Saroswati Khabar", "Prachar Bhubaneswar"],
        url: "https://prachar.in",
        logo: {
          "@type": "ImageObject",
          url: "https://prachar.in/icon.svg",
          width: 512,
          height: 512,
          caption: "PRACHAR Logo",
        },
        image: "https://prachar.in/og-image.jpg",
        description:
          "High-circulation physical advertising booklets and tactile NFC smart cards with verified digital identity infrastructure in Bhubaneswar, Odisha.",
        email: "pracharbbsr1@gmail.com",
        telephone: "+91-7077011733",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-7077011733",
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["Odia", "English", "Hindi"],
          },
          {
            "@type": "ContactPoint",
            telephone: "+91-9178898844",
            contactType: "sales",
            areaServed: "IN",
            availableLanguage: ["Odia", "English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://prachar.in/#website",
        url: "https://prachar.in",
        name: "PRACHAR",
        description: "Bhubaneswar's premier phygital publicity and smart card network.",
        publisher: {
          "@id": "https://prachar.in/#organization",
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "AdvertisingAgency",
        "@id": "https://prachar.in/#localbusiness",
        name: "PRACHAR — Phygital Publicity Platform",
        legalName: "Saroswati Khabar",
        url: "https://prachar.in",
        logo: "https://prachar.in/icon.svg",
        image: "https://prachar.in/og-image.jpg",
        telephone: "+91-7077011733",
        email: "pracharbbsr1@gmail.com",
        priceRange: "₹550 - ₹16,000",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, Credit Card, UPI, Net Banking",
        address: {
          "@type": "PostalAddress",
          streetAddress: "BJB Nagar",
          addressLocality: "Bhubaneswar",
          addressRegion: "Odisha",
          postalCode: "751014",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 20.2961,
          longitude: 85.8245,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "09:30",
            closes: "19:30",
          },
        ],
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: "Bhubaneswar, Odisha",
          },
          {
            "@type": "City",
            name: "Bhubaneswar",
          },
        ],
        parentOrganization: {
          "@id": "https://prachar.in/#organization",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  serviceType,
  offers,
}: {
  name: string;
  description: string;
  serviceType: string;
  offers?: { name: string; price: string; priceCurrency: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: {
      "@type": "AdvertisingAgency",
      name: "PRACHAR (Saroswati Khabar)",
      url: "https://prachar.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bhubaneswar",
    },
    ...(offers && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${name} Packages`,
        itemListElement: offers.map((offer) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: offer.name,
          },
          price: offer.price,
          priceCurrency: offer.priceCurrency,
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
