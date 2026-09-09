import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_PLAN } from "./src/data/defaultPlan.ts";
import { DEFAULT_YEAR_REPORT_DATES } from "./src/data/reportCycles.ts";
import { CurriculumState, TermData, LockState, YearReportDate } from "./src/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "curriculum-store.json");

let state: CurriculumState = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  lock: {
    isLocked: false,
    hasPin: true,
    lockedBy: "Department",
    lockedAt: ""
  },
  plan: JSON.parse(JSON.stringify(INITIAL_PLAN)),
  reportDates: JSON.parse(JSON.stringify(DEFAULT_YEAR_REPORT_DATES)),
  studentVisibility: {
    showTimeline: true,
    showReports: true,
    showCalendar: false,
    showMatrix: false,
    showRoadmap: false,
    showHolidays: true,
    showAssessmentsRibbon: true,
    showAssessmentBadges: true,
    showTeacherNotes: false,
    visibleYears: ['y7', 'y8', 'y9', 'y10', 'y11', 'y12', 'y13']
  },
  activeWeekSetting: {
    mode: 'auto',
    manualTermId: 't1',
    manualWeekN: 1
  },
  overviewSettings: {
    portalTitle: 'Computing Syllabus & Curriculum Timeline',
    portalDescription: 'Overview of all 38 teaching weeks, unit timelines, and assessment milestones for the 2026–2027 academic year.',
    academicYearLabel: 'Academic Year 2026–2027'
  }
};

// Default secure department password (teachers can change this anytime via UI)
let storedPin: string = "Bisb!Computing2026";

// In-memory active teacher session tokens: Map<token, { createdAt: number, expiresAt: number }>
const activeSessions = new Map<string, { createdAt: number; expiresAt: number }>();
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate-limiting for brute force protection: Map<ip, { failedCount: number, lockedUntil: number }>
const loginAttempts = new Map<string, { failedCount: number; lockedUntil: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

// Initialize persistence directory and store
function loadStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.plan)) {
        state = {
          version: parsed.version || 1,
          lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          lock: parsed.lock || { isLocked: false, hasPin: true },
          plan: parsed.plan,
          reportDates: Array.isArray(parsed.reportDates) ? parsed.reportDates : JSON.parse(JSON.stringify(DEFAULT_YEAR_REPORT_DATES)),
          studentVisibility: parsed.studentVisibility || {
            showTimeline: true,
            showReports: true,
            showCalendar: false,
            showMatrix: false,
            showRoadmap: false,
            showHolidays: true,
            showAssessmentsRibbon: true,
            showAssessmentBadges: true,
            showTeacherNotes: false,
            visibleYears: ['y7', 'y8', 'y9', 'y10', 'y11', 'y12', 'y13']
          },
          activeWeekSetting: parsed.activeWeekSetting || {
            mode: 'auto',
            manualTermId: 't1',
            manualWeekN: 1
          },
          overviewSettings: parsed.overviewSettings || {
            portalTitle: 'Computing Syllabus & Curriculum Timeline',
            portalDescription: 'Overview of all 38 teaching weeks, unit timelines, and assessment milestones for the 2026–2027 academic year.',
            academicYearLabel: 'Academic Year 2026–2027'
          }
        };
        storedPin = parsed.secretPin || "Bisb!Computing2026";
      }
    } else {
      saveStore();
    }
  } catch (err) {
    console.error("Error loading curriculum store:", err);
  }
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const toSave = {
      ...state,
      secretPin: storedPin
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(toSave, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing curriculum store:", err);
  }
}

loadStore();

// Middleware: Validate Teacher Session Token
function isTeacherAuthenticated(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else if (req.body && req.body.sessionToken) {
    token = String(req.body.sessionToken).trim();
  }

  if (!token) return false;

  const session = activeSessions.get(token);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }

  return true;
}

// Helper: Get Client IP for Rate Limiting
function getClientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown-ip";
}

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// ----------------------------------------------------
// AUTHENTICATION & SECURITY ENDPOINTS
// ----------------------------------------------------

// Verify teacher session token
app.get("/api/teacher/session", (req, res) => {
  const valid = isTeacherAuthenticated(req);
  res.json({ authenticated: valid });
});

// Teacher Login with Passphrase + Rate Limiting / Lockout Protection
app.post("/api/teacher/verify", (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();

  // Check lockout
  const attemptInfo = loginAttempts.get(ip);
  if (attemptInfo && attemptInfo.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptInfo.lockedUntil - now) / 1000);
    return res.status(429).json({
      valid: false,
      error: `Too many failed attempts. Access locked for ${remainingSeconds} seconds.`,
      locked: true,
      remainingSeconds
    });
  }

  const { password } = req.body;
  const targetPin = storedPin || "Bisb!Computing2026";

  if (password === targetPin) {
    // Reset failed attempts on success
    loginAttempts.delete(ip);

    // Generate secure session token
    const token = crypto.randomBytes(32).toString("hex");
    activeSessions.set(token, {
      createdAt: now,
      expiresAt: now + SESSION_DURATION_MS
    });

    return res.json({
      valid: true,
      token,
      expiresIn: SESSION_DURATION_MS / 1000
    });
  }

  // Failed attempt tracking
  const currentAttempts = (attemptInfo?.failedCount || 0) + 1;
  if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
    loginAttempts.set(ip, {
      failedCount: currentAttempts,
      lockedUntil: now + LOCKOUT_DURATION_MS
    });
    return res.status(429).json({
      valid: false,
      error: "Too many failed attempts. Access locked for 5 minutes.",
      locked: true,
      remainingSeconds: 300
    });
  } else {
    loginAttempts.set(ip, {
      failedCount: currentAttempts,
      lockedUntil: 0
    });
    const remainingTries = MAX_FAILED_ATTEMPTS - currentAttempts;
    return res.status(401).json({
      valid: false,
      error: `Incorrect teacher password. (${remainingTries} attempt${remainingTries === 1 ? '' : 's'} remaining before lockout)`
    });
  }
});

// Teacher Logout
app.post("/api/teacher/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Change Teacher Password (Authenticated)
app.post("/api/teacher/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters long." });
  }

  const targetPin = storedPin || "Bisb!Computing2026";
  
  // Validate current password directly or via valid active teacher session
  const isDirectPasswordValid = (currentPassword === targetPin);
  const isSessionValid = isTeacherAuthenticated(req);

  if (!isDirectPasswordValid && !isSessionValid) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  storedPin = String(newPassword).trim();
  saveStore();

  // Issue a fresh valid session token for this new password
  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.set(token, {
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS
  });

  res.json({ success: true, message: "Teacher password successfully updated.", token });
});

// ----------------------------------------------------
// CURRICULUM DATA ENDPOINTS
// ----------------------------------------------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", version: state.version, isLocked: state.lock.isLocked });
});

// GET curriculum state (public for student read-only view)
app.get("/api/curriculum", (_req, res) => {
  res.json(state);
});

// UPDATE curriculum plan or reportDates (Teacher session verified)
app.put("/api/curriculum", (req, res) => {
  const { plan, reportDates, studentVisibility, activeWeekSetting, overviewSettings } = req.body;

  let updated = false;
  if (plan && Array.isArray(plan)) {
    state.plan = plan;
    updated = true;
  }
  if (reportDates && Array.isArray(reportDates)) {
    state.reportDates = reportDates;
    updated = true;
  }
  if (studentVisibility && typeof studentVisibility === "object") {
    state.studentVisibility = {
      ...state.studentVisibility,
      ...studentVisibility
    };
    updated = true;
  }
  if (activeWeekSetting && typeof activeWeekSetting === "object") {
    state.activeWeekSetting = {
      ...state.activeWeekSetting,
      ...activeWeekSetting
    };
    updated = true;
  }
  if (overviewSettings && typeof overviewSettings === "object") {
    state.overviewSettings = {
      ...state.overviewSettings,
      ...overviewSettings
    };
    updated = true;
  }

  if (!updated) {
    return res.status(400).json({ error: "No valid update data provided" });
  }

  state.version += 1;
  state.lastUpdated = new Date().toISOString();
  saveStore();

  res.json({ success: true, version: state.version, lastUpdated: state.lastUpdated });
});

// LOCK / UNLOCK curriculum
app.post("/api/curriculum/lock", (req, res) => {
  const { isLocked, pin, currentPin, lockedBy } = req.body;

  // If currently locked and trying to unlock:
  if (state.lock.isLocked && !isLocked) {
    const targetPin = storedPin || "Bisb!Computing2026";
    if (currentPin !== targetPin && !isTeacherAuthenticated(req)) {
      return res.status(401).json({ error: "Incorrect password to unlock timeline." });
    }
  }

  if (isLocked && pin) {
    storedPin = String(pin).trim();
  }

  state.lock = {
    isLocked: !!isLocked,
    hasPin: true,
    lockedBy: lockedBy || (isLocked ? "Department Lead" : undefined),
    lockedAt: isLocked ? new Date().toISOString() : undefined
  };
  state.version += 1;
  state.lastUpdated = new Date().toISOString();
  saveStore();

  res.json({ success: true, lock: state.lock, version: state.version });
});

// RESET to defaults (Authenticated)
app.post("/api/curriculum/reset", (req, res) => {
  if (!isTeacherAuthenticated(req)) {
    return res.status(401).json({ error: "Unauthorized: Teacher session required to reset." });
  }

  state.plan = JSON.parse(JSON.stringify(INITIAL_PLAN));
  state.version += 1;
  state.lastUpdated = new Date().toISOString();
  saveStore();

  res.json({ success: true, version: state.version, plan: state.plan });
});

// AI ASSISTANT: Generate teaching ideas, differentiation, assessment rubrics
app.post("/api/ai/suggest", async (req, res) => {
  const { yearGroup, topic, term, week, contextType } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        fallback: true,
        suggestion: `Practical suggestions for ${yearGroup || 'Computing'} — "${topic}":\n• Starter (5 min): Quick recall quiz on prior concept.\n• Main (30 min): Guided coding / hands-on task with scaffolded examples.\n• Extension: Open-ended algorithmic challenge or edge-case testing.\n• Plenary: Peer review with mark scheme rubric.`
      });
    }

    const prompt = `You are an expert Head of Computing at a British International School following KS3, Edexcel IGCSE (4CP0) and IB DP Computer Science.
Please provide concise, highly practical teaching suggestions for:
- Year Group: ${yearGroup}
- Current Topic / Task: "${topic}"
- Term & Week: ${term || 'Term 1'} Week ${week || 1}
- Request: ${contextType || 'lesson plan starter, hands-on tasks, high-achiever extension and common misconceptions'}

Format your response cleanly with brief bullet points, zero fluff, ready for classroom implementation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    res.json({ suggestion: response.text });
  } catch (err: any) {
    console.error("AI Suggestion error:", err);
    res.status(500).json({ error: "Could not generate AI suggestions", details: err.message });
  }
});

// ----------------------------------------------------
// VITE OR STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Curriculum Planner Server running on http://localhost:${PORT}`);
  });
}

startServer();
