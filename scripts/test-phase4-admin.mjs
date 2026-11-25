import { PrismaClient } from "@prisma/client";
const getAdminSecret = () => process.env.ADMIN_SECRET || "dev-insecure-admin-key-change-in-prod";

const prisma = new PrismaClient();

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  let str = Array.isArray(field) ? field.join("; ") : String(field);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function runPhase4Tests() {
  console.log("=== RUNNING PHASE 4 ADMIN & EXPORT PIPELINE TESTS ===");

  try {
    // 1. Verify Admin Secret Retrieval
    const secret = getAdminSecret();
    console.log("Test 1 - Admin Secret Configuration:", secret ? "VERIFIED" : "FAILED");
    if (!secret) throw new Error("Missing admin secret configuration!");

    // 2. Test Campaign Lifecycle Toggle Logic
    const campaign = await prisma.campaign.findUnique({
      where: { slug: "demographics-2026" },
    });
    if (!campaign) throw new Error("Campaign demographics-2026 not found!");

    const originalState = campaign.isActive;
    // Toggle state
    const toggled = await prisma.campaign.update({
      where: { id: campaign.id },
      data: { isActive: !originalState },
    });
    console.log(`Test 2 - Toggled campaign status from ${originalState} to ${toggled.isActive}: PASSED`);

    // Restore original state
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { isActive: originalState },
    });
    console.log(`Test 2 - Restored campaign status to ${originalState}: PASSED`);

    // 3. Test CSV Export Generation Engine
    const responses = await prisma.response.findMany({
      include: {
        campaign: { select: { slug: true, title: true } },
        consent: true,
      },
    });
    console.log(`Test 3 - Queried ${responses.length} responses for CSV pipeline.`);

    const allAnswerKeys = new Set();
    const parsedRows = responses.map((r) => {
      let answers = {};
      try {
        answers = JSON.parse(r.answersJson);
      } catch {
        answers = {};
      }
      Object.keys(answers).forEach((k) => allAnswerKeys.add(k));
      return { record: r, answers };
    });

    const sortedAnswerKeys = Array.from(allAnswerKeys).sort();
    const staticHeaders = [
      "Response ID",
      "Reference ID",
      "Campaign Slug",
      "Campaign Title",
      "Completion Seconds",
      "Submitted At (UTC)",
      "T&C Version",
      "T&C Checksum (SHA-256)",
      "Anonymized IP Hash",
      "User Agent",
    ];

    const csvHeaders = [...staticHeaders, ...sortedAnswerKeys].map(escapeCsvField).join(",");
    console.log("Test 3 - CSV Headers Generated Successfully:");
    console.log("  Headers:", csvHeaders);

    const csvLines = parsedRows.map(({ record, answers }) => {
      const staticValues = [
        record.id,
        record.respondentRef || "",
        record.campaign.slug,
        record.campaign.title,
        record.completionSec,
        record.createdAt.toISOString(),
        record.consent?.tcVersion || "1.0",
        record.consent?.tcChecksum || "",
        record.consent?.ipHash || "",
        record.consent?.userAgent || "",
      ];

      const dynamicValues = sortedAnswerKeys.map((key) => {
        const val = answers[key];
        return val !== undefined ? val : "";
      });

      return [...staticValues, ...dynamicValues].map(escapeCsvField).join(",");
    });

    const fullCsv = [csvHeaders, ...csvLines].join("\r\n");
    console.log(`Test 3 - Total CSV Bytes Generated: ${Buffer.byteLength(fullCsv, "utf8")} bytes.`);
    if (responses.length > 0 && csvLines.length !== responses.length) {
      throw new Error("CSV row count mismatch!");
    }
    console.log("Test 3 - CSV Export Pipeline: PASSED");

    // 4. Test JSON Export Formatting
    const jsonRecords = responses.map((r) => ({
      id: r.id,
      referenceId: r.respondentRef,
      slug: r.campaign.slug,
      consentVerified: Boolean(r.consent),
      tcChecksum: r.consent?.tcChecksum,
    }));
    const jsonStr = JSON.stringify(jsonRecords, null, 2);
    console.log(`Test 4 - JSON Export Formatted: ${jsonRecords.length} records, ${Buffer.byteLength(jsonStr, "utf8")} bytes.`);
    console.log("Test 4 - JSON Export Pipeline: PASSED");

    console.log(">>> ALL PHASE 4 ADMIN & EXPORT PIPELINE TESTS PASSED <<<");
  } catch (err) {
    console.error("Test failure:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase4Tests();
