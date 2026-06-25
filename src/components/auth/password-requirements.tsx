'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface PasswordRequirementsProps {
  passwordChecks: {
    length: boolean;
    number: boolean;
    letter: boolean;
    match: boolean;
  };
}

export function PasswordRequirements({ passwordChecks }: PasswordRequirementsProps) {
  return (
    <div className="bg-soft/20 border border-border/5 rounded-xl p-3.5 text-xs space-y-2 animate-in fade-in duration-200 w-full">
      <p className="font-semibold text-muted-foreground/80 mb-1 select-none">Password Requirements:</p>
      
      <div className="flex items-center gap-2">
        <div
          className={`h-4 w-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            passwordChecks.length ? 'bg-emerald-500/20 text-emerald-400 scale-105' : 'bg-soft/60 text-muted-foreground/60'
          }`}
        >
          <Check className="h-3 w-3" />
        </div>
        <span className={passwordChecks.length ? 'text-emerald-400 font-medium transition-colors' : 'text-muted-foreground transition-colors'}>
          At least 8 characters
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`h-4 w-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            passwordChecks.number ? 'bg-emerald-500/20 text-emerald-400 scale-105' : 'bg-soft/60 text-muted-foreground/60'
          }`}
        >
          <Check className="h-3 w-3" />
        </div>
        <span className={passwordChecks.number ? 'text-emerald-400 font-medium transition-colors' : 'text-muted-foreground transition-colors'}>
          At least one number
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`h-4 w-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            passwordChecks.letter ? 'bg-emerald-500/20 text-emerald-400 scale-105' : 'bg-soft/60 text-muted-foreground/60'
          }`}
        >
          <Check className="h-3 w-3" />
        </div>
        <span className={passwordChecks.letter ? 'text-emerald-400 font-medium transition-colors' : 'text-muted-foreground transition-colors'}>
          At least one letter
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`h-4 w-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            passwordChecks.match ? 'bg-emerald-500/20 text-emerald-400 scale-105' : 'bg-soft/60 text-muted-foreground/60'
          }`}
        >
          <Check className="h-3 w-3" />
        </div>
        <span className={passwordChecks.match ? 'text-emerald-400 font-medium transition-colors' : 'text-muted-foreground transition-colors'}>
          Passwords match
        </span>
      </div>
    </div>
  );
}
