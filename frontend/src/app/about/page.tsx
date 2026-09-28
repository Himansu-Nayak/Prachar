export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">About PRACHAR</span>
      <h1 className="text-3xl font-bold text-white mt-1 mb-6">Our Heritage & Editorial Mission</h1>
      <p className="text-slate-300 leading-relaxed mb-6">
        PRACHAR (Phygital Publicity) is a registered unit of <strong className="text-white">Saroswati Khabar</strong> (PRGI Registration: <code className="text-orange-300">ORORI/25/A3295</code>, Udyam: <code className="text-orange-300">UDYAM-OD-04-0039313</code>).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300 bg-slate-900/60 border border-slate-800 p-6 rounded-xl">
        <div>
          <h2 className="font-semibold text-slate-100">Editorial & Ownership</h2>
          <p className="mt-1">Chief Editor: Ashutosh Mahalik (7978943757)</p>
          <p>Publisher & Owner: Purusottam Sahu (9178898844)</p>
          <p className="text-xs text-slate-400 mt-1">BJB Nagar, Bhubaneswar, Odisha</p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-100">Printing & Publication</h2>
          <p className="mt-1">Printed at: Chandan Printers</p>
          <p>Gopabandhu Chhak, Unit-3, Bhubaneswar</p>
          <p className="text-xs text-slate-400 mt-1">Free Distribution (&quot;ମାଗଣା ବଣ୍ଟନ&quot;)</p>
        </div>
      </div>
    </div>
  );
}
