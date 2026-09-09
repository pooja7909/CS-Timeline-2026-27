import { StudentVisibilitySettings } from '../types';

export const DEFAULT_STUDENT_VISIBILITY: StudentVisibilitySettings = {
  // Tabs visible to students in the portal
  showTimeline: true,
  showReports: true,
  showCalendar: false,
  showMatrix: false,
  showRoadmap: false,

  // Sections & components
  showHolidays: true,
  showAssessmentsRibbon: true,
  showAssessmentBadges: true,
  showTeacherNotes: false,

  // Active year groups visible to students
  visibleYears: ['y7', 'y8', 'y9', 'y10', 'y11', 'y12', 'y13']
};
