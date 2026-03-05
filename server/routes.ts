import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Parser from "rss-parser";

const parser = new Parser();

// Simple stop words for keyword extraction
const stopWords = new Set(["the", "and", "to", "of", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have", "new", "more", "an", "was", "we", "will", "home", "can", "us", "about", "if", "page", "my", "has", "search", "free", "but", "our", "one", "other", "do", "no", "information", "time", "they", "site", "he", "up", "may", "what", "which", "their", "news", "out", "use", "any", "there", "see", "only", "so", "his", "when", "contact", "here", "business", "who", "web", "also", "now", "help", "get", "pm", "view", "online", "first", "am", "been", "would", "how", "were", "me", "s", "services", "some", "these", "click", "its", "like", "service", "x", "than", "find", "price", "date", "back", "top", "people", "had", "list", "name", "just", "over", "state", "year", "day", "into", "email", "two", "health", "n", "world", "re", "next", "used", "go", "b", "work", "last", "most", "products", "music", "buy", "data", "make", "them", "should", "product", "system", "post", "her", "city", "t", "add", "policy", "number", "such", "please", "available", "copyright", "support", "message", "after", "best", "software", "then", "jan", "good", "video", "well", "d", "where", "info", "rights", "public", "books", "high", "school", "through", "m", "each", "links", "she", "review", "years", "order", "very", "privacy", "book", "items", "company", "read", "group", "sex", "need", "many", "user", "said", "de", "does", "set", "under", "general", "research", "university", "january", "mail", "full", "map", "reviews", "program", "life"]);

function extractKeywords(text: string, count: number = 5): string[] {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (!stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(entry => entry[0]);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.health.get.path, (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get(api.runlog.get.path, async (req, res) => {
    try {
      const last = Number(req.query.last) || 10;
      const logs = await storage.getRunLogs(last);
      res.json(logs);
    } catch (e) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.analyze.get.path, async (req, res) => {
    const startTime = Date.now();
    try {
      const { q } = api.analyze.get.input.parse(req.query);
      
      const cacheSource = "combined";
      const cached = await storage.getCachedQuery(q, cacheSource);
      if (cached) {
        res.setHeader("X-Cache-Hit", "true");
        return res.json(cached.payload);
      }

      // Fetch Arxiv
      let arxivItems: any[] = [];
      try {
        const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(q)}&start=0&max_results=10`;
        const feed = await parser.parseURL(arxivUrl);
        arxivItems = feed.items.map(entry => ({
          id: entry.id?.split('/').pop() || "unknown",
          title: entry.title?.trim().replace(/\s+/g, ' ') || "No title",
          summary: entry.summary?.trim().replace(/\s+/g, ' ') || "",
          published: entry.isoDate || new Date().toISOString(),
          link: entry.link || "",
        }));
      } catch (err) {
        console.error("Arxiv fetch error:", err);
      }

      // Fetch Github
      let githubItems: any[] = [];
      try {
        // We do not require GITHUB_TOKEN for public search, but rate limit is strict.
        const ghHeaders: Record<string, string> = {
          "User-Agent": "Research-Radar-Demo",
          "Accept": "application/vnd.github.v3+json"
        };
        if (process.env.GITHUB_TOKEN) {
          ghHeaders["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
        }
        
        const ghUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=10`;
        const ghRes = await fetch(ghUrl, { headers: ghHeaders });
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          githubItems = (ghData.items || []).map((item: any) => ({
            name: item.full_name,
            html_url: item.html_url,
            stars: item.stargazers_count,
            description: item.description,
          }));
        } else {
          console.error("Github fetch error:", await ghRes.text());
        }
      } catch (err) {
        console.error("Github fetch error:", err);
      }

      // Combine text for keywords
      const allText = arxivItems.map(i => i.title + " " + i.summary).join(" ") + " " + githubItems.map(i => (i.description || "")).join(" ");
      const keywords = extractKeywords(allText, 6);

      // Trend score (dummy calculated based on result count for now, MVP)
      const trend_score = Math.min(1.0, (arxivItems.length + githubItems.length) / 20.0);

      const responsePayload = {
        query: q,
        arxiv_count: arxivItems.length,
        github_count: githubItems.length,
        keywords,
        trend_score,
        fetched_at: new Date().toISOString() + "Z",
        items: {
          arxiv: arxivItems,
          github: githubItems
        }
      };

      // Store in cache (expires in 10 mins)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await storage.setCachedQuery({
        query: q,
        source: cacheSource,
        payload: responsePayload,
        expiresAt
      });

      // Log run
      await storage.logRun({
        query: q,
        arxivCount: arxivItems.length,
        githubCount: githubItems.length,
        durationMs: Date.now() - startTime
      });

      res.setHeader("X-Cache-Hit", "false");
      res.json(responsePayload);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid query parameters" });
      }
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
