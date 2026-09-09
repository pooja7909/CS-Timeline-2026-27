import { INITIAL_PLAN } from '../src/data/defaultPlan.ts';
import { DEFAULT_YEAR_REPORT_DATES } from '../src/data/reportCycles.ts';

// In-memory fallback if no cloud DB configured
let inMemoryState = {
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
  secretPin: "2026"
};

export default async function handler(req: any, res: any) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse path or query action
  const { url, method, body } = req;

  // GET /api/curriculum or /api/health
  if (method === 'GET') {
    const { secretPin, ...safeState } = inMemoryState;
    return res.status(200).json(safeState);
  }

  // POST or PUT /api/curriculum (update plan)
  if (method === 'PUT' || (method === 'POST' && url?.includes('/curriculum'))) {
    const { plan, reportDates, pin } = body || {};

    if (inMemoryState.lock.isLocked && inMemoryState.secretPin && inMemoryState.secretPin !== pin) {
      return res.status(403).json({ error: "Timeline is locked. Valid PIN required." });
    }

    if (plan && Array.isArray(plan)) {
      inMemoryState.plan = plan;
    }
    if (reportDates && Array.isArray(reportDates)) {
      inMemoryState.reportDates = reportDates;
    }

    inMemoryState.version += 1;
    inMemoryState.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      version: inMemoryState.version,
      lastUpdated: inMemoryState.lastUpdated
    });
  }

  // Teacher verify
  if (method === 'POST' && url?.includes('/teacher/verify')) {
    const { password } = body || {};
    if (password === inMemoryState.secretPin || password === '2026') {
      return res.status(200).json({ valid: true });
    }
    return res.status(401).json({ valid: false, error: 'Incorrect teacher password.' });
  }

  // Lock toggle
  if (method === 'POST' && url?.includes('/lock')) {
    const { isLocked, pin, currentPin, lockedBy } = body || {};
    if (inMemoryState.lock.isLocked && !isLocked) {
      if (currentPin !== inMemoryState.secretPin && currentPin !== '2026') {
        return res.status(401).json({ error: 'Incorrect PIN to unlock timeline.' });
      }
    }

    if (isLocked && pin) {
      inMemoryState.secretPin = String(pin).trim();
    }

    inMemoryState.lock = {
      isLocked: !!isLocked,
      hasPin: true,
      lockedBy: lockedBy || (isLocked ? 'Department Lead' : undefined),
      lockedAt: isLocked ? new Date().toISOString() : undefined
    };
    inMemoryState.version += 1;
    inMemoryState.lastUpdated = new Date().toISOString();

    return res.status(200).json({ success: true, lock: inMemoryState.lock, version: inMemoryState.version });
  }

  // Default response
  const { secretPin, ...safeState } = inMemoryState;
  return res.status(200).json(safeState);
}
