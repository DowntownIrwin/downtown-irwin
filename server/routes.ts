import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { adminDataSchema, contactFormSchema } from "@shared/schema";
import path from "path";
import fs from "fs";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "irwin2026";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Serve Decap CMS admin page
  app.get("/admin", (req, res, next) => {
    const adminPath = path.resolve(
      import.meta.dirname,
      "..",
      "client",
      "public",
      "admin",
      "index.html"
    );
    if (fs.existsSync(adminPath)) {
      res.status(200).set({ "Content-Type": "text/html" }).sendFile(adminPath);
    } else {
      next();
    }
  });

  // Serve admin config.yml (multiple path patterns)
  const serveConfigYml = (req: any, res: any, next: any) => {
    const configPath = path.resolve(
      import.meta.dirname,
      "..",
      "client",
      "public",
      "admin",
      "config.yml"
    );
    if (fs.existsSync(configPath)) {
      res.status(200).set({ "Content-Type": "text/yaml", "Cache-Control": "no-cache" }).sendFile(configPath);
    } else {
      next();
    }
  };
  app.get("/admin/config.yml", serveConfigYml);
  app.get("/config.yml", serveConfigYml);

  app.get("/api/admin/data", async (req, res) => {
    try {
      const data = await storage.getAdminData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin data" });
    }
  });

  app.post("/api/admin/verify", async (req, res) => {
    const { passcode } = req.body;
    if (passcode === ADMIN_PASSCODE) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid passcode" });
    }
  });

  app.post("/api/admin/data", async (req, res) => {
    const passcode = req.headers['x-admin-passcode'];
    if (passcode !== ADMIN_PASSCODE) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const data = adminDataSchema.parse(req.body);
      await storage.saveAdminData(data);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid data format" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/sponsors.json", async (req, res) => {
    try {
      const sponsors = await storage.getCarCruiseSponsors();
      res.json(sponsors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sponsors" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const form = contactFormSchema.parse(req.body);
      await storage.saveContactMessage(form);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid form data" });
    }
  });

  return httpServer;
}
