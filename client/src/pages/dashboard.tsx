import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { SearchBar } from "@/components/search-bar";
import { LoadingState } from "@/components/loading-state";
import { useAnalyze } from "@/hooks/use-radar";
import { MethodologyModal } from "@/components/methodology-modal";
import { TopicRadar } from "@/components/results/radar-chart";
import { PaperCard } from "@/components/results/paper-card";
import { RepoCard } from "@/components/results/repo-card";
import { BookOpen, Github, TrendingUp, Cpu, Sparkles } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  
  const { data, isLoading, isError, error, isFetching } = useAnalyze(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 pb-12">
        {/* Search Header Area */}
        <motion.div 
          layout 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${!searchQuery ? 'mt-[20vh]' : 'mt-4'}`}
        >
          {!searchQuery && (
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-muted-foreground mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>v2.0 Model Engine Active</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
                Synthesize <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Knowledge</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Instantly aggregate the latest arXiv research and trending GitHub repositories to map the momentum of emerging technologies.
              </p>
            </div>
          )}

          <div className="w-full max-w-3xl">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery || ""} isLarge={!searchQuery} />
          </div>
        </motion.div>

        {/* Content Area */}
        {searchQuery && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 mt-4">
            {isFetching ? (
              <LoadingState query={searchQuery} />
            ) : isError ? (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Analysis Failed</h3>
                <p>{error?.message || "An unexpected error occurred while fetching data."}</p>
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="mt-4 px-4 py-2 bg-destructive/20 hover:bg-destructive/30 rounded-lg transition-colors"
                >
                  Retry Analysis
                </button>
              </div>
            ) : data ? (
              <div className="flex flex-col gap-8">
                {/* Dashboard Header / KPI Row */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-display font-bold text-white">
                        {data.query}
                      </h2>
                      <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xl font-bold font-mono text-glow">
                        {data.trend_score.toFixed(0)} <span className="text-sm font-normal text-primary/70">Score</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {data.keywords.map(kw => (
                        <span key={kw} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-mono mb-1">Fetched at</p>
                      <p className="text-sm text-white font-mono">{new Date(data.fetched_at).toLocaleTimeString()}</p>
                    </div>
                    <MethodologyModal />
                  </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Visuals & Metrics */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <TopicRadar keywords={data.keywords} trendScore={data.trend_score} />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary mb-3" />
                        <h4 className="text-3xl font-bold font-mono text-white">{data.arxiv_count}</h4>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Papers Found</p>
                      </div>
                      <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center justify-center">
                        <Github className="w-6 h-6 text-accent mb-3" />
                        <h4 className="text-3xl font-bold font-mono text-white">{data.github_count}</h4>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Repos Found</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Feeds */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Papers Feed */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-white">Latest Research</h3>
                      </div>
                      <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 pb-4">
                        {data.items.arxiv.length > 0 ? (
                          data.items.arxiv.map((paper, i) => (
                            <motion.div 
                              key={paper.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <PaperCard paper={paper} />
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-muted-foreground glass-card rounded-xl">
                            No recent papers found for this topic.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Repos Feed */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <Github className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-bold text-white">Trending Repositories</h3>
                      </div>
                      <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 pb-4">
                        {data.items.github.length > 0 ? (
                          data.items.github.map((repo, i) => (
                            <motion.div 
                              key={repo.html_url}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <RepoCard repo={repo} />
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-muted-foreground glass-card rounded-xl">
                            No trending repositories found for this topic.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : null}
          </div>
        )}
      </div>
    </Layout>
  );
}
