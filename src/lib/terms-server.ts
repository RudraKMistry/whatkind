import crypto from "crypto";

/**
 * Server-only cryptographic SHA-256 hash generator.
 * MUST NOT be imported into client components.
 */
export function computeTermsChecksum(termsContent: string): string {
  return crypto.createHash("sha256").update(termsContent, "utf8").digest("hex");
}
