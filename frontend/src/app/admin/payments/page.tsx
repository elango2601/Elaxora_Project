"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";

interface Payment {
  order_id: string;
  student_name: string;
  student_email: string;
  amount: number;
  phase: string;
  recorded_at: string;
  notes: string;
  status: string;
  id: string;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    async function loadPayments() {
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
        const q = query(collection(db, "orders"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const allPayments: Payment[] = [];
          
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.payments && Array.isArray(data.payments)) {
              data.payments.forEach((p: any) => {
                allPayments.push({
                  order_id: docSnap.id,
                  student_name: data.student_name || "Unknown",
                  student_email: data.student_email || "Unknown",
                  amount: p.amount || 0,
                  phase: p.phase || "Unknown",
                  recorded_at: p.recorded_at || new Date().toISOString(),
                  notes: p.notes || "",
                  status: p.status || "Completed",
                  id: p.id || Math.random().toString(),
                });
              });
            }
          });

          allPayments.sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
          setPayments(allPayments);
          setLoading(false);
        }, (err) => {
          console.error(err);
          setLoading(false);
        });
      
  const handleExport = () => {
    const headers = [
      "Order ID", "Student Name", "Phase", "Method", "Amount Paid", "Date Recorded", "Recorded By"
    ];
    
    const rows = filteredPayments.map(p => [
      p.order_id, p.student_name, p.phase, p.method, p.amount,
      new Date(p.recorded_at).toLocaleString(), p.recorded_by
    ]);
    
    exportToCSV("elaxora_payments_history.csv", [headers, ...rows]);
  };

  return (
) => unsubscribe();
      } catch (err) {
        console.error("Failed loading payments", err);
        setLoading(false);
      }
    }
    loadPayments();
  }, [router]);

  const filteredPayments = payments.filter((p) => {
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchId = p.order_id.toLowerCase().includes(q);
      const matchName = p.student_name.toLowerCase().includes(q);
      if (!matchId && !matchName) return false;
    }
    if (selectedPhase && p.phase !== selectedPhase) return false;
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Accounts Ledger</span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">Payments Transactions</h1>
            <p className="text-muted text-xs">Review manually logged payments from advance deposits to final project deliverables.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export to Excel/CSV
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input placeholder="Enter Search"
            type="text"

            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:border-indigo-500/50"
          />
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <label className="text-xs text-muted font-semibold whitespace-nowrap">Payment Phase:</label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="rounded-lg bg-slate-900 border border-card-border px-3 py-2 text-xs text-foreground focus:outline-none w-full sm:w-40"
            >
              <option value="">All Transactions</option>
              <option value="Advance">Advance</option>
              <option value="Milestone">Milestone</option>
              <option value="Final">Final</option>
              <option value="Change Request">Change Request</option>
            </select>
          </div>
        </div>

        {/* Ledger table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-card-border text-muted font-bold bg-slate-950/40">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Student</th>
                  <th className="p-4">Phase</th>
                  <th className="p-4">Amount Logged</th>
                  <th className="p-4">Recorded Date</th>
                  <th className="p-4">Reference Notes</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted animate-pulse">
                      Loading transaction ledger...
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted">
                      No matching payments found in logs.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p, idx) => (
                    <tr key={idx} className="border-b border-card-border hover:bg-slate-100/[0.02] dark:hover:bg-slate-900/10 transition-colors">
                      <td className="p-4 font-mono font-bold text-foreground select-all">{p.order_id}</td>
                      <td className="p-4">
                        <span className="font-semibold text-foreground block">{p.student_name}</span>
                        <span className="text-[10px] text-muted block">{p.student_email}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {p.phase}
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-extrabold">₹{p.amount.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-muted">
                        {new Date(p.recorded_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="p-4 text-muted truncate max-w-xs" title={p.notes}>
                        {p.notes || "Manual recording - No notes."}
                      </td>
                      <td className="p-4">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          🟢 {p.status}
                        </span>
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
