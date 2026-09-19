"use client";

import Link from "next/link";
import { useState } from "react";

const EMPTY_FORM = {
  companyName: "",
  companyWebsite: "",
  hiringManagerName: "",
  hiringManagerEmail: "",
  jobDescription: "",
  faxNumber: "", // honeypot, hidden from people
};

export default function SubmitJDPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/submit-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmittedEmail(formData.hiringManagerEmail.trim());
        setFormData(EMPTY_FORM);
      } else {
        const body = await response.json().catch(() => ({}));
        setError(
          body.error ??
            "Something went wrong. Please try again, or email your job description to support@hirerevolution.ai."
        );
      }
    } catch {
      setError("We couldn't reach our server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedEmail) {
    return (
      <main className="flex-1">
        <section className="py-24 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              You&apos;re all set!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Our AI is building your job description now. In a few minutes you&apos;ll get an email at{" "}
              <strong className="text-gray-900">{submittedEmail}</strong> with your free account and your first matched candidates.
            </p>
            <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next:</h2>
              <ul className="text-left space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">1.</span>
                  <span>Your job description is created in HireRevolution AI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">2.</span>
                  <span>We automatically search for candidates who have the skills it needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">3.</span>
                  <span>You get an email with a link to your matched candidates. No resumes to read.</span>
                </li>
              </ul>
            </div>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Submit Your Job Description
            </h1>
            <p className="text-xl text-gray-600">
              Paste your JD and we&apos;ll create it in HireRevolution, search for matching candidates, and email you the results within minutes. Free, for a limited time.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    num: "1",
                    title: "Paste Your JD",
                    desc: "Your company, your work email, and the job description. That's it.",
                  },
                  {
                    num: "2",
                    title: "AI Does the Work",
                    desc: "We create the job in HireRevolution and search for matching candidates.",
                  },
                  {
                    num: "3",
                    title: "Get Candidates",
                    desc: "Minutes later, an email links you to your matches and your free account.",
                  },
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold text-lg mb-3">
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Website *
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="hiringManagerName"
                    value={formData.hiringManagerName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Work Email *
                  </label>
                  <input
                    type="email"
                    name="hiringManagerEmail"
                    value={formData.hiringManagerEmail}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="jane@yourcompany.com"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Your matched candidates are sent here
                  </p>
                </div>
              </div>

              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Fax number
                  <input
                    type="text"
                    name="faxNumber"
                    value={formData.faxNumber}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  required
                  minLength={50}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Paste your job description here..."
                />
                <p className="text-xs text-gray-600 mt-1">
                  At least 50 characters. Include the job title, and our AI pulls out the rest
                </p>
              </div>

              {error && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? "Sending..." : "Find My Candidates"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Free for a limited time. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
