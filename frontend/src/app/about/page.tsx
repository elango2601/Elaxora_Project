import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">About Elaxora Solutions</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          We bridge the gap between academic guidelines and modern engineering architectures.
        </p>
      </div>

      {/* Main Copy */}
      <div className="glass-card p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-white">Our Mission</h2>
        <p>
          Elaxora Solutions was founded by a freelance team of full-stack developers and data scientists who noticed college students struggling with final-year academic projects. Standard marketplaces sell outdated, broken, or plagiarized code with zero documentation or deployment support. As a result, students fail their viva defenses and do not learn the basic code parameters.
        </p>
        <p>
          We decided to position our services around <strong>guided development</strong>, <strong>customization</strong>, and <strong>technical mentoring</strong>. We provide state-of-the-art templates using modern frameworks like Next.js and FastAPI, customize them to your guide's inputs, and ensure they run flawlessly on your computer.
        </p>

        <h2 className="text-xl font-bold text-white mt-8">What We Stand For</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 mt-4">
          <div className="bg-slate-900/60 border border-card-border rounded-xl p-4">
            <span className="text-xl block mb-2">🧑‍🎓</span>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Technical Understanding</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">We walk you through system modules so you can confidently defend your code.</p>
          </div>
          <div className="bg-slate-900/60 border border-card-border rounded-xl p-4">
            <span className="text-xl block mb-2">🛡️</span>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Scope Protection</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">Once quotation advance is paid, the scope is locked. No hidden fees.</p>
          </div>
          <div className="bg-slate-900/60 border border-card-border rounded-xl p-4 col-span-2 md:col-span-1">
            <span className="text-xl block mb-2">📅</span>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1">Reliability</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">If we agree to a deadline, we deliver. Your college timeline is safe.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mt-8">Our Freelance Network</h2>
        <p>
          We operate as a focused freelance support model. We manage database schemas, API routers, and visual components in-house. This keeps pricing highly student-friendly while maintaining professional, commercial-grade standards.
        </p>
      </div>

      {/* Footer CTA */}
      <div className="text-center pt-6">
        <Link
          href="/enquire"
          className="gradient-btn inline-block px-6 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg"
        >
          Work With Us
        </Link>
      </div>
    </div>
  );
}
