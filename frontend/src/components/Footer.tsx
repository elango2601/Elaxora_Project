import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0f111a] pt-12 pb-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between">
          
          {/* Left Side: Links Group */}
          <div className="w-full lg:w-[55%] grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Services Col */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase mb-4 tracking-wider">Services</h3>
              <ul className="space-y-2.5 text-xs text-white font-medium">
                <li><span className="hover:underline cursor-pointer">Project Development</span></li>
                <li><span className="hover:underline cursor-pointer">Scope Customization</span></li>
                <li><span className="hover:underline cursor-pointer">Local Environment Setup</span></li>
                <li><span className="hover:underline cursor-pointer">Technical Explanations</span></li>
                <li><span className="hover:underline cursor-pointer">Viva Mentoring</span></li>
              </ul>
            </div>

            {/* Resources Col */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase mb-4 tracking-wider">Resources</h3>
              <ul className="space-y-2.5 text-xs text-white font-medium">
                <li>
                  <Link href="/projects" className="hover:underline">
                    Explore Projects
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:underline">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:underline">
                    Pricing Models
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    FAQ Database
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Col */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase mb-4 tracking-wider">Legal</h3>
              <ul className="space-y-2.5 text-xs text-white font-medium">
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Vertical Divider (Desktop only) */}
          <div className="hidden lg:block w-px bg-white/10 mx-8"></div>
          
          {/* Horizontal Divider (Mobile only) */}
          <div className="block lg:hidden w-full h-px bg-white/10 my-8"></div>

          {/* Right Side: Info Group */}
          <div className="w-full lg:w-[45%] grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* About Us */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase mb-4 tracking-wider">About Us:</h3>
              <div className="text-xs text-white font-medium leading-relaxed space-y-2">
                <p>Build. Customize. Understand. Present.</p>
                <p className="text-slate-300">
                  Affordable final-year academic project development, mentoring, setup support, and viva preparation.
                </p>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase mb-4 tracking-wider">Reach Us:</h3>
              <div className="text-xs text-white font-medium leading-relaxed space-y-2">
                <p>
                  Email 1:{' '}
                  <a href="mailto:elaxora11@gmail.com" className="hover:underline text-indigo-300">
                    elaxora11@gmail.com
                  </a>
                </p>
                <p>
                  Email 2:{' '}
                  <a href="mailto:elango2601@gmail.com" className="hover:underline text-indigo-300">
                    elango2601@gmail.com
                  </a>
                </p>
                <div className="pt-2">
                  <a href="https://wa.me/916374578233" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp Support
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Logos */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-1">
              <span className="text-xl font-bold tracking-tight text-white">
                Elaxora<span className="text-indigo-500">Solutions</span>
              </span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-xs text-slate-400">
            <p>
              Important Note: We provide learning support to prepare you for presentation.
            </p>
            <p className="flex items-center gap-1 font-medium">
              © {new Date().getFullYear()} Elaxora Solutions. Designed by Elango K.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
