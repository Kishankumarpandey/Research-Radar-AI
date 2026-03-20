import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const queryCache = sqliteTable("query_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  query: text("query").notNull(),
  source: text("source").notNull(),
  payload: text("payload", { mode: "json" }).notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).default(new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

export const runLog = sqliteTable("run_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  query: text("query").notNull(),
  runTime: integer("run_time", { mode: "timestamp" }).default(new Date()),
  arxivCount: integer("arxiv_count"),
  githubCount: integer("github_count"),
  durationMs: integer("duration_ms"),
});

export const insertQueryCacheSchema = createInsertSchema(queryCache).omit({ id: true, fetchedAt: true });
export const insertRunLogSchema = createInsertSchema(runLog).omit({ id: true, runTime: true });

export type QueryCache = typeof queryCache.$inferSelect;
export type InsertQueryCache = z.infer<typeof insertQueryCacheSchema>;

export type RunLog = typeof runLog.$inferSelect;
export type InsertRunLog = z.infer<typeof insertRunLogSchema>;

// Shared API Types
export type ArxivItem = {
  id: string;
  title: string;
  summary: string;
  aiSummary: string; // New AI summary field
  published: string;
  link: string;
  impactScore?: number;
  authors?: string[];
};

export type StartupOpportunity = {
  idea: string;
  problem: string;
  solution: string;
};

export type GithubRepo = {
  name: string;
  html_url: string;
  stars: number;
  description: string | null;
  created_at?: string;
  owner?: { login: string; type: string };
};
