"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";

interface Referral {
  id: string;
  code: string;
  type: string;
  name: string;
  college?: string;
  contact: string;
  discount_percentage: number;
  commission_percentage: number;
  active: boolean;
  total_clicks: number;
  total_enquiries: number;
  total_orders: number;
  total_revenue: number;
  total_commission: number;
  paid_commission: number;
  pending_commission: number;
}

export default function AdminReferralsPage() {
  const router = useRouter();
  
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Creation form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState("");
  const [refType, setRefType] = useState("Influencer");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [contact, setContact] = useState("");
  const [discountPercent, setDiscountPercent] = useState("10");
  const [commissionPercent, setCommissionPercent] = useState("10");

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  async function loadReferrals() {
    try {
      const querySnapshot = await getDocs(collection(db, "referrals"));
      const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Referral));
      setReferrals(data);
    } catch (err) {
      console.error("Referrals load error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = getCookie("admin_token");
    if (!t) {
      router.push("/admin/login");
      return;
    }
    setToken(t);
    loadReferrals();
  }, [router]);

  // Handle create referral code
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !contact.trim()) return;

    const payload = {
      code: code.trim().toUpperCase(),
      type: refType,
      name: name.trim(),
      college: refType === "Ambassador" ? college.trim() : "",
      contact: contact.trim(),
      discount_percentage: parseFloat(discountPercent) || 0.0,
      commission_percentage: parseFloat(commissionPercent) || 0.0,
      active: true,
      total_clicks: 0,
      total_enquiries: 0,
      total_orders: 0,
      total_revenue: 0,
      total_commission: 0,
      paid_commission: 0,
      pending_commission: 0
    };

    try {
      await addDoc(collection(db, "referrals"), payload);
      alert("Referral code created successfully.");
      setCode("");
      setName("");
      setCollege("");
      setContact("");
      setShowAddForm(false);
      loadReferrals();
    } catch (err) {
      alert("Error adding code.");
    }
  };

  // Toggle active status
  const handleToggleActive = async (refId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "referrals", refId), { active: !currentStatus });
      setReferrals(referrals.map((r) => (r.id === refId ? { ...r, active: !currentStatus } : r)));
    } catch (err) {
      console.error("Toggle active status error", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Referrals & Campus Ambassadors</h1>
            <p className="text-slate-400 text-xs mt-1">Monitor influencer referral codes and college ambassador metrics.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="gradient-btn text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
          >
            {showAddForm ? "View Active Codes" : "+ Create Promo Code"}
          </button>
        </div>

        {showAddForm ? (
          // Add Form
          <div className="glass-card p-6 max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Create Promotion Code</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">Referral Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}

                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">Promotion Type</label>
                  <select
                    value={refType}
                    onChange={(e) => setRefType(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Influencer">Influencer (Social Media)</option>
                    <option value="Ambassador">Campus Ambassador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">Promo Partner Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}

                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">Contact Handle *</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}

                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                
                {refType === "Ambassador" && (
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 mb-1.5 font-semibold">College Name *</label>
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}

                      className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">Student Discount (%)</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">Partner Commission (%)</label>
                  <input
                    type="number"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5"
                >
                  Save Code
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-500 hover:text-slate-400 font-semibold px-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Active List
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">Code</th>
                    <th className="p-4">Partner</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Clicks / Conv</th>
                    <th className="p-4">Revenue</th>
                    <th className="p-4">Commission (Paid / Pending)</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 animate-pulse">
                        Loading referral accounts...
                      </td>
                    </tr>
                  ) : referrals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No referrals set up yet.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((r) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-300 select-all">{r.code}</td>
                        <td className="p-4">
                          <span className="font-semibold text-white block">{r.name}</span>
                          {r.college && <span className="text-[10px] text-slate-500 block">{r.college}</span>}
                          <span className="text-[10px] text-slate-500 block">{r.contact}</span>
                        </td>
                        <td className="p-4 text-slate-400">{r.type}</td>
                        <td className="p-4">
                          <span className="text-white block">{r.total_clicks} clicks</span>
                          <span className="text-[10px] text-slate-500 block">{r.total_orders} orders</span>
                        </td>
                        <td className="p-4 text-white font-bold">₹{r.total_revenue.toLocaleString("en-IN")}</td>
                        <td className="p-4">
                          <span className="text-emerald-400 font-bold block">Paid: ₹{r.paid_commission.toLocaleString("en-IN")}</span>
                          <span className="text-amber-400 font-semibold block">Due: ₹{r.pending_commission.toLocaleString("en-IN")}</span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleActive(r.id, r.active)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              r.active 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {r.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
