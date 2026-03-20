import React from "react";
import { motion } from "framer-motion";
import { Layers, Users, Combine, Rocket, LayoutTemplate, Activity } from "lucide-react";

interface PrototypeProps {
    prototype: {
        productConcept: string;
        targetUsers: string;
        techStack: string[];
        mvpSteps: string[];
        architectureDiagram: string[];
        marketPotential: number;
    };
}

export function PrototypeArchitecture({ prototype }: PrototypeProps) {
    if (!prototype) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <LayoutTemplate className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-bold font-display text-white">Prototype Architecture</h3>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Market Potential</span>
                    <span className="text-sm font-bold text-white ml-2">{prototype.marketPotential}/100</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="flex flex-col gap-4">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2 uppercase tracking-wide">
                            <Rocket className="w-4 h-4 text-primary" /> Product Concept
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                            {prototype.productConcept}
                        </p>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2 uppercase tracking-wide">
                            <Users className="w-4 h-4 text-accent" /> Target Users
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                            {prototype.targetUsers}
                        </p>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2 uppercase tracking-wide">
                            <Combine className="w-4 h-4 text-indigo-400" /> Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {prototype.techStack.map((stack, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs rounded-md font-mono">
                                    {stack}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-black/40 border border-white/5 p-5 rounded-xl">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">MVP Steps</h4>
                        <div className="flex flex-col gap-3 relative">
                            <div className="absolute left-[11px] top-2 bottom-4 w-px bg-white/10" />
                            {prototype.mvpSteps.map((step, idx) => (
                                <div key={idx} className="flex gap-3 relative z-10">
                                    <div className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-mono text-white/70">{idx + 1}</span>
                                    </div>
                                    <p className="text-sm text-white/80 pt-0.5">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-5 rounded-xl">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-4 uppercase tracking-wide">
                            <Layers className="w-4 h-4 text-emerald-400" /> System Architecture
                        </h4>
                        <div className="flex flex-col items-center">
                            {prototype.architectureDiagram.map((block, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="w-full bg-white/5 border border-white/10 p-3 text-center rounded-lg text-sm text-emerald-100 font-mono shadow-sm">
                                        {block}
                                    </div>
                                    {idx < prototype.architectureDiagram.length - 1 && (
                                        <div className="w-px h-6 bg-gradient-to-b from-emerald-500/50 to-emerald-500/10 my-1" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
