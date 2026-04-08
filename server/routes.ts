import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Parser from "rss-parser";
import Groq from "groq-sdk";

// ─── Groq Client ─────────────────────────────────────────────────────────────
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;
const GROQ_MODEL = "llama-3.1-70b-versatile";

// ─── Local Summary Fallback (used when Groq is not configured) ───────────────
function generateLocalSummary(text: string): string {
  if (!text) return "No summary available.";
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, 2).join(" ").trim();
}

async function generateAISummaries(abstracts: string[]): Promise<string[]> {
  if (groq) {
    try {
      const results = await Promise.all(abstracts.map(async (text) => {
        try {
          const completion = await groq.chat.completions.create({
            messages: [{ role: "system", content: "Summarize this technical abstract in 2-3 short, concise sentences." }, { role: "user", content: text }],
            model: GROQ_MODEL,
          });
          return completion.choices[0]?.message?.content || generateLocalSummary(text);
        } catch (e) {
          return generateLocalSummary(text);
        }
      }));
      return results;
    } catch (e) { }
  }
  return abstracts.map(text => generateLocalSummary(text));
}

async function generateInsights(query: string, keywords: string[], arxivCount: number, githubCount: number): Promise<string[]> {
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "system", content: "Generate 2 simple tech trend insights (1 sentence each) based on the query, keywords, and repo counts. Output just the insights separated by a newline." }, { role: "user", content: `Query: ${query}, Keywords: ${keywords.join(", ")}, Papers: ${arxivCount}, Repos: ${githubCount}` }],
        model: GROQ_MODEL,
      });
      const lines = response.choices[0]?.message?.content?.split('\n').filter(l => l.trim().length > 0) || [];
      return lines.map(l => l.replace(/^-[*-]*\s+|- \s+/, '').trim()).slice(0, 2);
    } catch (e) { }
  }

  const signals = [];
  if (keywords.length > 0) {
    signals.push(`${keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1)} shows increasing research and repository activity.`);
  }
  if (githubCount > 0) {
    signals.push(`Open-source ecosystems for ${query} are gaining momentum in repositories.`);
  }
  if (signals.length === 0) {
    signals.push(`Steady academic momentum observed in the ${query} space.`);
  }
  return signals;
}

async function generateOpportunities(query: string, keywords: string[]): Promise<any[]> {
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: `Generate exactly 2 startup ideas based on the research. Return JSON strictly in this format: { "opportunities": [{ "idea": "...", "problem": "...", "solution": "..." }] }` },
          { role: "user", content: `Query: ${query}, Keywords: ${keywords.join(", ")}` }
        ],
        model: GROQ_MODEL,
        response_format: { type: "json_object" }
      });
      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      if (parsed.opportunities && Array.isArray(parsed.opportunities)) {
        return parsed.opportunities.slice(0, 2);
      }
    } catch (e) { }
  }

  const primary = keywords[0] || "Advanced Systems";
  const secondary = keywords[1] || "Technology";
  return [
    {
      idea: `AI-Powered tools for ${primary}.`,
      problem: `Manual workflows within ${primary} remain inefficient.`,
      solution: `Deploy models to automate processes specifically targeting ${secondary}.`
    },
    {
      idea: `Open-source platform for ${secondary} integration.`,
      problem: `Fragmented ecosystems in current ${secondary} frameworks.`,
      solution: `Create a unified hub standardizing APIs for ${primary} ecosystems.`
    }
  ];
}

async function generateFutureOutlook(query: string, keywords: string[], arxivCount: number, githubCount: number): Promise<string> {
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "system", content: "You are a tech forecaster. Predict the 3-5 year future growth of this technology in exactly one compelling sentence based on research and open-source momentum." }, { role: "user", content: `Topic: ${query}, Keywords: ${keywords.join(", ")}, Papers: ${arxivCount}, Repos: ${githubCount}` }],
        model: GROQ_MODEL,
      });
      return response.choices[0]?.message?.content || "";
    } catch (e) { }
  }

  if (arxivCount > 5 || githubCount > 5) {
    return `${query.charAt(0).toUpperCase() + query.slice(1)} is expected to grow significantly due to compounding research volume and emerging open-source tooling.`;
  }
  return `The evolution of ${query} will likely stabilize as its foundational research matures over the coming years.`;
}

async function generateSkillRoadmap(query: string, keywords: string[]): Promise<Array<{ stage: string, skills: string[] }>> {
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "system", content: `Generate a 3-stage learning roadmap for engineers pursuing this technology. strict JSON format: { "roadmap": [{ "stage": "...", "skills": ["...", "..."] }] }` }, { role: "user", content: `Topic: ${query}, Context: ${keywords.join(", ")}` }],
        model: GROQ_MODEL,
        response_format: { type: "json_object" }
      });
      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      if (parsed.roadmap && Array.isArray(parsed.roadmap)) return parsed.roadmap;
    } catch (e) { }
  }

  // Fallback
  return [
    { stage: "Foundational Concepts", skills: [keywords[0] || "Architecture Basics", "Programming Logic"] },
    { stage: "Core Implementation", skills: [keywords[1] || "System Integration", "Toolchain Workflows"] },
    { stage: "Advanced Optimization", skills: [keywords[2] || "Hardware Scaling", "Performance Tuning"] }
  ];
}

async function generatePrototype(query: string, keywords: string[], marketPotential: number): Promise<any> {
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "system", content: 'You are an AI product architect. Create a product prototype based on the research topic. Return JSON ONLY matching: { "productConcept": "string", "targetUsers": "string", "techStack": ["string"], "mvpSteps": ["string"], "architectureDiagram": ["string"] }' }, { role: "user", content: `Topic: ${query}, Keywords: ${keywords.join(", ")}` }],
        model: GROQ_MODEL,
        response_format: { type: "json_object" }
      });
      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      if (parsed.productConcept) {
        return { ...parsed, marketPotential };
      }
    } catch (e) { }
  }

  // Rule-based fallback
  return {
    productConcept: `Advanced enterprise platform leveraging ${keywords[0] || 'core technologies'}.`,
    targetUsers: `Data Scientists, Engineers, and Enterprise Research Labs.`,
    techStack: [keywords[0] || 'Python', keywords[1] || 'Node.js', keywords[2] || 'PostgreSQL', 'Docker', 'React'],
    mvpSteps: [
      `Data integration and basic model setup.`,
      `Prototype core algorithm benchmarking.`,
      `Deploy API infrastructure.`,
      `Create specialized user dashboard.`
    ],
    architectureDiagram: ["Data Input Layer", "Processing Subsystem", "Analysis Engine", "Client Application Interface"],
    marketPotential
  };
}

async function fetchIndustrySignals(query: string, keywords: string[]): Promise<string[]> {
  try {
    const hnUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=3`;
    const res = await fetch(hnUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.hits && data.hits.length > 0) {
        return data.hits.map((h: any) => h.title).filter(Boolean).slice(0, 3);
      }
    }
  } catch (e) {
    console.error("News fetch error", e);
  }

  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "system", content: "You are a tech journalist. Generate 2 plausible latest industry news headlines regarding the topic. Output only the sentences separated by newline." }, { role: "user", content: `Topic: ${query}, Keywords: ${keywords.join(", ")}` }],
        model: GROQ_MODEL,
      });
      const lines = response.choices[0]?.message?.content?.split('\n').filter(l => l.trim().length > 0) || [];
      return lines.map(l => l.replace(/^-[*-]*\s+|- \s+/, '').trim()).slice(0, 2);
    } catch (e) { }
  }

  return [`Major investments observed in ${keywords[0] || query} technology sectors.`, `Open-source growth driving enterprise adoption for ${keywords[1] || query} tools.`];
}

function computeInvestmentSignal(papers: number, repos: number, newsCount: number): "LOW" | "MEDIUM" | "HIGH" {
  const score = (papers * 2) + (repos * 3) + (newsCount * 10);
  if (score > 40) return "HIGH";
  if (score > 15) return "MEDIUM";
  return "LOW";
}

async function generateStrategicIntelligence(query: string, keywords: string[], arxivCount: number, githubCount: number, newsCount: number): Promise<any> {
  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a tech strategist. Analyze the given technology. Return JSON strictly formatted as: { \"riskProfile\": { \"maturity\": \"Low|Medium|High\", \"uncertainty\": \"Low|Medium|High\", \"marketRisk\": \"Low|Medium|High\" }, \"adoptionTimeline\": \"string\", \"recommendations\": { \"engineers\": \"string\", \"startups\": \"string\", \"investors\": \"string\" } }" },
          { role: "user", content: `Query: ${query}, Keywords: ${keywords.join(", ")}, Papers: ${arxivCount}, Repos: ${githubCount}, News: ${newsCount}` }
        ],
        model: GROQ_MODEL,
        response_format: { type: "json_object" }
      });
      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      if (parsed.riskProfile) return parsed;
    } catch (e) { }
  }

  // Heuristics Fallback
  const highResearch = arxivCount > 5;
  const highGithub = githubCount > 5;
  const highNews = newsCount > 1;

  let adoptionTimeline = "Unknown timeline";
  if (highResearch && highGithub && highNews) adoptionTimeline = "Estimated mainstream adoption: 1-3 years";
  else if (highResearch && highGithub) adoptionTimeline = "Estimated mainstream adoption: 3-5 years";
  else if (highResearch) adoptionTimeline = "Estimated mainstream adoption: 5-8 years";
  else adoptionTimeline = "Estimated mainstream adoption: 8+ years";

  return {
    riskProfile: {
      maturity: (highGithub && highNews) ? "High" : (highGithub || highResearch) ? "Medium" : "Low",
      uncertainty: (!highResearch && !highGithub) ? "High" : (highResearch && !highGithub) ? "Medium" : "Low",
      marketRisk: (!highGithub && !highNews) ? "High" : (highGithub && !highNews) ? "Medium" : "Low"
    },
    adoptionTimeline,
    recommendations: {
      engineers: `Learning ${keywords[0] || 'core ecosystem framework'} is recommended due to positive signals.`,
      startups: `Favorable opportunity for tooling and integration layers referencing ${keywords[1] || 'current trends'}.`,
      investors: (highNews || highGithub) ? "Strong investment opportunity due to clear growth markers and active ecosystem." : "Moderate investment risk profile, monitor academic maturity."
    }
  };
}

async function generateMonitoringIntelligence(query: string, keywords: string[], arxivItems: any[], githubItems: any[], newsCount: number): Promise<any> {
  const arxivSpike = arxivItems.length >= 5;
  const githubSpike = githubItems.length >= 5;
  const newsSpike = newsCount >= 2;

  const alerts = [];
  if (arxivSpike) alerts.push(`Alert: Rapid academic growth detected in ${query} research.`);
  if (githubSpike) alerts.push(`Alert: GitHub repository creation is accelerating for ${query}.`);
  if (newsSpike) alerts.push(`Alert: Industry news mentions peaking for ${keywords[0] || query}.`);
  if (alerts.length === 0) alerts.push(`Monitoring: Steady baseline activity for ${query}.`);

  const discoveries = arxivItems.slice(0, 2).map((i: any) => `Research Breakthrough: ${i.title}`);
  if (githubItems.length > 0) discoveries.push(`Emerging Project: ${githubItems[0].name}`);

  return {
    alerts,
    discoveries,
    weeklyReport: {
      newPapers: Math.max(1, Math.floor(arxivItems.length / 2)),
      newRepos: Math.max(1, Math.floor(githubItems.length / 2)),
      emergingSignals: [
        `${keywords[0] ? keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1) : 'Core tech'} adoption is tracking positively.`,
        `Open-source maintenance for ${query} is accelerating.`
      ],
      investmentSignalUpdated: computeInvestmentSignal(arxivItems.length, githubItems.length, newsCount)
    }
  };
}

function generateSemiconductorIntelligence(arxivItems: any[], githubItems: any[], keywords: string[]) {
  const chipKeywords = ["vlsi", "semiconductor", "risc-v", "ai accelerator", "neuromorphic", "edge", "fpga", "eda", "hardware", "chip"];
  const textAll = [...arxivItems.map(i => i.title + " " + i.summary), ...githubItems.map(i => i.name + " " + (i.description || ""))].join(" ");

  let highlights = arxivItems.filter(p => chipKeywords.some(k => p.title.toLowerCase().includes(k) || p.summary.toLowerCase().includes(k))).slice(0, 3);
  let topProjects = githubItems.filter(r => chipKeywords.some(k => (r.description && r.description.toLowerCase().includes(k)) || r.name.toLowerCase().includes(k))).slice(0, 3);

  if (highlights.length === 0) highlights = arxivItems.slice(0, 2);
  if (topProjects.length === 0) topProjects = githubItems.slice(0, 2);

  const knownOrgs = ["NVIDIA", "Intel", "AMD", "Qualcomm", "OpenHW Group", "Arm", "TSMC", "SiFive"];
  let activeOrgs = knownOrgs.filter(org => textAll.toLowerCase().includes(org.toLowerCase()));
  if (activeOrgs.length === 0) {
    activeOrgs = ["University Hardware Labs", "Independent Research Groups", "Open Source Silicon Coalition"];
  }

  const archs = ["AI Accelerators", "Neuromorphic Processors", "Edge Inference Chips", "RISC-V Ecosystems", "In-Memory Computing", "Chiplet Architectures"]
    .filter(a => textAll.toLowerCase().includes(a.split(' ')[0].toLowerCase()));
  if (archs.length === 0) {
    archs.push("Custom ASICs", "FPGA Prototyping", "Domain-Specific Architectures");
  }

  const diagramBase = ["Input Layer", "Processing Engine", "Main Controller", "Memory Subsystem", "Output Interface"];
  if (textAll.toLowerCase().includes("neural") || textAll.toLowerCase().includes("ai")) {
    diagramBase[1] = "Neural Accelerator";
  }
  if (textAll.toLowerCase().includes("memory")) {
    diagramBase[3] = "Memory Controller";
  }
  if (textAll.toLowerCase().includes("data") || textAll.toLowerCase().includes("pipeline")) {
    diagramBase[1] = "Data Pipeline";
  }

  return {
    highlights: highlights.slice(0, 3),
    topProjects: topProjects.slice(0, 3),
    activeOrgs: Array.from(new Set(activeOrgs)).slice(0, 4),
    architectures: archs.slice(0, 4),
    skillRoadmap: ["Verilog", "SystemVerilog", "FPGA prototyping", "EDA tools", "Hardware ML optimization"],
    architectureDiagram: diagramBase
  };
}

const parser = new Parser();

// Simple stop words for keyword extraction
const stopWords = new Set(["the", "and", "to", "of", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have", "new", "more", "an", "was", "we", "will", "home", "can", "us", "about", "if", "page", "my", "has", "search", "free", "but", "our", "one", "other", "do", "no", "information", "time", "they", "site", "he", "up", "may", "what", "which", "their", "news", "out", "use", "any", "there", "see", "only", "so", "his", "when", "contact", "here", "business", "who", "web", "also", "now", "help", "get", "pm", "view", "online", "first", "am", "been", "would", "how", "were", "me", "s", "services", "some", "these", "click", "its", "like", "service", "x", "than", "find", "price", "date", "back", "top", "people", "had", "list", "name", "just", "over", "state", "year", "day", "into", "email", "two", "health", "n", "world", "re", "next", "used", "go", "b", "work", "last", "most", "products", "music", "buy", "data", "make", "them", "should", "product", "system", "post", "her", "city", "t", "add", "policy", "number", "such", "please", "available", "copyright", "support", "message", "after", "best", "software", "then", "jan", "good", "video", "well", "d", "where", "info", "rights", "public", "books", "high", "school", "through", "m", "each", "links", "she", "review", "years", "order", "very", "privacy", "book", "items", "company", "read", "group", "sex", "need", "many", "user", "said", "de", "does", "set", "under", "general", "research", "university", "january", "mail", "full", "map", "reviews", "program", "life"]);

const INSTITUTION_COUNTRY_MAP: Record<string, string> = {
  "MIT": "United States of America",
  "Massachusetts Institute of Technology": "United States of America",
  "Stanford": "United States of America",
  "Berkeley": "United States of America",
  "Harvard": "United States of America",
  "Carnegie Mellon": "United States of America",
  "CMU": "United States of America",
  "UCLA": "United States of America",
  "Google": "United States of America",
  "Microsoft": "United States of America",
  "Meta": "United States of America",
  "Groq": "United States of America",
  "Tsinghua": "China",
  "Peking": "China",
  "Alibaba": "China",
  "Tencent": "China",
  "Baidu": "China",
  "Huawei": "China",
  "ETH Zurich": "Switzerland",
  "EPFL": "Switzerland",
  "IIT": "India",
  "Indian Institute of Technology": "India",
  "Oxford": "United Kingdom",
  "Cambridge": "United Kingdom",
  "DeepMind": "United Kingdom",
  "UCL": "United Kingdom",
  "Toronto": "Canada",
  "Waterloo": "Canada",
  "Mila": "Canada",
  "Max Planck": "Germany",
  "CNRS": "France",
  "INRIA": "France",
  "NUS": "Singapore",
  "NTU": "Singapore",
  "A*STAR": "Singapore",
  "Tokyo": "Japan",
  "Kyoto": "Japan",
  "Seoul National": "South Korea",
  "KAIST": "South Korea",
  "UNSW": "Australia",
  "Melbourne": "Australia",
  "CSIRO": "Australia"
};

function inferCountry(text: string): string {
  if (!text) return "Unknown Region";
  for (const [inst, country] of Object.entries(INSTITUTION_COUNTRY_MAP)) {
    if (text.toLowerCase().includes(inst.toLowerCase())) {
      return country;
    }
  }
  return "Unknown Region";
}

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

  // Clean up stale cache entries on startup
  await storage.clearExpiredCache();

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
      const { q, mode } = api.analyze.get.input.parse(req.query);

      const cacheSource = "combined";
      const cacheKey = mode === "semiconductor" ? `${q}_semi` : q;
      const cached = await storage.getCachedQuery(cacheKey, cacheSource);
      if (cached) {
        res.setHeader("X-Cache-Hit", "true");
        return res.json(cached.payload);
      }

      let actualQuery = q;
      if (mode === "semiconductor") {
        actualQuery = `${q} AND (VLSI OR semiconductor OR processor)`;
      }

      // Fetch Arxiv
      let arxivItems: any[] = [];
      try {
        const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(actualQuery)}&start=0&max_results=10`;
        const feed = await parser.parseURL(arxivUrl);
        arxivItems = (feed?.items || []).map(entry => {
          let authors: string[] = [];
          if (entry.creator) authors.push(entry.creator);

          return {
            id: entry?.id?.split('/').pop() || "unknown",
            title: entry?.title?.trim().replace(/\s+/g, ' ') || "No title",
            summary: entry?.summary?.trim().replace(/\s+/g, ' ') || "No summary",
            published: entry?.isoDate || new Date().toISOString(),
            link: entry?.link || "",
            authors: authors.length > 0 ? authors : ["Unknown Author"]
          };
        });
        console.log(`[ArXiv API] Successfully fetched ${arxivItems.length} items.`, JSON.stringify(arxivItems, null, 2));
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
          const rawItems = ghData?.items || [];
          githubItems = rawItems.map((item: any) => ({
            name: item?.full_name || "Unknown Repo",
            html_url: item?.html_url || "#",
            stars: item?.stargazers_count || 0,
            description: item?.description || "No description provided",
            created_at: item?.created_at || new Date().toISOString(),
            owner: item?.owner ? { login: item.owner.login, type: item.owner.type } : { login: "Unknown", type: "User" }
          }));
          console.log(`[GitHub API] Successfully fetched ${githubItems.length} items.`, JSON.stringify(githubItems, null, 2));
        } else {
          console.error("Github fetch error:", await ghRes.text());
        }
      } catch (err) {
        console.error("Github fetch error:", err);
      }

      // Combine text for keywords
      const allText = arxivItems.map(i => i.title + " " + i.summary).join(" ") + " " + githubItems.map(i => (i.description || "")).join(" ");
      let keywords = extractKeywords(allText, 6);

      if (!keywords || keywords.length === 0) {
        keywords = extractKeywords(q + " research technology data analysis trends innovation", 6);
      }

      // Trend score scaled up to 100
      const trend_score = Math.round(Math.min(1.0, (arxivItems.length + githubItems.length) / 20.0) * 100);

      // AI Integrations
      const summaries = await generateAISummaries(arxivItems.map(i => i.summary));
      // Timeline Calculation
      const timelineMap: Record<string, { papers: number, repos: number }> = {};
      arxivItems.forEach(i => {
        const yr = new Date(i.published).getFullYear().toString();
        if (!timelineMap[yr]) timelineMap[yr] = { papers: 0, repos: 0 };
        timelineMap[yr].papers++;
      });
      githubItems.forEach(i => {
        const yr = new Date(i.created_at).getFullYear().toString();
        if (!timelineMap[yr]) timelineMap[yr] = { papers: 0, repos: 0 };
        timelineMap[yr].repos++;
      });
      const timeline = Object.keys(timelineMap).sort().map(year => ({
        year,
        papers: timelineMap[year].papers,
        repos: timelineMap[year].repos
      }));

      // Radar Map Classification (distribute keywords)
      const radar = { rising: [] as string[], emerging: [] as string[], stable: [] as string[], declining: [] as string[] };
      const zones = ["rising", "emerging", "stable", "declining"] as const;
      keywords.forEach((kw, idx) => {
        radar[zones[idx % 4]].push(kw);
      });

      // Impact Scores
      arxivItems.forEach((item, idx) => {
        item.aiSummary = summaries[idx] || "Summary processing failed.";

        // Deterministic impact score based on publication year (no Math.random)
        const pubYear = new Date(item.published).getFullYear();
        const currentYear = new Date().getFullYear();
        const recency = Math.max(0, currentYear - pubYear);
        const base = Math.max(40, 95 - recency * 10);
        // Add a stable pseudo-random offset based on paper ID hash
        const idHash = item.id.split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
        item.impactScore = Math.min(100, base + (idHash % 15));
      });

      const insights = await generateInsights(q, keywords, arxivItems.length, githubItems.length);
      const opportunities = await generateOpportunities(q, keywords);
      const futureOutlook = await generateFutureOutlook(q, keywords, arxivItems.length, githubItems.length);
      const skillRoadmap = await generateSkillRoadmap(q, keywords);

      const industrySignals = await fetchIndustrySignals(q, keywords);
      const investmentSignal = computeInvestmentSignal(arxivItems.length, githubItems.length, industrySignals.length);
      const strategicIntelligence = await generateStrategicIntelligence(q, keywords, arxivItems.length, githubItems.length, industrySignals.length);
      const monitoring = await generateMonitoringIntelligence(q, keywords, arxivItems, githubItems, industrySignals.length);

      let semiconductorIntelligence = undefined;
      if (mode === "semiconductor") {
        semiconductorIntelligence = generateSemiconductorIntelligence(arxivItems, githubItems, keywords);
      }

      const marketPotential = Math.round(Math.min(100, trend_score + (keywords.length * 2) + Math.random() * 10 + 10));
      const prototype = await generatePrototype(q, keywords, marketPotential);

      const futureSignal = {
        prediction: `${keywords[0] || q} is showing explosive growth signals in local and global markets.`,
        confidence: 85 + Math.floor(Math.random() * 10),
        window: arxivItems.length > 5 ? "1-2 years" : "3-5 years"
      };

      const potentialScore = {
        score: marketPotential,
        investment: investmentSignal,
        opportunity: marketPotential > 80 ? "STRONG" : "MODERATE"
      };

      // Lab/Org Intelligence & Global Activity
      const labFreq: Record<string, number> = {};
      const globalActivityMap: Record<string, { papers: number, repos: number }> = {};

      arxivItems.forEach(i => {
        i.authors?.forEach((a: string) => { labFreq[a] = (labFreq[a] || 0) + 1; });

        let country = "Unknown Region";
        if (i.authors) country = inferCountry(i.authors.join(" "));
        if (country === "Unknown Region") country = inferCountry(i.summary + " " + i.title);

        if (country !== "Unknown Region") {
          if (!globalActivityMap[country]) globalActivityMap[country] = { papers: 0, repos: 0 };
          globalActivityMap[country].papers++;
        }
      });
      const topLabs = Object.entries(labFreq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0] + " Research Group"); // Mock association if no true affiliation available locally

      const orgFreq: Record<string, number> = {};
      githubItems.forEach(i => {
        if (i.owner?.type === "Organization") {
          orgFreq[i.owner.login] = (orgFreq[i.owner.login] || 0) + 1;
        }

        let country = "Unknown Region";
        if (i.owner?.login) country = inferCountry(i.owner.login);
        if (country === "Unknown Region" && i.description) country = inferCountry(i.description);

        if (country !== "Unknown Region") {
          if (!globalActivityMap[country]) globalActivityMap[country] = { papers: 0, repos: 0 };
          globalActivityMap[country].repos++;
        }
      });
      const topOrgs = Object.entries(orgFreq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

      // Simple mock for Competitive Ecosystem Startup extraction based on keywords
      const startupMock = keywords.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1) + " AI Systems");
      const companiesMock = ["Microsoft", "Google DeepMind", "Meta AI"].slice(0, arxivItems.length > 5 ? 3 : 1);

      const competitiveEcosystem = {
        topCompanies: companiesMock,
        topStartups: startupMock,
        topOrgs: topOrgs.length > 0 ? topOrgs.slice(0, 3) : ["Groq", "Linux Foundation"]
      };

      const globalActivity = Object.keys(globalActivityMap).map(country => ({
        country,
        papers: globalActivityMap[country].papers,
        repos: globalActivityMap[country].repos
      }));


      const responsePayload = {
        query: q,
        arxiv_count: arxivItems.length,
        github_count: githubItems.length,
        keywords,
        trend_score,
        radar,
        timeline,
        fetched_at: new Date().toISOString(),
        futureOutlook,
        skillRoadmap,
        topLabs: topLabs.length > 0 ? topLabs : ["Independent Academic Researchers"],
        topOrgs: topOrgs.length > 0 ? topOrgs : ["Community Open Source Contributors"],
        globalActivity,
        insights,
        opportunities,
        industrySignals,
        competitiveEcosystem,
        investmentSignal,
        strategicIntelligence,
        monitoring,
        semiconductorIntelligence,
        futureSignal,
        potentialScore,
        prototype,
        items: {
          arxiv: arxivItems,
          github: githubItems
        }
      };

      // Store in cache (expires in 10 mins) — non-fatal if DB write fails
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await storage.setCachedQuery({
        query: cacheKey,
        source: cacheSource,
        payload: responsePayload,
        expiresAt
      });

      // Log run — non-fatal if DB write fails
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

  app.get(api.analyze.brief.get.path, async (req, res) => {
    try {
      const { q } = api.analyze.brief.get.input.parse(req.query);
      if (groq) {
        try {
          const response = await groq.chat.completions.create({
            messages: [{ role: "system", content: "You are a senior tech analyst. Generate a structured 1-page markdown brief including Topic Overview, Key Research, Open Source Ecosystem, Tech Trends, and Startup Opportunities." }, { role: "user", content: `Topic: ${q}` }],
            model: GROQ_MODEL,
          });
          return res.json({ brief: response.choices[0]?.message?.content || "Generation failed." });
        } catch (e) { }
      }

      const templatedBrief = `# Technology Brief: ${q}\n\n## Topic Overview\nAcademic and open-source momentum surrounding ${q} is showing key activity signs.\n\n## Technology Trends\nObservation indicates shifting momentum toward optimized ecosystems and scalable solutions.\n\n## Startup Opportunities\n1. AI-powered diagnostic infrastructure.\n2. Unified API standard for integration.`;
      res.json({ brief: templatedBrief });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
