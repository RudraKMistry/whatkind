import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { ResponsesTableClient } from "@/components/admin/ResponsesTableClient";

export const dynamic = "force-dynamic";

export default async function AdminResponsesPage() {
  if (!isAuthenticatedAdmin()) {
    redirect("/admin/login");
  }

  const [responses, campaigns] = await Promise.all([
    db.response.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        campaign: { select: { slug: true, title: true } },
        profile: {
          select: {
            fullName: true,
            email: true,
            birthDate: true,
            gender: true,
            notes: true,
          },
        },
        consent: {
          select: {
            tcVersion: true,
            tcChecksum: true,
            ipHash: true,
            agreedAt: true,
            userAgent: true,
          },
        },
      },
    }),
    db.campaign.findMany({
      select: { slug: true },
      orderBy: { slug: "asc" },
    }),
  ]);

  const serialized = responses.map((r) => ({
    id: r.id,
    respondentRef: r.respondentRef,
    campaignSlug: r.campaign.slug,
    campaignTitle: r.campaign.title,
    answersJson: r.answersJson,
    answerLogsJson: r.answerLogsJson,
    completionSec: r.completionSec,
    createdAt: r.createdAt.toISOString(),
    profile: r.profile
      ? {
          fullName: r.profile.fullName,
          email: r.profile.email,
          birthDate: r.profile.birthDate,
          gender: r.profile.gender,
          notes: r.profile.notes || "",
        }
      : null,
    consent: r.consent
      ? {
          tcVersion: r.consent.tcVersion,
          tcChecksum: r.consent.tcChecksum,
          ipHash: r.consent.ipHash,
          agreedAt: r.consent.agreedAt.toISOString(),
          userAgent: r.consent.userAgent,
        }
      : null,
  }));

  const campaignSlugs = campaigns.map((c) => c.slug);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight font-sans">
          All Saved Answers
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
          Look through finished quizzes, check individual answers, and confirm privacy agreement records.
        </p>
      </div>

      <ResponsesTableClient responses={serialized} campaignSlugs={campaignSlugs} />
    </div>
  );
}
