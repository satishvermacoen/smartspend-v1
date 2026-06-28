'use client';

import React, { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

interface AuthPasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const AuthPasswordInput = React.forwardRef<HTMLInputElement, AuthPasswordInputProps>(
  ({ label, id, className = '', error, rightElement, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5 w-full">
        <div className="flex items-center justify-between select-none">
          <label htmlFor={id} className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
          {rightElement}
        </div>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full bg-soft/30 border border-border/15 rounded-xl pl-4 pr-11 py-2.5 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 transition-all duration-200 ${
              error
                ? 'border-destructive/40 focus:border-destructive/60 focus:ring-destructive/10'
                : 'hover:border-border/25'
            } ${className}`}
            {...props}
          />
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {error && (
          <p className="text-xs text-destructive/90 font-medium mt-1 animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthPasswordInput.displayName = 'AuthPasswordInput';
