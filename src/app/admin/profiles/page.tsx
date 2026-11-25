import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { ProfilesListClient } from "@/components/admin/ProfilesListClient";

export const dynamic = "force-dynamic";

export default async function AdminProfilesPage() {
  if (!isAuthenticatedAdmin()) {
    redirect("/admin/login");
  }

  const profiles = await db.respondentProfile.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      responses: {
        orderBy: { createdAt: "desc" },
        include: {
          campaign: { select: { slug: true, title: true } },
          consent: {
            select: {
              tcVersion: true,
              tcChecksum: true,
              agreedAt: true,
            },
          },
        },
      },
    },
  });

  const serialized = profiles.map((p) => ({
    id: p.id,
    fullName: p.fullName,
    email: p.email,
    birthDate: p.birthDate,
    gender: p.gender,
    notes: p.notes || "",
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    responses: p.responses.map((r) => ({
      id: r.id,
      respondentRef: r.respondentRef,
      campaignSlug: r.campaign.slug,
      campaignTitle: r.campaign.title,
      answersJson: r.answersJson,
      answerLogsJson: r.answerLogsJson,
      completionSec: r.completionSec,
      createdAt: r.createdAt.toISOString(),
      consent: r.consent
        ? {
            tcVersion: r.consent.tcVersion,
            tcChecksum: r.consent.tcChecksum,
            agreedAt: r.consent.agreedAt.toISOString(),
          }
        : null,
    })),
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight font-sans">
          Respondent Profiles & Full Quiz Logs
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
          Private admin view of every person&apos;s identity details and the exact choices they picked across every quiz.
        </p>
      </div>

      <ProfilesListClient profiles={serialized} />
    </div>
  );
}
