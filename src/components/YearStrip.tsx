import React from 'react';
import { TermData, YearConfig } from '../types';
import { isReportWeek, getReportCyclesForWeek } from '../data/reportCycles';

interface YearStripProps {
  plan: TermData[];
  years: YearConfig[];
  selectedYears: string[];
  currentWeekKey: string | null;
  onSelectWeek: (termId: string, weekN: number) => void;
}

export const YearStrip: React.FC<YearStripProps> = ({
  plan,
  years,
  selectedYears,
  currentWeekKey,
  onSelectWeek
}) => {
  const activeYearsList = years.filter(y => selectedYears.includes(y.id));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 text-sm">
        <span className="font-mono-code uppercase tracking-wider font-bold text-slate-700 text-xs">
          38-Week Department Academic Timeline · 2026–2027
        </span>
        <div className="flex flex-wrap items-center gap-4 font-mono-code text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3.5 bg-rose-500 rounded-xs"></span>
            Assessment Week
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Report Cycle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-700 rounded-xs"></span>
            Taught
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-200 border border-dashed border-slate-400 rounded-xs"></span>
            Holiday Break
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-2 ring-indigo-400"></span>
            Current Week
          </span>
        </div>
      </div>

      {/* Bar container */}
      <div className="flex items-end gap-1 h-14 w-full bg-slate-50 p-2 rounded-xl border border-slate-200 overflow-x-auto">
        {plan.map((term) => (
          <React.Fragment key={term.id}>
            {term.rows.map((row, idx) => {
              if (row.kind === 'break') {
                return (
                  <div
                    key={`break-${term.id}-${idx}`}
                    title={`${row.label}${row.detail ? ` (${row.detail})` : ''}`}
                    className="w-3 sm:w-4 h-full self-stretch bg-slate-200/80 border-x border-dashed border-slate-300 rounded-xs flex-shrink-0 flex items-center justify-center group relative cursor-help"
                  >
                    <span className="text-[9px] text-slate-500 font-mono-code font-bold">
                      ||
                    </span>
                  </div>
                );
              }

              const rowKey = `${term.id}-${row.n}`;
              const isNow = currentWeekKey === rowKey;
              const hasReport = isReportWeek(term.id, row.n);
              const reportCycles = getReportCyclesForWeek(term.id, row.n);
              
              // Check if any active year has an assessment this week
              const hasAssess = activeYearsList.some(y => row.cells[y.id]?.assess);
              
              // Check if all active years are marked taught
              const isTaught = activeYearsList.length > 0 && activeYearsList.every(y => row.cells[y.id]?.taught);
              const isPartiallyTaught = !isTaught && activeYearsList.some(y => row.cells[y.id]?.taught);

              // Height calculation
              let barHeight = 'h-6';
              if (hasAssess) barHeight = 'h-10';
              if (isNow) barHeight = 'h-11';

              // Subtle color styles
              let bgClass = 'bg-slate-200 hover:bg-slate-300 text-slate-700';

              if (isTaught) {
                bgClass = 'bg-slate-700 hover:bg-slate-800 text-white';
              } else if (isPartiallyTaught) {
                bgClass = 'bg-slate-400 hover:bg-slate-500 text-white';
              } else if (hasAssess) {
                bgClass = 'bg-rose-500 hover:bg-rose-600 text-white';
              }

              return (
                <button
                  key={`week-${term.id}-${row.n}`}
                  onClick={() => onSelectWeek(term.id, row.n)}
                  title={`${term.name} · Week ${row.n} (${row.dates})${row.flag ? ` · ${row.flag}` : ''}${hasAssess ? ' ★ Assessment' : ''}${hasReport ? ` · ${reportCycles.map(r => r.shortCode).join(', ')}` : ''}${isTaught ? ' ✓ Taught' : ''}`}
                  className={`flex-1 min-w-[10px] max-w-[34px] ${barHeight} ${bgClass} rounded-t-sm transition-all duration-150 relative focus:outline-hidden focus:ring-2 focus:ring-indigo-400 group cursor-pointer`}
                >
                  {isNow && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white z-10" />
                  )}
                  {hasReport && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 z-10" />
                  )}
                  <span className="hidden group-hover:block absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2.5 rounded-md whitespace-nowrap z-30 pointer-events-none shadow-md font-mono-code font-bold">
                    W{row.n}: {row.dates} {hasAssess ? '★' : ''} {hasReport ? '📋' : ''}
                  </span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-between items-center mt-3 px-1 text-xs font-mono-code text-slate-600 font-semibold">
        <span>Term 1 (16 wks · 25 Aug–16 Dec)</span>
        <span>Term 2 (11 wks · 6 Jan–25 Mar)</span>
        <span>Term 3 (11 wks · 13 Apr–24 Jun)</span>
      </div>
    </div>
  );
};

