import { Anton, Bebas_Neue, Space_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import GlobalLoadingOverlay from "@/components/ui/global-loading-overlay";
import ThemeToggle from "@/components/ui/theme-toggle";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

const metadataBase = (() => {
  if (!siteUrl) {
    return undefined;
  }

  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
})();

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-venue",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata = {
  metadataBase,
  title: {
    default: "24-Hour Hackathon Bangalore | EPOCH '26",
    template: "%s | EPOCH '26",
  },
  description:
    "EPOCH '26 is a 24-hour offline hackathon in Bangalore (Bengaluru) hosted by Vemana Institute of Technology for student innovators across India.",
  keywords: [
    "24 hour hackathon bangalore",
    "hackathon bangalore",
    "24 hour hackathon bengaluru",
    "student hackathon india",
    "EPOCH 26",
    "Vemana Institute of Technology hackathon",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "24-Hour Hackathon Bangalore | EPOCH '26",
    description:
      "Join EPOCH '26, a 24-hour offline hackathon in Bangalore hosted by Vemana Institute of Technology.",
    url: "/",
    siteName: "EPOCH '26",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "24-Hour Hackathon Bangalore | EPOCH '26",
    description:
      "Join EPOCH '26, a 24-hour offline hackathon in Bangalore hosted by Vemana Institute of Technology.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "EPOCH '26 - 24-Hour Hackathon Bangalore",
  description:
    "EPOCH '26 is a 24-hour offline student hackathon in Bangalore hosted by Vemana Institute of Technology.",
  startDate: "2026-05-01T11:00:00+05:30",
  endDate: "2026-05-02T11:00:00+05:30",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Vemana Institute of Technology",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Vemana Institute of Technology",
  },
};

if (siteUrl) {
  eventJsonLd.url = siteUrl;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${bebasNeue.variable} ${spaceMono.variable} ${anton.variable}`}>
        {children}
        <ThemeToggle />
        <GlobalLoadingOverlay />
        <SpeedInsights />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      </body>
    </html>
  );
}
