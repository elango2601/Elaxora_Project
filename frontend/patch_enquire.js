const fs = require('fs');
let code = fs.readFileSync('src/app/enquire/page.tsx', 'utf8');

// 1. Imports
code = code.replace(/import \{ onAuthStateChanged \} from "firebase\/auth";/, 'import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";');

// 2. States
const stateStr = `
  // Referral validation state
  const [refChecking, setRefChecking] = useState(false);
  const [refValData, setRefValData] = useState<{ valid: boolean; discount_percentage: number; name?: string; message?: string } | null>(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login"|"signup">("signup");
  const [authError, setAuthError] = useState("");
`;
code = code.replace(/  \/\/ Referral validation state\n  const \[refChecking, setRefChecking\] = useState\(false\);\n  const \[refValData, setRefValData\] = useState<\{ valid: boolean; discount_percentage: number; name\?: string; message\?: string \} \| null>\(null\);/, stateStr);

// 3 & 4. Submit logic
const oldHandleSubmit = `  // Submit Enquiry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    // Basic Validations
    if (!fullName.trim() || !email.trim() || !whatsapp.trim() || !college.trim() || !deadline) {
      setErrorMsg("Please fill in all required fields marked with *");
      setIsSubmitting(false);
      return;
    }

    try {
      // Generate random Enquiry ID instead of exposing collection count
      const randomCount = Math.floor(1000 + Math.random() * 9000);
      const enqShortId = \`PF-ENQ-\${randomCount}\`;`;

const newSubmitLogic = `  // Auth Submission handler
  const handleAuthAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, email, authPassword);
      }
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
      const enqShortId = \`PF-ENQ-\${randomCount}\`;`;

code = code.replace(oldHandleSubmit, newSubmitLogic);

// 5. Auth Modal JSX
const modalJSX = `
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(/        <\/form>\n      <\/div>\n    <\/div>\n  \);\n\}/, modalJSX);

fs.writeFileSync('src/app/enquire/page.tsx', code);
console.log("Enquire page updated");
