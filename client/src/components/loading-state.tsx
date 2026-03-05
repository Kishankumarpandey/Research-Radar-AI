import { useState, useEffect } from "react";
import { Loader2, Database, Cpu, Globe, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  { icon: Search, text: "Initializing analysis parameters..." },
  { icon: Globe, text: "Connecting to arXiv Open Access API..." },
  { icon: Database, text: "Fetching trending GitHub repositories..." },
  { icon: Cpu, text: "Extracting semantic keywords and trends..." },
  { icon: Loader2, text: "Compiling final insights..." }
];

export function LoadingState({ query }: { query: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 0.1);
    }, 100);

    const stepTimer = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 1200);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, []);

  const CurrentIcon = LOADING_STEPS[stepIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 w-full">
      <div className="relative">
        {/* Outer glowing rings */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary w-24 h-24 -m-4" />
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[spin_3s_linear_infinite] w-24 h-24 -m-4" />
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/50 animate-[spin_4s_linear_infinite_reverse] w-24 h-24 -m-4" />
        
        {/* Central icon */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-card border border-white/10 flex items-center justify-center shadow-xl shadow-primary/20 backdrop-blur-sm">
          <CurrentIcon className={`w-8 h-8 text-primary ${stepIndex === LOADING_STEPS.length - 1 ? 'animate-spin' : ''}`} />
        </div>
      </div>

      <h3 className="mt-8 text-xl font-display font-semibold text-white">
        Analyzing <span className="text-primary text-glow">"{query}"</span>
      </h3>
      
      <div className="mt-4 h-6 relative overflow-hidden w-full max-w-md flex justify-center items-center text-sm text-muted-foreground font-mono">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {LOADING_STEPS[stepIndex].text}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-6 text-xs font-mono text-muted-foreground/50 border border-white/5 rounded-lg px-4 py-2 bg-black/20">
        <span className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-accent" />
          LIVE FETCH VISIBLE
        </span>
        <span className="w-px h-3 bg-white/10" />
        <span className="w-16 text-right">{timeElapsed.toFixed(1)}s</span>
      </div>
    </div>
  );
}
