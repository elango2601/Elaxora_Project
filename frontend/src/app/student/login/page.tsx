"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FadeInUp } from "@/components/AnimatedSection";

function StudentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/student/dashboard";
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [stateLocation, setStateLocation] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push(redirectUrl);
      }
    });

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem('emailForSignIn');
      if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please provide your email for confirmation');
      }
      
      if (emailForSignIn) {
        setLoading(true);
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(async (result) => {
            window.localStorage.removeItem('emailForSignIn');
            await handleAuthSuccess(result);
          })
          .catch((error) => {
            setError(error.message || "Failed to sign in with link.");
            setLoading(false);
          });
      }
    }
    return () => unsubscribe();
  }, [router, redirectUrl]);

  const handleAuthSuccess = async (userCredential: any) => {
    document.cookie = `student_token=${await userCredential.user.getIdToken()}; path=/; max-age=604800`;
    router.push(redirectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (!mobileNumber || !stateLocation) {
          throw new Error("Please fill in all required fields.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save additional user info to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          mobile_number: mobileNumber,
          state: stateLocation,
          created_at: new Date().toISOString()
        });

        // Fire & Forget: Send Welcome Email
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'WELCOME',
            to: email,
            data: {}
          })
        }).catch(err => console.error("Email send failed:", err));

        await handleAuthSuccess(userCredential);
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSuccess(userCredential);
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new OAuthProvider('apple.com');
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSuccess(userCredential);
    } catch (err: any) {
      setError(err.message || "Apple Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeInUp className="min-h-screen bg-background flex relative isolate">
      {/* Left Column - Branding/Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-24 h-full">
          <div className="mb-8">
            <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 rounded-full backdrop-blur-md">Elaxora Student Portal</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
            Your Project.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x">Fully Realized.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-md">
            Track your custom project milestones in real-time, communicate directly with our engineers, and manage your scope securely.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800" />
              ))}
            </div>
            <span>Join 500+ students building with us</span>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 py-12 xl:px-24 relative">
        <div className="absolute top-[20%] right-[0%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-slate-400">
              {isLogin ? "Enter your credentials to access your dashboard." : "Sign up to track your requested project."}
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none" />
            
            {error && (
              <div className="mb-6 rounded-lg bg-red-500/10 p-4 border border-red-500/20 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-8 relative z-10">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-white/10 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] bg-slate-800/80 text-white text-sm font-semibold hover:bg-slate-700 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative mb-8 z-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900/80 px-4 text-slate-500 font-medium backdrop-blur-md rounded-full">Or continue with email</span>
              </div>
            </div>

            <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email address
                </label>
                <input placeholder="Enter Email"
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300"

                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!email) {
                          setError("Please enter your email address first.");
                          return;
                        }
                        try {
                          await sendPasswordResetEmail(auth, email);
                          setError("");
                          alert("Password reset email sent! Check your inbox.");
                        } catch (err: any) {
                          setError(err.message || "Failed to send reset email.");
                        }
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input placeholder="Enter Password"
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300"

                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Re-enter Password
                    </label>
                    <input placeholder="Enter Confirm Password"
                      id="confirmPassword"
                      type="password"
                      required={!isLogin}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300"

                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Mobile Number
                    </label>
                    <input placeholder="Enter Mobile Number"
                      id="mobile"
                      type="tel"
                      required={!isLogin}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300"

                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-1.5">
                      State / Region
                    </label>
                    <input placeholder="Enter State"
                      id="state"
                      type="text"
                      required={!isLogin}
                      value={stateLocation}
                      onChange={(e) => setStateLocation(e.target.value)}
                      className="block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all duration-300"

                    />
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-xl overflow-hidden py-3 px-4 text-sm font-bold text-slate-900 bg-white shadow-[0_0_40px_rgba(255,255,255,0.2)] focus:outline-none disabled:opacity-50 transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : isLogin ? "Sign In" : "Create Account"}
                  </span>
                </button>

                {isLogin && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        setError("Please enter your email to send a magic link.");
                        return;
                      }
                      setLoading(true);
                      const actionCodeSettings = {
                        url: window.location.origin + '/student/login',
                        handleCodeInApp: true,
                      };
                      try {
                        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
                        window.localStorage.setItem('emailForSignIn', email);
                        setError("");
                        alert("Magic link sent! Check your inbox to sign in securely.");
                      } catch (err: any) {
                        setError(err.message || "Failed to send magic link.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="mt-3 flex w-full justify-center rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm font-semibold text-slate-300 shadow-sm focus:outline-none hover:bg-white/10 hover:text-white transition-all duration-300 disabled:opacity-50 backdrop-blur-md"
                  >
                    Email me a magic link instead
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center relative z-10">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </FadeInUp>
  );
}

export default function StudentLogin() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-white">Loading...</div>}>
      <StudentLoginForm />
    </Suspense>
  );
}
