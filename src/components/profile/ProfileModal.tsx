"use client";

import React, { useState, useEffect } from "react";
import { User, X, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import {
  UserProfile,
  GENDER_OPTIONS,
  generateProfileToken,
  loadStoredProfile,
  saveStoredProfile,
} from "@/lib/profile";

interface ProfileFormProps {
  initialProfile?: UserProfile | null;
  onSaved: (profile: UserProfile) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ProfileForm({
  initialProfile,
  onSaved,
  onCancel,
  submitLabel = "Save Profile",
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialProfile?.fullName || "");
  const [email, setEmail] = useState(initialProfile?.email || "");
  const [birthDate, setBirthDate] = useState(initialProfile?.birthDate || "");
  const [gender, setGender] = useState(initialProfile?.gender || "");
  const [notes, setNotes] = useState(initialProfile?.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.fullName || "");
      setEmail(initialProfile.email || "");
      setBirthDate(initialProfile.birthDate || "");
      setGender(initialProfile.gender || "");
      setNotes(initialProfile.notes || "");
    }
  }, [initialProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedBirthDate = birthDate.trim();
    const trimmedGender = gender.trim();
    const trimmedNotes = notes.trim();

    if (trimmedName.length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedBirthDate)) {
      setError("Please pick your birth date.");
      return;
    }
    if (!trimmedGender) {
      setError("Please select your gender.");
      return;
    }

    const nextProfile: UserProfile = {
      profileToken: initialProfile?.profileToken || generateProfileToken(),
      fullName: trimmedName,
      email: trimmedEmail,
      birthDate: trimmedBirthDate,
      gender: trimmedGender,
      notes: trimmedNotes,
    };

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextProfile),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not save your profile.");
      }

      saveStoredProfile(nextProfile);
      onSaved(nextProfile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not save your profile.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="profile-full-name" className="block text-xs font-semibold text-charcoal-900">
            Full Name <span className="text-terracotta">*</span>
          </label>
          <input
            id="profile-full-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-canvas-subtle text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-email" className="block text-xs font-semibold text-charcoal-900">
            Email Address <span className="text-terracotta">*</span>
          </label>
          <input
            id="profile-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. alex@example.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-canvas-subtle text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-birth-date" className="block text-xs font-semibold text-charcoal-900">
            Birth Date <span className="text-terracotta">*</span>
          </label>
          <input
            id="profile-birth-date"
            type="date"
            required
            max={new Date().toISOString().split("T")[0]}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-canvas-subtle text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-gender" className="block text-xs font-semibold text-charcoal-900">
            Gender <span className="text-terracotta">*</span>
          </label>
          <select
            id="profile-gender"
            required
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-canvas-subtle text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Choose one --</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="profile-notes" className="block text-xs font-semibold text-charcoal-900">
          Other Details <span className="text-charcoal-500 font-normal">(Optional)</span>
        </label>
        <textarea
          id="profile-notes"
          rows={3}
          maxLength={1000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any extra details about yourself you want to share with the quiz admin (job, background, hobbies, etc.)..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-canvas-subtle text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-terracotta-soft border border-terracotta/30 flex items-center gap-2 text-xs text-terracotta font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-lg bg-canvas-subtle border border-border p-3 flex items-start gap-2 text-[11px] text-charcoal-600">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span>
          Your profile details and every answer you pick are saved privately for the site admin only. Other visitors cannot see your profile.
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-canvas-subtle text-xs sm:text-sm font-medium text-charcoal-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs sm:text-sm font-semibold shadow-warm-md transition-all disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>{submitLabel}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (profile: UserProfile) => void;
}

export function ProfileModal({ isOpen, onClose, onSaved }: ProfileModalProps) {
  const [stored, setStored] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStored(loadStoredProfile());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-xl space-y-5 text-charcoal-900 my-8">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-soft border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal-900 font-sans">
                Your Profile
              </h2>
              <p className="text-xs text-charcoal-600">
                Save your details once so all your quiz answers stay linked to you.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-canvas-subtle"
            aria-label="Close profile dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ProfileForm
          initialProfile={stored}
          onCancel={onClose}
          onSaved={(saved) => {
            onSaved?.(saved);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
