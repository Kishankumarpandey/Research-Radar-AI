import { motion } from "framer-motion";
import { Lightbulb, Zap, Target } from "lucide-react";

// ─── Startup Opportunity Card ─────────────────────────────────────────────
// Displays AI-generated startup idea cards from the analyze endpoint.

interface Opportunity {
  idea: string;
  problem: string;
  solution: string;
}

interface OpportunitiesPanelProps {
  opportunities: Opportunity[];
  query: string;
}

const CARD_COLORS = [
  { border: "border-primary/20", glow: "shadow-[0_0_20px_rgba(var(--primary),0.1)]", badge: "bg-primary/10 text-primary border-primary/20" },
  { border: "border-accent/20", glow: "shadow-[0_0_20px_rgba(var(--accent),0.1)]", badge: "bg-accent/10 text-accent border-accent/20" },
];

export function OpportunitiesPanel({ opportunities, query }: OpportunitiesPanelProps) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Lightbulb className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Startup Opportunities</h3>
          <p className="text-xs text-muted-foreground">
            AI-generated ideas based on <span className="text-primary font-mono">{query}</span> research gaps
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {opportunities.map((opp, idx) => {
          const colors = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-xl border ${colors.border} ${colors.glow} bg-white/3 p-5 space-y-3`}
            >
              {/* Idea */}
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-md shrink-0 ${colors.badge}`}>
                  Idea {idx + 1}
                </span>
                <p className="text-sm font-bold text-white leading-snug">{opp.idea}</p>
              </div>

              {/* Problem + Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <Target className="w-3.5 h-3.5 text-destructive/70 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Problem</p>
                    <p className="text-xs text-white/70 leading-relaxed">{opp.problem}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Solution</p>
                    <p className="text-xs text-white/70 leading-relaxed">{opp.solution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
