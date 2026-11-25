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

/** Load saved profile from localStorage or sessionStorage (safe for SSR). */
export function loadStoredProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(PROFILE_STORAGE_KEY) ||
      window.sessionStorage.getItem(PROFILE_STORAGE_KEY);
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

/** Check if the user chose "Stay signed in" (persisted in localStorage). */
export function isStayingSignedIn(): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (window.sessionStorage.getItem(PROFILE_STORAGE_KEY)) return false;
    return true;
  } catch {
    return true;
  }
}

/** Persist profile (localStorage if staySignedIn, otherwise sessionStorage) and notify listeners. */
export function saveStoredProfile(profile: UserProfile, staySignedIn = true): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(profile);
    if (staySignedIn) {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, serialized);
      window.sessionStorage.removeItem(PROFILE_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(PROFILE_STORAGE_KEY, serialized);
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent("survey-profile-updated", { detail: profile }));
  } catch {
    // Ignore storage quota errors
  }
}

/** Log out the current respondent profile and clear cached quiz results/drafts on this device. */
export function clearStoredProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.sessionStorage.removeItem(PROFILE_STORAGE_KEY);

    const localKeysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith("survey_latest_result_v1_")) {
        localKeysToRemove.push(k);
      }
    }
    localKeysToRemove.forEach((k) => window.localStorage.removeItem(k));

    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const k = window.sessionStorage.key(i);
      if (k && k.startsWith("survey_draft_")) {
        sessionKeysToRemove.push(k);
      }
    }
    sessionKeysToRemove.forEach((k) => window.sessionStorage.removeItem(k));

    window.dispatchEvent(new CustomEvent("survey-profile-updated", { detail: null }));
  } catch {
    // Ignore storage errors
  }
}
