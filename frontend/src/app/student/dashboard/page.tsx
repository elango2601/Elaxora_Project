"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface DashboardData {
  profile: { name: string; email: string; college: string; };
  enquiries: any[];
  quotes: any[];
  orders: any[];
}

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quotes" | "orders" | "enquiries">("orders");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        router.push("/student/login");
        return;
      }

      try {
        const email = user.email;

        // Fetch enquiries to get profile info
        const enqRef = collection(db, "enquiries");
        const qEnq = query(enqRef, where("email", "==", email));
        const enqSnapshot = await getDocs(qEnq);
        const enquiriesData = enqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const name = enquiriesData.length > 0 ? (enquiriesData[0] as any).full_name : user.displayName || "Student";
        const college = enquiriesData.length > 0 ? (enquiriesData[0] as any).college_name : "";

        // Fetch quotes
        const quotesRef = collection(db, "quotes");
        const qQuotes = query(quotesRef, where("student_email", "==", email));
        const quotesSnapshot = await getDocs(qQuotes);
        const quotesData = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch orders
        const ordersRef = collection(db, "orders");
        const qOrders = query(ordersRef, where("student_email", "==", email));
        const ordersSnapshot = await getDocs(qOrders);
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const dashboardData = {
          profile: { name, email, college },
          enquiries: enquiriesData,
          quotes: quotesData,
          orders: ordersData
        };

        setData(dashboardData as DashboardData);
        if (ordersData.length === 0 && quotesData.length > 0) {
          setActiveTab("quotes");
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error", err);
    }
    document.cookie = "student_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/student/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-slate-500 animate-pulse font-bold text-lg">Loading your portal...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border border-card-border rounded-2xl">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Welcome back, {data.profile.name.split(" ")[0]}!</h1>
            <p className="text-sm text-slate-400 mt-1">{data.profile.email} • {data.profile.college}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-card-border pb-px overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === "orders" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            Live Projects ({data.orders.length})
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === "quotes" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            Quotations ({data.quotes.length})
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === "enquiries" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            My Enquiries ({data.enquiries.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            data.orders.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500">
                <p>You have no active projects yet.</p>
                <Link href="/projects" className="text-indigo-400 font-bold mt-2 block hover:underline">Browse catalogue</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.orders.map(order => (
                  <div key={order.id} className="glass-card p-6 border border-card-border rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500">Order ID: {order.id}</span>
                        <h3 className="text-lg font-bold text-white leading-tight mt-1">{order.project_title}</h3>
                      </div>
                      <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                        {order.order_status}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Total Price</span>
                        <span className="text-white font-bold">₹{order.price.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Advance Paid</span>
                        <span className="text-white font-bold">{order.advance_paid ? "Yes" : "Pending"}</span>
                      </div>
                    </div>

                    <div className="border-t border-card-border pt-4">
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-indigo-400">Progress</span>
                        <span className="text-white">{order.progress_percent}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 mb-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${order.progress_percent}%` }}></div>
                      </div>
                      <Link 
                        href={`/status/${order.id}`}
                        className="block text-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-bold text-white transition-colors"
                      >
                        Track Live Status & Milestones ➔
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* QUOTES TAB */}
          {activeTab === "quotes" && (
            data.quotes.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500">
                <p>You have no quotations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.quotes.map(quote => (
                  <div key={quote.id} className="glass-card p-6 border border-card-border rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500">Quote ID: {quote.id}</span>
                        <h3 className="text-base font-bold text-white mt-1">₹{quote.final_price.toLocaleString("en-IN")}</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Issued: {new Date(quote.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                        quote.status === "Accepted" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        quote.status === "Change Requested" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-slate-800 text-slate-300 border-slate-700"
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                    
                    <div className="border-t border-card-border pt-4">
                      <Link 
                        href={`/quote/${quote.id}`}
                        className="block text-center rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition-colors shadow-lg"
                      >
                        View Full Quotation ➔
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === "enquiries" && (
            data.enquiries.length === 0 ? (
              <div className="glass-card p-12 text-center text-slate-500">
                <p>You have no pending enquiries.</p>
                <Link href="/projects" className="text-indigo-400 font-bold mt-2 block hover:underline">Submit a new request</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {data.enquiries.map(enq => (
                  <div key={enq.id} className="glass-card p-6 border border-card-border rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500">Enquiry ID: {enq.id}</span>
                        <h3 className="text-base font-bold text-white mt-1">{enq.project_title || "Custom Project"}</h3>
                      </div>
                      <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        Under Review
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500 mb-0.5">Academic Year</p>
                        <p className="text-white font-medium">{enq.academic_year}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-0.5">Department</p>
                        <p className="text-white font-medium">{enq.department}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 mb-0.5">Requirements</p>
                        <p className="text-white font-medium truncate">{enq.requirements}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
