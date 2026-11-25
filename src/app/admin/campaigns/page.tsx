import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { CampaignsListClient } from "@/components/admin/CampaignsListClient";
import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  if (!isAuthenticatedAdmin()) {
    redirect("/admin/login");
  }

  const campaigns = await db.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { responses: true } },
    },
  });

  const serialized = campaigns.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    isActive: c.isActive,
    tcVersion: c.tcVersion,
    createdAt: c.createdAt.toISOString(),
    responseCount: c._count.responses,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight font-sans">
          Manage Quizzes
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
          Open, pause, and check all quizzes and their privacy rule versions.
        </p>
      </div>

      <CampaignsListClient initialCampaigns={serialized} />
    </div>
  );
}
