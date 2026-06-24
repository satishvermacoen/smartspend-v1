import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendSmart Subscriptions",
  description: "Premium AI & Professional subscriptions at up to 50% off.",
  keywords: ["SpendSmart", "Subscriptions", "LinkedIn Premium", "ChatGPT Plus", "Adobe Creative Cloud", "Vouchers"],
  authors: [{ name: "SpendSmart Subscriptions" }],
  openGraph: {
    title: "SpendSmart Subscriptions — Save 50% on Premium Tools",
    description: "Premium AI & Professional subscriptions at up to 50% off.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
