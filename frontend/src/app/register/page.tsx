import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Claim Handle</span>
        <h1 className="text-2xl font-bold text-white mt-1 mb-2">Create Your Digital Card</h1>
        <p className="text-xs text-slate-400 mb-6">Choose a unique vanity URL for your Bhubaneswar business.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Desired Username Slug</label>
            <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 px-3 text-sm text-slate-400">
              <span>prachar.in/u/</span>
              <input 
                type="text" 
                placeholder="your-business" 
                disabled
                className="w-full py-2 bg-transparent text-white outline-none pl-1 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
          <button 
            type="button" 
            disabled
            className="w-full py-2.5 rounded-lg bg-orange-600/50 text-white font-medium text-sm cursor-not-allowed"
          >
            Check Availability (Phase 1 Foundation Shell)
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Already registered? <Link href="/login" className="text-orange-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
