"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Load and apply initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("pf-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = systemDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.className = initialTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("pf-theme", newTheme);
    document.documentElement.className = newTheme;
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo (Centered on mobile, Left on desktop) */}
            <div className="flex flex-1 md:flex-none items-center justify-center md:justify-start">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Elaxora<span className="text-indigo-600">Solutions</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      isActive(link.href) ? "text-indigo-500 font-bold" : "text-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Action controls & Theme Switch (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-colors focus:outline-none"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M17.78 6.22l1.58-1.58M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.83A9.75 9.75 0 1111.17 2.25 9.75 9.75 0 0021.75 12.83z" />
                  </svg>
                )}
              </button>


              <Link
                href="/student/login"
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
              >
                Student Portal
              </Link>
              <Link
                href="/enquire"
                className="gradient-btn px-4 py-2 text-sm font-semibold rounded-lg text-white"
              >
                Get a Quote
              </Link>
            </div>
            
            {/* Absolute Theme toggle for mobile to keep logo centered */}
            <div className="absolute right-4 md:hidden flex items-center">
              <button
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-lg text-muted hover:text-foreground focus:outline-none"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M17.78 6.22l1.58-1.58M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.83A9.75 9.75 0 1111.17 2.25 9.75 9.75 0 0021.75 12.83z" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Left-aligned Backdrop Overlay for Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Left-aligned Mobile Navigation Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-background border-r border-card-border p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Elaxora<span className="text-indigo-600">Solutions</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-muted hover:text-foreground"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col space-y-3">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-slate-100 dark:bg-slate-900 text-indigo-500"
                    : "text-muted hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-card-border pt-4 flex flex-col space-y-3">

          <Link
            href="/student/login"
            onClick={() => setIsOpen(false)}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2.5 rounded-lg text-center transition-colors border border-slate-700"
          >
            Student Portal
          </Link>
          <Link
            href="/enquire"
            onClick={() => setIsOpen(false)}
            className="gradient-btn text-center px-4 py-2.5 text-sm font-semibold rounded-lg text-white"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      <MobileBottomNav onMenuClick={() => setIsOpen(true)} />
    </>
  );
}
