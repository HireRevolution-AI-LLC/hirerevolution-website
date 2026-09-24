import Image from "./Image";
import Link from "next/link";
import { JOB_SEEKERS_PREFIX } from "@/lib/audience";
import { PRIVACY_URL, TERMS_URL } from "@/lib/site";
import { SOCIAL_LINKS, SUPPORT_EMAIL, appLogin } from "@/lib/links";
import Wordmark from "./Wordmark";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "For hiring teams",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Book a demo", href: "/demo" },
      { label: "Free JD offer", href: "/offers/submit-job-description" },
      { label: "Talk to sales", href: "/contact-sales" },
    ],
  },
  {
    heading: "For job seekers",
    links: [
      { label: "How it works", href: JOB_SEEKERS_PREFIX },
      { label: "Features", href: `${JOB_SEEKERS_PREFIX}/features` },
      { label: "Pricing", href: `${JOB_SEEKERS_PREFIX}/pricing` },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Log in", href: appLogin() },
    ],
  },
];

// Privacy and Terms point straight at the app. /privacy-policy and
// /terms-of-service still redirect there (next.config.ts) for the old
// Hostinger inbound links, but there is no reason to send our own readers
// through a redirect on every page of the site.
const LEGAL_LINKS = [
  { label: "Privacy Policy", href: PRIVACY_URL },
  { label: "Terms of Service", href: TERMS_URL },
  { label: "Fulfillment Policy", href: "/fulfillment-policy" },
  { label: "Accessibility", href: "/accessibility" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image src="/logo-emblem.png" alt="" width={40} height={40} />
              <Wordmark className="text-lg" />
            </div>
            <p className="text-gray-600 text-sm mb-4">Skills-based hiring made simple.</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-blue-700 hover:text-blue-800">
              {SUPPORT_EMAIL}
            </a>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-sm text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-semibold mb-4">{col.heading}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gray-600 hover:text-gray-900 text-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row gap-4 justify-between items-center text-gray-600 text-sm">
          <span>© {new Date().getFullYear()} HireRevolution AI. All rights reserved.</span>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 justify-center">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-gray-900">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
