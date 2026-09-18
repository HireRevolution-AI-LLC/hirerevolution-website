"use client";

import { useState } from "react";

export default function SubmitJDPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    companyEmail: "",
    jobTitle: "",
    jobDescription: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await fetch("/api/submit-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          companyName: "",
          companyWebsite: "",
          companyEmail: "",
          jobTitle: "",
          jobDescription: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
              Thanks for submitting!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We've received your job description and company info. Our team will process it within 24 hours and email you the results.
            </p>
            <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next:</h2>
              <ul className="text-left space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">1.</span>
                  <span>We'll optimize your job description in HireRevolution AI</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">2.</span>
                  <span>Run a candidate search across our talent pool</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">3.</span>
                  <span>Email you matched candidates and an invite to your account</span>
                </li>
              </ul>
            </div>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Home
            </a>
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
              Send us your JD and we'll create it in HireRevolution, search for matching candidates, and send you the results—all free, for a limited time.
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
                    title: "Fill Out the Form",
                    desc: "Tell us about your company and the role you're hiring for.",
                  },
                  {
                    num: "2",
                    title: "We Process It",
                    desc: "Our team creates the job in HireRevolution and searches for candidates.",
                  },
                  {
                    num: "3",
                    title: "Get Results",
                    desc: "We email you matched candidates and an invite to start hiring.",
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

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company Email *
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="hr@yourcompany.com"
                />
                <p className="text-xs text-gray-600 mt-1">
                  We'll use this to verify your company and send results
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Senior Software Engineer"
                />
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
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Paste your job description here..."
                />
                <p className="text-xs text-gray-600 mt-1">
                  Full JD or just key details—we'll enhance it either way
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit Job Description"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              We'll review and get back to you within 24 hours. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
