import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import formidable from "formidable";
import { readFileSync } from "fs";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// OpenAI text generation
async function generateCode(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer. Generate a single-file HTML (with embedded CSS/JS) for a clothing store. Return ONLY the HTML code. No markdown, no explanation, just raw HTML that is responsive and professional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 8192,
      temperature: 1,
    });

    return response.choices[0]?.message?.content || "<!-- Generation failed -->";
  } catch (error) {
    console.error("OpenAI generation error:", error);
    throw error;
  }
}

const HF_API_TOKEN = process.env.HUGGINGFACE_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const HF_API_URL = "https://router.huggingface.co/hf-inference/models";

// Hugging Face speech-to-text
async function transcribeAudioHF(audioPath: string): Promise<string> {
  try {
    const audioBuffer = readFileSync(audioPath);
    const response = await fetch(`${HF_API_URL}/openai/whisper-small`, {
      headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
      method: "POST",
      body: audioBuffer,
    });

    if (!response.ok) {
      throw new Error(`HF Whisper error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("HF transcription error:", error);
    throw error;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.sites.create.path, async (req, res) => {
    try {
      const input = api.sites.create.input.parse(req.body);
      
      // Create initial site record
      const site = await storage.createSite(input);
      
      // Start async generation (don't await)
      (async () => {
        try {
          const code = await generateCode(input.prompt);
          
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

  // Audio transcription endpoint (Hugging Face Whisper)
  app.post("/api/transcribe", async (req, res) => {
    try {
      const form = formidable();
      const [fields, files] = await form.parse(req);
      
      const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio?.[0];
      if (!audioFile) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const text = await transcribeAudioHF(audioFile.filepath);
      res.json({ text });
    } catch (error) {
      console.error("Transcription error:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  return httpServer;
}
