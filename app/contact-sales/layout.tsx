import type { Metadata } from "next";

// The page is a client component, which cannot export metadata itself.
export const metadata: Metadata = {
  alternates: { canonical: "/contact-sales" },
};

export default function ContactSalesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
