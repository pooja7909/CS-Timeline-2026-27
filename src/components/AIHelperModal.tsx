import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, BookOpen, Layers, Lightbulb, CheckSquare } from 'lucide-react';

interface AIHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  yearGroup: string;
  topicText: string;
  termName?: string;
  weekNumber?: number;
}

export const AIHelperModal: React.FC<AIHelperModalProps> = ({
  isOpen,
  onClose,
  yearGroup,
  topicText,
  termName,
  weekNumber
}) => {
  const [contextType, setContextType] = useState<'starter_main_ext' | 'differentiation' | 'rubric' | 'practical_task'>('starter_main_ext');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestion('');
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yearGroup,
          topic: topicText,
          term: termName,
          week: weekNumber,
          contextType:
            contextType === 'starter_main_ext'
              ? 'Complete 3-part lesson structure (5min starter hook, 25min core coding activity, 10min extension challenge)'
              : contextType === 'differentiation'
              ? 'SEN scaffold adaptations and Gifted & Talented deep algorithmic extension tasks'
              : contextType === 'rubric'
              ? 'Assessment marking criteria and 4-tier rubric (Emerging, Developing, Secure, Mastered)'
              : 'Step-by-step practical hands-on mini-project task instructions for students'
        })
      });
      const data = await res.json();
      setSuggestion(data.suggestion || 'Could not generate suggestion.');
    } catch {
      setSuggestion('Error connecting to AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                Lesson & Syllabus Assistant
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono-code font-bold">
                  Gemini
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {yearGroup} · {termName || 'Term'} Week {weekNumber || 1}
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

        {/* Selected Topic info */}
        <div className="my-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-xs font-mono-code uppercase text-slate-500 font-bold block mb-1">
            Current Week Topic
          </span>
          <p className="text-sm font-bold text-slate-900">
            {topicText || 'No specific topic entered for this week.'}
          </p>
        </div>

        {/* Option tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => setContextType('starter_main_ext')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 text-center transition-colors cursor-pointer ${
              contextType === 'starter_main_ext'
                ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span>Lesson Plan</span>
          </button>

          <button
            onClick={() => setContextType('practical_task')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 text-center transition-colors cursor-pointer ${
              contextType === 'practical_task'
                ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Hands-on Task</span>
          </button>

          <button
            onClick={() => setContextType('differentiation')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 text-center transition-colors cursor-pointer ${
              contextType === 'differentiation'
                ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Differentiation</span>
          </button>

          <button
            onClick={() => setContextType('rubric')}
            className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 text-center transition-colors cursor-pointer ${
              contextType === 'rubric'
                ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-purple-600" />
            <span>Rubric & Criteria</span>
          </button>
        </div>

        {/* Action button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Pedagogical Ideas
              </>
            )}
          </button>
        </div>

        {/* Output area */}
        <div className="flex-1 overflow-y-auto min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-900 whitespace-pre-wrap font-sans font-medium">
          {suggestion ? (
            suggestion
          ) : (
            <div className="text-center text-slate-500 py-8 font-normal">
              Click &quot;Generate Pedagogical Ideas&quot; to receive structured lesson starters, coding challenges, scaffolding tips, or rubrics for this week.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Tailored to Edexcel IGCSE / IB DP / KS3 standards
          </span>
          <div className="flex items-center gap-2">
            {suggestion && (
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
