import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SurveySubmissionSchema } from "@/lib/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { DEFAULT_TC_VERSION, DEFAULT_TERMS_AND_CONDITIONS } from "@/lib/terms";
import { computeTermsChecksum } from "@/lib/terms-server";
import { DEMO_SURVEY_SCHEMA } from "@/lib/mock-survey";
import { buildDetailedAnswerLogs } from "@/lib/answer-logs";
import type { SurveySchemaDefinition } from "@/types/survey";
import crypto from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: { campaignSlug: string } }
) {
  try {
    const rawSlug = params.campaignSlug;
    const campaignSlug = rawSlug === "demo-demographics" ? "demographics-2026" : rawSlug;

    // 1. Rate Limiting Protection (Max 10 submissions/min per IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp, 10, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a moment before submitting again.",
          code: "RATE_LIMITED",
          resetMs: rateLimit.resetMs,
        },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Body via Zod
    const body = await request.json();
    const parseResult = SurveySubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      const errorDetails = parseResult.error.flatten();
      const isConsentError = errorDetails.fieldErrors?.consent !== undefined;

      return NextResponse.json(
        {
          error: isConsentError
            ? "Explicit Terms & Conditions agreement is required to submit."
            : "Payload validation failed.",
          code: isConsentError ? "CONSENT_REQUIRED" : "VALIDATION_FAILED",
          details: errorDetails,
        },
        { status: 400 }
      );
    }

    const { answers, completionSec, consent, profile, psychometrics } = parseResult.data;

    // Additional Consent Verification Check
    if (consent.agreed !== true) {
      return NextResponse.json(
        {
          error: "Submission rejected: You must accept the Terms & Conditions and Privacy Policy.",
          code: "CONSENT_REQUIRED",
        },
        { status: 400 }
      );
    }

    // 3. Find or Upsert Campaign in Database
    let campaign = await db.campaign.findUnique({
      where: { slug: campaignSlug },
    });

    if (!campaign) {
      // If campaign does not exist yet (e.g. demo campaign), auto-provision it
      const tcContent = DEFAULT_TERMS_AND_CONDITIONS;
      campaign = await db.campaign.create({
        data: {
          slug: campaignSlug,
          title: DEMO_SURVEY_SCHEMA.title,
          description: DEMO_SURVEY_SCHEMA.description,
          isActive: true,
          tcVersion: DEFAULT_TC_VERSION,
          tcContent: tcContent,
          schemaJson: JSON.stringify(DEMO_SURVEY_SCHEMA),
        },
      });
    }

    if (!campaign.isActive) {
      return NextResponse.json(
        {
          error: "This survey campaign is currently closed or inactive.",
          code: "CAMPAIGN_INACTIVE",
        },
        { status: 403 }
      );
    }

    // 4. Verify & Canonicalize Terms Checksum
    const currentTcChecksum = computeTermsChecksum(campaign.tcContent);
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex");
    const pseudonymousRef = "RESP-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // Store answers along with calculated psychometrics if present
    const answersPayload = psychometrics
      ? { ...answers, _psychometrics: psychometrics }
      : answers;

    // Build full question-by-question answer log from authoritative campaign schema
    let parsedSchema: SurveySchemaDefinition | null = null;
    try {
      parsedSchema = JSON.parse(campaign.schemaJson) as SurveySchemaDefinition;
    } catch {
      parsedSchema = null;
    }
    const detailedLogs = buildDetailedAnswerLogs(parsedSchema, answers);

    // 5. Atomic Transaction: Upsert Profile, Persist Response & Full Logs, and Immutable Consent Log
    const result = await db.$transaction(async (tx) => {
      const profileRecord = await tx.respondentProfile.upsert({
        where: { profileToken: profile.profileToken },
        update: {
          fullName: profile.fullName.trim(),
          email: profile.email.trim().toLowerCase(),
          birthDate: profile.birthDate.trim(),
          gender: profile.gender.trim(),
          notes: profile.notes?.trim() || null,
        },
        create: {
          profileToken: profile.profileToken,
          fullName: profile.fullName.trim(),
          email: profile.email.trim().toLowerCase(),
          birthDate: profile.birthDate.trim(),
          gender: profile.gender.trim(),
          notes: profile.notes?.trim() || null,
        },
      });

      const responseRecord = await tx.response.create({
        data: {
          campaignId: campaign.id,
          profileId: profileRecord.id,
          answersJson: JSON.stringify(answersPayload),
          answerLogsJson: JSON.stringify(detailedLogs),
          respondentRef: pseudonymousRef,
          completionSec: completionSec,
        },
      });

      const consentRecord = await tx.consentLog.create({
        data: {
          campaignId: campaign.id,
          responseId: responseRecord.id,
          tcVersion: consent.tcVersion || campaign.tcVersion,
          tcChecksum: currentTcChecksum,
          ipHash: ipHash,
          userAgent: userAgent,
          agreedAt: new Date(consent.timestamp),
        },
      });

      return {
        responseId: responseRecord.id,
        consentId: consentRecord.id,
        referenceId: responseRecord.respondentRef,
        agreedAt: consentRecord.agreedAt,
        tcChecksum: consentRecord.tcChecksum,
      };
    });

    // 6. Return Verified Submission Receipt
    return NextResponse.json(
      {
        success: true,
        message: "Survey response and verifiable consent logged successfully.",
        submissionId: result.responseId,
        referenceId: result.referenceId,
        consentedAt: result.agreedAt.toISOString(),
        tcChecksum: result.tcChecksum,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Survey submission processing error:", error);
    return NextResponse.json(
      {
        error: "An internal server error occurred while processing your submission.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
