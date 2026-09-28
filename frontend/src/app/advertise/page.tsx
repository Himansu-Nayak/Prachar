export default function AdvertisePage() {
  const packages = [
    { code: "P1", name: "B&W Mini-Quarter", single: "₹550", scheme3: "₹1,500", savings: "Save ₹150" },
    { code: "P2", name: "B&W Quarter", single: "₹1,030", scheme3: "₹3,000", savings: "Save ₹90" },
    { code: "P3", name: "B&W Half Page", single: "₹2,050", scheme3: "₹6,000", savings: "Save ₹150" },
    { code: "P4", name: "B&W Full Page", single: "₹4,100", scheme3: "₹12,000", savings: "Save ₹300" },
    { code: "P5", name: "Colour Full Page", single: "₹6,000", scheme3: "₹15,000", savings: "Save ₹3,000" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Rate Card &amp; Packages</span>
          <h1 className="text-3xl font-bold text-white mt-1">Book Your Advertisement</h1>
        </div>
        <div className="bg-orange-950/80 border border-orange-800/80 px-4 py-2 rounded-lg text-xs text-orange-300">
          <span className="font-bold text-orange-200 block">Cutoff Date: 18th of Every Month</span>
          Next Edition: Bhubaneswar Circulation
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 mb-8">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Format / Size</th>
              <th className="px-6 py-4">1st Edition</th>
              <th className="px-6 py-4">3-Edition Scheme</th>
              <th className="px-6 py-4">Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {packages.map((pkg) => (
              <tr key={pkg.code} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 font-bold text-orange-400">{pkg.code}</td>
                <td className="px-6 py-4 font-medium text-slate-100">{pkg.name}</td>
                <td className="px-6 py-4">{pkg.single}</td>
                <td className="px-6 py-4 font-semibold text-white">{pkg.scheme3}</td>
                <td className="px-6 py-4 text-xs font-medium text-emerald-400">{pkg.savings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1">
        <p>• All advertisements, logos, photos, and materials are submitted by Advertisers on their free will.</p>
        <p>• Display charges payable via digital modes (PhonePe, UPI, Razorpay) and cash.</p>
        <p>• Acceptance of matter is reserved with PRACHAR editorial management. Any dispute subject to Odisha Jurisdiction only.</p>
      </div>
    </div>
  );
}
