import React from "react";
import { motion } from "framer-motion";
import { Zap, Target, Gauge, TrendingUp, Trophy } from "lucide-react";

interface VisualIntelligenceProps {
    futureSignal: {
        prediction: string;
        confidence: number;
        window: string;
    };
    potentialScore: {
        score: number;
        investment: string;
        opportunity: string;
    };
    globalActivity: any[];
}

export function VisualIntelligencePanel({ futureSignal, potentialScore, globalActivity }: VisualIntelligenceProps) {
    const sortedRace = [...globalActivity].sort((a, b) => (b.papers + b.repos) - (a.papers + a.repos)).slice(0, 5);

    return (
        <div className="flex flex-col gap-6">
            {/* Scorecard Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center border-primary/20 bg-primary/5">
                    <Gauge className="w-8 h-8 text-primary mb-2" />
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Technology Potential</h4>
                    <div className="text-4xl font-display font-bold text-white mb-1 shadow-glow">{potentialScore.score} <span className="text-lg text-primary/70">/ 100</span></div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center border-accent/20 bg-accent/5">
                    <TrendingUp className="w-8 h-8 text-accent mb-2" />
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Investment Signal</h4>
                    <div className="text-2xl font-bold text-white shadow-glow-accent">{potentialScore.investment}</div>
                </div>

                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center border-emerald-500/20 bg-emerald-500/5">
                    <Zap className="w-8 h-8 text-emerald-400 mb-2" />
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Startup Opportunity</h4>
                    <div className="text-2xl font-bold text-emerald-300 shadow-glow-emerald">{potentialScore.opportunity}</div>
                </div>
            </motion.div>

            {/* Global Tech Race */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6 border-white/10"
            >
                <div className="flex items-center gap-2 mb-6">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Global Technology Race</h3>
                </div>
                <div className="space-y-4">
                    {sortedRace.map((country, idx) => (
                        <div key={country.country} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-end text-sm">
                                <span className="font-bold text-white/90">{idx + 1}. {country.country}</span>
                                <span className="font-mono text-xs text-muted-foreground">{country.papers + country.repos} Points</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (country.papers + country.repos) * 5)}%` }}
                                    className={`h-full bg-gradient-to-r ${idx === 0 ? 'from-amber-400 to-amber-200' : 'from-primary/60 to-primary/30'}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Future Signal */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 border-fuchsia-500/20 bg-fuchsia-500/5 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Target className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-fuchsia-400" />
                    <h3 className="text-lg font-bold text-white">Future Signal</h3>
                </div>
                <p className="text-lg text-white/90 mb-4 leading-relaxed italic">{futureSignal.prediction}</p>
                <div className="flex gap-8">
                    <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Confidence Score</div>
                        <div className="text-xl font-bold text-fuchsia-300 shadow-glow-fuchsia">{futureSignal.confidence}%</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Adoption Window</div>
                        <div className="text-xl font-bold text-white font-mono">{futureSignal.window}</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
