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
// Seed demo users (with a simple password for demo purposes)
const demoUsersData = [
  { id: 1, role: "finance", username: "sarah.chen", name: "Sarah Chen", password: 'password' },
  { id: 2, role: "manager", username: "michael.torres", name: "Michael Torres", password: 'password' },
  { id: 3, role: "employee", username: "emily.johnson", name: "Emily Johnson", password: 'password' },
];

// Map username -> user
const users = new Map<string, any>();
let nextUserId = 1000;
for (const u of demoUsersData) {
  users.set(u.username, { id: u.id, username: u.username, name: u.name, role: u.role, password: u.password });
  nextUserId = Math.max(nextUserId, u.id + 1);
}

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

    // Lightweight UI-only auth route for local/demo mode
    app.post("/api/auth/login", (req, res) => {
      const { username, password, role } = req.body ?? {};

      // If username & password provided, authenticate against our in-memory users
      if (username && password) {
        const u = users.get(username);
        if (!u || u.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const sid = newSessionId();
        const userSafe = { id: u.id, username: u.username, name: u.name, role: u.role };
        sessions.set(sid, userSafe);
        res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
        return res.status(200).json(userSafe);
      }

      // If no username (role-only), fall back to role lookup/synthesis for demo
      if (role) {
        // try to find a seeded user by role
        for (const v of users.values()) {
          if (v.role === role) {
            const sid = newSessionId();
            const userSafe = { id: v.id, username: v.username, name: v.name, role: v.role };
            sessions.set(sid, userSafe);
            res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
            return res.status(200).json(userSafe);
          }
        }

        // synthesize a demo user
        const usernameBase = role.replace(/[^a-z0-9]/gi, '.').toLowerCase();
        const user = { id: Date.now() % 1000000, role, username: username ?? usernameBase, name: role.replace(/[_-]/g, ' ') };
        const sid = newSessionId();
        sessions.set(sid, user);
        res.cookie('sid', sid, { httpOnly: true, sameSite: 'lax' });
        return res.status(200).json(user);
      }

      return res.status(400).json({ message: 'username/password required' });
    });

    // Registration endpoint — required fields: username, password, role, name, email, phone, department, employeeId
    app.post('/api/auth/register', (req, res) => {
      const body = req.body ?? {};
      const required = ['username', 'password', 'role', 'name', 'email', 'phone', 'department', 'employeeId'];
      for (const f of required) {
        if (!body[f]) return res.status(400).json({ message: `Missing field: ${f}` });
      }

      const username = body.username;
      if (users.has(username)) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      const newUser = {
        id: nextUserId++,
        username,
        password: body.password,
        role: body.role,
        name: body.name,
        email: body.email,
        phone: body.phone,
        department: body.department,
        employeeId: body.employeeId,
      };

      users.set(username, newUser);
      console.log('[UI server] Registered new user:', newUser.username, newUser.role);
      return res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role, name: newUser.name, email: newUser.email });
    });
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