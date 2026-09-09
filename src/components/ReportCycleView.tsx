import React, { useState, useMemo } from 'react';
import { YearConfig, TermData, UserRole, LockState, YearReportDate } from '../types';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  GraduationCap,
  Save,
  Lock,
  CalendarDays,
  FileText
} from 'lucide-react';

interface ReportCycleViewProps {
  years: YearConfig[];
  plan?: TermData[];
  userRole: UserRole;
  isLocked?: boolean;
  lockState?: LockState;
  reportDates: YearReportDate[];
  onUpdateReportDates: (dates: YearReportDate[]) => void;
  onNavigateToWeek?: (termId: string, weekN: number) => void;
}

export const ReportCycleView: React.FC<ReportCycleViewProps> = ({
  years,
  plan = [],
  userRole,
  isLocked,
  lockState,
  reportDates,
  onUpdateReportDates,
  onNavigateToWeek
}) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [selectedTermFilter, setSelectedTermFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<YearReportDate>>({});

  // Add new state
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<Omit<YearReportDate, 'id'>>({
    yearId: 'y7',
    reportName: '',
    termId: 't1',
    openDate: '',
    closeDate: '',
    notes: ''
  });

  const timelineLocked = isLocked !== undefined ? isLocked : !!lockState?.isLocked;
  const isEditable = userRole === 'teacher' && !timelineLocked;

  // Compute status for a date range
  const getStatus = (openDateStr: string, closeDateStr: string) => {
    if (!openDateStr || !closeDateStr) return { label: 'Scheduled', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const open = new Date(openDateStr);
    const close = new Date(closeDateStr);
    close.setHours(23, 59, 59, 999);

    if (isNaN(open.getTime()) || isNaN(close.getTime())) {
      return { label: 'Scheduled', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }

    if (today < open) {
      const daysUntil = Math.ceil((open.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { 
        label: `Opens in ${daysUntil}d`, 
        color: 'bg-sky-50 text-sky-800 border-sky-200' 
      };
    } else if (today >= open && today <= close) {
      return { 
        label: 'Open Now', 
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' 
      };
    } else {
      return { 
        label: 'Closed', 
        color: 'bg-slate-100 text-slate-500 border-slate-200' 
      };
    }
  };

  // Format date nicely
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Not set';
    try {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Filtered list
  const filteredReports = useMemo(() => {
    return reportDates
      .filter(item => {
        if (selectedYearFilter !== 'all' && item.yearId !== selectedYearFilter) {
          return false;
        }
        if (selectedTermFilter !== 'all' && item.termId !== selectedTermFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.reportName.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          const year = years.find(y => y.id === item.yearId);
          const matchYear = year?.label.toLowerCase().includes(q);
          return matchName || matchNotes || matchYear;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by open date, then year
        if (a.openDate && b.openDate) {
          return new Date(a.openDate).getTime() - new Date(b.openDate).getTime();
        }
        return a.yearId.localeCompare(b.yearId);
      });
  }, [reportDates, selectedYearFilter, selectedTermFilter, searchQuery, years]);

  // Handlers
  const handleStartEdit = (item: YearReportDate) => {
    if (!isEditable) return;
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    if (!isEditable || !editingId) return;
    const updated = reportDates.map(r => {
      if (r.id === editingId) {
        return {
          ...r,
          ...editForm
        } as YearReportDate;
      }
      return r;
    });
    onUpdateReportDates(updated);
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteRow = (id: string) => {
    if (!isEditable) return;
    if (window.confirm('Delete this report cycle entry?')) {
      const updated = reportDates.filter(r => r.id !== id);
      onUpdateReportDates(updated);
    }
  };

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditable || !newForm.reportName.trim()) return;

    const newEntry: YearReportDate = {
      id: `rc-${Date.now()}`,
      ...newForm
    };

    onUpdateReportDates([...reportDates, newEntry]);
    setIsAddingNew(false);
    setNewForm({
      yearId: 'y7',
      reportName: '',
      termId: 't1',
      openDate: '',
      closeDate: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner - High contrast clean light theme */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-mono-code font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              BISB School Assessment & Reporting Office
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
              Whole-School Report Cycles & Grade Deadlines
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Track open and closing dates for progress checks, end-of-term academic reports, and parent consultation grade windows across Years 7–13.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            {timelineLocked ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Protected (Unlock to edit)</span>
              </div>
            ) : userRole === 'teacher' ? (
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Report Cycle</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Year Filters */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedYearFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedYearFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Years
              </button>
              {years.map(y => (
                <button
                  key={y.id}
                  onClick={() => setSelectedYearFilter(y.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedYearFilter === y.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {y.short}
                </button>
              ))}
            </div>

            {/* Term Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedTermFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTermFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Terms
              </button>
              <button
                onClick={() => setSelectedTermFilter('t1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTermFilter === 't1'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Term 1
              </button>
              <button
                onClick={() => setSelectedTermFilter('t2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTermFilter === 't2'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Term 2
              </button>
              <button
                onClick={() => setSelectedTermFilter('t3')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTermFilter === 't3'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Term 3
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports or notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 w-56 sm:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add New Form Modal / Inline Drawer */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNewSubmit}
          className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-md animate-in fade-in duration-150 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>Create New Report Cycle</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Year Group
              </label>
              <select
                value={newForm.yearId}
                onChange={e => setNewForm({ ...newForm, yearId: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              >
                {years.map(y => (
                  <option key={y.id} value={y.id}>
                    {y.label} ({y.short})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Term
              </label>
              <select
                value={newForm.termId}
                onChange={e => setNewForm({ ...newForm, termId: e.target.value as 't1' | 't2' | 't3' })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              >
                <option value="t1">Term 1 (Autumn)</option>
                <option value="t2">Term 2 (Spring)</option>
                <option value="t3">Term 3 (Summer)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Report Title / Purpose
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Progress Check 1 (Effort & Attainment)"
                value={newForm.reportName}
                onChange={e => setNewForm({ ...newForm, reportName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Portal Opens
              </label>
              <input
                type="date"
                required
                value={newForm.openDate}
                onChange={e => setNewForm({ ...newForm, openDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Portal Closes / Deadline
              </label>
              <input
                type="date"
                required
                value={newForm.closeDate}
                onChange={e => setNewForm({ ...newForm, closeDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Internal Department Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Include criterion level grades + comment bank"
                value={newForm.notes || ''}
                onChange={e => setNewForm({ ...newForm, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
            >
              Save Report Cycle
            </button>
          </div>
        </form>
      )}

      {/* Main Report Cycles Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-mono-code uppercase tracking-wider">
                <th className="py-4 px-5">Year Level</th>
                <th className="py-4 px-5">Report Cycle</th>
                <th className="py-4 px-5">Term</th>
                <th className="py-4 px-5">Portal Opens</th>
                <th className="py-4 px-5">Portal Closes</th>
                <th className="py-4 px-5">Status</th>
                {isEditable && <th className="py-4 px-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-sm">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    No report cycles match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map(item => {
                  const isEditing = editingId === item.id;
                  const yearObj = years.find(y => y.id === item.yearId);
                  const status = getStatus(item.openDate, item.closeDate);

                  if (isEditing) {
                    return (
                      <tr key={item.id} className="bg-indigo-50/40">
                        {/* Year */}
                        <td className="py-3 px-5">
                          <select
                            value={editForm.yearId || item.yearId}
                            onChange={e => setEditForm({ ...editForm, yearId: e.target.value })}
                            className="px-2 py-1.5 text-sm rounded-lg border border-slate-300 bg-white font-bold"
                          >
                            {years.map(y => (
                              <option key={y.id} value={y.id}>
                                {y.short}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Name & Notes */}
                        <td className="py-3 px-5">
                          <input
                            type="text"
                            value={editForm.reportName || ''}
                            onChange={e => setEditForm({ ...editForm, reportName: e.target.value })}
                            className="w-full px-2 py-1 text-sm font-semibold rounded-lg border border-slate-300 bg-white mb-1"
                          />
                          <input
                            type="text"
                            placeholder="Optional notes"
                            value={editForm.notes || ''}
                            onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white text-slate-600"
                          />
                        </td>

                        {/* Term */}
                        <td className="py-3 px-5">
                          <select
                            value={editForm.termId || item.termId}
                            onChange={e => setEditForm({ ...editForm, termId: e.target.value as 't1' | 't2' | 't3' })}
                            className="px-2 py-1 text-sm rounded-lg border border-slate-300 bg-white font-semibold"
                          >
                            <option value="t1">Term 1</option>
                            <option value="t2">Term 2</option>
                            <option value="t3">Term 3</option>
                          </select>
                        </td>

                        {/* Open Date */}
                        <td className="py-3 px-5">
                          <input
                            type="date"
                            value={editForm.openDate || ''}
                            onChange={e => setEditForm({ ...editForm, openDate: e.target.value })}
                            className="px-2 py-1 text-sm rounded-lg border border-slate-300 bg-white"
                          />
                        </td>

                        {/* Close Date */}
                        <td className="py-3 px-5">
                          <input
                            type="date"
                            value={editForm.closeDate || ''}
                            onChange={e => setEditForm({ ...editForm, closeDate: e.target.value })}
                            className="px-2 py-1 text-sm rounded-lg border border-slate-300 bg-white"
                          />
                        </td>

                        {/* Status preview */}
                        <td className="py-3 px-5">
                          <span className="text-xs text-slate-500 italic">Editing...</span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              title="Save changes"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Year Level */}
                      <td className="py-4 px-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: yearObj?.color || '#64748b' }}
                          />
                          <span className="text-lg">
                            {yearObj?.label || item.yearId.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Report Name & Notes */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900 text-base">
                          {item.reportName}
                        </div>
                        {item.notes && (
                          <div className="text-sm text-slate-500 mt-0.5">
                            {item.notes}
                          </div>
                        )}
                      </td>

                      {/* Term */}
                      <td className="py-4 px-5">
                        <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.termId === 't1' ? 'Term 1' : item.termId === 't2' ? 'Term 2' : 'Term 3'}
                        </span>
                      </td>

                      {/* Opens */}
                      <td className="py-4 px-5 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5 text-base">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>{formatDateDisplay(item.openDate)}</span>
                        </div>
                      </td>

                      {/* Closes */}
                      <td className="py-4 px-5 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5 text-base">
                          <Calendar className="w-4 h-4 text-rose-600" />
                          <span>{formatDateDisplay(item.closeDate)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${status.color}`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      {isEditable && (
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                              title="Edit dates"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRow(item.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stat Cards - Light, simple */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Total Report Cycles
          </span>
          <div className="text-3xl font-display font-bold text-slate-900 mt-1">
            {reportDates.length}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Scheduled across Years 7–13
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-700">
            Currently Open
          </span>
          <div className="text-3xl font-display font-bold text-emerald-700 mt-1">
            {reportDates.filter(r => getStatus(r.openDate, r.closeDate).label === 'Open Now').length}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grade entry active now
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-sm font-bold uppercase tracking-wider text-sky-700">
            Upcoming Cycles
          </span>
          <div className="text-3xl font-display font-bold text-sky-700 mt-1">
            {reportDates.filter(r => getStatus(r.openDate, r.closeDate).label.startsWith('Opens in')).length}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Approaching deadlines
          </p>
        </div>
      </div>
    </div>
  );
};
