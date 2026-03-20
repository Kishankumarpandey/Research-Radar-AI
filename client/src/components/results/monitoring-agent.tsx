import React from "react";
import { motion } from "framer-motion";
import { Activity, BellRing, Beaker, FileText, Download } from "lucide-react";

interface MonitoringProps {
    monitoring: {
        alerts: string[];
        discoveries: string[];
        weeklyReport: {
            newPapers: number;
            newRepos: number;
            emergingSignals: string[];
            investmentSignalUpdated: string;
        };
    };
    query: string;
}

export function MonitoringAgent({ monitoring, query }: MonitoringProps) {
    if (!monitoring) return null;

    const handleExportReport = () => {
        let md = `# Weekly Monitoring Report: ${query}\n\n`;
        md += `## Summary\n`;
        md += `- **New Papers:** ${monitoring.weeklyReport.newPapers}\n`;
        md += `- **New Repositories:** ${monitoring.weeklyReport.newRepos}\n`;
        md += `- **Current Investment Signal:** ${monitoring.weeklyReport.investmentSignalUpdated}\n\n`;

        md += `## Active Alerts\n`;
        monitoring.alerts.forEach(a => { md += `- ${a}\n`; });

        md += `\n## New Discoveries\n`;
        monitoring.discoveries.forEach(d => { md += `- ${d}\n`; });

        md += `\n## Emerging Signals\n`;
        monitoring.weeklyReport.emergingSignals.forEach(s => { md += `- ${s}\n`; });

        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${query.toLowerCase().replace(/\s+/g, '-')}-weekly-report.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-xl font-bold font-display text-white">Technology Monitoring</h3>
                </div>
                <button
                    onClick={handleExportReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                    <Download className="w-4 h-4" /> Export Weekly Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="flex flex-col gap-5">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide mb-3">
                            <BellRing className="w-4 h-4 text-rose-400" /> Alerts
                        </h4>
                        <div className="flex flex-col gap-2">
                            {monitoring.alerts.map((alert, idx) => {
                                const isNormal = alert.includes('Monitoring:');
                                return (
                                    <div key={idx} className={`px-4 py-3 rounded-xl flex items-start gap-3 border ${isNormal ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/10 border-rose-500/20'}`}>
                                        <span className="relative flex h-3 w-3 mt-1 shrink-0">
                                            <span className={`${isNormal ? 'bg-emerald-400 opacity-20' : 'animate-ping bg-rose-400 opacity-75'} absolute inline-flex h-full w-full rounded-full`}></span>
                                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isNormal ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                        </span>
                                        <p className={`text-sm leading-relaxed ${isNormal ? 'text-emerald-100/70' : 'text-rose-100'}`}>{alert}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide mb-3">
                            <Beaker className="w-4 h-4 text-indigo-400" /> Recent Discoveries
                        </h4>
                        <div className="flex flex-col gap-2">
                            {monitoring.discoveries.map((disc, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 px-3 py-2.5 rounded-lg text-sm text-indigo-100/90 font-medium">
                                    {disc}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
                        <FileText className="w-4 h-4 text-emerald-400" /> Weekly Summary
                    </h4>
                    <div className="bg-black/30 border border-emerald-500/10 rounded-xl p-5 flex flex-col gap-5 h-full">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="text-center flex-1">
                                <p className="text-3xl font-bold font-mono text-white">{monitoring.weeklyReport.newPapers}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">New Papers</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center flex-1">
                                <p className="text-3xl font-bold font-mono text-white">{monitoring.weeklyReport.newRepos}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">New Repos</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center flex-1">
                                <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{monitoring.weeklyReport.investmentSignalUpdated}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Signal</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {monitoring.weeklyReport.emergingSignals.map((sig, idx) => (
                                <p key={idx} className="text-sm text-white/80 flex items-start gap-2 bg-emerald-500/5 p-2 rounded select-all">
                                    <span className="text-emerald-500 mt-1 shrink-0 text-xs shadow-glow">▹</span> {sig}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
