import React from 'react';
import { UserRole, LockState, PortalOverviewSettings } from '../types';
import { 
  Laptop, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  GraduationCap, 
  Users, 
  Calendar,
  AlertCircle,
  LogOut,
  Pencil,
  Sliders,
  Clock
} from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  lockState?: LockState;
  syncStatus: 'synced' | 'saving' | 'error';
  lastUpdated: string;
  currentTermName: string;
  currentWeekText: string;
  isManualWeek?: boolean;
  overviewSettings?: PortalOverviewSettings;
  onJumpCurrentWeek: () => void;
  onOpenActiveWeekModal?: () => void;
  onOpenOverviewModal?: () => void;
  onLogoutTeacher?: () => void;
  onGoToStudentPage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  lockState = { isLocked: false, hasPin: true },
  syncStatus,
  lastUpdated,
  currentTermName,
  currentWeekText,
  isManualWeek = false,
  overviewSettings,
  onJumpCurrentWeek,
  onOpenActiveWeekModal,
  onOpenOverviewModal,
  onLogoutTeacher,
  onGoToStudentPage
}) => {
  const isLocked = !!lockState?.isLocked;

  return (
    <header className="mb-8">
      {/* Top institution & sync status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200 text-sm">
        <div className="flex items-center gap-2.5 text-slate-600 font-mono-code text-xs uppercase tracking-wider font-semibold">
          <Laptop className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-800">
            The British International School Budapest
          </span>
          <span className="text-slate-300">•</span>
          <span>Computing & ICT Department</span>
        </div>

        {/* Sync & Lock Pill */}
        <div className="flex items-center gap-3.5 font-mono-code text-xs">
          {/* Real-time Sync Status */}
          <div className="flex items-center gap-1.5 font-medium">
            {syncStatus === 'saving' ? (
              <span className="flex items-center gap-1.5 text-amber-700">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing changes...</span>
              </span>
            ) : syncStatus === 'error' ? (
              <span className="flex items-center gap-1.5 text-rose-700">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Sync offline (local only)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synced & Live</span>
              </span>
            )}
          </div>

          {/* Lock Status Pill */}
          <span
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold text-xs border ${
              isLocked
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            {isLocked ? 'Locked' : 'Unlocked'}
          </span>

          {/* Role badge with Exit option */}
          <div className="flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center gap-1.5 font-bold text-xs">
              <Users className="w-3 h-3 text-indigo-600" />
              Teacher Mode
            </span>
            {onLogoutTeacher && (
              <button
                onClick={onLogoutTeacher}
                title="Lock session and switch back to student view"
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 flex items-center gap-1 font-semibold text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit Mode</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono-code font-bold uppercase tracking-wider">
              {overviewSettings?.academicYearLabel || 'Academic Year 2026–2027'}
            </div>

            {userRole === 'teacher' && onOpenOverviewModal && (
              <button
                type="button"
                onClick={onOpenOverviewModal}
                title="Edit portal title, academic year label and overview description"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
              >
                <Pencil className="w-3 h-3 text-indigo-600" />
                <span>Edit Overview</span>
              </button>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900">
            {overviewSettings?.portalTitle ? `${overviewSettings.portalTitle} — Staff Matrix` : 'Whole-School Computing Curriculum Matrix'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl font-sans leading-relaxed">
            {overviewSettings?.portalDescription || 'Overview of all 38 teaching weeks, unit timelines, and assessment milestones for the 2026–2027 academic year.'}
          </p>
        </div>

        {/* Current Active Week Widget */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 sm:p-3 rounded-2xl shadow-xs transition-all hover:shadow-md">
            <button
              onClick={onJumpCurrentWeek}
              title="Click to jump to active school week in curriculum matrix"
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-600">
                  <span>Current School Week</span>
                  {isManualWeek ? (
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">Manual</span>
                  ) : (
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">Auto</span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                  <span>{currentTermName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-indigo-600">{currentWeekText}</span>
                </div>
              </div>
            </button>

            {userRole === 'teacher' && onOpenActiveWeekModal && (
              <button
                type="button"
                onClick={onOpenActiveWeekModal}
                title="Change active school week or toggle Auto/Manual tracking"
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors cursor-pointer ml-1"
              >
                <Sliders className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
