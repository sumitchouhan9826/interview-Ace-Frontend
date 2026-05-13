import React, { useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable logout confirmation modal with animations,
 * ESC key support, and outside-click dismissal.
 */
const LogoutModal = ({ isOpen, onCancel, onConfirm }) => {
  // Close on ESC key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 pt-8 flex flex-col items-center text-center">
          {/* Warning icon */}
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>

          <h3
            id="logout-title"
            className="text-xl font-bold text-white mb-2"
          >
            Confirm Logout
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
