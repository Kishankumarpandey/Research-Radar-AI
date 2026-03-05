import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Radar, Activity, TerminalSquare, Github } from "lucide-react";
import { useSystemHealth } from "@/hooks/use-radar";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: health } = useSystemHealth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Radar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                Research<span className="text-primary">Radar</span> AI
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                Advanced Intelligence Aggregator
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex flex-1 max-w-sm mx-12">
             {/* Navigation elements can go here if expanded later */}
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/logs" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location === '/logs' 
                  ? 'bg-white/10 text-white shadow-inner' 
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <TerminalSquare className="w-4 h-4" />
              <span className="text-sm">System Logs</span>
            </Link>

            <div className="h-6 w-px bg-white/10 mx-2" />

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health?.status === 'ok' ? 'bg-primary' : 'bg-destructive'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${health?.status === 'ok' ? 'bg-primary' : 'bg-destructive'}`}></span>
              </span>
              <span className={health?.status === 'ok' ? 'text-primary' : 'text-destructive'}>
                {health?.status === 'ok' ? 'SYSTEM ONLINE' : 'CONNECTING...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Research Radar AI. Synthesizing the future.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
