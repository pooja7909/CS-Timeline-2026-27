import React, { useState } from 'react';
import { TermData, YearConfig, CellData, UserRole, LockState, BreakRow } from '../types';
import { getReportCyclesForWeek, isReportWeek } from '../data/reportCycles';
import { 
  Star, 
  Check, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Calendar,
  AlertCircle,
  Copy,
  ExternalLink,
  FileCheck2,
  Clock,
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface MatrixViewProps {
  plan: TermData[];
  years: YearConfig[];
  selectedYears: string[];
  searchQuery: string;
  assessOnly: boolean;
  reportOnly?: boolean;
  userRole: UserRole;
  isLocked?: boolean;
  lockState?: LockState;
  currentWeekKey: string | null;
  onUpdateCell: (termId: string, weekN: number, yearId: string, updates: Partial<CellData>) => void;
  onUpdateNote: (termId: string, weekN: number, note: string) => void;
  onOpenAiHelper?: (cell: {
    termId: string;
    weekN: number;
    yearId: string;
    yearLabel: string;
    termName: string;
    currentText: string;
  }) => void;
  onOpenAIHelper?: (yearGroup: string, topicText: string, termName: string, weekN: number) => void;
  onClearFilters?: () => void;
  onEditBreak?: (termId: string, breakItem: BreakRow, positionIdx: number) => void;
  onDeleteBreak?: (termId: string, positionIdx: number) => void;
  onToggleBreakVisibility?: (termId: string, positionIdx: number, newVisibility: boolean) => void;
  onAddBreak?: (termId: string) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  plan,
  years,
  selectedYears,
  searchQuery,
  assessOnly,
  reportOnly = false,
  userRole,
  isLocked,
  lockState,
  currentWeekKey,
  onUpdateCell,
  onUpdateNote,
  onOpenAiHelper,
  onOpenAIHelper,
  onClearFilters,
  onEditBreak,
  onDeleteBreak,
  onToggleBreakVisibility,
  onAddBreak
}) => {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [copiedCellKey, setCopiedCellKey] = useState<string | null>(null);

  const activeYears = years.filter(y => selectedYears.includes(y.id));

  const toggleNote = (key: string) => {
    setExpandedNotes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const timelineLocked = isLocked !== undefined ? isLocked : !!lockState?.isLocked;
  const isEditable = userRole === 'teacher' && !timelineLocked;

  const handleCopyCell = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCellKey(key);
    setTimeout(() => setCopiedCellKey(null), 1500);
  };

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
    <div className="space-y-10">
      {plan.map((term) => {
        // Filter rows based on search and filters
        const visibleRows = term.rows.filter(row => {
          if (row.kind === 'break') {
            if (assessOnly || reportOnly || searchQuery.trim()) return false;
            return true;
          }

          // Search filtering
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchesNote = row.note?.toLowerCase().includes(query);
            const matchesFlag = row.flag?.toLowerCase().includes(query);
            const matchesCell = Object.entries(row.cells).some(([yId, cell]) => {
              if (!selectedYears.includes(yId)) return false;
              const cellData = cell as CellData;
              return cellData && cellData.text ? cellData.text.toLowerCase().includes(query) : false;
            });
            if (!matchesNote && !matchesFlag && !matchesCell) return false;
          }

          // Assessment filter
          if (assessOnly) {
            const hasAssessment = Object.entries(row.cells).some(([yId, cell]) => {
              if (!selectedYears.includes(yId)) return false;
              const cellData = cell as CellData;
              return cellData && Boolean(cellData.assess);
            });
            if (!hasAssessment) return false;
          }

          // Report weeks filter
          if (reportOnly) {
            const hasReport = isReportWeek(term.id, row.n);
            if (!hasReport) return false;
          }

          return true;
        });

        if (visibleRows.length === 0) return null;

        return (
          <div key={term.id} className="space-y-3">
            {/* Term Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-6 bg-indigo-600 rounded-full" />
                <h2 className="text-base font-bold font-display text-slate-900">
                  {term.name}
                </h2>
                <span className="text-xs font-mono-code text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md font-semibold">
                  {term.dates}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {userRole === 'teacher' && !isLocked && onAddBreak && (
                  <button
                    type="button"
                    onClick={() => onAddBreak(term.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Holiday Box</span>
                  </button>
                )}
                <span className="text-xs text-slate-500 font-mono-code font-medium">
                  {visibleRows.filter(r => r.kind === 'week').length} Teaching Weeks
                </span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[980px]">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs font-mono-code uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-4 w-36 font-semibold">Week / Dates</th>
                      {activeYears.map(y => (
                        <th key={y.id} className="py-3 px-4 font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: y.color }} />
                            <span>{y.label}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({y.stage.toUpperCase()})</span>
                          </div>
                        </th>
                      ))}
                      {userRole === 'teacher' && (
                        <th className="py-3 px-4 w-52 font-semibold text-right">
                          Dept Notes
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {visibleRows.map((row, idx) => {
                      if (row.kind === 'break') {
                        const isVisibleToStudents = row.visibleToStudents !== false;
                        return (
                          <tr key={`break-${idx}`} className={`bg-amber-50/70 text-amber-950 font-medium ${
                            !isVisibleToStudents ? 'bg-amber-50/40 opacity-85' : ''
                          }`}>
                            <td colSpan={activeYears.length + (userRole === 'teacher' ? 2 : 1)} className="py-2.5 px-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <span className="text-sm">🏖️</span>
                                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[11px] font-mono-code font-bold border border-amber-200">
                                    {row.badge || 'School Holiday'}
                                  </span>
                                  <span className="font-bold text-sm">{row.label}</span>
                                  {row.detail && (
                                    <span className="text-amber-800 text-xs hidden lg:inline font-mono-code">
                                      · {row.detail}
                                    </span>
                                  )}
                                  {userRole === 'teacher' && (
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

                                <div className="flex items-center gap-3">
                                  {row.dates && (
                                    <span className="text-amber-800 font-mono-code text-xs">
                                      {row.dates}
                                    </span>
                                  )}

                                  {userRole === 'teacher' && !isLocked && (
                                    <div className="flex items-center gap-1.5">
                                      {/* Direct Toggle Checkbox */}
                                      <label 
                                        title="Toggle whether students can see this holiday in their portal"
                                        className="flex items-center gap-1.5 text-xs font-semibold text-amber-950 bg-white/90 px-2.5 py-1 rounded-xl border border-amber-200 cursor-pointer hover:bg-white shadow-2xs"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isVisibleToStudents}
                                          onChange={(e) => onToggleBreakVisibility && onToggleBreakVisibility(term.id, idx, e.target.checked)}
                                          className="w-3.5 h-3.5 text-amber-600 rounded-sm focus:ring-amber-500"
                                        />
                                        <span className="text-[11px] font-bold">{isVisibleToStudents ? 'Show' : 'Hidden'}</span>
                                      </label>

                                      <button
                                        type="button"
                                        onClick={() => onEditBreak && onEditBreak(term.id, row, idx)}
                                        title="Modify holiday box details"
                                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                      >
                                        <Pencil className="w-3 h-3" />
                                        <span>Edit</span>
                                      </button>

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
                            </td>
                          </tr>
                        );
                      }

                      const weekKey = `${term.id}-${row.n}`;
                      const isCurrentWeek = currentWeekKey === weekKey;
                      const reportCycles = getReportCyclesForWeek(term.id, row.n);
                      const hasReports = reportCycles.length > 0;

                      return (
                        <tr
                          key={weekKey}
                          id={`week-row-${weekKey}`}
                          className={`group transition-colors ${
                            isCurrentWeek 
                              ? 'bg-indigo-50/50 hover:bg-indigo-50/80 ring-2 ring-indigo-500/20' 
                              : 'hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Week Number, Dates & Indicators */}
                          <td className="py-3 px-4 align-top font-mono-code border-r border-slate-100 bg-slate-50/40">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                  Week {row.n}
                                  {isCurrentWeek && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                                  )}
                                </span>
                              </div>

                              <span className="text-[11px] text-slate-500 font-medium leading-tight">
                                {row.dates}
                              </span>

                              {row.flag && (
                                <span className="inline-block mt-0.5 text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                                  {row.flag}
                                </span>
                              )}

                              {/* Report Cycle Indicators */}
                              {hasReports && (
                                <div className="mt-1 space-y-1">
                                  {reportCycles.map((rc, rIdx) => (
                                    <div
                                      key={rIdx}
                                      title={`${rc.name} (${rc.targetCohorts.map(c => c.toUpperCase()).join(', ')})`}
                                      className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md leading-tight"
                                    >
                                      <FileCheck2 className="w-3 h-3 flex-shrink-0 text-indigo-600" />
                                      <span className="truncate">{rc.shortCode}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Year Level Cells */}
                          {activeYears.map(y => {
                            const cell = row.cells[y.id] || { text: '' };
                            const cellKey = `${term.id}-${row.n}-${y.id}`;
                            const isAssessed = !!cell.assess;

                            return (
                              <td
                                key={y.id}
                                className={`py-3 px-4 align-top border-r border-slate-100 relative group/cell transition-colors ${
                                  isAssessed
                                    ? 'bg-rose-50/40 hover:bg-rose-50/60'
                                    : ''
                                }`}
                              >
                                <div className="flex flex-col h-full justify-between gap-2">
                                  {/* Text content / editable textarea */}
                                  {isEditable ? (
                                    <textarea
                                      value={cell.text}
                                      onChange={(e) => onUpdateCell(term.id, row.n, y.id, { text: e.target.value })}
                                      rows={3}
                                      className="w-full text-xs font-sans text-slate-900 bg-white/90 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg p-2 resize overflow-auto focus:bg-white focus:ring-2 focus:ring-indigo-400/30 focus:outline-hidden leading-relaxed min-h-[68px] shadow-2xs"
                                      placeholder="Add lesson content / topic..."
                                      title="Drag right corner to adjust size"
                                    />
                                  ) : (
                                    <div className="text-xs font-sans text-slate-800 leading-relaxed whitespace-pre-wrap">
                                      {cell.text || <span className="text-slate-300 italic">No topic</span>}
                                    </div>
                                  )}

                                  {/* Bottom Cell Controls */}
                                  <div className="flex items-center justify-between pt-1 border-t border-slate-100/60 text-[11px]">
                                    {/* Assessment Flag Toggle */}
                                    <button
                                      onClick={() => {
                                        if (isEditable) {
                                          onUpdateCell(term.id, row.n, y.id, { assess: !cell.assess });
                                        }
                                      }}
                                      disabled={!isEditable}
                                      className={`flex items-center gap-1 font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                        isAssessed
                                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                          : isEditable
                                          ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                          : 'hidden'
                                      }`}
                                      title={isAssessed ? 'Assessment week (Click to toggle)' : 'Mark as assessment week'}
                                    >
                                      <Star className={`w-3 h-3 ${isAssessed ? 'fill-rose-600 text-rose-600' : ''}`} />
                                      <span>{isAssessed ? 'Assess' : ''}</span>
                                    </button>

                                    {/* Quick Actions: AI & Copy */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                      {isEditable && (
                                        <button
                                          onClick={() => handleTriggerAI(term.id, row.n, y.id, y.label, term.name, cell.text)}
                                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                          title="Generate or refine topic with AI"
                                        >
                                          <Sparkles className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleCopyCell(cell.text, cellKey)}
                                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                                        title="Copy topic"
                                      >
                                        {copiedCellKey === cellKey ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            );
                          })}

                          {/* Teacher Department Notes */}
                          {userRole === 'teacher' && (
                            <td className="py-3 px-4 align-top bg-slate-50/20">
                              {isEditable ? (
                                <textarea
                                  value={row.note || ''}
                                  onChange={(e) => onUpdateNote(term.id, row.n, e.target.value)}
                                  rows={3}
                                  className="w-full text-xs font-sans text-slate-700 bg-white/90 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg p-2 resize overflow-auto focus:bg-white focus:ring-2 focus:ring-indigo-400/30 focus:outline-hidden min-h-[68px] shadow-2xs"
                                  placeholder="Department notes, resources, links..."
                                  title="Drag right corner to adjust size"
                                />
                              ) : (
                                <div className="text-[11px] text-slate-600 italic">
                                  {row.note || <span className="text-slate-300">No notes</span>}
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
