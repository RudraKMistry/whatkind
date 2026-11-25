"use client";

import React, { useState, useEffect } from "react";
import { User, CheckCircle2 } from "lucide-react";
import { UserProfile, isProfileComplete, loadStoredProfile } from "@/lib/profile";
import { ProfileModal } from "./ProfileModal";

export function ProfileHeaderButton() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setProfile(loadStoredProfile());

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<UserProfile>;
      if (custom.detail) {
        setProfile(custom.detail);
      } else {
        setProfile(loadStoredProfile());
      }
    };

    window.addEventListener("survey-profile-updated", handleUpdate);
    return () => window.removeEventListener("survey-profile-updated", handleUpdate);
  }, []);

  const ready = isProfileComplete(profile);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-warm-xs ${
          ready
            ? "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
            : "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100"
        }`}
      >
        {ready ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
        ) : (
          <User className="h-3.5 w-3.5 text-primary shrink-0" />
        )}
        <span>{ready ? `Profile: ${profile.fullName}` : "Set Up Your Profile"}</span>
      </button>

      <ProfileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSaved={(saved) => setProfile(saved)}
      />
    </>
  );
}
