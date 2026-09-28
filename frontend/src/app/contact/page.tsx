export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Get in Touch</span>
      <h1 className="text-3xl font-bold text-white mt-1 mb-6">Contact PRACHAR Editorial Office</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <h2 className="font-semibold text-slate-100 text-base">Direct Booking Lines</h2>
          <p>Phone: <a href="tel:7077011733" className="text-orange-400 hover:underline">7077011733</a> / <a href="tel:9178898844" className="text-orange-400 hover:underline">9178898844</a></p>
          <p>Email: <a href="mailto:PRACHARBBSR1@GMAIL.COM" className="text-orange-400 hover:underline">PRACHARBBSR1@GMAIL.COM</a></p>
          <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            For display advertisement submissions, rates, and distribution inquiries.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <h2 className="font-semibold text-slate-100 text-base">Office Location</h2>
          <p>Plot No. - ……………….., BJB Nagar, Bhubaneswar, Odisha</p>
          <p className="text-xs text-slate-400">Jurisdiction: Odisha Jurisdiction only</p>
        </div>
      </div>
    </div>
  );
}
