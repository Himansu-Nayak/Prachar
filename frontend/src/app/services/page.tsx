export default function ServicesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Publicity Services</span>
      <h1 className="text-3xl font-bold text-white mt-1 mb-4">Monthly Print &amp; Digital Solutions</h1>
      <p className="text-slate-300 leading-relaxed max-w-2xl mb-8">
        Serving local commercial and community needs across Bhubaneswar.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <h2 className="text-base font-bold text-slate-100 mb-1">Business &amp; Service Advertisements</h2>
          <p className="text-xs text-orange-400 mb-2">ବ୍ୟବସାୟ ଓ ସେବା ର ବିଜ୍ଞାପନ</p>
          <p className="text-sm text-slate-400">Targeted monthly placements across Bhubaneswar commercial hubs and residences.</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <h2 className="text-base font-bold text-slate-100 mb-1">Business Offers &amp; Announcements</h2>
          <p className="text-xs text-orange-400 mb-2">ବ୍ୟବସାୟ ର ନୁଆଁ ଅଫର ଓ ଖବର</p>
          <p className="text-sm text-slate-400">Seasonal sales, new branch openings, discounts, and product introductions.</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <h2 className="text-base font-bold text-slate-100 mb-1">Festival Greetings</h2>
          <p className="text-xs text-orange-400 mb-2">ପର୍ବ ପର୍ବାଣି ର ଶୁଭେଚ୍ଛା</p>
          <p className="text-sm text-slate-400">Warm community wishes for Raja, Ratha Yatra, Durga Puja, and Diwali.</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <h2 className="text-base font-bold text-slate-100 mb-1">Personal Milestones</h2>
          <p className="text-xs text-orange-400 mb-2">ଜନ୍ମଦିନ / ବିବାହ ବାର୍ଷିକୀ ର ଶୁଭେଚ୍ଛା</p>
          <p className="text-sm text-slate-400">Celebrate birthdays and wedding anniversaries with family and friends.</p>
        </div>
      </div>
    </div>
  );
}
