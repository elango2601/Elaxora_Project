import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f242d] text-white mt-16 md:mt-24 relative">
      {/* Premium Tech Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 opacity-80"></div>

      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          
          {/* Column 1: Find us */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[17px] font-medium mb-8 text-white tracking-wide">Find us</h3>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight text-white flex items-center hover:opacity-90 transition-opacity">
                Elaxora<span className="text-indigo-400">Solutions</span>
              </span>
            </Link>
            <p className="text-[14px] text-slate-400 mb-8 leading-relaxed pr-4 font-medium">
              Academic platform empowering students with innovative technology for final-year project development, mentoring, and viva preparation.
            </p>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:elaxora11@gmail.com" className="hover:text-white transition-colors break-all">elaxora11@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:elango2601@gmail.com" className="hover:text-white transition-colors break-all">elango2601@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">+91 6374578233 (WhatsApp)</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div className="col-span-1">
            <h3 className="text-[17px] font-medium mb-8 text-white tracking-wide">Services</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors block py-1 md:py-0">Project Development</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors block py-1 md:py-0">Scope Customization</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors block py-1 md:py-0">Local Environment Setup</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors block py-1 md:py-0">Technical Explanations</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer transition-colors block py-1 md:py-0">Viva Mentoring</span></li>
            </ul>
          </div>

          {/* Column 3: Quick links */}
          <div className="col-span-1">
            <h3 className="text-[17px] font-medium mb-8 text-white tracking-wide">Quick links</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><Link href="/projects" className="hover:text-white transition-colors block py-1 md:py-0">Explore Projects</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors block py-1 md:py-0">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors block py-1 md:py-0">Pricing Models</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors block py-1 md:py-0">FAQ Database</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors block py-1 md:py-0">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors block py-1 md:py-0">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Area */}
      <div className="border-t border-white/5 pt-8 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-[14px] text-slate-400 mb-6 font-medium">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
          </ul>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
            Copyright © {new Date().getFullYear()} | Designed by <span className="font-semibold text-slate-300">Elango K</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
