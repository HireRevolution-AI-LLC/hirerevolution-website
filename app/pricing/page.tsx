export default function PricingPage() {
  return (
    <main className="flex-1">
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            For job seekers, it's always free. For hiring teams, it's affordable at any scale.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Candidates */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                For Job Seekers
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <p className="text-6xl font-bold text-green-600 mb-3">$0</p>
                <p className="text-xl text-gray-600 mb-8">Always free</p>
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center">
                    <span className="text-green-600 font-bold mr-3">✓</span>
                    <span>Complete your AI-powered profile</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 font-bold mr-3">✓</span>
                    <span>AI-tailored application materials</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 font-bold mr-3">✓</span>
                    <span>Auto-search for matching jobs</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 font-bold mr-3">✓</span>
                    <span>Recruiter-searchable profile</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 font-bold mr-3">✓</span>
                    <span>Export & share your profile</span>
                  </li>
                </ul>
                <a
                  href="https://app.hirerevolution.ai/dashboard/candidate"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Hiring Managers */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                For Hiring Managers & Teams
              </h2>
              <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-8">
                <p className="text-gray-600 mb-6">
                  Pricing varies based on your team size, number of open roles, and usage. We work with companies of all sizes—from individual hiring managers to large recruiting firms.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="bg-white rounded p-4 border border-blue-200">
                    <p className="font-semibold text-gray-900 mb-1">
                      Candidate Auto-Search
                    </p>
                    <p className="text-sm text-gray-600">
                      Automatically surface matching candidates after you publish a job
                    </p>
                  </div>
                  <div className="bg-white rounded p-4 border border-blue-200">
                    <p className="font-semibold text-gray-900 mb-1">
                      ATS Integration
                    </p>
                    <p className="text-sm text-gray-600">
                      Connect with Greenhouse, Lever, Bullhorn, or 40+ other platforms
                    </p>
                  </div>
                  <div className="bg-white rounded p-4 border border-blue-200">
                    <p className="font-semibold text-gray-900 mb-1">
                      Batch Processing (Coming Soon)
                    </p>
                    <p className="text-sm text-gray-600">
                      Upload multiple resumes or job descriptions at once
                    </p>
                  </div>
                  <div className="bg-white rounded p-4 border border-blue-200">
                    <p className="font-semibold text-gray-900 mb-1">
                      Priority Support
                    </p>
                    <p className="text-sm text-gray-600">
                      Dedicated support for your team
                    </p>
                  </div>
                </div>
                <a
                  href="/demo"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Book a Demo
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Special Limited-Time Offer
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Submit your job description and we'll create it in HireRevolution and search for candidates—free. Perfect way to see the platform in action.
            </p>
            <a
              href="/offers/submit-jd"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Try It Free
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Pricing?
          </h2>
          <p className="text-gray-600 mb-6">
            Every team is different. Let's talk about what works for you.
          </p>
          <a
            href="/contact"
            className="inline-block text-blue-600 font-semibold hover:text-blue-700"
          >
            Get in Touch →
          </a>
        </div>
      </section>
    </main>
  );
}
