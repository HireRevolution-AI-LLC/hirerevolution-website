"use client";

import Image from "./Image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import {
  AUDIENCE_COOKIE,
  HOME,
  NAV_LINKS,
  SHARED_PATHS,
  SWITCH_TO,
  isJobSeekerPath,
  parseAudience,
  type Audience,
} from "@/lib/audience";
import { appLogin, appSignup } from "@/lib/links";
import Wordmark from "./Wordmark";

const noSubscription = () => () => {};

const iconProps = {
  className: "w-4 h-4 sm:w-5 sm:h-5 shrink-0",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

// The audience switch. Each side has its own accent: blue for hiring, gold for job seekers.
const AUDIENCE_TABS: { audience: Audience; label: string; accent: string; icon: ReactNode }[] = [
  {
    audience: "hiring",
    label: "For hiring teams",
    accent: "border-blue-600 [&_svg]:text-blue-600",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
      </svg>
    ),
  },
  {
    audience: "candidates",
    label: "For job seekers",
    accent: "border-amber-500 [&_svg]:text-amber-500",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
    ),
  },
];

function savedAudience(): Audience | null {
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${AUDIENCE_COOKIE}=`));
  return parseAudience(entry?.slice(AUDIENCE_COOKIE.length + 1));
}

export default function SiteNav() {
  const pathname = usePathname();
  const shared = SHARED_PATHS.includes(pathname);
  // Shared pages follow the remembered choice. The cookie only changes on
  // navigation, so there is nothing to subscribe to; the server renders hiring.
  const remembered = useSyncExternalStore(
    noSubscription,
    () => savedAudience() ?? "hiring",
    () => "hiring" as Audience,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const audience: Audience = isJobSeekerPath(pathname) ? "candidates" : shared ? remembered : "hiring";
  const links = NAV_LINKS[audience];
  const cta =
    audience === "hiring"
      ? { label: "Book a demo", href: "/demo" }
      : { label: "Start free", href: appSignup("individual") };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="bg-[#0B1633]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex items-end gap-2" role="group" aria-label="Show the site for">
          {AUDIENCE_TABS.map((tab) => {
            const active = tab.audience === audience;
            return (
              <Link
                key={tab.audience}
                href={SWITCH_TO[tab.audience]}
                prefetch={false}
                aria-current={active}
                className={`flex items-center gap-2 h-10 sm:h-12 px-3 sm:px-6 rounded-t-lg text-sm sm:text-base font-semibold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 ${
                  active
                    ? `bg-white text-gray-900 border-t-4 ${tab.accent}`
                    : "text-white bg-white/10 ring-1 ring-inset ring-white/25 hover:bg-white/20"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link href={HOME[audience]} className="flex items-center space-x-3 shrink-0" aria-label="HireRevolution.ai home">
            <Image src="/logo-emblem.png" alt="" width={44} height={44} priority />
            <Wordmark className="text-xl md:hidden lg:inline" />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium ${pathname === l.href ? "text-blue-700" : "text-gray-600 hover:text-gray-900"}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href={appLogin()} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Log in
            </a>
            <a href={cta.href} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
              {cta.label}
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={closeMenu} className="px-2 py-2 text-gray-700 font-medium">
                {l.label}
              </Link>
            ))}
            <a href={appLogin()} className="px-2 py-2 text-gray-700 font-medium">
              Log in
            </a>
            <a href={cta.href} className="mt-2 text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold">
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
