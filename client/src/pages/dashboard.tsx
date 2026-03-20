import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { SearchBar } from "@/components/search-bar";
import { LoadingState } from "@/components/loading-state";
import { useAnalyze, useSearchHistory, getInitialQueryFromUrl, syncQueryToUrl } from "@/hooks/use-radar";
import { MethodologyModal } from "@/components/methodology-modal";
import { BookOpen, Github, TrendingUp, Cpu, Sparkles, Lightbulb, BarChart2, Star } from "lucide-react";
import { TopicRadar } from "@/components/results/radar-chart";
import { PaperCard } from "@/components/results/paper-card";
import { RepoCard } from "@/components/results/repo-card";
import { TechRadarMap } from "@/components/results/tech-radar-map";
import { TrendTimeline } from "@/components/results/trend-timeline";
import { ResearchBriefButton } from "@/components/results/research-brief-button";
import { FutureOutlook } from "@/components/results/future-outlook";
import { SkillRoadmap } from "@/components/results/skill-roadmap";
import { OrgIntelligence } from "@/components/results/org-intelligence";
import { ExportButton } from "@/components/results/export-button";
import { GlobalResearchMap } from "@/components/results/global-map";
import { PrototypeArchitecture } from "@/components/results/prototype-architecture";
import { IndustrySignalsPanel, CompetitiveEcosystem } from "@/components/results/industry-signals";
import { StrategicIntelligencePanel } from "@/components/results/strategic-intelligence";
import { MonitoringAgent } from "@/components/results/monitoring-agent";
import { SemiconductorIntelligencePanel } from "@/components/results/semiconductor-intelligence";
import { VisualIntelligencePanel } from "@/components/results/visual-intelligence";
import { OpportunitiesPanel } from "@/components/results/opportunities-panel";
import { VoiceInterface } from "@/components/demo/voice-interface";
import { Play, Terminal, Volume2, LayoutDashboard, FileText, Cpu as CpuIcon, BarChart3, Globe as GlobeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiAssistantBubble } from "@/components/demo/ai-assistant-bubble";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState<string | null>(
    () => getInitialQueryFromUrl() // Restore from URL on load
  );
  const [mode, setMode] = useState<"general" | "semiconductor">("general");
  const [demoMode, setDemoMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [activeAutoStep, setActiveAutoStep] = useState<number | null>(null);
  const { addToHistory } = useSearchHistory();

  const { data, isLoading, isError, error, isFetching } = useAnalyze(searchQuery, mode);

  useEffect(() => {
    if (data && speechEnabled && !isLoading && !isFetching) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = `Analysis complete for ${data.query}. ${data.futureSignal?.prediction || ''}`;
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [data, speechEnabled]);

  const handleStartAutoDemo = async () => {
    setDemoMode(true);
    const steps = [
      { id: "radar-section", label: "Radar Analysis", tab: "overview" },
      { id: "map-section", label: "Global Research Race", tab: "overview" },
      { id: "research-section", label: "Research Deep-Dive", tab: "research" },
      { id: "semi-section", label: "Semiconductor Intel", tab: "semiconductor" },
      { id: "prototype-section", label: "Hardware Architect", tab: "semiconductor" },
      { id: "strategy-section", label: "Strategic Outlook", tab: "strategy" }
    ];

    for (let i = 0; i < steps.length; i++) {
      setActiveAutoStep(i);

      // Select the correct tab first
      const tabTrigger = document.querySelector(`[data-value="${steps[i].tab}"]`) as HTMLElement;
      if (tabTrigger) tabTrigger.click();

      await new Promise(r => setTimeout(r, 800)); // Wait for tab switch animation

      const el = document.getElementById(steps[i].id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-primary", "scale-[1.02]", "shadow-[0_0_50px_rgba(var(--primary),0.5)]", "z-50");
        await new Promise(r => setTimeout(r, 3500));
        el.classList.remove("ring-4", "ring-primary", "scale-[1.02]", "shadow-[0_0_50px_rgba(var(--primary),0.5)]", "z-50");
      }
    }
    setActiveAutoStep(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    addToHistory(query);
    syncQueryToUrl(query);
  };

  const handleVoiceCommand = (command: string) => {
    const clean = command.toLowerCase();
    if (clean.includes("analyze") || clean.includes("show") || clean.includes("tech")) {
      const query = clean.replace(/analyze|show|tech|trends|semiconductor/g, "").trim();
      if (query) {
        if (clean.includes("semiconductor") || clean.includes("chip")) setMode("semiconductor");
        handleSearch(query);
      }
    }
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

          <div className="w-full max-w-4xl flex flex-col items-center gap-10">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery || ""} isLarge={!searchQuery} />

            <div className="flex flex-col items-center gap-6 w-full">
              {/* Primary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setMode(mode === "general" ? "semiconductor" : "general")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${mode === "semiconductor"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Cpu className={`w-4 h-4 ${mode === "semiconductor" ? 'text-cyan-400' : ''}`} />
                  <span className="text-sm font-bold uppercase tracking-wide">Semiconductor Mode</span>
                </button>

                <button
                  onClick={() => setDemoMode(!demoMode)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${demoMode
                    ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Play className={`w-4 h-4 ${demoMode ? 'fill-current' : ''}`} />
                  <span className="text-sm font-bold uppercase tracking-wide">Demo Highlights</span>
                </button>

                <button
                  onClick={handleStartAutoDemo}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${activeAutoStep !== null
                    ? "bg-accent border-accent text-accent-foreground shadow-[0_0_20px_rgba(var(--accent),0.4)] animate-pulse"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white font-medium"
                    }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wide">Auto-Run Demo</span>
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-white/5 w-full max-w-xs justify-center">
                <VoiceInterface
                  onCommand={handleVoiceCommand}
                  isSpeaking={isSpeaking}
                  onToggleSpeech={setSpeechEnabled}
                  speechEnabled={speechEnabled}
                />
              </div>
            </div>
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

                      <div className="flex items-center gap-2">
                        <ResearchBriefButton query={data.query} />
                        <ExportButton data={data} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {data.keywords.map((kw: string) => (
                        <span key={kw} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-mono mb-1">Fetched at</p>
                      <p className="text-sm text-white font-mono">
                        {data?.fetched_at
                          ? new Date(data.fetched_at).toLocaleString()
                          : new Date().toLocaleString()}
                      </p>
                    </div>
                    <MethodologyModal />
                  </div>
                </div>

                {/* Compact Tabbed Dashboard - Floating Nav Style */}
                <Tabs defaultValue="overview" className="w-full relative">
                  <div className="sticky top-4 z-[100] w-full flex justify-center mb-8 px-4">
                    <TabsList className="bg-card/80 backdrop-blur-xl border border-white/10 p-1 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-1">
                      <TabsTrigger value="overview" data-value="overview" className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Overview</span>
                      </TabsTrigger>
                      <TabsTrigger value="map" data-value="map" className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all">
                        <GlobeIcon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Map</span>
                      </TabsTrigger>
                      <TabsTrigger value="research" data-value="research" className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Research</span>
                      </TabsTrigger>
                      <TabsTrigger value="semiconductor" data-value="semiconductor" className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                        <CpuIcon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Semiconductor</span>
                      </TabsTrigger>
                      <TabsTrigger value="strategy" data-value="strategy" className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-[0_0_20px_rgba(var(--accent),0.3)] transition-all">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Strategy</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    {/* KPI Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Papers Found", value: data.arxiv_count, icon: <BookOpen className="w-4 h-4" />, color: "text-primary" },
                        { label: "Repositories", value: data.github_count, icon: <Github className="w-4 h-4" />, color: "text-accent" },
                        { label: "Trend Score", value: `${data.trend_score}/100`, icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400" },
                        { label: "Investment", value: data.investmentSignal || "N/A", icon: <BarChart2 className="w-4 h-4" />, color: data.investmentSignal === "HIGH" ? "text-emerald-400" : data.investmentSignal === "MEDIUM" ? "text-yellow-400" : "text-muted-foreground" },
                      ].map((kpi, i) => (
                        <motion.div
                          key={kpi.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="glass-card rounded-xl p-4 flex flex-col gap-2"
                        >
                          <div className={`flex items-center gap-2 ${kpi.color}`}>
                            {kpi.icon}
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
                          </div>
                          <p className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        id="radar-section"
                        className="scroll-mt-32 transition-all duration-500 rounded-2xl"
                      >
                        <TopicRadar keywords={data.keywords} trendScore={data.trend_score} />
                      </motion.div>
                      {data.monitoring && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="h-full"
                        >
                          <MonitoringAgent monitoring={data.monitoring} query={data.query} />
                        </motion.div>
                      )}
                    </div>

                    {/* Trend Timeline */}
                    {data.timeline && data.timeline.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <TrendTimeline timeline={data.timeline} />
                      </motion.div>
                    )}

                    {/* Startup Opportunities */}
                    {data.opportunities && data.opportunities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <OpportunitiesPanel opportunities={data.opportunities} query={data.query} />
                      </motion.div>
                    )}
                  </TabsContent>

                  {/* Map Tab */}
                  <TabsContent value="map" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {data.globalActivity && data.globalActivity.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        id="map-section"
                        className="scroll-mt-32 transition-all duration-500 rounded-2xl"
                      >
                        <GlobalResearchMap activity={data.globalActivity} />
                      </motion.div>
                    )}
                    {demoMode && data.futureSignal && data.potentialScore && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-6"
                      >
                        <VisualIntelligencePanel
                          futureSignal={data.futureSignal}
                          potentialScore={data.potentialScore}
                          globalActivity={data.globalActivity || []}
                        />
                      </motion.div>
                    )}
                  </TabsContent>

                  {/* Research Tab */}
                  <TabsContent value="research" id="research-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Papers Feed */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-4 text-white"
                      >
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <h3 className="text-xl font-bold">Research Papers</h3>
                        </div>
                        <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 pb-4">
                          {data.items.arxiv.length > 0 ? (
                            data.items.arxiv.map((paper: any) => (
                              <PaperCard key={paper.id} paper={paper} />
                            ))
                          ) : (
                            <div className="p-8 text-center text-muted-foreground glass-card rounded-xl">No recent papers found.</div>
                          )}
                        </div>
                      </motion.div>

                      {/* Repos Feed */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-4 text-white"
                      >
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                          <Github className="w-5 h-5 text-accent" />
                          <h3 className="text-xl font-bold">Open Source Ecosystem</h3>
                        </div>
                        <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 pb-4">
                          {data.items.github.length > 0 ? (
                            data.items.github.map((repo: any) => (
                              <RepoCard key={repo.html_url} repo={repo} />
                            ))
                          ) : (
                            <div className="p-8 text-center text-muted-foreground glass-card rounded-xl">No trending repositories found.</div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>

                  {/* Semiconductor Tab */}
                  <TabsContent value="semiconductor" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {data.semiconductorIntelligence ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          id="semi-section"
                          className="scroll-mt-32 transition-all duration-500 rounded-2xl"
                        >
                          <SemiconductorIntelligencePanel intelligence={data.semiconductorIntelligence} />
                        </motion.div>
                      ) : (
                        <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
                          Semiconductor Intelligence is only available in Semiconductor Intelligence Mode.
                        </div>
                      )}

                      {data.skillRoadmap && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          className="h-full"
                        >
                          <SkillRoadmap roadmap={data.skillRoadmap} />
                        </motion.div>
                      )}

                      {data.prototype && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          id="prototype-section"
                          className="lg:col-span-2 scroll-mt-32 transition-all duration-500 rounded-2xl mt-4"
                        >
                          <PrototypeArchitecture prototype={data.prototype} />
                        </motion.div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Strategy Tab */}
                  <TabsContent value="strategy" id="strategy-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-6">
                        {data.futureOutlook && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                          >
                            <FutureOutlook text={data.futureOutlook} />
                          </motion.div>
                        )}
                        {data.strategicIntelligence && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                          >
                            <StrategicIntelligencePanel intelligence={data.strategicIntelligence} />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex flex-col gap-6">
                        {data.competitiveEcosystem && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            id="signals-section"
                            className="scroll-mt-32 transition-all duration-500 rounded-2xl"
                          >
                            <CompetitiveEcosystem ecosystem={data.competitiveEcosystem} />
                          </motion.div>
                        )}
                        {data.industrySignals && data.industrySignals.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                          >
                            <IndustrySignalsPanel signals={data.industrySignals} investmentSignal={data.investmentSignal} />
                          </motion.div>
                        )}
                        {(data.topLabs || data.topOrgs) && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                          >
                            <OrgIntelligence labs={data.topLabs || []} orgs={data.topOrgs || []} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

              </div>
            ) : null}
          </div>
        )}
      </div>
      <AiAssistantBubble />
    </Layout>
  );
}
