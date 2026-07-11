import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import robotAsset from "@/assets/skill-robot-popup.jpeg.asset.json";

export function IntroOverlay() {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scroll while intro is visible
    if (!hidden) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const onWheel = (e: WheelEvent) => {
        if (e.deltaY > 0) {
          setProgress((p) => {
            const next = Math.min(1, p + e.deltaY / 600);
            if (next >= 1) setHidden(true);
            return next;
          });
        }
      };
      const onTouchStart = (e: TouchEvent) => {
        (window as any).__lastTouchY = e.touches[0].clientY;
      };
      const onTouchMove = (e: TouchEvent) => {
        const lastY = (window as any).__lastTouchY ?? e.touches[0].clientY;
        const dy = lastY - e.touches[0].clientY;
        (window as any).__lastTouchY = e.touches[0].clientY;
        if (dy > 0) {
          setProgress((p) => {
            const next = Math.min(1, p + dy / 300);
            if (next >= 1) setHidden(true);
            return next;
          });
        }
      };
      const onKey = (e: KeyboardEvent) => {
        if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
          setProgress((p) => {
            const next = Math.min(1, p + 0.35);
            if (next >= 1) setHidden(true);
            return next;
          });
        }
      };

      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("keydown", onKey);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("keydown", onKey);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [hidden]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
          style={{
            transform: `translateY(-${progress * 15}%) scale(${1 - progress * 0.05})`,
            opacity: 1 - progress * 0.4,
          }}
        >
          {/* subtle grid */}
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

          {/* glow behind robot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl animate-pulse-glow" />

          <div className="relative flex flex-col items-center">
            {/* Robot with waving arm */}
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ transformOrigin: "bottom center" }}
              >
                {/* container that gets a "wave" tilt */}
                <motion.div
                  animate={{ rotate: [0, -6, 6, -6, 6, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "50% 85%" }}
                >
                  <img
                    src={robotAsset.url}
                    alt="Skill.Ai robot waving hello"
                    className="w-[280px] sm:w-[360px] md:w-[420px] select-none pointer-events-none"
                    draggable={false}
                    style={{ filter: "drop-shadow(0 40px 80px rgba(255,255,255,0.15))" }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 text-center px-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Hi, I'm Ai
              </p>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tighter">
                Welcome to <span className="text-gradient">Skill.Ai</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                Your personal Ai companion for mastering interviews, coding & more.
              </p>
            </motion.div>

            {/* Scroll hint */}
            <motion.button
              onClick={() => setHidden(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="absolute -bottom-32 sm:-bottom-40 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition group"
            >
              <span className="text-xs uppercase tracking-[0.25em]">Scroll to enter</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
              {/* progress bar */}
              <div className="mt-2 h-[2px] w-24 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-[width] duration-150"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
