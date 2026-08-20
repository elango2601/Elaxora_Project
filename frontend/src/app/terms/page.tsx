export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms & Conditions</h1>
      
      <div className="glass-card p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Scope of Service</h2>
          <p>
            Elaxora Solutions provides customized software implementation support, baseline code templates, database initialization scripts, and technical mentoring walks. Our services are tailored to support students in completing and understanding their academic final-year requirements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Scope Lock Policy</h2>
          <p>
            Upon acceptance of a quotation and payment of the required advance milestone percentage (50% or 40%), the project features, deliverables, database fields, and technologies list is set to <strong>LOCKED</strong>. Any additional feature requested by the student or their supervisor guide after this lock is subject to a separate <strong>Change Request</strong> quotation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Payments & Milestones</h2>
          <p>
            For projects below ₹5,000, development starts only after a 50% advance payment is recorded. For projects above ₹5,000, a 40% advance payment starts development. Complete codebase and database scripts are released only after the final remaining balance is recorded as paid.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Revisions vs. Changes</h2>
          <p>
            Revisions are limited modifications (such as text adjustments, color modifications, or minor query logic updates) that reside inside the locked scope limits. Change Requests represent new tables, forms, pages, or analytical libraries that were not listed in the locked scope deliverables list.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">5. Academic Integrity Disclaimer</h2>
          <p>
            We supply codebase deliverables as an implementation benchmark and study resource. Students are solely responsible for writing their thesis reports, obtaining guide approvals, and verifying they understand the system code modules before attending vivas and project reviews.
          </p>
        </section>
      </div>
    </div>
  );
}
