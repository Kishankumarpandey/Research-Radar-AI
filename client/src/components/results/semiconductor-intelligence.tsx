import React from "react";
import { motion } from "framer-motion";
import { Cpu, Server, MapIcon, Layers, BookOpen, Star, Briefcase } from "lucide-react";
import { ChipArchitectureVisualizer } from "./chip-visualizer";

interface SemiconductorIntelligenceProps {
    intelligence: {
        highlights: any[];
        topProjects: any[];
        activeOrgs: string[];
        architectures: string[];
        skillRoadmap: string[];
        architectureDiagram: string[];
    };
}

export function SemiconductorIntelligencePanel({ intelligence }: SemiconductorIntelligenceProps) {
    if (!intelligence) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden ring-1 ring-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-4 relative z-10">
                <Cpu className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold font-display text-white">Semiconductor Intelligence</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="flex flex-col gap-5">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide mb-3">
                            <BookOpen className="w-4 h-4 text-cyan-400" /> Research Highlights
                        </h4>
                        <div className="flex flex-col gap-2">
                            {intelligence.highlights.map((paper, idx) => (
                                <div key={idx} className="px-4 py-3 rounded-xl flex flex-col gap-1 bg-white/5 border border-white/10">
                                    <p className="text-sm font-semibold text-white truncate">{paper.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{paper.summary}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide mb-3">
                            <Server className="w-4 h-4 text-emerald-400" /> Open Hardware Projects
                        </h4>
                        <div className="flex flex-col gap-2">
                            {intelligence.topProjects.map((repo, idx) => (
                                <div key={idx} className="px-4 py-3 rounded-xl flex flex-col gap-1 bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-emerald-100 truncate">{repo.name}</p>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="w-3 h-3 text-amber-400" /> {repo.stars}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-5 flex flex-col gap-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-300 uppercase tracking-wide">
                            <Layers className="w-4 h-4" /> Emerging Architectures
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {intelligence.architectures.map((arch, idx) => (
                                <span key={idx} className="text-xs font-mono font-medium bg-black/40 text-cyan-200 px-2.5 py-1 rounded border border-cyan-500/30">
                                    {arch}
                                </span>
                            ))}
                        </div>

                        {intelligence.architectureDiagram && (
                            <ChipArchitectureVisualizer diagram={intelligence.architectureDiagram} />
                        )}
                    </div>

                    <div className="bg-black/20 border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
                            <Briefcase className="w-4 h-4 text-fuchsia-400" /> Active Organizations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {intelligence.activeOrgs.map((org, idx) => (
                                <span key={idx} className="text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-100 px-2.5 py-1 rounded border border-fuchsia-500/20">
                                    {org}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/20 border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
                            <MapIcon className="w-4 h-4 text-amber-400" /> Skills for Chip Engineers
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {intelligence.skillRoadmap.map((skill, idx) => (
                                <span key={idx} className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 font-mono" /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
