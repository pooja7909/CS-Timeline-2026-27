import React, { useState, useEffect } from 'react';
import { BreakRow, TermData } from '../types';
import { 
  Palmtree, 
  Calendar, 
  Eye, 
  EyeOff, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  Tag,
  Check
} from 'lucide-react';

interface BreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakData: BreakRow | null;
  termId: string;
  terms: TermData[];
  positionIdx?: number;
  onSave: (termId: string, updatedBreak: BreakRow, positionIdx?: number) => void;
  onDelete?: (termId: string, positionIdx: number) => void;
}

const CATEGORY_PRESETS = [
  'School Holiday',
  'Half Term Break',
  'Public Holiday',
  'Staff Training / INSET',
  'Revision & Study Week',
  'Exam Period Break'
];

export const BreakModal: React.FC<BreakModalProps> = ({
  isOpen,
  onClose,
  breakData,
  termId,
  terms,
  positionIdx,
  onSave,
  onDelete
}) => {
  const isEditing = Boolean(breakData);

  const [selectedTermId, setSelectedTermId] = useState<string>(termId || 't1');
  const [badge, setBadge] = useState<string>('School Holiday');
  const [label, setLabel] = useState<string>('');
  const [dates, setDates] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [visibleToStudents, setVisibleToStudents] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedTermId(termId || 't1');
      setShowDeleteConfirm(false);
      setError('');
      if (breakData) {
        setBadge(breakData.badge || 'School Holiday');
        setLabel(breakData.label || '');
        setDates(breakData.dates || '');
        setDetail(breakData.detail || '');
        setVisibleToStudents(breakData.visibleToStudents !== false);
      } else {
        setBadge('School Holiday');
        setLabel('');
        setDates('');
        setDetail('');
        setVisibleToStudents(true);
      }
    }
  }, [isOpen, breakData, termId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Please provide a name or title for this holiday/break.');
      return;
    }

    const updatedItem: BreakRow = {
      id: breakData?.id || `break-${Date.now()}`,
      kind: 'break',
      badge: badge.trim() || 'School Holiday',
      label: label.trim(),
      dates: dates.trim() || undefined,
      detail: detail.trim() || undefined,
      visibleToStudents
    };

    onSave(selectedTermId, updatedItem, positionIdx);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && positionIdx !== undefined) {
      onDelete(selectedTermId, positionIdx);
      onClose();
    }
  };

  return (
    <div 
      id="break-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="break-modal-card"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-xs">
              <Palmtree className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                {isEditing ? 'Edit Holiday / Break Box' : 'Add New Holiday / Break Box'}
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Customize holiday dates, badges, details, and student visibility
              </p>
            </div>
          </div>
          <button
            id="btn-close-break-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Term Selector (if multiple terms) */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Academic Term
            </label>
            <div className="grid grid-cols-3 gap-2">
              {terms.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTermId(t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedTermId === t.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.name.split('·')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Badge / Category */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>Category Badge</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CATEGORY_PRESETS.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBadge(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    badge === preset
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              id="input-break-badge"
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. School Holiday, Half Term..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
          </div>

          {/* Title / Label */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Holiday Title & Dates <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-break-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Christmas & New Year Holiday · 17 Dec – 5 Jan"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
          </div>

          {/* Dates (Optional specific breakdown) */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Exact Date Range (Optional)</span>
            </label>
            <input
              id="input-break-dates"
              type="text"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              placeholder="e.g. 17 Dec 2026 – 5 Jan 2027"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono-code"
            />
          </div>

          {/* Details / Staff training / School reopen notes */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Notes & Staff Training Details (Optional)
            </label>
            <textarea
              id="input-break-detail"
              rows={2}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g. 4–5 Jan: Staff Training (no students). School reopens Wednesday 6 Jan 2027."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-hidden font-mono-code leading-relaxed"
            />
          </div>

          {/* Student Visibility Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="checkbox-break-visible-students"
                type="checkbox"
                checked={visibleToStudents}
                onChange={(e) => setVisibleToStudents(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-amber-600 rounded-md border-amber-300 focus:ring-amber-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Show to Students & Parents
                  </span>
                  {visibleToStudents ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Visible
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold inline-flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Hidden from Students
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {visibleToStudents 
                    ? 'This holiday box will appear in the Student & Parent curriculum timeline.'
                    : 'This holiday box will be hidden in student mode and visible only to teachers.'}
                </p>
              </div>
            </label>
          </div>

          {/* Live Preview of the Box */}
          <div>
            <div className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 mb-2">
              Live Preview (Student Box Appearance)
            </div>
            <div className="px-5 py-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-mono-code font-bold border border-amber-200">
                  {badge || 'School Holiday'}
                </span>
                <span className="text-sm font-bold text-amber-950">
                  {label || 'Holiday / Break Title'}
                </span>
              </div>
              {(detail || dates) && (
                <span className="text-xs text-amber-800 font-mono-code">
                  {detail || dates}
                </span>
              )}
            </div>
          </div>

          {/* Delete confirmation alert if requested */}
          {showDeleteConfirm && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-in fade-in">
              <p className="text-xs font-bold text-rose-900 mb-2">
                Are you sure you want to delete this holiday break box?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Delete Break Box
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                id="btn-delete-break-modal"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-transparent text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-save-break-modal"
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Save Changes' : 'Add Break Box'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
