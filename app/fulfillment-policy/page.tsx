import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../components/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Fulfillment Policy: Refunds, Delivery and Cancellation | HireRevolution AI",
  description: "How HireRevolution AI handles refunds, delivery, returns and cancellation.",
};

const Support = () => (
  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-700 hover:text-blue-800">
    {SUPPORT_EMAIL}
  </a>
);

export default function FulfillmentPolicyPage() {
  return (
    <LegalPage title="Fulfillment Policy" updated="September 2026">
      <LegalSection title="Refund Policy">
        <p>
          Every account includes a free tier, so you can evaluate HireRevolution AI before you pay for a plan. For that
          reason, we do not offer refunds. If something isn&apos;t working for you, email <Support /> and we&apos;ll help.
        </p>
        <p>
          <strong>Job seekers:</strong> most of HireRevolution AI is free. Automatic job search (auto-search) is a paid
          upgrade, and it is free for a limited time.
        </p>
      </LegalSection>

      <LegalSection title="Delivery Policy">
        <p>As a software product, our services are delivered digitally.</p>
        <p>
          <strong>Job seekers:</strong> after you create a resume or cover letter, it is emailed to your account within
          minutes.
        </p>
        <p>
          <strong>Hiring managers:</strong> job descriptions are processed within minutes, and a list of available
          candidates is shown on screen.
        </p>
        <p>
          Anything else your subscription includes is delivered digitally by email, download or a similar method, as
          appropriate. If you have any questions or problems, contact us at <Support />.
        </p>
      </LegalSection>

      <LegalSection title="Return Policy">
        <p>
          Since we deliver digital services, returns don&apos;t apply. If there&apos;s an issue, let us know at{" "}
          <Support />. We want you to be happy.
        </p>
      </LegalSection>

      <LegalSection title="Cancellation Policy">
        <p>
          You can cancel your subscription at any time in your account settings. Your access stays active until the end
          of the current billing period.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
