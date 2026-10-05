import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Community Blog & Local Commerce Insights — PRACHAR",
  description:
    "Practical guides, merchant case studies, and local marketing strategies for retail stores, clinics, and businesses across Bhubaneswar, Odisha.",
};

export default function BlogPage() {
  const articles = [
    {
      slug: "bhubaneswar-retailers-doubling-walk-ins-phygital-qr",
      title: "How Bhubaneswar Retailers Are Doubling Walk-ins with Phygital QR Codes",
      odiaTitle: "ଡିଜିଟାଲ କ୍ୟୁ.ଆର ମାଧ୍ୟମରେ ସ୍ଥାନୀୟ ବ୍ୟବସାୟ ର ପ୍ରଚାର",
      excerpt:
        "Why pure social media ads get scrolled past, while a physical booklet delivered to BJB Nagar & Saheed Nagar study desks with a direct WhatsApp QR code generates high-intent buyers.",
      date: "September 2026",
      readTime: "4 min read",
      category: "Local Marketing",
      featured: true,
      author: "Himansu Nayak",
    },
    {
      slug: "the-18th-monthly-cutoff-rule-explained",
      title: "The 18th Monthly Cutoff: Why Timing Dictates Print Advertising Success",
      odiaTitle: "ପ୍ରତ୍ୟେକ ମାସ ୧୮ ତାରିଖ କଟ୍-ଅଫ୍ ନିୟମ",
      excerpt:
        "A behind-the-scenes look at Chandan Printers (Unit-3) press runs, plate preparation, and how submitting proofs before the 18th guarantees 1st-of-month city circulation.",
      date: "September 2026",
      readTime: "3 min read",
      category: "Print & Production",
      featured: false,
      author: "Ashutosh Mahalik",
    },
    {
      slug: "puri-sweets-case-study-10k-scans",
      title: "Case Study: How Puri Sweets Turned a Quarter-Page Ad into 10,000 Customer Scans",
      odiaTitle: "ସଫଳତା କାହାଣୀ: ପୁରୀ ସୁଇଟ୍ସ ଆଣ୍ଡ କ୍ୟାଟରର୍ସ",
      excerpt:
        "Learn how a local bakery linked their Chhena Poda menu with PRACHAR's dynamic routing engine to streamline festive pre-orders across Bhubaneswar.",
      date: "August 2026",
      readTime: "5 min read",
      category: "Merchant Spotlight",
      featured: false,
      author: "Purusottam Sahu",
    },
    {
      slug: "nfc-smart-cards-vs-paper-visiting-cards",
      title: "NFC Smart Cards vs. Disposable Paper Cards: The 2026 Commercial Comparison",
      odiaTitle: "କାଗଜ ଭିଜିଟିଂ କାର୍ଡ ବଦଳରେ ସ୍ମାର୍ଟ ଏନ.ଏଫ.ସି କାର୍ଡ",
      excerpt:
        "Discover why over 40% of traditional business cards end up in trash cans within 24 hours, and how a single contactless NFC card pays for itself in one exhibition.",
      date: "August 2026",
      readTime: "4 min read",
      category: "Smart Hardware",
      featured: false,
      author: "Himansu Nayak",
    },
    {
      slug: "festival-advertising-calendar-odisha",
      title: "Festival Marketing in Odisha: Maximizing ROI During Raja, Ratha Yatra & Durga Puja",
      odiaTitle: "ଓଡ଼ିଶାର ପର୍ବ ପର୍ବାଣି ରେ ବ୍ୟବସାୟିକ ବିଜ୍ଞାପନ",
      excerpt:
        "Strategic timing for local jewelers, apparel outlets, and restaurants to align their monthly booklet bookings with high-spending Odia festive seasons.",
      date: "July 2026",
      readTime: "6 min read",
      category: "Strategy & Insights",
      featured: false,
      author: "Ashutosh Mahalik",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-950/40 text-xs font-semibold text-orange-400 mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Local Stories &amp; Growth Insights</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          PRACHAR Community Journal
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Actionable marketing guides, printing logistics insights, and merchant growth stories from the ground in Bhubaneswar.
        </p>
      </div>

      {/* Featured Article */}
      {articles.filter((a) => a.featured).map((article) => (
        <div
          key={article.slug}
          className="p-8 sm:p-12 rounded-3xl border border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/30 mb-16 shadow-2xl relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Featured Analysis</span>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-orange-400 font-serif mb-4">{article.odiaTitle}</p>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-8">
              <span>By {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            </div>

            <Link
              href="/advertise"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition shadow-lg shadow-orange-600/25"
            >
              <span>Explore Ad Packages (P1–P5)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}

      {/* All Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {articles.filter((a) => !a.featured).map((article) => (
          <div
            key={article.slug}
            className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 glass-panel-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-[11px] font-semibold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800/40">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 leading-snug">{article.title}</h3>
              <p className="text-xs text-orange-400 font-serif mb-3">{article.odiaTitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">{article.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{article.date} • {article.author}</span>
              <Link
                href="/advertise"
                className="font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
              >
                <span>Book Placement</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Editorial Contribution Box */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950/80 text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-white mb-2">Have a Bhubaneswar Merchant Story to Share?</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          If your local retail business or diagnostic center has achieved unique community milestones, our editorial desk would love to feature your journey in our next monthly edition.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
        >
          <span>Submit Story to Editorial Desk</span>
          <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
        </Link>
      </div>
    </div>
  );
}
