"use client";

import { useState } from "react";

export default function Home() {
  const [userType, setUserType] = useState<"hiring" | "candidate" | null>(null);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop Wasting Time on Hiring
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Skills-based matching that actually works. For hiring managers who want their time back, and job seekers who deserve better.
          </p>

          {/* Dual CTA Buttons */}
          {!userType ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <button
                onClick={() => setUserType("hiring")}
                className="flex-1 max-w-xs bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                I Need Help Hiring
              </button>
              <button
                onClick={() => setUserType("candidate")}
                className="flex-1 max-w-xs border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
              >
                I Need Help Finding a Job
              </button>
            </div>
          ) : (
            <button
              onClick={() => setUserType(null)}
              className="text-sm text-gray-600 hover:text-gray-900 mb-8 underline"
            >
              ← Back to options
            </button>
          )}
        </div>
      </section>

      {/* Hiring Manager Section */}
      {(userType === null || userType === "hiring") && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              For Hiring Managers & Recruiting Teams
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              You're spending dozens of hours a week on resume screening, candidate intros, and scheduling. We make that disappear.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Feature Cards */}
              {[
                {
                  title: "Auto-Search for Candidates",
                  description:
                    "Publish a job description. We find matching candidates automatically—no manual screening.",
                  status: "Live",
                },
                {
                  title: "Works with Your ATS",
                  description:
                    "Greenhouse, Lever, Bullhorn, or 40+ others. No rip-and-replace. Layer AI on top of what you already use.",
                  status: "Live",
                },
                {
                  title: "Batch Upload Resumes",
                  description:
                    "Upload a folder of resumes. We'll build profiles and rank them against your open jobs.",
                  status: "Coming Soon",
                },
                {
                  title: "Batch Upload Job Descriptions",
                  description:
                    "Multiple jobs, one upload. We optimize them and find candidates for all of them.",
                  status: "Coming Soon",
                },
              ].map((feature, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Special Offer Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Submit Your Job Description</h3>
              <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                Send us your JD and we'll create it in HireRevolution and search for matching candidates—free, for a limited time.
              </p>
              <a
                href="/offers/submit-jd"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Submit Your JD
              </a>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="/demo"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Candidate Section */}
      {(userType === null || userType === "candidate") && (
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              For Job Seekers
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Stop guessing keywords. Apply based on your actual skills. Free, always.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  title: "Complete Your Profile",
                  description:
                    "Our AI interviews you to build a 360-degree profile—way more complete than a resume.",
                },
                {
                  title: "Auto-Search for Jobs",
                  description:
                    "Publish your profile. We find matching jobs automatically. Passive matching that works.",
                },
                {
                  title: "AI-Tailored Applications",
                  description:
                    "Every application is customized for the role—no more generic resumes.",
                },
                {
                  title: "Recruiter-Searchable Profile",
                  description:
                    "Your profile keeps working for you even when you're not actively job hunting.",
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="https://app.hirerevolution.ai/dashboard/candidate"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Your Profile (Free)
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
