"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/components/karto/store";
import { validateEmail } from "@/lib/format";
import { analytics } from "@/lib/analytics";

type Mode = "login" | "signup" | "forgot";

export function AuthModal() {
  const open = useStore((s) => s.authOpen);
  const setOpen = useStore((s) => s.setAuthOpen);
  const login = useStore((s) => s.login);
  const signup = useStore((s) => s.signup);
  const loginWithCredentials = useStore((s) => s.loginWithCredentials);
  const signupWithCredentials = useStore((s) => s.signupWithCredentials);
  const [mode, setMode] = useState<Mode>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      if (!validateEmail(form.email)) { toast.error("Enter a valid email"); return; }
      toast.success("Reset link sent", { description: "Check your inbox for password reset instructions." });
      setMode("login");
      return;
    }
    if (!validateEmail(form.email)) { toast.error("Enter a valid email"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (mode === "signup" && !form.name.trim()) { toast.error("Please enter your name"); return; }

    setLoading(true);
    if (mode === "login") {
      const ok = await loginWithCredentials(form.email, form.password);
      setLoading(false);
      if (ok) {
        analytics.login();
        toast.success("Welcome back! 👋", { description: "Logged in successfully." });
        setOpen(false);
        setForm({ name: "", email: "", phone: "", password: "" });
      } else {
        toast.error("Login failed", { description: "Invalid email or password. Please try again." });
      }
    } else {
      const ok = await signupWithCredentials({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      setLoading(false);
      if (ok) {
        analytics.signup();
        toast.success("Account created! 🎉", { description: "Welcome to Karto." });
        setOpen(false);
        setForm({ name: "", email: "", phone: "", password: "" });
      } else {
        toast.error("Signup failed", { description: "An account with this email may already exist." });
      }
    }
  };

  const google = () => {
    setLoading(true);
    // Simulated Google login (would use NextAuth/Firebase in production)
    setTimeout(() => {
      login({ name: "Riya Patel", email: "riya.patel@gmail.com" });
      analytics.login();
      toast.success("Signed in with Google", { description: "Welcome, Riya!" });
      setLoading(false);
      setOpen(false);
    }, 700);
  };

  const titles = { login: "Welcome back", signup: "Create your account", forgot: "Reset password" };
  const subs = {
    login: "Login to track orders, save addresses & checkout faster.",
    signup: "Join Karto for lightning-fast grocery delivery.",
    forgot: "We'll send a reset link to your email.",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-background shadow-2xl"
          >
            {/* brand header */}
            <div className="relative bg-gradient-to-br from-karto-green to-emerald-600 p-6 text-white">
              <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-black">K</span>
                <span className="text-xl font-black">Karto</span>
              </div>
              <h2 className="mt-4 text-2xl font-black">{titles[mode]}</h2>
              <p className="mt-1 text-sm text-white/90">{subs[mode]}</p>
            </div>

            <div className="p-6">
              {mode !== "login" && (
                <button onClick={() => setMode("login")} className="mb-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                </button>
              )}

              <form onSubmit={submit} className="space-y-3">
                {mode === "signup" && (
                  <Field icon={<User className="h-4 w-4" />} label="Full name">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Riya Patel" className="w-full bg-transparent text-sm outline-none" />
                  </Field>
                )}
                <Field icon={<Mail className="h-4 w-4" />} label="Email address">
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none" />
                </Field>
                {mode === "signup" && (
                  <Field icon={<User className="h-4 w-4" />} label="Phone number">
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="98765 43210" className="w-full bg-transparent text-sm outline-none" />
                  </Field>
                )}
                {mode !== "forgot" && (
                  <Field icon={<Lock className="h-4 w-4" />} label="Password">
                    <input type={showPwd ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-muted-foreground hover:text-foreground">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </Field>
                )}

                {mode === "login" && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setMode("forgot")} className="text-xs font-semibold text-karto-green hover:underline">Forgot password?</button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-karto-green py-3 text-sm font-bold text-white transition hover:bg-karto-green/90 disabled:opacity-60"
                >
                  {loading ? "Please wait..." : mode === "login" ? "Login" : mode === "signup" ? "Create account" : "Send reset link"}
                </button>
              </form>

              {mode !== "forgot" && (
                <>
                  <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
                  </div>
                  <button
                    onClick={google}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold transition hover:bg-muted disabled:opacity-60"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                </>
              )}

              {mode !== "forgot" && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {mode === "login" ? "New to Karto? " : "Already have an account? "}
                  <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-bold text-karto-green hover:underline">
                    {mode === "login" ? "Create an account" : "Login"}
                  </button>
                </p>
              )}
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Demo only — no real credentials are stored. This simulates Firebase Auth.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition focus-within:border-karto-green">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
