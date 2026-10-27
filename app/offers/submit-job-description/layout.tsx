import { pageMetadata } from "@/lib/metadata";

// The page is a client component, which cannot export metadata itself.
export const metadata = pageMetadata({
  path: "/offers/submit-job-description",
  title: "Free Candidate Matches for Your Job | HireRevolution AI",
  description:
    "Paste a job description and we'll email you skills-matched candidates within minutes. Under two minutes to submit. Free for a limited time, no credit card.",
  preview: {
    title: "Send us one job. Get matched candidates in minutes, free.",
    description:
      "We analyze. You hire. Paste a job description and HireRevolution searches for candidates on the skills they can prove. No credit card required.",
  },
});

export default function SubmitJobDescriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
