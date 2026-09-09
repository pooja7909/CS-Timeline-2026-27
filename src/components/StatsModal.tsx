import React from 'react';
import { TermData, YearConfig } from '../types';
import { BarChart3, Star, X } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TermData[];
  years: YearConfig[];
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  plan,
  years
}) => {
  if (!isOpen) return null;

  // Compute stats per year
  const yearStats = years.map((y) => {
    let totalWeeks = 0;
    let taughtWeeks = 0;
    let assessCount = 0;

    plan.forEach((term) => {
      term.rows.forEach((row) => {
        if (row.kind === 'week') {
          totalWeeks += 1;
          const cell = row.cells[y.id];
          if (cell?.taught) taughtWeeks += 1;
          if (cell?.assess) assessCount += 1;
        }
      });
    });

    const percent = totalWeeks > 0 ? Math.round((taughtWeeks / totalWeeks) * 100) : 0;

    return {
      ...y,
      totalWeeks,
      taughtWeeks,
      assessCount,
      percent
    };
  });

  // Overall stats
  const totalWeeksYear = 38;
  const overallTaught = yearStats.reduce((acc, curr) => acc + curr.taughtWeeks, 0);
  const overallTotal = yearStats.reduce((acc, curr) => acc + curr.totalWeeks, 0);
  const overallPercent = overallTotal > 0 ? Math.round((overallTaught / overallTotal) * 100) : 0;
  const totalAssessments = yearStats.reduce((acc, curr) => acc + curr.assessCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Curriculum Progress & Statistics
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Departmental syllabus coverage across 2026–2027
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-3 gap-3.5 mb-5">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-xs font-mono-code uppercase text-slate-500 font-bold block">
              Overall Taught
            </span>
            <span className="text-3xl font-display font-bold text-slate-900 mt-1 block">
              {overallPercent}%
            </span>
            <span className="text-xs text-slate-600 font-medium block mt-0.5">
              {overallTaught} / {overallTotal} lessons
            </span>
          </div>

          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-center">
            <span className="text-xs font-mono-code uppercase text-rose-700 font-bold block">
              Assessments
            </span>
            <span className="text-3xl font-display font-bold text-rose-800 mt-1 block">
              {totalAssessments}
            </span>
            <span className="text-xs text-rose-700 font-medium block mt-0.5">
              Across all cohorts
            </span>
          </div>

          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-center">
            <span className="text-xs font-mono-code uppercase text-sky-700 font-bold block">
              Academic Span
            </span>
            <span className="text-3xl font-display font-bold text-sky-800 mt-1 block">
              {totalWeeksYear}
            </span>
            <span className="text-xs text-sky-700 font-medium block mt-0.5">
              Teaching weeks
            </span>
          </div>
        </div>

        {/* Per-Year Progress Bars */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {yearStats.map((y) => (
            <div
              key={y.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: y.color }}
                  />
                  <span className="font-bold text-sm text-slate-900">
                    {y.label}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    ({y.qualification})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono-code text-rose-700 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                    {y.assessCount} assess
                  </span>
                  <span className="text-xs font-mono-code font-bold text-slate-800">
                    {y.percent}%
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${y.percent}%`,
                    backgroundColor: y.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
