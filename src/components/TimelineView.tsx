import React, { useState } from 'react';
import { TermData, YearConfig, CellData, UserRole, LockState, BreakRow } from '../types';
import { 
  Calendar, 
  Star, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  BookOpen, 
  MessageSquare,
  ChevronRight,
  GraduationCap,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface TimelineViewProps {
  plan: TermData[];
  years: YearConfig[];
  selectedYears: string[];
  searchQuery: string;
  assessOnly: boolean;
  userRole: UserRole;
  isLocked?: boolean;
  lockState?: LockState;
  currentWeekKey: string | null;
  onUpdateCell: (termId: string, weekN: number, yearId: string, updates: Partial<CellData>) => void;
  onOpenAiHelper?: (cell: {
    termId: string;
    weekN: number;
    yearId: string;
    yearLabel: string;
    termName: string;
    currentText: string;
  }) => void;
  onOpenAIHelper?: (yearGroup: string, topicText: string, termName: string, weekN: number) => void;
  onEditBreak?: (termId: string, breakItem: BreakRow, positionIdx: number) => void;
  onDeleteBreak?: (termId: string, positionIdx: number) => void;
  onToggleBreakVisibility?: (termId: string, positionIdx: number, newVisibility: boolean) => void;
  onAddBreak?: (termId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  plan,
  years,
  selectedYears,
  searchQuery,
  assessOnly,
  userRole,
  isLocked,
  lockState,
  currentWeekKey,
  onUpdateCell,
  onOpenAiHelper,
  onOpenAIHelper,
  onEditBreak,
  onDeleteBreak,
  onToggleBreakVisibility,
  onAddBreak
}) => {
  const [activeYearId, setActiveYearId] = useState<string>(selectedYears[0] || 'y7');

  const currentYear = years.find(y => y.id === activeYearId) || years[0];
  const timelineLocked = isLocked !== undefined ? isLocked : !!lockState?.isLocked;
  const isEditable = userRole === 'teacher' && !timelineLocked;

  const handleTriggerAI = (
    termId: string,
    weekN: number,
    yearId: string,
    yearLabel: string,
    termName: string,
    currentText: string
  ) => {
    if (onOpenAiHelper) {
      onOpenAiHelper({
        termId,
        weekN,
        yearId,
        yearLabel,
        termName,
        currentText
      });
    } else if (onOpenAIHelper) {
      onOpenAIHelper(yearLabel, currentText, termName, weekN);
    }
  };

  return (
    <div className="space-y-8">
      {/* Year group selector tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          <span className="text-sm font-bold text-slate-900">
            Select Cohort:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {years.map((y) => (
            <button
              key={y.id}
              onClick={() => setActiveYearId(y.id)}
              className={`px-3 py-1.5 rounded-xl font-mono-code font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeYearId === y.id
                  ? `${y.badgeBg} ${y.color} border ${y.badgeBorder} shadow-xs ring-2 ring-indigo-300`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: y.color }} />
              <span>{y.label}</span>
              <span className="text-[10px] opacity-75">({y.stage.toUpperCase()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline per Term */}
      {plan.map((term) => {
        const rows = term.rows.filter(r => {
          if (r.kind === 'break') {
            if (assessOnly || searchQuery.trim()) return false;
            return true;
          }
          const cell = r.cells[activeYearId] || { text: '' };
          if (assessOnly && !cell.assess) return false;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesText = cell.text.toLowerCase().includes(q);
            const matchesNote = r.note?.toLowerCase().includes(q);
            if (!matchesText && !matchesNote) return false;
          }
          return true;
        });

        if (rows.length === 0) return null;

        return (
          <div key={term.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            {/* Term Title */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 bg-indigo-600 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900">
                    {term.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono-code">
                    {term.dates}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditable && onAddBreak && (
                  <button
                    type="button"
                    onClick={() => onAddBreak(term.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Holiday Box</span>
                  </button>
                )}
                <span className="text-xs font-mono-code text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-bold">
                  {currentYear.label} Syllabus
                </span>
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {rows.map((row, idx) => {
                if (row.kind === 'break') {
                  const isVisibleToStudents = row.visibleToStudents !== false;
                  return (
                    <div key={`break-${idx}`} className="relative flex items-center gap-4 py-2">
                      <div className="absolute -left-6 sm:-left-8 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-xs flex items-center justify-center text-[10px]" />
                      <div className={`bg-amber-50 text-amber-950 border border-amber-200 px-4 py-3 rounded-2xl text-xs font-medium w-full flex flex-wrap items-center justify-between gap-3 shadow-2xs ${
                        !isVisibleToStudents ? 'bg-amber-50/40 border-dashed border-amber-300 opacity-80' : ''
                      }`}>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[11px] font-mono-code font-bold border border-amber-200">
                            {row.badge || 'School Holiday'}
                          </span>
                          <span className="font-bold text-sm text-amber-950">
                            {row.label}
                          </span>
                          {row.detail && (
                            <span className="text-amber-800 text-xs font-mono-code hidden sm:inline">
                              · {row.detail}
                            </span>
                          )}
                          {isEditable && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-code inline-flex items-center gap-1 ${
                              isVisibleToStudents 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isVisibleToStudents ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                              {isVisibleToStudents ? 'Shown to Students' : 'Hidden from Students'}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {row.dates && (
                            <span className="font-mono-code text-amber-800 text-xs font-medium">{row.dates}</span>
                          )}

                          {isEditable && (
                            <div className="flex items-center gap-1.5">
                              {/* Direct Toggle Checkbox */}
                              <label 
                                title="Toggle whether this holiday box is visible to students"
                                className="flex items-center gap-1 text-xs font-semibold text-amber-950 bg-white/90 px-2 py-1 rounded-xl border border-amber-200 cursor-pointer hover:bg-white shadow-2xs"
                              >
                                <input
                                  type="checkbox"
                                  checked={isVisibleToStudents}
                                  onChange={(e) => onToggleBreakVisibility && onToggleBreakVisibility(term.id, idx, e.target.checked)}
                                  className="w-3.5 h-3.5 text-amber-600 rounded-sm focus:ring-amber-500"
                                />
                                <span className="text-[11px]">{isVisibleToStudents ? 'Show' : 'Hidden'}</span>
                              </label>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => onEditBreak && onEditBreak(term.id, row, idx)}
                                title="Edit holiday box title, dates, badge, or details"
                                className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => onDeleteBreak && onDeleteBreak(term.id, idx)}
                                title="Delete this holiday box"
                                className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                const cell = row.cells[activeYearId] || { text: '' };
                const weekKey = `${term.id}-${row.n}`;
                const isCurrent = currentWeekKey === weekKey;
                const isAssessed = !!cell.assess;

                return (
                  <div
                    key={weekKey}
                    id={`timeline-row-${weekKey}`}
                    className="relative group"
                  >
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-125 ${
                        isCurrent
                          ? 'bg-indigo-600 ring-4 ring-indigo-100'
                          : isAssessed
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}
                    />

                    {/* Timeline Card */}
                    <div
                      className={`p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-50/40 border-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                          : isAssessed
                          ? 'bg-rose-50/30 border-rose-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono-code font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                            Week {row.n}
                          </span>
                          <span className="text-xs font-mono-code text-slate-500">
                            {row.dates}
                          </span>
                          {row.flag && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                              {row.flag}
                            </span>
                          )}
                        </div>

                        {/* Assessment indicator */}
                        {isAssessed && (
                          <span className="text-xs font-bold font-mono-code text-rose-700 bg-rose-100/80 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-rose-600 text-rose-600" />
                            Milestone / Assessment
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      {isEditable ? (
                        <textarea
                          value={cell.text}
                          onChange={(e) => onUpdateCell(term.id, row.n, activeYearId, { text: e.target.value })}
                          rows={2}
                          className="w-full text-sm font-sans text-slate-900 bg-transparent border-0 rounded p-1 resize-none focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-hidden leading-relaxed"
                          placeholder="Enter curriculum topics and learning goals..."
                        />
                      ) : (
                        <p className="text-sm font-sans text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {cell.text || <span className="text-slate-400 italic">No syllabus specified</span>}
                        </p>
                      )}

                      {/* Department notes if present */}
                      {row.note && (
                        <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 italic flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{row.note}</span>
                        </div>
                      )}

                      {/* Teacher Actions */}
                      {isEditable && (
                        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => onUpdateCell(term.id, row.n, activeYearId, { assess: !cell.assess })}
                            className={`text-xs font-bold px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                              cell.assess
                                ? 'bg-rose-100 text-rose-700'
                                : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${cell.assess ? 'fill-rose-600' : ''}`} />
                            {cell.assess ? 'Remove Assessment' : 'Mark as Assessment'}
                          </button>
                          <button
                            onClick={() => handleTriggerAI(term.id, row.n, activeYearId, currentYear.label, term.name, cell.text)}
                            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            AI Assist
                          </button>
                        </div>
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
  );
};
