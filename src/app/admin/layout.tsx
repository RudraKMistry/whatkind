import React from "react";
import Link from "next/link";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  ShieldCheck,
  BarChart3,
  Layers,
  FileSpreadsheet,
  Users,
  LogOut,
  ExternalLink,
  Download,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = isAuthenticatedAdmin();

  // If unauthenticated, redirect to login (except when already on login route)
  // In Next App Router, route groups or page-level check works cleanly.
  // We can render children directly if on login, or enforce auth for protected admin pages.

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans text-charcoal-900">
      {/* Top Administrative Header */}
      <header className="border-b border-border bg-surface shadow-warm-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shadow-warm-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-charcoal-900 text-sm tracking-tight block">
                  Quiz Admin
                </span>
                <span className="font-mono text-[10px] text-charcoal-500 block -mt-0.5">
                  Survey Management
                </span>
              </div>
            </Link>

            <span className="h-4 w-px bg-border hidden sm:block" />

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-subtle transition-colors flex items-center gap-1.5"
              >
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Overview</span>
              </Link>
              <Link
                href="/admin/campaigns"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-subtle transition-colors flex items-center gap-1.5"
              >
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Quizzes</span>
              </Link>
              <Link
                href="/admin/profiles"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-subtle transition-colors flex items-center gap-1.5"
              >
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Profiles</span>
              </Link>
              <Link
                href="/admin/responses"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-subtle transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
                <span>Answers</span>
              </Link>
            </nav>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/api/export?format=csv"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-canvas-subtle hover:bg-surface text-charcoal-700 hover:text-charcoal-900 text-xs font-medium transition-colors shadow-warm-sm"
              title="Download all quiz answers in CSV format"
            >
              <Download className="h-3.5 w-3.5 text-primary" />
              <span className="hidden md:inline">Download CSV</span>
            </a>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-charcoal-500 hover:text-charcoal-900 transition-colors p-1.5 rounded hover:bg-canvas-subtle"
              title="Open Public Home Page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1 text-xs text-charcoal-500 hover:text-terracotta transition-colors p-1.5 rounded hover:bg-canvas-subtle"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Admin Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
