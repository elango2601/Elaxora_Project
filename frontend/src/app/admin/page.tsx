"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface KPIs {
  total_projects: number;
  new_enquiries: number;
  active_orders: number;
  completed_orders: number;
  total_revenue: number;
  pending_payments: number;
  referral_commissions: number;
  conversion_rate: string;
  total_customers: number;
}

interface AnalyticsData {
  kpis: KPIs;
  breakdowns: {
    departments: Record<string, number>;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summaryData, setSummaryData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    async function loadAnalytics() {
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
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const enquiriesSnapshot = await getDocs(collection(db, "enquiries"));

        const orders = ordersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const enquiries = enquiriesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        let total_revenue = 0;
        let active_orders = 0;
        let completed_orders = 0;
        
        orders.forEach((order: any) => {
          const price = Number(order.price) || 0;
          total_revenue += price;
          if (order.status !== "completed" && order.status !== "Completed") {
            active_orders++;
          } else {
            completed_orders++;
          }
        });

        const total_projects = orders.length;
        const new_enquiries = enquiries.length;
        
        const uniqueEmails = new Set();
        const departments: Record<string, number> = {};
        
        enquiries.forEach((enq: any) => {
          if (enq.email) uniqueEmails.add(enq.email);
          const dept = enq.department || "Other";
          departments[dept] = (departments[dept] || 0) + 1;
        });
        
        const total_customers = uniqueEmails.size;
        
        let conversion_rate = "0%";
        if (new_enquiries > 0) {
          conversion_rate = ((completed_orders / new_enquiries) * 100).toFixed(1) + "%";
        }

        setSummaryData({
          kpis: {
            total_projects,
            new_enquiries,
            active_orders,
            completed_orders,
            total_revenue,
            pending_payments: 0,
            referral_commissions: 0,
            conversion_rate,
            total_customers,
          },
          breakdowns: {
            departments
          }
        });
      } catch (err) {
        console.error("Failed loading analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-grow p-8 space-y-6 animate-pulse">
          <div className="h-6 w-1/4 bg-slate-800/40 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-24 bg-slate-800/40 rounded-xl"></div>)}
          </div>
        </main>
      </div>
    );
  }

  if (!summaryData) return <div className="p-8 text-white">Loading data or insufficient permissions... (Try logging out and logging back in)</div>;

  const kpiList = [
    { name: "Total Orders", val: summaryData.kpis.total_projects, icon: "📂", color: "text-amber-500" },
    { name: "Total Customers", val: summaryData.kpis.total_customers, icon: "👥", color: "text-blue-400" },
    { name: "New Enquiries", val: summaryData.kpis.new_enquiries, icon: "📬", color: "text-indigo-400" },
    { name: "Active Projects", val: summaryData.kpis.active_orders, icon: "⚙️", color: "text-yellow-500" },
    { name: "Completed Orders", val: summaryData.kpis.completed_orders, icon: "✅", color: "text-emerald-400" },
    { name: "Total Revenue", val: `₹${summaryData.kpis.total_revenue.toLocaleString("en-IN")}`, icon: "💰", color: "text-emerald-500" },
    { name: "Pending Payments", val: `₹${summaryData.kpis.pending_payments.toLocaleString("en-IN")}`, icon: "⌛", color: "text-rose-400" },
    { name: "Referral Commissions", val: `₹${summaryData.kpis.referral_commissions.toLocaleString("en-IN")}`, icon: "🎟️", color: "text-purple-400" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Control Room</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">Overview Dashboard</h1>
          <p className="text-muted text-xs">Real-time statistics fetched directly from database collections.</p>
        </div>

        {/* Section 6 Overview List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiList.map((kpi, idx) => (
            <div key={idx} className="glass-card p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">
                  {kpi.name}
                </span>
                <span className={`text-xl font-extrabold ${kpi.color}`}>
                  {kpi.val}
                </span>
              </div>
              <span className="text-2xl select-none">{kpi.icon}</span>
            </div>
          ))}
        </div>

        {/* Breakdown Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="glass-card p-6 lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-3">
              Popularity: Enquiries by Department
            </h3>
            
            {Object.keys(summaryData.breakdowns.departments).length === 0 ? (
              <p className="text-xs text-muted">No department enquiries logged yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(summaryData.breakdowns.departments).map(([dept, count]) => {
                  const maxCount = Math.max(...Object.values(summaryData.breakdowns.departments));
                  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={dept} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-semibold text-foreground">
                        <span>{dept}</span>
                        <span className="text-muted">{count} enquiries</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="glass-card p-6 lg:col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-3">
                Current Sales Ratio
              </h3>
              <p className="text-xs text-muted mt-3 leading-relaxed">
                Represents converted final order projects divided by aggregate incoming student submissions.
              </p>
            </div>
            <div className="py-6 text-center">
              <span className="text-4xl font-extrabold text-indigo-500">{summaryData.kpis.conversion_rate}</span>
              <span className="block text-[10px] text-muted uppercase font-bold tracking-widest mt-1">Conversion Margin</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
