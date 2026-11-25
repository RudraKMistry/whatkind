import { z } from "zod";

console.log("=== RUNNING PHASE 1 VALIDATION & COMPONENT LOGIC VERIFICATION ===");

// 1. Zod Validation Contracts
const ConsentSubmissionSchema = z.object({
  agreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms & Conditions and Privacy Policy to proceed." }),
  }),
  tcVersion: z.string().min(1, "Terms and conditions version is required"),
  tcChecksum: z.string().min(8, "Valid terms checksum is required"),
  timestamp: z.string().datetime({ message: "Invalid ISO timestamp format" }),
});

const SurveySubmissionSchema = z.object({
  campaignSlug: z.string().min(1, "Campaign slug is required"),
  answers: z.record(z.union([z.string(), z.array(z.string()), z.number()])),
  completionSec: z.number().int().min(0, "Completion duration must be a non-negative integer"),
  consent: ConsentSubmissionSchema,
});

// Test 1: Valid submission payload
const validPayload = {
  campaignSlug: "demo-demographics",
  answers: {
    full_name: "Marcus Chen",
    email_address: "marcus.chen@example.org",
    age_bracket: "25-34",
    industry_sector: "tech",
    active_tooling: ["cloud_collab", "dev_terminal"],
    consent_importance: 9,
  },
  completionSec: 84,
  consent: {
    agreed: true,
    tcVersion: "1.0.0",
    tcChecksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestamp: "2026-11-15T15:45:00.000Z",
  },
};

const validParsed = SurveySubmissionSchema.safeParse(validPayload);
console.log("Test 1 - Valid payload schema check:", validParsed.success ? "PASSED" : "FAILED");

// Test 2: Incomplete consent flag (agreed: false) must be rejected
const invalidConsentPayload = {
  ...validPayload,
  consent: {
    ...validPayload.consent,
    agreed: false,
  },
};
const invalidParsed = SurveySubmissionSchema.safeParse(invalidConsentPayload);
console.log("Test 2 - Rejected unconsented submission:", !invalidParsed.success ? "PASSED" : "FAILED");

// Test 3: Missing required answer field
const missingFieldPayload = {
  ...validPayload,
  campaignSlug: "",
};
const missingParsed = SurveySubmissionSchema.safeParse(missingFieldPayload);
console.log("Test 3 - Rejected empty campaign slug:", !missingParsed.success ? "PASSED" : "FAILED");

if (validParsed.success && !invalidParsed.success && !missingParsed.success) {
  console.log(">>> ALL CORE SCHEMA & VALIDATION GATES VERIFIED SUCCESSFULLY <<<");
  process.exit(0);
} else {
  console.error(">>> VALIDATION VERIFICATION FAILED <<<");
  process.exit(1);
}
