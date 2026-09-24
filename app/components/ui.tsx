import Image from "./Image";
import type { ReactNode } from "react";

/** Shared page building blocks, so the hiring and candidate pages look alike. */

export type Feature = {
  title: string;
  description: string;
  image?: { src: string; alt: string };
  badge?: string;
};

export function PageHero({ title, subtitle, children }: { title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">{title}</h1>
        {subtitle && <p className="text-xl text-gray-600 text-balance">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

/** Dark hero with a picture on the right, used by the two home pages. */
export function ImageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  image: { src: string; alt: string };
  children: ReactNode;
}) {
  return (
    <section className="bg-gradient-to-br from-[#0B1633] via-[#13244F] to-[#1D2E51] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-4">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-balance">{title}</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl text-balance">{subtitle}</p>
          {children}
        </div>
        <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

export function Section({
  title,
  subtitle,
  tone = "white",
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  tone?: "white" | "gray";
  children: ReactNode;
}) {
  return (
    <section className={`py-20 px-4 ${tone === "gray" ? "bg-gray-50" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">
        {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center text-balance">{title}</h2>}
        {subtitle && <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto text-balance">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
      {feature.image && (
        <div className="relative aspect-[3/2] bg-gray-100">
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
          {feature.badge && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
              {feature.badge}
            </span>
          )}
        </div>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </div>
  );
}

export function FeatureGrid({ features, columns = 2 }: { features: Feature[]; columns?: 2 | 3 }) {
  return (
    <div className={`grid gap-8 ${columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
      {features.map((f) => (
        <FeatureCard key={f.title} feature={f} />
      ))}
    </div>
  );
}

export function CheckList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start text-gray-700">
          <span className="text-blue-600 font-bold mr-3 mt-0.5" aria-hidden="true">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({ title, subtitle, children }: { title: ReactNode; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{title}</h2>
        {subtitle && <p className="text-lg text-blue-100 mb-8 text-balance">{subtitle}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">{children}</div>
      </div>
    </section>
  );
}

export const buttonClass = {
  primary: "inline-block text-center bg-blue-600 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition",
  onDark: "inline-block text-center bg-white text-blue-700 px-7 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition",
  outlineOnDark:
    "inline-block text-center border-2 border-white/70 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition",
  outline:
    "inline-block text-center border-2 border-blue-600 text-blue-700 px-7 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition",
};
