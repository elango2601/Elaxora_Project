"use client";

import Link from "next/link";
import Image from "next/image";
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
              <Link href="/" className="flex items-center">
                <Image 
                  src="/elaxora-logo.jpg" 
                  alt="Elaxora Solutions Logo" 
                  width={200} 
                  height={50} 
                  className="h-10 w-auto rounded object-contain"
                  priority
                />
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

            {/* Action controls (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
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
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image 
                src="/elaxora-logo.jpg" 
                alt="Elaxora Solutions Logo" 
                width={150} 
                height={40} 
                className="h-8 w-auto rounded object-contain"
              />
            </Link>
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
