"use client";

import React, { useMemo } from "react";

interface TraitData {
  key: string;
  name: string;
  score: number;
  color?: string;
  summary?: string;
  level?: string;
}

interface OceanPentagramChartProps {
  traits: TraitData[];
  className?: string;
}

interface OceanAxisDef {
  key: string;
  code: string;
  name: string;
  poleHigh: string;
  poleLow: string;
  angleDeg: number;
  color: string;
  description: string;
}

const OCEAN_AXES: OceanAxisDef[] = [
  {
    key: "openness",
    code: "O",
    name: "Curiosity & Openness (Openness)",
    poleHigh: "Creative & Curious",
    poleLow: "Practical & Traditional",
    angleDeg: -90,
    color: "#D97706",
    description: "Enjoying new ideas, art, imagination, and trying unfamiliar ways of thinking.",
  },
  {
    key: "conscientiousness",
    code: "C",
    name: "Planning & Follow-Through (Conscientiousness)",
    poleHigh: "Organized & Steady",
    poleLow: "Flexible & Easygoing",
    angleDeg: -18,
    color: "#2563EB",
    description: "Staying organized, controlling impulses, setting clear goals, and finishing what you start.",
  },
  {
    key: "extraversion",
    code: "E",
    name: "Social Energy & Boldness (Extraversion)",
    poleHigh: "Outgoing & Speaks Up",
    poleLow: "Quiet & Reflective",
    angleDeg: 54,
    color: "#059669",
    description: "Getting energy from being around people, joining in easily, and speaking up with confidence.",
  },
  {
    key: "agreeableness",
    code: "A",
    name: "Kindness & Teamwork (Agreeableness)",
    poleHigh: "Warm & Cooperative",
    poleLow: "Direct & Independent",
    angleDeg: 126,
    color: "#7C3AED",
    description: "Caring about how others feel, trusting people easily, and working together smoothly.",
  },
  {
    key: "emotional_stability",
    code: "N",
    name: "Calmness Under Stress (Emotional Stability)",
    poleHigh: "Calm & Steady",
    poleLow: "Sensitive & Easily Stressed",
    angleDeg: 198,
    color: "#E11D48",
    description: "Staying steady when things go wrong, bouncing back from worry, and keeping a level head.",
  },
];

// Closed Catmull-Rom Smooth Spline for 5 Vertices
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

export function OceanPentagramChart({ traits, className = "" }: OceanPentagramChartProps) {
  const cx = 210;
  const cy = 210;
  const maxR = 150;

  // Map traits into normalized score map
  const scoresMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const axis of OCEAN_AXES) {
      const match = traits.find(
        (t) =>
          t.key.toLowerCase().includes(axis.key) ||
          axis.name.toLowerCase().includes(t.key.toLowerCase()) ||
          t.name.toLowerCase().includes(axis.code.toLowerCase())
      );
      map[axis.key] = match ? match.score : 50;
    }
    return map;
  }, [traits]);

  const getAxisCoords = (axis: OceanAxisDef, score: number) => {
    const rad = (axis.angleDeg * Math.PI) / 180;
    const r = (Math.max(15, Math.min(100, score)) / 100) * maxR;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Participant Points & Spline
  const participantPoints = useMemo(() => {
    return OCEAN_AXES.map((axis) => getAxisCoords(axis, scoresMap[axis.key] ?? 50));
  }, [scoresMap]);

  const participantSplineD = useMemo(() => {
    return getClosedSplinePath(participantPoints);
  }, [participantPoints]);

  // Population Average (50% Standard Norm) Points & Spline
  const popPoints = useMemo(() => {
    return OCEAN_AXES.map((axis) => getAxisCoords(axis, 50));
  }, []);

  const popSplineD = useMemo(() => {
    return getClosedSplinePath(popPoints);
  }, [popPoints]);

  const formatDelta = (score: number) => {
    const delta = Math.round(score - 50);
    const sign = delta >= 0 ? `+${delta}%` : `${delta}%`;
    return { text: `${sign} vs. Average`, isPositive: delta >= 0, value: delta };
  };

  return (
    <div className={`rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-md space-y-6 ${className}`}>
      {/* Header & Dual-Sphere Benchmark Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs font-mono uppercase text-primary font-bold tracking-wider flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            5-Trait Personality Chart
          </span>
          <h3 className="text-base font-bold text-charcoal-900">
            Your Big Five (OCEAN) Traits vs. Typical Average Scores
          </h3>
        </div>

        {/* Dual-Sphere Comparative Legend */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-canvas-subtle border border-border text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#D97706] ring-2 ring-amber-300 shadow-sm" />
            <span className="font-bold text-amber-900">Your Personality (Orange)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 border border-slate-300 shadow-warm-xs">
            <span className="h-3 w-3 rounded-full bg-[#64748B] ring-2 ring-slate-400 shadow-sm" />
            <span className="font-bold text-slate-800">Typical Average 50% (Gray)</span>
          </div>
        </div>
      </div>

      {/* 2D Scientific Pentagram Canvas */}
      <div className="relative flex justify-center py-2 overflow-hidden select-none">
        <svg
          width={420}
          height={420}
          viewBox="0 0 420 420"
          className="overflow-visible select-none max-w-full"
        >
          <defs>
            {/* Participant Biometric Amber Gradient */}
            <linearGradient id="oceanAmberGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.25" />
            </linearGradient>

            {/* Average Population Solid Gray Sphere Gradient */}
            <radialGradient id="oceanGraySphereGradient" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#64748B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.5" />
            </radialGradient>

            <radialGradient id="oceanDialBackdrop" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAF8F5" stopOpacity="1" />
              <stop offset="85%" stopColor="#F5F2EB" stopOpacity="1" />
              <stop offset="100%" stopColor="#EAE5DC" stopOpacity="1" />
            </radialGradient>

            <filter id="oceanAmberGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#D97706" floodOpacity="0.4" />
            </filter>

            <filter id="oceanGrayGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#475569" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Instrument Dial Backing Disk */}
          <circle cx={cx} cy={cy} r={162} fill="url(#oceanDialBackdrop)" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={168} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* Concentric Polar Pentagonal Web Rings */}
          <circle cx={cx} cy={cy} r={30} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.45} />
          <circle cx={cx} cy={cy} r={60} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.45} />
          <circle cx={cx} cy={cy} r={90} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.55} />
          <circle cx={cx} cy={cy} r={120} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity={0.65} />
          <circle cx={cx} cy={cy} r={150} fill="none" stroke="var(--border)" strokeWidth="1.8" />

          {/* Ring Calibration Labels */}
          <text x="214" y="123" fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">60%</text>
          <text x="214" y="93" fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">80%</text>
          <text x="214" y="63" fill="var(--charcoal-muted)" fontSize="8" fontFamily="monospace">100%</text>

          {/* 5 Radial Spokes Connecting Center to Circumference */}
          <g stroke="var(--border)" strokeWidth="1.2" opacity={0.7}>
            {OCEAN_AXES.map((axis) => {
              const rad = (axis.angleDeg * Math.PI) / 180;
              const x2 = cx + maxR * Math.cos(rad);
              const y2 = cy + maxR * Math.sin(rad);
              return <line key={`spoke-${axis.key}`} x1={cx} y1={cy} x2={x2} y2={y2} />;
            })}
          </g>

          {/* Central Reticle */}
          <circle cx={cx} cy={cy} r={3.5} fill="var(--accent)" />
          <circle cx={cx} cy={cy} r={7} fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity={0.6} />

          {/* 1. AVERAGE POPULATION (50% • POPULATION BASELINE): SOLID GRAY SPHERE */}
          <path
            d={popSplineD}
            fill="url(#oceanGraySphereGradient)"
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#oceanGrayGlow)"
            className="transition-all duration-300 ease-out"
          />

          {/* 5 Benchmark Pips on the Gray Sphere Rim */}
          <g>
            {popPoints.map((p, idx) => (
              <circle
                key={`pop-pip-${idx}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="#64748B"
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            ))}
          </g>

          {/* Population Average Baseline Callout Label */}
          <text
            x={cx}
            y={cy - 79}
            textAnchor="middle"
            fill="#475569"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.04em"
          >
            TYPICAL AVERAGE (50%)
          </text>

          {/* 2. PARTICIPANT'S PERSONAL OCEAN PROFILE: SOLID ORANGE SPHERE */}
          <path
            d={participantSplineD}
            fill="url(#oceanAmberGradient)"
            stroke="#D97706"
            strokeWidth="2.8"
            strokeLinejoin="round"
            filter="url(#oceanAmberGlow)"
            className="transition-all duration-300 ease-out"
          />

          {/* 3. 5 SCIENTIFIC MEASUREMENT VERTEX NODES & BADGES */}
          <g>
            {OCEAN_AXES.map((axis, idx) => {
              const p = participantPoints[idx];
              const score = scoresMap[axis.key] ?? 50;

              // Outer label coordinates
              const rad = (axis.angleDeg * Math.PI) / 180;
              const textR = 175;
              const tx = cx + textR * Math.cos(rad);
              const ty = cy + textR * Math.sin(rad) + 4;

              return (
                <g key={`node-${axis.key}`} className="select-none">
                  {/* Outer Pulsing Halo */}
                  <circle cx={p.x} cy={p.y} r={9} fill={axis.color} opacity={0.25} />
                  {/* Outer Crisp Vertex Ring */}
                  <circle cx={p.x} cy={p.y} r={6} fill="#FFFFFF" stroke={axis.color} strokeWidth={2.5} />
                  {/* Inner Solid Core Pip */}
                  <circle cx={p.x} cy={p.y} r={2.5} fill={axis.color} />
                  {/* Outer Perimeter Code & Score Badge */}
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill={axis.color}
                  >
                    {axis.code} {score}%
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 5 Primary Ocean Trait Breakdown Cards with Population Deltas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {OCEAN_AXES.map((axis) => {
          const score = scoresMap[axis.key] ?? 50;
          const delta = formatDelta(score);
          return (
            <div
              key={`card-${axis.key}`}
              className="p-4 rounded-xl border border-border bg-surface space-y-2.5 shadow-warm-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: axis.color }} />
                  <span className="text-xs font-mono uppercase font-bold" style={{ color: axis.color }}>
                    {axis.code} • {axis.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-sm font-bold text-charcoal-900">{score}%</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {delta.text}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-charcoal-600 leading-tight">
                {axis.description}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-charcoal-500">
                  <span>Low: {axis.poleLow}</span>
                  <span>High: {axis.poleHigh}</span>
                </div>
                <div className="w-full bg-canvas-subtle h-2 rounded-full overflow-hidden border border-border relative">
                  {/* 50% Median Line */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#475569] z-10" title="50% Typical Average" />
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${score}%`, backgroundColor: axis.color }}
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
