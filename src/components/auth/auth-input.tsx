'use client';

import React, { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, id, className = '', error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none"
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full bg-soft/30 border border-border/15 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 transition-all duration-200 ${
            error
              ? 'border-destructive/40 focus:border-destructive/60 focus:ring-destructive/10'
              : 'hover:border-border/25'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive/90 font-medium mt-1 animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
