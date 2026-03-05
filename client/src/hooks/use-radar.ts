import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Type definitions matching the backend schema
export type AnalyzeResponse = {
  query: string;
  arxiv_count: number;
  github_count: number;
  keywords: string[];
  trend_score: number;
  fetched_at: string;
  items: {
    arxiv: Array<{
      id: string;
      title: string;
      summary: string;
      published: string;
      link: string;
    }>;
    github: Array<{
      name: string;
      html_url: string;
      stars: number;
      description: string | null;
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
export function useAnalyze(query: string | null) {
  return useQuery<AnalyzeResponse, Error>({
    queryKey: [api.analyze.get.path, query],
    queryFn: async () => {
      if (!query) throw new Error("Query is required");
      
      const searchParams = new URLSearchParams({ q: query });
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
