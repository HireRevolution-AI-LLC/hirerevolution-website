import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility Statement | HireRevolution AI",
  description: "HireRevolution AI's commitment to digital accessibility.",
};

const ACCESSIBILITY_EMAIL = "accessibility@hirerevolution.ai";

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" updated="September 2026">
      <LegalSection title="Our commitment">
        <p>
          HireRevolution AI is committed to digital accessibility. We strive to ensure that our website is accessible to
          all users, including those with disabilities.
        </p>
        <p>
          If you encounter any accessibility barriers or need assistance, please contact us at{" "}
          <a href={`mailto:${ACCESSIBILITY_EMAIL}`} className="text-blue-700 hover:text-blue-800">
            {ACCESSIBILITY_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
