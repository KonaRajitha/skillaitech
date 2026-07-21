import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { submitSignupToGoogleForm } from "@/lib/gform";
import { toast } from "sonner";
import { Loader2, Mail, Phone, ArrowLeft } from "lucide-react";
import mascotAsset from "@/assets/skill-mascot.png.asset.json";
import { ThemeToggle } from "@/components/ThemeToggle";

const mascotImg = mascotAsset.url;

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  head: () => ({
    meta: [
      { title: "Sign in · Skill.Ai" },
      { name: "description", content: "Sign in or create your Skill.Ai account and start your journey from profile to placement." },
    ],
  }),
  component: AuthPage,
});

function safeNext(next: string): string {
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

type Mode = "signin" | "signup";
type Channel = "email" | "phone";
type Step = "form" | "otp";

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const nextPath = safeNext(next);
  const [mode, setMode] = useState<Mode>("signin");
  const [channel, setChannel] = useState<Channel>("email");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.assign(nextPath);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) window.location.assign(nextPath);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, nextPath]);

  // --- SIGN IN (password) ---
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (channel === "email") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ phone, password });
        if (error) throw error;
      }
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  // --- SIGN UP: send verification code ---
  async function handleSignUpSend(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Please enter your full name");
    if (!phone.trim() || !email.trim()) return toast.error("Email and phone are both required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      if (channel === "email") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
            emailRedirectTo: `${window.location.origin}${nextPath}`,
          },
        });
        if (error) throw error;
        toast.success("We sent a 6-digit code to your email.");
      } else {
        const { error } = await supabase.auth.signUp({
          phone,
          password,
          options: { data: { full_name: fullName, email } },
        });
        if (error) throw error;
        toast.success("We sent a 6-digit code to your phone.");
      }
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setLoading(false);
    }
  }

  // --- Verify OTP → store in Google Form ---
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } =
        channel === "email"
          ? await supabase.auth.verifyOtp({ email, token: otp, type: "signup" })
          : await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (error) throw error;
      // Store student data in Google Form (fire-and-forget)
      submitSignupToGoogleForm({ fullName, phone, email, password });
      toast.success("Account verified! Welcome to Skill.Ai");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) { toast.error(result.error.message || "Google sign-in failed"); setLoading(false); return; }
      if (result.redirected) return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-hero opacity-90" />
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <header className="relative z-10 px-6 h-16 flex items-center justify-between border-b border-border/50 backdrop-blur-xl bg-background/60">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={mascotImg} alt="Skill.Ai" className="h-8 w-8" />
          <span className="font-display font-semibold text-lg tracking-tight">
            Skill<span className="text-muted-foreground">.Ai</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-elegant p-8">
            <div className="text-center mb-6">
              <img src={mascotImg} alt="" className="h-14 w-14 mx-auto mb-3 drop-shadow-lg" />
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                {mode === "signin" ? "Welcome back" : step === "otp" ? "Verify your code" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "signin"
                  ? "Sign in to continue your journey."
                  : step === "otp"
                    ? `Enter the 6-digit code we sent to your ${channel === "email" ? "email" : "phone"}.`
                    : "Start your journey from profile to placement."}
              </p>
            </div>

            {step === "form" && (
              <>
                <div className="grid grid-cols-2 rounded-full bg-muted p-1 mb-5 text-sm">
                  {(["signin", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMode(m); setStep("form"); }}
                      className={`py-2 rounded-full font-medium transition ${mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      {m === "signin" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted transition py-2.5 text-sm font-medium disabled:opacity-50"
                >
                  <GoogleIcon /> Continue with Google
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  {(["email", "phone"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setChannel(c)}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border transition ${channel === c ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
                    >
                      {c === "email" ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                      {c === "email" ? "Email" : "Phone"}
                    </button>
                  ))}
                </div>

                {mode === "signup" ? (
                  <form onSubmit={handleSignUpSend} className="space-y-3">
                    <Field label="Full name" type="text" value={fullName} onChange={setFullName} placeholder="Ada Lovelace" required />
                    <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
                    <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+91 98765 43210" required />
                    <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" required minLength={6} />
                    <p className="text-[11px] text-muted-foreground -mt-1">
                      We'll send a 6-digit code to your {channel === "email" ? "email" : "phone"} to verify it's you.
                    </p>
                    <SubmitButton loading={loading}>Send verification code</SubmitButton>
                  </form>
                ) : (
                  <form onSubmit={handleSignIn} className="space-y-3">
                    {channel === "email" ? (
                      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
                    ) : (
                      <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+91 98765 43210" required />
                    )}
                    <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" required />
                    <SubmitButton loading={loading}>Sign in</SubmitButton>
                  </form>
                )}
              </>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerify} className="space-y-3">
                <Field label="Verification code" type="text" value={otp} onChange={setOtp} placeholder="6-digit code" required />
                <SubmitButton loading={loading}>Verify &amp; create account</SubmitButton>
                <button type="button" onClick={() => setStep("form")} className="text-xs text-muted-foreground hover:text-foreground w-full text-center">
                  Edit details
                </button>
              </form>
            )}

            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing you agree to Skill.Ai's Terms &amp; Privacy Policy.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Field(props: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{props.label}</span>
      <input
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
        minLength={props.minLength}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition"
      />
    </label>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
