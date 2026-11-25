export interface UserProfile {
  profileToken: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: string;
  notes: string;
}

export const PROFILE_STORAGE_KEY = "survey_respondent_profile_v1";

export const GENDER_OPTIONS = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
  "Other",
] as const;

/** Generate a random client profile token for grouping tests under one person. */
export function generateProfileToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "prof_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Check whether all required identity fields are filled in. */
export function isProfileComplete(profile: Partial<UserProfile> | null | undefined): profile is UserProfile {
  if (!profile) return false;
  return (
    typeof profile.profileToken === "string" &&
    profile.profileToken.trim().length >= 8 &&
    typeof profile.fullName === "string" &&
    profile.fullName.trim().length >= 2 &&
    typeof profile.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim()) &&
    typeof profile.birthDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(profile.birthDate.trim()) &&
    typeof profile.gender === "string" &&
    profile.gender.trim().length >= 1
  );
}

/** Load saved profile from browser localStorage (safe for SSR). */
export function loadStoredProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        profileToken: typeof parsed.profileToken === "string" ? parsed.profileToken : generateProfileToken(),
        fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
        email: typeof parsed.email === "string" ? parsed.email : "",
        birthDate: typeof parsed.birthDate === "string" ? parsed.birthDate : "",
        gender: typeof parsed.gender === "string" ? parsed.gender : "",
        notes: typeof parsed.notes === "string" ? parsed.notes : "",
      };
    }
  } catch {
    return null;
  }
  return null;
}

/** Persist profile to browser localStorage and notify listeners in the same tab. */
export function saveStoredProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("survey-profile-updated", { detail: profile }));
  } catch {
    // Ignore storage quota errors
  }
}
