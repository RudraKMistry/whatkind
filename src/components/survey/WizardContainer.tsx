"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SurveySchemaDefinition, PsychometricResult } from "@/types/survey";
import { validateStepAnswers } from "@/lib/schema";
import { calculatePsychometrics } from "@/lib/scoring";
import { QuestionRenderer } from "./QuestionRenderer";
import { ProgressBar } from "../ui/ProgressBar";
import { StepTermsConsentModal } from "./StepTermsConsentModal";
import { CompletionScreen } from "./CompletionScreen";
import { TraitReportScreen } from "./TraitReportScreen";
import { ProfileForm } from "../profile/ProfileModal";
import { UserProfile, isProfileComplete, loadStoredProfile } from "@/lib/profile";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, ShieldCheck, User } from "lucide-react";

interface WizardContainerProps {
  campaignSlug: string;
  schema: SurveySchemaDefinition;
  onComplete?: (answers: Record<string, any>, durationSec: number) => void;
  tcVersion?: string;
  tcContent?: string;
  tcChecksum?: string;
}

interface SubmissionReceipt {
  referenceId: string;
  consentedAt: string;
  tcChecksum: string;
}

export function WizardContainer({
  campaignSlug,
  schema,
  onComplete,
  tcVersion,
  tcContent,
  tcChecksum,
}: WizardContainerProps) {
  const steps = Array.isArray(schema?.steps) ? schema.steps : [];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(() => Date.now());
  const [isLoaded, setIsLoaded] = useState(false);

  // Consent Modal and Submission States
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionReceipt, setSubmissionReceipt] = useState<SubmissionReceipt | null>(null);
  const [psychometricResult, setPsychometricResult] = useState<PsychometricResult | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const storageKey = `survey_draft_${campaignSlug}`;

  // Restore profile from localStorage and listen for profile edits
  useEffect(() => {
    setProfile(loadStoredProfile());
    const handleProfileUpdate = (e: Event) => {
      const custom = e as CustomEvent<UserProfile>;
      setProfile(custom.detail || loadStoredProfile());
    };
    window.addEventListener("survey-profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("survey-profile-updated", handleProfileUpdate);
  }, []);

  // Restore draft from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setAnswers(parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {});
          if (typeof parsed.stepIndex === "number" && parsed.stepIndex >= 0 && parsed.stepIndex < steps.length) {
            setCurrentStepIndex(parsed.stepIndex);
          } else {
            setCurrentStepIndex(0);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load draft from sessionStorage:", e);
      setCurrentStepIndex(0);
      setAnswers({});
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, steps.length]);

  // Persist answers to sessionStorage whenever updated
  useEffect(() => {
    if (!isLoaded || submissionReceipt) return;
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ answers, stepIndex: currentStepIndex })
      );
    } catch (e) {
      console.warn("Failed to write draft to sessionStorage:", e);
    }
  }, [answers, currentStepIndex, isLoaded, storageKey, submissionReceipt]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = steps.length > 0 && currentStepIndex === steps.length - 1;

  const handleAnswerChange = useCallback((questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      if (prev[questionId]) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return prev;
    });
  }, []);

  const handleNext = () => {
    if (!currentStep) return;

    const validation = validateStepAnswers(currentStep, answers);
    if (!validation.isValid) {
      setErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});

    if (isLastStep) {
      // Open the mandatory Terms & Conditions Consent Modal
      setSubmitError(null);
      setIsConsentModalOpen(true);
    } else {
      setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetDraft = () => {
    if (window.confirm("Are you sure you want to clear your answers and start this quiz over?")) {
      sessionStorage.removeItem(storageKey);
      setAnswers({});
      setErrors({});
      setCurrentStepIndex(0);
      setSubmissionReceipt(null);
    }
  };

  const handleConfirmSubmit = async (consentData: {
    agreed: boolean;
    tcVersion: string;
    tcChecksum: string;
    timestamp: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const activeProfile = profile || loadStoredProfile();
    if (!isProfileComplete(activeProfile)) {
      setIsSubmitting(false);
      setIsConsentModalOpen(false);
      setSubmitError("Please complete your profile before submitting your quiz.");
      return;
    }

    try {
      const completionSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const calculatedPsychometrics = calculatePsychometrics(schema, answers);

      const payload = {
        campaignSlug,
        answers,
        completionSec,
        consent: consentData,
        profile: activeProfile,
        psychometrics: calculatedPsychometrics,
      };

      const response = await fetch(`/api/surveys/${campaignSlug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save your answers. Please check your internet connection and try again.");
      }

      // Success: Clear draft and set receipt
      sessionStorage.removeItem(storageKey);
      setIsConsentModalOpen(false);
      setPsychometricResult(calculatedPsychometrics);
      setSubmissionReceipt({
        referenceId: data.referenceId,
        consentedAt: data.consentedAt,
        tcChecksum: data.tcChecksum,
      });

      if (onComplete) {
        onComplete(answers, completionSec);
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
      setSubmitError(err.message || "Something went wrong while saving your answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 text-center text-charcoal-500 font-mono text-sm animate-pulse">
        Loading quiz...
      </div>
    );
  }

  // Render Trait Report or Receipt when submission is completed
  if (submissionReceipt) {
    if (psychometricResult) {
      return (
        <TraitReportScreen
          result={psychometricResult}
          schema={schema}
          campaignSlug={campaignSlug}
          referenceId={submissionReceipt.referenceId}
          consentedAt={submissionReceipt.consentedAt}
          tcChecksum={submissionReceipt.tcChecksum}
          onRetake={handleResetDraft}
        />
      );
    }

    return (
      <CompletionScreen
        referenceId={submissionReceipt.referenceId}
        consentedAt={submissionReceipt.consentedAt}
        tcChecksum={submissionReceipt.tcChecksum}
        campaignSlug={campaignSlug}
      />
    );
  }

  if (steps.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-12 text-center rounded-tactile border border-border bg-surface shadow-warm-md text-charcoal-700 space-y-4">
        <h3 className="text-lg font-semibold text-charcoal-900 font-sans">Quiz Not Ready Yet</h3>
        <p className="text-xs text-charcoal-700">This quiz does not have any questions yet.</p>
        <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  // Profile Gate: require profile before starting the quiz
  if (!isProfileComplete(profile)) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-lg space-y-6">
          <div className="flex items-start gap-3 border-b border-border pb-4">
            <div className="h-10 w-10 rounded-full bg-primary-soft border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                {schema.title}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal-900 font-sans">
                Create Your Profile First
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                Before starting this quiz, please enter your name and basic details. Your profile stays saved for all quizzes and helps the admin link your answers to you.
              </p>
            </div>
          </div>

          <ProfileForm
            initialProfile={profile}
            submitLabel="Save Profile & Start Quiz"
            onSaved={(saved) => {
              setProfile(saved);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Top Header & Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-primary">
            {schema.title}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDraft}
              className="inline-flex items-center gap-1 text-xs text-charcoal-500 hover:text-charcoal-900 transition-colors"
              title="Clear answers and start over"
            >
              <RotateCcw className="h-3 w-3" />
              Start Over
            </button>
          </div>
        </div>

        <ProgressBar
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          stepTitle={currentStep?.title}
        />
      </div>

      {/* Main Survey Step Container Card */}
      <div className="rounded-tactile border border-border bg-surface p-6 sm:p-10 shadow-warm-lg space-y-8 transition-all">
        {/* Step Header */}
        <div className="border-b border-border pb-6 space-y-1">
          <h2 className="text-2xl font-semibold text-charcoal-900 font-sans tracking-tight">
            {currentStep?.title}
          </h2>
          {currentStep?.description && (
            <p className="text-sm text-charcoal-700 leading-relaxed">
              {currentStep.description}
            </p>
          )}
        </div>

        {/* Question Nodes List */}
        <div className="space-y-8">
          {currentStep?.questions.map((question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(val) => handleAnswerChange(question.id, val)}
              error={errors[question.id]}
            />
          ))}
        </div>

        {/* Action Controls & Navigation */}
        <div className="border-t border-border pt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              isFirstStep
                ? "opacity-0 pointer-events-none"
                : "border-border bg-surface text-charcoal-900 hover:bg-canvas-subtle shadow-warm-sm"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-medium shadow-warm-md hover:shadow-warm-lg transition-all"
            >
              <span>{isLastStep ? "Review & Agree" : "Next"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Verification Footer Badge */}
      <div className="text-center text-xs text-charcoal-500 flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span>Your answers are protected by our privacy agreement and saved with a security record</span>
      </div>

      {/* Mandatory Terms & Conditions Consent Modal */}
      <StepTermsConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        isSubmitting={isSubmitting}
        error={submitError}
        tcVersion={tcVersion}
        tcContent={tcContent}
        tcChecksum={tcChecksum}
      />
    </div>
  );
}
