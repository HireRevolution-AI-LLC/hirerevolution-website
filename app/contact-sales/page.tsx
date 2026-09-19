"use client";

import { useRef, useState } from "react";
import Turnstile, { type TurnstileHandle } from "../components/Turnstile";

const TEAM_SIZES = ["Under 50", "50-200", "201-1,000", "1,001-5,000", "5,001-10,000", "10,000+"];

const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  companyWebsite: "",
  teamSize: "",
  message: "",
  faxNumber: "", // honeypot, hidden from people
};

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function ContactSalesPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstile = useRef<TurnstileHandle>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contact-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, "cf-turnstile-response": turnstileToken }),
      });
      if (response.ok) {
        setSent(true);
        setFormData(EMPTY_FORM);
      } else {
        const body = await response.json().catch(() => ({}));
        setError(body.error ?? "Something went wrong. Please email us at support@hirerevolution.ai.");
      }
    } catch {
      setError("We couldn't reach our server. Check your connection and try again.");
    } finally {
      setLoading(false);
      // Tokens are single-use: get a fresh one before any retry.
      turnstile.current?.reset();
    }
  };

  if (sent) {
    return (
      <main className="flex-1">
        <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Thanks, we&apos;ll be in touch</h1>
            <p className="text-lg text-gray-600">
              Someone from our team will reply within one business day. Need us sooner? Email{" "}
              <a href="mailto:support@hirerevolution.ai" className="text-blue-600 hover:text-blue-700">
                support@hirerevolution.ai
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">HireRevolution for Your Team</h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Hiring at scale? Tell us about your team and we&apos;ll set up a plan that fits, including your ATS and
            every open role.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Your Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  autoComplete="name" className={inputClass} placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Work Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  autoComplete="email" className={inputClass} placeholder="jane@yourcompany.com" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Company *</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} required
                  autoComplete="organization" className={inputClass} placeholder="Your Company" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Company Website</label>
                <input type="text" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange}
                  className={inputClass} placeholder="https://yourcompany.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Company Size</label>
              <select name="teamSize" value={formData.teamSize} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                {TEAM_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">How can we help?</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={5}
                className={inputClass} placeholder="Roles you're hiring for, your ATS, timelines..." />
            </div>

            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Fax number
                <input type="text" name="faxNumber" value={formData.faxNumber} onChange={handleChange}
                  tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <Turnstile ref={turnstile} action="contact_sales" onToken={setTurnstileToken} />

            {error && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Contact Sales"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Prefer email?{" "}
              <a href="mailto:support@hirerevolution.ai" className="text-blue-600 hover:text-blue-700">
                support@hirerevolution.ai
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
