export default function ProductPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Product Platform</span>
      <h1 className="text-3xl font-bold text-white mt-1 mb-4">The Phygital Smart Identity</h1>
      <p className="text-slate-300 leading-relaxed max-w-2xl mb-8">
        PRACHAR connects physical business cards and storefront QR codes with permanent, responsive digital profiles.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <h2 className="text-lg font-bold text-slate-100 mb-2">Digital Profile</h2>
          <p className="text-sm text-slate-400">One-tap contact sharing, business services catalog, and direct WhatsApp links.</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <h2 className="text-lg font-bold text-slate-100 mb-2">Dynamic QR Engine</h2>
          <p className="text-sm text-slate-400">Permanent routing tokens ensure printed materials never expire even if profile details change.</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <h2 className="text-lg font-bold text-slate-100 mb-2">Physical Smart Card</h2>
          <p className="text-sm text-slate-400">NFC-enabled tactile business cards for instant in-person networking.</p>
        </div>
      </div>
    </div>
  );
}
