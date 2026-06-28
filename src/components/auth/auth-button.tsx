'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function AuthButton({ children, loading, className = '', ...props }: AuthButtonProps) {
  return (
    <Button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full h-11 bg-gradient-brand hover:brightness-110 active:scale-[0.99] text-primary-foreground font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-card cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
      ) : (
        children
      )}
    </Button>
  );
}
