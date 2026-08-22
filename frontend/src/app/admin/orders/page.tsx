"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

interface Milestone {
  name: string;
  status: string;
}

interface Payment {
  id: string;
  amount: number;
  phase: string;
  status: string;
  recorded_at: string;
  notes?: string;
}

interface ChangeRequest {
  id: string;
  description: string;
  reason: string;
  priority: string;
  additional_cost: number;
  additional_timeline: string;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  enquiry_id: string;
  quote_id: string;
  student_name: string;
  student_email: string;
  student_whatsapp: string;
  project_title: string;
  scope_status: string;
  features: string[];
  technology: string[];
  deliverables: string[];
  price: number;
  advance_paid: boolean;
  payment_status: string;
  order_status: string;
  progress_percent: number;
  milestones: Milestone[];
  payments: Payment[];
  revision_count_limit: number;
  revision_count_used: number;
  revisions: any[];
  change_requests: ChangeRequest[];
  referral_code?: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Detailed selected order dossier
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Payments ledger states
  const [payAmount, setPayAmount] = useState("");
  const [payPhase, setPayPhase] = useState("Advance");
  const [payNotes, setPayNotes] = useState("");

  // Progress state updates
  const [orderStatus, setOrderStatus] = useState("Development");
  const [progressPercent, setProgressPercent] = useState(30);

  // Change request quote states
  const [selectedCrId, setSelectedCrId] = useState("");
  const [crStatus, setCrStatus] = useState("Quote Sent");
  const [crCost, setCrCost] = useState("1000");
  const [crTimeline, setCrTimeline] = useState("3 Days");

  // Fetch token utility
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  async function loadOrders() {
      // Wait for Firebase auth to initialize before making queries
      if (!auth.currentUser) {
        await new Promise(resolve => {
          const unsub = onAuthStateChanged(auth, user => {
            unsub();
            resolve(user);
          });
        });
      }
      
      // Double check auth
      if (!auth.currentUser) {
         router.push("/admin/login");
         return;
      }

    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(list);
    } catch (err) {
      console.error("Order fetch error", err);
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
    loadOrders();
  }, [router]);

  // Sync state with selected order
  useEffect(() => {
    if (selectedOrder) {
      setOrderStatus(selectedOrder.order_status);
      setProgressPercent(selectedOrder.progress_percent);
      
      // Auto populate payment amount suggestion based on balance
      if (!selectedOrder.payments || selectedOrder.payments.length === 0) {
        // Suggest advance payment amount
        const suggestAdvance = selectedOrder.price * 0.4;
        setPayAmount(suggestAdvance.toString());
      } else {
        // Suggest remaining price
        const totalPaid = selectedOrder.payments.reduce((acc, p) => acc + p.amount, 0);
        const balance = selectedOrder.price - totalPaid;
        setPayAmount(balance > 0 ? balance.toString() : "0");
      }
    }
  }, [selectedOrder]);

  // Submit Payment Record
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !payAmount) return;

    try {
      const newPayment: Payment = {
        id: Math.random().toString(36).substring(2, 9),
        amount: parseFloat(payAmount),
        phase: payPhase,
        status: "Completed",
        recorded_at: new Date().toISOString(),
        notes: payNotes
      };
      
      const updatedPayments = [...(selectedOrder.payments || []), newPayment];
      const orderRef = doc(db, "orders", selectedOrder.id);
      
      await updateDoc(orderRef, {
        payments: updatedPayments
      });

      const updated = { ...selectedOrder, payments: updatedPayments };
      setSelectedOrder(updated);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setPayNotes("");
      alert("Payment logged successfully. State updated.");
    } catch (err) {
      alert("Error recording payment.");
    }
  };

  // Submit Progress & Milestones change
  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Build updated milestones array (simple tick box simulation)
    const currentMilestones = [...(selectedOrder.milestones || [])];

    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, {
        order_status: orderStatus,
        progress_percent: progressPercent,
        milestones: currentMilestones
      });
      
      const updated = {
        ...selectedOrder,
        order_status: orderStatus,
        progress_percent: progressPercent,
        milestones: currentMilestones
      };
      setSelectedOrder(updated);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      alert("Progress updated successfully.");
    } catch (err) {
      alert("Error saving progress.");
    }
  };

  // Toggle milestone checkboxes
  const handleToggleMilestone = async (milestoneIndex: number) => {
    if (!selectedOrder) return;
    const currentMilestones = [...(selectedOrder.milestones || [])];
    currentMilestones[milestoneIndex].status = 
      currentMilestones[milestoneIndex].status === "Completed" ? "Pending" : "Completed";

    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, {
        milestones: currentMilestones
      });
      
      const updated = {
        ...selectedOrder,
        milestones: currentMilestones
      };
      setSelectedOrder(updated);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      console.error("Milestone toggle error", err);
    }
  };

  // Submit Change Request Quote
  const handleQuoteCr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedCrId) return;

    try {
      const currentCRs = [...(selectedOrder.change_requests || [])];
      const crIndex = currentCRs.findIndex(cr => cr.id === selectedCrId);
      if (crIndex === -1) return;

      currentCRs[crIndex] = {
        ...currentCRs[crIndex],
        status: crStatus,
        additional_cost: parseFloat(crCost) || 0,
        additional_timeline: crTimeline
      };

      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, {
        change_requests: currentCRs
      });

      const updated = { ...selectedOrder, change_requests: currentCRs };
      setSelectedOrder(updated);
      setOrders(orders.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedCrId("");
      alert("Change request quote sent successfully.");
    } catch (err) {
      alert("Error sending quote.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Active Orders</h1>
          <p className="text-slate-400 text-xs mt-1">Record payments, manage development milestones, and process change requests.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Orders Table */}
          <div className="xl:col-span-2 space-y-4">
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 font-bold bg-slate-950/40">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Locked Project</th>
                      <th className="p-4">Balance</th>
                      <th className="p-4">Progress</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 animate-pulse">
                          Loading active orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No active student projects.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => {
                        const totalPaid = o.payments.reduce((acc, p) => acc + p.amount, 0);
                        const balance = o.price - totalPaid;
                        return (
                          <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono font-bold text-slate-300">{o.id}</td>
                            <td className="p-4">
                              <span className="font-semibold text-white block">{o.student_name}</span>
                              <span className="text-[10px] text-slate-500 block">{o.student_whatsapp}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-indigo-400 font-semibold block">{o.project_title}</span>
                              <span className="text-[10px] text-slate-500 block">Scope: {o.scope_status}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-white block font-bold">₹{o.price.toLocaleString("en-IN")}</span>
                              <span className="text-[10px] text-slate-500 block">Due: ₹{balance.toLocaleString("en-IN")}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-300">{o.progress_percent}%</span>
                                <span className="text-[10px] text-slate-500">({o.order_status})</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setSelectedCrId("");
                                }}
                                className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2 py-1 text-[10px] transition-colors"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dossier detail pane */}
          <div className="xl:col-span-1">
            {selectedOrder ? (
              <div className="glass-card p-6 space-y-6">
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Order Dossier</span>
                    <h3 className="text-sm font-bold text-white mt-1">{selectedOrder.student_name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-xs text-slate-500 hover:text-slate-400 font-semibold"
                  >
                    Close [X]
                  </button>
                </div>

                {/* Progress bar setter */}
                <form onSubmit={handleUpdateProgress} className="space-y-4 border-b border-white/5 pb-5">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Update Work Progress</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">State Status</label>
                      <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="rounded bg-slate-900 border border-white/5 w-full p-1 text-white"
                      >
                        <option value="Advance Pending">Advance Pending</option>
                        <option value="Advance Paid">Advance Paid</option>
                        <option value="Scope Locked">Scope Locked</option>
                        <option value="Development">Development</option>
                        <option value="Demo Ready">Demo Ready</option>
                        <option value="Revision">Revision</option>
                        <option value="Final Payment Pending">Final Payment Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Percent Completed ({progressPercent}%)</label>
                      <input placeholder="Enter Progress Percent"
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={progressPercent}
                        onChange={(e) => setProgressPercent(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 text-[10px] transition-colors"
                  >
                    Save Progress Values
                  </button>
                </form>

                {/* Milestones checkbox logs */}
                <div className="space-y-3 border-b border-white/5 pb-5">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Milestones checklist</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                    {selectedOrder.milestones.map((m, idx) => (
                      <label key={idx} className="flex items-center text-xs text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={m.status === "Completed"}
                          onChange={() => handleToggleMilestone(idx)}
                          className="rounded border-white/5 bg-slate-900 text-indigo-600 focus:ring-0 mr-2.5 h-3.5 w-3.5"
                        />
                        {m.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Financial Payments recorder */}
                <form onSubmit={handleRecordPayment} className="space-y-4 border-b border-white/5 pb-5">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Log Cash Payment</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Amount Paid (₹)</label>
                      <input placeholder="Enter Pay Amount"
                        type="number"
                        required
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-white/5 p-1 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Phase</label>
                      <select
                        value={payPhase}
                        onChange={(e) => setPayPhase(e.target.value)}
                        className="rounded bg-slate-900 border border-white/5 w-full p-1 text-white"
                      >
                        <option value="Advance">Advance</option>
                        <option value="Milestone">Milestone</option>
                        <option value="Final">Final</option>
                        <option value="Change Request">Change Request</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Receipt Notes / Tx ID</label>
                    <input placeholder="Enter Pay Notes"
                      type="text"
                      value={payNotes}
                      onChange={(e) => setPayNotes(e.target.value)}

                      className="w-full rounded bg-slate-900 border border-white/5 px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 text-[10px] transition-colors"
                  >
                    Confirm & Record Payment
                  </button>
                </form>

                {/* Change Request processing panel */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Process Change Requests</h4>
                  
                  {selectedOrder.change_requests.length === 0 ? (
                    <p className="text-[10px] text-slate-500">No custom feature requests submitted.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedOrder.change_requests.map((cr) => (
                        <div key={cr.id} className="border border-white/5 rounded p-3 bg-slate-950/20 text-xs space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-slate-300 block">{cr.id}: {cr.description}</span>
                              <span className="text-[10px] text-slate-500 block">Reason: {cr.reason}</span>
                            </div>
                            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                              {cr.status}
                            </span>
                          </div>

                          {selectedCrId !== cr.id ? (
                            cr.status === "Requested" && (
                              <button
                                onClick={() => {
                                  setSelectedCrId(cr.id);
                                  setCrStatus("Quote Sent");
                                }}
                                className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2 py-1 text-[9px]"
                              >
                                ⚖️ Price & Quote
                              </button>
                            )
                          ) : (
                            <form onSubmit={handleQuoteCr} className="space-y-3 pt-2 border-t border-white/5">
                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div>
                                  <label className="block text-slate-500 mb-1">Additional Cost (₹)</label>
                                  <input placeholder="Enter Cr Cost"
                                    type="number"
                                    value={crCost}
                                    onChange={(e) => setCrCost(e.target.value)}
                                    className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-500 mb-1">Est. Extra Time</label>
                                  <input placeholder="Enter Cr Timeline"
                                    type="text"
                                    value={crTimeline}
                                    onChange={(e) => setCrTimeline(e.target.value)}
                                    className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="rounded bg-indigo-600 text-white font-bold px-2 py-1 text-[9px]"
                                >
                                  Submit Quote
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCrId("")}
                                  className="text-[9px] text-slate-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 text-center text-slate-500 text-xs">
                Select an order dossier to log payments, slide progress metrics, tick milestones, or quote change requests.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
