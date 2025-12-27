import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist/public");
  if (!fs.existsSync(distPath)) {
    return;
  }

  app.use(express.static(distPath, {
    setHeaders: (res, path) => {
      if (path.endsWith(".html")) {
        res.setHeader("Content-Type", "text/html");
      }
    }
  }));

  // Fallback for SPA
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/sites")) {
      return next();
    }
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}
