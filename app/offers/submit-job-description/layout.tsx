import type { Metadata } from "next";

// The page is a client component, which cannot export metadata itself.
export const metadata: Metadata = {
  alternates: { canonical: "/offers/submit-job-description" },
};

export default function SubmitJobDescriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
