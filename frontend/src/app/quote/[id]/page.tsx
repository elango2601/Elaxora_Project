"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

interface Milestone {
  name: string;
  percentage: number;
  amount: number;
  status: string;
}

interface Quote {
  id: string;
  enquiry_id: string;
  base_price: number;
  customization_cost: number;
  additional_feature_cost: number;
  deployment_cost: number;
  documentation_cost: number;
  other_charges: number;
  referral_discount: number;
  final_price: number;
  advance_percentage: number;
  advance_amount: number;
  remaining_amount: number;
  estimated_delivery: string;
  milestones: Milestone[];
  scope_of_work: string;
  terms: string;
  status: string; // Sent, Accepted, Change Requested, Expired
  created_at: string;
}

export default function StudentQuoteView() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Feedback popup state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuote() {
      try {
        const docRef = doc(db, "quotes", quoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setQuote({ 
            id: docSnap.id, 
            ...data,
            // Convert Firestore Timestamp to ISO string if needed
            created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at 
          } as Quote);
        } else {
          setError("Quotation not found. Please verify the URL link.");
        }
      } catch (err: any) {
        setError("Quotation API offline. Please check back later.");
      } finally {
        setLoading(false);
      }
    }
    if (quoteId) loadQuote();
  }, [quoteId]);

  const handleAccept = async () => {
    if (!quote) return;
    setIsSubmitting(true);
    try {
      // 1. Fetch original enquiry to build the order
      const enqRef = doc(db, "enquiries", quote.enquiry_id);
      const enqSnap = await getDoc(enqRef);
      const enqData = enqSnap.exists() ? enqSnap.data() : {};
      
      // 2. Create the active order document
      const orderId = `PF-ORD-${quote.id.split("-").pop()}`;
      const orderRef = doc(db, "orders", orderId);
      
      await setDoc(orderRef, {
        id: orderId,
        enquiry_id: quote.enquiry_id,
        quote_id: quote.id,
        student_name: enqData.full_name || "Unknown",
        student_email: enqData.email || "Unknown",
        student_whatsapp: enqData.whatsapp_number || "Unknown",
        project_title: enqData.project_id || "Custom Project",
        scope_status: "PENDING_LOCK",
        features: [],
        technology: enqData.preferred_technology ? [enqData.preferred_technology] : [],
        deliverables: ["Source Code", "Documentation"],
        price: quote.final_price,
        advance_paid: false,
        payment_status: "Advance Pending",
        order_status: "Advance Pending",
        progress_percent: 0,
        milestones: quote.milestones || [],
        payments: [],
        revision_count_limit: 2,
        revision_count_used: 0,
        revisions: [],
        change_requests: [],
        referral_code: enqData.referral_code || "",
        created_at: new Date().toISOString()
      }, { merge: true });

      // 3. Mark quote and enquiry as accepted AFTER order is securely created
      const quoteRef = doc(db, "quotes", quote.id);
      await updateDoc(quoteRef, { status: "Accepted" });

      if (enqSnap.exists()) {
        await updateDoc(enqRef, { status: "Accepted" });
      }
      
      // Redirection to the live status page
      router.push(`/status/${orderId}`);
    } catch (err: any) {
      console.error(err);
      alert("Error placing order: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !feedback.trim()) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "quotes", quote.id);
      await updateDoc(docRef, { 
        status: "Change Requested",
        feedback: feedback
      });
      setQuote({ ...quote, status: "Change Requested" });
      setShowRejectForm(false);
      alert("Feedback submitted successfully. The developer has been notified.");
    } catch (err: any) {
      alert("Error sending request to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
        <div className="h-96 bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="text-4xl block mb-4">⚠️</span>
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-slate-400 mb-8">{error || "Unable to display quotation parameters."}</p>
        <Link href="/projects" className="gradient-btn px-4 py-2 rounded-lg text-white font-semibold">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">

      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Project Quotation</h1>
          <p className="text-slate-400 text-xs mt-1">Review the customized scope of work and pricing breakdown.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
            quote.status === "Accepted"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : quote.status === "Change Requested"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          }`}>
            {quote.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Invoice details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Locked Scope */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Approved Scope of Work</h3>
            <ul className="space-y-2">
              {quote.scope_of_work.split("\n").filter(line => line.trim()).map((line, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-indigo-400 font-bold">•</span>
                  {line.replace(/^-\s*/, "")}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Schedule Milestones */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Payment Milestones schedule</h3>
            <div className="space-y-3">
              {quote.milestones.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">{idx + 1}.</span>
                    <span className="font-semibold text-slate-300">{m.name} ({m.percentage}%)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white">₹{m.amount.toLocaleString("en-IN")}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      m.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-900 text-slate-500"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="glass-card p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quotation Terms</h3>
            <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{quote.terms}</p>
          </div>
        </div>

        {/* Right Col: Quote Costing Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 space-y-6 sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Quotation Summary
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Price</span>
                <span className="text-white">₹{quote.base_price.toLocaleString("en-IN")}</span>
              </div>
              
              {quote.customization_cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Customizations</span>
                  <span className="text-white">₹{quote.customization_cost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {quote.additional_feature_cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Add-on Features</span>
                  <span className="text-white">₹{quote.additional_feature_cost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {quote.deployment_cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Cloud Deployment</span>
                  <span className="text-white">₹{quote.deployment_cost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {quote.documentation_cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Report & PPT Support</span>
                  <span className="text-white">₹{quote.documentation_cost.toLocaleString("en-IN")}</span>
                </div>
              )}

              {quote.other_charges > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Other Charges</span>
                  <span className="text-white">₹{quote.other_charges.toLocaleString("en-IN")}</span>
                </div>
              )}

              {quote.referral_discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Referral Discount</span>
                  <span>-₹{quote.referral_discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-bold">
                <span className="text-white">Final Quote Price</span>
                <span className="text-indigo-400">₹{quote.final_price.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Advance Required ({quote.advance_percentage}%)</span>
                <span className="text-white font-bold">₹{quote.advance_amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Remaining balance</span>
                <span className="text-white font-bold">₹{quote.remaining_amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 font-semibold">Est. Delivery Timeline</span>
                <span className="text-white font-bold">{quote.estimated_delivery}</span>
              </div>
            </div>

            {quote.status !== "Accepted" && (
              <div className="print:hidden border-t border-white/5 pt-5 space-y-3">
                <button
                  onClick={handleAccept}
                  disabled={isSubmitting}
                  className="gradient-btn text-center block w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-75"
                >
                  {isSubmitting ? "Processing..." : "Accept Quote & Place Order"}
                </button>
                
                {!showRejectForm ? (
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white block w-full py-3 rounded-xl text-xs font-semibold text-center transition-all"
                  >
                    Request Scope Changes
                  </button>
                ) : (
                  <form onSubmit={handleRejectSubmit} className="space-y-3 pt-3 border-t border-white/5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Describe Requested Changes
                    </label>
                    <textarea placeholder="Enter Feedback"
                      required
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}

                      rows={3}
                      className="w-full rounded-lg bg-slate-900 border border-white/5 px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-indigo-600 text-white font-semibold px-3 py-1.5 text-xs hover:bg-indigo-500 disabled:opacity-50"
                      >
                        Submit Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(false)}
                        className="text-xs text-slate-500 hover:text-slate-400 font-semibold px-2 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
            
            {quote.status === "Accepted" && (
              <div className="border-t border-white/5 pt-5 space-y-2">
                <Link
                  href={`/status/PF-ORD-${quote.id.split("-")[-1]}`}
                  className="gradient-btn text-center block w-full py-3 rounded-xl text-xs font-bold text-white shadow-lg"
                >
                  View Live Project Status
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
