"use client";

import React from "react";
import { SurveyQuestion } from "@/types/survey";
import { AlertCircle, Check, HelpCircle, Brain } from "lucide-react";
import { LikertScale } from "./LikertScale";

interface QuestionRendererProps {
  question: SurveyQuestion;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  const hasError = Boolean(error);

  return (
    <div className="space-y-3">
      {/* Question Header */}
      <div>
        <label className="block text-lg font-medium text-charcoal-900 leading-snug">
          {question.title}
          {question.required && (
            <span className="text-terracotta ml-1 font-bold" title="Required">*</span>
          )}
        </label>
        {question.description && (
          <p className="mt-1 text-sm text-charcoal-700 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Input Field Dispatcher */}
      <div className="pt-1">
        {/* TEXT INPUT */}
        {question.type === "text" && (
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Type your answer..."}
            className={`w-full px-4 py-3 rounded-lg border bg-surface text-charcoal-900 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-warm-sm ${
              hasError ? "border-terracotta ring-1 ring-terracotta" : "border-border"
            }`}
          />
        )}

        {/* TEXTAREA */}
        {question.type === "textarea" && (
          <textarea
            rows={4}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Write your answer here..."}
            className={`w-full px-4 py-3 rounded-lg border bg-surface text-charcoal-900 placeholder:text-charcoal-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-warm-sm resize-y ${
              hasError ? "border-terracotta ring-1 ring-terracotta" : "border-border"
            }`}
          />
        )}

        {/* DEMOGRAPHIC SELECT */}
        {question.type === "demographic_select" && (
          <div className="relative">
            <select
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full appearance-none px-4 py-3 rounded-lg border bg-surface text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-warm-sm cursor-pointer pr-10 ${
                hasError ? "border-terracotta ring-1 ring-terracotta" : "border-border"
              }`}
            >
              <option value="" disabled>
                {question.placeholder || "— Choose an option —"}
              </option>
              {question.options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-charcoal-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        )}

        {/* SINGLE CHOICE (TACTILE RADIO CARDS) */}
        {question.type === "single_choice" && (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option) => {
              const isSelected = value === option.id;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => onChange(option.id)}
                  className={`text-left p-4 rounded-tactile border transition-all duration-150 flex items-start justify-between gap-3 shadow-warm-sm ${
                    isSelected
                      ? "border-primary bg-canvas-subtle ring-1 ring-primary"
                      : "border-border bg-surface hover:border-primary/60 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="block font-medium text-charcoal-900 text-base">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="block text-xs text-charcoal-700 leading-relaxed">
                        {option.description}
                      </span>
                    )}
                  </div>
                  <div
                    className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* MULTI CHOICE (TACTILE PILLS / CARDS) */}
        {question.type === "multi_choice" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options?.map((option) => {
              const selectedList: string[] = Array.isArray(value) ? value : [];
              const isSelected = selectedList.includes(option.id);

              const handleToggle = () => {
                if (isSelected) {
                  onChange(selectedList.filter((item) => item !== option.id));
                } else {
                  onChange([...selectedList, option.id]);
                }
              };

              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={handleToggle}
                  className={`text-left p-3.5 rounded-tactile border transition-all duration-150 flex items-center justify-between gap-3 shadow-warm-sm ${
                    isSelected
                      ? "border-primary bg-canvas-subtle ring-1 ring-primary"
                      : "border-border bg-surface hover:border-primary/60 hover:-translate-y-0.5"
                  }`}
                >
                  <span className="text-sm font-medium text-charcoal-900">
                    {option.label}
                  </span>
                  <div
                    className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* RATING SCALE (1 - 10 TACTILE BUTTONS) */}
        {question.type === "rating_scale" && (
          <div className="space-y-3">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from(
                { length: (question.maxScale ?? 10) - (question.minScale ?? 1) + 1 },
                (_, i) => (question.minScale ?? 1) + i
              ).map((num) => {
                const isSelected = value === num;
                return (
                  <button
                    type="button"
                    key={num}
                    onClick={() => onChange(num)}
                    className={`h-12 w-full rounded-lg border font-mono text-sm font-medium transition-all shadow-warm-sm flex items-center justify-center ${
                      isSelected
                        ? "border-primary bg-primary text-white scale-105 shadow-warm-md"
                        : "border-border bg-surface text-charcoal-900 hover:border-primary hover:-translate-y-0.5"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            {(question.minScaleLabel || question.maxScaleLabel) && (
              <div className="flex justify-between text-xs text-charcoal-500 font-medium px-1">
                <span>{question.minScaleLabel}</span>
                <span>{question.maxScaleLabel}</span>
              </div>
            )}
          </div>
        )}

        {/* LIKERT SCALE (5 or 7 POINT GRADIENT CIRCLES) */}
        {(question.type === "likert_5" || question.type === "likert_7") && (
          <div className="pt-2">
            <LikertScale
              value={typeof value === "number" ? value : undefined}
              onChange={(val) => onChange(val)}
              points={question.type === "likert_7" ? 7 : 5}
              leftLabel={question.minScaleLabel || "Disagree"}
              rightLabel={question.maxScaleLabel || "Agree"}
            />
          </div>
        )}

        {/* COGNITIVE PUZZLE (PATTERN MATRIX & MULTI-CHOICE SYMBOLS) */}
        {question.type === "cognitive_puzzle" && (
          <div className="space-y-4 pt-1">
            {question.puzzleClue && (
              <div className="rounded-xl border border-border bg-canvas-subtle p-4 sm:p-5 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal-500 font-semibold">
                    Pattern / Logic Clue
                  </span>
                </div>
                <div className="font-mono text-sm sm:text-base text-charcoal-900 bg-surface border border-border rounded-lg p-4 leading-relaxed whitespace-pre-wrap select-none text-center sm:text-left font-semibold shadow-warm-sm">
                  {question.puzzleClue}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options?.map((option, idx) => {
                const isSelected = value === option.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D...
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => onChange(option.id)}
                    className={`text-left p-4 rounded-tactile border transition-all duration-150 flex items-center justify-between gap-3 shadow-warm-sm ${
                      isSelected
                        ? "border-primary bg-canvas-subtle ring-2 ring-primary/40 shadow-warm-md"
                        : "border-border bg-surface hover:border-primary/60 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-7 w-7 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-canvas-subtle text-charcoal-700 border-border"
                        }`}
                      >
                        {letter}
                      </span>
                      <div>
                        <span className="block font-medium text-charcoal-900 text-sm sm:text-base">
                          {option.symbol ? `${option.symbol} ` : ""}
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="block text-xs text-charcoal-700 mt-0.5">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="flex items-center gap-2 text-xs font-medium text-terracotta bg-terracotta-soft/50 border border-terracotta/20 px-3 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
