"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { loadStoredProfile } from "@/lib/profile";
import { loadLatestResult, saveLatestResult, SavedLatestResult } from "@/lib/latest-result";

let pendingFetch: Promise<Record<string, SavedLatestResult>> | null = null;
let cachedToken: string | null = null;

async function fetchLatestFromServer(
  profileToken: string
): Promise<Record<string, SavedLatestResult>> {
  if (pendingFetch && cachedToken === profileToken) {
    return pendingFetch;
  }
  cachedToken = profileToken;
  pendingFetch = fetch("/api/profile/latest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileToken }),
  })
    .then((res) => (res.ok ? res.json() : { results: {} }))
    .then((data) => {
      const map: Record<string, SavedLatestResult> = data?.results || {};
      for (const [slug, entry] of Object.entries(map)) {
        if (entry && entry.referenceId) {
          saveLatestResult(slug, {
            result: entry.result,
            referenceId: entry.referenceId,
            consentedAt: entry.consentedAt,
            tcChecksum: entry.tcChecksum,
          });
        }
      }
      return map;
    })
    .catch(() => ({}));
  return pendingFetch;
}

export function LatestResultButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState<SavedLatestResult | null>(null);

  useEffect(() => {
    const syncLatest = () => {
      const local = loadLatestResult(slug);
      if (local) {
        setSaved(local);
        return;
      }

      const profile = loadStoredProfile();
      if (!profile?.profileToken) {
        setSaved(null);
        return;
      }

      fetchLatestFromServer(profile.profileToken).then((map) => {
        setSaved(map[slug] || null);
      });
    };

    syncLatest();

    const handleProfileChange = (e: Event) => {
      const custom = e as CustomEvent<unknown>;
      if (custom.detail === null) {
        pendingFetch = null;
        cachedToken = null;
        setSaved(null);
      } else {
        syncLatest();
      }
    };

    window.addEventListener("survey-profile-updated", handleProfileChange);
    return () => window.removeEventListener("survey-profile-updated", handleProfileChange);
  }, [slug]);

  if (!saved) return null;

  return (
    <Link
      href={`/s/${slug}?view=latest`}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-canvas-subtle hover:bg-surface text-charcoal-900 text-xs sm:text-sm font-semibold shadow-warm-xs transition-all hover:-translate-y-0.5"
      title={
        saved.result?.archetypeTitle
          ? `View your latest result: ${saved.result.archetypeTitle}`
          : "View your latest result"
      }
    >
      <BarChart3 className="h-3.5 w-3.5 text-primary" />
      <span>Latest Result</span>
    </Link>
  );
}
