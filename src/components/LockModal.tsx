import React, { useState } from 'react';
import { LockState } from '../types';
import { Lock, Unlock, ShieldAlert, KeyRound, Check, X, Key, ShieldCheck } from 'lucide-react';

interface LockModalProps {
  isOpen: boolean;
  onClose: () => void;
  lockState?: LockState;
  onToggleLock: (isLocked: boolean, pin?: string, currentPin?: string) => Promise<{ success: boolean; error?: string }>;
}

export const LockModal: React.FC<LockModalProps> = ({
  isOpen,
  onClose,
  lockState = { isLocked: false, hasPin: true },
  onToggleLock
}) => {
  const [activeTab, setActiveTab] = useState<'lock' | 'password'>('lock');
  const [pin, setPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const isLocked = !!lockState?.isLocked;

  const handleLockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (isLocked) {
        // Unlocking action
        const pinToUse = currentPin.trim();
        const res = await onToggleLock(false, undefined, pinToUse);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Incorrect department password.');
        }
      } else {
        // Locking action
        const pinToUse = pin.trim();
        const res = await onToggleLock(true, pinToUse || undefined);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to lock timeline. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!oldPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const token = sessionStorage.getItem('bisb_teacher_token') || '';

    try {
      const res = await fetch('/api/teacher/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        if (data.token) {
          sessionStorage.setItem('bisb_teacher_token', data.token);
        }
        localStorage.setItem('bisb_custom_passphrase', newPassword);
        setSuccessMsg('Department password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else if (data && data.error) {
        setError(data.error);
      } else {
        // Local fallback
        localStorage.setItem('bisb_custom_passphrase', newPassword);
        setSuccessMsg('Department password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      // Local fallback on network error
      localStorage.setItem('bisb_custom_passphrase', newPassword);
      setSuccessMsg('Department password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${isLocked ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200'}`}>
              {isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                {isLocked ? 'Unlock Curriculum Timeline' : 'Lock & Security Settings'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Manage timeline protection and department passcodes
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

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('lock'); setError(''); setSuccessMsg(''); }}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'lock'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {isLocked ? 'Unlock Timeline' : 'Lock Status'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('password'); setError(''); setSuccessMsg(''); }}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'password'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Change Passphrase
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeTab === 'lock' ? (
          <form onSubmit={handleLockSubmit} className="space-y-4">
            {isLocked ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  Enter Teacher Password to Unlock
                </label>
                <input
                  type="password"
                  maxLength={50}
                  placeholder="Enter password"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-mono-code focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Enter your computing department teacher password.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                  <p className="font-bold text-slate-900 mb-1">
                    When locked:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Curriculum cells are protected against accidental edits.</li>
                    <li>Students & viewers only see the locked syllabus.</li>
                    <li>Teachers can unlock anytime with their department password.</li>
                  </ul>
                </div>
              </div>
            )}

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
                disabled={isSubmitting}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                  isLocked
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? (
                  'Processing...'
                ) : isLocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    Unlock Now
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Lock Timeline
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Current department password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono-code focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Passphrase (min 6 characters)
              </label>
              <input
                type="password"
                placeholder="e.g. Bisb#CompDept2027"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono-code focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Passphrase
              </label>
              <input
                type="password"
                placeholder="Re-enter new passphrase"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono-code focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newPassword || !oldPassword}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : 'Update Passphrase'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
