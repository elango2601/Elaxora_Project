import Link from "next/link";

export default function PricingPage() {
  const tiers = [
    {
      name: "Basic Bracket",
      price: "₹1,000 – ₹2,000",
      desc: "Ideal for basic database structures and lightweight HTML/CSS/JS frontend projects.",
      features: [
        "Core Project Source Code",
        "SQL/NoSQL Database Schemas",
        "Local setup instruction manual",
        "2 Revision Rounds included",
        "Email code-support"
      ],
      color: "border-white/5 bg-slate-950/40"
    },
    {
      name: "Intermediate Bracket",
      price: "₹2,500 – ₹4,000",
      desc: "Perfect for full-stack MVC layouts, data analytics, dashboards, and standard ML regressions.",
      features: [
        "Interactive Admin Dashboard UI",
        "API Integration scripts",
        "guided Local Setup (Screen-share)",
        "Technical logic walkthrough guide",
        "2 Revision Rounds included",
        "WhatsApp chat support"
      ],
      color: "border-indigo-500/30 bg-indigo-950/10 relative shadow-indigo-500/5"
    },
    {
      name: "Advanced Bracket",
      price: "₹5,000 – ₹10,000+",
      desc: "Built for complex architectures, deep learning models, computer vision, NLP, and hardware IoT.",
      features: [
        "State-of-the-Art models (SpaCy, ResNet)",
        "Dynamic real-time dashboard layout",
        "Full Setup (Local database + servers)",
        "1-hour 1-on-1 code walkthrough session",
        "3 Revision Rounds included",
        "Direct developer call support"
      ],
      color: "border-white/5 bg-slate-950/40"
    }
  ];

  const addons = [
    { name: "VPS Cloud deployment", desc: "Live deployment on AWS/Vercel/Railway.", price: "₹999" },
    { name: "Detailed System Report (.docx)", desc: "Chapters on SRS, UML Diagrams, testing reports.", price: "₹1,499" },
    { name: "Presentation PPT", desc: "Complete slide deck with flow diagrams.", price: "₹799" },
    { name: "Recorded Video Demo", desc: "Step-by-step recording explaining UI options.", price: "₹499" },
    { name: "Additional Feature", desc: "New pages, custom algorithms, API hooks.", price: "₹999+" },
    { name: "Extended Viva Mentoring", desc: "Mock questions and defense preparation guides.", price: "₹499" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">

      {/* Header */}
      <div className="text-left sm:text-center max-w-2xl sm:mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Transparent Project Pricing</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          We charge based on system complexity and customization depth. No hidden fee markups.
        </p>
      </div>

      {/* Pricing Cards - 2 Columns on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-8 pt-4">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 sm:p-6 flex flex-col justify-between ${tier.color} glass-card ${
              idx === 2 ? "col-span-2 md:col-span-1" : "col-span-1"
            }`}
          >
            {tier.name === "Intermediate Bracket" && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                Most Requested
              </span>
            )}
            <div>
              <h3 className="text-xs sm:text-lg font-bold text-white mb-1.5">{tier.name}</h3>
              <p className="text-[10px] sm:text-xs text-slate-400 mb-4 leading-normal sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{tier.desc}</p>
              <div className="mb-4">
                <span className="text-xs sm:text-2xl font-black text-indigo-500 sm:text-white block sm:inline">{tier.price}</span>
              </div>
              <ul className="space-y-2.5 mb-6 border-t border-card-border pt-4">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start text-[10px] sm:text-xs text-slate-300 gap-1.5">
                    <span className="text-indigo-400">✓</span>
                    <span className="line-clamp-2 sm:line-clamp-none">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={`/enquire`}
              className={`text-center block w-full py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                tier.name === "Intermediate Bracket"
                  ? "gradient-btn text-white"
                  : "bg-slate-900 border border-card-border hover:bg-slate-800 text-slate-200"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* Add-ons Grid - 2 Columns on Mobile */}
      <div className="border-t border-card-border pt-12">
        <div className="text-left sm:text-center mb-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Optional Service Add-ons</h2>
          <p className="text-slate-400 text-xs mt-1">Enhance your submission with supportive visual and report deliverables.</p>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
          {addons.map((add, idx) => (
            <div key={idx} className="glass-card p-4 sm:p-5 flex flex-col justify-between gap-3 h-full">
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{add.name}</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-2 leading-tight">{add.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest hidden sm:inline">Rate</span>
                <span className="text-xs sm:text-sm font-bold text-indigo-400 shrink-0">{add.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Positioning Alert */}
      <div className="glass-card p-5 border-l-2 border-l-amber-500 bg-amber-500/5 max-w-4xl mx-auto">
        <h4 className="text-xs sm:text-sm font-bold text-white mb-2">🧑‍🎓 Academic Integrity & Positioning</h4>
        <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
          Elaxora Solutions operates as an educational mentoring and implementation support platform. We do NOT guarantee project approvals or specific examination grades, nor do we provide copy-paste materials without guidance. We supply structural walkthroughs, guided database configs, and system explanations to prepare students to present their project independently.
        </p>
      </div>
    </div>
  );
}
