import React, { useState, useEffect } from 'react';
import { Copy, Check, Share2, ExternalLink, GraduationCap, Users, Shield, X } from 'lucide-react';
import { YEARS } from '../data/defaultPlan';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked: boolean;
  initialYear?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  isLocked,
  initialYear
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear || 'all');

  useEffect(() => {
    if (initialYear) {
      setSelectedYear(initialYear);
    }
  }, [initialYear, isOpen]);

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;

  const getShareUrl = (role: 'student' | 'teacher', year?: string) => {
    const params = new URLSearchParams();
    params.set('role', role);
    if (year && year !== 'all') {
      params.set('year', year);
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const studentUrl = getShareUrl('student', selectedYear);
  const teacherUrl = getShareUrl('teacher', selectedYear);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Share Computing Timeline
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Share synced curriculum views with students, parents, and fellow teachers
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

        {/* Lock Status Banner */}
        <div className={`p-3 rounded-xl mb-4 border text-xs flex items-center gap-2.5 ${
          isLocked
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <Shield className="w-4 h-4 flex-shrink-0 text-emerald-700" />
          <div>
            <span className="font-bold">
              {isLocked ? 'Timeline is Currently Locked (Protected)' : 'Timeline is Ready to Share'}
            </span>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              {isLocked
                ? 'Safe to share! Students will see a locked, read-only version.'
                : 'Tip: Lock the timeline with code 2026 to protect against accidental changes.'}
            </p>
          </div>
        </div>

        {/* Year Filter for Student Link */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Target Year Group:
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-1 text-xs rounded-lg font-mono-code font-semibold transition-colors cursor-pointer ${
                selectedYear === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Years (Y7–13)
            </button>
            {YEARS.map((y) => (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.id)}
                className={`px-3 py-1 text-xs rounded-lg font-mono-code font-semibold transition-colors cursor-pointer ${
                  selectedYear === y.id
                    ? 'bg-indigo-600 text-white shadow-xs font-bold ring-2 ring-indigo-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {y.short}
              </button>
            ))}
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {/* Student Link */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Student & Parent Link ({selectedYear === 'all' ? 'All Years' : YEARS.find(y => y.id === selectedYear)?.label})
              </span>
              <span className="text-[11px] font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                100% Read-Only
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2 font-medium">
              Direct student portal showing the full 38-week syllabus and assessment milestones. Completely read-only with no teacher login or switch options.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={studentUrl}
                className="w-full text-xs font-mono-code bg-white text-slate-800 border border-slate-300 rounded-lg px-3 py-2 select-all focus:outline-hidden"
              />
              <button
                onClick={() => handleCopy(studentUrl, 'student')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0"
              >
                {copiedKey === 'student' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'student' ? 'Copied' : 'Copy Link'}
              </button>
              <a
                href={studentUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-300 flex-shrink-0"
                title="Preview Student Link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Teacher Link */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Users className="w-4 h-4 text-indigo-600" />
                Teacher Link (Editable with PIN)
              </span>
              <span className="text-[11px] font-mono-code text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold border border-indigo-200">
                Department Access
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-2 font-medium">
              Full editing suite with AI assistant, report cycle planner, internal week notes, and lock controls.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={teacherUrl}
                className="w-full text-xs font-mono-code bg-white text-slate-800 border border-slate-300 rounded-lg px-3 py-2 select-all focus:outline-hidden"
              />
              <button
                onClick={() => handleCopy(teacherUrl, 'teacher')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0"
              >
                {copiedKey === 'teacher' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'teacher' ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
