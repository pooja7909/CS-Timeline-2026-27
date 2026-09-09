import { PortalOverviewSettings, ActiveWeekSetting } from '../types';

export const DEFAULT_OVERVIEW_SETTINGS: PortalOverviewSettings = {
  portalTitle: 'Computing Syllabus & Curriculum Timeline',
  portalDescription: 'Overview of all 38 teaching weeks, unit timelines, and assessment milestones for the 2026–2027 academic year.',
  academicYearLabel: 'Academic Year 2026–2027'
};

export const DEFAULT_ACTIVE_WEEK_SETTING: ActiveWeekSetting = {
  mode: 'auto',
  manualTermId: 't1',
  manualWeekN: 1
};
