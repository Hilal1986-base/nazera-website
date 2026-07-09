import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NAZERA | Building the Future",
  description:
    "NAZERA is a premier multinational company delivering excellence across real estate, technology, energy, and finance. Shaping industries and empowering futures worldwide.",
  keywords: [
    "NAZERA",
    "technology",
    "real estate",
    "energy",
    "finance",
    "consulting",
    "investment",
    "innovation",
  ],
  authors: [{ name: "NAZERA" }],
  openGraph: {
    title: "NAZERA | Building the Future",
    description:
      "A premier multinational company driving innovation and sustainable growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}