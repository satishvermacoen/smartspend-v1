"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function ReferralForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim().slice(0, 100);
    const email = String(data.get("email") || "").trim().slice(0, 255);
    const phone = String(data.get("phone") || "").trim().slice(0, 20);
    const reward = String(data.get("reward") || "Cash Reward");
    const notes = String(data.get("notes") || "").trim().slice(0, 500);

    if (!name || !phone) return;

    const text =
      `Hi, I'd like to register for the SpendSmart Referral Program.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      (email ? `Email: ${email}\n` : "") +
      `Preferred Reward: ${reward}\n` +
      (notes ? `Notes: ${notes}\n` : "");

    window.open(`https://wa.me/918770066995?text=${encodeURIComponent(text)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <FormField label="Full Name" name="name" required placeholder="Your name" maxLength={100} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone / WhatsApp" name="phone" required placeholder="+91 …" maxLength={20} />
        <FormField label="Email (optional)" name="email" type="email" placeholder="you@example.com" maxLength={255} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Preferred Reward
        </label>
        <select
          name="reward"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
        >
          <option>Cash Reward</option>
          <option>Subscription Reward (3 Months Free)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Anything we should know? (optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          maxLength={500}
          placeholder="Audience, network size, social handles…"
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/95"
      >
        {submitted ? "Resend on WhatsApp" : "Register & Get My Link"} <ArrowRight className="h-4 w-4" />
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Submitting opens WhatsApp with your details prefilled.
      </p>
    </form>
  );
}

function FormField({
  label,
  name,
  required,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
      />
    </div>
  );
}
