import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

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
  metadataBase: new URL("https://hirerevolution.ai"),
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

// The logo's wordmark, in its colors (Marketing/images/hirerevolution-logo-horizontal.png),
// as text so it stays sharp at any size.
function Wordmark({ className }: { className: string }) {
  return (
    <span className={`font-bold tracking-tight text-[#1D2E51] ${className}`}>
      Hire<span className="text-[#34579C]">Revolution</span>
      <span className="font-medium">.ai</span>
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="flex items-center space-x-3" aria-label="HireRevolution.ai home">
                <Image src="/logo-emblem.png" alt="" width={44} height={44} priority />
                <Wordmark className="text-xl hidden sm:inline" />
              </a>
              <div className="hidden md:flex space-x-8">
                <a
                  href="/features"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Features
                </a>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="/pricing"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Pricing
                </a>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Contact
                </a>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://app.hirerevolution.ai"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Sign in
                </a>
                <a
                  href="/demo"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Demo
                </a>
              </div>
            </div>
          </div>
        </nav>

        {children}

        <footer className="bg-gray-50 border-t border-gray-200 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Image src="/logo-emblem.png" alt="" width={40} height={40} />
                  <Wordmark className="text-lg" />
                </div>
                <p className="text-gray-600 text-sm">
                  Skills-based hiring made simple.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/features" className="text-gray-600 hover:text-gray-900 text-sm">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="/demo" className="text-gray-600 hover:text-gray-900 text-sm">
                      Demo
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-gray-600 hover:text-gray-900 text-sm">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Special Offers</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/offers/submit-jd"
                      className="text-gray-600 hover:text-gray-900 text-sm"
                    >
                      Free JD Review
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-600 text-sm text-center">
                © 2026 HireRevolution AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
