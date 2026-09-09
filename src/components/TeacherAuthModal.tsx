import React, { useState } from 'react';
import { KeyRound, ShieldCheck, X, AlertCircle, Lock } from 'lucide-react';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const inputPwd = password.trim();

    if (!inputPwd) {
      setError('Please enter the department teacher password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/teacher/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPwd })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.valid && data?.token) {
        sessionStorage.setItem('bisb_teacher_token', data.token);
        onSuccess(data.token);
        setPassword('');
        setError('');
        onClose();
      } else if (data && !data.valid) {
        if (data.locked) {
          setLockedOut(true);
        }
        setError(data.error || 'Incorrect department password.');
      } else {
        // Fallback if dev server is restarting or offline
        const localCustom = localStorage.getItem('bisb_custom_passphrase');
        const isMatch = localCustom ? (inputPwd === localCustom) : (inputPwd === 'Bisb!Computing2026');
        if (isMatch) {
          sessionStorage.setItem('bisb_teacher_token', 'local_session_' + Date.now());
          onSuccess('local_session_' + Date.now());
          setPassword('');
          setError('');
          onClose();
        } else {
          setError('Incorrect department password.');
        }
      }
    } catch {
      // Fallback verification if network request fails
      const localCustom = localStorage.getItem('bisb_custom_passphrase');
      const isMatch = localCustom ? (inputPwd === localCustom) : (inputPwd === 'Bisb!Computing2026');
      if (isMatch) {
        sessionStorage.setItem('bisb_teacher_token', 'local_session_' + Date.now());
        onSuccess('local_session_' + Date.now());
        setPassword('');
        setError('');
        onClose();
      } else {
        setError('Incorrect department password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Staff Authentication
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Authorized Computing Department teachers only.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Department Passphrase</span>
              <span className="text-[10px] text-slate-400 font-mono-code font-normal">Protected</span>
            </label>
            <input
              type="password"
              autoFocus
              disabled={lockedOut}
              placeholder="Enter department password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-mono-code focus:ring-2 focus:ring-indigo-400 focus:outline-hidden disabled:bg-slate-100"
            />
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              Confidential internal key known only to authorized Computing Department staff.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password || lockedOut}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Verifying...' : 'Unlock Teacher Mode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
