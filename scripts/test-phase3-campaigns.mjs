import { PrismaClient } from "@prisma/client";
import { computeTermsChecksum } from "../src/lib/terms-server.ts";
import { CANONICAL_TC_CHECKSUM } from "../src/lib/terms.ts";
import crypto from "crypto";

const prisma = new PrismaClient();

async function runPhase3Tests() {
  console.log("=== RUNNING PHASE 3 MULTI-CAMPAIGN PERSISTENCE & ROUTING TESTS ===");

  try {
    // 1. Verify Active Campaigns in Database
    const campaigns = await prisma.campaign.findMany({
      orderBy: { slug: "asc" },
    });

    console.log(`Test 1 - Found ${campaigns.length} seeded campaigns in database.`);
    const activeSlugs = campaigns.filter((c) => c.isActive).map((c) => c.slug);
    console.log("Active slugs:", activeSlugs.join(", "));

    if (!activeSlugs.includes("demographics-2026") || !activeSlugs.includes("consumer-habits") || !activeSlugs.includes("healthcare-perspectives")) {
      throw new Error("Missing required active research campaigns!");
    }
    console.log("Test 1 - Multi-Campaign Presence: PASSED");

    // 2. Verify Schema Isolation & Distinct Questions
    const consumerCamp = campaigns.find((c) => c.slug === "consumer-habits");
    const healthCamp = campaigns.find((c) => c.slug === "healthcare-perspectives");
    const consumerSchema = JSON.parse(consumerCamp.schemaJson);
    const healthSchema = JSON.parse(healthCamp.schemaJson);

    console.log(`Test 2 - Consumer Habits Steps: ${consumerSchema.steps.length} | Questions: ${consumerSchema.steps.flatMap(s => s.questions).length}`);
    console.log(`Test 2 - Healthcare Steps: ${healthSchema.steps.length} | Questions: ${healthSchema.steps.flatMap(s => s.questions).length}`);

    if (consumerSchema.title === healthSchema.title) {
      throw new Error("Campaign schemas must be distinct and isolated!");
    }
    console.log("Test 2 - Schema Isolation & Polymorphism: PASSED");

    // 3. Test Independent Submissions Across Multiple Campaigns
    const testSubmissions = [
      {
        campaign: consumerCamp,
        answers: {
          primary_shopping_channel: "online_delivery",
          monthly_discretionary_spend: "300_600",
          active_subscriptions: ["video_streaming", "audio_streaming"],
          ad_privacy_priority: 9,
          data_trust_commentary: "Hidden telemetry trackers violate user autonomy.",
        },
      },
      {
        campaign: healthCamp,
        answers: {
          biometric_wearables: "daily_wear",
          telehealth_adoption: "frequent_telehealth",
          clinical_ai_comfort_scale: 8,
          health_data_concerns: ["data_breaches", "lack_of_consent"],
        },
      },
    ];

    for (const testItem of testSubmissions) {
      const camp = testItem.campaign;
      const clientIp = "10.0.0.5";
      const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex");
      const clientTimestamp = new Date().toISOString();
      const refId = "RESP-" + camp.slug.substring(0, 4).toUpperCase() + "-" + crypto.randomBytes(3).toString("hex").toUpperCase();

      const createdResponse = await prisma.$transaction(async (tx) => {
        const resp = await tx.response.create({
          data: {
            campaignId: camp.id,
            answersJson: JSON.stringify(testItem.answers),
            respondentRef: refId,
            completionSec: 95,
          },
        });

        await tx.consentLog.create({
          data: {
            campaignId: camp.id,
            responseId: resp.id,
            tcVersion: camp.tcVersion,
            tcChecksum: computeTermsChecksum(camp.tcContent),
            ipHash: ipHash,
            userAgent: "Phase3TestRunner/2.0",
            agreedAt: new Date(clientTimestamp),
          },
        });

        return resp;
      });

      console.log(`Test 3 - Persisted submission for /s/${camp.slug} -> Ref: ${createdResponse.respondentRef}`);

      // Verify foreign key integrity
      const count = await prisma.response.count({ where: { campaignId: camp.id } });
      console.log(`Test 3 - Verified campaign [${camp.slug}] response count: ${count}`);
    }
    console.log("Test 3 - Multi-Campaign Independent Persistence: PASSED");

    // 4. Test Inactive Campaign Enforcement
    const inactiveCamp = campaigns.find((c) => c.slug === "closed-archive-2025");
    if (!inactiveCamp || inactiveCamp.isActive !== false) {
      throw new Error("Inactive archive campaign not found or incorrectly active!");
    }
    console.log("Test 4 - Inactive Campaign Boundary (/s/closed-archive-2025): PASSED (isActive: false)");

    // 5. Test Non-Existent Slug Identification
    const missing = await prisma.campaign.findUnique({ where: { slug: "non-existent-campaign-999" } });
    if (missing !== null) {
      throw new Error("Unregistered slug unexpectedly resolved!");
    }
    console.log("Test 5 - Non-Existent Slug Returns Null (404 Gate): PASSED");

    console.log(">>> ALL PHASE 3 MULTI-CAMPAIGN VERIFICATION GATES PASSED <<<");
  } catch (err) {
    console.error("Test failure:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase3Tests();
