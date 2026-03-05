import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Info, X, Database, Globe, Zap } from "lucide-react";

export function MethodologyModal() {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors text-xs font-mono">
          <Info className="w-3.5 h-3.5" />
          Metrics & Methodology
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-card p-6 shadow-2xl shadow-black/50 sm:rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex flex-col gap-2">
            <DialogPrimitive.Title className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Analysis Methodology
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              How Research Radar AI computes trends and aggregates data.
            </DialogPrimitive.Description>
          </div>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Live Data Aggregation</h4>
                <p className="text-sm text-muted-foreground">
                  Upon searching, we make live API calls to both the <strong className="text-white">arXiv Open Access API</strong> and the <strong className="text-white">GitHub REST API</strong> concurrently.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg bg-accent/10 text-accent">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Trend Score Computation</h4>
                <p className="text-sm text-muted-foreground">
                  The <strong className="text-white text-glow">Trend Score</strong> (0-100) is synthesized based on the recency of arXiv publications combined with the star velocity of matching GitHub repositories over the past 30 days.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg bg-white/10 text-white">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Caching & Rate Limits</h4>
                <p className="text-sm text-muted-foreground">
                  To respect API limits, results are cached temporarily. The 'Live Fetch' timer proves when a fresh request bypassing the cache is executed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <DialogPrimitive.Close asChild>
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Understood
              </button>
            </DialogPrimitive.Close>
          </div>

          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4 text-white" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
