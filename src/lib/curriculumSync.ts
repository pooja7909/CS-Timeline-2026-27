import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { CurriculumState, TermData, YearReportDate, LockState, StudentVisibilitySettings, ActiveWeekSetting, PortalOverviewSettings } from '../types';
import { INITIAL_PLAN } from '../data/defaultPlan';
import { DEFAULT_YEAR_REPORT_DATES } from '../data/reportCycles';
import { DEFAULT_STUDENT_VISIBILITY } from '../data/defaultVisibility';
import { DEFAULT_OVERVIEW_SETTINGS, DEFAULT_ACTIVE_WEEK_SETTING } from '../data/defaultSettings';

const CURRICULUM_DOC_REF = doc(db, 'curriculum', 'main');

// In-memory / cache fallback
const DEFAULT_STATE: CurriculumState = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  lock: {
    isLocked: false,
    hasPin: true,
    lockedBy: 'Department'
  },
  plan: INITIAL_PLAN,
  reportDates: DEFAULT_YEAR_REPORT_DATES,
  studentVisibility: DEFAULT_STUDENT_VISIBILITY,
  activeWeekSetting: DEFAULT_ACTIVE_WEEK_SETTING,
  overviewSettings: DEFAULT_OVERVIEW_SETTINGS
};

/**
 * Fetch the latest document from Firestore once.
 */
export async function getCurriculumFromCloud(): Promise<CurriculumState | null> {
  try {
    const snap = await getDoc(CURRICULUM_DOC_REF);
    if (snap.exists()) {
      const data = snap.data() as any;
      return {
        version: data.version || 1,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        lock: data.lock !== undefined ? data.lock : { isLocked: false, hasPin: true },
        plan: Array.isArray(data.plan) && data.plan.length > 0 ? data.plan : INITIAL_PLAN,
        reportDates: Array.isArray(data.reportDates) ? data.reportDates : DEFAULT_YEAR_REPORT_DATES,
        studentVisibility: data.studentVisibility ? { ...DEFAULT_STUDENT_VISIBILITY, ...data.studentVisibility } : DEFAULT_STUDENT_VISIBILITY,
        activeWeekSetting: data.activeWeekSetting ? { ...DEFAULT_ACTIVE_WEEK_SETTING, ...data.activeWeekSetting } : DEFAULT_ACTIVE_WEEK_SETTING,
        overviewSettings: data.overviewSettings ? { ...DEFAULT_OVERVIEW_SETTINGS, ...data.overviewSettings } : DEFAULT_OVERVIEW_SETTINGS
      };
    }
  } catch (err) {
    console.error('Failed to get curriculum from cloud:', err);
  }
  return null;
}

/**
 * Subscribe in real time to the curriculum document in Firestore.
 * When changes are saved on desktop, mobile immediately receives the update through this listener.
 */
export function subscribeToCurriculum(
  onUpdate: (state: CurriculumState) => void,
  onError: (err: any) => void
) {
  try {
    // 1. First trigger an eager fetch to show changes instantly upon opening
    getCurriculumFromCloud().then((cloudData) => {
      if (cloudData) {
        onUpdate(cloudData);
      }
    });

    // 2. Real-time snapshot listener
    const unsubscribe = onSnapshot(
      CURRICULUM_DOC_REF,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as any;
          const cleanState: CurriculumState = {
            version: data.version || 1,
            lastUpdated: data.lastUpdated || new Date().toISOString(),
            lock: data.lock !== undefined ? data.lock : { isLocked: false, hasPin: true },
            plan: Array.isArray(data.plan) && data.plan.length > 0 ? data.plan : INITIAL_PLAN,
            reportDates: Array.isArray(data.reportDates) ? data.reportDates : DEFAULT_YEAR_REPORT_DATES,
            studentVisibility: data.studentVisibility ? { ...DEFAULT_STUDENT_VISIBILITY, ...data.studentVisibility } : DEFAULT_STUDENT_VISIBILITY,
            activeWeekSetting: data.activeWeekSetting ? { ...DEFAULT_ACTIVE_WEEK_SETTING, ...data.activeWeekSetting } : DEFAULT_ACTIVE_WEEK_SETTING,
            overviewSettings: data.overviewSettings ? { ...DEFAULT_OVERVIEW_SETTINGS, ...data.overviewSettings } : DEFAULT_OVERVIEW_SETTINGS
          };
          
          try {
            localStorage.setItem('curriculum_plan_v2', JSON.stringify(cleanState.plan));
            localStorage.setItem('curriculum_report_dates_v2', JSON.stringify(cleanState.reportDates));
            localStorage.setItem('curriculum_lock_state', JSON.stringify(cleanState.lock));
            localStorage.setItem('curriculum_student_visibility', JSON.stringify(cleanState.studentVisibility));
            localStorage.setItem('curriculum_active_week_setting', JSON.stringify(cleanState.activeWeekSetting));
            localStorage.setItem('curriculum_overview_settings', JSON.stringify(cleanState.overviewSettings));
            localStorage.setItem('curriculum_last_updated', cleanState.lastUpdated);
          } catch {}

          onUpdate(cleanState);
        } else {
          // If no document in cloud yet, seed with current initial state (unlocked by default)
          saveCurriculumToCloud(
            INITIAL_PLAN, 
            DEFAULT_YEAR_REPORT_DATES, 
            { isLocked: false, hasPin: true }, 
            DEFAULT_STUDENT_VISIBILITY,
            DEFAULT_ACTIVE_WEEK_SETTING,
            DEFAULT_OVERVIEW_SETTINGS
          )
            .then(() => onUpdate(DEFAULT_STATE))
            .catch((err) => console.warn('Could not auto-seed cloud curriculum:', err));
        }
      },
      (error) => {
        console.error('Firestore real-time subscription error:', error);
        onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Error setting up Firestore listener:', err);
    onError(err);
    return () => {};
  }
}

/**
 * Recursively strip undefined properties from an object/array so Firestore setDoc does not throw errors.
 */
function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as any;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeForFirestore(value);
    }
  }
  return cleanObj as T;
}

/**
 * Save updated curriculum plan, report dates, lock state, visibility, active week, or overview settings directly to Firestore.
 */
export async function saveCurriculumToCloud(
  plan?: TermData[],
  reportDates?: YearReportDate[],
  lock?: LockState,
  studentVisibility?: StudentVisibilitySettings,
  activeWeekSetting?: ActiveWeekSetting,
  overviewSettings?: PortalOverviewSettings
): Promise<{ success: boolean; lastUpdated: string }> {
  const lastUpdated = new Date().toISOString();
  const updatePayload: Record<string, any> = {
    lastUpdated
  };

  if (plan && Array.isArray(plan)) {
    updatePayload.plan = plan;
  }
  if (reportDates && Array.isArray(reportDates)) {
    updatePayload.reportDates = reportDates;
  }
  if (studentVisibility !== undefined) {
    updatePayload.studentVisibility = studentVisibility;
  }
  if (activeWeekSetting !== undefined) {
    updatePayload.activeWeekSetting = activeWeekSetting;
  }
  if (overviewSettings !== undefined) {
    updatePayload.overviewSettings = overviewSettings;
  }
  if (lock !== undefined) {
    updatePayload.lock = {
      isLocked: Boolean(lock.isLocked),
      hasPin: Boolean(lock.hasPin),
      ...(lock.lockedBy ? { lockedBy: lock.lockedBy } : {}),
      ...(lock.lockedAt ? { lockedAt: lock.lockedAt } : {})
    };
  }

  const cleanPayload = sanitizeForFirestore(updatePayload);

  try {
    await setDoc(CURRICULUM_DOC_REF, cleanPayload, { merge: true });
    return { success: true, lastUpdated };
  } catch (err) {
    console.error('Error saving to Firestore:', err);
    throw err;
  }
}
