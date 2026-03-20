import { db } from "./db";
import {
  queryCache,
  runLog,
  type InsertQueryCache,
  type QueryCache,
  type InsertRunLog,
  type RunLog,
} from "@shared/schema";
import { eq, and, gt, lt, desc } from "drizzle-orm";

// ─── Storage Interface ────────────────────────────────────────────────────────
export interface IStorage {
  getCachedQuery(query: string, source: string): Promise<QueryCache | undefined>;
  setCachedQuery(data: InsertQueryCache): Promise<QueryCache | undefined>;
  logRun(data: InsertRunLog): Promise<RunLog | undefined>;
  getRunLogs(limit?: number): Promise<RunLog[]>;
  clearExpiredCache(): Promise<void>;
}

// ─── Database Storage Implementation ─────────────────────────────────────────
export class DatabaseStorage implements IStorage {

  /**
   * Retrieve a cached query result if it exists and has not expired.
   */
  async getCachedQuery(query: string, source: string): Promise<QueryCache | undefined> {
    try {
      const [result] = await db
        .select()
        .from(queryCache)
        .where(
          and(
            eq(queryCache.query, query),
            eq(queryCache.source, source),
            gt(queryCache.expiresAt, new Date())
          )
        );
      return result;
    } catch (err) {
      console.error("[storage] getCachedQuery failed:", err);
      return undefined; // Degrade gracefully — no cache hit
    }
  }

  /**
   * Store a query result in the cache. Returns undefined on failure
   * so the endpoint can still respond with fresh data.
   */
  async setCachedQuery(data: InsertQueryCache): Promise<QueryCache | undefined> {
    try {
      const [result] = await db.insert(queryCache).values(data).returning();
      return result;
    } catch (err) {
      console.error("[storage] setCachedQuery failed:", err);
      return undefined; // Non-fatal — we already have fresh data to return
    }
  }

  /**
   * Log a completed analysis run for system monitoring.
   */
  async logRun(data: InsertRunLog): Promise<RunLog | undefined> {
    try {
      const [result] = await db.insert(runLog).values(data).returning();
      return result;
    } catch (err) {
      console.error("[storage] logRun failed:", err);
      return undefined; // Non-fatal
    }
  }

  /**
   * Retrieve recent run logs ordered by most recent first.
   */
  async getRunLogs(limit: number = 10): Promise<RunLog[]> {
    try {
      return await db
        .select()
        .from(runLog)
        .limit(Math.min(limit, 100)) // cap to prevent huge queries
        .orderBy(desc(runLog.runTime));
    } catch (err) {
      console.error("[storage] getRunLogs failed:", err);
      return [];
    }
  }

  /**
   * Remove expired cache entries to keep the DB lean.
   * Called once at server startup.
   */
  async clearExpiredCache(): Promise<void> {
    try {
      await db
        .delete(queryCache)
        .where(lt(queryCache.expiresAt, new Date()));
      console.log("[storage] Expired cache entries cleared.");
    } catch (err) {
      console.error("[storage] clearExpiredCache failed:", err);
    }
  }
}

export const storage = new DatabaseStorage();
