import React from "react";
import { motion } from "framer-motion";
import { Building2, Layers } from "lucide-react";

export function OrgIntelligence({ labs, orgs }: { labs: string[], orgs: string[] }) {
    if ((!labs || labs.length === 0) && (!orgs || orgs.length === 0)) return null;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 gap-4"
        >
            <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1 border-b border-white/10 pb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">Top Research Labs</h4>
                </div>
                <ul className="flex flex-col gap-2">
                    {labs.slice(0, 3).map((lab, i) => (
                        <li key={i} className="text-xs text-muted-foreground truncate">{lab}</li>
                    ))}
                </ul>
            </div>

            <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1 border-b border-white/10 pb-2">
                    <Layers className="w-4 h-4 text-accent" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">Top Open Source Orgs</h4>
                </div>
                <ul className="flex flex-col gap-2">
                    {orgs.slice(0, 3).map((org, i) => (
                        <li key={i} className="text-xs text-muted-foreground truncate">{org}</li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
