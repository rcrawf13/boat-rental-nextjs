import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = "Nomad Adventure Rentals";
const SITE_URL = "https://nomadadventurerentals.example";
const DEFAULT_TITLE = "Nomad Adventure Rentals | Lake Norman Boat Rentals";
const DEFAULT_DESCRIPTION =
  "Book pontoon boat rentals with Nomad Adventure Rentals at Lake Norman near Charlotte, North Carolina. Available to travelers across the U.S.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    areaServed: "United States",
    serviceArea: [
      {
        "@type": "Place",
        name: "Charlotte, North Carolina",
      },
      {
        "@type": "Place",
        name: "Lake Norman, North Carolina",
      },
    ],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Pontoon boat rental",
        areaServed: "Lake Norman, North Carolina",
      },
    },
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
