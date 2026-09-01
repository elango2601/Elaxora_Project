import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold tracking-tight text-white">
                Elaxora<span className="text-brand-primary text-indigo-500">Solutions</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-2 pr-4">
              Build. Customize. Understand. Present.
            </p>
            <p className="text-xs text-slate-500 pr-4">
              Affordable final-year academic project development, mentoring, setup support, and viva preparation.
            </p>
          </div>

          {/* Services Col */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Project Development</li>
              <li>Scope Customization</li>
              <li>Local Environment Setup</li>
              <li>Technical Explanations</li>
              <li>Viva Mentoring</li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-white transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  Pricing Models
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ Database
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal Col */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2">
                <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-2">
                  <span>📱 WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:elaxora11@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium break-all">
                  ✉️ elaxora11@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:elango2601@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium break-all">
                  ✉️ elango2601@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copy block */}
        <div className="border-t border-white/5 pt-8 flex flex-col lg:flex-row justify-between items-center text-xs text-slate-500 gap-6 text-center lg:text-left">
          <p className="order-2 lg:order-1">
            © {new Date().getFullYear()} Elaxora Solutions. All rights reserved. 
            <br className="lg:hidden mt-1" /> 
            <span className="hidden lg:inline mx-2">|</span> 
            Designed by Elango K
          </p>
          <p className="text-slate-600 max-w-2xl lg:text-right text-center order-1 lg:order-2 px-4 lg:px-0">
            Important Note: We encourage conceptual understanding. We provide learning support to prepare you for presentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
