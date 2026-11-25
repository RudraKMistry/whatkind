"use client";

import React, { useMemo } from "react";
import { Zap, AlertTriangle, ShieldAlert } from "lucide-react";

interface TraitData {
  key: string;
  name: string;
  score: number;
  color?: string;
  summary?: string;
  level?: string;
}

interface DarkTriadDeltaChartProps {
  traits: TraitData[];
  compositeIndex?: string | number;
  className?: string;
}

interface DarkAxisDef {
  key: string;
  name: string;
  shortName: string;
  code: string;
  angleDeg: number;
  color: string;
  description: string;
  clinicalMarker: string;
}

const DARK_AXES: DarkAxisDef[] = [
  {
    key: "narcissism",
    name: "Need for Admiration & Status (Narcissism)",
    shortName: "Need for Praise",
    code: "N",
    angleDeg: -90, // Top
    color: "#D97706",
    description: "Feeling more special than others, wanting lots of praise and attention, and chasing high status.",
    clinicalMarker: "Strong Need for Praise & Ego Boost",
  },
  {
    key: "psychopathy",
    name: "Cold Calmness & Risk-Taking (Psychopathy)",
    shortName: "Cold Risk-Taking",
    code: "P",
    angleDeg: 30, // Bottom-Right
    color: "#BE123C",
    description: "Feeling less guilt or worry about hurting others, acting fast on impulse, and chasing strong thrills.",
    clinicalMarker: "Low Guilt & Quick Risk-Taking",
  },
  {
    key: "machiavellianism",
    name: "Strategic Manipulation (Machiavellianism)",
    shortName: "Using Strategy",
    code: "M",
    angleDeg: 150, // Bottom-Left
    color: "#4F46E5",
    description: "Doubting people's motives, planning ways to steer people quietly, and putting results ahead of honesty.",
    clinicalMarker: "Careful Plotting & Using People",
  },
];

export function DarkTriadDeltaChart({
  traits,
  compositeIndex = "50%",
  className = "",
}: DarkTriadDeltaChartProps) {
  const cx = 210;
  const cy = 210;
  const maxR = 150;

  const scoresMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const axis of DARK_AXES) {
      const match = traits.find(
        (t) =>
          t.key.toLowerCase().includes(axis.key) ||
          axis.name.toLowerCase().includes(t.key.toLowerCase()) ||
          t.name.toLowerCase().includes(axis.key)
      );
      map[axis.key] = match ? match.score : 40;
    }
    return map;
  }, [traits]);

  const getCoords = (axis: DarkAxisDef, score: number) => {
    const rad = (axis.angleDeg * Math.PI) / 180;
    const r = (Math.max(15, Math.min(100, score)) / 100) * maxR;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Participant 3-Point Delta Path
  const participantPoints = useMemo(() => {
    return DARK_AXES.map((axis) => getCoords(axis, scoresMap[axis.key] ?? 40));
  }, [scoresMap]);

  const participantDeltaD = useMemo(() => {
    if (participantPoints.length < 3) return "";
    return `M ${participantPoints[0].x.toFixed(1)},${participantPoints[0].y.toFixed(1)} L ${participantPoints[1].x.toFixed(1)},${participantPoints[1].y.toFixed(1)} L ${participantPoints[2].x.toFixed(1)},${participantPoints[2].y.toFixed(1)} Z`;
  }, [participantPoints]);

  // Population Average Benchmark (35% Subclinical Norm)
  const popPoints = useMemo(() => {
    return DARK_AXES.map((axis) => getCoords(axis, 35));
  }, []);

  const popDeltaD = useMemo(() => {
    return `M ${popPoints[0].x.toFixed(1)},${popPoints[0].y.toFixed(1)} L ${popPoints[1].x.toFixed(1)},${popPoints[1].y.toFixed(1)} L ${popPoints[2].x.toFixed(1)},${popPoints[2].y.toFixed(1)} Z`;
  }, [popPoints]);

  return (
    <div className={`rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-md space-y-6 ${className}`}>
      {/* Header & Dual-Sphere Benchmark Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#BE123C] font-bold tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#BE123C]" />
            3-Part Darker Traits Chart
          </span>
          <h3 className="text-base font-bold text-charcoal-900">
            Your Everyday Dark Triad Traits vs. Typical Average
          </h3>
        </div>

        {/* Dual-Sphere Comparative Legend */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-canvas-subtle border border-border text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#BE123C] ring-2 ring-rose-300 shadow-sm" />
            <span className="font-bold text-rose-900">Your Shape (Red)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 border border-slate-300 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#64748B] ring-2 ring-slate-400 shadow-sm" />
            <span className="font-bold text-slate-800">Typical Average 35% (Gray)</span>
          </div>
        </div>
      </div>

      {/* 2D Scientific Triangle Delta Canvas */}
      <div className="relative flex justify-center py-2 overflow-hidden select-none">
        <svg
          width={420}
          height={420}
          viewBox="0 0 420 420"
          className="overflow-visible select-none max-w-full"
        >
          <defs>
            <linearGradient id="darkAmberCrimsonGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#BE123C" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#D97706" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.3" />
            </linearGradient>

            <radialGradient id="darkGraySphereGradient" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#64748B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.5" />
            </radialGradient>

            <radialGradient id="darkDialBackdrop" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF8F5" stopOpacity="1" />
              <stop offset="85%" stopColor="#F5F2EB" stopOpacity="1" />
              <stop offset="100%" stopColor="#EAE5DC" stopOpacity="1" />
            </radialGradient>

            <filter id="darkDeltaGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#BE123C" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Instrument Dial Backing Disk */}
          <circle cx={cx} cy={cy} r={162} fill="url(#darkDialBackdrop)" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={168} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* Concentric Threshold Rings: Subclinical (33%), Elevated (66%), Clinical (100%) */}
          <circle cx={cx} cy={cy} r={50} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} />
          <circle cx={cx} cy={cy} r={100} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.65} />
          <circle cx={cx} cy={cy} r={150} fill="none" stroke="var(--border)" strokeWidth="1.8" />

          {/* Threshold Ring Annotations */}
          <text x="214" y="156" fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">33% Low</text>
          <text x="214" y="106" fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">66% High</text>
          <text x="214" y="63" fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">100% Very High</text>

          {/* 3 Equilateral Radial Spokes */}
          <g stroke="var(--border)" strokeWidth="1.5" opacity={0.7}>
            {DARK_AXES.map((axis) => {
              const rad = (axis.angleDeg * Math.PI) / 180;
              const x2 = cx + maxR * Math.cos(rad);
              const y2 = cy + maxR * Math.sin(rad);
              return <line key={`dark-spoke-${axis.key}`} x1={cx} y1={cy} x2={x2} y2={y2} />;
            })}
          </g>

          {/* Center Origin Pip */}
          <circle cx={cx} cy={cy} r={3.5} fill="#475569" />

          {/* 1. AVERAGE POPULATION (35% SUBCLINICAL BASELINE): SOLID GRAY SHAPE */}
          <path
            d={popDeltaD}
            fill="url(#darkGraySphereGradient)"
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-300 ease-out"
          />

          {/* 3 Benchmark Pips on the Gray Sphere Rim */}
          <g>
            {popPoints.map((p, idx) => (
              <circle key={`pop-pip-${idx}`} cx={p.x} cy={p.y} r={3.5} fill="#64748B" stroke="#FFFFFF" strokeWidth={1} />
            ))}
          </g>

          <text
            x={cx}
            y={cy - 45}
            textAnchor="middle"
            fill="#475569"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.04em"
          >
            TYPICAL AVG 35%
          </text>

          {/* 2. PARTICIPANT ACTIVE DARK TRIAD DELTA POLYGON */}
          <path
            d={participantDeltaD}
            fill="url(#darkAmberCrimsonGradient)"
            stroke="#BE123C"
            strokeWidth="2.8"
            strokeLinejoin="round"
            filter="url(#darkDeltaGlow)"
            className="transition-all duration-300 ease-out"
          />

          {/* 3. 3 SCIENTIFIC MEASUREMENT VERTEX NODES & BADGES */}
          <g>
            {DARK_AXES.map((axis, idx) => {
              const p = participantPoints[idx];
              const score = scoresMap[axis.key] ?? 40;

              const rad = (axis.angleDeg * Math.PI) / 180;
              const textR = 175;
              const tx = cx + textR * Math.cos(rad);
              const ty = cy + textR * Math.sin(rad) + 4;

              return (
                <g key={`dark-node-${axis.key}`} className="select-none">
                  <circle cx={p.x} cy={p.y} r={9} fill={axis.color} opacity={0.25} />
                  <circle cx={p.x} cy={p.y} r={6} fill="#FFFFFF" stroke={axis.color} strokeWidth={2.5} />
                  <circle cx={p.x} cy={p.y} r={2.5} fill={axis.color} />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill={axis.color}
                  >
                    {axis.shortName}: {score}%
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 3 Trait Breakdown Cards with Clinical Thresholds */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {DARK_AXES.map((axis) => {
          const score = scoresMap[axis.key] ?? 40;
          const isElevated = score >= 66;

          return (
            <div
              key={`card-${axis.key}`}
              className="p-4 rounded-xl border border-border bg-surface space-y-2.5 shadow-warm-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: axis.color }} />
                  <span className="text-xs font-mono uppercase font-bold" style={{ color: axis.color }}>
                    {axis.name}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    isElevated
                      ? "text-rose-700 bg-rose-50 border-rose-200"
                      : "text-slate-700 bg-slate-50 border-slate-200"
                  }`}
                >
                  {score}%
                </span>
              </div>

              <p className="text-[11px] text-charcoal-600 leading-tight">
                {axis.description}
              </p>

              <div className="space-y-1">
                <div className="w-full bg-canvas-subtle h-2 rounded-full overflow-hidden border border-border relative">
                  <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-[#475569] z-10" title="35% Typical Average" />
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${score}%`, backgroundColor: axis.color }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-charcoal-500">
                  <span>Typical Avg (35%)</span>
                  <span>{isElevated ? "High" : "Everyday Range"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
