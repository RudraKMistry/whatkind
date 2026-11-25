import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const LatestQuerySchema = z.object({
  profileToken: z.string().trim().min(8),
});

/**
 * Returns the latest psychometric result per campaign slug for the caller's
 * own profileToken. Never exposes other users' profiles or raw admin logs.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LatestQuerySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ results: {} }, { status: 200 });
    }

    const profile = await db.respondentProfile.findUnique({
      where: { profileToken: parsed.data.profileToken },
      select: {
        responses: {
          orderBy: { createdAt: "desc" },
          include: {
            campaign: { select: { slug: true } },
            consent: { select: { agreedAt: true, tcChecksum: true } },
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ results: {} }, { status: 200 });
    }

    const latestBySlug: Record<string, any> = {};
    for (const r of profile.responses) {
      const slug = r.campaign.slug;
      if (latestBySlug[slug]) continue; // Already grabbed the newest one

      let psychometrics = null;
      try {
        const parsedAnswers = JSON.parse(r.answersJson);
        psychometrics = parsedAnswers?._psychometrics || null;
      } catch {
        psychometrics = null;
      }

      latestBySlug[slug] = {
        result: psychometrics,
        referenceId: r.respondentRef || r.id,
        consentedAt: (r.consent?.agreedAt || r.createdAt).toISOString(),
        tcChecksum: r.consent?.tcChecksum || "",
        savedAt: r.createdAt.toISOString(),
      };
    }

    return NextResponse.json({ results: latestBySlug }, { status: 200 });
  } catch (error) {
    console.error("Latest result lookup error:", error);
    return NextResponse.json({ results: {} }, { status: 200 });
  }
}
