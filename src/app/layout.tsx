import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Survey Portal | Personality, Thinking & Values Quizzes",
  description: "Easy-to-read personality, thinking, and values quizzes with clear privacy consent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-charcoal-900 font-sans selection:bg-primary-soft selection:text-primary-active">
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
