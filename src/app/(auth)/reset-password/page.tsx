'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, Sparkles, Check, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    token ? '' : 'Invalid reset link. Missing password reset token.'
  );
  const [success, setSuccess] = useState('');

  // Password validation checks
  const passwordChecks = {
    length: formData.password.length >= 8,
    number: /\d/.test(formData.password),
    letter: /[a-zA-Z]/.test(formData.password),
    match: formData.password === formData.confirmPassword && formData.password.length > 0,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Missing reset token. Cannot reset password.');
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setSuccess('Your password has been reset successfully!');
      
      setTimeout(() => {
        router.push('/login?reset=true');
      }, 3000);
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
          Set new password
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a secure, brand new password for your account
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
              <Check className="h-5 w-5 shrink-0 mt-0.5 bg-emerald-500/20 rounded-full p-0.5 animate-bounce" />
              <div>
                <p className="font-semibold">Password Changed</p>
                <p className="opacity-90">{success}</p>
                <p className="mt-2 text-xs opacity-75">Redirecting you to the login page...</p>
              </div>
            </div>
          )}

          {token && !success && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-soft/50 border border-border/10 rounded-xl pl-3.5 pr-10 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-soft/50 border border-border/10 rounded-xl px-3.5 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all duration-200"
                />
              </div>

              {/* Password Validation Checklist */}
              {formData.password.length > 0 && (
                <div className="bg-soft/20 border border-border/5 rounded-xl p-3 text-xs space-y-1.5 animate-in fade-in duration-200">
                  <p className="font-semibold text-muted-foreground mb-1">Password Requirements:</p>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${passwordChecks.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-soft/60 text-muted-foreground'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className={passwordChecks.length ? 'text-emerald-400 font-medium' : 'text-muted-foreground'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${passwordChecks.number ? 'bg-emerald-500/20 text-emerald-400' : 'bg-soft/60 text-muted-foreground'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className={passwordChecks.number ? 'text-emerald-400 font-medium' : 'text-muted-foreground'}>At least one number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${passwordChecks.letter ? 'bg-emerald-500/20 text-emerald-400' : 'bg-soft/60 text-muted-foreground'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className={passwordChecks.letter ? 'text-emerald-400 font-medium' : 'text-muted-foreground'}>At least one letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${passwordChecks.match ? 'bg-emerald-500/20 text-emerald-400' : 'bg-soft/60 text-muted-foreground'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className={passwordChecks.match ? 'text-emerald-400 font-medium' : 'text-muted-foreground'}>Passwords match</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-brand hover:brightness-110 active:scale-[0.99] text-teal-deep font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-card cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-teal-deep" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border/10 text-center">
            <Link href="/login" className="text-brand hover:text-gold transition-colors font-medium text-sm">
              Back to log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
