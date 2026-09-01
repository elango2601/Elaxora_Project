"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, addDoc, onSnapshot } from "firebase/firestore";

interface Enquiry {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  college_name: string;
  department: string;
  year: string;
  project_id: string;
  preferred_technology: string;
  budget_range: string;
  required_deadline: string;
  deployment_required: boolean;
  demo_video_required: boolean;
  additional_requirements: string;
  referral_code: string;
  message: string;
  status: string;
  notes: string[];
  created_at: string;
}

export default function AdminEnquiriesPage() {
  const router = useRouter();
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Detailed modal/drawer states
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  
  // Notes append state
  const [newNote, setNewNote] = useState("");
  
  // Quote creation state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [basePrice, setBasePrice] = useState("5999");
  const [customPrice, setCustomPrice] = useState("0");
  const [addonPrice, setAddonPrice] = useState("0");
  const [deployPrice, setDeployPrice] = useState("0");
  const [docPrice, setDocPrice] = useState("0");
  const [otherPrice, setOtherPrice] = useState("0");
  const [discountPrice, setDiscountPrice] = useState("0");
  const [estDelivery, setEstDelivery] = useState("14 Days");
  const [scopeOfWork, setScopeOfWork] = useState("");
  
  // Generated Quote state
  const [createdQuoteUrl, setCreatedQuoteUrl] = useState("");

  // Fetch token utility
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  async function loadEnquiries(currentToken: string) {
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
      const unsubscribe = onSnapshot(collection(db, "enquiries"), (querySnapshot) => {
        const list = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            notes: data.notes || [],
            created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at
          };
        }) as Enquiry[];
        setEnquiries(list);
        setLoading(false);
      }, (err) => {
        console.error("Enquiry fetch error", err);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Enquiry fetch error", err);
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
    let unsub: any;
    loadEnquiries(t).then(res => {
      unsub = res;
    });
  
  const handleExport = () => {
    const headers = [
      "Enquiry ID", "Name", "Email", "WhatsApp", "College", "Department", "Year",
      "Project Selected", "Preferred Tech", "Budget", "Deadline",
      "Deployment Reqd", "Demo Reqd", "Referral", "Message", "Additional Req", "Status", "Date"
    ];
    
    const rows = enquiries.map(e => [
      e.id, e.name, e.email, e.whatsapp, e.college, e.department, e.year,
      e.project_selected, e.preferred_tech, e.budget, e.deadline,
      e.deployment_required ? "Yes" : "No", e.demo_required ? "Yes" : "No",
      e.referral, e.message, e.add_requirements, e.status,
      e.created_at ? new Date(e.created_at.seconds * 1000).toLocaleString() : ""
    ]);
    
    exportToCSV("elaxora_enquiries.csv", [headers, ...rows]);
  };

  return (
) => {
      if (unsub) unsub();
    };
  }, [router]);

  // Handle Enquiry Status change
  const handleStatusChange = async (enqId: string, newStatus: string) => {
    try {
      const enqRef = doc(db, "enquiries", enqId);
      await updateDoc(enqRef, { status: newStatus });
      
      const updatedEnquiries = enquiries.map((e) => (e.id === enqId ? { ...e, status: newStatus } : e));
      setEnquiries(updatedEnquiries);
      
      if (selectedEnquiry?.id === enqId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Append note to Enquiry
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNote.trim()) return;

    const currentNotes = [...(selectedEnquiry.notes || [])];
    currentNotes.push(`${new Date().toLocaleDateString()}: ${newNote.trim()}`);

    try {
      const enqRef = doc(db, "enquiries", selectedEnquiry.id);
      await updateDoc(enqRef, { notes: currentNotes });
      
      const updated = { ...selectedEnquiry, notes: currentNotes };
      setSelectedEnquiry(updated);
      setEnquiries(enquiries.map((enq) => (enq.id === updated.id ? updated : enq)));
      setNewNote("");
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  // Populate quote scope of work default text
  useEffect(() => {
    if (selectedEnquiry) {
      const defaultScope = `- Standard Project Template Implementation\n- Customizations: ${selectedEnquiry.preferred_technology}\n- Deployment support: ${selectedEnquiry.deployment_required ? "Yes" : "No"}\n- Delivery features match list`;
      setScopeOfWork(defaultScope);
      
      // Auto-set starting price baseline
      if (selectedEnquiry.project_id === "student-performance-prediction") {
        setBasePrice("3499");
      } else {
        setBasePrice("5999");
      }
    }
  }, [selectedEnquiry]);

  // Submit quote builder
  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    const base = parseFloat(basePrice) || 0;
    const customCost = parseFloat(customPrice) || 0;
    const addonCost = parseFloat(addonPrice) || 0;
    const deployCost = parseFloat(deployPrice) || 0;
    const docCost = parseFloat(docPrice) || 0;
    const otherCost = parseFloat(otherPrice) || 0;
    const discountCost = parseFloat(discountPrice) || 0;

    const finalPrice = base + customCost + addonCost + deployCost + docCost + otherCost - discountCost;
    const advancePercentage = finalPrice < 5000 ? 50 : 40;
    const advanceAmount = finalPrice * (advancePercentage / 100);
    const remainingAmount = finalPrice - advanceAmount;

    // Calculate milestones
    let milestones = [];
    if (finalPrice < 5000) {
      milestones = [
        { name: "Advance Payment", percentage: 50, amount: finalPrice * 0.5 },
        { name: "Final Delivery Balance", percentage: 50, amount: finalPrice * 0.5 }
      ];
    } else {
      milestones = [
        { name: "Advance Payment", percentage: 40, amount: finalPrice * 0.4 },
        { name: "Development Milestone Approved", percentage: 30, amount: finalPrice * 0.3 },
        { name: "Final Delivery Balance", percentage: 30, amount: finalPrice * 0.3 }
      ];
    }

    const payload = {
      enquiry_id: selectedEnquiry.id,
      student_email: selectedEnquiry.email,
      status: "Pending",
      base_price: base,
      customization_cost: customCost,
      additional_feature_cost: addonCost,
      deployment_cost: deployCost,
      documentation_cost: docCost,
      other_charges: otherCost,
      referral_discount: discountCost,
      final_price: finalPrice,
      advance_percentage: advancePercentage,
      advance_amount: advanceAmount,
      remaining_amount: remainingAmount,
      estimated_delivery: estDelivery,
      milestones: milestones,
      scope_of_work: scopeOfWork,
      terms: "1. Scope status remains unlocked until the advance payment is received.\n2. Standard development timeline begins upon receipt of advance.\n3. Source code release happens only after final settlement."
    };

    try {
      const docRef = await addDoc(collection(db, "quotes"), {
        ...payload,
        created_at: new Date().toISOString()
      });
      
      // Show success link
      const link = `http://localhost:3000/quote/${docRef.id}`;
      setCreatedQuoteUrl(link);
      
      // Optionally update status of enquiry here to Quote Sent
      const enqRef = doc(db, "enquiries", selectedEnquiry.id);
      await updateDoc(enqRef, { status: "Quote Sent" });
      
      // Reload list to show converted status
      loadEnquiries(token);
    } catch (err: any) {
      alert("Error sending quote parameters: " + err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Enquiries</h1>
            <p className="text-slate-400 text-xs mt-1">Review student project requirements and create quotations.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export to Excel/CSV
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* List Table Col */}
          <div className="xl:col-span-2 space-y-4">
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 font-bold bg-slate-950/40">
                      <th className="p-4">ID</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">College</th>
                      <th className="p-4">Project</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 animate-pulse">
                          Loading enquiries database...
                        </td>
                      </tr>
                    ) : enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No student enquiries logged.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((e) => (
                        <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-300">{e.id}</td>
                          <td className="p-4">
                            <span className="font-semibold text-white block">{e.full_name}</span>
                            <span className="text-[10px] text-slate-500 block">{e.whatsapp_number}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-300 block">{e.college_name}</span>
                            <span className="text-[10px] text-slate-500 block">{e.department}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-indigo-400 block font-semibold">{e.project_id}</span>
                            <span className="text-[10px] text-slate-500 block">Est: {e.budget_range}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              e.status === "Converted"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : e.status === "Quote Sent"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-slate-900 text-slate-400"
                            }`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setSelectedEnquiry(e);
                                setShowQuoteForm(false);
                                setCreatedQuoteUrl("");
                              }}
                              className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2 py-1 text-[10px] transition-colors"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details & Actions Panel */}
          <div className="xl:col-span-1">
            {selectedEnquiry ? (
              <div className="glass-card p-6 space-y-6">
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Dossier</span>
                    <h3 className="text-sm font-bold text-white mt-1">{selectedEnquiry.full_name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="text-xs text-slate-500 hover:text-slate-400 font-semibold"
                  >
                    Close [X]
                  </button>
                </div>

                {/* Dossier details list */}
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded">
                    <div>
                      <span className="text-[10px] text-slate-500 block">WhatsApp</span>
                      <a href={`tel:${selectedEnquiry.whatsapp_number}`} className="text-indigo-400 font-bold block">
                        📞 {selectedEnquiry.whatsapp_number}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Email</span>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-indigo-400 font-bold block truncate">
                        ✉️ {selectedEnquiry.email}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Academic Details</span>
                      <span className="text-white font-semibold">
                        {selectedEnquiry.college_name || "N/A"} • {selectedEnquiry.department || "N/A"} • {selectedEnquiry.year || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Requested Baseline Project</span>
                      <span className="text-white font-semibold">{selectedEnquiry.project_id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Preferred Technology</span>
                      <span className="text-white font-semibold">{selectedEnquiry.preferred_technology || "Any / Undecided"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Target Budget & Deadline</span>
                      <span className="text-white font-semibold">
                        {selectedEnquiry.budget_range} • Deadline: {selectedEnquiry.required_deadline}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Requirements</span>
                      <span className="text-white font-semibold">
                        Demo Needed: {selectedEnquiry.demo_video_required ? "Yes" : "No"} • Deployment: {selectedEnquiry.deployment_required ? "Yes" : "No"}
                      </span>
                    </div>
                    {selectedEnquiry.referral_code && (
                      <div>
                        <span className="text-[10px] text-slate-500 block">Referral applied</span>
                        <span className="text-emerald-400 font-bold">{selectedEnquiry.referral_code}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-slate-500 block">Message Details</span>
                      <p className="text-slate-400 p-2 bg-slate-950/30 rounded italic">{selectedEnquiry.message || "No additional message"}</p>
                    </div>
                  </div>

                  {/* Status Editor */}
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Change Pipeline Status</label>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                      className="w-full rounded bg-slate-900 border border-white/5 px-2.5 py-1.5 text-white"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Requirements Collected">Requirements Collected</option>
                      <option value="Quote Sent">Quote Sent</option>
                      <option value="Negotiating">Negotiating</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>

                  {/* Notes log */}
                  <div className="border-t border-white/5 pt-4 space-y-3">
                    <h4 className="font-bold text-white">Administrative Notes</h4>
                    {selectedEnquiry.notes.length === 0 ? (
                      <p className="text-[10px] text-slate-500">No logs filed yet.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-24 overflow-y-auto no-scrollbar">
                        {selectedEnquiry.notes.map((n, idx) => (
                          <div key={idx} className="bg-slate-900/60 p-2 rounded text-[10px] text-slate-400">
                            {n}
                          </div>
                        ))}
                      </div>
                    )}
                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <input placeholder="Enter New Note"
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}

                        className="flex-grow rounded bg-slate-950 border border-white/5 px-2.5 py-1 text-[10px] text-white"
                      />
                      <button
                        type="submit"
                        className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2 text-[10px]"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                  {/* Action triggers */}
                  {selectedEnquiry.status !== "Converted" && (
                    <div className="border-t border-white/5 pt-4 space-y-3">
                      {!showQuoteForm ? (
                        <button
                          onClick={() => {
                            setShowQuoteForm(true);
                            setCreatedQuoteUrl("");
                          }}
                          className="gradient-btn text-center block w-full py-2.5 rounded-lg font-bold text-white shadow-lg"
                        >
                          ⚖️ Build Custom Quotation
                        </button>
                      ) : (
                        <form onSubmit={handleGenerateQuote} className="space-y-3 pt-3 border-t border-white/5 bg-slate-900/40 p-4 rounded-lg">
                          <h4 className="text-[10px] font-bold text-white uppercase border-b border-white/5 pb-2">
                            Quote Cost Builder
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <label className="block text-slate-500 mb-1">Base Price (₹)</label>
                              <input placeholder="Enter Base Price"
                                type="number"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Custom Addons (₹)</label>
                              <input placeholder="Enter Custom Price"
                                type="number"
                                value={customPrice}
                                onChange={(e) => setCustomPrice(e.target.value)}
                                className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Deployment Price (₹)</label>
                              <input placeholder="Enter Deploy Price"
                                type="number"
                                value={deployPrice}
                                onChange={(e) => setDeployPrice(e.target.value)}
                                className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Doc & PPT Price (₹)</label>
                              <input placeholder="Enter Doc Price"
                                type="number"
                                value={docPrice}
                                onChange={(e) => setDocPrice(e.target.value)}
                                className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Promo Discount (₹)</label>
                              <input placeholder="Enter Discount Price"
                                type="number"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Est. Delivery</label>
                              <input placeholder="Enter Est Delivery"
                                type="text"
                                value={estDelivery}
                                onChange={(e) => setEstDelivery(e.target.value)}
                                className="w-full rounded bg-slate-950 border border-white/5 p-1 text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1">Scope description</label>
                            <textarea placeholder="Enter Scope Of Work"
                              value={scopeOfWork}
                              onChange={(e) => setScopeOfWork(e.target.value)}
                              rows={3}
                              className="w-full rounded bg-slate-950 border border-white/5 p-1.5 text-[10px] text-white"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="submit"
                              className="rounded bg-indigo-600 text-white font-bold px-3 py-1.5 text-[10px] hover:bg-indigo-500"
                            >
                              Generate Quote
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowQuoteForm(false)}
                              className="text-[10px] text-slate-500 font-semibold px-2 py-1.5"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Display Link */}
                      {createdQuoteUrl && (
                        <div className="border border-indigo-500/30 rounded-lg p-3 bg-indigo-500/5 space-y-2">
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Quote Generated & Email Dispatched!
                          </span>
                          <span className="block text-[9px] text-slate-500 select-all font-mono break-all bg-slate-950 p-2 rounded">
                            {createdQuoteUrl}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(createdQuoteUrl);
                              alert("Quotation link copied to clipboard!");
                            }}
                            className="rounded bg-white hover:bg-slate-100 text-slate-950 font-bold px-3 py-1.5 text-[10px]"
                          >
                            📋 Copy Backup Link
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 text-center text-slate-500 text-xs">
                Select an enquiry to manage details, updates, and custom quotation generation.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
