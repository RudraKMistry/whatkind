"use client";

import React, { useEffect } from "react";
import { RotateCcw, AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "warning" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Keep Going",
  tone = "warning",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = tone === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md rounded-tactile border border-border bg-surface p-6 sm:p-7 shadow-warm-xl space-y-5 text-charcoal-900 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div
              className={`h-10 w-10 rounded-full border flex items-center justify-center shrink-0 shadow-warm-xs ${
                isDanger
                  ? "bg-terracotta-soft border-terracotta/30 text-terracotta"
                  : "bg-primary-soft border-primary/30 text-primary"
              }`}
            >
              {isDanger ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <RotateCcw className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-1">
              <h3
                id="confirm-dialog-title"
                className="text-lg font-bold text-charcoal-900 font-sans leading-snug"
              >
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-900 hover:bg-canvas-subtle transition-colors"
            aria-label="Close confirmation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="pt-2 border-t border-border/70 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-border bg-canvas-subtle hover:bg-surface text-charcoal-800 text-xs sm:text-sm font-medium transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-white text-xs sm:text-sm font-semibold shadow-warm-sm transition-all ${
              isDanger
                ? "bg-terracotta hover:opacity-90"
                : "bg-primary hover:bg-primary-hover active:bg-primary-active"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
