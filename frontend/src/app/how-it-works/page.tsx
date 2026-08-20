import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Select Baseline Template",
      desc: "Explore our catalogue of projects across AI, Full-Stack, IoT, and analytics. Select a project that best aligns with your primary syllabus."
    },
    {
      step: "02",
      title: "Submit Requirements",
      desc: "Use our enquire form to supply instructions from your guide. Let us know if you need database shifts or custom analytical graphs."
    },
    {
      step: "03",
      title: "Review Quotation",
      desc: "We analyze parameters and generate a transparent quotation detailing base costs and chosen service add-ons upfront."
    },
    {
      step: "04",
      title: "Scope Lock",
      desc: "Pay the required milestone advance (50% or 40%) to lock project scope, freeze parameters, and launch coding immediately."
    },
    {
      step: "05",
      title: "Review Demo Video",
      desc: "Once complete, review a recorded demo video. You get 2 to 3 revision rounds to verify all requirements match perfectly."
    },
    {
      step: "06",
      title: "Delivery & Setup",
      desc: "Clear final balances to retrieve the code. We connect via screen-share to install databases and launch servers locally."
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">

      {/* Header */}
      <div className="text-left sm:text-center max-w-2xl sm:mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Our Development Lifecycle</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          A structured, transparent workflow ensuring you receive high-fidelity code and fully understand the system.
        </p>
      </div>

      {/* Step List Grid (2-columns on mobile, Timeline list on desktop) */}
      <div className="grid grid-cols-2 md:block gap-3.5 md:space-y-12 relative md:before:absolute md:before:inset-0 md:before:left-1/2 md:before:w-[1px] md:before:bg-white/5">
        {steps.map((item, idx) => (
          <div key={idx} className={`flex flex-col md:flex-row items-start gap-8 relative ${
            idx % 2 === 1 ? "md:flex-row-reverse" : ""
          } col-span-1`}>
            {/* Timeline dot (hidden on mobile, visible on desktop) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-indigo-500/30 bg-slate-950 items-center justify-center font-bold text-xs text-indigo-400 z-10">
              {item.step}
            </div>

            {/* Content Card */}
            <div className="md:w-1/2 w-full h-full">
              <div className="glass-card p-4 sm:p-6 glass-card-hover md:mx-4 h-full flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-white/5 block md:hidden mb-1 select-none">
                    {item.step}
                  </span>
                  <h3 className="text-xs sm:text-lg font-bold text-white mb-2 leading-tight">{item.title}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-normal sm:leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
            
            {/* Spacer (hidden on mobile, visible on desktop) */}
            <div className="hidden md:block md:w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="text-left sm:text-center space-y-4 pt-8">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Ready to Start Your Project?</h2>
        <p className="text-slate-400 text-xs max-w-md sm:mx-auto">
          Submit your guides requirements today to lock in your slot. We limit active projects weekly to ensure high quality.
        </p>
        <Link
          href="/enquire"
          className="gradient-btn inline-block px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg"
        >
          Submit Requirements
        </Link>
      </div>
    </div>
  );
}
