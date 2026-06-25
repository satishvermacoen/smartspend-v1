"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle, User, Mail, Phone, MessageSquare, ChevronDown, Tag } from "lucide-react";
import { ALL_TOOLS } from "@/data/tools";
import { toast } from "sonner";

// Deduplicate tool names and filter out invalid values
const uniqueTools = Array.from(
  new Map(ALL_TOOLS.filter(t => t.name).map(t => [t.name, t])).values()
);

const CATEGORY_LABELS: Record<string, string> = {
  AI: "AI & Assistants",
  Developer: "Developer & Coding",
  Creative: "Design & Creative",
  Professional: "Professional & Learning",
  Productivity: "Productivity & Collaboration",
  Credits: "Cloud Credits & APIs",
  Marketing: "Marketing & Analytics",
};

// Group tools by categories
const groupedTools = uniqueTools.reduce((acc, tool) => {
  const label = CATEGORY_LABELS[tool.category] || "Other Tools";
  if (!acc[label]) acc[label] = [];
  acc[label].push(tool.name);
  return acc;
}, {} as Record<string, string[]>);

// Sort tool names within each category group
Object.keys(groupedTools).forEach(cat => {
  groupedTools[cat].sort((a, b) => a.localeCompare(b));
});

// Robust phone validator that returns validation status, clean form for WhatsApp link, and visual display formatting
function cleanAndValidatePhone(phone: string) {
  const rawClean = phone.trim().replace(/[\s\-()]/g, "");
  
  if (rawClean.startsWith("+")) {
    const digits = rawClean.slice(1);
    const isValid = /^\d{7,15}$/.test(digits);
    return { isValid, cleaned: rawClean.replace("+", ""), formatted: rawClean };
  }
  
  const isAllDigits = /^\d+$/.test(rawClean);
  if (!isAllDigits) {
    return { isValid: false, cleaned: rawClean, formatted: phone };
  }
  
  // Indian 10 digits
  if (rawClean.length === 10) {
    const isValid = /[5-9]/.test(rawClean[0]);
    return {
      isValid,
      cleaned: `91${rawClean}`,
      formatted: `+91 ${rawClean.slice(0, 5)} ${rawClean.slice(5)}`
    };
  }
  
  // Indian 12 digits (with 91 prefix)
  if (rawClean.length === 12 && rawClean.startsWith("91")) {
    const isValid = /[5-9]/.test(rawClean[2]);
    return {
      isValid,
      cleaned: rawClean,
      formatted: `+91 ${rawClean.slice(2, 7)} ${rawClean.slice(7)}`
    };
  }
  
  // Indian 11 digits (with leading 0)
  if (rawClean.length === 11 && rawClean.startsWith("0")) {
    const isValid = /[5-9]/.test(rawClean[1]);
    const mainNum = rawClean.slice(1);
    return {
      isValid,
      cleaned: `91${mainNum}`,
      formatted: `+91 ${mainNum.slice(0, 5)} ${mainNum.slice(5)}`
    };
  }
  
  const isValidGeneral = rawClean.length >= 7 && rawClean.length <= 15;
  return {
    isValid: isValidGeneral,
    cleaned: rawClean,
    formatted: phone
  };
}

export function InquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    subscription: "",
    message: "",
  });

  const [mobileError, setMobileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "mobile") {
      if (value.trim() === "") {
        setMobileError("Mobile number is required.");
      } else {
        const { isValid } = cleanAndValidatePhone(value);
        if (!isValid) {
          setMobileError("Please enter a valid mobile number (e.g. 10 digits).");
        } else {
          setMobileError("");
        }
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMobileError("");

    const name = formData.name.trim();
    const mobile = formData.mobile.trim();
    const email = formData.email.trim();
    const subscription = formData.subscription;
    const message = formData.message.trim();

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    const phoneValidation = cleanAndValidatePhone(mobile);
    if (!mobile || !phoneValidation.isValid) {
      setMobileError("Please enter a valid mobile number.");
      toast.error("Invalid mobile number provided.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Submit to MongoDB database
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile: phoneValidation.formatted,
          email: email || undefined,
          subscription: subscription || undefined,
          message: message || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      toast.success("Enquiry saved successfully!");
      setSubmitted(true);

      // 2. Open WhatsApp support link in a new tab
      const whatsappMsg =
        `Hi, I'd like to enquire about a subscription.\n\n` +
        `*Name:* ${name}\n` +
        `*Mobile:* ${phoneValidation.formatted}\n` +
        (email ? `*Email:* ${email}\n` : "") +
        (subscription ? `*Interested In:* ${subscription}\n` : "") +
        (message ? `*Message:* ${message}\n` : "");

      const encodedMsg = encodeURIComponent(whatsappMsg);
      
      // Target support WhatsApp number is 918770066995
      window.open(`https://wa.me/918770066995?text=${encodedMsg}`, "_blank");

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        subscription: "",
        message: "",
      });
      
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-brand">
            Name <span className="text-brand font-bold">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <User className="h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-brand" />
            </span>
            <input
              name="name"
              required
              type="text"
              placeholder="Your name"
              maxLength={100}
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/10 bg-soft/20 text-sm text-foreground placeholder:text-muted-foreground/45 focus:border-brand/40 focus:ring-1 focus:ring-brand/40 focus:outline-none transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-brand">
            Mobile Number <span className="text-brand font-bold">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Phone className="h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-brand" />
            </span>
            <input
              name="mobile"
              required
              type="tel"
              placeholder="e.g. 9876543210"
              maxLength={18}
              value={formData.mobile}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-soft/20 text-sm text-foreground placeholder:text-muted-foreground/45 focus:ring-1 focus:outline-none transition-all duration-200 shadow-sm ${
                mobileError
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border/10 focus:border-brand/40 focus:ring-brand/40"
              }`}
            />
          </div>
          {mobileError && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{mobileError}</span>
            </div>
          )}
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-brand">
          Email (optional)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Mail className="h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-brand" />
          </span>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            maxLength={255}
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/10 bg-soft/20 text-sm text-foreground placeholder:text-muted-foreground/45 focus:border-brand/40 focus:ring-1 focus:ring-brand/40 focus:outline-none transition-all duration-200 shadow-sm"
          />
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-brand">
          Subscription Interested In
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Tag className="h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-brand" />
          </span>
          <select
            name="subscription"
            value={formData.subscription}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-border/10 bg-soft/20 text-sm text-foreground focus:border-brand/40 focus:ring-1 focus:ring-brand/40 focus:outline-none transition-all duration-200 appearance-none cursor-pointer shadow-sm"
          >
            <option value="" className="bg-background text-foreground">Select a subscription</option>
            {Object.entries(groupedTools).map(([category, tools]) => (
              <optgroup key={category} label={category} className="bg-background text-foreground font-semibold">
                {tools.map(toolName => (
                  <option key={toolName} value={toolName} className="font-normal bg-background text-foreground">
                    {toolName}
                  </option>
                ))}
              </optgroup>
            ))}
            <optgroup label="Other Options" className="bg-background text-foreground font-semibold">
              <option value="Other" className="bg-background text-foreground">Other Subscription</option>
            </optgroup>
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-brand" />
          </span>
        </div>
      </div>

      <div className="group">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 transition-colors group-focus-within:text-brand">
          Message (optional)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-[14px] flex items-center justify-center pointer-events-none">
            <MessageSquare className="h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-brand" />
          </span>
          <textarea
            name="message"
            rows={3}
            maxLength={500}
            placeholder="Tell us anything else we should know…"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/10 bg-soft/20 text-sm text-foreground placeholder:text-muted-foreground/45 focus:border-brand/40 focus:ring-1 focus:ring-brand/40 focus:outline-none transition-all duration-200 resize-none shadow-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !!mobileError}
        className="w-full h-12 bg-gradient-brand hover:brightness-110 active:scale-[0.99] text-primary-foreground font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-card cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
            Saving Enquiry...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 text-primary-foreground" />
            {submitted ? "Book Another Call" : "Book a Call"}
          </>
        )}
      </button>
      
      <p className="text-center text-[11px] text-muted-foreground/80 leading-normal">
        Your enquiry will be saved securely, and we will direct you to our WhatsApp support team for instant booking.
      </p>
    </form>
  );
}

