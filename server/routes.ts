import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize OpenAI (assuming standard env vars from integration)
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY });

  app.post(api.sites.create.path, async (req, res) => {
    try {
      const input = api.sites.create.input.parse(req.body);
      
      // Create initial site record
      const site = await storage.createSite(input);
      
      // Start async generation (don't await)
      (async () => {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert web developer. Generate a single-file HTML (with embedded CSS/JS) for a clothing store based on the user's request. Return ONLY the HTML code. No markdown code blocks, just raw HTML. Ensure it is responsive and looks professional."
              },
              {
                role: "user",
                content: input.prompt
              }
            ],
          });

          const code = completion.choices[0].message.content || "<!-- Generation failed -->";
          
          // Remove markdown blocks if present
          const cleanCode = code.replace(/```html/g, "").replace(/```/g, "");

          await storage.updateSite(site.id, {
            code: cleanCode,
            status: "completed"
          });
        } catch (error) {
          console.error("Generation error:", error);
          await storage.updateSite(site.id, { status: "failed" });
        }
      })();

      res.json(site);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.sites.get.path, async (req, res) => {
    const site = await storage.getSite(Number(req.params.id));
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    res.json(site);
  });

  // Preview route to serve the generated HTML
  app.get("/sites/:id/preview", async (req, res) => {
    const site = await storage.getSite(Number(req.params.id));
    if (!site || !site.code) {
      return res.status(404).send("Site not found or not ready");
    }
    res.setHeader("Content-Type", "text/html");
    res.send(site.code);
  });

  return httpServer;
}
