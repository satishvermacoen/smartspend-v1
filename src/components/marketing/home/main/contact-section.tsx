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
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Mail,
      label: "Email Support",
      value: "support@spendsmartsubscriptions.in",
      href: "mailto:support@spendsmartsubscriptions.in",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon–Sat, 10 AM – 8 PM IST",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-28 bg-background">
      {/* Background decorations */}
      <div className="absolute right-10 top-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl opacity-40" />
      <div className="absolute left-10 bottom-1/4 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl opacity-30" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
            Get In Touch
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            We are here to <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">help you.</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Have questions about activation or billing? Reach out to us, and our team will assist you immediately.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactMethods.map((c) => {
            const inner = (
              <div className="flex flex-col items-start">
                <div className={`grid h-11 w-11 place-items-center rounded-xl border ${c.color} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">
                  {c.label}
                </div>
                <div className="mt-2 font-display text-lg font-bold text-foreground break-all transition-colors group-hover:text-primary">
                  {c.value}
                </div>
              </div>
            );
            const className =
              "group relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md hover:bg-card/60 block w-full text-left";
            return c.href ? (
              <a key={c.label} href={c.href} className={className}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/30 to-emerald-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {inner}
              </a>
            ) : (
              <div key={c.label} className={className}>
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/30 to-emerald-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {inner}
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 h-12 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
          >
            <a
              href="https://wa.me/918770066995?text=Hi%20I%20am%20looking%20for%20subscriptions.%20Can%20you%20please%20help%20me%20out%3F"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4.5 w-4.5 fill-current" />
              Chat on WhatsApp
            </a>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border border-border/60 bg-card/50 backdrop-blur px-8 h-12 text-sm font-bold text-foreground shadow-sm hover:bg-accent/20 transition-all duration-300"
              >
                <Send className="h-4 w-4" />
                Send an Enquiry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg rounded-2xl border border-border/60 bg-background/95 backdrop-blur-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-extrabold text-foreground">
                  Send an Enquiry
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Fill in your details and we will contact you within a few minutes.
                </DialogDescription>
              </DialogHeader>
              <InquiryForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
