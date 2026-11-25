import type { PsychometricResult } from "@/types/survey";

export interface SavedLatestResult {
  result: PsychometricResult | null;
  referenceId: string;
  consentedAt: string;
  tcChecksum: string;
  savedAt: string;
}

const STORAGE_PREFIX = "survey_latest_result_v1_";

export function saveLatestResult(
  campaignSlug: string,
  payload: Omit<SavedLatestResult, "savedAt">
): void {
  if (typeof window === "undefined") return;
  try {
    const entry: SavedLatestResult = {
      ...payload,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(`${STORAGE_PREFIX}${campaignSlug}`, JSON.stringify(entry));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadLatestResult(campaignSlug: string): SavedLatestResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${campaignSlug}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.referenceId) {
      return parsed as SavedLatestResult;
    }
  } catch {
    return null;
  }
  return null;
}
