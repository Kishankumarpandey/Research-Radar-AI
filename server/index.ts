import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

// ─── Structured Logger ──────────────────────────────────────────────────────
// Simple production-grade logger with log levels and timestamps.
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;
type LogLevel = keyof typeof LOG_LEVELS;

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === "production" ? "info" : "debug");

export function log(message: string, source = "server", level: LogLevel = "info") {
  if (LOG_LEVELS[level] > LOG_LEVELS[currentLevel]) return;

  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${level.toUpperCase().padEnd(5)}] [${source}] ${message}`;

  if (level === "error") console.error(formatted);
  else if (level === "warn") console.warn(formatted);
  else console.log(formatted);
}

// ─── Startup Environment Validation ─────────────────────────────────────────
function validateEnvironment() {
  if (!process.env.GROQ_API_KEY) {
    log("GROQ_API_KEY is not set — AI features will use rule-based fallbacks", "startup", "warn");
  } else {
    log("GROQ_API_KEY detected — AI-powered analysis enabled", "startup", "info");
  }

  if (!process.env.GITHUB_TOKEN) {
    log("GITHUB_TOKEN not set — GitHub API rate limit will be 60 req/hour (public)", "startup", "warn");
  }

  const dbUrl = process.env.DATABASE_URL || "file:sqlite.db";
  if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
    log("WARNING: DATABASE_URL looks like a PostgreSQL URL but libsql/SQLite is in use. Update to file:sqlite.db", "startup", "error");
  } else {
    log(`Database: ${dbUrl}`, "startup", "info");
  }
}

// ─── Simple In-Process Rate Limiter ─────────────────────────────────────────
// No extra packages — tracks req count per IP using a Map with TTL cleanup.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 100;       // requests
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in ms

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // Only rate-limit API routes
  if (!req.path.startsWith("/api")) return next();

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    // New window
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return next();
  }

  entry.count++;
  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

  if (entry.count > RATE_LIMIT_MAX) {
    log(`Rate limit exceeded for IP: ${ip}`, "security", "warn");
    return res.status(429).json({ message: "Too many requests — please wait 15 minutes and try again." });
  }

  return next();
}

// Cleanup rate limit store periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of Array.from(rateLimitStore.entries())) {
    if (now > entry.resetAt) rateLimitStore.delete(ip);
  }
}, 5 * 60 * 1000); // every 5 minutes

// ─── Security Headers Middleware ─────────────────────────────────────────────
function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}

// ─── App Setup ───────────────────────────────────────────────────────────────
const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Apply middleware
app.use(securityHeaders);
app.use(rateLimiter);
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
    limit: "1mb", // Prevent oversized payloads
  })
);
app.use(express.urlencoded({ extended: false }));

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} (${duration}ms)`;
      if (capturedJsonResponse && res.statusCode >= 400) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      const level: LogLevel = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
      log(logLine, "http", level);
    }
  });

  next();
});

// ─── Boot ───────────────────────────────────────────────────────────────────
(async () => {
  validateEnvironment();

  await registerRoutes(httpServer, app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    log(`Unhandled error: ${message}`, "express", "error");
    if (err.stack) log(err.stack, "express", "error");

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // Vite dev server in development, static files in production
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    { port, host: "0.0.0.0" },
    () => {
      log(`Server running on http://localhost:${port}`, "startup", "info");
      log(`Environment: ${process.env.NODE_ENV || "development"}`, "startup", "info");
    }
  );
})();
