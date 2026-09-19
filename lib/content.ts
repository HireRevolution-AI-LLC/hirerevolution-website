import type { Feature } from "@/app/components/ui";

/**
 * Feature copy, from Marketing/marketing-overview.md and features-website.md.
 * Only Live features are promoted; anything else carries a badge.
 */

export const HIRING_FEATURES: Feature[] = [
  {
    title: "Never read another resume",
    description:
      "Candidates arrive ranked by the skills they've actually shown, not the keywords they typed. Your shortlist is ready before you open a single file.",
    image: { src: "/images/robot-reading.webp", alt: "Robot reading a resume so you don't have to" },
  },
  {
    title: "Candidates find you",
    description:
      "Publish a job and our AI searches for matching candidates automatically, then keeps looking. No sourcing, no keyword games.",
    image: { src: "/images/robots-crowd.webp", alt: "A crowd of robots, one standing out" },
  },
  {
    title: "An AI that interviews you for the JD",
    description:
      "Tell our AI about the role, the team and what success looks like. It writes a job description that captures what you really need.",
    image: { src: "/images/robots-coffee.webp", alt: "Two robots working together at a laptop" },
  },
  {
    title: "Proof before the interview",
    description:
      "Skill match charts show fit at a glance, and Standout Signals point to the exact resume lines behind each strength, so you skip the wasted interviews.",
    image: { src: "/images/robots-reading-coworker.webp", alt: "Robots reviewing a candidate together" },
  },
  {
    title: "Intros and scheduling, handled",
    description:
      "AI-written candidate intros get you oriented before every call, and interviews are booked in the app without the email back-and-forth.",
    image: { src: "/images/robot-cell-phone-standing.webp", alt: "Robot holding a phone" },
  },
  {
    title: "Works with your ATS",
    description:
      "JobDiva, Bullhorn, Lever, Recruit CRM and 40+ more. HireRevolution layers onto the tools you already use. No rip-and-replace.",
    image: { src: "/images/robots-woman-coworker-coffee.webp", alt: "Robots at a desk with the HireRevolution dashboard" },
  },
];

export const HIRING_COMING_SOON: Feature[] = [
  {
    title: "Batch upload resumes",
    description: "Upload a folder of resumes. We'll build profiles and rank them against your open jobs.",
    badge: "Coming soon",
  },
  {
    title: "Batch upload job descriptions",
    description: "Multiple open roles? Upload them all at once and we'll find candidates for every one.",
    badge: "Coming soon",
  },
];

export const CANDIDATE_FEATURES: Feature[] = [
  {
    title: "A profile that shows what you can do",
    description:
      "Our AI interviews you to build a 360-degree profile, capturing skills you'd never think to list, or knew so well you forgot to mention.",
    image: { src: "/images/robots-tall-short.webp", alt: "Two friendly robots" },
  },
  {
    title: "Resumes and cover letters, tailored",
    description:
      "Generate a resume and cover letter customized for each role from your full profile. No more rewriting your resume for every job.",
    image: { src: "/images/robots-coffee.webp", alt: "Robots working on an application together" },
  },
  {
    title: "Search jobs your way",
    description:
      "Search for jobs yourself, free. Or turn on auto-search and let our AI find matching jobs for you. Auto-search is free for a limited time.",
    image: { src: "/images/robot-reading.webp", alt: "Robot reading through job listings" },
  },
  {
    title: "Found by recruiters, always",
    description:
      "Your profile keeps working even when you're not looking. Recruiters find you by your skills, not your keywords.",
    image: { src: "/images/robots-woman-coworker-coffee.webp", alt: "Robots at a desk with the HireRevolution dashboard" },
  },
];

/** Auto-search will be a paid upgrade; for now it's free. Remove the promo when that ends. */
export const AUTO_SEARCH_PROMO = {
  badge: "Free for a limited time",
  title: "Let auto-search find jobs for you",
  body: "Most job sites make you do the searching. Auto-search doesn't. It keeps looking for jobs that match your skills and brings them straight to you.",
  urgency: "Auto-search will be a paid upgrade. Right now it's free, so use it while you can!",
};

export const CANDIDATE_MORE_FEATURES: Feature[] = [
  {
    title: "Multiple resume versions",
    description: "Build tailored versions of your resume for different roles or industries, all from one profile.",
  },
  {
    title: "Export and share",
    description: "Export your profile as a resume, PDF or shareable link, and use it wherever you apply.",
  },
];

/** The Synthesia explainer videos (also on the old Hostinger /demo); titles as on YouTube. */
export const VIDEOS = {
  fourClicks: { id: "7cS9JwJ_gTc", title: "Find matched candidates in 4 clicks" },
  analysis: { id: "tMIhVxsSxsc", title: "Deep candidate analysis in seconds" },
  jd: { id: "h82VtWvdZ_4", title: "Build a smarter JD and find candidates you'd miss" },
  stack: { id: "gogQ-2DdqTU", title: "Works with the stack you already run" },
};
