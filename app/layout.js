import { Anton, Bebas_Neue, Space_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GlobalLoadingOverlay from "@/components/ui/global-loading-overlay";
import ThemeToggle from "@/components/ui/theme-toggle";
import "./globals.css";

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
  title: "EPOCH '26 | Registration",
  description:
    "EPOCH '26 is a 24-hour grand national hackathon hosted by Vemana Institute of Technology, Bengaluru.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${bebasNeue.variable} ${spaceMono.variable} ${anton.variable}`}>
        {children}
        <ThemeToggle />
        <GlobalLoadingOverlay />
        <SpeedInsights />
      </body>
    </html>
  );
}
