import type { Metadata } from "next";
import { connection } from "next/server";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "./components/SiteFooter";
import SiteNav from "./components/SiteNav";
import "./globals.css";
import { OG_IMAGE, SITE_NAME } from "@/lib/metadata";
import { PRODUCTION_ORIGIN } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Only what a page without its own metadata (the 404) falls back on. Real
// pages set the full set through pageMetadata(), and nothing here names a URL,
// so no page can inherit the home page's address.
export const metadata: Metadata = {
  // Makes relative canonical, og:url and og-image URLs absolute.
  metadataBase: new URL(PRODUCTION_ORIGIN),
  title: "HireRevolution AI | Skills-Based Hiring Made Simple",
  description:
    "Stop wasting time on resume screening. HireRevolution AI matches candidates to roles based on demonstrated skills, not keywords — and it's free for job seekers.",
  openGraph: { siteName: SITE_NAME, images: [OG_IMAGE], type: "website" },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
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
