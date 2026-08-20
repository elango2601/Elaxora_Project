export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
      
      <div className="glass-card p-6 sm:p-10 space-y-6 text-sm text-slate-300 leading-relaxed">
        <p className="text-slate-400">
          Last Updated: August 2026
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            We collect the student profile details you submit in our enquiry forms, including your full name, email, WhatsApp number, college name, department details, target budget parameters, and custom project scopes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. How We Use Information</h2>
          <p>
            Your information is strictly used to communicate customized project quotations, update your progress milestone status, and coordinate local installation setups. We do not sell, rent, or distribute student profiles to any third-party marketing brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Security Controls</h2>
          <p>
            We store enquiries, quote records, order progress indicators, and payment milestones securely in our database. Credentials for the admin panel are protected with bcrypt password hashing and validated via JWT auth tokens.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Project Confidentiality</h2>
          <p>
            We treat your customized code features and requirements with strict confidentiality. We do not share source code repositories of customized orders publicly without explicit permissions from the student.
          </p>
        </section>
      </div>
    </div>
  );
}
