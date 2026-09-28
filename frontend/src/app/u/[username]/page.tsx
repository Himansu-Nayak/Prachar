import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = params;

  if (!username || username.trim() === "") {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl p-6 text-center">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-950 shadow-lg">
          {username.slice(0, 2).toUpperCase()}
        </div>

        {/* Identity */}
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-950 border border-orange-800 text-orange-400 uppercase tracking-wider">
          Verified Phygital Partner
        </span>
        <h1 className="text-xl font-bold text-white mt-2 capitalize">{username.replace(/-/g, " ")}</h1>
        <p className="text-xs text-slate-400 mt-1">Bhubaneswar, Odisha</p>

        {/* Action Quick Grid */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <button 
            type="button"
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
          >
            WhatsApp
          </button>
          <button 
            type="button"
            className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition"
          >
            Call Now
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500">
          <p>Powered by <strong className="text-slate-400">PRACHAR Phygital Identity</strong></p>
          <p className="text-[11px] text-slate-600 mt-0.5">Permanent URL: /u/{username}</p>
        </div>
      </div>
    </div>
  );
}
