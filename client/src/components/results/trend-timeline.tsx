import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface TrendTimelineProps {
    timeline: Array<{ year: string, papers: number, repos: number }>;
}

export function TrendTimeline({ timeline }: TrendTimelineProps) {
    if (!timeline || timeline.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 flex flex-col h-full"
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold font-display text-white">Technology Trend Timeline</h3>
                <p className="text-sm text-muted-foreground">Volume of papers and repositories by year</p>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPapers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRepos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                            labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="papers" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPapers)" name="Papers" strokeWidth={2} />
                        <Area type="monotone" dataKey="repos" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRepos)" name="Repos" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
