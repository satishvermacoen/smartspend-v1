'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AuthAlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
  className?: string;
}

export function AuthAlert({ type, message, className = '' }: AuthAlertProps) {
  if (!message) return null;

  if (type === 'error') {
    return (
      <div
        className={`mb-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3.5 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 ${className}`}
      >
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <span className="font-medium">{message}</span>
      </div>
    );
  }

  if (type === 'success') {
    return (
      <div
        className={`mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl p-3.5 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 ${className}`}
      >
        <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
        <div>
          <p className="font-semibold text-emerald-300">Success!</p>
          <p className="opacity-95 text-xs mt-0.5">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl p-3.5 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 ${className}`}
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
