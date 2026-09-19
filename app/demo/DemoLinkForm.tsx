"use client";

import { useRef, useState } from "react";
import Turnstile, { type TurnstileHandle } from "../components/Turnstile";

/** Self-serve demo: emails the visitor a link into the demo environment. */

const EMPTY_FORM = { firstName: "", lastName: "", email: "", companyWebsite: "", faxNumber: "" };

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function DemoLinkForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstile = useRef<TurnstileHandle>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/demo-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, "cf-turnstile-response": turnstileToken }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setSentMessage(body.message ?? "Check your email for your demo link.");
        setForm(EMPTY_FORM);
      } else {
        setError(body.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("We couldn't reach our server. Check your connection and try again.");
    } finally {
      setLoading(false);
      // Tokens are single-use: get a fresh one before any retry.
      turnstile.current?.reset();
    }
  };

  if (sentMessage) {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800 mb-1">Check your inbox</p>
        <p className="text-green-800">{sentMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="firstName" value={form.firstName} onChange={handleChange} autoComplete="given-name"
          className={inputClass} placeholder="First name" aria-label="First name (optional)" />
        <input name="lastName" value={form.lastName} onChange={handleChange} autoComplete="family-name"
          className={inputClass} placeholder="Last name" aria-label="Last name (optional)" />
      </div>
      <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email"
        className={inputClass} placeholder="Work email *" aria-label="Work email" />
      <input type="text" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} required
        autoComplete="url" className={inputClass} placeholder="Company website *" aria-label="Company website" />
      <p className="text-xs text-gray-500">Use your work email at the same company as the website.</p>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Fax number
          <input type="text" name="faxNumber" value={form.faxNumber} onChange={handleChange} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Turnstile ref={turnstile} action="request_demo" onToken={setTurnstileToken} />

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? "Sending..." : "Get my demo link"}
      </button>
    </form>
  );
}
