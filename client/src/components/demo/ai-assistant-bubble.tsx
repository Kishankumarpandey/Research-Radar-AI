import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, X } from "lucide-react";

const SUGGESTIONS = [
    "Try saying: 'Analyze AI chips'",
    "Try saying: 'Show semiconductor trends'",
    "Try saying: 'Research Quantum Computing'",
    "Ask me for 'Strategy for Edge AI'",
    "Try saying: 'Analyze neuromorphic computing'"
];

export function AiAssistantBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestionIndex, setSuggestionIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="glass-card p-4 rounded-2xl border-primary/30 max-w-[240px] shadow-[0_0_30px_rgba(var(--primary),0.2)] relative"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-1" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-white uppercase tracking-wider">AI Assistant</p>
                                <motion.p
                                    key={suggestionIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-white/80 italic"
                                >
                                    "{SUGGESTIONS[suggestionIndex]}"
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)]' : 'bg-card border border-white/10 text-primary hover:border-primary/50'
                    }`}
            >
                <MessageSquare className={`w-6 h-6 ${!isOpen ? 'animate-pulse' : ''}`} />
            </button>
        </div>
    );
}
