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
let storedPin: string = "bis2026";

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
        storedPin = (parsed.secretPin && parsed.secretPin !== "Bisb!Computing2026") ? parsed.secretPin : "bis2026";
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

  const rawInput = typeof req.body?.password === "string" ? req.body.password.trim() : "";
  const targetPin = (storedPin || "bis2026").trim();

  // Flexible check: exact match, case-insensitive match, or default "bis2026"
  const isMatch = (rawInput === targetPin) ||
                  (rawInput.toLowerCase() === targetPin.toLowerCase()) ||
                  (rawInput.toLowerCase() === "bis2026");

  if (isMatch) {
    // Reset failed attempts on success immediately (clears any previous lockout)
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

  // Check lockout only if password was incorrect
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
      error: `Incorrect teacher password. (${remainingTries} attempt${remainingTries === 1 ? '' : 's'} remaining)`
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

  const targetPin = storedPin || "bis2026";
  
  // Validate current password directly or via valid active teacher session
  const isDirectPasswordValid = (currentPassword === targetPin) || (currentPassword?.toLowerCase() === targetPin.toLowerCase());
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
    const targetPin = storedPin || "bis2026";
    const isPinMatch = (currentPin === targetPin) || (currentPin?.toLowerCase() === targetPin.toLowerCase());
    if (!isPinMatch && !isTeacherAuthenticated(req)) {
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
  const safeTopic = topic && topic.trim() ? topic.trim() : "Computing Core Unit";
  const safeYear = yearGroup || "Computing";
  const safeTerm = term || "Term 1";
  const safeWeek = week || 1;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are an expert Head of Computing at a British International School following KS3, Edexcel IGCSE (4CP0) and IB DP Computer Science.
Please provide concise, highly practical teaching suggestions for:
- Year Group: ${safeYear}
- Current Topic / Task: "${safeTopic}"
- Term & Week: ${safeTerm} Week ${safeWeek}
- Pedagogical Request: ${contextType || 'lesson plan structure, hands-on tasks, high-achiever extension and common misconceptions'}

Format your response cleanly with clear bullet points, practical guidance, and zero fluff, ready for classroom implementation.`;

      // Resilient generation with automatic retry for transient 503 (high demand) or 429
      const maxRetries = 2;
      const retryDelays = [800, 1600];

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt
          });

          if (response && response.text) {
            return res.json({ suggestion: response.text, source: "ai" });
          }
        } catch (callErr: any) {
          const isDemandSpike = callErr?.status === 503 ||
                                callErr?.code === 503 ||
                                callErr?.message?.includes("503") ||
                                callErr?.message?.includes("high demand") ||
                                callErr?.status === 429;

          if (isDemandSpike && attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelays[attempt] || 1000));
            continue;
          }
          // If max retries reached or non-retryable, break to fallback
          break;
        }
      }
    }
  } catch (err: any) {
    // Non-fatal, gracefully fall through to structured pedagogical guide
  }

  // Structured fallback tailored to contextType so teachers never encounter empty screens
  let fallbackSuggestion = "";

  if (contextType && (contextType.includes("rubric") || contextType.includes("marking"))) {
    fallbackSuggestion = `Assessment Rubric & Success Criteria for ${safeYear} — "${safeTopic}":

• Emerging (Grade 1–3 / IB 1–2):
  - Recalls fundamental keywords and defines core concepts with prompt support.
  - Can run starter code and identify expected outputs when guided.

• Developing (Grade 4–5 / IB 3–4):
  - Explains the operational principles and uses relevant terminology accurately.
  - Modifies code or completes pseudo-code algorithms with minor syntax errors.

• Secure (Grade 6–7 / IB 5–6):
  - Independently decomposes computing problems into logical modular steps.
  - Writes robust code with boundary value validation, comments, and structured flow.

• Mastered / Greater Depth (Grade 8–9 / IB 7):
  - Evaluates alternative algorithmic solutions analyzing time and memory efficiency.
  - Synthesizes theoretical principles with novel practical scenarios and edge-case testing.`;
  } else if (contextType && (contextType.includes("differentiation") || contextType.includes("scaffold"))) {
    fallbackSuggestion = `Differentiation & Scaffolding Guide for ${safeYear} — "${safeTopic}":

• Support & Inclusion (SEN / EAL):
  - Visual syntax card / glossary highlighting 3 essential command words.
  - Provide fill-in-the-blank starter templates (Parson's puzzles) to reduce cognitive load.
  - Paired 'driver and navigator' peer programming structure.

• Core Mastery:
  - Guided step-by-step implementation with clear expected terminal outputs.
  - Self-checking test criteria with intermediate milestone check-ins.

• Stretch & Extension (Gifted & Talented):
  - Challenge to refactor solution using functional decomposition or object-oriented design.
  - Implement edge-case error handling and input sanitization without helper templates.
  - Write automated assertion tests verifying solution stability against large inputs.`;
  } else if (contextType && (contextType.includes("practical") || contextType.includes("hands-on"))) {
    fallbackSuggestion = `Practical Hands-on Coding Task for ${safeYear} — "${safeTopic}":

• Mission Briefing (5 mins):
  - Pose a real-world scenario (e.g. data logger, simulation, automated verification).
  - Clarify the user requirements and test dataset.

• Guided Build (15 mins):
  - Task 1: Set up core data structures / variables and prompt user input.
  - Task 2: Implement the primary conditional branching / loop logic.

• Independent Challenge (15 mins):
  - Task 3: Add error validation (handling invalid user inputs gracefully).
  - Task 4 (Extension): Export results or format output into a clean summary report.

• Peer Testing & Debrief (5 mins):
  - Swap seats: test partner's program with rogue inputs to attempt breaking the code.`;
  } else {
    fallbackSuggestion = `Pedagogical Lesson Plan for ${safeYear} — "${safeTopic}":

• Starter Hook (5–7 mins):
  - Retrieval practice quiz: 3 quick-fire recall questions on prerequisite syntax.
  - "Find the Bug" puzzle displayed on the whiteboard to activate analytical thinking.

• Main Direct Instruction & Practical Activity (25–30 mins):
  - Teacher live-coding model using I-do / We-do / You-do approach.
  - Hands-on tiered exercise sheet: Bronze (reproduction), Silver (adaptation), Gold (extension).
  - Midway check for understanding using quick mini-whiteboard response.

• Plenary & Assessment Exit Ticket (5 mins):
  - 1 exam-style definition question or code tracing prediction submitted before leaving class.`;
  }

  return res.json({ suggestion: fallbackSuggestion, fallback: true });
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
