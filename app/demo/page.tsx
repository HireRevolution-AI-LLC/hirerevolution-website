export default function DemoPage() {
  return (
    <main className="flex-1">
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            See HireRevolution in Action
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            See how we find candidates who actually fit—not just resume keywords. Book a 20-minute demo with our team.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What You'll See
            </h2>
            <div className="text-left space-y-4 mb-8">
              <div className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 text-lg">1</span>
                <div>
                  <p className="font-semibold text-gray-900">How the AI builds candidate profiles</p>
                  <p className="text-gray-600 text-sm mt-1">
                    The 360-degree approach that captures skills you'd never list on a resume
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 text-lg">2</span>
                <div>
                  <p className="font-semibold text-gray-900">How the matching works</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Skills-based matching that beats keyword screening
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 text-lg">3</span>
                <div>
                  <p className="font-semibold text-gray-900">Your ATS integration</p>
                  <p className="text-gray-600 text-sm mt-1">
                    How HireRevolution layers onto the tools you already use
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 font-bold mr-3 text-lg">4</span>
                <div>
                  <p className="font-semibold text-gray-900">Next steps & pricing</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Customized to your team size and hiring needs
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Schedule Your Demo
              </h3>
              <p className="text-gray-600 mb-6">
                We'll send you a calendar link via email. Choose a time that works for you.
              </p>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Request Demo
                </button>
              </form>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            Demo meetings are typically 20–30 minutes. We'll answer all your questions and show you how HireRevolution works for your specific needs.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Or Try It Now (Free)
          </h2>
          <p className="text-gray-600 mb-6">
            Don&apos;t want to wait for a demo? Paste a job description and we&apos;ll email you matching candidates within minutes.
          </p>
          <a
            href="/offers/submit-jd"
            className="inline-block text-blue-600 font-semibold hover:text-blue-700"
          >
            Submit a Job Description →
          </a>
        </div>
      </section>
    </main>
  );
}
