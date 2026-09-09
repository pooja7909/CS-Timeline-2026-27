import React, { useState, useEffect } from 'react';
import { PortalOverviewSettings } from '../types';
import { DEFAULT_OVERVIEW_SETTINGS } from '../data/defaultSettings';
import { 
  FileText, 
  Sparkles, 
  Check, 
  X, 
  RotateCcw,
  Heading,
  Calendar
} from 'lucide-react';

interface PortalOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PortalOverviewSettings;
  onSave: (newSettings: PortalOverviewSettings) => void;
}

export const PortalOverviewModal: React.FC<PortalOverviewModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [title, setTitle] = useState(settings.portalTitle);
  const [description, setDescription] = useState(settings.portalDescription);
  const [academicYear, setAcademicYear] = useState(settings.academicYearLabel);

  useEffect(() => {
    setTitle(settings.portalTitle);
    setDescription(settings.portalDescription);
    setAcademicYear(settings.academicYearLabel);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      portalTitle: title.trim() || DEFAULT_OVERVIEW_SETTINGS.portalTitle,
      portalDescription: description.trim() || DEFAULT_OVERVIEW_SETTINGS.portalDescription,
      academicYearLabel: academicYear.trim() || DEFAULT_OVERVIEW_SETTINGS.academicYearLabel
    });
    onClose();
  };

  const handleReset = () => {
    setTitle(DEFAULT_OVERVIEW_SETTINGS.portalTitle);
    setDescription(DEFAULT_OVERVIEW_SETTINGS.portalDescription);
    setAcademicYear(DEFAULT_OVERVIEW_SETTINGS.academicYearLabel);
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-slate-900">
                Edit Portal Header & Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Customize the syllabus heading, academic year badge, and introductory overview description.
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

        <form onSubmit={handleSave} className="space-y-4">
          {/* Academic Year Tag */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Academic Year Tag</span>
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. Academic Year 2026–2027"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-sm font-sans"
            />
          </div>

          {/* Portal Title */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Heading className="w-3.5 h-3.5 text-indigo-600" />
              <span>Portal Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Computing Syllabus & Curriculum Timeline"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-sm font-sans font-bold"
            />
          </div>

          {/* Overview Description */}
          <div>
            <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Overview Description</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of all 38 teaching weeks, unit timelines, and assessment milestones for the 2026–2027 academic year."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-sm font-sans leading-relaxed"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              This text is displayed prominently at the top of the Student and Parent portal as well as staff views.
            </span>
          </div>

          {/* Preview Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-1.5 border border-slate-800">
            <span className="text-[10px] font-mono-code text-indigo-300 uppercase tracking-wider font-bold">
              Live Preview
            </span>
            <div className="text-xs font-mono-code text-emerald-400 font-bold">
              {academicYear || DEFAULT_OVERVIEW_SETTINGS.academicYearLabel}
            </div>
            <div className="text-base font-bold font-display">
              {title || DEFAULT_OVERVIEW_SETTINGS.portalTitle}
            </div>
            <div className="text-xs text-slate-300 font-sans leading-relaxed">
              {description || DEFAULT_OVERVIEW_SETTINGS.portalDescription}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restore Default Text</span>
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
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
