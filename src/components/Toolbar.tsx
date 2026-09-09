import React from 'react';
import { ViewMode, UserRole, LockState } from '../types';
import { YEARS } from '../data/defaultPlan';
import { 
  LayoutGrid, 
  List, 
  Calendar, 
  Map, 
  Lock, 
  Unlock, 
  Download, 
  Search, 
  Share2, 
  GraduationCap, 
  Users, 
  Sparkles,
  BarChart3,
  RotateCcw,
  Star,
  CheckCheck,
  FileCheck2,
  Sliders,
  Eye
} from 'lucide-react';

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedYears: string[];
  onToggleYear: (yearId: string) => void;
  onSelectStage: (stage: 'all' | 'ks3' | 'ks4' | 'ks5') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  assessOnly: boolean;
  onToggleAssessOnly: () => void;
  reportOnly: boolean;
  onToggleReportOnly: () => void;
  userRole: UserRole;
  onToggleRole: () => void;
  lockState?: LockState;
  onOpenLockModal: () => void;
  onOpenShareModal: () => void;
  onOpenStatsModal: () => void;
  onOpenVisibilityModal?: () => void;
  onExport: (format: 'md' | 'csv' | 'print') => void;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  selectedYears,
  onToggleYear,
  onSelectStage,
  searchQuery,
  onSearchChange,
  assessOnly,
  onToggleAssessOnly,
  reportOnly,
  onToggleReportOnly,
  userRole,
  onToggleRole,
  lockState = { isLocked: false, hasPin: true },
  onOpenLockModal,
  onOpenShareModal,
  onOpenStatsModal,
  onOpenVisibilityModal,
  onExport,
  onReset
}) => {
  const isLocked = !!lockState?.isLocked;

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs py-3 px-4 sm:px-5 rounded-2xl mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Modes & Stage Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onViewModeChange('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Matrix</span>
            </button>

            <button
              onClick={() => onViewModeChange('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => onViewModeChange('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Terms</span>
            </button>

            <button
              onClick={() => onViewModeChange('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'roadmap'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => onViewModeChange('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'reports'
                  ? 'bg-white text-slate-900 shadow-xs text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Report Cycles</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Quick Stage Selectors */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => onSelectStage('all')}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            >
              All Stages
            </button>
            <button
              onClick={() => onSelectStage('ks3')}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            >
              KS3 (Y7–9)
            </button>
            <button
              onClick={() => onSelectStage('ks4')}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            >
              KS4 (Y10–11)
            </button>
            <button
              onClick={() => onSelectStage('ks5')}
              className="px-2.5 py-1 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
            >
              KS5 (Y12–13)
            </button>
          </div>
        </div>

        {/* Right: Search, Filter, Lock & Role Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics or skills..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 w-36 sm:w-48 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Assessment Filter Toggle */}
          <button
            onClick={onToggleAssessOnly}
            title="Show only rows containing key assessments / milestones"
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              assessOnly
                ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${assessOnly ? 'fill-rose-500 text-rose-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Assessments</span>
          </button>

          {/* Report Weeks Filter Toggle */}
          <button
            onClick={onToggleReportOnly}
            title="Highlight & filter weeks with School Report Deadlines"
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              reportOnly
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <FileCheck2 className={`w-4 h-4 ${reportOnly ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Report Weeks</span>
          </button>

          {/* Lock / Unlock Toggle Button */}
          <button
            onClick={onOpenLockModal}
            className={`px-3 py-2 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition-all ${
              isLocked
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Locked</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Editable</span>
              </>
            )}
          </button>

          {/* Role Switcher (Teacher vs Student View) */}
          <button
            onClick={onToggleRole}
            title={`Current: ${userRole === 'teacher' ? 'Teacher Mode (Editing & Notes)' : 'Student Mode (Clean Read-Only View)'}`}
            className={`px-3 py-2 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition-all ${
              userRole === 'teacher'
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            {userRole === 'teacher' ? (
              <>
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Teacher</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Student</span>
              </>
            )}
          </button>

          {/* Student Visibility Control Trigger (Teachers Only) */}
          {userRole === 'teacher' && onOpenVisibilityModal && (
            <button
              onClick={onOpenVisibilityModal}
              title="Configure what tabs and content are visible to students in their portal"
              className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Student Visibility</span>
            </button>
          )}

          {/* Progress Stats */}
          <button
            onClick={onOpenStatsModal}
            title="Curriculum statistics and progress %"
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span className="hidden lg:inline">Stats</span>
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold flex items-center gap-1.5">
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 hidden group-hover:block group-focus-within:block z-40">
              <button
                onClick={() => onExport('csv')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Excel / CSV Table</span>
                <span className="text-[10px] font-mono-code text-slate-400">.csv</span>
              </button>
              <button
                onClick={() => onExport('md')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Markdown Syllabus</span>
                <span className="text-[10px] font-mono-code text-slate-400">.md</span>
              </button>
              <button
                onClick={() => onExport('print')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between border-t border-slate-100 mt-1 pt-1.5"
              >
                <span>Print / Save to PDF</span>
                <span className="text-[10px] font-mono-code text-slate-400">PDF</span>
              </button>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="Reset curriculum to initial 38-week syllabus"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Year Level Checkboxes Strip */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className="text-[11px] font-mono-code text-slate-500 font-bold uppercase tracking-wider mr-1">
          Years:
        </span>
        {YEARS.map(y => {
          const isSelected = selectedYears.includes(y.id);
          return (
            <button
              key={y.id}
              onClick={() => onToggleYear(y.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? `${y.badgeBg} ${y.color} border ${y.badgeBorder} shadow-2xs`
                  : 'bg-slate-100 text-slate-400 border border-transparent hover:text-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? y.badgeBg.replace('bg-', 'bg-') : 'bg-slate-300'}`} />
              <span>{y.label}</span>
              <span className="text-[10px] opacity-75">{y.stage.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
