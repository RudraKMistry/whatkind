"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  ExternalLink,
  Download,
  Power,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface CampaignItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isActive: boolean;
  tcVersion: string;
  createdAt: string;
  responseCount: number;
}

export function CampaignsListClient({
  initialCampaigns,
}: {
  initialCampaigns: CampaignItem[];
}) {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(initialCampaigns);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    setToggleError(null);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/toggle`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: data.isActive } : c))
        );
      } else {
        setToggleError(data.error || "Could not change quiz status.");
      }
    } catch {
      setToggleError("Network error while updating quiz status.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {toggleError && (
        <div className="rounded-tactile border border-terracotta/30 bg-terracotta-soft px-4 py-3 text-xs text-terracotta flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{toggleError}</span>
          </div>
          <button
            type="button"
            onClick={() => setToggleError(null)}
            className="underline hover:no-underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className={`rounded-tactile border p-6 bg-surface shadow-warm-md transition-all ${
              camp.isActive ? "border-border" : "border-border/60 opacity-80"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-charcoal-700 bg-canvas-subtle border border-border px-2.5 py-0.5 rounded">
                    /s/{camp.slug}
                  </span>

                  {camp.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success-soft text-success text-[11px] font-medium border border-success/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Open & Taking Answers
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-canvas-subtle text-charcoal-500 text-[11px] font-medium border border-border">
                      <AlertTriangle className="h-3 w-3 text-terracotta" />
                      Paused / Closed
                    </span>
                  )}

                  <span className="text-xs font-mono text-charcoal-500">
                    Rules v{camp.tcVersion}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-charcoal-900 font-sans">
                  {camp.title}
                </h3>

                {camp.description && (
                  <p className="text-xs text-charcoal-700 leading-relaxed max-w-2xl">
                    {camp.description}
                  </p>
                )}
              </div>

              {/* Status Toggle & Metrics Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                <div className="text-right">
                  <span className="block text-[11px] font-mono uppercase text-charcoal-500 font-semibold">
                    Saved Answers
                  </span>
                  <span className="font-mono text-xl font-bold text-charcoal-900">
                    {camp.responseCount}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(camp.id)}
                  disabled={togglingId === camp.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    camp.isActive
                      ? "border-terracotta/30 text-terracotta hover:bg-terracotta-soft"
                      : "border-success/30 text-success hover:bg-success-soft"
                  }`}
                >
                  {togglingId === camp.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Power className="h-3.5 w-3.5" />
                  )}
                  {camp.isActive ? "Pause Quiz" : "Open Quiz"}
                </button>
              </div>
            </div>

            {/* Sub-footer Links */}
            <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-mono text-charcoal-500 text-[11px]">
                Created: {new Date(camp.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-3">
                <a
                  href={`/api/export?campaignSlug=${camp.slug}&format=csv`}
                  download
                  className="inline-flex items-center gap-1 text-charcoal-700 hover:text-charcoal-900 font-medium transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  Download Quiz CSV
                </a>

                <Link
                  href={`/s/${camp.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
