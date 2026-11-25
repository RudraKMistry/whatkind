"use client";

import React, { useMemo } from "react";
import type { CharacterMatchResult, TraitScoreDefinition } from "@/types/survey";

interface HarryPotterMatchChartProps {
  traits: TraitScoreDefinition[];
  characterMatch: CharacterMatchResult;
  className?: string;
}

interface HpAxisDef {
  key: string;
  shortLabel: string;
  name: string;
  angleDeg: number;
  color: string;
  description: string;
}

const HP_AXES: HpAxisDef[] = [
  {
    key: "bravery",
    shortLabel: "BRAVE",
    name: "Bravery & Nerve",
    angleDeg: -90,
    color: "#C2410C",
    description: "Stepping up in scary moments, facing danger, and defending others.",
  },
  {
    key: "wisdom",
    shortLabel: "WISDOM",
    name: "Logic & Book Smarts",
    angleDeg: -30,
    color: "#2563EB",
    description: "Planning ahead, learning deeply, and thinking before acting.",
  },
  {
    key: "ambition",
    shortLabel: "DRIVE",
    name: "Drive & Pride",
    angleDeg: 30,
    color: "#059669",
    description: "Chasing big goals, standing out, and wanting to win.",
  },
  {
    key: "loyalty",
    shortLabel: "LOYAL",
    name: "Loyalty & Friendship",
    angleDeg: 90,
    color: "#D97706",
    description: "Standing by friends, keeping promises, and protecting your circle.",
  },
  {
    key: "rebellion",
    shortLabel: "REBEL",
    name: "Rule-Breaking & Independence",
    angleDeg: 150,
    color: "#7C3AED",
    description: "Questioning unfair rules and trusting your own path.",
  },
  {
    key: "empathy_growth",
    shortLabel: "EMPATHY",
    name: "Kindness & Personal Growth",
    angleDeg: 210,
    color: "#E11D48",
    description: "Caring how others feel, admitting mistakes, and growing kinder.",
  },
];

const HOUSE_STYLES: Record<string, string> = {
  Gryffindor: "bg-red-100 text-red-900 border-red-300",
  Slytherin: "bg-emerald-100 text-emerald-900 border-emerald-300",
  Ravenclaw: "bg-blue-100 text-blue-900 border-blue-300",
  Hufflepuff: "bg-amber-100 text-amber-900 border-amber-300",
};

function getClosedSplinePath(points: { x: number; y: number }[]): string {
  const n = points.length;
  if (n < 3) return "";
  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  d += " Z";
  return d;
}

export function HarryPotterMatchChart({
  traits,
  characterMatch,
  className = "",
}: HarryPotterMatchChartProps) {
  const cx = 220;
  const cy = 220;
  const maxR = 148;
  const { topMatch, topMatches, characterTraits } = characterMatch;

  const userScores = useMemo(() => {
    const map: Record<string, number> = {};
    for (const axis of HP_AXES) {
      const found = traits.find((t) => t.key === axis.key);
      map[axis.key] = found?.score ?? 50;
    }
    return map;
  }, [traits]);

  const getAxisCoords = (axis: HpAxisDef, score: number) => {
    const rad = (axis.angleDeg * Math.PI) / 180;
    const r = (Math.max(10, Math.min(100, score)) / 100) * maxR;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const userPoints = useMemo(
    () => HP_AXES.map((axis) => getAxisCoords(axis, userScores[axis.key] ?? 50)),
    [userScores]
  );
  const userSplineD = useMemo(() => getClosedSplinePath(userPoints), [userPoints]);

  const charPoints = useMemo(
    () => HP_AXES.map((axis) => getAxisCoords(axis, characterTraits[axis.key] ?? 50)),
    [characterTraits]
  );
  const charSplineD = useMemo(() => getClosedSplinePath(charPoints), [charPoints]);

  const houseBadgeClass =
    HOUSE_STYLES[topMatch.house] || "bg-stone-100 text-stone-800 border-stone-300";

  return (
    <div
      className={`rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-md space-y-6 ${className}`}
    >
      {/* Header & House / Canon Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase text-primary font-bold tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              6-Trait Character Match Chart
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${houseBadgeClass}`}
            >
              {topMatch.house}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${
                topMatch.isCanon
                  ? "bg-stone-100 text-stone-800 border-stone-300"
                  : "bg-purple-100 text-purple-900 border-purple-300"
              }`}
            >
              {topMatch.originLabel}
            </span>
          </div>
          <h3 className="text-base font-bold text-charcoal-900">
            Your Scores vs. {topMatch.name} ({topMatch.similarity}% Match)
          </h3>
        </div>

        {/* Dual-Layer Legend */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-canvas-subtle border border-border text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#D97706] ring-2 ring-amber-300 shadow-sm" />
            <span className="font-bold text-amber-900">Your Scores (Orange)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 border border-slate-300 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#64748B] ring-2 ring-slate-400 shadow-sm" />
            <span className="font-bold text-slate-800">{topMatch.name} (Gray)</span>
          </div>
        </div>
      </div>

      {/* 6-Axis Hexagonal Dual-Layer SVG */}
      <div className="relative flex justify-center py-2 overflow-hidden select-none">
        <svg
          width={440}
          height={440}
          viewBox="0 0 440 440"
          role="img"
          aria-label={`6-axis comparison chart showing your scores in orange versus ${topMatch.name} in gray`}
          className="overflow-visible select-none max-w-full h-auto"
        >
          <defs>
            <linearGradient id="hpUserAmberGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.22" />
            </linearGradient>

            <radialGradient id="hpCharGrayGradient" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.68" />
              <stop offset="70%" stopColor="#64748B" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.45" />
            </radialGradient>

            <radialGradient id="hpDialBackdrop" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF8F5" stopOpacity="1" />
              <stop offset="85%" stopColor="#F5F2EB" stopOpacity="1" />
              <stop offset="100%" stopColor="#EAE5DC" stopOpacity="1" />
            </radialGradient>

            <filter id="hpAmberGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#D97706" floodOpacity="0.35" />
            </filter>

            <filter id="hpGrayGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#475569" floodOpacity="0.22" />
            </filter>
          </defs>

          {/* Backing Dial */}
          <circle cx={cx} cy={cy} r={160} fill="url(#hpDialBackdrop)" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={166} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* Concentric Rings */}
          <circle cx={cx} cy={cy} r={37} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.45} />
          <circle cx={cx} cy={cy} r={74} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.55} />
          <circle cx={cx} cy={cy} r={111} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.65} />
          <circle cx={cx} cy={cy} r={148} fill="none" stroke="var(--border)" strokeWidth="1.8" />

          {/* Ring Labels */}
          <text x={cx + 4} y={cy - 76} fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">50%</text>
          <text x={cx + 4} y={cy - 113} fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">75%</text>
          <text x={cx + 4} y={cy - 150} fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">100%</text>

          {/* 6 Radial Spokes */}
          <g stroke="var(--border)" strokeWidth="1.2" opacity={0.7}>
            {HP_AXES.map((axis) => {
              const rad = (axis.angleDeg * Math.PI) / 180;
              return (
                <line
                  key={`hp-spoke-${axis.key}`}
                  x1={cx}
                  y1={cy}
                  x2={cx + maxR * Math.cos(rad)}
                  y2={cy + maxR * Math.sin(rad)}
                />
              );
            })}
          </g>

          {/* Center Reticle */}
          <circle cx={cx} cy={cy} r={3.5} fill="var(--accent)" />
          <circle cx={cx} cy={cy} r={7} fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity={0.6} />

          {/* 1. MATCHED CHARACTER PROFILE (SOLID GRAY) */}
          <path
            d={charSplineD}
            fill="url(#hpCharGrayGradient)"
            stroke="#475569"
            strokeWidth="2.4"
            strokeLinejoin="round"
            filter="url(#hpGrayGlow)"
          />
          <g>
            {charPoints.map((p, idx) => (
              <circle
                key={`hp-char-pip-${idx}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="#64748B"
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            ))}
          </g>

          {/* 2. USER PROFILE (SOLID ORANGE) */}
          <path
            d={userSplineD}
            fill="url(#hpUserAmberGradient)"
            stroke="#D97706"
            strokeWidth="2.8"
            strokeLinejoin="round"
            filter="url(#hpAmberGlow)"
          />

          {/* 3. VERTEX NODES & OUTER LABELS */}
          <g>
            {HP_AXES.map((axis, idx) => {
              const p = userPoints[idx];
              const score = userScores[axis.key] ?? 50;
              const rad = (axis.angleDeg * Math.PI) / 180;
              const textR = 178;
              const tx = cx + textR * Math.cos(rad);
              const ty = cy + textR * Math.sin(rad) + 4;

              return (
                <g key={`hp-node-${axis.key}`} className="select-none">
                  <circle cx={p.x} cy={p.y} r={8.5} fill={axis.color} opacity={0.22} />
                  <circle cx={p.x} cy={p.y} r={5.5} fill="#FFFFFF" stroke={axis.color} strokeWidth={2.5} />
                  <circle cx={p.x} cy={p.y} r={2.3} fill={axis.color} />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill={axis.color}
                  >
                    {axis.shortLabel} {score}%
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Top 3 Closest Matches Leaderboard */}
      <div className="rounded-xl border border-border bg-canvas-subtle p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-charcoal-700">
            Top 3 Closest Matches
          </h4>
          <span className="text-[11px] font-mono text-charcoal-500">
            14 Book Canon + 1 Non-Canon (Malfoid)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topMatches.map((match, idx) => {
            const mHouseStyle =
              HOUSE_STYLES[match.house] || "bg-stone-100 text-stone-800 border-stone-300";
            return (
              <div
                key={match.id}
                className={`p-3.5 rounded-xl border bg-surface space-y-2 ${
                  idx === 0 ? "border-primary/60 shadow-warm-sm" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-charcoal-500">
                    #{idx + 1} Match
                  </span>
                  <span className="text-sm font-mono font-extrabold text-primary">
                    {match.similarity}%
                  </span>
                </div>
                <div className="font-bold text-sm text-charcoal-900 leading-snug">
                  {match.name}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${mHouseStyle}`}
                  >
                    {match.house}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                      match.isCanon
                        ? "bg-stone-100 text-stone-700 border-stone-300"
                        : "bg-purple-100 text-purple-900 border-purple-300"
                    }`}
                  >
                    {match.originLabel}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-canvas-subtle border border-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${match.similarity}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Trait Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {HP_AXES.map((axis) => {
          const uScore = userScores[axis.key] ?? 50;
          const cScore = characterTraits[axis.key] ?? 50;
          const diff = uScore - cScore;
          const diffLabel =
            diff === 0
              ? "Exact match"
              : diff > 0
              ? `+${diff}% vs. ${topMatch.name.split(" ")[0]}`
              : `${diff}% vs. ${topMatch.name.split(" ")[0]}`;

          return (
            <div
              key={`hp-card-${axis.key}`}
              className="p-4 rounded-xl border border-border bg-surface space-y-2.5 shadow-warm-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: axis.color }}
                  />
                  <span
                    className="text-xs font-mono uppercase font-bold truncate"
                    style={{ color: axis.color }}
                  >
                    {axis.name}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-charcoal-900 shrink-0">
                  {uScore}%
                </span>
              </div>

              <p className="text-[11px] text-charcoal-600 leading-tight">{axis.description}</p>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-charcoal-500">
                  <span>
                    {topMatch.name.split(" ")[0]}: {cScore}%
                  </span>
                  <span className="font-semibold text-charcoal-700">{diffLabel}</span>
                </div>
                <div className="w-full bg-canvas-subtle h-2 rounded-full overflow-hidden border border-border relative">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[#475569] z-10"
                    style={{ left: `calc(${cScore}% - 2px)` }}
                    title={`${topMatch.name}: ${cScore}%`}
                  />
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${uScore}%`, backgroundColor: axis.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
