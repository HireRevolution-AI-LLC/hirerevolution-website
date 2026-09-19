/** Input checks shared by the website's form handlers. The app re-checks everything. */

// The offers are for a work address; these can't tie a person to a company.
export const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "ymail.com", "outlook.com",
  "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com", "mac.com",
  "aol.com", "proton.me", "protonmail.com", "gmx.com", "mail.com",
  "yandex.com", "zoho.com",
]);

/** The domain of a plausible email address, or null. */
export function emailDomain(email: string): string | null {
  const parts = email.split("@");
  if (parts.length !== 2 || !parts[0] || email.includes(" ")) return null;
  const domain = parts[1];
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) return null;
  return domain;
}

/** An absolute http(s) URL for a website the visitor typed with or without a scheme, or null. */
export function normalizeWebsite(website: string): string | null {
  try {
    const url = new URL(website.includes("://") ? website : `https://${website}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** A trimmed string (cut to `max` characters when given), or "" for anything that isn't a string. */
export function text(value: unknown, max?: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return max === undefined ? trimmed : trimmed.slice(0, max);
}
