"use client";

import React, { useState } from "react";
import { ShieldCheck, Check, AlertCircle, Loader2, X, Lock } from "lucide-react";
import { DEFAULT_TC_VERSION, DEFAULT_TERMS_AND_CONDITIONS, CANONICAL_TC_CHECKSUM } from "@/lib/terms";

interface StepTermsConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: (consentData: {
    agreed: boolean;
    tcVersion: string;
    tcChecksum: string;
    timestamp: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
  tcVersion?: string;
  tcContent?: string;
  tcChecksum?: string;
}

const PLAIN_FALLBACK_TERMS = `
# Terms & Privacy Rules

## 1. Taking Part Is Your Choice
Taking this quiz is completely up to you. You choose to type and share the answers you enter on this page.

## 2. How We Use Your Answers
We only use your answers to calculate your quiz results and study overall group trends. We never track you in the background, and we never sell your answers to ad companies.

## 3. Saving Your Agreement
When you agree, we save the time, a security code for these rules, and a masked version of your connection info so we have proof that you said yes.

## 4. Keeping Your Data Safe
Your answers are stored safely in a locked database that only approved admins can view.
`.trim();

/** Render simple markdown-like bold segments (**text**) inline. */
function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-charcoal-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/** Render plain text or simple markdown terms cleanly inside the consent scroll box. */
function renderTermsContent(content: string): React.ReactNode {
  const lines = content.split(/\r?\n/);
  return lines.map((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) return null;

    if (line.startsWith("# ")) {
      return (
        <h4 key={idx} className="font-bold text-charcoal-900 text-sm border-b border-border pb-1.5">
          {renderInlineBold(line.slice(2))}
        </h4>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h5 key={idx} className="font-bold text-charcoal-900 text-xs pt-2 uppercase tracking-wide">
          {renderInlineBold(line.slice(3))}
        </h5>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h6 key={idx} className="font-semibold text-charcoal-900 text-xs pt-1">
          {renderInlineBold(line.slice(4))}
        </h6>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <p key={idx} className="pl-3 flex items-start gap-1.5">
          <span className="text-primary font-bold">•</span>
          <span>{renderInlineBold(line.slice(2))}</span>
        </p>
      );
    }
    if (/^\d+\.\d+(\.\d+)?\s/.test(line) || /^\([a-z0-9]+\)\s/i.test(line)) {
      return (
        <p key={idx} className="pl-2.5 text-charcoal-700 leading-relaxed">
          {renderInlineBold(line)}
        </p>
      );
    }
    return <p key={idx}>{renderInlineBold(line)}</p>;
  });
}

export function StepTermsConsentModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting,
  error,
  tcVersion = DEFAULT_TC_VERSION,
  tcContent = DEFAULT_TERMS_AND_CONDITIONS,
  tcChecksum = CANONICAL_TC_CHECKSUM,
}: StepTermsConsentModalProps) {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const displayTerms =
    tcContent && tcContent.trim().length > 0 ? tcContent : PLAIN_FALLBACK_TERMS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || isSubmitting) return;

    await onConfirmSubmit({
      agreed: true,
      tcVersion: tcVersion,
      tcChecksum: tcChecksum || CANONICAL_TC_CHECKSUM,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-xl space-y-6 text-charcoal-900 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-charcoal-900 tracking-tight font-sans">
                Privacy Rules & Agreement
              </h3>
              <p className="text-xs text-charcoal-500 font-mono flex items-center gap-1.5 mt-0.5">
                <Lock className="h-3 w-3 text-primary" />
                Version {tcVersion} • Security Code Verified
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-md text-charcoal-500 hover:text-charcoal-900 hover:bg-canvas-subtle transition-colors disabled:opacity-50"
            title="Close window"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informational Callout */}
        <div className="p-3.5 rounded-lg bg-canvas-subtle border border-border text-xs text-charcoal-700 leading-relaxed">
          <span className="font-semibold text-charcoal-900">Please Read Before Finishing:</span> Your answers are saved only after you read and agree to our privacy rules below.
        </div>

        {/* Scrollable Terms & Conditions Box */}
        <div className="rounded-lg border border-border bg-canvas p-4 max-h-80 sm:max-h-96 overflow-y-auto text-xs text-charcoal-700 space-y-2.5 leading-relaxed font-sans shadow-inner">
          {renderTermsContent(displayTerms)}
        </div>

        {/* Checkbox Gate & Error Display */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-start gap-3.5 cursor-pointer select-none group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={isSubmitting}
                  className="sr-only"
                />
                <div
                  className={`h-5 w-5 rounded border transition-colors flex items-center justify-center ${
                    agreed
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white group-hover:border-primary/60"
                  }`}
                >
                  {agreed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
              </div>
              <span className="text-xs sm:text-sm text-charcoal-900 leading-snug">
                I have read and agree to the{" "}
                <span className="font-medium text-primary underline underline-offset-2">
                  Terms & Privacy Rules
                </span>
                . I freely choose to share my answers and let you save and score them.
              </span>
            </label>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-terracotta-soft text-terracotta text-xs font-medium border border-terracotta/20 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg border border-border text-charcoal-700 hover:text-charcoal-900 hover:bg-canvas-subtle text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
            >
              Back to Quiz
            </button>
            <button
              type="submit"
              disabled={!agreed || isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs sm:text-sm font-medium shadow-warm-md hover:shadow-warm-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving & Sending...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Agree & See My Results
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
