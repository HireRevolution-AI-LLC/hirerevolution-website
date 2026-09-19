"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  AUDIENCE_COOKIE,
  HOME,
  NAV_LINKS,
  SHARED_PATHS,
  SWITCH_TO,
  isCandidatePath,
  parseAudience,
  type Audience,
} from "@/lib/audience";
import { appLogin, appSignup } from "@/lib/links";
import Wordmark from "./Wordmark";

const noSubscription = () => () => {};

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

  const audience: Audience = isCandidatePath(pathname) ? "candidates" : shared ? remembered : "hiring";
  const links = NAV_LINKS[audience];
  const cta =
    audience === "hiring"
      ? { label: "Book a demo", href: "/demo" }
      : { label: "Start free", href: appSignup("individual") };

  const switchClass = (active: boolean) =>
    `px-3 py-1 rounded-full text-xs font-semibold transition ${
      active ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link href={HOME[audience]} className="flex items-center space-x-3 shrink-0" aria-label="HireRevolution.ai home">
            <Image src="/logo-emblem.png" alt="" width={44} height={44} priority />
            <Wordmark className="text-xl hidden lg:inline" />
          </Link>

          <div className="flex items-center bg-gray-100 rounded-full p-1" role="group" aria-label="Show the site for">
            <Link href={SWITCH_TO.hiring} prefetch={false} className={switchClass(audience === "hiring")} aria-current={audience === "hiring"}>
              Hiring
            </Link>
            <Link href={SWITCH_TO.candidates} prefetch={false} className={switchClass(audience === "candidates")} aria-current={audience === "candidates"}>
              Job seeking
            </Link>
          </div>

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
