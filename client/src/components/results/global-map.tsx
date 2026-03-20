import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { motion } from "framer-motion";
import { Globe, BookOpen, Github } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GlobalActivityItem {
    country: string;
    papers: number;
    repos: number;
}

interface GlobalMapProps {
    activity: GlobalActivityItem[];
}

export function GlobalResearchMap({ activity }: GlobalMapProps) {
    const [tooltipData, setTooltipData] = useState<GlobalActivityItem | null>(null);

    if (!activity || activity.length === 0) return null;

    const maxHits = Math.max(...activity.map(a => a.papers + a.repos));

    const colorScale = scaleLinear<string>()
        .domain([0, maxHits])
        .range(["#2a2a35", "#3b82f6"]); // slate-ish dark to bright blue primary

    const getCountryData = (geoName: string) => {
        const match = activity.find(
            (a) => a.country.toLowerCase() === geoName.toLowerCase() ||
                geoName.toLowerCase().includes(a.country.toLowerCase()) ||
                a.country.toLowerCase().includes(geoName.toLowerCase())
        );
        return match || { country: geoName, papers: 0, repos: 0 };
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ boxShadow: "0 0 30px rgba(var(--primary), 0.15)" }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 flex flex-col h-full relative group transition-all duration-500"
        >
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-5 h-5 text-primary group-hover:animate-spin-slow" />
                    <h3 className="text-lg font-bold font-display text-white">Global Research Activity</h3>
                </div>
                <p className="text-sm text-muted-foreground font-mono uppercase tracking-[0.2em] text-[10px]">Geographic distribution of academic momentum</p>
            </div>

            <div className="flex-1 w-full bg-black/40 rounded-xl overflow-hidden border border-white/5 relative items-center justify-center flex flex-col min-h-[350px] shadow-inner">
                <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
                    <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={4}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const d = getCountryData(geo.properties.name);
                                    const total = d.papers + d.repos;
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onMouseEnter={() => {
                                                if (total > 0) setTooltipData(d);
                                            }}
                                            onMouseLeave={() => {
                                                setTooltipData(null);
                                            }}
                                            style={{
                                                default: {
                                                    fill: total > 0 ? colorScale(total) : "#1a1a24",
                                                    outline: "none",
                                                    stroke: "#0f1115",
                                                    strokeWidth: 0.5,
                                                    transition: "all 300ms"
                                                },
                                                hover: {
                                                    fill: total > 0 ? "#10b981" : "#2a2a35",
                                                    outline: "none",
                                                    stroke: "#10b981",
                                                    strokeWidth: 1,
                                                    filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))"
                                                },
                                                pressed: {
                                                    fill: "#10b981",
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>

                {tooltipData && (
                    <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-xl border border-primary/30 p-4 rounded-xl pointer-events-none min-w-[200px] shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <h4 className="font-bold text-white text-sm uppercase tracking-wider">{tooltipData.country}</h4>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                    <BookOpen className="w-3.5 h-3.5 text-primary" /> arXiv Papers
                                </span>
                                <span className="font-mono text-sm font-bold text-white text-glow">{tooltipData.papers}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                    <Github className="w-3.5 h-3.5 text-accent" /> GitHub Repos
                                </span>
                                <span className="font-mono text-sm font-bold text-white shadow-glow-accent">{tooltipData.repos}</span>
                            </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-primary/60 text-center tracking-widest">
                            DISTRIBUTION: {(((tooltipData.papers + tooltipData.repos) / maxHits) * 100).toFixed(1)}% PEAK
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
