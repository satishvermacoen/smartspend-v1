"use client";

// Import local physical testimonials screenshots
import arunChat1 from "@/assets/testimonials/arun/arun-1.png";
import arunChat2 from "@/assets/testimonials/arun/arun-2.png";
import arunChat3 from "@/assets/testimonials/arun/arun-3.png";
import arunChat4 from "@/assets/testimonials/arun/arun-4.png";
import harshitChat1 from "@/assets/testimonials/harshit/harshit-1.png";
import harshitChat2 from "@/assets/testimonials/harshit/harshit-2.png";
import harshitChat3 from "@/assets/testimonials/harshit/harshit-3.png";
import chetaliChat1 from "@/assets/testimonials/chetali/chetali-1.png";
import chetaliChat2 from "@/assets/testimonials/chetali/chetali-2.png";
import chetaliChat3 from "@/assets/testimonials/chetali/chetali-3.png";
import { TestimonialCard } from "./testimonial-card";

const TESTIMONIALS = [
  {
    quote: "I had been paying full price for LinkedIn Sales Navigator for months. Got it here at less than half, and the activation was honestly quicker than I expected. Support actually replied when I had a question.",
    name: "Arun K.",
    role: "Mumbai",
    screenshots: [
      { src: arunChat1, alt: "Arun K. WhatsApp chat — initial enquiry" },
      { src: arunChat2, alt: "Arun K. WhatsApp chat — sharing email for activation" },
      { src: arunChat3, alt: "Arun K. WhatsApp chat — ₹2,500 payment confirmation" },
      { src: arunChat4, alt: "Arun K. WhatsApp chat — activation confirmed" },
    ],
  },
  {
    quote: "Honestly, I was a little skeptical at first about how something like this would actually work. But the whole thing turned out to be smooth and Gemini Pro has been running fine on my account ever since.",
    name: "Harshit G.",
    role: "Delhi",
    screenshots: [
      { src: harshitChat1, alt: "Harshit G. WhatsApp chat — Gemini Pro enquiry and pricing" },
      { src: harshitChat2, alt: "Harshit G. WhatsApp chat — activation confirmed" },
      { src: harshitChat3, alt: "Harshit G. WhatsApp chat — payment done and thank you" },
    ],
  },
  {
    quote: "I got to know about them at a meetup event and was quite eager to try. Got Cursor Pro through them, and compared to the official price, the savings were genuinely impressive.",
    name: "Chetali M.",
    role: "Hyderabad",
    screenshots: [
      { src: chetaliChat1, alt: "Chetali M. WhatsApp chat — Cursor Pro enquiry and pricing" },
      { src: chetaliChat2, alt: "Chetali M. WhatsApp chat — gift voucher and activation" },
      { src: chetaliChat3, alt: "Chetali M. WhatsApp chat — payment confirmed with thanks for savings" },
    ],
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">
          Loved by 850+
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What Our <span className="text-primary">Customers Say</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">Real customers. Real savings. Verified on WhatsApp.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} testimonial={t} />
        ))}
      </div>
    </section>
  );
}
