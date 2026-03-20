import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Scanning Steps ─────────────────────────────────────────────────────────
// Each step represents a phase of the AI analysis pipeline shown to the user.
const SCAN_STEPS = [
  { icon: "🔭", label: "Querying arXiv API", detail: "Fetching latest research papers…" },
  { icon: "🐙", label: "Scanning GitHub", detail: "Finding trending repositories…" },
  { icon: "🧠", label: "AI Analysis Running", detail: "Generating summaries and insights…" },
  { icon: "📊", label: "Computing Trend Signals", detail: "Calculating investment and momentum scores…" },
  { icon: "🗺️", label: "Building Global Map", detail: "Mapping research activity by region…" },
  { icon: "⚡", label: "Finalizing Intelligence", detail: "Compiling strategic recommendations…" },
];

interface LoadingStateProps {
  query: string;
}

export function LoadingState({ query }: LoadingStateProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle through steps on a timer
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % SCAN_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20">
      {/* ─── Animated Radar Ring ──────────────────────────────────────────── */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/30"
            style={{ width: `${100 + i * 30}%`, height: `${100 + i * 30}%` }}
            animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
          />
        ))}
        {/* Spinning radar sweep */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-t-primary border-r-primary/30 border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Center icon */}
        <AnimatePresence mode="wait">
          <motion.span
            key={stepIndex}
            className="text-3xl z-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {SCAN_STEPS[stepIndex].icon}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ─── Query & Status ───────────────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary/60">
          Analyzing
        </p>
        <h3 className="text-2xl font-display font-bold text-white">
          &ldquo;{query}&rdquo;
        </h3>
      </div>

      {/* ─── Step Progress ────────────────────────────────────────────────── */}
      <div className="w-full max-w-md space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            className="glass-card rounded-xl px-5 py-4 border-primary/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{SCAN_STEPS[stepIndex].icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  {SCAN_STEPS[stepIndex].label}{dots}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {SCAN_STEPS[stepIndex].detail}
                </p>
              </div>
              {/* Spinning indicator */}
              <motion.div
                className="w-4 h-4 rounded-full border-2 border-t-primary border-r-primary/30 border-b-transparent border-l-transparent shrink-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step progress dots */}
        <div className="flex items-center justify-center gap-2">
          {SCAN_STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              animate={{
                width: i === stepIndex ? 20 : 6,
                backgroundColor: i <= stepIndex ? "hsl(var(--primary))" : "rgba(255,255,255,0.15)"
              }}
              style={{ height: 6 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
      </div>

      {/* ─── Status line ─────────────────────────────────────────────────── */}
      <p className="text-xs font-mono text-muted-foreground/50">
        AI intelligence engine active — this usually takes 5–15 seconds
      </p>
    </div>
  );
}
