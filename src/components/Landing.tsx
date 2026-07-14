import { motion } from "motion/react";
import { ArrowRight, Sparkles, Brain, Target, Zap, BookOpen, MessageSquare, Trophy, Github, Twitter, Linkedin, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import mascotAsset from "@/assets/skill-mascot.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

import { IntroOverlay } from "./IntroOverlay";
const mascotImg = mascotAsset.url;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Landing() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <IntroOverlay />
      {/* NAV */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 inset-x-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <img src={mascotImg} alt="Skill.Ai" className="h-8 w-8 rounded-lg shadow-glow" />
            <span className="font-display font-semibold text-lg tracking-tight">Skill<span className="text-muted-foreground">.Ai</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            {email ? (
              <>
                <span className="hidden sm:inline text-xs text-muted-foreground max-w-[160px] truncate">{email}</span>
                <button
                  onClick={async () => { await supabase.auth.signOut(); }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition">Sign in</Link>
                <Link to="/auth" className="group inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition">
                  Get started
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* HERO */}
      <section className="relative pt-40 pb-32 bg-hero">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-3.5 py-1.5 text-xs text-muted-foreground mb-8"
          >
            <Sparkles className="h-3 w-3" />
            Meet Ai — your personal prep companion
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[0.95]"
          >
            Master any skill.
            <br />
            <span className="text-gradient">Powered by Ai.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Interview prep, coding drills, aptitude, resume — all in one intelligent workspace.
            Practice smarter, learn faster, and land the role you deserve.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition shadow-glow">
              Start practicing free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-card/70 transition">
              Watch demo
            </button>
          </motion.div>

          {/* ROBOT SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 relative mx-auto max-w-3xl"
          >
            <div className="relative pt-8">
              {/* glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-white/15 blur-3xl animate-pulse-glow" />
              {/* orbit rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none"
              >
                <div className="absolute inset-0 rounded-full border border-border/40" />
                <div className="absolute inset-10 rounded-full border border-border/60" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto w-[320px] sm:w-[420px]"
              >
                <motion.img
                  src={mascotImg}
                  alt="Skill.Ai robot waving hello"
                  className="w-full select-none pointer-events-none"
                  style={{
                    filter: "drop-shadow(0 40px 60px rgba(255,255,255,0.15)) drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
                    transformOrigin: "70% 70%",
                  }}
                  animate={{ rotate: [0, -8, 6, -8, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                  draggable={false}
                />
              </motion.div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute left-2 sm:left-10 top-10 rounded-2xl border border-border bg-background/80 backdrop-blur px-3 py-2 text-xs flex items-center gap-2 shadow-glow"
              >
                <Brain className="h-3.5 w-3.5" />
                <span>Adaptive learning</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.15 }}
                className="absolute right-2 sm:right-10 top-20 rounded-2xl border border-border bg-background/80 backdrop-blur px-3 py-2 text-xs flex items-center gap-2 shadow-glow"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Instant feedback</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-2 rounded-2xl border border-border bg-background/80 backdrop-blur px-3 py-2 text-xs flex items-center gap-2 shadow-glow"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Track your streak — day 12</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <section className="border-y border-border py-10 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Trusted by learners preparing for</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 shrink-0 text-2xl font-display font-medium text-muted-foreground">
                <span>Google</span><span>Amazon</span><span>Microsoft</span><span>Meta</span><span>Netflix</span><span>Apple</span><span>Stripe</span><span>Tesla</span><span>Uber</span><span>Airbnb</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="max-w-2xl mb-16"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Features</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Everything you need to <span className="text-gradient">outperform.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border bg-card/40 p-7 hover:bg-card/70 hover:border-border/80 transition overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-5">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-32 border-t border-border relative">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">How it works</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              Three steps to <span className="text-gradient">mastery.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative rounded-2xl border border-border bg-card/50 p-8"
              >
                <div className="text-6xl font-display font-semibold text-gradient opacity-40 mb-4">0{i + 1}</div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-32 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto px-6"
        >
          <div className="relative rounded-3xl border border-border bg-card/60 p-12 sm:p-16 text-center overflow-hidden shadow-elegant">
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-glow" />
            <div className="relative">
              <img src={mascotImg} alt="" className="mx-auto h-16 w-16 rounded-2xl shadow-glow mb-6 animate-float" />
              <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
                Ready to level up?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join thousands of learners building sharper skills with Skill.Ai. Start free — no card required.
              </p>
              <button className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition shadow-glow">
                Get started free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer id="faq" className="border-t border-border py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2.5">
            <img src={mascotImg} alt="Skill.Ai" className="h-8 w-8" />
            <span className="font-display font-semibold text-lg tracking-tight">Skill<span className="text-muted-foreground">.Ai</span></span>
          </a>
          <p className="text-xs text-muted-foreground">© 2026 Skill.Ai — Practice smarter. Learn faster.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground transition"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground transition"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  { icon: Brain, title: "Adaptive Ai tutor", desc: "Ai analyzes your gaps and generates drills tuned to your level in real time." },
  { icon: MessageSquare, title: "Mock interviews", desc: "Voice-driven mock interviews with instant transcript, scoring, and coaching notes." },
  { icon: Target, title: "Aptitude & DSA", desc: "Curated question banks with topic-wise progress, timers, and explanations." },
  { icon: BookOpen, title: "Resume review", desc: "Ai-powered resume feedback with role-specific rewrites and ATS scoring." },
  { icon: Zap, title: "Daily challenges", desc: "Short, focused challenges to keep momentum. Streaks that actually stick." },
  { icon: Trophy, title: "Skill portfolio", desc: "Build a public profile of verified skills recruiters can browse." },
];

const steps = [
  { title: "Tell Ai your goal", desc: "Share the role, company, or exam you're preparing for. Ai builds your plan." },
  { title: "Practice daily", desc: "Bite-sized drills, mock interviews, and challenges — refined to your pace." },
  { title: "Ship with confidence", desc: "Track measurable progress, review weak spots, and walk in prepared." },
];
