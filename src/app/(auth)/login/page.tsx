'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut, getSession } from 'next-auth/react';
import { Eye, EyeOff, Loader2, Sparkles, AlertCircle, User, ShieldEllipsis } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const verified = searchParams.get('verified');
  const reset = searchParams.get('reset');
  const callbackUrlError = searchParams.get('error');

  const [infoMessage, setInfoMessage] = useState(
    verified === 'true'
      ? 'Your email has been verified successfully. You can now log in.'
      : reset === 'true'
      ? 'Your password has been reset successfully. You can now log in.'
      : ''
  );

  const [error, setError] = useState(
    callbackUrlError === 'CredentialsSignin'
      ? 'Invalid email or password.'
      : callbackUrlError || ''
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const targetUrl = activeTab === 'admin' ? '/admin/dashboard' : '/client/dashboard';
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: targetUrl
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        const session = await getSession();
        const userRole = session?.user?.role;

        if (activeTab === 'admin' && userRole !== 'admin') {
          setError('Access denied. You do not have administrator privileges.');
          await signOut({ redirect: false });
          setLoading(false);
          return;
        }

        if (activeTab === 'client' && userRole === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push(targetUrl);
        }
        router.refresh();
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errMsg);
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
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage your premium subscriptions
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

          {infoMessage && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl p-3 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Client / Admin Tabs */}
          <div className="flex p-1 bg-soft/50 border border-border/10 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-gradient-brand text-teal-deep shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-4 w-4" />
              Client
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-brand text-teal-deep shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldEllipsis className="h-4 w-4" />
              Admin
            </button>
          </div>

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
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full bg-soft/50 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:text-gold transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-soft/50 border border-border/10 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all duration-200"
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

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-border/10 bg-soft/50 text-brand focus:ring-brand/40 focus:ring-offset-background transition-colors"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-muted-foreground select-none cursor-pointer">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-brand hover:brightness-110 active:scale-[0.99] text-teal-deep font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-card cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-teal-deep" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/10 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-brand hover:text-gold transition-colors font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}