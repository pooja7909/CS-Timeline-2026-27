import React, { useState } from 'react';
import { TermData, ActiveWeekSetting } from '../types';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  X, 
  Settings2, 
  RotateCcw,
  CheckCircle2,
  CalendarCheck2
} from 'lucide-react';
import { CalculatedWeekInfo } from '../lib/calendarDateUtils';

interface ActiveWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TermData[];
  currentWeekInfo: CalculatedWeekInfo;
  setting: ActiveWeekSetting;
  onSave: (newSetting: ActiveWeekSetting) => void;
}

export const ActiveWeekModal: React.FC<ActiveWeekModalProps> = ({
  isOpen,
  onClose,
  plan,
  currentWeekInfo,
  setting,
  onSave
}) => {
  const [mode, setMode] = useState<'auto' | 'manual'>(setting.mode || 'auto');
  const [selectedTermId, setSelectedTermId] = useState<'t1' | 't2' | 't3'>(
    (setting.manualTermId as 't1' | 't2' | 't3') || currentWeekInfo.termId || 't1'
  );
  const [selectedWeekN, setSelectedWeekN] = useState<number>(
    setting.manualWeekN || currentWeekInfo.weekN || 1
  );

  if (!isOpen) return null;

  const currentTerm = plan.find(t => t.id === selectedTermId) || plan[0];
  const teachingWeeks = currentTerm.rows.filter(r => r.kind === 'week');

  const handleSave = () => {
    if (mode === 'auto') {
      onSave({
        mode: 'auto',
        manualTermId: selectedTermId,
        manualWeekN: selectedWeekN
      });
    } else {
      onSave({
        mode: 'manual',
        manualTermId: selectedTermId,
        manualWeekN: selectedWeekN
      });
    }
    onClose();
  };

  const handleResetToAuto = () => {
    setMode('auto');
    onSave({
      mode: 'auto',
      manualTermId: currentWeekInfo.termId,
      manualWeekN: currentWeekInfo.calendarCalculatedWeekN
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-slate-900">
                Active School Week Setting
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Configure whether the current week tracks the calendar automatically or is set manually.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Calendar Detection Banner */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono-code uppercase font-semibold text-[11px]">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>System Calendar Date</span>
            </div>
            <div className="font-bold text-slate-800 text-sm">
              {currentWeekInfo.todayFormatted}
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-slate-200/80 text-left sm:text-right">
            <div className="text-[10px] uppercase font-mono-code font-bold text-indigo-600">
              Auto Calendar Match
            </div>
            <div className="font-bold text-slate-900 text-xs">
              {currentWeekInfo.calendarCalculatedTerm} · Week {currentWeekInfo.calendarCalculatedWeekN}
              <span className="text-slate-400 ml-1">({currentWeekInfo.calendarCalculatedDates})</span>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 block">
            Tracking Mode
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Auto Mode */}
            <button
              type="button"
              onClick={() => setMode('auto')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                mode === 'auto'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Automatic</span>
                </span>
                {mode === 'auto' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically advances each Monday based on real-world 2026–2027 calendar dates and holidays.
              </p>
            </button>

            {/* Manual Mode */}
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                mode === 'manual'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-indigo-600" />
                  <span>Manual Override</span>
                </span>
                {mode === 'manual' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manually pin any week as currently active for students, lesson planning, or mock exam cycles.
              </p>
            </button>
          </div>
        </div>

        {/* Manual Week Selection Controls (shown if mode === 'manual') */}
        {mode === 'manual' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code font-bold uppercase text-slate-700">
                Select Active Teaching Week
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                Selected: {plan.find(t => t.id === selectedTermId)?.name.split('·')[0].trim()} · Week {selectedWeekN}
              </span>
            </div>

            {/* Term Tabs */}
            <div className="flex items-center gap-2">
              {plan.map(term => {
                const isSelected = term.id === selectedTermId;
                return (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => {
                      setSelectedTermId(term.id);
                      setSelectedWeekN(1);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-indigo-600 border-indigo-300 shadow-2xs'
                        : 'bg-transparent text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {term.name.split('·')[0].trim()}
                  </button>
                );
              })}
            </div>

            {/* Week Selector Chips */}
            <div className="max-h-48 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {teachingWeeks.map((w) => {
                  if (w.kind !== 'week') return null;
                  const isSelected = selectedWeekN === w.n;
                  return (
                    <button
                      key={`w-${w.n}`}
                      type="button"
                      onClick={() => setSelectedWeekN(w.n)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold">Week {w.n}</div>
                      <div className={`text-[10px] font-mono-code ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {w.dates}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetToAuto}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Auto Calendar</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Setting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
