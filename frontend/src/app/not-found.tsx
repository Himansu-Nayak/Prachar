import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <span className="text-4xl font-extrabold text-orange-500 mb-2">404</span>
      <h2 className="text-xl font-bold text-slate-100 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 mb-6 max-w-sm">
        The requested PRACHAR resource or public digital profile does not exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
