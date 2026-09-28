export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">User Portal</span>
      <h1 className="text-2xl font-bold text-white mt-1 mb-6">Merchant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400 uppercase font-semibold">QR Code Scans</p>
          <p className="text-2xl font-bold text-white mt-1">--</p>
          <p className="text-xs text-slate-500 mt-2">Dynamic 302 resolution telemetry</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400 uppercase font-semibold">Profile Views</p>
          <p className="text-2xl font-bold text-white mt-1">--</p>
          <p className="text-xs text-slate-500 mt-2">Verified public traffic</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-xs text-slate-400 uppercase font-semibold">Active Ad Placements</p>
          <p className="text-2xl font-bold text-white mt-1">--</p>
          <p className="text-xs text-slate-500 mt-2">Bhubaneswar Edition</p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/30 text-center text-slate-400 text-sm">
        <p>Phase 1 Foundation Shell: Full profile editor, QR asset download, and lead actions will activate in Phase 2.</p>
      </div>
    </div>
  );
}
