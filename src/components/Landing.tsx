import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight, Sparkles, Brain, Target, Zap, BookOpen, MessageSquare, Trophy,
  Github, Twitter, Linkedin, LogOut, UserRound, FileText, Search, Briefcase, Award, Rocket, Plane,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import mascotAsset from "@/assets/skill-mascot.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "./ThemeToggle";
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
            <img src={mascotImg} alt="Skill.Ai" className="h-8 w-8" />
            <span className="font-display font-semibold text-lg tracking-tight">
              Skill<span className="text-muted-foreground">.Ai</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#journey" className="hover:text-foreground transition">Your journey</a>
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {email ? (
              <>
                <span className="hidden sm:inline text-xs text-muted-foreground max-w-[140px] truncate">{email}</span>
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
      <section id="about" className="relative pt-40 pb-32 bg-hero">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-3.5 py-1.5 text-xs text-muted-foreground mb-8">
            <Sparkles className="h-3 w-3" /> Hi, I'm your assistant — not just AI
          </motion.div>

          <motion.h1 initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[0.95]">
            From your first profile
            <br />
            <span className="text-gradient">to your first offer.</span>
          </motion.h1>

          <motion.p initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.2 }}
            className="mt-7 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Skill.Ai is a career co-pilot built for students. I set up your profile, check your skills,
            polish your resume, run mock interviews, spot gaps, match you with jobs, and walk you to hire day —
            all in one place.
          </motion.p>

          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth" className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition shadow-glow">
              Start free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#journey" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-card/70 transition">
              See the roadmap
            </a>
          </motion.div>

          {/* Robot showcase */}
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 relative mx-auto max-w-3xl">
            <div className="relative pt-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-foreground/10 blur-3xl animate-pulse-glow" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none">
                <div className="absolute inset-0 rounded-full border border-border/40" />
                <div className="absolute inset-10 rounded-full border border-border/60" />
              </motion.div>
              <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative mx-auto w-[320px] sm:w-[420px]">
                <motion.img
                  src={mascotImg} alt="Skill.Ai robot waving hello"
                  className="w-full select-none pointer-events-none"
                  style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.35))", transformOrigin: "70% 70%" }}
                  animate={{ rotate: [0, -8, 6, -8, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                  draggable={false}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROADMAP */}
      <RoadmapSection />

      {/* FEATURES */}
      <section id="features" className="py-32 relative border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="max-w-2xl mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">What I do for you</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              A full career kit — <span className="text-gradient">in one assistant.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border bg-card/40 p-7 hover:bg-card/70 hover:border-border/80 transition overflow-hidden">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-foreground/5 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />
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

      {/* CTA */}
      <section className="py-32 border-t border-border">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl border border-border bg-card/60 p-12 sm:p-16 text-center overflow-hidden shadow-elegant">
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-foreground/10 blur-3xl animate-pulse-glow" />
            <div className="relative">
              <img src={mascotImg} alt="" className="mx-auto h-16 w-16 mb-6 animate-float" />
              <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
                Your first offer starts today.
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Create your profile in under a minute. I'll take it from there.
              </p>
              <Link to="/auth" className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition shadow-glow">
                Get started free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
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
          <p className="text-xs text-muted-foreground">© 2026 Skill.Ai — Your assistant from profile to placement.</p>
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

/* ---------- Roadmap with plane scroll animation ---------- */

const roadmap = [
  { icon: UserRound, title: "Build your profile", desc: "Tell me your goal, branch and dream role. I'll set up a personal workspace in minutes." },
  { icon: Brain, title: "AI skill check", desc: "A short adaptive test that finds out where you're strong and where you need more practice." },
  { icon: FileText, title: "Resume that gets read", desc: "I rewrite your resume for each role and score it against real recruiter filters." },
  { icon: MessageSquare, title: "Mock interviews", desc: "Talk to me like an interviewer. Get transcripts, feedback and a score after every round." },
  { icon: Target, title: "Spot your skill gaps", desc: "I show exactly what to learn next so you close the gap before applying." },
  { icon: Search, title: "AI job matching", desc: "I match you to roles that actually fit your skills, location and preferences." },
  { icon: Award, title: "Placement readiness", desc: "A final check on aptitude, DSA, communication and confidence before you apply." },
  { icon: Briefcase, title: "Apply with one click", desc: "Send tailored applications to companies straight from your dashboard." },
  { icon: Rocket, title: "Get hired", desc: "Land the offer — and keep growing with me for the next role too." },
];

function RoadmapSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Plane travels down the line
  const planeY = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);
  const lineFill = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative py-32 border-t border-border overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Your journey with me</p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Every stop, <span className="text-gradient">from student to hire.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Scroll down — the plane follows you through each milestone.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-[40px_1fr] sm:grid-cols-[64px_1fr] gap-6 sm:gap-10">
          {/* Vertical line + plane */}
          <div className="relative flex justify-center">
            <div className="absolute inset-y-0 w-px bg-border" />
            <motion.div
              style={{ height: lineFill }}
              className="absolute top-0 w-px bg-foreground"
            />
            {/* Plane */}
            <motion.div
              style={{ top: planeY }}
              className="sticky top-1/2 -translate-y-1/2 h-10 w-10 -translate-x-0 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center"
            >
              <Plane className="h-4 w-4 rotate-90" />
            </motion.div>
          </div>

          {/* Steps */}
          <ol className="space-y-14 sm:space-y-20 relative">
            {roadmap.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="relative"
              >
                {/* dot on line */}
                <div className="absolute -left-[46px] sm:-left-[70px] top-3 h-3 w-3 rounded-full bg-foreground ring-4 ring-background" />
                <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-7 shadow-elegant">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <s.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Brain, title: "Adaptive tutor", desc: "I learn how you learn and set drills that match your level, not a textbook." },
  { icon: MessageSquare, title: "Voice mock interviews", desc: "Real interview practice with transcripts, scores and clear next steps." },
  { icon: Target, title: "Aptitude & DSA", desc: "Focused question banks with timers, hints and clear explanations." },
  { icon: BookOpen, title: "Smart resume review", desc: "Role-specific rewrites and ATS scoring so your resume gets past filters." },
  { icon: Zap, title: "Daily 15-min drills", desc: "Short daily practice that keeps momentum without burning you out." },
  { icon: Trophy, title: "Verified skill profile", desc: "A public profile of your skills recruiters can actually trust." },
];
