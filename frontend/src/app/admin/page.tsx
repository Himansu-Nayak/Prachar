export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Internal Operations</span>
      <h1 className="text-2xl font-bold text-white mt-1 mb-6">PRACHAR Editorial &amp; Management Console</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400">Next Cutoff</p>
          <p className="text-lg font-bold text-orange-400 mt-1">18th of Month</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400">Target Press</p>
          <p className="text-lg font-bold text-slate-100 mt-1">Chandan Printers</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400">Active City</p>
          <p className="text-lg font-bold text-slate-100 mt-1">Bhubaneswar</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400">Distribution</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">Free (&quot;ମାଗଣା&quot;)</p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/30 text-center text-slate-400 text-sm">
        <p>Phase 1 Foundation Shell: The ad review approval queue and print batch export will activate in Phase 2.</p>
      </div>
    </div>
  );
}
