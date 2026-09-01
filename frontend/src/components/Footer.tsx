import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b0c10] text-white mt-16 md:mt-24 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-12">
        
        {/* Main 4-Column Grid (Microsoft Store Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: Brand & About */}
          <div>
            <h3 className="text-[15px] font-semibold mb-6 text-white tracking-tight">About Elaxora</h3>
            <Link href="/" className="inline-block mb-5">
              <span className="text-xl font-bold tracking-tight text-white flex items-center hover:opacity-90 transition-opacity">
                Elaxora<span className="text-indigo-400">Solutions</span>
              </span>
            </Link>
            <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
              An academic platform empowering students with innovative technology for project development, mentoring, and viva preparation.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-[15px] font-semibold mb-6 text-white tracking-tight">Services</h3>
            <ul className="space-y-4 text-[13px] text-slate-400 font-medium">
              <li><span className="hover:text-white hover:underline cursor-pointer transition-all">Project Development</span></li>
              <li><span className="hover:text-white hover:underline cursor-pointer transition-all">Scope Customization</span></li>
              <li><span className="hover:text-white hover:underline cursor-pointer transition-all">Local Environment Setup</span></li>
              <li><span className="hover:text-white hover:underline cursor-pointer transition-all">Technical Explanations</span></li>
              <li><span className="hover:text-white hover:underline cursor-pointer transition-all">Viva Mentoring</span></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-[15px] font-semibold mb-6 text-white tracking-tight">Resources</h3>
            <ul className="space-y-4 text-[13px] text-slate-400 font-medium">
              <li><Link href="/projects" className="hover:text-white hover:underline transition-all block">Explore Projects</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white hover:underline transition-all block">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white hover:underline transition-all block">Pricing Models</Link></li>
              <li><Link href="/faq" className="hover:text-white hover:underline transition-all block">FAQ Database</Link></li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div>
            <h3 className="text-[15px] font-semibold mb-6 text-white tracking-tight">Support</h3>
            <ul className="space-y-4 text-[13px] text-slate-400 font-medium">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:elaxora11@gmail.com" className="hover:text-white hover:underline transition-all break-all">elaxora11@gmail.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:elango2601@gmail.com" className="hover:text-white hover:underline transition-all break-all">elango2601@gmail.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 hover:underline transition-all">+91 6374578233</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Horizontal Bar */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-[12px] text-slate-400 font-medium">
          
          {/* Left Side: Language / Region (Like Microsoft Store) */}
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors w-full md:w-auto justify-center md:justify-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>English (India)</span>
          </div>

          {/* Right Side: Horizontal Links */}
          <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
            <li><Link href="/" className="hover:text-white hover:underline transition-all">Home</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white hover:underline transition-all">About Us</Link></li>
            <li><Link href="/privacy" className="hover:text-white hover:underline transition-all">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white hover:underline transition-all">Terms of Use</Link></li>
            <li><Link href="/pricing" className="hover:text-white hover:underline transition-all">Pricing</Link></li>
            <li><Link href="/projects" className="hover:text-white hover:underline transition-all">Projects</Link></li>
            <li className="text-slate-500">© {new Date().getFullYear()} Elaxora Solutions</li>
          </ul>

        </div>
      </div>
    </footer>
  );
}
