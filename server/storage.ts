import { db } from "./db";
import { queryCache, runLog, type InsertQueryCache, type QueryCache, type InsertRunLog, type RunLog } from "@shared/schema";
import { eq, and, gt, desc } from "drizzle-orm";

export interface IStorage {
  getCachedQuery(query: string, source: string): Promise<QueryCache | undefined>;
  setCachedQuery(data: InsertQueryCache): Promise<QueryCache>;
  logRun(data: InsertRunLog): Promise<RunLog>;
  getRunLogs(limit?: number): Promise<RunLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getCachedQuery(query: string, source: string): Promise<QueryCache | undefined> {
    const [result] = await db.select()
      .from(queryCache)
      .where(
        and(
          eq(queryCache.query, query),
          eq(queryCache.source, source),
          gt(queryCache.expiresAt, new Date())
        )
      );
    return result;
  }

  async setCachedQuery(data: InsertQueryCache): Promise<QueryCache> {
    const [result] = await db.insert(queryCache).values(data).returning();
    return result;
  }

  async logRun(data: InsertRunLog): Promise<RunLog> {
    const [result] = await db.insert(runLog).values(data).returning();
    return result;
  }

  async getRunLogs(limit: number = 10): Promise<RunLog[]> {
    return await db.select().from(runLog).limit(limit).orderBy(desc(runLog.runTime));
  }
}

export const storage = new DatabaseStorage();
