import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { FileText, Loader2 } from "lucide-react";

export function ResearchBriefButton({ query, className }: { query: string; className?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [api.analyze.brief.get.path, query],
        queryFn: async () => {
            const sp = new URLSearchParams({ q: query });
            const res = await fetch(`${api.analyze.brief.get.path}?${sp.toString()}`);
            if (!res.ok) throw new Error("Failed");
            return await res.json();
        },
        enabled: false,
    });

    const handleGenerate = () => {
        setIsOpen(true);
        if (!data) refetch();
    };

    return (
        <>
            <button
                onClick={handleGenerate}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg transition-colors font-semibold text-sm ${className}`}
            >
                <FileText className="w-4 h-4" /> Generate Research Brief
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" /> Executive Research Brief
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground transition">Close</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 text-white/90 prose prose-invert prose-primary max-w-none">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-12 gap-4 text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <p>Synthesizing structured analyst brief...</p>
                                </div>
                            )}
                            {isError && <p className="text-destructive">Failed to generate brief. Please try again.</p>}
                            {data && (
                                <div className="whitespace-pre-wrap">{data.brief}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
