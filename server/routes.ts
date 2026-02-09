import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertEventSchema,
  insertSponsorSchema,
  insertBusinessSchema,
  insertVehicleRegistrationSchema,
  insertSponsorshipInquirySchema,
  insertContactMessageSchema,
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getGitHubUser, createGitHubRepo, listUserRepos, getUncachableGitHubClient } from "./github";

const uploadsDir = path.join(process.cwd(), "server", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.json({ id: user.id, username: user.username });
  });

  app.get("/api/events", async (_req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/businesses", async (_req, res) => {
    const businesses = await storage.getBusinesses();
    res.json(businesses);
  });

  app.get("/api/sponsors", async (_req, res) => {
    const sponsors = await storage.getSponsors();
    res.json(sponsors);
  });

  app.post("/api/vehicle-registrations", async (req, res) => {
    try {
      const data = insertVehicleRegistrationSchema.parse(req.body);
      const registration = await storage.createVehicleRegistration(data);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/sponsorship-inquiries", async (req, res) => {
    try {
      const data = insertSponsorshipInquirySchema.parse(req.body);
      const inquiry = await storage.createSponsorshipInquiry(data);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/admin/upload", requireAuth, upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  app.post("/api/admin/events", requireAuth, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.patch("/api/admin/events/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = insertEventSchema.partial().parse(req.body);
      const updated = await storage.updateEvent(id, data);
      if (!updated) return res.status(404).json({ error: "Event not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/events/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await storage.deleteEvent(id);
      if (!deleted) return res.status(404).json({ error: "Event not found" });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/businesses", requireAuth, async (req, res) => {
    try {
      const data = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(data);
      res.status(201).json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.patch("/api/admin/businesses/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = insertBusinessSchema.partial().parse(req.body);
      const updated = await storage.updateBusiness(id, data);
      if (!updated) return res.status(404).json({ error: "Business not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/businesses/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await storage.deleteBusiness(id);
      if (!deleted) return res.status(404).json({ error: "Business not found" });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/sponsors", requireAuth, async (req, res) => {
    try {
      const data = insertSponsorSchema.parse(req.body);
      const sponsor = await storage.createSponsor(data);
      res.status(201).json(sponsor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.patch("/api/admin/sponsors/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = insertSponsorSchema.partial().parse(req.body);
      const updated = await storage.updateSponsor(id, data);
      if (!updated) return res.status(404).json({ error: "Sponsor not found" });
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/sponsors/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await storage.deleteSponsor(id);
      if (!deleted) return res.status(404).json({ error: "Sponsor not found" });
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/vehicle-registrations", requireAuth, async (_req, res) => {
    const registrations = await storage.getVehicleRegistrations();
    res.json(registrations);
  });

  app.get("/api/admin/sponsorship-inquiries", requireAuth, async (_req, res) => {
    const inquiries = await storage.getSponsorshipInquiries();
    res.json(inquiries);
  });

  app.get("/api/admin/contact-messages", requireAuth, async (_req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.get("/api/admin/github/user", requireAuth, async (_req, res) => {
    try {
      const user = await getGitHubUser();
      res.json({ username: user.login, avatar: user.avatar_url, name: user.name });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to get GitHub user" });
    }
  });

  app.get("/api/admin/github/repos", requireAuth, async (_req, res) => {
    try {
      const repos = await listUserRepos();
      res.json(repos.map(r => ({ name: r.name, full_name: r.full_name, html_url: r.html_url, private: r.private, description: r.description })));
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to list repos" });
    }
  });

  app.post("/api/admin/github/push", requireAuth, async (req, res) => {
    try {
      const { repoName, description, isPrivate, useExisting, owner: requestedOwner } = req.body;

      if (!repoName || typeof repoName !== "string" || !/^[a-zA-Z0-9._-]+$/.test(repoName)) {
        return res.status(400).json({ error: "Invalid repository name. Use only letters, numbers, hyphens, dots, and underscores." });
      }

      const octokit = await getUncachableGitHubClient();
      const user = await getGitHubUser();
      const owner = (requestedOwner && typeof requestedOwner === "string" && /^[a-zA-Z0-9._-]+$/.test(requestedOwner))
        ? requestedOwner
        : user.login;

      let repo: string;
      if (useExisting) {
        repo = repoName;
      } else {
        if (owner !== user.login) {
          const { data } = await octokit.repos.createInOrg({
            org: owner,
            name: repoName,
            description: description || "Downtown Irwin community web app",
            private: isPrivate || false,
            auto_init: false,
          });
          repo = data.name;
        } else {
          const created = await createGitHubRepo(repoName, description || "Downtown Irwin community web app", isPrivate || false);
          repo = created.name;
        }
      }

      const filesToPush = await collectProjectFiles(process.cwd());

      let treeSha: string | undefined;
      let parentSha: string | undefined;
      try {
        const { data: ref } = await octokit.git.getRef({ owner, repo, ref: "heads/main" });
        parentSha = ref.object.sha;
        const { data: commit } = await octokit.git.getCommit({ owner, repo, commit_sha: parentSha });
        treeSha = commit.tree.sha;
      } catch {
        // New empty repo
      }

      const blobs = await Promise.all(
        filesToPush.map(async (file) => {
          const content = fs.readFileSync(file.fullPath);
          const isText = !isBinaryFile(file.fullPath);
          const { data } = await octokit.git.createBlob({
            owner,
            repo,
            content: isText ? content.toString("utf-8") : content.toString("base64"),
            encoding: isText ? "utf-8" : "base64",
          });
          return { path: file.relativePath, mode: "100644" as const, type: "blob" as const, sha: data.sha };
        })
      );

      const { data: tree } = await octokit.git.createTree({
        owner,
        repo,
        tree: blobs,
        ...(treeSha ? { base_tree: treeSha } : {}),
      });

      const { data: commit } = await octokit.git.createCommit({
        owner,
        repo,
        message: "Push from Downtown Irwin App on Replit",
        tree: tree.sha,
        ...(parentSha ? { parents: [parentSha] } : { parents: [] }),
      });

      try {
        await octokit.git.updateRef({ owner, repo, ref: "heads/main", sha: commit.sha });
      } catch {
        await octokit.git.createRef({ owner, repo, ref: "refs/heads/main", sha: commit.sha });
      }

      res.json({
        success: true,
        repoUrl: `https://github.com/${owner}/${repo}`,
        filesCount: filesToPush.length,
      });
    } catch (error: any) {
      console.error("GitHub push error:", error);
      res.status(500).json({ error: error.message || "Failed to push to GitHub" });
    }
  });

  return httpServer;
}

function isBinaryFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  const binaryExts = [".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".svg", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".mp3", ".pdf", ".zip", ".tar", ".gz"];
  return binaryExts.includes(ext);
}

async function collectProjectFiles(rootDir: string): Promise<{ fullPath: string; relativePath: string }[]> {
  const files: { fullPath: string; relativePath: string }[] = [];
  const ignoreDirs = new Set([
    "node_modules", ".git", "dist", ".cache", ".config", ".upm", ".local",
    "server/uploads", "__pycache__", ".replit", ".expo", ".turbo", "coverage",
    "build", "out", ".next", ".vercel", ".vscode", ".idea", ".ssh", ".aws",
  ]);
  const ignoreFiles = new Set([
    ".replit", "replit.nix", ".replit.nix", "generated-icon.png",
    ".npmrc", ".yarnrc", "id_rsa", "id_ed25519",
  ]);
  const sensitivePatterns = [
    /^\.env/, /\.pem$/, /\.key$/, /\.cert$/, /\.p12$/, /\.pfx$/,
    /\.secret$/, /^secrets\./, /credentials/i, /\.sqlite$/, /\.db$/,
    /\.kdbx$/, /\.bak$/, /^id_rsa/, /^id_ed25519/,
  ];

  function isSensitive(name: string): boolean {
    return sensitivePatterns.some((p) => p.test(name));
  }

  function walk(dir: string, relative: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const relPath = relative ? `${relative}/${entry.name}` : entry.name;
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!ignoreDirs.has(relPath) && !ignoreDirs.has(entry.name) && !entry.name.startsWith(".")) {
          walk(fullPath, relPath);
        }
      } else if (entry.isFile()) {
        if (
          !ignoreFiles.has(entry.name) &&
          !entry.name.endsWith(".lock") &&
          !isSensitive(entry.name)
        ) {
          const stat = fs.statSync(fullPath);
          if (stat.size < 5 * 1024 * 1024) {
            files.push({ fullPath, relativePath: relPath });
          }
        }
      }
    }
  }

  walk(rootDir, "");
  return files;
}
