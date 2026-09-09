import React, { useState } from 'react';
import { TermData, YearConfig, BreakRow, StudentVisibilitySettings, YearReportDate, UserRole, PortalOverviewSettings } from '../types';
import { 
  GraduationCap, 
  Star, 
  Calendar, 
  Search, 
  Clock, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  BookOpen,
  Filter,
  Flame,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Sliders,
  FileCheck2,
  List,
  LayoutGrid,
  Map,
  Tag,
  AlertCircle,
  Users,
  LogOut
} from 'lucide-react';
import { REPORT_CYCLES } from '../data/reportCycles';
import { CalendarView } from './CalendarView';
import { MatrixView } from './MatrixView';
import { RoadmapView } from './RoadmapView';

interface StudentViewProps {
  plan: TermData[];
  years: YearConfig[];
  selectedYearId: string;
  onSelectYear: (yearId: string) => void;
  currentWeekKey: string | null;
  currentTermName: string;
  currentWeekText: string;
  isManualWeek?: boolean;
  overviewSettings?: PortalOverviewSettings;
  // Dynamic teacher controls & visibility settings
  userRole?: UserRole;
  isTeacherAuthenticated?: boolean;
  onReturnToTeacherPage?: () => void;
  onLogoutTeacher?: () => void;
  visibilitySettings?: StudentVisibilitySettings;
  reportDates?: YearReportDate[];
  onEditBreak?: (termId: string, breakItem: BreakRow, positionIdx: number) => void;
  onDeleteBreak?: (termId: string, positionIdx: number) => void;
  onToggleBreakVisibility?: (termId: string, positionIdx: number, newVisibility: boolean) => void;
  onAddBreak?: (termId: string) => void;
  onOpenVisibilitySettings?: () => void;
  onOpenOverviewModal?: () => void;
  onOpenActiveWeekModal?: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  plan,
  years,
  selectedYearId,
  onSelectYear,
  currentWeekKey,
  currentTermName,
  currentWeekText,
  isManualWeek = false,
  overviewSettings,
  userRole = 'student',
  isTeacherAuthenticated = false,
  onReturnToTeacherPage,
  onLogoutTeacher,
  visibilitySettings,
  reportDates = [],
  onEditBreak,
  onDeleteBreak,
  onToggleBreakVisibility,
  onAddBreak,
  onOpenVisibilitySettings,
  onOpenOverviewModal,
  onOpenActiveWeekModal
}) => {
  const [search, setSearch] = useState('');
  const [filterAssessmentsOnly, setFilterAssessmentsOnly] = useState(false);
  const [activeTermTab, setActiveTermTab] = useState<string>('all');
  const [activePortalTab, setActivePortalTab] = useState<'timeline' | 'reports' | 'calendar' | 'matrix' | 'roadmap'>('timeline');

  // Filter years based on teacher's visibility settings (if in student role)
  const allowedYears = userRole === 'teacher' || !visibilitySettings?.visibleYears
    ? years
    : years.filter(y => visibilitySettings.visibleYears.includes(y.id));

  // Ensure selected year is in allowed list
  const activeYearList = allowedYears.length > 0 ? allowedYears : years;
  const selectedYear = activeYearList.find(y => y.id === selectedYearId) || activeYearList[0] || years[0];

  // Collect all assessments for quick summary card
  const allAssessments: {
    termName: string;
    weekN: number;
    dates: string;
    topic: string;
    flag?: string;
    isCurrentWeek: boolean;
  }[] = [];

  plan.forEach(term => {
    term.rows.forEach(row => {
      if (row.kind === 'week') {
        const cell = row.cells[selectedYear.id];
        if (cell && (cell.assess || cell.text.toLowerCase().includes('assessment') || cell.text.toLowerCase().includes('exam') || cell.text.toLowerCase().includes('test') || cell.text.toLowerCase().includes('mock') || cell.text.toLowerCase().includes('criterion'))) {
          allAssessments.push({
            termName: term.name.split('·')[0].trim(),
            weekN: row.n,
            dates: row.dates,
            topic: cell.text,
            flag: row.flag,
            isCurrentWeek: `${term.id}-${row.n}` === currentWeekKey
          });
        }
      }
    });
  });

  // Filter report cycles relevant to selected year
  const relevantReports = REPORT_CYCLES.filter(r => {
    if (r.targetCohorts.includes(selectedYear.id)) return true;
    if (r.stage === 'all') return true;
    if (r.stage === selectedYear.stage) return true;
    return false;
  });

  // Check if multiple tabs are active for students
  const canShowReports = visibilitySettings ? visibilitySettings.showReports : true;
  const canShowCalendar = visibilitySettings ? visibilitySettings.showCalendar : false;
  const canShowMatrix = visibilitySettings ? visibilitySettings.showMatrix : false;
  const canShowRoadmap = visibilitySettings ? visibilitySettings.showRoadmap : false;

  const hasMultipleTabs = userRole === 'teacher' || canShowReports || canShowCalendar || canShowMatrix || canShowRoadmap;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Teacher Active Banner — Only visible when authenticated staff is viewing student portal */}
      {isTeacherAuthenticated && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-indigo-500/30">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Teacher Mode
            </span>
            <span className="text-xs text-indigo-100 font-medium">
              You are viewing the Student & Parent Portal.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onReturnToTeacherPage && (
              <button
                type="button"
                onClick={onReturnToTeacherPage}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-indigo-400/40"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Return to Teacher Page</span>
              </button>
            )}
            {onLogoutTeacher && (
              <button
                type="button"
                onClick={onLogoutTeacher}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600/90 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer border border-white/15"
                title="Sign out of teacher session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono-code font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{overviewSettings?.academicYearLabel || 'Academic Year 2026–2027'}</span>
              </div>

              {userRole === 'teacher' ? (
                <div className="flex items-center gap-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono-code font-bold">
                    <Pencil className="w-3 h-3" />
                    <span>Teacher Preview & Edit Mode</span>
                  </div>
                  {onOpenOverviewModal && (
                    <button
                      type="button"
                      onClick={onOpenOverviewModal}
                      title="Edit portal title, academic year label and overview description"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3 h-3 text-indigo-300" />
                      <span>Edit Heading</span>
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-xs text-indigo-200/80 font-mono-code">Student & Parent Portal</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
              {overviewSettings?.portalTitle || 'Computing Syllabus & Curriculum Timeline'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-sans leading-relaxed">
              {overviewSettings?.portalDescription || 'Overview of all 38 teaching weeks, unit timelines, and assessment milestones for the 2026–2027 academic year.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            <div 
              onClick={userRole === 'teacher' && onOpenActiveWeekModal ? onOpenActiveWeekModal : undefined}
              className={`bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-left md:text-right ${
                userRole === 'teacher' && onOpenActiveWeekModal ? 'hover:bg-white/20 transition-all cursor-pointer group' : ''
              }`}
              title={userRole === 'teacher' ? 'Click to change active school week setting or toggle Auto/Manual' : undefined}
            >
              <div className="flex items-center md:justify-end gap-1.5">
                <span className="text-[11px] font-mono-code text-indigo-200 block uppercase font-bold">
                  Current School Week
                </span>
                {isManualWeek ? (
                  <span className="px-1.5 py-0.2 bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded text-[9px] font-bold">Manual</span>
                ) : (
                  <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded text-[9px] font-bold">Auto</span>
                )}
              </div>
              <div className="text-base font-bold text-white font-display flex items-center md:justify-end gap-1.5 mt-0.5">
                <span>{currentTermName} · {currentWeekText}</span>
                {userRole === 'teacher' && (
                  <Sliders className="w-3.5 h-3.5 text-indigo-300 opacity-70 group-hover:opacity-100 transition-opacity ml-1" />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {userRole === 'teacher' && onOpenActiveWeekModal && (
                <button
                  type="button"
                  onClick={onOpenActiveWeekModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-indigo-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Week Settings</span>
                </button>
              )}

              {userRole === 'teacher' && onOpenVisibilitySettings && (
                <button
                  type="button"
                  onClick={onOpenVisibilitySettings}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Manage Student Visibility</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Portal Tabs Switcher (if teacher enabled multiple tabs) */}
        {hasMultipleTabs && (
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePortalTab('timeline')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activePortalTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-md scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Syllabus & Timeline</span>
            </button>

            {(userRole === 'teacher' || canShowReports) && (
              <button
                onClick={() => setActivePortalTab('reports')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  activePortalTab === 'reports'
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Report Cycles & Deadlines</span>
                {userRole === 'teacher' && !canShowReports && (
                  <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.5 rounded text-rose-200">Hidden</span>
                )}
              </button>
            )}

            {(userRole === 'teacher' || canShowCalendar) && (
              <button
                onClick={() => setActivePortalTab('calendar')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  activePortalTab === 'calendar'
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Academic Calendar</span>
                {userRole === 'teacher' && !canShowCalendar && (
                  <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.5 rounded text-rose-200">Hidden</span>
                )}
              </button>
            )}

            {(userRole === 'teacher' || canShowMatrix) && (
              <button
                onClick={() => setActivePortalTab('matrix')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  activePortalTab === 'matrix'
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Whole-School Matrix</span>
                {userRole === 'teacher' && !canShowMatrix && (
                  <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.5 rounded text-rose-200">Hidden</span>
                )}
              </button>
            )}

            {(userRole === 'teacher' || canShowRoadmap) && (
              <button
                onClick={() => setActivePortalTab('roadmap')}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  activePortalTab === 'roadmap'
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Progression Roadmap</span>
                {userRole === 'teacher' && !canShowRoadmap && (
                  <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.5 rounded text-rose-200">Hidden</span>
                )}
              </button>
            )}
          </div>
        )}

        {/* Year Group Selection Pills */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-indigo-200">
              Choose Your Year Level:
            </label>
            {userRole === 'teacher' && visibilitySettings && (
              <span className="text-[11px] font-mono-code text-indigo-300">
                {activeYearList.length} of {years.length} Years Published
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {activeYearList.map((y) => {
              const isSelected = y.id === selectedYear.id;
              return (
                <button
                  key={y.id}
                  onClick={() => onSelectYear(y.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-lg scale-105 ring-2 ring-indigo-400'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <span>{y.label}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono-code ${
                    isSelected ? 'bg-slate-200 text-slate-800' : 'bg-white/20 text-slate-200'
                  }`}>
                    {y.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab View: Reporting Dates & Cycles */}
      {activePortalTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-indigo-600" />
                  <span>Reporting Cycles & Deadlines — {selectedYear.label}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Official reporting windows, grade submission dates, and publication milestones for {selectedYear.qualification || selectedYear.label}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantReports.map((cycle) => (
                <div 
                  key={cycle.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        {cycle.dates}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5 font-display">
                        {cycle.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-800">
                      {cycle.shortCode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cycle.description}
                  </p>

                  <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs font-mono-code">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Published To Parents</span>
                      <span className="font-bold text-slate-800">{cycle.publicationDate}</span>
                    </div>
                    {cycle.ptcDate && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Parents' Evening (PTC)</span>
                        <span className="font-bold text-indigo-700">{cycle.ptcDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab View: Calendar */}
      {activePortalTab === 'calendar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <CalendarView />
        </div>
      )}

      {/* Tab View: Matrix */}
      {activePortalTab === 'matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <MatrixView
            plan={plan}
            selectedYears={[selectedYear.id]}
            searchQuery=""
            assessOnly={false}
            reportOnly={false}
            userRole={userRole}
            isLocked={true}
            onUpdateCell={() => {}}
            onUpdateNote={() => {}}
            onSelectYear={onSelectYear}
            currentWeekKey={currentWeekKey}
            onEditBreak={onEditBreak}
            onDeleteBreak={onDeleteBreak}
            onToggleBreakVisibility={onToggleBreakVisibility}
            onAddBreak={onAddBreak}
          />
        </div>
      )}

      {/* Tab View: Roadmap */}
      {activePortalTab === 'roadmap' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <RoadmapView />
        </div>
      )}

      {/* Tab View: Main 38-Week Timeline (Default) */}
      {activePortalTab === 'timeline' && (
        <>
          {/* Course Stage Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold font-mono-code text-sm">
                {selectedYear.short}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    {selectedYear.label} Computing Course
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedYear.badgeBg} ${selectedYear.badgeBorder}`}>
                    {selectedYear.stage.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  {selectedYear.qualification}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-semibold border border-slate-200">
                ★ {allAssessments.length} Assessments Mapped
              </span>
              <span className="text-xs font-mono-code text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-semibold border border-slate-200">
                38 Teaching Weeks
              </span>
            </div>
          </div>

          {/* Key Assessment Highlights Ribbon (Controlled by visibility settings) */}
          {allAssessments.length > 0 && (visibilitySettings?.showAssessmentsRibbon !== false || userRole === 'teacher') && (
            <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                  <span>Assessment & Exam Deadlines ({selectedYear.label})</span>
                  {userRole === 'teacher' && visibilitySettings?.showAssessmentsRibbon === false && (
                    <span className="text-[11px] font-mono-code font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      Hidden from Students
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFilterAssessmentsOnly(prev => !prev)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    filterAssessmentsOnly
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {filterAssessmentsOnly ? 'Show Full Timeline' : 'Filter Timeline to Assessments'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {allAssessments.map((a, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border bg-white shadow-xs transition-all ${
                      a.isCurrentWeek ? 'border-amber-400 ring-2 ring-amber-300 bg-amber-50/40' : 'border-amber-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-mono-code text-amber-800 font-bold">
                      <span>{a.termName} · Wk {a.weekN}</span>
                      <span className="text-slate-500 font-medium">{a.dates}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-3 whitespace-pre-wrap">
                      {a.topic}
                    </div>
                    {a.flag && (
                      <span className="inline-block text-[10px] font-mono-code text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md mt-1 border border-rose-200">
                        {a.flag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTermTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTermTab === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Terms (38 Wks)
              </button>
              {plan.map(term => (
                <button
                  key={term.id}
                  onClick={() => setActiveTermTab(term.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTermTab === term.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {term.name.split('·')[0].trim()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics or skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                />
              </div>

              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-2 py-1 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 38-Week Timeline per Term */}
          <div className="space-y-8">
            {plan
              .filter(term => activeTermTab === 'all' || activeTermTab === term.id)
              .map((term) => {
                const rows = term.rows.filter(row => {
                  if (row.kind === 'break') {
                    // Filter based on student search or assessment filter
                    if (filterAssessmentsOnly || search) return false;
                    // Master holiday switch
                    const isMasterHolidaysVisible = visibilitySettings?.showHolidays !== false;
                    const isItemVisible = row.visibleToStudents !== false;
                    if (userRole === 'student' && (!isMasterHolidaysVisible || !isItemVisible)) {
                      return false;
                    }
                    return true;
                  }

                  const cell = row.cells[selectedYear.id] || { text: '', assess: false };
                  if (filterAssessmentsOnly && !cell.assess) return false;
                  if (search.trim()) {
                    const q = search.toLowerCase();
                    const matchesTopic = cell.text.toLowerCase().includes(q);
                    const matchesDates = row.dates.toLowerCase().includes(q);
                    if (!matchesTopic && !matchesDates) return false;
                  }
                  return true;
                });

                if (rows.length === 0) return null;

                return (
                  <div key={term.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Term Header */}
                    <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">
                          {term.name}
                        </h3>
                        <p className="text-xs text-slate-300 font-mono-code mt-0.5">
                          {term.dates} · {term.weeks} Academic Weeks
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {userRole === 'teacher' && onAddBreak && (
                          <button
                            type="button"
                            onClick={() => onAddBreak(term.id)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add Holiday Box</span>
                          </button>
                        )}
                        <span className="text-xs font-mono-code font-bold bg-white/15 px-3 py-1 rounded-full border border-white/20">
                          {selectedYear.label} Focus
                        </span>
                      </div>
                    </div>

                    {/* Rows List */}
                    <div className="divide-y divide-slate-100">
                      {rows.map((row, rIdx) => {
                        // HOLIDAY / BREAK ROW (The exact box from the screenshot, now fully editable!)
                        if (row.kind === 'break') {
                          const isVisibleToStudents = row.visibleToStudents !== false;
                          const isMasterHolidayVisible = visibilitySettings?.showHolidays !== false;
                          const effectiveVisible = isVisibleToStudents && isMasterHolidayVisible;

                          return (
                            <div 
                              key={row.id || `break-${rIdx}`}
                              className={`px-6 py-4 bg-amber-50/60 border-y border-amber-200/80 flex flex-wrap items-center justify-between gap-4 transition-all ${
                                userRole === 'teacher' && !effectiveVisible 
                                  ? 'bg-amber-50/30 border-dashed border-amber-300 opacity-75' 
                                  : ''
                              }`}
                            >
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-mono-code font-bold border border-amber-200">
                                  {row.badge || 'School Holiday'}
                                </span>
                                <span className="text-sm font-bold text-amber-950">
                                  {row.label}
                                </span>

                                {userRole === 'teacher' && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-code inline-flex items-center gap-1 ${
                                    effectiveVisible 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {effectiveVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {effectiveVisible ? 'Shown to Students' : 'Hidden from Students'}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                {(row.detail || row.dates) && (
                                  <span className="text-xs text-amber-800 font-mono-code">
                                    {row.detail || row.dates}
                                  </span>
                                )}

                                {/* Teacher editing controls on the break box */}
                                {userRole === 'teacher' && (
                                  <div className="flex items-center gap-2">
                                    {/* Direct Toggle Checkbox */}
                                    <label 
                                      title="Toggle whether students can see this holiday box"
                                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-950 bg-white/90 px-2.5 py-1 rounded-xl border border-amber-200 cursor-pointer hover:bg-white shadow-2xs"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isVisibleToStudents}
                                        onChange={(e) => onToggleBreakVisibility && onToggleBreakVisibility(term.id, rIdx, e.target.checked)}
                                        className="w-3.5 h-3.5 text-amber-600 rounded-sm focus:ring-amber-500"
                                      />
                                      <span className="text-[11px] font-bold">
                                        {isVisibleToStudents ? 'Show to Students' : 'Hidden'}
                                      </span>
                                    </label>

                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      onClick={() => onEditBreak && onEditBreak(term.id, row, rIdx)}
                                      title="Modify holiday title, dates, badge, or details"
                                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                    >
                                      <Pencil className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() => onDeleteBreak && onDeleteBreak(term.id, rIdx)}
                                      title="Delete this holiday break box"
                                      className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // WEEK ROW
                        const isCurrentWeek = `${term.id}-${row.n}` === currentWeekKey;
                        const cell = row.cells[selectedYear.id] || { text: '', assess: false, taught: false };
                        const hasAssess = cell.assess || cell.text.toLowerCase().includes('assessment') || cell.text.toLowerCase().includes('exam') || cell.text.toLowerCase().includes('test') || cell.text.toLowerCase().includes('mock') || cell.text.toLowerCase().includes('criterion');

                        return (
                          <div 
                            key={rIdx}
                            className={`p-5 sm:p-6 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                              isCurrentWeek 
                                ? 'bg-indigo-50/50 border-l-4 border-indigo-600' 
                                : hasAssess 
                                ? 'bg-rose-50/30' 
                                : 'hover:bg-slate-50/60'
                            }`}
                          >
                            {/* Week Badge & Dates */}
                            <div className="sm:w-48 flex-shrink-0">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-xl text-xs font-mono-code font-bold ${
                                  isCurrentWeek 
                                    ? 'bg-indigo-600 text-white shadow-xs' 
                                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                                }`}>
                                  Week {row.n}
                                </span>
                                {isCurrentWeek && (
                                  <span className="text-[11px] font-bold font-mono-code text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 font-mono-code mt-1 font-medium">
                                {row.dates}
                              </div>
                              {row.flag && (
                                <div className="mt-1.5">
                                  <span className="inline-block text-[11px] font-bold font-mono-code text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                                    {row.flag}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Learning Topic & Assessment Content */}
                            <div className="flex-1">
                              <div className="flex items-start gap-2.5">
                                {hasAssess && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold font-mono-code flex-shrink-0 mt-0.5">
                                    <Star className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                                    Assessment
                                  </span>
                                )}
                                <div className={`text-base font-semibold whitespace-pre-wrap leading-relaxed ${
                                  hasAssess ? 'text-rose-950 font-bold' : 'text-slate-900'
                                }`}>
                                  {cell.text || <span className="text-slate-400 italic font-normal">Curriculum topic to be announced</span>}
                                </div>
                              </div>

                              {/* Optional Teacher Department Notes (if enabled or in teacher mode) */}
                              {row.note && (userRole === 'teacher' || visibilitySettings?.showTeacherNotes) && (
                                <div className="mt-2.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-start gap-2 font-mono-code">
                                  <Tag className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                  <span>{row.note}</span>
                                </div>
                              )}
                            </div>

                            {/* Status Checkmark */}
                            <div className="sm:w-28 flex-shrink-0 flex items-center justify-end">
                              {cell.taught ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-mono-code">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Completed
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 font-mono-code">
                                  Upcoming
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}

      {/* Clean student footer without teacher login link */}
      <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-sans">
        <div>
          © 2026–2027 The British International School Budapest · Computing & ICT Department
        </div>
        <div className="text-slate-400 font-mono-code text-[11px]">
          Curriculum Portal · Key Stages 3, 4 & 5
        </div>
      </footer>
    </div>
  );
};
