import React from "react";
import { motion } from "framer-motion";

interface TechRadarMapProps {
    radar: {
        rising: string[];
        emerging: string[];
        stable: string[];
        declining: string[];
    };
}

export function TechRadarMap({ radar }: TechRadarMapProps) {
    const quadrants = [
        { title: "Rising", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", items: radar.rising },
        { title: "Emerging", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", items: radar.emerging },
        { title: "Stable", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", items: radar.stable },
        { title: "Declining", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", items: radar.declining },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 flex flex-col h-full"
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold font-display text-white">Technology Radar Classifications</h3>
                <p className="text-sm text-muted-foreground">Keyword momentum lifecycle positioning</p>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {quadrants.map(quad => (
                    <div key={quad.title} className={`p-4 rounded-xl border ${quad.border} ${quad.bg} flex flex-col gap-2`}>
                        <h4 className={`text-sm font-bold uppercase tracking-wider ${quad.color}`}>{quad.title}</h4>
                        <div className="flex flex-wrap gap-2">
                            {quad.items.length > 0 ? quad.items.map(i => (
                                <span key={i} className="px-2 py-1 bg-black/30 border border-white/5 rounded-md text-xs text-white/90">
                                    {i}
                                </span>
                            )) : (
                                <span className="text-xs text-muted-foreground italic">None detected</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
