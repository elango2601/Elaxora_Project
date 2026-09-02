"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { exportToCSV } from "@/lib/exportUtils";

interface Quote {
  id: string;
  enquiry_id: string;
  base_price: number;
  referral_discount: number;
  final_price: number;
  status: string;
  created_at: string;
  estimated_delivery: string;
  scope_of_work: string;
}

export default function AdminQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    async function loadQuotes() {
      const token = getCookie("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }
            // Wait for Firebase auth to initialize before making queries
      if (!auth.currentUser) {
        const user = await new Promise(resolve => {
          const unsub = onAuthStateChanged(auth, u => {
            unsub();
            resolve(u);
          });
        });
        if (!user) {
          document.cookie = "admin_token=; path=/; max-age=0";
          router.push("/admin/login");
          return;
        }
      }
      
      

      try {
        const q = query(collection(db, "quotes"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Quote[];
          
          list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          setQuotes(list);
          setLoading(false);
        }, (err) => {
          console.error(err);
          setLoading(false);
        });
    return () => unsubscribe();
      } catch (err) {
        console.error("Failed loading quotes", err);
        setLoading(false);
      }
    }
    loadQuotes();
  }, [router]);

  const filteredQuotes = quotes.filter((q) => {
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      const matchId = (q.id || "").toLowerCase().includes(query);
      const matchEnq = (q.enquiry_id || "").toLowerCase().includes(query);
      if (!matchId && !matchEnq) return false;
    }
    if (selectedStatus && q.status !== selectedStatus) return false;
    return true;
  });

  const handleExport = () => {
    const headers = ["Quote ID", "Enquiry ID", "Project Required", "Requirements", "Base Price", "Expedited Cost", "Total Price", "Deliverable Date", "Status", "Created At"];
    const rows = filteredQuotes.map((q: any) => [
      q.id, q.enquiry_id, q.project_id, q.scope_of_work, q.base_price, q.custom_changes_cost || 0, q.final_price, new Date(q.created_at).toLocaleDateString(), q.status, new Date(q.created_at).toLocaleString()
    ]);
    exportToCSV("elaxora_quotes_history.csv", [headers, ...rows]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Financial Desk</span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">Quotations Logs</h1>
            <p className="text-muted text-xs">Review generated custom invoices, pricing, and student response statuses.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export to Excel/CSV
          </button>
        </div>

        {/* Filters Section */}
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input placeholder="Enter Search"
            type="text"

            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:border-indigo-500/50"
          />
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label className="text-xs text-muted font-semibold whitespace-nowrap">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg bg-slate-900 border border-card-border px-3 py-2 text-xs text-foreground focus:outline-none w-full sm:w-40"
            >
              <option value="">All Invoices</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Change Requested">Change Requested</option>
            </select>
          </div>
        </div>

        {/* Table list */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-card-border text-muted font-bold bg-slate-950/40">
                  <th className="p-4">Quotation ID</th>
                  <th className="p-4">Linked Enquiry</th>
                  <th className="p-4">Base Cost</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Final Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted animate-pulse">
                      Loading quotations sheets...
                    </td>
                  </tr>
                ) : filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted">
                      No quotations found matching parameters.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((q) => (
                    <tr key={q.id} className="border-b border-card-border hover:bg-slate-100/[0.02] dark:hover:bg-slate-900/10 transition-colors">
                      <td className="p-4 font-mono font-bold text-foreground select-all">{q.id}</td>
                      <td className="p-4 font-mono text-muted">{q.enquiry_id}</td>
                      <td className="p-4 text-foreground font-semibold">₹{q.base_price.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-rose-400">₹{q.referral_discount.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-indigo-400 font-bold">₹{q.final_price.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.status === "Accepted"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : q.status === "Change Requested"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-slate-100/5 text-muted border border-card-border"
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/quote/${q.id}`}
                          target="_blank"
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
                        >
                          Invoice Link 🔗
                        </Link>
                      </td>
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
