import { pageMetadata } from "@/lib/metadata";

// The page is a client component, which cannot export metadata itself.
export const metadata = pageMetadata({
  path: "/contact-sales",
  title: "Talk to Sales | HireRevolution AI",
  description:
    "Hiring at scale? Tell us about your team, your ATS and your open roles, and we'll set up a HireRevolution plan that fits. We reply within 2 business days.",
  preview: {
    title: "HireRevolution for your hiring team",
    description:
      "Tell us about your team, your ATS and your open roles. We'll set up a plan that fits, and we reply within 2 business days.",
  },
});

export default function ContactSalesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
