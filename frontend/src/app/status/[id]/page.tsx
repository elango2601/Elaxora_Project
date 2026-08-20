"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface Milestone {
  name: string;
  status: string; // Pending, Completed
  due_date?: string;
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
  status: string; // Requested, Under Review, Quote Sent, Approved, Paid, Development, Completed, Rejected
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
  scope_status: string; // LOCKED, PENDING_LOCK
  features: string[];
  technology: string[];
  deliverables: string[];
  price: number;
  advance_paid: boolean;
  payment_status: string;
  order_status: string; // Advance Pending, Advance Paid, Scope Locked, Development, Demo Ready, Revision, Final Payment Pending, Completed, Cancelled
  progress_percent: number;
  milestones: Milestone[];
  payments: Payment[];
  revision_count_limit: number;
  revision_count_used: number;
  revisions: unknown[];
  change_requests: ChangeRequest[];
  referral_code?: string;
  created_at: string;
}

export default function StudentProjectStatus() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Custom CR Modal Form state
  const [showCrForm, setShowCrForm] = useState(false);
  const [crDesc, setCrDesc] = useState("");
  const [crReason, setCrReason] = useState("");
  const [crPriority, setCrPriority] = useState("Medium");
  const [crSubmitting, setCrSubmitting] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          const data = orderSnap.data() as Omit<Order, 'id'>;
          setOrder({ id: orderSnap.id, ...data } as Order);
        } else {
          setError("Order status record not found. Verify your Order ID link.");
        }
      } catch (_err) {
        setError("Order tracker backend offline. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    if (orderId) loadOrder();
  }, [orderId]);

  // Submit Change Request
  const handleCrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !crDesc.trim()) return;
    setCrSubmitting(true);
    try {
      const newCr: ChangeRequest = {
        id: "CR-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        description: crDesc,
        reason: crReason,
        priority: crPriority,
        additional_cost: 0,
        additional_timeline: "",
        status: "Requested",
        created_at: new Date().toISOString()
      };
      
      const orderRef = doc(db, 'orders', order.id);
      const updatedChangeRequests = [...(order.change_requests || []), newCr];
      
      await updateDoc(orderRef, {
        change_requests: updatedChangeRequests
      });
      
      setOrder({ ...order, change_requests: updatedChangeRequests });
      setCrDesc("");
      setCrReason("");
      setShowCrForm(false);
      alert("New Feature Change Request submitted. We will review and quote additional costs.");
    } catch (_err) {
      alert("Error sending request to server.");
    } finally {
      setCrSubmitting(false);
    }
  };

  // Accept CR Quote
  const handleAcceptCr = async (crId: string) => {
    if (!order) return;
    if (!confirm("Are you sure you want to approve this change request quote? This will increase your final project balance.")) return;
    try {
      const updatedChangeRequests = (order.change_requests || []).map(cr => {
        if (cr.id === crId) {
          return { ...cr, status: "Approved" };
        }
        return cr;
      });

      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        change_requests: updatedChangeRequests
      });

      setOrder({ ...order, change_requests: updatedChangeRequests });
      alert("Change request approved! Features have been locked into your active project scope.");
    } catch (_err) {
      alert("Error approving quote.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
        <div className="h-64 bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="text-4xl block mb-4">📂</span>
        <h2 className="text-2xl font-bold text-white mb-4">No Active Order</h2>
        <p className="text-slate-400 mb-8">{error || "Unable to retrieve tracking page."}</p>
        <Link href="/projects" className="gradient-btn px-4 py-2 rounded-lg text-white font-semibold">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">

      {/* Header Dashboard Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
            Order Live Status
          </span>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl tracking-tight mt-1">
            {order.project_title}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            ID: <span className="text-slate-300 font-mono font-bold select-all">{order.id}</span> • Student: {order.student_name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Progress</span>
            <span className="text-lg font-black text-indigo-400">{order.progress_percent}%</span>
          </div>
          <div className="w-24 bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${order.progress_percent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress Timeline & Scope */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Timeline Milestones */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Project Milestones</h3>
            <div className="relative border-l border-white/5 pl-6 ml-2 space-y-6">
              {order.milestones.map((m, idx) => {
                const isCompleted = m.status === "Completed";
                return (
                  <div key={idx} className="relative">
                    {/* Circle icon */}
                    <span className={`absolute -left-10 top-0.5 rounded-full w-5 h-5 flex items-center justify-center text-[10px] border ${
                      isCompleted 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold" 
                        : "bg-slate-950 border-white/5 text-slate-600"
                    }`}>
                      {isCompleted ? "✓" : ""}
                    </span>
                    <h4 className={`text-xs font-semibold ${isCompleted ? "text-white" : "text-slate-500"}`}>
                      {m.name}
                    </h4>
                    {m.due_date && <span className="text-[10px] text-slate-500">Target: {m.due_date}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Locked Scope Parameters */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Locked Project Scope</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                order.scope_status === "LOCKED"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                Scope Status: {order.scope_status}
              </span>
            </div>

            {order.scope_status === "LOCKED" ? (
              <p className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/10 p-3 rounded">
                🔒 Project requirements have been confirmed. Additional requirements may require a separate quotation.
              </p>
            ) : (
              <p className="text-[10px] text-amber-400 font-semibold bg-amber-500/5 border border-amber-500/10 p-3 rounded animate-pulse">
                ⚠️ Awaiting required Advance Payment to lock scope and launch development code.
              </p>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-300 mb-2">Core Features Locked</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400">
                  {order.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">•</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <h4 className="font-bold text-slate-300 mb-1.5">Selected Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {order.technology.map((tech, idx) => (
                      <span key={idx} className="bg-slate-900 border border-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-300 mb-1.5">Core Deliverables</h4>
                  <div className="flex flex-wrap gap-1">
                    {order.deliverables.map((del, idx) => (
                      <span key={idx} className="bg-slate-900 border border-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded font-semibold">
                        {del}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Request panel */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Change Requests (Add-ons)</h3>
              <button
                onClick={() => setShowCrForm(true)}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3 py-1.5 transition-colors"
              >
                + Request New Feature
              </button>
            </div>

            {/* Cr creation form inline */}
            {showCrForm && (
              <form onSubmit={handleCrSubmit} className="space-y-4 border border-white/10 p-4 rounded-lg bg-slate-900/50">
                <h4 className="text-xs font-bold text-white uppercase">Request Additional Scope</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Feature Description *</label>
                    <input
                      type="text"
                      required
                      value={crDesc}
                      onChange={(e) => setCrDesc(e.target.value)}
                      placeholder="e.g. Add an automated Excel reports export option"
                      className="w-full rounded bg-slate-950 border border-white/5 px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Reason for change / Guide demand *</label>
                    <textarea
                      required
                      value={crReason}
                      onChange={(e) => setCrReason(e.target.value)}
                      placeholder="e.g. University guide requested this to compare predictions visually."
                      rows={2}
                      className="w-full rounded bg-slate-950 border border-white/5 px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Priority</label>
                    <select
                      value={crPriority}
                      onChange={(e) => setCrPriority(e.target.value)}
                      className="rounded bg-slate-950 border border-white/5 px-2 py-1 text-xs text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={crSubmitting}
                      className="rounded bg-indigo-600 text-white font-semibold px-3 py-1.5 text-xs hover:bg-indigo-500"
                    >
                      {crSubmitting ? "Submitting..." : "Submit Request"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCrForm(false)}
                      className="text-xs text-slate-500 hover:text-slate-400 font-semibold px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* List change requests */}
            {order.change_requests.length === 0 ? (
              <p className="text-xs text-slate-500">No custom change requests logged for this project order.</p>
            ) : (
              <div className="space-y-4">
                {order.change_requests.map((cr) => (
                  <div key={cr.id} className="border border-white/5 rounded-lg p-4 bg-slate-950/40 text-xs">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-white">{cr.id}: {cr.description}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">Priority: {cr.priority}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cr.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : cr.status === "Quote Sent"
                          ? "bg-amber-500/10 text-amber-400 animate-pulse border border-amber-500/20"
                          : "bg-slate-900 text-slate-400"
                      }`}>
                        {cr.status}
                      </span>
                    </div>
                    
                    {cr.status === "Quote Sent" && (
                      <div className="mt-4 border-t border-white/5 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <span className="block text-[10px] text-slate-500">Quoted cost</span>
                          <span className="text-sm font-bold text-indigo-400">+₹{cr.additional_cost.toLocaleString("en-IN")}</span>
                          {cr.additional_timeline && (
                            <span className="block text-[10px] text-slate-500 mt-0.5">Extra Time: {cr.additional_timeline}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAcceptCr(cr.id)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 transition-colors shadow-lg"
                        >
                          Accept Add-on Quote
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial Summaries */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Order Details & Pricing card */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Order Financials
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Total Order Price</span>
                <span className="text-white font-bold">₹{order.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Payment Status</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  order.payment_status === "Fully Paid"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-900 text-slate-400"
                }`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Revisions Limit</span>
                <span className="text-slate-300">{order.revision_count_limit} rounds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Revisions Used</span>
                <span className="text-slate-300">{order.revision_count_used} rounds</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-300">Recorded Payments</h4>
              {order.payments.length === 0 ? (
                <p className="text-[10px] text-slate-500">No payment logs recorded. Awaiting advance payment link confirmation.</p>
              ) : (
                <div className="space-y-2">
                  {order.payments.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-[10px] bg-slate-900/60 p-2 rounded">
                      <div>
                        <span className="block font-bold text-white">{p.phase} (Paid)</span>
                        <span className="text-slate-500">{new Date(p.recorded_at).toLocaleDateString()}</span>
                      </div>
                      <span className="font-bold text-indigo-400">₹{p.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-white/5 pt-4">
              <a
                href={`https://wa.me/919999999999?text=Hi%20Elaxora Solutions,%20I'm%20discussing%20my%20order%20${order.id}.%20Please%20verify.`}
                target="_blank"
                rel="noreferrer"
                className="border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold transition-all"
              >
                💬 Ask Developer on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
