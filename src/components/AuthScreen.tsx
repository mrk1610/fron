import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Sparkles, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/?reset=1`,
        });
        if (resetError) throw resetError;
        setInfo("Password reset link sent! Check your email inbox.");
      } else if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setInfo("Account created! Check your email and click the confirmation link to activate your account.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("Incorrect email or password. If you signed up with Google, use the 'Sign in with Google' button below.");
          }
          throw signInError;
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) {
      setError(oauthError.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-8 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-40"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-20"></div>

        <div className="relative text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Resume Studio</h2>
          <p className="text-slate-400 text-xs mt-1.5 max-w-xs mx-auto">
            {isForgotPassword
              ? "Enter your email and we'll send you a password reset link."
              : "Design professional ATS-friendly resumes adjusted beautifully with Gemini AI."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 mb-5">
            {error}
          </div>
        )}
        {info && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg p-3 mb-5">
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-slate-200 text-sm px-4 py-2.5 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-slate-200 text-sm pl-10 pr-4 py-2.5 transition"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(""); setInfo(""); setShowPassword(false); }}
                    className="text-indigo-400 text-xs hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-slate-200 text-sm pl-10 pr-10 py-2.5 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/40 text-white font-medium text-sm py-2.5 rounded-xl transition shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                {isForgotPassword ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {isForgotPassword && (
            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setError(""); setInfo(""); setShowPassword(false); }}
              className="w-full text-slate-400 text-xs hover:text-slate-200 transition cursor-pointer text-center"
            >
              ← Back to Sign In
            </button>
          )}
        </form>

        {!isForgotPassword && (
          <>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800/80"></div>
              </div>
              <span className="relative bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-widest font-medium">Or continue with</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer hover:border-slate-700"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.61 14.94 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.27 7.58 8.9 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.46h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.97 3.39-4.87 3.39-8.5z" />
                <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3l-3.86-3C.54 8.74 0 10.31 0 12c0 1.69.54 3.26 1.5 5.1l3.86-3c0-.3-.0-.6-.0-.8z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.95-2.93l-3.66-2.84c-1 .67-2.28 1.07-3.66 1.07-3.1 0-5.73-2.54-6.64-5.46l-3.86 3C3.39 20.35 7.35 23 12 23z" />
              </svg>
              Sign in with Google
            </button>
          </>
        )}

        <div className="mt-6 text-center text-xs">
          <span className="text-slate-500">
            {isSignUp ? "Already have an account? " : "New to the Studio? "}
          </span>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setIsForgotPassword(false); setError(""); setInfo(""); setShowPassword(false); }}
            className="text-indigo-400 font-semibold hover:underline"
          >
            {isSignUp ? "Sign In" : "Create Account"}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          Secured by Supabase Auth
        </div>
      </div>
    </div>
  );
}
