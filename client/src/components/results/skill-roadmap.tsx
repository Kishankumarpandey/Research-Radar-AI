import React from "react";
import { motion } from "framer-motion";
import { GitMerge } from "lucide-react";

export function SkillRoadmap({ roadmap }: { roadmap: Array<{ stage: string; skills: string[] }> }) {
    if (!roadmap || roadmap.length === 0) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <GitMerge className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold font-display text-white">Skill Path for Engineers</h3>
            </div>
            <div className="flex flex-col gap-4 relative">
                <div className="absolute left-3.5 top-2 bottom-6 w-px bg-white/10" />
                {roadmap.map((stage, idx) => (
                    <div key={idx} className="flex gap-4 relative z-10">
                        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-accent">{idx + 1}</span>
                        </div>
                        <div className="flex flex-col gap-2 pt-0.5">
                            <h4 className="text-sm font-bold text-white">{stage.stage}</h4>
                            <div className="flex flex-wrap gap-2">
                                {stage.skills.map((skill, sIdx) => (
                                    <span key={sIdx} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-muted-foreground">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
