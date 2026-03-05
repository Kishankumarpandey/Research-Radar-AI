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
        q: z.string().min(2).max(120)
      }),
      responses: {
        200: z.object({
          query: z.string(),
          arxiv_count: z.number(),
          github_count: z.number(),
          keywords: z.array(z.string()),
          trend_score: z.number(),
          fetched_at: z.string(),
          items: z.object({
            arxiv: z.array(z.object({
              id: z.string(),
              title: z.string(),
              summary: z.string(),
              published: z.string(),
              link: z.string(),
            })),
            github: z.array(z.object({
              name: z.string(),
              html_url: z.string(),
              stars: z.number(),
              description: z.string().nullable(),
            })),
          }),
        }),
        500: errorSchemas.internal,
      },
    },
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
