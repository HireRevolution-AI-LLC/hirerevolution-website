import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, buttonClass } from "../components/ui";
import { CALENDLY_URL, SOCIAL_LINKS, SUPPORT_EMAIL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact | HireRevolution AI",
  description: "Talk to sales, book a demo, or email our team.",
};

const OPTIONS = [
  {
    title: "Hiring for your team?",
    text: "Tell us about your roles, your ATS and your timeline, and we'll set up a plan that fits.",
    action: { label: "Talk to sales", href: "/contact-sales", external: false },
  },
  {
    title: "Want to see it first?",
    text: "Book a 20-minute walkthrough, or try the demo environment yourself right now.",
    action: { label: "See demo options", href: "/demo", external: false },
  },
  {
    title: "Anything else",
    text: "Questions about your account, feedback, or help as a job seeker. We usually reply within one business day.",
    action: { label: `Email ${SUPPORT_EMAIL}`, href: `mailto:${SUPPORT_EMAIL}`, external: true },
  },
];

export default function ContactPage() {
  return (
    <main className="flex-1">
      <PageHero title="Get in touch" subtitle="Questions? Feedback? We'd love to hear from you." />
      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          {OPTIONS.map((o) => (
            <div key={o.title} className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{o.title}</h2>
              <p className="text-gray-600 mb-6">{o.text}</p>
              <div className="mt-auto">
                {o.action.external ? (
                  <a href={o.action.href} className="text-blue-700 font-semibold hover:text-blue-800 break-all">
                    {o.action.label}
                  </a>
                ) : (
                  <Link href={o.action.href} className={buttonClass.primary}>
                    {o.action.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-3">
            Prefer to pick a time directly?{" "}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:text-blue-800">
              Book on our calendar →
            </a>
          </p>
          <p>
            Follow us:{" "}
            {SOCIAL_LINKS.map((s, i) => (
              <span key={s.label}>
                {i > 0 && " · "}
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 underline underline-offset-4">
                  {s.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </Section>
    </main>
  );
}
