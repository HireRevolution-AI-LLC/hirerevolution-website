/**
 * Links into the HireRevolution app. Each website server points at its own app
 * environment (staging -> app-dev, production -> app), set per environment in
 * config/.env.{dev,prod} and baked in at build time.
 */

// Local dev has no env file; fall back to production like the old hard-coded links.
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.hirerevolution.ai";

export type AppRole = "employer" | "individual";

export function appLogin(): string {
  return `${APP_URL}/login`;
}

/** Opens the app's Sign Up tab with the role card already chosen. */
export function appSignup(role: AppRole): string {
  return `${APP_URL}/login?mode=signup&role=${role}`;
}

export const CALENDLY_URL = "https://calendly.com/gregg-hirerevolution/new-meeting";
export const SUPPORT_EMAIL = "support@hirerevolution.ai";
export const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/greggcasey/";

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/hirerevolution-ai" },
  { label: "Instagram", href: "https://www.instagram.com/hirerevolutionai" },
  { label: "Facebook", href: "https://www.facebook.com/people/HireRevolution-AI/61574665592873/" },
  { label: "Bluesky", href: "https://bsky.app/profile/hirerevolutionai.bsky.social" },
];
