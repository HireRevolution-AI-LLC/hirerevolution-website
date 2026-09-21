"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SUPPORT_EMAIL, appLogin, appSignup } from "@/lib/links";

/**
 * Shown after a website JD submission. Polls until the app has built the job,
 * then offers its no-login preview link (where they can also sign up), and
 * explains what to expect next.
 */

const APP_SIGNUP_URL = appSignup("employer");
const APP_LOGIN_URL = appLogin();
// Matches the app's hm_free_candidate_cap default; the app's value wins when it sends one.
const DEFAULT_FREE_CANDIDATE_CAP = 15;
const POLL_MS = 5_000;
const GIVE_UP_MS = 6 * 60_000;
const IN_PROGRESS = new Set(["queued", "pending", "processing", "running", "unknown"]);

type Props = {
  email: string;
  importId: string | null;
  /** Signed by the API for this import; /api/submit-jd/status needs it. */
  statusToken: string | null;
  freeCandidateCap: number | null;
};

type Progress =
  | { state: "building" }
  | { state: "ready"; previewUrl: string | null; jobTitle: string | null }
  | { state: "later" }; // failed, timed out, or no import id: the email carries the link

export default function NextSteps({ email, importId, statusToken, freeCandidateCap }: Props) {
  // No token means no way to poll, so go straight to "we will email it".
  const canPoll = Boolean(importId && statusToken);
  const [progress, setProgress] = useState<Progress>(canPoll ? { state: "building" } : { state: "later" });
  const [cap, setCap] = useState(freeCandidateCap ?? DEFAULT_FREE_CANDIDATE_CAP);

  useEffect(() => {
    if (!importId || !statusToken) return;
    const started = Date.now();
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/submit-jd/status?id=${encodeURIComponent(importId)}`, {
          cache: "no-store",
          headers: { "X-Submission-Token": statusToken },
        });
        if (res.ok) {
          const body = await res.json();
          if (typeof body.freeCandidateCap === "number") setCap(body.freeCandidateCap);
          if (body.status === "done") {
            if (!cancelled) setProgress({ state: "ready", previewUrl: body.previewUrl, jobTitle: body.jobTitle });
            return;
          }
          if (!IN_PROGRESS.has(body.status)) {
            if (!cancelled) setProgress({ state: "later" });
            return;
          }
        }
      } catch {
        // Keep polling through a blip.
      }
      if (Date.now() - started > GIVE_UP_MS) {
        if (!cancelled) setProgress({ state: "later" });
        return;
      }
      timer = setTimeout(poll, POLL_MS);
    };

    timer = setTimeout(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [importId, statusToken]);

  return (
    <main className="flex-1">
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">You&apos;re all set!</h1>
            <p className="text-lg text-gray-600">
              We&apos;re building your job description and searching for candidates. Everything also goes to{" "}
              <strong className="text-gray-900">{email}</strong>.
            </p>
          </div>

          {/* Your job */}
          <div className="bg-white rounded-lg p-6 md:p-8 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your job</h2>
            {progress.state === "building" && (
              <div className="flex items-center gap-3 text-gray-600" role="status">
                <span className="inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Our AI is building your job description. This usually takes about 2 minutes.</span>
              </div>
            )}
            {progress.state === "ready" && progress.previewUrl && (
              <div>
                <p className="text-gray-600 mb-4">
                  {progress.jobTitle ? (
                    <>
                      <strong className="text-gray-900">{progress.jobTitle}</strong> is ready.
                    </>
                  ) : (
                    "Your job is ready."
                  )}{" "}
                  See it and its matching candidates. No login needed. From there you can create your free account.
                </p>
                <a
                  href={progress.previewUrl}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  View your job
                </a>
                <p className="text-xs text-gray-500 mt-3 break-all">
                  Save this link: <span className="font-mono">{progress.previewUrl}</span>
                </p>
              </div>
            )}
            {(progress.state === "later" || (progress.state === "ready" && !progress.previewUrl)) && (
              <p className="text-gray-600">
                We&apos;ll email the link to your job to <strong className="text-gray-900">{email}</strong> as soon as
                it&apos;s ready. It opens without a login.
              </p>
            )}
          </div>

          {/* What happens next */}
          <div className="bg-white rounded-lg p-6 md:p-8 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next</h2>
            <ol className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">1.</span>
                <span>
                  <strong className="text-gray-900">A welcome email</strong> arrives at {email} with a link to your job
                  and your matched candidates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">2.</span>
                <span>
                  <strong className="text-gray-900">New candidates every week.</strong> As we find people with the
                  skills your job needs, we email them to you weekly. The first {cap} candidates we email you are
                  free. After that, subscribe to keep getting new matches by email.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">3.</span>
                <span>
                  <strong className="text-gray-900">Keep going in the app.</strong> This website offer covers up to 2
                  job descriptions. Create your free account to add more jobs, connect your ATS, and improve your JD
                  with AI coaching.
                </span>
              </li>
            </ol>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a
                href={APP_SIGNUP_URL}
                className="text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create your free account
              </a>
              <a
                href={APP_LOGIN_URL}
                className="text-center border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Log in
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Questions? Email us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 hover:text-blue-700">
              {SUPPORT_EMAIL}
            </a>
            . <Link href="/" className="text-blue-600 hover:text-blue-700">Back to home</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
