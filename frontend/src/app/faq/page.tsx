import Link from "next/link";

export default function FaqPage() {
  const faqGroups = [
    {
      title: "Mentoring & Viva Prep",
      items: [
        {
          q: "How will Elaxora Solutions prepare me for my project viva?",
          a: "Every project quotation includes custom documentation walk-throughs or mocks. In advanced packages, we provide a 1-hour 1-on-1 Zoom walkthrough where we show you where database calls occur, how models perform prediction inferences, and how the frontend state updates. We also send mock questions that examiners typically ask."
        },
        {
          q: "Do you supply the project report (documentation) and PPT slides?",
          a: "Yes. System documentation (SRS reports, UML flow diagrams, installation steps, and testing screenshots) and presentation slides are available as optional service add-ons. We customize them with your college details and name."
        }
      ]
    },
    {
      title: "Installation & Technical Support",
      items: [
        {
          q: "Will the project run on my specific computer?",
          a: "Yes. We guarantee that the final code will run locally on your system. We support Windows 10/11, macOS, and Linux. We connect via remote screen-share tools (AnyDesk, Zoom, TeamViewer) to verify database installs, install python virtual envs, and launch the server scripts."
        },
        {
          q: "What database systems do you use?",
          a: "For V1 projects, we utilize MongoDB, MySQL, and PostgreSQL depending on your requirements. By default, our baseline templates leverage MongoDB for high flexibility and easy visual checks."
        }
      ]
    },
    {
      title: "Payments & Revisions",
      items: [
        {
          q: "What is your refund policy?",
          a: "Because this is custom software development, payments are non-refundable once a development milestone has started. If we fail to deliver the locked requirements, we will refund the active phase. Full terms are outlined in the quotation before locking."
        },
        {
          q: "How many revisions do I get?",
          a: "We include 2 revision rounds in basic/intermediate quotes and 3 rounds in advanced ones. Revisions include text changes, layout adjustments, or minor logic edits within the locked scope parameters. Adding new pages or tables requires a separate Change Request quote."
        }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight font-sans">Frequently Asked Questions</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Everything you need to know about setup guidance, mentoring, code templates, and pricing rules.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-10 pt-6">
        {faqGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 border-b border-white/5 pb-2">
              {group.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3.5 sm:gap-4">
              {group.items.map((item, idx) => (
                <div key={idx} className="glass-card p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-2 leading-tight">{item.q}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 leading-normal sm:leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="glass-card p-6 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Still Have Questions?</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Shoot us a message on WhatsApp or email our support desk. We typically respond within an hour.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="https://wa.me/916374578233"
            target="_blank"
            rel="noreferrer"
            className="gradient-btn px-4 py-2 rounded-lg text-xs font-bold text-white"
          >
            Chat on WhatsApp
          </a>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold"
          >
            Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
}
