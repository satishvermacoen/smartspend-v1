'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verificationAttempted = useRef(false);

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'error'
  );
  const [message, setMessage] = useState(
    token 
      ? 'Verifying your email address, please wait...' 
      : 'Missing verification token. Please verify that you followed the link correctly.'
  );

  useEffect(() => {
    if (!token || verificationAttempted.current) return;

    verificationAttempted.current = true;

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Verification failed.');
        }

        setStatus('success');
        setMessage(data.message || 'Your email address has been verified successfully!');
        
        // Auto-redirect to login with a success indicator
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred during email verification.';
        setStatus('error');
        setMessage(errMsg);
      }
    };

    verifyToken();
  }, [token, router]);

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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 shadow-elegant rounded-2xl p-6 sm:p-8 text-center">
          {status === 'verifying' && (
            <div className="space-y-5 animate-pulse">
              <div className="h-16 w-16 bg-soft/50 rounded-full flex items-center justify-center mx-auto border border-border/5">
                <Loader2 className="h-8 w-8 text-brand animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  Verifying...
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {message}
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-5">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  Email Verified!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {message}
                </p>
                <p className="mt-1.5 text-xs text-brand/85 animate-pulse font-medium">
                  Redirecting to login...
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full h-11 bg-gradient-brand hover:brightness-110 active:scale-[0.99] text-teal-deep font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-1.5 shadow-card cursor-pointer"
                >
                  Go to Login <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5">
              <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto border border-destructive/20 text-destructive">
                <XCircle className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  Verification Failed
                </h3>
                <p className="mt-2 text-sm text-destructive opacity-90 px-2">
                  {message}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/signup"
                  className="w-full h-11 bg-soft hover:bg-soft/85 active:scale-[0.99] text-foreground font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-border/10 shadow-soft cursor-pointer"
                >
                  Back to Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
