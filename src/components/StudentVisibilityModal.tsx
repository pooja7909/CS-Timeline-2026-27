import React, { useState, useEffect } from 'react';
import { StudentVisibilitySettings } from '../types';
import { YEARS } from '../data/defaultPlan';
import { 
  Eye, 
  EyeOff, 
  Sliders, 
  Save, 
  X, 
  CheckSquare, 
  Square, 
  Sparkles, 
  List, 
  FileCheck2, 
  Calendar, 
  LayoutGrid, 
  Map, 
  Palmtree, 
  Star, 
  FileText,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface StudentVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudentVisibilitySettings;
  onSave: (newSettings: StudentVisibilitySettings) => void;
}

export const StudentVisibilityModal: React.FC<StudentVisibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<StudentVisibilitySettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleToggleTab = (key: keyof StudentVisibilitySettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleYear = (yearId: string) => {
    setLocalSettings(prev => {
      const exists = prev.visibleYears.includes(yearId);
      if (exists) {
        if (prev.visibleYears.length === 1) return prev; // keep at least one
        return {
          ...prev,
          visibleYears: prev.visibleYears.filter(id => id !== yearId)
        };
      } else {
        return {
          ...prev,
          visibleYears: [...prev.visibleYears, yearId]
        };
      }
    });
  };

  const handlePresetAllYears = () => {
    setLocalSettings(prev => ({
      ...prev,
      visibleYears: YEARS.map(y => y.id)
    }));
  };

  const handlePresetStage = (stage: 'ks3' | 'ks4' | 'ks5') => {
    setLocalSettings(prev => ({
      ...prev,
      visibleYears: YEARS.filter(y => y.stage === stage).map(y => y.id)
    }));
  };

  const handleApplyPreset = (presetName: 'default' | 'minimal' | 'full') => {
    if (presetName === 'default') {
      setLocalSettings({
        showTimeline: true,
        showReports: true,
        showCalendar: false,
        showMatrix: false,
        showRoadmap: false,
        showHolidays: true,
        showAssessmentsRibbon: true,
        showAssessmentBadges: true,
        showTeacherNotes: false,
        visibleYears: YEARS.map(y => y.id)
      });
    } else if (presetName === 'minimal') {
      setLocalSettings({
        showTimeline: true,
        showReports: false,
        showCalendar: false,
        showMatrix: false,
        showRoadmap: false,
        showHolidays: true,
        showAssessmentsRibbon: false,
        showAssessmentBadges: false,
        showTeacherNotes: false,
        visibleYears: YEARS.map(y => y.id)
      });
    } else if (presetName === 'full') {
      setLocalSettings({
        showTimeline: true,
        showReports: true,
        showCalendar: true,
        showMatrix: true,
        showRoadmap: true,
        showHolidays: true,
        showAssessmentsRibbon: true,
        showAssessmentBadges: true,
        showTeacherNotes: true,
        visibleYears: YEARS.map(y => y.id)
      });
    }
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  // Count active tabs for preview badge
  const activeTabsCount = [
    localSettings.showTimeline,
    localSettings.showReports,
    localSettings.showCalendar,
    localSettings.showMatrix,
    localSettings.showRoadmap
  ].filter(Boolean).length;

  return (
    <div 
      id="student-visibility-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="student-visibility-modal-card"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xs">
              <Eye className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-white">
                  Student Portal Visibility Controls
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-mono-code font-bold">
                  {activeTabsCount} Tabs Active
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium">
                Choose exactly what tabs, timeline sections, and year levels students can see
              </p>
            </div>
          </div>
          <button
            id="btn-close-visibility-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-mono-code font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick Presets:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset('default')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors font-semibold cursor-pointer"
            >
              Recommended (Timeline + Reports)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('minimal')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors font-semibold cursor-pointer"
            >
              Timeline Only
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('full')}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors font-semibold cursor-pointer"
            >
              All Tabs Enabled
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Section 1: Navigation Tabs for Students */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Portal Navigation Tabs for Students</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select which view tabs are shown in the Student & Parent portal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Timeline Tab */}
              <label 
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  localSettings.showTimeline 
                    ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-300' 
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={localSettings.showTimeline}
                  onChange={() => handleToggleTab('showTimeline')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <List className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Curriculum Timeline</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Primary 38-week syllabus view showing unit topics and weeks
                  </p>
                </div>
              </label>

              {/* Reports Tab */}
              <label 
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  localSettings.showReports 
                    ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-300' 
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={localSettings.showReports}
                  onChange={() => handleToggleTab('showReports')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Report Cycles & Deadlines</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Allows students to see report publishing dates and parent evening schedules
                  </p>
                </div>
              </label>

              {/* Academic Calendar Tab */}
              <label 
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  localSettings.showCalendar 
                    ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-300' 
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={localSettings.showCalendar}
                  onChange={() => handleToggleTab('showCalendar')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Academic Terms & Calendar</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Interactive monthly calendar with school holidays and mock exam markers
                  </p>
                </div>
              </label>

              {/* Matrix Tab */}
              <label 
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  localSettings.showMatrix 
                    ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-300' 
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={localSettings.showMatrix}
                  onChange={() => handleToggleTab('showMatrix')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Whole-School Matrix</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Multi-year cross-curriculum grid across all key stages
                  </p>
                </div>
              </label>

              {/* Roadmap Tab */}
              <label 
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer sm:col-span-2 ${
                  localSettings.showRoadmap 
                    ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-300' 
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={localSettings.showRoadmap}
                  onChange={() => handleToggleTab('showRoadmap')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Map className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Progression Roadmap</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Visual multi-year curriculum progression from KS3 through GCSE to IB DP
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Content Banners & Detail Elements */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold font-display text-slate-900 mb-1 flex items-center gap-2">
              <Palmtree className="w-4 h-4 text-amber-600" />
              <span>Curriculum Content & Highlight Blocks</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Control specific visual announcement blocks inside student views
            </p>

            <div className="space-y-2.5">
              {/* Holiday & Term Breaks */}
              <label className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showHolidays}
                  onChange={() => handleToggleTab('showHolidays')}
                  className="mt-0.5 w-4 h-4 text-amber-600 rounded-md border-amber-300 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">
                      School Holiday & Term Break Banners (Master Switch)
                    </span>
                    <span className={`text-[11px] font-mono-code font-bold px-2 py-0.5 rounded-full ${
                      localSettings.showHolidays ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {localSettings.showHolidays ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 mt-0.5">
                    When enabled, holidays marked as visible will appear in the student timeline. Individual holidays can also be modified or deleted directly.
                  </p>
                </div>
              </label>

              {/* Assessment Highlights Ribbon */}
              <label className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showAssessmentsRibbon}
                  onChange={() => handleToggleTab('showAssessmentsRibbon')}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Assessment Deadlines & Milestones Quick-Filter Ribbon
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono-code">
                      ★ Highlights Bar
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Shows the top assessment summary card allowing students to filter to exam weeks.
                  </p>
                </div>
              </label>

              {/* Department Notes */}
              <label className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showTeacherNotes}
                  onChange={() => handleToggleTab('showTeacherNotes')}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Departmental Notes & Week Guidance
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono-code">
                      {localSettings.showTeacherNotes ? 'Visible to Students' : 'Internal Staff Only'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Whether departmental weekly notes and internal pointers are displayed to students.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Published Year Groups */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900">
                  Year Groups Published to Students
                </h3>
                <p className="text-xs text-slate-500">
                  Choose which cohort curricula are accessible by students
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={handlePresetAllYears}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetStage('ks3')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  KS3
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetStage('ks4')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  KS4
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetStage('ks5')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  KS5
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {YEARS.map(y => {
                const isChecked = localSettings.visibleYears.includes(y.id);
                return (
                  <label
                    key={y.id}
                    className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-white border-slate-300 shadow-2xs'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleYear(y.id)}
                        className="w-3.5 h-3.5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        {y.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {y.short}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="btn-save-visibility-settings"
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Visibility Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
