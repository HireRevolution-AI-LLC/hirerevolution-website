import type { ReactNode } from "react";

/** Layout for the policy pages kept on the website (fulfillment, accessibility). */

const ENGLISH_VERSION_NOTICE =
  "The English version of legal agreements and policies is considered the only current and valid version of this document. Any translated version is provided for your convenience only, to facilitate reading and understanding of the English version. Translated versions are not legally binding and cannot replace the English versions. In the event of disagreement or conflict, the English-language legal agreements and policies shall prevail.";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="flex-1">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: {updated}</p>
        {children}
        <p className="text-sm text-gray-500 border-t border-gray-200 pt-6 mt-12">{ENGLISH_VERSION_NOTICE}</p>
      </article>
    </main>
  );
}
