import React from "react";
import { motion } from "framer-motion";
import { Target, AlertTriangle, Clock, Lightbulb, Users, Rocket, LineChart } from "lucide-react";

interface StrategicIntelligenceProps {
    intelligence: {
        riskProfile: {
            maturity: string;
            uncertainty: string;
            marketRisk: string;
        };
        adoptionTimeline: string;
        recommendations: {
            engineers: string;
            startups: string;
            investors: string;
        };
    };
}

export function StrategicIntelligencePanel({ intelligence }: StrategicIntelligenceProps) {
    if (!intelligence) return null;

    const getRiskColor = (level: string) => {
        const l = level.toLowerCase();
        if (l === 'low') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (l === 'medium') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        if (l === 'high') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        return 'text-white/70 bg-white/5 border-white/10';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden"
        >
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Target className="w-6 h-6 text-fuchsia-400" />
                <h3 className="text-xl font-bold font-display text-white">Strategic Intelligence</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-5">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col gap-4 shadow-inner">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4 text-amber-400" /> Risk Profile
                        </h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">Maturity</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getRiskColor(intelligence.riskProfile.maturity)}`}>
                                    {intelligence.riskProfile.maturity}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">Research Uncertainty</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getRiskColor(intelligence.riskProfile.uncertainty)}`}>
                                    {intelligence.riskProfile.uncertainty}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">Market Risk</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getRiskColor(intelligence.riskProfile.marketRisk)}`}>
                                    {intelligence.riskProfile.marketRisk}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-fuchsia-500/5 p-4 rounded-xl border border-fuchsia-500/20 flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-fuchsia-500/10 to-transparent pointer-events-none" />
                        <h4 className="flex items-center gap-2 text-sm font-bold text-fuchsia-300 uppercase tracking-wide">
                            <Clock className="w-4 h-4" /> Adoption Timeline
                        </h4>
                        <p className="text-sm text-white/90 font-mono mt-1">{intelligence.adoptionTimeline}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide border-b border-white/10 pb-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-emerald-400" /> Strategic Recommendations
                    </h4>

                    <div className="flex flex-col gap-4">
                        <div>
                            <h5 className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1.5">
                                <Users className="w-3.5 h-3.5" /> For Engineers
                            </h5>
                            <p className="text-sm text-white/80 leading-relaxed bg-indigo-500/5 p-2.5 rounded-lg border border-indigo-500/10">
                                {intelligence.recommendations.engineers}
                            </p>
                        </div>

                        <div>
                            <h5 className="flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-wider mb-1.5">
                                <Rocket className="w-3.5 h-3.5" /> For Startups
                            </h5>
                            <p className="text-sm text-white/80 leading-relaxed bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                                {intelligence.recommendations.startups}
                            </p>
                        </div>

                        <div>
                            <h5 className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                                <LineChart className="w-3.5 h-3.5" /> For Investors
                            </h5>
                            <p className="text-sm text-white/80 leading-relaxed bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                                {intelligence.recommendations.investors}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
