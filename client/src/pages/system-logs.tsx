import { Layout } from "@/components/layout";
import { useRunLogs } from "@/hooks/use-radar";
import { TerminalSquare, Clock, Search, Server, Activity, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Link } from "wouter";

export default function SystemLogs() {
  const { data: logs, isLoading, isError } = useRunLogs();

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <TerminalSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white">System Run Logs</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Real-time audit trail of all analysis queries and API execution metrics.
            </p>
          </div>
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Time</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Query</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Results (Papers/Repos)</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-3">
                        <Activity className="w-5 h-5 animate-pulse text-primary" />
                        Loading execution logs...
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-destructive">
                      Failed to load system logs. Please check connection.
                    </td>
                  </tr>
                ) : logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white-[0.02] transition-colors">
                      <td className="p-4 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {log.runTime ? format(parseISO(log.runTime), 'MMM d, HH:mm:ss') : 'Unknown'}
                        </div>
                      </td>
                      <td className="p-4 text-white">
                        <div className="flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-primary" />
                          {log.query}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {log.arxivCount ?? 0} arXiv
                          </span>
                          <span className="text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                            {log.githubCount ?? 0} GitHub
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Server className="w-3.5 h-3.5" />
                          {log.durationMs ? `${log.durationMs}ms` : '-'}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No logs available yet. Run a query from the dashboard to generate logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
