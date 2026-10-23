import type { Feature } from "@/app/components/ui";

/**
 * Feature copy, from Marketing/marketing-overview.md and features-website.md.
 * Only Live features are promoted; anything else carries a badge.
 */

/**
 * Ordered by Marketing/features-priority-ranking.md, so the strongest sellers come first:
 * auto-search, skills ranking, ATS integration and sourcing are Tier 1.
 */
export const HIRING_FEATURES: Feature[] = [
  {
    title: "Auto-search finds your candidates",
    description:
      "Publish a job and our AI searches for matching candidates automatically, ranks them by fit, and keeps looking as new people join. No sourcing, no keyword games.",
    image: { src: "/images/robots-crowd.webp", alt: "A crowd of robots, one standing out" },
  },
  {
    title: "Skills, not keywords",
    description:
      "Candidates arrive ranked by the skills they've actually shown, not the keywords they typed, with the evidence behind every score. You spend your time deciding, not sorting.",
    image: { src: "/images/robot-reading.webp", alt: "Robot analyzing a resume" },
  },
  {
    title: "Works with your ATS",
    description:
      "JobDiva, Bullhorn, Lever, Recruit CRM and 40+ more. HireRevolution layers onto the tools you already use. No rip-and-replace.",
    image: { src: "/images/robots-woman-coworker-coffee.webp", alt: "Robots at a desk with the HireRevolution dashboard" },
  },
  {
    title: "Candidates found before anyone applies",
    description:
      "We also search the wider market for people who fit your job and build the strongest into full profiles for you to review. You hear from us when there are strong matches, and not when there aren't.",
    image: { src: "/images/robot-executive.webp", alt: "Robot at a desk with a glowing globe, searching the market" },
  },
  {
    title: "Proof before the interview",
    description:
      "Skill match charts show fit at a glance, and Standout Signals point to the exact resume lines behind each strength, so you skip the wasted interviews.",
    image: { src: "/images/robots-reading-coworker.webp", alt: "Robots reviewing a candidate together" },
  },
  {
    title: "An AI that interviews you for the JD",
    description:
      "Tell our AI about the role, the team and what success looks like. It writes a job description that captures what you really need.",
    image: { src: "/images/robots-coffee.webp", alt: "Two robots working together at a laptop" },
  },
  {
    title: "Intros and scheduling, handled",
    description:
      "AI-written candidate intros get you oriented before every call, and interviews are booked in the app without the email back-and-forth.",
    image: { src: "/images/robot-cell-phone-standing.webp", alt: "Robot holding a phone" },
  },
  {
    title: "Hours back, every week",
    description:
      "Sourcing, screening, candidate intros and scheduling all run on their own. Your team spends its time on judgment and relationships instead of admin.",
    image: { src: "/images/robots-tall-short.webp", alt: "Two robots handling the work side by side" },
  },
  {
    title: "Running in minutes, not months",
    description:
      "Nothing to install, nothing to migrate, no training. Upload or paste a job description, or let our AI interview you for one, and the matching starts while you're still reviewing the response.",
    image: { src: "/images/early-access.webp", alt: "Robot stepping through a glowing doorway" },
  },
];

/** Tier 2 in the priority ranking: reviewing candidates as a team. All three are live in prod. */
export const HIRING_TEAM_FEATURES: Feature[] = [
  {
    title: "A ranked shortlist, not a pile of resumes",
    description:
      "Pick up to 25 candidates and share one link. Colleagues open it with a code sent to their work email, see everyone ranked with the full skills analysis, and need no account. Turn the link off any time.",
  },
  {
    title: "See your applicants without signing up",
    description:
      "One click from our email opens your job's applicants ranked by match, plus its strongest matches who haven't applied yet. Names stay hidden until you sign in.",
  },
  {
    title: "New matches every Monday",
    description:
      "One email a week for each open job, with the best new matching candidates, new applicants and views. In a week with nothing new, we don't send anything.",
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

/** Auto-search for jobs leads: it is the Tier 1 candidate feature and free for a limited time. */
export const CANDIDATE_FEATURES: Feature[] = [
  {
    title: "Auto-search finds jobs for you",
    description:
      "Finish your profile and our AI searches for jobs that match your skills, then keeps bringing new ones to you even when you're not looking. Searching yourself is always free.",
    image: { src: "/images/robot-reading.webp", alt: "Robot reading through job listings" },
    badge: "Free for a limited time",
  },
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
