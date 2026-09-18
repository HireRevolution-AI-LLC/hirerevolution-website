"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send email
    setSubmitted(true);
    setFormData({ name: "", email: "", company: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main className="flex-1">
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Questions? Feedback? We'd love to hear from you.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Thanks for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Or email us directly</h3>
              <p className="text-gray-600">
                <a
                  href="mailto:support@hirerevolution.ai"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@hirerevolution.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Sales Inquiries</h3>
              <p className="text-gray-600 text-sm">
                Learn more about pricing and implementation
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm">
                Technical support and account help
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Feedback</h3>
              <p className="text-gray-600 text-sm">
                Feature requests or product feedback
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
