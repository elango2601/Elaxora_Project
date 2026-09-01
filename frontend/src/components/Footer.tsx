import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-white">
      
      {/* Top Band - Logo & Description */}
      <div className="bg-slate-800/50 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-8 lg:py-12 flex flex-col lg:flex-row items-center lg:items-start gap-8">
          
          {/* Logo Area */}
          <div className="w-full lg:w-[25%] flex justify-center lg:justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold tracking-tight text-white">
                Elaxora<span className="text-indigo-400">Solutions</span>
              </span>
            </Link>
          </div>
          
          {/* Text Description Area */}
          <div className="w-full lg:w-[75%] text-sm text-slate-300 leading-relaxed text-center lg:text-left">
            <p className="mb-2">
              Elaxora Solutions is an academic platform empowering engineering and computer applications students with innovative technology for project development. We help students efficiently build, customize, and understand their final-year projects.
            </p>
            <p>
              Our mission is to democratize technical learning by providing affordable local environment setup, technical explanations, and viva mentoring to foster confidence and presentation skills.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Band - Links Columns */}
      <div className="bg-[#0f111a] border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Column 1: Services */}
            <div>
              <h3 className="text-white font-bold text-[15px] mb-6 tracking-wide">Services</h3>
              <ul className="space-y-3.5 text-[14px] text-slate-400 font-medium">
                <li><span className="hover:text-white cursor-pointer transition-colors">Project Development</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Scope Customization</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Local Environment Setup</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Technical Explanations</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Viva Mentoring</span></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h3 className="text-white font-bold text-[15px] mb-6 tracking-wide">Resources</h3>
              <ul className="space-y-3.5 text-[14px] text-slate-400 font-medium">
                <li><Link href="/projects" className="hover:text-white transition-colors">Explore Projects</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Models</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ Database</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h3 className="text-white font-bold text-[15px] mb-6 tracking-wide">Legal</h3>
              <ul className="space-y-3.5 text-[14px] text-slate-400 font-medium">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Column 4: Support & Community */}
            <div>
              <h3 className="text-white font-bold text-[15px] mb-6 tracking-wide">Support</h3>
              <ul className="space-y-3.5 text-[14px] text-slate-400 font-medium mb-8">
                <li><a href="mailto:elaxora11@gmail.com" className="hover:text-white transition-colors">elaxora11@gmail.com</a></li>
                <li><a href="mailto:elango2601@gmail.com" className="hover:text-white transition-colors">elango2601@gmail.com</a></li>
              </ul>

              <h3 className="text-white font-bold text-[15px] mb-4 tracking-wide">Join Our Community</h3>
              <div>
                <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#0a0b10] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-center items-center gap-1.5 text-[13px] text-slate-500">
          <p>© {new Date().getFullYear()} Elaxora Solutions. All Rights Reserved.</p>
          <div className="hidden md:block px-1">|</div>
          <p>
            <Link href="/terms" className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-2">Terms of Use</Link> 
            {" "}and{" "}
            <Link href="/privacy" className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-2">Privacy Policy</Link>
          </p>
          <div className="hidden md:block px-1">|</div>
          <p>Designed by Elango K</p>
        </div>
      </div>

    </footer>
  );
}
