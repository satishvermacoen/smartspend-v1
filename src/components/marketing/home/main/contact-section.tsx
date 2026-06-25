"use client";

import { Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InquiryForm } from "@/components/marketing/home/main/inquiry-form";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  const contactMethods = [
    {
      icon: Phone,
      label: "Call Us",
      value: "+91 8770066995",
      href: "tel:918770066995",
    },
    {
      icon: Mail,
      label: "Email",
      value: "support@spendsmartsubscriptions.in",
      href: "mailto:support@spendsmartsubscriptions.in",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon–Sat, 10 AM – 8 PM IST",
    },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
          Contact
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Get <span className="text-primary">In Touch</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Questions? Ready to save? We&apos;re one message away.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {contactMethods.map((c) => {
          const inner = (
            <>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {c.label}
              </div>
              <div className="mt-1 break-words font-display text-base font-semibold text-foreground sm:text-lg">
                {c.value}
              </div>
            </>
          );
          const className =
            "block rounded-lg border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 duration-200";
          return c.href ? (
            <a key={c.label} href={c.href} className={className}>
              {inner}
            </a>
          ) : (
            <div key={c.label} className={className}>
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-colors"
        >
          <a
            href="https://wa.me/918770066995?text=Hi%20I%20am%20looking%20for%20subscriptions.%20Can%20you%20please%20help%20me%20out%3F"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
          </a>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-colors"
            >
              <Send className="h-4 w-4" /> Send an Enquiry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-foreground">Send an Enquiry</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in your details and we&apos;ll contact you within minutes.
              </DialogDescription>
            </DialogHeader>
            <InquiryForm />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
