
// server/index.ts
import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      user?: any;
    }
  }
}

const app = express();
const httpServer = createServer(app);

app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as Request).rawBody = buf;
      },
    }),
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// -------------------- logging --------------------
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  let capturedJsonResponse: Record<string, any> | undefined;
  const originalResJson = res.json.bind(res);
  res.json = (body: any) => {
    capturedJsonResponse = body;
    return originalResJson(body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let line = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      log(line);
    }
  });

  next();
});

// -------------------- UI_ONLY auth (no DB) --------------------
// In-memory “users” to satisfy your frontend contract.
// Add/adjust fields to match what your UI expects.
const demoUsers = {
  finance: { id: 1, role: "finance", username: "finance", name: "Finance User" },
  manager: { id: 2, role: "manager", username: "manager", name: "Manager User" },
  employee: { id: 3, role: "employee", username: "employee", name: "Employee User" },
} as const;

// simplistic session store: sessionId -> user
const sessions = new Map<string, any>();

function newSessionId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Middleware: attach req.user if session cookie exists
app.use((req, _res, next) => {
  const sid = req.cookies?.sid;
  if (sid && sessions.has(sid)) {
    req.user = sessions.get(sid);
  }
  next();
});

// Auth routes as per your api schema
app.post("/api/auth/login", (req, res) => {
  const { role, username } = req.body ?? {};

  if (!role || !["finance", "manager", "employee"].includes(role)) {
    return res.status(401).json({ message: "Invalid role", field: "role" });
  }

  // optional username support (your schema allows it)
  const user = (demoUsers as any)[role];
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Create session + set cookie
  const sid = newSessionId();
  const userWithUsername = { ...user, username: username ?? user.username };

  sessions.set(sid, userWithUsername);

  res.cookie("sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // enable when using https
  });

  return res.status(200).json(userWithUsername);
});

app.get("/api/auth/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  return res.status(200).json(req.user);
});

app.post("/api/auth/logout", (req, res) => {
  const sid = req.cookies?.sid;
  if (sid) sessions.delete(sid);
  res.clearCookie("sid");
  return res.status(200).json({ message: "Logged out" });
});

// Optional: keep health endpoint
app.get("/api/health", (_req, res) => res.json({ ok: true, mode: "ui-only" }));

// -------------------- main bootstrap --------------------
(async () => {
  const uiOnly =
      ((process.env.UI_ONLY ?? process.env.SKIP_DB ?? "").toString().toLowerCase() === "true");

  // If NOT uiOnly, load normal routes (DB)
  if (!uiOnly) {
    const { registerRoutes } = await import("./routes");
    await registerRoutes(httpServer, app, { skipDb: false });
  } else {
    console.log("UI_ONLY mode enabled — DB routes skipped; UI auth routes enabled.");
  }

  // Serve frontend (login page)
  if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./static");
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Error handler last
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen({ port, host: "localhost" }, () => {
    log(`serving on port ${port} (UI_ONLY=${uiOnly})`);
    log(`open: http://localhost:${port}/`, "info");
  });
})();
