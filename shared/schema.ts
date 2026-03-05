import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const queryCache = pgTable("query_cache", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  source: text("source").notNull(),
  payload: json("payload").notNull(),
  fetchedAt: timestamp("fetched_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const runLog = pgTable("run_log", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  runTime: timestamp("run_time").defaultNow(),
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
  published: string;
  link: string;
};

export type GithubRepo = {
  name: string;
  html_url: string;
  stars: number;
  description: string | null;
};
