import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Type definitions matching the backend schema
export type AnalyzeResponse = {
  query: string;
  arxiv_count: number;
  github_count: number;
  keywords: string[];
  trend_score: number;
  radar: { rising: string[], emerging: string[], stable: string[], declining: string[] };
  timeline: Array<{ year: string, papers: number, repos: number }>;
  fetched_at: string;
  futureOutlook?: string;
  skillRoadmap?: Array<{ stage: string; skills: string[] }>;
  topLabs?: string[];
  topOrgs?: string[];
  globalActivity?: Array<{ country: string; papers: number; repos: number }>;
  insights?: string[];
  opportunities?: any[];
  industrySignals?: string[];
  competitiveEcosystem?: {
    topCompanies: string[];
    topStartups: string[];
    topOrgs: string[];
  };
  investmentSignal?: "LOW" | "MEDIUM" | "HIGH";
  strategicIntelligence?: {
    riskProfile: {
      maturity: string;
      uncertainty: string;
      marketRisk: string;
    };
    adoptionTimeline: string;
    recommendations: {
      engineers: string;
      startups: string;
      investors: string;
    };
  };
  monitoring?: {
    alerts: string[];
    discoveries: string[];
    weeklyReport: {
      newPapers: number;
      newRepos: number;
      emergingSignals: string[];
      investmentSignalUpdated: string;
    };
  };
  semiconductorIntelligence?: {
    highlights: any[];
    topProjects: any[];
    activeOrgs: string[];
    architectures: string[];
    skillRoadmap: string[];
    architectureDiagram: string[];
  };
  futureSignal?: {
    prediction: string;
    confidence: number;
    window: string;
  };
  potentialScore?: {
    score: number;
    investment: string;
    opportunity: string;
  };
  prototype?: {
    productConcept: string;
    targetUsers: string;
    techStack: string[];
    mvpSteps: string[];
    architectureDiagram: string[];
    marketPotential: number;
  };
  items: {
    arxiv: Array<{
      id: string;
      title: string;
      summary: string;
      aiSummary?: string;
      published: string;
      link: string;
      impactScore?: number;
      authors?: string[];
    }>;
    github: Array<{
      name: string;
      html_url: string;
      stars: number;
      description: string | null;
      created_at?: string;
      owner?: { login: string; type: string };
    }>;
  };
};

export type RunLogResponse = Array<{
  id: number;
  query: string;
  runTime: string | null;
  arxivCount: number | null;
  githubCount: number | null;
  durationMs: number | null;
}>;

export type HealthResponse = {
  status: string;
  time: string;
};

// Hooks
export function useAnalyze(query: string | null, mode: "general" | "semiconductor" = "general") {
  return useQuery<AnalyzeResponse, Error>({
    queryKey: [api.analyze.get.path, query, mode],
    queryFn: async () => {
      if (!query) throw new Error("Query is required");

      const searchParams = new URLSearchParams({ q: query, mode });
      const res = await fetch(`${api.analyze.get.path}?${searchParams.toString()}`, {
        credentials: "include"
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to analyze' }));
        throw new Error(error.message || 'An error occurred during analysis');
      }

      return await res.json();
    },
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useRunLogs() {
  return useQuery<RunLogResponse, Error>({
    queryKey: [api.runlog.get.path],
    queryFn: async () => {
      const res = await fetch(api.runlog.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return await res.json();
    },
    refetchInterval: 10000, // Refresh logs every 10s
  });
}

export function useSystemHealth() {
  return useQuery<HealthResponse, Error>({
    queryKey: [api.health.get.path],
    queryFn: async () => {
      const res = await fetch(api.health.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("System is degraded");
      return await res.json();
    },
    refetchInterval: 30000,
  });
}

// ─── Search History Hook ─────────────────────────────────────────────────────────
// Persists recent searches in localStorage and exposes add/clear helpers.
import { useState, useCallback } from "react";

const HISTORY_KEY = "rr_search_history";
const HISTORY_MAX = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    setHistory(prev => {
      // Remove duplicate if exists, then prepend
      const deduped = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...deduped].slice(0, HISTORY_MAX);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}

// ─── URL Sync Utility ───────────────────────────────────────────────────────────
// Reads ?q= param from the URL to restore a search on page load.
export function getInitialQueryFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    return q && q.length >= 2 ? q : null;
  } catch {
    return null;
  }
}

/** Push the current search query to the browser URL as a query param */
export function syncQueryToUrl(query: string | null) {
  try {
    const url = new URL(window.location.href);
    if (query && query.length >= 2) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
  } catch {}
}
