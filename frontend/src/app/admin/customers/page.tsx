"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

interface Customer {
  name: string;
  email: string;
  whatsapp: string;
  college: string;
  orders_count: number;
  total_spent: number;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    async function loadCustomers() {
      const token = getCookie("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      // Wait for Firebase auth to initialize before making queries
      if (!auth.currentUser) {
        await new Promise(resolve => {
          const unsub = onAuthStateChanged(auth, user => {
            unsub();
            resolve(user);
          });
        });
      }
      
      

      try {
        const querySnapshot = await getDocs(collection(db, "enquiries"));
        const map = new Map<string, Customer>();

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data.email) return;

          const email = data.email.toLowerCase();
          
          if (!map.has(email)) {
            map.set(email, {
              name: data.full_name || data.name || "Unknown",
              email: data.email,
              whatsapp: data.whatsapp_number || data.whatsapp || "",
              college: data.college_name || data.college || "",
              orders_count: 1,
              total_spent: 0
            });
          } else {
            const existing = map.get(email)!;
            existing.orders_count += 1;
          }
        });

        setCustomers(Array.from(map.values()));
      } catch (err) {
        console.error("Failed loading customers", err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, [router]);

  const filteredCustomers = customers.filter((c) => {
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchCol = c.college.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCol) return false;
    }
    return true;
  });


  const handleExport = () => {
    const headers = [
      "Customer UID", "Name", "Email", "Phone", "College", "Department",
      "Total Active Orders", "Total Spent (₹)", "Joined Date"
    ];
    
    const rows = filteredCustomers.map(c => [
      c.uid, c.name, c.email, c.phone, c.college, c.department,
      c.metrics.active_orders, c.metrics.total_spent,
      new Date(c.created_at).toLocaleDateString()
    ]);
    
    exportToCSV("elaxora_customers_directory.csv", [headers, ...rows]);
  };

  return (

    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Client Base</span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">Customer CRM Directory</h1>
            <p className="text-muted text-xs">Access student details, college profiles, orders metrics, and payment records.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export to Excel/CSV
          </button>
        </div>

        {/* Filter */}
        <div className="glass-card p-4">
          <input placeholder="Enter Search"
            type="text"

            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Customer list table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-card-border text-muted font-bold bg-slate-950/40">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">University / College</th>
                  <th className="p-4">Email ID</th>
                  <th className="p-4">WhatsApp Contact</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Paid Capital (Spent)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted animate-pulse">
                      Loading customer directories...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted">
                      No customer files match search constraints.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c, idx) => (
                    <tr key={idx} className="border-b border-card-border hover:bg-slate-100/[0.02] dark:hover:bg-slate-900/10 transition-colors">
                      <td className="p-4 text-foreground font-bold">{c.name}</td>
                      <td className="p-4 text-muted font-semibold">{c.college}</td>
                      <td className="p-4 text-muted select-all">{c.email}</td>
                      <td className="p-4 font-mono text-muted select-all">{c.whatsapp}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.orders_count > 0 
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                            : "bg-slate-900 text-muted"
                        }`}>
                          {c.orders_count} Projects
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-extrabold">₹{c.total_spent.toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
