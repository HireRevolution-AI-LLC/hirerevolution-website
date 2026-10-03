"use client";

import { useRef, useState } from "react";
import Turnstile, { type TurnstileHandle } from "../../components/Turnstile";
import { ACCEPT, FILE_TOO_LARGE, MAX_UPLOAD_BYTES, UNSUPPORTED_FILE, isParsedFile, isTextFile } from "@/lib/jd-upload";
import NextSteps from "./NextSteps";

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
  const [submitted, setSubmitted] = useState<{
    email: string;
    importId: string | null;
    statusToken: string | null;
    freeCandidateCap: number | null;
  } | null>(null);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstile = useRef<TurnstileHandle>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [upload, setUpload] = useState<{ ok: boolean; message: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fills the job description box from a file; it never submits anything. The
  // visitor still reads what came out and presses "Find My Candidates".
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Clear it so choosing the same file again still fires a change.
    e.target.value = "";
    if (!file) return;
    setUpload(null);

    if (!isTextFile(file.name) && !isParsedFile(file.name)) {
      setUpload({ ok: false, message: UNSUPPORTED_FILE });
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUpload({ ok: false, message: FILE_TOO_LARGE });
      return;
    }
    // A PDF or DOCX goes to the server, which wants the human check first.
    // Text files are read right here and need nothing.
    if (isParsedFile(file.name) && !turnstileToken) {
      setUpload({ ok: false, message: "Please complete the \"Verify you are human\" check below, then upload again." });
      return;
    }

    setUploading(true);
    try {
      let text: string;
      if (isTextFile(file.name)) {
        text = await file.text();
      } else {
        const body = new FormData();
        body.append("file", file);
        body.append("cf-turnstile-response", turnstileToken);
        const response = await fetch("/api/submit-jd/extract", { method: "POST", body });
        const result = await response.json().catch(() => ({}));
        // Tokens are single-use: this one is spent whatever happened.
        turnstile.current?.reset();
        if (!response.ok || typeof result.text !== "string") {
          setUpload({
            ok: false,
            message:
              response.status === 413
                ? FILE_TOO_LARGE
                : (result.error ?? "We couldn't read that file. Please paste the job description instead."),
          });
          return;
        }
        text = result.text;
      }
      text = text.trim();
      if (!text) {
        setUpload({ ok: false, message: "That file is empty." });
        return;
      }
      setFormData((prev) => ({ ...prev, jobDescription: text }));
      setUpload({ ok: true, message: `Filled in from ${file.name}. Check it over before you send it.` });
    } catch {
      setUpload({ ok: false, message: "We couldn't reach our server. Check your connection and try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoginUrl(null);

    try {
      const response = await fetch("/api/submit-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, "cf-turnstile-response": turnstileToken }),
      });

      if (response.ok) {
        const body = await response.json().catch(() => ({}));
        setSubmitted({
          email: formData.hiringManagerEmail.trim(),
          importId: body.importId ?? null,
          statusToken: body.statusToken ?? null,
          freeCandidateCap: body.freeCandidateCap ?? null,
        });
        setFormData(EMPTY_FORM);
      } else {
        const body = await response.json().catch(() => ({}));
        setLoginUrl(typeof body.loginUrl === "string" ? body.loginUrl : null);
        setError(
          body.error ??
            "Something went wrong. Please try again, or email your job description to support@hirerevolution.ai."
        );
      }
    } catch {
      setError("We couldn't reach our server. Check your connection and try again.");
    } finally {
      setLoading(false);
      // Tokens are single-use: get a fresh one before any retry.
      turnstile.current?.reset();
    }
  };

  if (submitted) {
    return (
      <NextSteps
        email={submitted.email}
        importId={submitted.importId}
        statusToken={submitted.statusToken}
        freeCandidateCap={submitted.freeCandidateCap}
      />
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
              Paste your JD and we&apos;ll create it in HireRevolution, search for matching candidates, and email you a link to them within minutes. Free, for a limited time.
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
                    title: "Paste or Upload Your JD",
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
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-900">
                    Job Description *
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading || loading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                      <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                    </svg>
                    {uploading ? "Reading file..." : "Upload a file"}
                  </button>
                  <input
                    ref={fileInput}
                    type="file"
                    accept={ACCEPT}
                    onChange={handleFile}
                    className="hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </div>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  required
                  minLength={50}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Paste your job description here, or upload a PDF, Word or text file"
                />
                {upload && (
                  <p
                    role={upload.ok ? "status" : "alert"}
                    className={`text-sm mt-1 ${upload.ok ? "text-green-700" : "text-red-700"}`}
                  >
                    {upload.message}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  At least 50 characters. Include the job title, and our AI pulls out the rest. Uploads: PDF, Word (.docx) or text, up to 5 MB
                </p>
              </div>

              <Turnstile ref={turnstile} action="submit_jd" onToken={setTurnstileToken} />

              {error && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                  {loginUrl && (
                    <>
                      {" "}
                      <a href={loginUrl} className="font-semibold underline">
                        Log in to HireRevolution
                      </a>
                    </>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !turnstileToken}
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
