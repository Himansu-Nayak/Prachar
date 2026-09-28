export default function DemoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Interactive Simulator</span>
      <h1 className="text-3xl font-bold text-white mt-1 mb-4">Experience PRACHAR Digital Card</h1>
      <p className="text-slate-300 leading-relaxed mb-8">
        See how your customers in Bhubaneswar will interact with your business when they scan your physical QR code.
      </p>
      <div className="max-w-xs mx-auto p-6 rounded-3xl border-2 border-slate-700 bg-slate-900 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-orange-600/20 border border-orange-500/40 mx-auto mb-3 flex items-center justify-center text-xl font-bold text-orange-400">
          PS
        </div>
        <h2 className="text-lg font-bold text-white">Puri Sweets &amp; Caterers</h2>
        <p className="text-xs text-orange-400 mb-4">Authentic Odia Sweets • BJB Nagar</p>
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <button className="py-2 px-3 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-medium">
            WhatsApp
          </button>
          <button className="py-2 px-3 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 font-medium">
            Call Now
          </button>
        </div>
        <p className="text-[11px] text-slate-500">Live Interactive Sandbox (Phase 1 Foundation)</p>
      </div>
    </div>
  );
}
