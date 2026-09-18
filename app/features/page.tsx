export default function FeaturesPage() {
  const hiringFeatures = [
    {
      title: "Auto-Search for Candidates",
      description:
        "Publish a job description. Our AI automatically searches for and surfaces matching candidates from our recruiter-searchable talent pool. No manual screening, no keyword games.",
      status: "Live",
    },
    {
      title: "Works with Your ATS",
      description:
        "Greenhouse, Lever, Bullhorn, or 40+ others. HireRevolution connects directly—no rip-and-replace, no new workflow. Layer AI-powered matching on top of what you already use.",
      status: "Live",
    },
    {
      title: "Batch Upload Resumes",
      description:
        "Upload a folder of resumes. We'll build candidate profiles and rank them against your open jobs—turning a stack of resumes into a ranked shortlist.",
      status: "Coming Soon",
    },
    {
      title: "Batch Upload Job Descriptions",
      description:
        "Multiple open roles? Upload them all at once. We optimize each JD and run candidate searches across all positions.",
      status: "Coming Soon",
    },
    {
      title: "Skill Match Analysis",
      description:
        "Visual charts showing how a candidate's skills map to your role requirements. Fit assessment in seconds, not minutes.",
      status: "Live",
    },
    {
      title: "AI-Generated Candidate Intros",
      description:
        "Intros are written automatically based on each candidate's background. Walk into calls already oriented.",
      status: "Live",
    },
  ];

  const candidateFeatures = [
    {
      title: "Complete Your Profile",
      description:
        "Our AI interviews you to build a 360-degree profile—capturing skills and experience you'd never think to list on a resume.",
      status: "Live",
    },
    {
      title: "Auto-Search for Jobs",
      description:
        "Publish your profile and we'll automatically surface matching job opportunities. Job search becomes passive and skills-based.",
      status: "Live",
    },
    {
      title: "AI-Tailored Applications",
      description:
        "Every application is customized for the role. No more generic resumes—your actual fit shines through.",
      status: "Live",
    },
    {
      title: "Recruiter-Searchable Profile",
      description:
        "Your profile keeps working for you even when you're not actively job hunting. Recruiters can find you based on skills.",
      status: "Live",
    },
    {
      title: "Multiple Resume Versions",
      description:
        "Build tailored versions of your resume for different roles or industries, all from your complete profile.",
      status: "Live",
    },
    {
      title: "Export & Share",
      description:
        "Export your profile as a resume, PDF, or shareable link. Use it wherever you're applying.",
      status: "Live",
    },
  ];

  return (
    <main className="flex-1">
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Hire Smarter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a hiring manager looking to eliminate resume screening, or a job seeker ready to apply based on your actual skills—we have the features you need.
          </p>
        </div>
      </section>

      {/* Hiring Manager Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            For Hiring Managers & Recruiting Teams
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Stop spending dozens of hours a week on resume screening, candidate intros, and scheduling. We automate all of it.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {hiringFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {feature.title}
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap ml-3">
                    {feature.status}
                  </span>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/demo"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              See It in Action
            </a>
          </div>
        </div>
      </section>

      {/* Candidate Features */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            For Job Seekers
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Stop optimizing resumes for algorithms. Apply based on your actual skills. Free, always.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {candidateFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {feature.title}
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap ml-3">
                    {feature.status}
                  </span>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://app.hirerevolution.ai/dashboard/candidate"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Free
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
