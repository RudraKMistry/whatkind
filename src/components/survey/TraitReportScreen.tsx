"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PsychometricResult, SurveySchemaDefinition } from "@/types/survey";
import { IqBellCurve } from "./IqBellCurve";
import { CognitiveRadarChart } from "./CognitiveRadarChart";
import { OceanPentagramChart } from "./OceanPentagramChart";
import { MoralCartesianGrid } from "./MoralCartesianGrid";
import { DarkTriadDeltaChart } from "./DarkTriadDeltaChart";
import { HarryPotterMatchChart } from "./HarryPotterMatchChart";
import {
  Sparkles,
  Share2,
  RotateCcw,
  Compass,
  Check,
  Brain,
  TrendingUp,
} from "lucide-react";

interface TraitReportScreenProps {
  result: PsychometricResult;
  schema: SurveySchemaDefinition;
  campaignSlug: string;
  referenceId: string;
  consentedAt: string;
  tcChecksum: string;
  onRetake?: () => void;
}

export function TraitReportScreen({
  result,
  schema,
  campaignSlug,
  onRetake,
}: TraitReportScreenProps) {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    const text = `I just got my results for "${schema.title}"!\nMy Result Style: ${result.archetypeTitle}\nTake the test yourself at: ${window.location.origin}/s/${campaignSlug}`;
    if (navigator.share) {
      navigator.share({
        title: `${result.archetypeTitle} - ${schema.title}`,
        text: text,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Archetype Hero Banner */}
      <div className="rounded-tactile border border-border bg-surface p-6 sm:p-10 shadow-warm-xl text-center space-y-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-canvas-subtle border border-border text-xs font-semibold text-charcoal-700 shadow-warm-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Your Results Are Ready</span>
            <span className="text-charcoal-400">•</span>
            <span className="font-mono text-primary">{schema.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight font-sans">
            {result.archetypeTitle}
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-charcoal-700 leading-relaxed font-serif italic">
            "{result.archetypeSubtitle}"
          </p>

          {/* Primary Metric Pill (e.g. IQ, Composite, Alignment) */}
          {result.primaryMetricLabel && result.primaryMetricValue && (
            <div className="pt-2">
              <div className="inline-flex flex-col items-center px-6 py-3 rounded-2xl bg-canvas-subtle border border-border shadow-warm-sm">
                <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal-500 font-semibold">
                  {result.primaryMetricLabel}
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-primary">
                  {result.primaryMetricValue}
                </span>
                {result.confidenceInterval && (
                  <span className="text-[11px] font-mono text-charcoal-500 mt-1">
                    Likely range: ±{result.sem || 4} pts ({result.confidenceInterval})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TRAIT BREAKDOWN */}
      <div className="space-y-6">
          {/* 1. COGNITIVE IQ ASSESSMENT: Gaussian Bell Curve + 8-Facet Biometric Spline Radar */}
          {(result.testType === "cognitive_iq" || result.iqScore !== undefined) && (
            <>
              <IqBellCurve
                iqScore={result.iqScore ?? 100}
                sem={result.sem ?? 4}
                percentile={result.percentile ?? 50}
                classification={result.classification}
              />

              <CognitiveRadarChart
                gf={result.traits.find((t) => t.key.toLowerCase().includes("gf") || t.key.toLowerCase().includes("fluid"))?.score ?? 90}
                gv={result.traits.find((t) => t.key.toLowerCase().includes("gv") || t.key.toLowerCase().includes("spatial"))?.score ?? 90}
                gq={result.traits.find((t) => t.key.toLowerCase().includes("gq") || t.key.toLowerCase().includes("quant"))?.score ?? 80}
                gc={result.traits.find((t) => t.key.toLowerCase().includes("gc") || t.key.toLowerCase().includes("deduct"))?.score ?? 80}
              />
            </>
          )}

          {/* 2. BIG FIVE (OCEAN) PERSONALITY: 5-Factor Harmonic Pentagram */}
          {(result.testType === "big_five" || campaignSlug.includes("personality") || campaignSlug.includes("ocean")) && (
            <OceanPentagramChart traits={result.traits} />
          )}

          {/* 3. MORAL ALIGNMENT: 2D Cartesian Quadrant Map */}
          {(result.testType === "moral_alignment" || campaignSlug.includes("moral")) && (
            <MoralCartesianGrid
              moralScore={result.traits.find((t) => t.key.toLowerCase().includes("moral") || t.name.toLowerCase().includes("moral"))?.score ?? 50}
              orderScore={result.traits.find((t) => t.key.toLowerCase().includes("order") || t.name.toLowerCase().includes("order"))?.score ?? 50}
              alignmentTitle={result.archetypeTitle}
            />
          )}

          {/* 4. DARK TRIAD: Tri-Axial Dark Delta Polygon */}
          {(result.testType === "dark_triad" || campaignSlug.includes("dark")) && (
            <DarkTriadDeltaChart traits={result.traits} compositeIndex={result.primaryMetricValue} />
          )}

          {/* 5. HARRY POTTER CHARACTER MATCH: 6-Trait Dual-Layer Character Comparison */}
          {(result.testType === "harry_potter" || campaignSlug.includes("harry-potter")) &&
            result.characterMatch && (
              <HarryPotterMatchChart
                traits={result.traits}
                characterMatch={result.characterMatch}
              />
            )}

          {/* Fallback Trait Meters Card (Displayed ONLY for generic non-psychometric surveys) */}
          {!(
            result.testType === "cognitive_iq" ||
            result.iqScore !== undefined ||
            result.testType === "big_five" ||
            result.testType === "moral_alignment" ||
            result.testType === "dark_triad" ||
            result.testType === "harry_potter" ||
            campaignSlug.includes("personality") ||
            campaignSlug.includes("moral") ||
            campaignSlug.includes("dark") ||
            campaignSlug.includes("harry-potter")
          ) && (
            <div className="rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-md space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Score Breakdown
                </h2>
                <span className="text-xs font-mono text-charcoal-500">
                  0% — 100% Score Scale
                </span>
              </div>

              <div className="space-y-5">
                {result.traits.map((trait) => (
                  <div key={trait.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-charcoal-900">
                          {trait.name}
                        </span>
                        <span
                          className="ml-2.5 text-[11px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: `${trait.color}15`,
                            color: trait.color,
                          }}
                        >
                          {trait.level}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-charcoal-900">
                        {trait.score}%
                      </span>
                    </div>

                    {/* Progress Bar Meter */}
                    <div className="h-3 w-full rounded-full bg-canvas-subtle border border-border/60 overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.max(4, trait.score)}%`,
                          backgroundColor: trait.color,
                        }}
                      />
                    </div>

                    <p className="text-xs text-charcoal-700 leading-relaxed">
                      {trait.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deep Synthesis & Analysis Card */}
          <div className="rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-md space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Brain className="h-4 w-4 text-terracotta" />
              <h3 className="text-base font-semibold text-charcoal-900">
                What Your Results Mean
              </h3>
            </div>
            <p className="text-sm text-charcoal-800 leading-relaxed whitespace-pre-line font-sans">
              {result.detailedAnalysis}
            </p>
          </div>
        </div>

      {/* Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleShare}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface hover:bg-canvas-subtle text-charcoal-900 text-sm font-medium shadow-warm-sm transition-colors"
        >
          {copiedShare ? (
            <>
              <Check className="h-4 w-4 text-success" />
              <span className="text-success font-medium">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span>Share My Results</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface hover:bg-canvas-subtle text-charcoal-700 text-sm font-medium transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake Test</span>
            </button>
          )}

          <Link
            href="/"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-medium shadow-warm-md transition-colors"
          >
            <Compass className="h-4 w-4" />
            <span>More Tests</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
