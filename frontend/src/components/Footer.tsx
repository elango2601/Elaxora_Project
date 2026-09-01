import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1f242d] text-white mt-16 md:mt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Column 1: Find us */}
          <div>
            <h3 className="text-[17px] font-medium mb-8 text-white tracking-wide">Find us</h3>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight text-white flex items-center">
                Elaxora<span className="text-indigo-400">Solutions</span>
              </span>
            </Link>
            <p className="text-[14px] text-slate-400 mb-6 leading-relaxed pr-4 font-medium">
              Academic platform empowering students with innovative technology for final-year project development, mentoring, and viva preparation.
            </p>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li className="flex items-center gap-3">
                <span className="text-lg">✉️</span>
                <a href="mailto:elaxora11@gmail.com" className="hover:text-white transition-colors break-all">elaxora11@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">✉️</span>
                <a href="mailto:elango2601@gmail.com" className="hover:text-white transition-colors break-all">elango2601@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+91 6374578233 (WhatsApp)</a>
              </li>
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-[17px] font-medium mb-8 text-white tracking-wide">Services</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><span className="hover:text-white cursor-pointer transition-colors">Project Development</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Scope Customization</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Local Environment Setup</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Technical Explanations</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Viva Mentoring</span></li>
            </ul>
          </div>

          {/* Column 3: Quick links */}
          <div>
            <h3 className="text-[17px] font-medium mb-8 text-white tracking-wide">Quick links</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><Link href="/projects" className="hover:text-white transition-colors">Explore Projects</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Models</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ Database</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Area */}
      <div className="border-t border-white/5 pt-8 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[14px] text-slate-400 mb-6 font-medium">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
          </ul>
          <p className="text-[13px] text-slate-500 font-medium">
            Copyright © {new Date().getFullYear()} | Designed by <span className="font-semibold text-slate-300">Elango K</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
