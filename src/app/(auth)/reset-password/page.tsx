'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthPasswordInput } from '@/components/auth/auth-password-input';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthAlert } from '@/components/auth/auth-alert';
import { PasswordRequirements } from '@/components/auth/password-requirements';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

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

  const footerLink = (
    <Link href="/login" className="text-brand hover:text-gold transition-colors font-semibold text-sm select-none">
      Back to log in
    </Link>
  );

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a secure, brand new password for your account"
      footer={footerLink}
    >
      <AuthAlert type="error" message={error} />
      
      {success && (
        <AuthAlert
          type="success"
          message={`${success} Redirecting you to the login page...`}
          className="mb-4"
        />
      )}

      {token && !success && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AuthPasswordInput
            id="password"
            name="password"
            label="New Password"
            required
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
          />

          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
          />

          {/* Password Validation Checklist */}
          {formData.password.length > 0 && (
            <PasswordRequirements passwordChecks={passwordChecks} />
          )}

          <AuthButton type="submit" loading={loading}>
            Reset Password
          </AuthButton>
        </form>
      )}
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="dark min-h-screen bg-gradient-hero flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-mid/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
            <div className="h-16 w-16 bg-soft/50 rounded-full flex items-center justify-center mx-auto border border-border/5">
              <Loader2 className="h-8 w-8 text-brand animate-spin" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
