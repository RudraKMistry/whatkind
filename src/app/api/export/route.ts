import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""';
  let str = Array.isArray(field) ? field.join("; ") : String(field);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  // 1. Verify Admin Authentication
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized access to export facility.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format")?.toLowerCase() || "csv";
    const campaignSlug = searchParams.get("campaignSlug") || undefined;

    // 2. Query Responses with Campaign, Profile, and Consent Data
    const responses = await db.response.findMany({
      where: campaignSlug ? { campaign: { slug: campaignSlug } } : undefined,
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
            userAgent: true,
            agreedAt: true,
          },
        },
      },
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileBaseName = campaignSlug ? `survey-${campaignSlug}-${timestamp}` : `survey-all-${timestamp}`;

    // 3. Format: JSON Export
    if (format === "json") {
      const formattedJson = responses.map((r) => {
        let parsedAnswers: any = {};
        try {
          parsedAnswers = JSON.parse(r.answersJson);
        } catch {
          parsedAnswers = r.answersJson;
        }

        let parsedLogs: unknown = null;
        try {
          parsedLogs = r.answerLogsJson ? JSON.parse(r.answerLogsJson) : null;
        } catch {
          parsedLogs = r.answerLogsJson;
        }

        return {
          id: r.id,
          referenceId: r.respondentRef,
          campaignSlug: r.campaign.slug,
          campaignTitle: r.campaign.title,
          completionSeconds: r.completionSec,
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
          answers: parsedAnswers,
          answerLogs: parsedLogs,
          consent: r.consent
            ? {
                tcVersion: r.consent.tcVersion,
                tcChecksum: r.consent.tcChecksum,
                ipHash: r.consent.ipHash,
                userAgent: r.consent.userAgent,
                agreedAt: r.consent.agreedAt.toISOString(),
              }
            : null,
        };
      });

      return new NextResponse(JSON.stringify(formattedJson, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileBaseName}.json"`,
        },
      });
    }

    // 4. Format: CSV Export
    // Gather all distinct answer keys dynamically across all records
    const allAnswerKeys = new Set<string>();
    const parsedRows = responses.map((r) => {
      let answers: Record<string, unknown> = {};
      try {
        answers = JSON.parse(r.answersJson);
      } catch {
        answers = {};
      }
      Object.keys(answers).forEach((k) => allAnswerKeys.add(k));
      return { record: r, answers };
    });

    const sortedAnswerKeys = Array.from(allAnswerKeys).sort();

    // Standard metadata columns followed by dynamic answer question columns
    const staticHeaders = [
      "Response ID",
      "Reference ID",
      "Profile Name",
      "Profile Email",
      "Profile Birth Date",
      "Profile Gender",
      "Profile Notes",
      "Campaign Slug",
      "Campaign Title",
      "Completion Seconds",
      "Submitted At (UTC)",
      "T&C Version",
      "T&C Checksum (SHA-256)",
      "Anonymized IP Hash",
      "User Agent",
      "Full Answer Log",
    ];

    const csvHeaders = [...staticHeaders, ...sortedAnswerKeys].map(escapeCsvField).join(",");

    const csvLines = parsedRows.map(({ record, answers }) => {
      const staticValues = [
        record.id,
        record.respondentRef || "",
        record.profile?.fullName || "",
        record.profile?.email || "",
        record.profile?.birthDate || "",
        record.profile?.gender || "",
        record.profile?.notes || "",
        record.campaign.slug,
        record.campaign.title,
        record.completionSec,
        record.createdAt.toISOString(),
        record.consent?.tcVersion || "1.0",
        record.consent?.tcChecksum || "",
        record.consent?.ipHash || "",
        record.consent?.userAgent || "",
        record.answerLogsJson || "",
      ];

      const dynamicValues = sortedAnswerKeys.map((key) => {
        const val = answers[key];
        return val !== undefined ? val : "";
      });

      return [...staticValues, ...dynamicValues].map(escapeCsvField).join(",");
    });

    const csvContent = [csvHeaders, ...csvLines].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileBaseName}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export pipeline failure:", error);
    return NextResponse.json(
      { error: "Internal server error generating export.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
