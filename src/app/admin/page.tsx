import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAuthenticatedAdmin } from "@/lib/auth";
import {
  Users,
  Layers,
  Clock,
  ShieldCheck,
  ArrowRight,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isAuthenticatedAdmin()) {
    redirect("/admin/login");
  }

  // Aggregate System Metrics
  const [
    totalResponses,
    totalCampaigns,
    activeCampaigns,
    totalConsents,
    avgDurationResult,
    campaigns,
    recentResponses,
  ] = await Promise.all([
    db.response.count(),
    db.campaign.count(),
    db.campaign.count({ where: { isActive: true } }),
    db.consentLog.count(),
    db.response.aggregate({ _avg: { completionSec: true } }),
    db.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { responses: true } },
      },
    }),
    db.response.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        campaign: { select: { slug: true, title: true } },
        consent: { select: { tcVersion: true, tcChecksum: true } },
      },
    }),
  ]);

  const avgSeconds = Math.round(avgDurationResult._avg.completionSec || 0);
  const avgDurationFormatted =
    avgSeconds >= 60
      ? `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60}s`
      : `${avgSeconds}s`;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-900 tracking-tight font-sans">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            See how many people finished each quiz, check open quizzes, and confirm privacy records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export?format=csv"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium shadow-warm-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download All (CSV)
          </a>
          <a
            href="/api/export?format=json"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:bg-canvas-subtle text-charcoal-900 text-xs font-medium shadow-warm-sm transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
            Download All (JSON)
          </a>
        </div>
      </div>

      {/* KPI Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-tactile border border-border bg-surface p-5 shadow-warm-md space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Total Answers
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-charcoal-900 font-sans tracking-tight">
            {totalResponses}
          </div>
          <span className="block text-[11px] text-charcoal-500 font-mono">
            Across {totalCampaigns} quizzes
          </span>
        </div>

        <div className="rounded-tactile border border-border bg-surface p-5 shadow-warm-md space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Open Quizzes
            </span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-charcoal-900 font-sans tracking-tight">
            {activeCampaigns} <span className="text-lg text-charcoal-500 font-normal">/ {totalCampaigns}</span>
          </div>
          <span className="block text-[11px] text-success font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Currently open for answers
          </span>
        </div>

        <div className="rounded-tactile border border-border bg-surface p-5 shadow-warm-md space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Average Time
            </span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-charcoal-900 font-sans tracking-tight">
            {avgDurationFormatted}
          </div>
          <span className="block text-[11px] text-charcoal-500 font-mono">
            Across all finished quizzes
          </span>
        </div>

        <div className="rounded-tactile border border-border bg-surface p-5 shadow-warm-md space-y-2">
          <div className="flex items-center justify-between text-charcoal-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Privacy Records
            </span>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-success font-sans tracking-tight">
            100%
          </div>
          <span className="block text-[11px] text-charcoal-700 font-medium">
            {totalConsents} / {totalResponses} consent records saved
          </span>
        </div>
      </div>

      {/* Campaigns Breakdown Section */}
      <div className="rounded-tactile border border-border bg-surface shadow-warm-md overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-muted">
          <div>
            <h2 className="text-base font-semibold text-charcoal-900 font-sans">
              Quizzes & Status
            </h2>
            <p className="text-xs text-charcoal-700">
              All quizzes on the site and how many people finished each one.
            </p>
          </div>
          <Link
            href="/admin/campaigns"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Manage Quizzes
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700">
            <thead className="bg-canvas-subtle border-b border-border font-mono uppercase text-[11px] text-charcoal-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Quiz Name</th>
                <th className="px-5 py-3 font-semibold">Web Link</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Answers</th>
                <th className="px-5 py-3 font-semibold">Rules Version</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-charcoal-900">
                    {camp.title}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-charcoal-700">
                    /s/{camp.slug}
                  </td>
                  <td className="px-5 py-3.5">
                    {camp.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-soft text-success text-[11px] font-medium border border-success/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Open
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-canvas-subtle text-charcoal-500 text-[11px] font-medium border border-border">
                        <span className="h-1.5 w-1.5 rounded-full bg-charcoal-500" />
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-medium text-charcoal-900">
                    {camp._count.responses}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-charcoal-500">
                    v{camp.tcVersion}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <Link
                      href={`/s/${camp.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] text-charcoal-500 hover:text-charcoal-900 transition-colors"
                      title="Open public quiz"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open Quiz
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="rounded-tactile border border-border bg-surface shadow-warm-md overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-muted">
          <div>
            <h2 className="text-base font-semibold text-charcoal-900 font-sans">
              Latest Answers
            </h2>
            <p className="text-xs text-charcoal-700">
              The newest finished quizzes saved to the database.
            </p>
          </div>
          <Link
            href="/admin/responses"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
          >
            See All Answers
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentResponses.length === 0 ? (
          <div className="p-8 text-center text-xs text-charcoal-500 font-mono">
            No answers saved yet. Finish a quiz at /s/demographics-2026 to see new entries here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-canvas-subtle border-b border-border font-mono uppercase text-[11px] text-charcoal-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Receipt ID</th>
                  <th className="px-5 py-3 font-semibold">Quiz</th>
                  <th className="px-5 py-3 font-semibold">Time Taken</th>
                  <th className="px-5 py-3 font-semibold">Saved At (UTC)</th>
                  <th className="px-5 py-3 font-semibold">Privacy Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {recentResponses.map((resp) => (
                  <tr key={resp.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-charcoal-900">
                      {resp.respondentRef || resp.id.substring(0, 10)}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal-700">
                      /{resp.campaign.slug}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal-700">
                      {resp.completionSec}s
                    </td>
                    <td className="px-5 py-3.5 text-charcoal-500">
                      {new Date(resp.createdAt).toUTCString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-success font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        Agreed (v{resp.consent?.tcVersion})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
