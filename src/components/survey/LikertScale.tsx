"use client";

import React from "react";
import { Check } from "lucide-react";

interface LikertScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
  points?: 5 | 7;
  leftLabel?: string;
  rightLabel?: string;
}

export function LikertScale({
  value,
  onChange,
  points = 5,
  leftLabel = "Disagree",
  rightLabel = "Agree",
}: LikertScaleProps) {
  // Config for 5-point IDRlabs-style scale
  const fivePointConfig = [
    {
      score: 1,
      label: "Strongly Disagree",
      shortLabel: "Disagree",
      size: "h-11 w-11 sm:h-12 sm:w-12",
      activeBg: "bg-terracotta border-terracotta text-white shadow-warm-md scale-105",
      hoverBorder: "hover:border-terracotta/80 hover:bg-terracotta/10",
      accent: "text-terracotta",
    },
    {
      score: 2,
      label: "Disagree",
      shortLabel: "Somewhat Disagree",
      size: "h-9 w-9 sm:h-10 sm:w-10",
      activeBg: "bg-amber-600 border-amber-600 text-white shadow-warm-sm scale-105",
      hoverBorder: "hover:border-amber-600/80 hover:bg-amber-600/10",
      accent: "text-amber-600",
    },
    {
      score: 3,
      label: "Not Sure",
      shortLabel: "Not Sure",
      size: "h-8 w-8 sm:h-9 sm:w-9",
      activeBg: "bg-charcoal-700 border-charcoal-700 text-white shadow-warm-sm scale-105",
      hoverBorder: "hover:border-charcoal-500/80 hover:bg-charcoal-500/10",
      accent: "text-charcoal-700",
    },
    {
      score: 4,
      label: "Agree",
      shortLabel: "Somewhat Agree",
      size: "h-9 w-9 sm:h-10 sm:w-10",
      activeBg: "bg-emerald-600 border-emerald-600 text-white shadow-warm-sm scale-105",
      hoverBorder: "hover:border-emerald-600/80 hover:bg-emerald-600/10",
      accent: "text-emerald-600",
    },
    {
      score: 5,
      label: "Strongly Agree",
      shortLabel: "Agree",
      size: "h-11 w-11 sm:h-12 sm:w-12",
      activeBg: "bg-success border-success text-white shadow-warm-md scale-105",
      hoverBorder: "hover:border-success/80 hover:bg-success/10",
      accent: "text-success",
    },
  ];

  return (
    <div className="w-full py-3 space-y-3">
      {/* Visual Circle Options */}
      <div className="flex items-center justify-between gap-1 sm:gap-4 max-w-lg mx-auto px-2">
        {fivePointConfig.map((item) => {
          const isSelected = value === item.score;
          return (
            <button
              type="button"
              key={item.score}
              onClick={() => onChange(item.score)}
              title={item.label}
              className={`rounded-full border-2 flex items-center justify-center font-mono font-bold transition-all duration-150 shrink-0 ${
                item.size
              } ${
                isSelected
                  ? item.activeBg
                  : `border-border bg-surface text-charcoal-700 ${item.hoverBorder} hover:-translate-y-0.5`
              }`}
            >
              {isSelected ? (
                <Check className="h-4 w-4 stroke-[3]" />
              ) : (
                <span className="text-xs opacity-75">{item.score}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between items-center text-xs font-medium text-charcoal-700 max-w-lg mx-auto px-3">
        <span className="text-terracotta flex items-center gap-1 font-semibold">
          ← {leftLabel}
        </span>
        <span className="text-charcoal-500 text-[11px] font-mono hidden sm:inline">
          Not Sure
        </span>
        <span className="text-success flex items-center gap-1 font-semibold">
          {rightLabel} →
        </span>
      </div>
    </div>
  );
}
