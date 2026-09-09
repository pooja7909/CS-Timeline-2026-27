export interface YearConfig {
  id: 'y7' | 'y8' | 'y9' | 'y10' | 'y11' | 'y12' | 'y13';
  label: string;
  short: string;
  stage: 'ks3' | 'ks4' | 'ks5';
  qualification?: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
}

export type ReportType = 'settling_in' | 'interim' | 'full' | 'mock_report' | 'exam_prediction';

export interface ReportCycle {
  id: string;
  name: string;
  shortCode: string;
  termId: 't1' | 't2' | 't3';
  weekNumber: number;
  dates: string;
  targetCohorts: string[]; // e.g. ['y7', 'y10', 'y12']
  stage: 'all' | 'ks3' | 'ks4' | 'ks5';
  type: ReportType;
  gradeEntryStart: string;
  gradeEntryDeadline: string;
  hodModerationDeadline: string;
  publicationDate: string;
  ptcDate?: string;
  description: string;
  components: string[];
}

export interface CellData {
  text: string;
  assess: boolean;
  taught: boolean;
  notes?: string;
  resources?: string[];
}

export interface WeekRow {
  kind: 'week';
  n: number;
  dates: string;
  iso: string;
  flag?: string;
  cells: Record<string, CellData>;
  note: string;
}

export interface BreakRow {
  id?: string;
  kind: 'break';
  label: string;
  badge?: string;
  dates?: string;
  detail?: string;
  visibleToStudents?: boolean;
}

export interface StudentVisibilitySettings {
  showTimeline: boolean;
  showReports: boolean;
  showCalendar: boolean;
  showMatrix: boolean;
  showRoadmap: boolean;
  showHolidays: boolean;
  showAssessmentsRibbon: boolean;
  showAssessmentBadges: boolean;
  showTeacherNotes: boolean;
  visibleYears: string[];
}

export type RowItem = WeekRow | BreakRow;

export interface TermData {
  id: 't1' | 't2' | 't3';
  name: string;
  dates: string;
  weeks: number;
  themeColor: string;
  rows: RowItem[];
}

export interface YearReportDate {
  id: string;
  yearId: string; // 'y7' | 'y8' | 'y9' | 'y10' | 'y11' | 'y12' | 'y13'
  reportName: string;
  termId: 't1' | 't2' | 't3';
  openDate: string; // YYYY-MM-DD or readable string
  closeDate: string; // YYYY-MM-DD or readable string
  notes?: string;
}

export interface LockState {
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
  hasPin: boolean;
}

export interface ActiveWeekSetting {
  mode: 'auto' | 'manual';
  manualTermId?: 't1' | 't2' | 't3';
  manualWeekN?: number;
}

export interface PortalOverviewSettings {
  portalTitle: string;
  portalDescription: string;
  academicYearLabel: string;
}

export interface CurriculumState {
  version: number;
  lastUpdated: string;
  lock: LockState;
  plan: TermData[];
  reportDates?: YearReportDate[];
  studentVisibility?: StudentVisibilitySettings;
  activeWeekSetting?: ActiveWeekSetting;
  overviewSettings?: PortalOverviewSettings;
}

export type ViewMode = 'matrix' | 'timeline' | 'reports' | 'calendar' | 'roadmap';
export type UserRole = 'teacher' | 'student';

