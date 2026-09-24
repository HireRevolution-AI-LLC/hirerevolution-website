import type { Metadata } from "next";
import { connection } from "next/server";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import "./globals.css";
import { PRODUCTION_ORIGIN } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Makes the relative og-image URL absolute, as social cards require.
  metadataBase: new URL(PRODUCTION_ORIGIN),
  title: "HireRevolution AI | Skills-Based Hiring Made Simple",
  description:
    "Stop wasting time on resume screening. HireRevolution AI matches candidates to roles based on demonstrated skills, not keywords — and it's free for job seekers.",
  openGraph: {
    title: "HireRevolution AI | Skills-Based Hiring Made Simple",
    description:
      "Stop wasting time on resume screening. HireRevolution AI matches candidates to roles based on demonstrated skills, not keywords.",
    url: "https://hirerevolution.ai",
    siteName: "HireRevolution AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireRevolution AI | Skills-Based Hiring Made Simple",
    description:
      "Stop wasting time on resume screening. HireRevolution AI matches candidates based on skills.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Render every page per request. Next stamps the CSP nonce (proxy.ts) onto
  // its inline scripts while rendering, and a page prerendered at build time
  // would ship scripts with no nonce -- which the policy then blocks.
  await connection();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
