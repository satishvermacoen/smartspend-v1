'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles, AlertCircle, Check, ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request failed. Please try again.');
      }

      setSuccess(data.message || 'If an account exists, a reset link has been sent.');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-mid/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-soft">
            <Sparkles className="h-5 w-5 text-teal-deep animate-pulse" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-gradient">
            SpentSmart
          </span>
        </Link>
        <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
          Reset password
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll send you instructions to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 shadow-elegant rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="mb-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl p-3 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <Check className="h-5 w-5 shrink-0 mt-0.5 bg-emerald-500/20 rounded-full p-0.5" />
              <div>
                <p className="font-semibold">Reset Link Sent</p>
                <p className="opacity-95">{success}</p>
                <p className="mt-2 text-xs opacity-75">Be sure to check your spam folder if you do not receive it shortly.</p>
              </div>
            </div>
          )}

          {!success && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-soft/50 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-brand hover:brightness-110 active:scale-[0.99] text-teal-deep font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-card cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-teal-deep" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border/10 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-brand hover:text-gold transition-colors font-medium group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
