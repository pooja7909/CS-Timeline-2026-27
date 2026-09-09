import { ReportCycle, YearReportDate } from '../types';

export const DEFAULT_YEAR_REPORT_DATES: YearReportDate[] = [
  // Year 7
  { id: 'yr-y7-1', yearId: 'y7', reportName: 'Report 1 (Settling-In)', termId: 't1', openDate: '2026-10-02', closeDate: '2026-10-09', notes: 'Attitude to Learning & initial transition' },
  { id: 'yr-y7-2', yearId: 'y7', reportName: 'Report 2 (Autumn Interim)', termId: 't1', openDate: '2026-12-04', closeDate: '2026-12-11', notes: 'Term 1 progress & working step' },
  { id: 'yr-y7-3', yearId: 'y7', reportName: 'Report 3 (End of Year Full)', termId: 't3', openDate: '2027-05-28', closeDate: '2027-06-04', notes: 'Full written comment & exam score' },

  // Year 8
  { id: 'yr-y8-1', yearId: 'y8', reportName: 'Report 1 (Autumn Interim)', termId: 't1', openDate: '2026-12-04', closeDate: '2026-12-11', notes: 'Term 1 progress & working step' },
  { id: 'yr-y8-2', yearId: 'y8', reportName: 'Report 2 (End of Year Full)', termId: 't3', openDate: '2027-05-28', closeDate: '2027-06-04', notes: 'Full written comment & exam score' },

  // Year 9
  { id: 'yr-y9-1', yearId: 'y9', reportName: 'Report 1 (Autumn Interim)', termId: 't1', openDate: '2026-12-04', closeDate: '2026-12-11', notes: 'Term 1 progress & Python milestones' },
  { id: 'yr-y9-2', yearId: 'y9', reportName: 'Report 2 (Options Recommendation)', termId: 't2', openDate: '2027-03-05', closeDate: '2027-03-12', notes: 'IGCSE subject selection advice' },
  { id: 'yr-y9-3', yearId: 'y9', reportName: 'Report 3 (End of Year Full)', termId: 't3', openDate: '2027-05-28', closeDate: '2027-06-04', notes: 'Full written comment & KS3 completion' },

  // Year 10 (IGCSE Year 1)
  { id: 'yr-y10-1', yearId: 'y10', reportName: 'Report 1 (Autumn Interim)', termId: 't1', openDate: '2026-10-02', closeDate: '2026-10-09', notes: 'IGCSE baseline working grade' },
  { id: 'yr-y10-2', yearId: 'y10', reportName: 'Report 2 (Spring Progress)', termId: 't2', openDate: '2027-03-05', closeDate: '2027-03-12', notes: 'Python programming & mid-point check' },
  { id: 'yr-y10-3', yearId: 'y10', reportName: 'Report 3 (End of Year Full)', termId: 't3', openDate: '2027-05-28', closeDate: '2027-06-04', notes: 'EOY Paper 1 examination report' },

  // Year 11 (IGCSE Year 2 Exam Class)
  { id: 'yr-y11-1', yearId: 'y11', reportName: 'Report 1 (Pre-Mock Interim)', termId: 't1', openDate: '2026-11-13', closeDate: '2026-11-20', notes: 'Working grade & mock readiness' },
  { id: 'yr-y11-2', yearId: 'y11', reportName: 'Report 2 (Mock Exam & Predicted)', termId: 't2', openDate: '2027-01-29', closeDate: '2027-02-05', notes: 'Mock exam marks & official predictions' },

  // Year 12 (IB DP Year 1)
  { id: 'yr-y12-1', yearId: 'y12', reportName: 'Report 1 (Settling-In & Interim)', termId: 't1', openDate: '2026-10-02', closeDate: '2026-10-09', notes: 'IB transition & computational thinking' },
  { id: 'yr-y12-2', yearId: 'y12', reportName: 'Report 2 (IA Progress Check)', termId: 't2', openDate: '2027-03-05', closeDate: '2027-03-12', notes: 'Internal Assessment solution milestones' },
  { id: 'yr-y12-3', yearId: 'y12', reportName: 'Report 3 (End of Year Full)', termId: 't3', openDate: '2027-05-28', closeDate: '2027-06-04', notes: 'End of Year exam & predicted grade' },

  // Year 13 (IB DP Year 2 Exam Class)
  { id: 'yr-y13-1', yearId: 'y13', reportName: 'Report 1 (Autumn Interim & IA)', termId: 't1', openDate: '2026-11-13', closeDate: '2026-11-20', notes: 'Final IA submission & working grade' },
  { id: 'yr-y13-2', yearId: 'y13', reportName: 'Report 2 (Mock Exam & Predicted)', termId: 't2', openDate: '2027-01-29', closeDate: '2027-02-05', notes: 'January mock results & final IB predictions' }
];

export const REPORT_CYCLES_2026_2027: ReportCycle[] = [
  {
    id: 'rep-1',
    name: 'Report Cycle 1: Settling-In & Attitude to Learning',
    shortCode: 'RC1 · Settling-In',
    termId: 't1',
    weekNumber: 7,
    dates: '5–9 Oct 2026',
    targetCohorts: ['y7', 'y10', 'y12'],
    stage: 'all',
    type: 'settling_in',
    gradeEntryStart: '2026-10-02',
    gradeEntryDeadline: '2026-10-09 (17:00)',
    hodModerationDeadline: '2026-10-13',
    publicationDate: '2026-10-16',
    ptcDate: '2026-11-04 (Year 7 & 12 Settling-In Evening)',
    description: 'Early diagnostic progress check on student transition, organization, and learning habits following the first half-term.',
    components: [
      'Attitude to Learning (1–4: Exemplary, Engaged, Inconsistent, Causing Concern)',
      'Classroom Engagement & Homework Compliance',
      'Brief Settling-In Form Tutor / Subject Overview'
    ]
  },
  {
    id: 'rep-2',
    name: 'Report Cycle 2: Examination Classes Autumn Interim',
    shortCode: 'RC2 · Exam Interim',
    termId: 't1',
    weekNumber: 13,
    dates: '16–20 Nov 2026',
    targetCohorts: ['y11', 'y13'],
    stage: 'ks4',
    type: 'interim',
    gradeEntryStart: '2026-11-13',
    gradeEntryDeadline: '2026-11-20 (17:00)',
    hodModerationDeadline: '2026-11-24',
    publicationDate: '2026-11-27',
    ptcDate: '2026-12-03 (Year 11 & Year 13 PTC)',
    description: 'Pre-mock check for GCSE and IB Diploma examination candidates; baseline working grade and target mock benchmarks.',
    components: [
      'Current Working Grade (IGCSE 9–1 / IB DP 1–7)',
      'Attitude to Learning (1–4)',
      'Mock Exam Readiness Target & Focus Topic'
    ]
  },
  {
    id: 'rep-3',
    name: 'Report Cycle 3: Key Stage 3 Autumn Interim Report',
    shortCode: 'RC3 · KS3 Interim',
    termId: 't1',
    weekNumber: 16,
    dates: '7–11 Dec 2026',
    targetCohorts: ['y7', 'y8', 'y9'],
    stage: 'ks3',
    type: 'interim',
    gradeEntryStart: '2026-12-04',
    gradeEntryDeadline: '2026-12-11 (17:00)',
    hodModerationDeadline: '2026-12-14',
    publicationDate: '2026-12-16',
    ptcDate: '2027-01-14 (KS3 Parent Consultation)',
    description: 'End-of-term academic review for lower secondary cohorts covering computational thinking, programming milestones, and digital citizenship.',
    components: [
      'KS3 Working Step (Mastery / Secure / Developing / Foundation)',
      'Attitude to Learning (1–4)',
      'Next Steps Target'
    ]
  },
  {
    id: 'rep-4',
    name: 'Report Cycle 4: Mock Examination & Mid-Year Full Report',
    shortCode: 'RC4 · Mock & Full',
    termId: 't2',
    weekNumber: 22,
    dates: '1–5 Feb 2027',
    targetCohorts: ['y11', 'y13'],
    stage: 'ks4',
    type: 'mock_report',
    gradeEntryStart: '2027-01-29',
    gradeEntryDeadline: '2027-02-05 (17:00)',
    hodModerationDeadline: '2027-02-09',
    publicationDate: '2027-02-12',
    ptcDate: '2027-02-25 (Post-Mock Guidance Evening)',
    description: 'Comprehensive report on official January mock results, Paper 1 & Paper 2 breakdown, predicted final exam grades, and revision interventions.',
    components: [
      'Mock Exam Percentage & Grade Achieved',
      'Predicted Final Grade (IGCSE 9–1 / IB DP 1–7)',
      'Attitude to Learning (1–4)',
      'Detailed Subject Teacher Written Commentary (100–120 words)',
      'Specific Paper 1 / Paper 2 Revision Priorities'
    ]
  },
  {
    id: 'rep-5',
    name: 'Report Cycle 5: Year 9 Options & Spring Progress Report',
    shortCode: 'RC5 · Options & Progress',
    termId: 't2',
    weekNumber: 27,
    dates: '8–12 Mar 2027',
    targetCohorts: ['y9', 'y10', 'y12'],
    stage: 'all',
    type: 'full',
    gradeEntryStart: '2027-03-05',
    gradeEntryDeadline: '2027-03-12 (17:00)',
    hodModerationDeadline: '2027-03-16',
    publicationDate: '2027-03-19',
    ptcDate: '2027-03-23 (Year 9 IGCSE Options Fair & Consultation)',
    description: 'Key Stage 4 course suitability recommendation for Year 9, alongside Year 10 IGCSE midpoint & Year 12 IB Internal Assessment progress checks.',
    components: [
      'Year 9 IGCSE Computer Science Suitability Recommendation (Recommended / Discussion Required)',
      'Attainment Grade & Attitude to Learning (1–4)',
      'Year 12 IA Computational Solution Progress Check',
      'Targeted Subject Action Targets'
    ]
  },
  {
    id: 'rep-6',
    name: 'Report Cycle 6: End of Year Comprehensive Full Reports',
    shortCode: 'RC6 · End of Year Full',
    termId: 't3',
    weekNumber: 36,
    dates: '31 May – 4 Jun 2027',
    targetCohorts: ['y7', 'y8', 'y9', 'y10', 'y12'],
    stage: 'all',
    type: 'full',
    gradeEntryStart: '2027-05-28',
    gradeEntryDeadline: '2027-06-04 (17:00)',
    hodModerationDeadline: '2027-06-08',
    publicationDate: '2027-06-18',
    ptcDate: '2027-06-22 (End of Year Academic Review)',
    description: 'Summative end-of-year academic evaluation for all non-graduating cohorts, incorporating end-of-year exams and next-year targets.',
    components: [
      'End of Year Examination Score (%) & Final Grade',
      'Overall Subject Mastery & Attainment Grade',
      'Attitude to Learning (1–4)',
      'Comprehensive Subject Teacher Written Report (120–150 words)',
      'Summer Independent Learning & Preparation Targets'
    ]
  }
];

export const REPORT_CYCLES = REPORT_CYCLES_2026_2027;

export function getReportCyclesForWeek(termId: string, weekN: number): ReportCycle[] {
  return REPORT_CYCLES_2026_2027.filter(
    (cycle) => cycle.termId === termId && cycle.weekNumber === weekN
  );
}

export function isReportWeek(termId: string, weekN: number): boolean {
  return REPORT_CYCLES_2026_2027.some(
    (cycle) => cycle.termId === termId && cycle.weekNumber === weekN
  );
}
