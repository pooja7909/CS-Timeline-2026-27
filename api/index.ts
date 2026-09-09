import { INITIAL_PLAN } from '../src/data/defaultPlan.ts';
import { DEFAULT_YEAR_REPORT_DATES } from '../src/data/reportCycles.ts';

// Central in-memory state shared across serverless invokes in same container
let state = {
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
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, body } = req;

  if (method === 'GET') {
    const { secretPin, ...safeState } = state;
    return res.status(200).json(safeState);
  }

  if (method === 'PUT' || method === 'POST') {
    const { plan, reportDates, pin } = body || {};

    if (state.lock.isLocked && state.secretPin && state.secretPin !== pin) {
      return res.status(403).json({ error: "Timeline is locked. Valid PIN required." });
    }

    if (plan && Array.isArray(plan)) {
      state.plan = plan;
    }
    if (reportDates && Array.isArray(reportDates)) {
      state.reportDates = reportDates;
    }

    state.version += 1;
    state.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      success: true,
      version: state.version,
      lastUpdated: state.lastUpdated
    });
  }

  const { secretPin, ...safeState } = state;
  return res.status(200).json(safeState);
}
