"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Copy, Check, ArrowRight, FileText } from "lucide-react";

interface CompletionScreenProps {
  referenceId: string;
  consentedAt: string;
  tcChecksum: string;
  campaignSlug: string;
}

export function CompletionScreen({
  referenceId,
  consentedAt,
  tcChecksum,
  campaignSlug,
}: CompletionScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Celebration & Confirmation Card */}
      <div className="rounded-tactile border border-border bg-surface p-8 sm:p-12 shadow-warm-xl text-center space-y-8">
        <div className="mx-auto h-16 w-16 rounded-full bg-success-soft border border-success/30 flex items-center justify-center text-success shadow-warm-sm">
          <CheckCircle2 className="h-9 w-9 stroke-[2.2]" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas-subtle border border-border text-xs font-medium text-charcoal-700">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Privacy Agreement Saved
          </div>
          <h2 className="text-3xl font-semibold text-charcoal-900 tracking-tight font-sans">
            Your Answers Were Saved
          </h2>
          <p className="max-w-lg mx-auto text-sm text-charcoal-700 leading-relaxed">
            Your answers have been checked, safely locked, and saved in our secure database.
          </p>
        </div>

        {/* Verification Metadata Box */}
        <div className="rounded-xl border border-border bg-canvas-subtle p-6 text-left space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="block text-[11px] font-mono uppercase text-charcoal-500 font-semibold tracking-wider">
                Your Receipt Code
              </span>
              <span className="font-mono text-lg font-bold text-charcoal-900 tracking-wider">
                {referenceId}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-canvas text-xs font-medium text-charcoal-700 shadow-warm-sm transition-colors"
              title="Copy Receipt Code"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" />
                  <span className="text-success font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-charcoal-500 font-mono">Saved Time (UTC):</span>
              <span className="font-mono font-medium text-charcoal-900 break-all">
                {new Date(consentedAt).toUTCString()}
              </span>
            </div>
            <div>
              <span className="block text-charcoal-500 font-mono">Quiz Link:</span>
              <span className="font-mono font-medium text-charcoal-900">
                /{campaignSlug}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-charcoal-500 font-mono">Privacy Rules Security Code (SHA-256):</span>
              <span className="font-mono text-[11px] text-primary font-medium break-all">
                {tcChecksum}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-medium shadow-warm-md transition-colors"
          >
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`/s/${campaignSlug}`}
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-surface hover:bg-canvas-subtle text-charcoal-900 text-sm font-medium shadow-warm-sm transition-colors"
          >
            <FileText className="h-4 w-4" />
            Take This Quiz Again
          </Link>
        </div>
      </div>
    </div>
  );
}
