import Link from "next/link";
import HeroMapPlaceholder from "@/components/hero/HeroMapPlaceholder";
import { fetchHealth } from "@/lib/api";

export default async function HomePage() {
  const healthResult = await fetchHealth();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-950/40 text-xs font-semibold text-orange-400 mb-6">
            <span>ଆମ ଅଂଚଳ ର ପ୍ରଚାର</span>
            <span>•</span>
            <span>Odisha&apos;s Phygital Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Bhubaneswar’s Trusted Publicity Platform —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Now Powered by Digital Identity.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
            From our widely read monthly print booklet to dynamic QR-powered digital profiles. 
            Connect your storefront, professional brand, and print promotions into one seamless local experience.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition shadow-lg shadow-orange-600/25"
            >
              Claim Your Digital Card
            </Link>
            <Link
              href="/advertise"
              className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition"
            >
              Explore Ad Packages (P1–P5)
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div>
              <span className="font-semibold text-slate-200">Free Distribution</span> across Bhubaneswar
            </div>
            <div>
              <span className="font-semibold text-slate-200">PRGI Reg:</span> ORORI/25/A3295
            </div>
            <div>
              <span className="font-semibold text-slate-200">18th</span> Monthly Cutoff
            </div>
          </div>
        </div>

        {/* Hero Visual Container (Odisha Map Foundation) */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <HeroMapPlaceholder />
        </div>
      </section>

      {/* Backend Foundation Health Check Indicator */}
      <section className="w-full border-t border-slate-800/60 bg-slate-950/40 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-medium text-slate-300">Foundation Architecture:</span>
            <span>Next.js 14 App Router</span>
            <span>+</span>
            <span>Spring Boot 3.3.4 (Java 21)</span>
            <span>+</span>
            <span>PostgreSQL 16</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">API Status:</span>
            {healthResult.success ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Connected ({healthResult.data?.status})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                API Offline (Start Backend on 8080)
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
