import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Account Access</span>
        <h1 className="text-2xl font-bold text-white mt-1 mb-2">Sign in to PRACHAR</h1>
        <p className="text-xs text-slate-400 mb-6">Manage your digital profile, dynamic QR codes, and ad bookings.</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number (India)</label>
            <input 
              type="tel" 
              placeholder="+91 91788 98844" 
              disabled
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-300 opacity-60 cursor-not-allowed"
            />
          </div>
          <button 
            type="button" 
            disabled
            className="w-full py-2.5 rounded-lg bg-orange-600/50 text-white font-medium text-sm cursor-not-allowed"
          >
            Send OTP (Phase 1 Foundation Shell)
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Don&apos;t have an account? <Link href="/register" className="text-orange-400 hover:underline">Claim your profile</Link>
        </p>
      </div>
    </div>
  );
}
