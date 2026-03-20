import React from "react";
import { motion } from "framer-motion";
import { Newspaper, Building2, Workflow, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

export function IndustrySignalsPanel({ signals, investmentSignal }: { signals?: string[], investmentSignal?: string }) {
    if (!signals || signals.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-5 border border-white/5"
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold font-display text-white">Industry Signals</h3>
                </div>

                {investmentSignal && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest ${investmentSignal === 'HIGH' ? 'text-emerald-400' : investmentSignal === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                        {investmentSignal === 'HIGH' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {investmentSignal === 'MEDIUM' && <Shield className="w-3.5 h-3.5" />}
                        {investmentSignal === 'LOW' && <ShieldAlert className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">Investment Signal:</span> {investmentSignal}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                {signals.map((signal, idx) => (
                    <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">
                        <p className="text-sm text-white/90 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">
                            "{signal}"
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export function CompetitiveEcosystem({ ecosystem }: { ecosystem?: { topCompanies: string[], topStartups: string[], topOrgs: string[] } }) {
    if (!ecosystem) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-5 border border-white/5"
        >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Building2 className="w-5 h-5 text-fuchsia-400" />
                <h3 className="text-lg font-bold font-display text-white">Competitive Ecosystem</h3>
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 text-fuchsia-300">Top Companies</h4>
                    <div className="flex flex-wrap gap-2">
                        {ecosystem.topCompanies.map((c, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs font-semibold bg-white/5 text-white/80 border border-white/10 rounded-md">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 text-fuchsia-300">Top Startups</h4>
                    <div className="flex flex-wrap gap-2">
                        {ecosystem.topStartups.map((c, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs font-semibold bg-white/5 text-white/80 border border-white/10 rounded-md">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 text-fuchsia-300">Top Open Source Orgs</h4>
                    <div className="flex flex-wrap gap-2">
                        {ecosystem.topOrgs.map((c, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs font-semibold bg-white/5 text-white/80 border border-white/10 rounded-md">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
