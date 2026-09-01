import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f111a] border-t border-white/10 text-white mt-16 md:mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
        
        {/* Main Grid: 4 columns of links + 2 columns for Brand (6 cols total on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-12">
          
          {/* Column 1: Services */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-[16px] mb-6">Services</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><span className="hover:text-white cursor-pointer transition-colors">Project Development</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Scope Customization</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Local Environment Setup</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Technical Explanations</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Viva Mentoring</span></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-[16px] mb-6">Resources</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><Link href="/projects" className="hover:text-white transition-colors">Explore Projects</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Models</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ Database</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-[16px] mb-6">Legal</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-[16px] mb-6">Support</h3>
            <ul className="space-y-4 text-[14px] text-slate-400 font-medium">
              <li><a href="mailto:elaxora11@gmail.com" className="hover:text-white transition-colors break-all">elaxora11@gmail.com</a></li>
              <li><a href="mailto:elango2601@gmail.com" className="hover:text-white transition-colors break-all">elango2601@gmail.com</a></li>
              <li className="pt-2">
                <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 & 6: Brand (Logo + Text) */}
          <div className="col-span-2 md:pl-10 flex flex-col items-start mt-8 md:mt-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-[28px] font-bold tracking-tight text-white">
                Elaxora<span className="text-indigo-500">Solutions</span>
              </span>
            </Link>
            <p className="mt-6 text-[14px] text-slate-400 leading-relaxed font-medium">
              Elaxora Solutions is an academic platform empowering engineering and computer applications students with innovative technology for project development. We help students efficiently build, customize, and understand their final-year projects.
            </p>
            <p className="mt-4 text-[14px] text-slate-400 leading-relaxed font-medium">
              By combining affordable local environment setup and technical explanations, we make it easy for anyone to build confidence and presentation skills.
            </p>
            <div className="mt-8 flex flex-col space-y-3 font-bold text-[14px]">
              <Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link>
              <a href="mailto:elaxora11@gmail.com" className="hover:text-indigo-400 transition-colors">Contact Us</a>
            </div>
          </div>

        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/5 bg-[#0a0b10]">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-center items-center gap-1.5 text-[13px] text-slate-500 font-medium">
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
