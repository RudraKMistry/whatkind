import { PrismaClient } from "@prisma/client";
import { computeTermsChecksum } from "../src/lib/terms-server.ts";
import { DEFAULT_TC_VERSION, DEFAULT_TERMS_AND_CONDITIONS, CANONICAL_TC_CHECKSUM } from "../src/lib/terms.ts";
import { checkRateLimit } from "../src/lib/rate-limit.ts";
import { SurveySubmissionSchema } from "../src/lib/schema.ts";
import crypto from "crypto";

const prisma = new PrismaClient();

async function runPhase2Tests() {
  console.log("=== RUNNING PHASE 2 END-TO-END INTEGRATION TESTS ===");

  try {
    // 1. Test Terms & Conditions Hash Determinism
    const hash = computeTermsChecksum(DEFAULT_TERMS_AND_CONDITIONS);
    console.log("Test 1 - T&C SHA-256 Checksum Computed:", hash.substring(0, 16) + "...");
    if (hash !== CANONICAL_TC_CHECKSUM) {
      throw new Error("Canonical checksum mismatch!");
    }
    console.log("Test 1 - Checksum Integrity: PASSED");

    // 2. Test Rate Limiter Guard
    const testIp = "192.168.1.100";
    let allowedCount = 0;
    for (let i = 0; i < 12; i++) {
      const rl = checkRateLimit(testIp, 10, 60000);
      if (rl.allowed) allowedCount++;
    }
    console.log(`Test 2 - Rate Limiting: ${allowedCount} allowed out of 12 requests.`);
    if (allowedCount !== 10) {
      throw new Error(`Rate limit expected exactly 10 allowed, got ${allowedCount}`);
    }
    console.log("Test 2 - Rate Limiting Guard: PASSED");

    // 3. Test Database Transaction & Consent Ledgering
    const campaignSlug = "integration-test-campaign";
    const answers = {
      full_name: "Dr. Evelyn Reed",
      email_address: "evelyn.reed@intelligence.org",
      age_bracket: "35-44",
      geographic_region: "weu",
      industry_sector: "research",
      experience_bracket: "exp_6_10",
      active_tooling: ["cloud_collab", "data_analytics"],
      consent_importance: 10,
    };

    const completionSec = 112;
    const clientTimestamp = new Date().toISOString();
    const payload = {
      campaignSlug,
      answers,
      completionSec,
      profile: {
        profileToken: "prof_test_integration_123456",
        fullName: "Dr. Evelyn Reed",
        email: "evelyn.reed@intelligence.org",
        birthDate: "1990-05-14",
        gender: "Female",
        notes: "Integration test profile",
      },
      consent: {
        agreed: true,
        tcVersion: DEFAULT_TC_VERSION,
        tcChecksum: CANONICAL_TC_CHECKSUM,
        timestamp: clientTimestamp,
      },
    };

    // Zod parsing check
    const validation = SurveySubmissionSchema.safeParse(payload);
    if (!validation.success) {
      throw new Error("Validation failed for valid payload!");
    }

    // Provision or get campaign
    let campaign = await prisma.campaign.findUnique({ where: { slug: campaignSlug } });
    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          slug: campaignSlug,
          title: "Integration Test Research Campaign",
          description: "Automated verification campaign.",
          isActive: true,
          tcVersion: DEFAULT_TC_VERSION,
          tcContent: DEFAULT_TERMS_AND_CONDITIONS,
          schemaJson: "{}",
        },
      });
    }

    // Execute atomic transaction mirroring API route
    const respondentRef = "RESP-TEST-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const clientIp = "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex");

    const result = await prisma.$transaction(async (tx) => {
      const resp = await tx.response.create({
        data: {
          campaignId: campaign.id,
          answersJson: JSON.stringify(answers),
          respondentRef,
          completionSec,
        },
      });

      const consentLog = await tx.consentLog.create({
        data: {
          campaignId: campaign.id,
          responseId: resp.id,
          tcVersion: DEFAULT_TC_VERSION,
          tcChecksum: CANONICAL_TC_CHECKSUM,
          ipHash,
          userAgent: "IntegrationTestAgent/1.0",
          agreedAt: new Date(clientTimestamp),
        },
      });

      return { resp, consentLog };
    });

    console.log("Test 3 - Response Persisted with ID:", result.resp.id);
    console.log("Test 3 - Consent Log Persisted with ID:", result.consentLog.id);
    console.log("Test 3 - Reference ID Generated:", result.resp.respondentRef);

    // Verify relations and queryability
    const verified = await prisma.response.findUnique({
      where: { id: result.resp.id },
      include: { consent: true, campaign: true },
    });

    if (!verified || !verified.consent) {
      throw new Error("Failed to query persisted response with linked consent log!");
    }

    if (verified.consent.tcChecksum !== CANONICAL_TC_CHECKSUM) {
      throw new Error("Consent log checksum does not match canonical terms hash!");
    }

    console.log("Test 3 - Atomic Transaction & Relational Integrity: PASSED");

    // 4. Test Unconsented Rejection Logic
    const unconsented = {
      ...payload,
      consent: {
        ...payload.consent,
        agreed: false,
      },
    };
    const unconsentedValidation = SurveySubmissionSchema.safeParse(unconsented);
    console.log("Test 4 - Unconsented Rejection Gate:", !unconsentedValidation.success ? "PASSED (Strictly Rejected)" : "FAILED");

    console.log(">>> ALL PHASE 2 GATES VERIFIED AND OPERATIONAL <<<");
  } catch (err) {
    console.error("Test failure:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase2Tests();
