"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileBottomNav({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  const navItems = [
    { name: "Home", href: "/", icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: "Projects", href: "/projects", icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { name: "Quote", href: "/enquire", icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { name: "Menu", action: onMenuClick, icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  ];

  if (!mounted) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-background/80 backdrop-blur-xl border-t border-white/5 dark:border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const active = item.href ? isActive(item.href) : false;
          return item.href ? (
            <Link 
              key={item.name} 
              href={item.href} 
              className="relative flex flex-col items-center justify-center w-full h-full pt-1 tap-highlight-transparent"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl mx-2 my-1"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className={`z-10 flex flex-col items-center space-y-1 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {item.icon}
                <span className="text-[10px] font-semibold tracking-wide">{item.name}</span>
              </motion.div>
            </Link>
          ) : (
            <button 
              key={item.name}
              onClick={item.action} 
              className="relative flex flex-col items-center justify-center w-full h-full pt-1 tap-highlight-transparent"
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="z-10 flex flex-col items-center space-y-1 text-slate-500 dark:text-slate-400"
              >
                {item.icon}
                <span className="text-[10px] font-semibold tracking-wide">{item.name}</span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
