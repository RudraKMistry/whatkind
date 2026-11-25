"use client";

import React, { useState, useEffect } from "react";
import { User, CheckCircle2, LogOut } from "lucide-react";
import {
  UserProfile,
  isProfileComplete,
  loadStoredProfile,
  clearStoredProfile,
} from "@/lib/profile";
import { ProfileModal } from "./ProfileModal";

export function ProfileHeaderButton() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setProfile(loadStoredProfile());

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<UserProfile | null>;
      setProfile(custom.detail === null ? null : custom.detail || loadStoredProfile());
    };

    window.addEventListener("survey-profile-updated", handleUpdate);
    return () => window.removeEventListener("survey-profile-updated", handleUpdate);
  }, []);

  const ready = isProfileComplete(profile);

  return (
    <div className="inline-flex items-center gap-2">
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

      {ready && (
        <button
          type="button"
          onClick={() => clearStoredProfile()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-terracotta-soft hover:border-terracotta/30 text-xs font-medium text-charcoal-700 hover:text-terracotta transition-all shadow-warm-xs"
          title="Log out of your profile on this device"
        >
          <LogOut className="h-3 w-3" />
          <span>Log Out</span>
        </button>
      )}

      <ProfileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSaved={(saved) => setProfile(saved)}
      />
    </div>
  );
}
