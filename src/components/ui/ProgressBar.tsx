import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
}

export function ProgressBar({ currentStep, totalSteps, stepTitle }: ProgressBarProps) {
  const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-charcoal-700">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-canvas-subtle border border-border text-charcoal-900 font-mono text-[11px]">
            Step {currentStep + 1} of {totalSteps}
          </span>
          {stepTitle && (
            <span className="text-charcoal-900 font-medium truncate max-w-xs sm:max-w-md">
              {stepTitle}
            </span>
          )}
        </div>
        <span className="font-mono text-primary font-semibold">{percentage}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-canvas-subtle border border-border overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
