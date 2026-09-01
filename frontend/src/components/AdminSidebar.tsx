"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("admin@elaxorasolutions.com");

  // Read admin email from cookie payload on mount
  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
      return match ? match[2] : null;
    };
    const token = getCookie("admin_token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        if (payload && payload.email) {
          setAdminEmail(payload.email);
        }
      } catch (e) {
        // Fallback to default
      }
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Projects", href: "/admin/projects", icon: "📂" },
    { name: "Enquiries", href: "/admin/enquiries", icon: "📬" },
    { name: "Quotes", href: "/admin/quotes", icon: "📋" },
    { name: "Orders", href: "/admin/orders", icon: "💼" },
    { name: "Payments", href: "/admin/payments", icon: "💳" },
    { name: "Referrals", href: "/admin/referrals", icon: "🎟️" },
    { name: "Customers", href: "/admin/customers", icon: "👥" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  const handleLogout = async () => {
    // Clear local cookie
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    // Sign out from Firebase
    try {
      const { auth } = await import("@/lib/firebase");
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch (err) {
      console.error("Firebase logout failed", err);
    }

    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full md:w-64 bg-slate-950/60 border-r border-card-border md:h-screen sticky top-16 md:top-0 p-6 flex flex-col justify-between shrink-0 z-20 transition-colors duration-200">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
            Control Panel
          </span>
          <div className="text-sm font-bold text-foreground mt-1">
            Elaxora Solutions <span className="text-[10px] text-indigo-500 font-bold select-none">Admin</span>
          </div>
        </div>

        <nav className="space-y-1.5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive(item.href)
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-muted hover:bg-slate-100/5 dark:hover:bg-slate-900/40 hover:text-foreground"
              }`}
            >
              <span className="text-sm select-none">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-card-border mt-4 space-y-3.5">
        {/* Admin Profile section */}
        <div className="px-3 py-1 select-none">
          <span className="block text-[9px] font-bold text-muted uppercase tracking-wider">Signed In As</span>
          <span className="block text-xs font-semibold text-foreground truncate mt-0.5" title={adminEmail}>
            {adminEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all text-left focus:outline-none"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
