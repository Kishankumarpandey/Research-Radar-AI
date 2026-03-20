import { z } from "zod";
import { runLog } from "./schema";

export const errorSchemas = {
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  analyze: {
    get: {
      method: "GET" as const,
      path: "/api/analyze" as const,
      input: z.object({
        q: z.string().min(2).max(120),
        mode: z.enum(["general", "semiconductor"]).optional().default("general")
      }),
      responses: {
        200: z.object({
          query: z.string(),
          arxiv_count: z.number(),
          github_count: z.number(),
          keywords: z.array(z.string()),
          trend_score: z.number(),
          radar: z.object({
            rising: z.array(z.string()),
            emerging: z.array(z.string()),
            stable: z.array(z.string()),
            declining: z.array(z.string()),
          }),
          timeline: z.array(z.object({
            year: z.string(),
            papers: z.number(),
            repos: z.number(),
          })),
          fetched_at: z.string(),
          futureOutlook: z.string().optional(),
          skillRoadmap: z.array(z.object({ stage: z.string(), skills: z.array(z.string()) })).optional(),
          topLabs: z.array(z.string()).optional(),
          topOrgs: z.array(z.string()).optional(),
          globalActivity: z.array(z.object({ country: z.string(), papers: z.number(), repos: z.number() })).optional(),
          insights: z.array(z.string()).optional(),
          opportunities: z.array(z.any()).optional(),
          industrySignals: z.array(z.string()).optional(),
          competitiveEcosystem: z.object({
            topCompanies: z.array(z.string()),
            topStartups: z.array(z.string()),
            topOrgs: z.array(z.string())
          }).optional(),
          investmentSignal: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
          strategicIntelligence: z.object({
            riskProfile: z.object({
              maturity: z.string(),
              uncertainty: z.string(),
              marketRisk: z.string(),
            }),
            adoptionTimeline: z.string(),
            recommendations: z.object({
              engineers: z.string(),
              startups: z.string(),
              investors: z.string(),
            })
          }).optional(),
          monitoring: z.object({
            alerts: z.array(z.string()),
            discoveries: z.array(z.string()),
            weeklyReport: z.object({
              newPapers: z.number(),
              newRepos: z.number(),
              emergingSignals: z.array(z.string()),
              investmentSignalUpdated: z.string()
            })
          }).optional(),
          semiconductorIntelligence: z.object({
            highlights: z.array(z.any()),
            topProjects: z.array(z.any()),
            activeOrgs: z.array(z.string()),
            architectures: z.array(z.string()),
            skillRoadmap: z.array(z.string()),
            architectureDiagram: z.array(z.string())
          }).optional(),
          futureSignal: z.object({
            prediction: z.string(),
            confidence: z.number(),
            window: z.string()
          }).optional(),
          potentialScore: z.object({
            score: z.number(),
            investment: z.string(),
            opportunity: z.string()
          }).optional(),
          prototype: z.object({
            productConcept: z.string(),
            targetUsers: z.string(),
            techStack: z.array(z.string()),
            mvpSteps: z.array(z.string()),
            architectureDiagram: z.array(z.string()),
            marketPotential: z.number()
          }).optional(),
          items: z.object({
            arxiv: z.array(z.object({
              id: z.string(),
              title: z.string(),
              summary: z.string(),
              aiSummary: z.string().optional(),
              published: z.string(),
              link: z.string(),
              impactScore: z.number().optional(),
              authors: z.array(z.string()).optional()
            })),
            github: z.array(z.object({
              name: z.string(),
              html_url: z.string(),
              stars: z.number(),
              description: z.string().nullable(),
              created_at: z.string().optional(),
              owner: z.object({ login: z.string(), type: z.string() }).optional()
            })),
          }),
        }),
        500: errorSchemas.internal,
      },
    },
    brief: {
      get: {
        method: "GET" as const,
        path: "/api/analyze/brief" as const,
        input: z.object({
          q: z.string().min(2).max(120)
        }),
        responses: {
          200: z.object({
            brief: z.string()
          }),
          500: errorSchemas.internal,
        }
      }
    }
  },
  health: {
    get: {
      method: "GET" as const,
      path: "/api/health" as const,
      responses: {
        200: z.object({
          status: z.string(),
          time: z.string(),
        })
      }
    }
  },
  runlog: {
    get: {
      method: "GET" as const,
      path: "/api/health/runlog" as const,
      input: z.object({
        last: z.coerce.number().optional().default(10)
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof runLog.$inferSelect>())
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AnalyzeQueryParams = z.infer<typeof api.analyze.get.input>;
export type AnalyzeResponse = z.infer<typeof api.analyze.get.responses[200]>;
export type RunLogResponse = z.infer<typeof api.runlog.get.responses[200]>;
