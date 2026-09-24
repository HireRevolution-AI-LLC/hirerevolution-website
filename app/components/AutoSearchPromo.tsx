import Image from "./Image";
import { appSignup } from "@/lib/links";
import { AUTO_SEARCH_PROMO } from "@/lib/content";
import { buttonClass } from "./ui";

/** The limited-time free auto-search offer, the headline perk for job seekers. */
export default function AutoSearchPromo() {
  return (
    <section className="px-4 py-16 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
      <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-3">
          <span className="inline-block text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full bg-amber-500 text-white mb-5">
            {AUTO_SEARCH_PROMO.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">{AUTO_SEARCH_PROMO.title}</h2>
          <p className="text-lg text-gray-700 mb-4 text-balance">{AUTO_SEARCH_PROMO.body}</p>
          <p className="text-lg font-semibold text-amber-900 mb-8">{AUTO_SEARCH_PROMO.urgency}</p>
          <a href={appSignup("individual")} className={buttonClass.primary}>
            Claim free auto-search
          </a>
        </div>
        <div className="md:col-span-2 relative aspect-[3/2] rounded-2xl overflow-hidden shadow-xl ring-1 ring-amber-200">
          <Image
            src="/images/robot-cell-phone-standing.webp"
            alt="Robot checking new job matches on a phone"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
