import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image 
                src="/elaxora-logo.jpg" 
                alt="Elaxora Solutions Logo" 
                width={150} 
                height={40} 
                className="h-8 w-auto rounded object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-slate-400 mb-2">
              Build. Customize. Understand. Present.
            </p>
            <p className="text-xs text-slate-500">
              Affordable final-year academic project development, mentoring, setup support, and viva preparation.
            </p>
          </div>

          {/* Services Col */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Project Development</li>
              <li>Scope Customization</li>
              <li>Local Environment Setup</li>
              <li>Technical Explanations</li>
              <li>Viva & Presentation Mentoring</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
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

          {/* Legal / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Legal</h3>
            <ul className="space-y-3 text-sm mb-4">
              <li>
                <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-2">
                  <span>📱 WhatsApp: 6374578233</span>
                </a>
              </li>
              <li>
                <a href="mailto:elaxora11@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-2">
                  <span>✉️ elaxora11@gmail.com</span>
                </a>
              </li>
              <li className="pt-2">
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Support</h3>
            <p className="text-sm text-slate-400">
              Email: elaxora11@gmail.com
            </p>
          </div>
        </div>

        {/* Copy block */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Elaxora Solutions. All rights reserved. <br className="md:hidden" /> <span className="hidden md:inline">|</span> Designed by Elango K</p>
          <p className="text-slate-600 max-w-2xl text-right">
            Important Note: We encourage conceptual understanding. We provide learning support to prepare you for presentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
