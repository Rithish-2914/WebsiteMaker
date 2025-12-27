import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../dist/public");
  if (!fs.existsSync(distPath)) {
    // If dist doesn't exist, we're likely in a serverless environment where
    // static files are handled by the platform (like Vercel)
    return;
  }

  app.use(express.static(distPath));

  // Fallback for SPA
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
