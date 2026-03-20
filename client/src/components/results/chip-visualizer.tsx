import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Cpu } from "lucide-react";

interface ChipArchitectureVisualizerProps {
    diagram: string[];
}

export function ChipArchitectureVisualizer({ diagram }: ChipArchitectureVisualizerProps) {
    if (!diagram || diagram.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
                <Cpu className="w-4 h-4 text-cyan-400" /> Chip Architecture Layout
            </h4>

            <div className="flex flex-col items-center gap-2 bg-black/40 p-6 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

                {diagram.map((block, idx) => (
                    <React.Fragment key={idx}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="w-full max-w-[240px] px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-center shadow-[0_0_15px_rgba(6,180,210,0.1)]"
                        >
                            <span className="text-sm font-mono font-bold text-cyan-100">{block}</span>
                        </motion.div>

                        {idx < diagram.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ delay: idx * 0.1 + 0.05 }}
                            >
                                <ArrowDown className="w-4 h-4 text-cyan-500/40" />
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
