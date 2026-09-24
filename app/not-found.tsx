import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, buttonClass } from "./components/ui";

export const metadata: Metadata = {
  title: "Page not found | HireRevolution AI",
};

// Next's built-in 404 is styled with inline style attributes, which the CSP
// blocks (lib/csp.ts) -- it would render as bare, unstyled text.
export default function NotFound() {
  return (
    <main className="flex-1">
      <PageHero title="We couldn't find that page" subtitle="It may have moved, or the link may be mistyped.">
        <div className="mt-8">
          <Link href="/" className={buttonClass.primary}>
            Go to the home page
          </Link>
        </div>
      </PageHero>
    </main>
  );
}
