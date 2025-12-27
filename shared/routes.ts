import { z } from "zod";
import { insertSiteSchema, sites } from "./schema";

export const api = {
  sites: {
    create: {
      method: "POST" as const,
      path: "/api/sites",
      input: insertSiteSchema,
      responses: {
        200: z.custom<typeof sites.$inferSelect>(),
      }
    },
    get: {
      method: "GET" as const,
      path: "/api/sites/:id",
      responses: {
        200: z.custom<typeof sites.$inferSelect>(),
        404: z.object({ message: z.string() })
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
