import React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export function FutureOutlook({ text }: { text: string }) {
    if (!text) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
                <Compass className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold font-display text-white">Future Technology Outlook</h3>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-white/90 italic border-l-2 border-primary/50 pl-4 relative z-10">
                "{text}"
            </p>
        </motion.div>
    );
}
