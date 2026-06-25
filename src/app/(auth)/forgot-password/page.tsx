'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthAlert } from '@/components/auth/auth-alert';

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

  const footerLink = (
    <Link
      href="/login"
      className="inline-flex items-center gap-1 text-sm text-brand hover:text-gold transition-colors font-semibold group select-none"
    >
      <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
      Back to log in
    </Link>
  );

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll send you instructions to reset your password"
      footer={footerLink}
    >
      <AuthAlert type="error" message={error} />
      
      {success ? (
        <div className="space-y-4">
          <AuthAlert type="success" message={success} />
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            Be sure to check your spam folder if you do not receive it shortly.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            id="email"
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <AuthButton type="submit" loading={loading}>
            Send Reset Link
          </AuthButton>
        </form>
      )}
    </AuthLayout>
  );
}
