"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, query, where, serverTimestamp, increment, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

interface ProjectOption {
  slug: string;
  title: string;
}

const fallbackProjectOptions: ProjectOption[] = [
  { slug: "ai-resume-analyzer", title: "AI Resume Analyzer" },
  { slug: "smart-lost-found", title: "Smart Lost & Found" },
  { slug: "student-performance-prediction", title: "Student Performance Prediction" },
  { slug: "custom", title: "-- Build Custom Project Idea --" }
];

function EnquiryFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedProject = searchParams.get("project") || "";

  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>(fallbackProjectOptions);
  
  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [year, setYear] = useState("4th Year");
  const [projectSelected, setProjectSelected] = useState(preselectedProject || "custom");
  const [prefTech, setPrefTech] = useState("");
  const [budget, setBudget] = useState("₹2,000–₹5,000");
  const [deadline, setDeadline] = useState("");
  const [deploymentRequired, setDeploymentRequired] = useState(false);
  const [demoRequired, setDemoRequired] = useState(false);
  const [addRequirements, setAddRequirements] = useState("");
  const [referral, setReferral] = useState("");
  const [message, setMessage] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  

  // Referral validation state
  const [refChecking, setRefChecking] = useState(false);
  const [refValData, setRefValData] = useState<{ valid: boolean; discount_percentage: number; name?: string; message?: string } | null>(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login"|"signup">("signup");
  const [authError, setAuthError] = useState("");


  // Fetch project options from API
  useEffect(() => {
    async function loadProjectOptions() {
      try {
        const q = query(collection(db, "projects"), where("active", "==", true));
        const querySnapshot = await getDocs(q);
        const options = querySnapshot.docs.map((d) => {
          const data = { id: d.id, ...d.data() };
          return { slug: data.id, title: (data as any).title };
        });
        if (options.length > 0) setProjectOptions([...options, { slug: "custom", title: "-- Build Custom Project Idea --" }]);
      } catch (e) {
        console.error("Failed to load project options");
      }
    }
    loadProjectOptions();
  }, []);

  // Client-side authentication observation (Optional: auto-fill user data)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pre-fill user data if they happen to be logged in
        if (user.email) setEmail(user.email);
        if (user.displayName) setFullName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  // Pre-select if query string changes
  useEffect(() => {
    if (preselectedProject) {
      setProjectSelected(preselectedProject);
    }
  }, [preselectedProject]);

  // Validate Referral Code API
  const handleVerifyReferral = async () => {
    if (!referral.trim()) return;
    setRefChecking(true);
    setRefValData(null);
    try {
      const codeUpper = referral.trim().toUpperCase();
      const q = query(collection(db, "referrals"), where("code", "==", codeUpper), where("active", "==", true));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const refDoc = querySnapshot.docs[0];
        const data = { id: refDoc.id, ...refDoc.data() } as any;
        
        // Increment total clicks
        await updateDoc(refDoc.ref, {
          total_clicks: increment(1)
        });

        setRefValData({
          valid: true,
          discount_percentage: data.discount_percentage,
          name: data.name || data.code,
          message: "Valid"
        });
      } else {
        setRefValData({ valid: false, discount_percentage: 0, message: "Verification failed." });
      }
    } catch (err) {
      setRefValData({ valid: false, discount_percentage: 0, message: "Referral validation failed." });
    } finally {
      setRefChecking(false);
    }
  };

  // Auth Submission handler
  
  const handleGoogleAuthAndSubmit = async () => {
    setAuthError("");
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      document.cookie = `student_token=${await userCredential.user.getIdToken()}; path=/; max-age=31536000`;
      
      // Also prefill email and name from Google just in case they were empty
      if (userCredential.user.email) setEmail(userCredential.user.email);
      if (userCredential.user.displayName) setFullName(userCredential.user.displayName);

      setShowAuthModal(false);
      await submitToFirestore();
    } catch (err: any) {
      setAuthError(err.message || "Google Authentication failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAuthAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      let userCredential;
      if (authMode === "signup") {
        userCredential = await createUserWithEmailAndPassword(auth, email, authPassword);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, authPassword);
      }
      document.cookie = `student_token=${await userCredential.user.getIdToken()}; path=/; max-age=31536000`;
      setShowAuthModal(false);
      await submitToFirestore();
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Pre-Submit validation & Trigger Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic Validations
    if (!fullName.trim() || !email.trim() || !whatsapp.trim() || !college.trim() || !deadline) {
      setErrorMsg("Please fill in all required fields marked with *");
      return;
    }

    if (!auth.currentUser) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    await submitToFirestore();
  };

  const submitToFirestore = async () => {
    try {
      // Generate random Enquiry ID instead of exposing collection count
      const randomCount = Math.floor(1000 + Math.random() * 9000);
      const enqShortId = `PF-ENQ-${randomCount}`;

      let refCode = refValData?.valid ? referral.trim().toUpperCase() : "";

      if (refCode) {
        const q = query(collection(db, "referrals"), where("code", "==", refCode), where("active", "==", true));
        const qs = await getDocs(q);
        if (!qs.empty) {
          await updateDoc(qs.docs[0].ref, {
            total_enquiries: increment(1),
            total_clicks: increment(1)
          });
        } else {
          refCode = "";
        }
      }

      const payload = {
        id: enqShortId,
        full_name: fullName,
        email: email,
        whatsapp_number: whatsapp,
        college_name: college,
        department: department,
        year: year,
        project_id: projectSelected,
        preferred_technology: prefTech || "Python/JS",
        budget_range: budget,
        required_deadline: deadline,
        deployment_required: deploymentRequired,
        demo_video_required: demoRequired,
        additional_requirements: addRequirements,
        referral_code: refCode,
        message: message || `Enquiry for ${projectSelected} project template.`,
        status: "New",
        notes: [],
        created_at: serverTimestamp()
      };

      await setDoc(doc(db, "enquiries", enqShortId), payload);

      // Fire & Forget: Send Enquiry Notification Email
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ENQUIRY',
          to: email,
          data: {
            name: fullName,
            enqShortId: enqShortId
          }
        })
      }).catch(err => console.error("Email send failed:", err));

      setSuccessData({ id: enqShortId });
      // Redirect to dashboard after successful submission
      router.push("/student/dashboard");
    } catch (err) {
      setErrorMsg("Network error. Unable to submit enquiry to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-8">
        <div className="text-6xl">🎉</div>
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-white">Enquiry Submitted Successfully</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Thank you. We have recorded your parameters. We will review your project requirements and generate a customized quotation link shortly.
          </p>
        </div>
        <div className="glass-card p-6 max-w-md mx-auto">
          <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider mb-1">
            Your unique enquiry ID
          </span>
          <span className="text-2xl font-black text-indigo-400 select-all tracking-wider">
            {successData.id}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={`https://wa.me/916374578233?text=Hi%20Elaxora Solutions,%20I've%20submitted%20an%20enquiry%20with%20ID%20${successData.id}.%20Please%20review%20my%20requirements.`}
            target="_blank"
            rel="noreferrer"
            className="gradient-btn px-6 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg"
          >
            💬 Chat on WhatsApp
          </a>
          <Link
            href="/projects"
            className="px-6 py-3.5 rounded-xl text-slate-300 border border-white/10 hover:bg-white/5 text-sm font-semibold transition-all"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Get a Custom Project Quote
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Submit your requirements and academic parameters. No credit card required.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400 font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Section 1: Student Profile */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">
              1. Student Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Full Name *
                </label>
                <input placeholder="Enter Full Name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}

                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input placeholder="Enter Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  WhatsApp Number *
                </label>
                <input placeholder="Enter Mobile Number"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}

                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  College Name *
                </label>
                <input placeholder="Enter College"
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}

                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="AI & DS">AI & DS</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="BBA">BBA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Academic Year *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Post-Graduate">Post-Graduate (PG)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Project Specifications */}
          <div className="border-t border-white/5 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">
              2. Project Scope
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Select Project Baseline template *
                </label>
                <select
                  value={projectSelected}
                  onChange={(e) => setProjectSelected(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  {projectOptions.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>{opt.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Preferred Technologies / Stack
                </label>
                <input placeholder="Enter Preferred Technology"
                  type="text"
                  value={prefTech}
                  onChange={(e) => setPrefTech(e.target.value)}

                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Submission Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Estimated Budget Bracket *
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Under ₹2,000">Under ₹2,000</option>
                  <option value="₹2,000–₹5,000">₹2,000–₹5,000</option>
                  <option value="₹5,000–₹10,000">₹5,000–₹10,000</option>
                  <option value="₹10,000+">₹10,000+</option>
                </select>
              </div>

              {/* Addons checks */}
              <div className="flex flex-col justify-center space-y-3">
                <label className="flex items-center text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deploymentRequired}
                    onChange={(e) => setDeploymentRequired(e.target.checked)}
                    className="rounded border-white/5 bg-slate-900 text-indigo-600 focus:ring-0 mr-2 h-4 w-4"
                  />
                  Live cloud deployment required
                </label>
                <label className="flex items-center text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={demoRequired}
                    onChange={(e) => setDemoRequired(e.target.checked)}
                    className="rounded border-white/5 bg-slate-900 text-indigo-600 focus:ring-0 mr-2 h-4 w-4"
                  />
                  Recorded walk-through demo video required
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Custom Customization Rules / Syllabus Guidelines
                </label>
                <textarea placeholder="Enter Add Requirements"
                  value={addRequirements}
                  onChange={(e) => setAddRequirements(e.target.value)}

                  rows={3}
                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Referrals & Submit */}
          <div className="border-t border-white/5 pt-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">
              3. Codes & Finalization
            </h3>
            
            {/* Referral field */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Referral / Influencer Promo Code
                </label>
                <input placeholder="Enter Referral"
                  type="text"
                  value={referral}
                  onChange={(e) => {
                    setReferral(e.target.value);
                    setRefValData(null); // Reset validation data on change
                  }}

                  className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyReferral}
                disabled={refChecking || !referral.trim()}
                className="w-full rounded-lg border border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400 py-2.5 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refChecking ? "Verifying..." : "Verify Code"}
              </button>
              
              {/* Validation Feedback */}
              {refValData && (
                <div className="sm:col-span-3">
                  {refValData.valid ? (
                    <span className="text-xs text-emerald-400 font-semibold block">
                      ✓ Promo valid! {refValData.name} ({refValData.discount_percentage}% discount applied).
                    </span>
                  ) : (
                    <span className="text-xs text-rose-400 font-semibold block">
                      ✗ Invalid promo code.
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Remarks / Personal Message
              </label>
              <textarea placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}

                rows={2}
                className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="gradient-btn text-center block w-full py-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-wait"
              >
                {isSubmitting ? "Submitting requirements..." : "Submit Enquiry & Request Quote"}
              </button>
            </div>
          </div>

        </form>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-white/10">
            <button 
              onClick={() => { setShowAuthModal(false); setIsSubmitting(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Create an Account to Track Your Project</h2>
              <p className="text-xs text-slate-400">
                To track your enquiry, view quotes, and access your project portal, please {authMode === "signup" ? "set a password" : "login"}.
              </p>
            </div>
            
            <form onSubmit={handleAuthAndSubmit} className="space-y-4">
              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {authError}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-900/50 border border-card-border rounded-lg px-4 py-2 text-sm text-slate-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">We'll use the email from your enquiry.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-card-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder={authMode === "signup" ? "Create a strong password" : "Enter your password"}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="gradient-btn w-full py-3 rounded-lg text-sm font-bold text-white shadow-lg mt-2 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : (authMode === "signup" ? "Sign Up & Submit Enquiry" : "Login & Submit Enquiry")}
              </button>
              
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {authMode === "signup" ? "Already have an account? Log in." : "New customer? Create an account."}
                </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-xs">Or continue with</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
              <button
                type="button"
                onClick={handleGoogleAuthAndSubmit}
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-white text-slate-900 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EnquiryForm() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading form parameters...</div>}>
      <EnquiryFormContent />
    </Suspense>
  );
}
