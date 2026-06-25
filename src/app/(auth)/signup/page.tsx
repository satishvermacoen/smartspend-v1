'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthPasswordInput } from '@/components/auth/auth-password-input';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthAlert } from '@/components/auth/auth-alert';
import { PasswordRequirements } from '@/components/auth/password-requirements';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

    // Client-side validations
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      setSuccess(data.message || 'Account created successfully! Check your email to verify.');
      
      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
      });
      
      // Auto-redirect to login after 5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const footerLink = (
    <p className="text-sm text-muted-foreground select-none">
      Already have an account?{' '}
      <Link href="/login" className="text-brand hover:text-gold transition-colors font-semibold">
        Log in
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands saving up to 50% on premium subscriptions"
      footer={footerLink}
    >
      <AuthAlert type="error" message={error} />
      
      {success && (
        <AuthAlert
          type="success"
          message={`${success} Redirecting to login page in 5s...`}
          className="mb-4"
        />
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            id="firstName"
            name="firstName"
            label="First Name *"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
          />

          <AuthInput
            id="lastName"
            name="lastName"
            label="Last Name *"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
          />
        </div>

        <AuthInput
          id="email"
          name="email"
          label="Email Address *"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
        />

        <AuthInput
          id="phone"
          name="phone"
          label="Phone Number (Optional)"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 000-0000"
        />

        <AuthPasswordInput
          id="password"
          name="password"
          label="Password *"
          required
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
        />

        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password *"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
        />

        {/* Password Validation UI */}
        {formData.password.length > 0 && (
          <PasswordRequirements passwordChecks={passwordChecks} />
        )}

        <AuthButton type="submit" loading={loading} disabled={!!success}>
          Sign Up
        </AuthButton>
      </form>
    </AuthLayout>
  );
}