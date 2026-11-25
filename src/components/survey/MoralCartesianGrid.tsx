"use client";

import React, { useMemo } from "react";
import { Compass, Scale, Shield, Sparkles } from "lucide-react";

interface MoralCartesianGridProps {
  moralScore: number; // 0 to 100 (where 0 is Evil, 50 is Neutral, 100 is Good)
  orderScore: number; // 0 to 100 (where 0 is Chaotic, 50 is Neutral, 100 is Lawful)
  alignmentTitle?: string;
  className?: string;
}

interface QuadrantDef {
  id: string;
  name: string;
  shortCode: string;
  xRange: [number, number]; // normalized [0, 1]
  yRange: [number, number]; // normalized [0, 1]
  color: string;
  description: string;
}

const NINE_ALIGNMENTS: QuadrantDef[] = [
  // Top Row (Good: yRange [0.60, 1])
  { id: "cg", name: "Free-Spirited & Kind (Chaotic Good)", shortCode: "CG", xRange: [0, 0.40], yRange: [0.60, 1], color: "#10B981", description: "Follows your own heart to do what is right, even if it bends rules or traditions." },
  { id: "ng", name: "Balanced & Kind (Neutral Good)", shortCode: "NG", xRange: [0.40, 0.60], yRange: [0.60, 1], color: "#059669", description: "Focuses on helping others in the best way possible, without leaning strongly toward strict rules or total freedom." },
  { id: "lg", name: "Rule-Following & Kind (Lawful Good)", shortCode: "LG", xRange: [0.60, 1], yRange: [0.60, 1], color: "#D97706", description: "Tries to do the right thing while respecting rules, fairness, promises, and duty." },

  // Middle Row (Neutral: yRange [0.40, 0.60])
  { id: "cn", name: "Free-Spirited & Neutral (Chaotic Neutral)", shortCode: "CN", xRange: [0, 0.40], yRange: [0.40, 0.60], color: "#6366F1", description: "Puts personal freedom first and acts on instinct without feeling tied to rules or big moral causes." },
  { id: "tn", name: "Balanced Middle Ground (True Neutral)", shortCode: "TN", xRange: [0.40, 0.60], yRange: [0.40, 0.60], color: "#64748B", description: "Takes things as they come without a strong pull toward strict rules, rebellion, pure giving, or pure selfishness." },
  { id: "ln", name: "Rule-Following & Neutral (Lawful Neutral)", shortCode: "LN", xRange: [0.60, 1], yRange: [0.40, 0.60], color: "#2563EB", description: "Values rules, order, tradition, and keeping your word above personal feelings." },

  // Bottom Row (Evil: yRange [0, 0.40])
  { id: "ce", name: "Rule-Breaking & Self-First (Chaotic Evil)", shortCode: "CE", xRange: [0, 0.40], yRange: [0, 0.40], color: "#BE123C", description: "Acts on strong impulses and puts personal gain or anger ahead of both rules and other people." },
  { id: "ne", name: "Practical & Self-First (Neutral Evil)", shortCode: "NE", xRange: [0.40, 0.60], yRange: [0, 0.40], color: "#9F1239", description: "Looks out for yourself first and does whatever works best for you, with or without rules." },
  { id: "le", name: "Rule-Following & Self-First (Lawful Evil)", shortCode: "LE", xRange: [0.60, 1], yRange: [0, 0.40], color: "#831843", description: "Uses rules, systems, and structure carefully to get what you want for yourself." },
];

export function MoralCartesianGrid({
  moralScore = 50,
  orderScore = 50,
  alignmentTitle,
  className = "",
}: MoralCartesianGridProps) {
  // Canvas coordinate math: width = 420, height = 420
  // Grid spans from 50 to 370 (width 320, height 320)
  const gridLeft = 50;
  const gridRight = 370;
  const gridTop = 50;
  const gridBottom = 370;
  const gridWidth = gridRight - gridLeft; // 320
  const gridHeight = gridBottom - gridTop; // 320

  const originX = gridLeft + gridWidth / 2; // 210
  const originY = gridTop + gridHeight / 2; // 210

  // Normalize scores (0 to 100) into SVG coordinates
  // X: 0 is Chaotic (left, 50px), 100 is Lawful (right, 370px)
  // Y: 0 is Evil (bottom, 370px), 100 is Good (top, 50px)
  const targetX = gridLeft + (Math.max(0, Math.min(100, orderScore)) / 100) * gridWidth;
  const targetY = gridBottom - (Math.max(0, Math.min(100, moralScore)) / 100) * gridHeight;

  // Active Quadrant identification synchronized with scoring thresholds (<=40, 41-59, >=60)
  const activeQuadrant = useMemo(() => {
    if (alignmentTitle) {
      const normalizedTitle = alignmentTitle.trim().toLowerCase();
      const byTitle = NINE_ALIGNMENTS.find(
        (q) =>
          q.name.toLowerCase() === normalizedTitle ||
          normalizedTitle.includes(`(${q.name.toLowerCase()})`) ||
          q.shortCode.toLowerCase() === normalizedTitle
      );
      if (byTitle) return byTitle;
    }

    const lawChar = orderScore >= 60 ? "l" : orderScore <= 40 ? "c" : "n";
    const moralChar = moralScore >= 60 ? "g" : moralScore <= 40 ? "e" : "n";
    const targetId = lawChar === "n" && moralChar === "n" ? "tn" : `${lawChar}${moralChar}`;

    return (
      NINE_ALIGNMENTS.find((q) => q.id === targetId) || NINE_ALIGNMENTS[4] // Default True Neutral
    );
  }, [alignmentTitle, orderScore, moralScore]);

  // Delta calculations relative to True Neutral (50, 50)
  const orderDelta = Math.round(orderScore - 50);
  const moralDelta = Math.round(moralScore - 50);
  const pillWidth = Math.max(150, activeQuadrant.name.length * 5.6 + 24);
  const pillX = Math.max(pillWidth / 2 - 20, Math.min(420 - pillWidth / 2 + 20, targetX));

  return (
    <div className={`rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-md space-y-6 ${className}`}>
      {/* Header & Dual-Sphere Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs font-mono uppercase text-primary font-bold tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            2D Moral & Rules Map
          </span>
          <h3 className="text-base font-bold text-charcoal-900">
            Your Moral Style vs. Middle Ground
          </h3>
        </div>

        {/* High-Contrast Comparative Legend */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-canvas-subtle border border-border text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#D97706] ring-2 ring-amber-300 shadow-sm" />
            <span className="font-bold text-amber-900">Your Position (Orange)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 border border-slate-300 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#64748B] ring-2 ring-slate-400 shadow-sm" />
            <span className="font-bold text-slate-800">Middle Ground (0, 0)</span>
          </div>
        </div>
      </div>

      {/* 2D Cartesian Alignment Canvas */}
      <div className="relative flex justify-center py-2 overflow-hidden select-none">
        <svg
          width={420}
          height={420}
          viewBox="0 0 420 420"
          className="overflow-visible select-none max-w-full"
        >
          <defs>
            <radialGradient id="moralDialBackdrop" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF8F5" stopOpacity="1" />
              <stop offset="85%" stopColor="#F5F2EB" stopOpacity="1" />
              <stop offset="100%" stopColor="#EAE5DC" stopOpacity="1" />
            </radialGradient>

            <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#D97706" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Instrument Dial Backing Disk */}
          <rect
            x={gridLeft - 10}
            y={gridTop - 10}
            width={gridWidth + 20}
            height={gridHeight + 20}
            rx={16}
            fill="url(#moralDialBackdrop)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />

          {/* 9 Classical Alignment Quadrant Sectors */}
          {NINE_ALIGNMENTS.map((q) => {
            const x = gridLeft + q.xRange[0] * gridWidth;
            const y = gridBottom - q.yRange[1] * gridHeight;
            const w = (q.xRange[1] - q.xRange[0]) * gridWidth;
            const h = (q.yRange[1] - q.yRange[0]) * gridHeight;
            const isActive = activeQuadrant.id === q.id;

            return (
              <g key={`quad-${q.id}`}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={isActive ? q.color : "transparent"}
                  fillOpacity={isActive ? 0.12 : 0}
                  stroke="var(--border)"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                />
                <text
                  x={x + w / 2}
                  y={y + h / 2}
                  textAnchor="middle"
                  fill={isActive ? q.color : "var(--charcoal-muted)"}
                  fontSize={isActive ? "10" : "9"}
                  fontFamily="monospace"
                  fontWeight={isActive ? "bold" : "normal"}
                  opacity={isActive ? 1 : 0.6}
                >
                  {q.shortCode}
                </text>
              </g>
            );
          })}

          {/* Cartesian Orthogonal Crosshairs (Major X and Y Axes) */}
          <line x1={gridLeft} y1={originY} x2={gridRight} y2={originY} stroke="#475569" strokeWidth="2" />
          <line x1={originX} y1={gridTop} x2={originX} y2={gridBottom} stroke="#475569" strokeWidth="2" />

          {/* Axis Cardinal Direction Labels */}
          {/* Top: GOOD */}
          <text x={originX} y={gridTop - 16} textAnchor="middle" fill="#059669" fontSize="10" fontFamily="monospace" fontWeight="bold">
            ▲ KIND • CARING (+100)
          </text>
          {/* Bottom: EVIL */}
          <text x={originX} y={gridBottom + 22} textAnchor="middle" fill="#BE123C" fontSize="10" fontFamily="monospace" fontWeight="bold">
            ▼ SELF-FIRST • HARSH (-100)
          </text>
          {/* Left: CHAOTIC */}
          <text x={gridLeft - 10} y={originY - 8} textAnchor="end" fill="#6366F1" fontSize="9" fontFamily="monospace" fontWeight="bold">
            ◀ FREE-SPIRITED (-100)
          </text>
          {/* Right: LAWFUL */}
          <text x={gridRight + 10} y={originY - 8} textAnchor="start" fill="#D97706" fontSize="9" fontFamily="monospace" fontWeight="bold">
            RULE-FOLLOWING (+100) ▶
          </text>

          {/* Central Neutral Origin Reticle (0, 0) - Solid Gray Sphere */}
          <circle cx={originX} cy={originY} r={18} fill="#64748B" fillOpacity="0.2" stroke="#475569" strokeWidth="1.5" />
          <circle cx={originX} cy={originY} r={3.5} fill="#64748B" />
          <text x={originX + 8} y={originY + 12} fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">
            (0, 0)
          </text>

          {/* Target Coordinate Crosshair Tracking Lines */}
          <line x1={targetX} y1={originY} x2={targetX} y2={targetY} stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 3" opacity={0.8} />
          <line x1={originX} y1={targetY} x2={targetX} y2={targetY} stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 3" opacity={0.8} />

          {/* Active Participant Position Beacon (Vivid Orange Sphere) */}
          <g filter="url(#beaconGlow)">
            {/* Outer Pulsing Aura */}
            <circle cx={targetX} cy={targetY} r={14} fill="#D97706" opacity={0.25} />
            {/* Crisp Middle Ring */}
            <circle cx={targetX} cy={targetY} r={7.5} fill="#FFFFFF" stroke="#D97706" strokeWidth="3" />
            {/* Core Solid Pip */}
            <circle cx={targetX} cy={targetY} r={3.5} fill="#D97706" />
          </g>

          {/* Floating Coordinate Pill Badge */}
          <g transform={`translate(${pillX}, ${targetY - 24})`} className="pointer-events-none select-none">
            <rect x={-pillWidth / 2} y="-10" width={pillWidth} height="20" rx="10" fill="#0F172A" stroke="#D97706" strokeWidth="1.2" />
            <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              {activeQuadrant.name}
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Social Order Vector */}
        <div className="p-4 rounded-xl border border-border bg-surface space-y-2 shadow-warm-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#D97706]" />
              <span className="text-xs font-mono uppercase font-bold text-charcoal-900">
                Rules vs. Freedom
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-charcoal-900">
              {orderDelta >= 0 ? `+${orderDelta} (Rule-Following)` : `${orderDelta} (Free-Spirited)`}
            </span>
          </div>
          <div className="w-full bg-canvas-subtle h-2 rounded-full overflow-hidden border border-border relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#475569] z-10" />
            <div
              className="h-full bg-[#D97706] rounded-full transition-all duration-300"
              style={{ width: `${orderScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-charcoal-500">
            <span>Free-Spirited (0%)</span>
            <span>Balanced (50%)</span>
            <span>Rule-Following (100%)</span>
          </div>
        </div>

        {/* Moral Altruism Vector */}
        <div className="p-4 rounded-xl border border-border bg-surface space-y-2 shadow-warm-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#059669]" />
              <span className="text-xs font-mono uppercase font-bold text-charcoal-900">
                Kindness vs. Self-First
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-charcoal-900">
              {moralDelta >= 0 ? `+${moralDelta} (Kind)` : `${moralDelta} (Self-First)`}
            </span>
          </div>
          <div className="w-full bg-canvas-subtle h-2 rounded-full overflow-hidden border border-border relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#475569] z-10" />
            <div
              className="h-full bg-[#059669] rounded-full transition-all duration-300"
              style={{ width: `${moralScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-charcoal-500">
            <span>Self-First (0%)</span>
            <span>Balanced (50%)</span>
            <span>Kind (100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
