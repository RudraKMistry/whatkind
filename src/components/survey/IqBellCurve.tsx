"use client";

import React, { useMemo } from "react";

interface IqBellCurveProps {
  iqScore: number;
  sem?: number;
  percentile?: number;
  classification?: string;
}

export function IqBellCurve({
  iqScore,
  sem = 4,
  percentile = 50,
  classification = "Average",
}: IqBellCurveProps) {
  // SVG Dimensions
  const width = 640;
  const height = 260;
  const padLeft = 40;
  const padRight = 40;
  const padTop = 45;
  const padBottom = 45;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const baselineY = height - padBottom;

  const minIq = 55;
  const maxIq = 145;
  const mean = 100;
  const sd = 15;

  // Gaussian formula: f(x) = exp(-0.5 * ((x - mu)/sd)^2)
  const gaussian = (x: number) => {
    const z = (x - mean) / sd;
    return Math.exp(-0.5 * z * z);
  };

  const iqToX = (iq: number) => {
    const clamped = Math.max(minIq, Math.min(maxIq, iq));
    return padLeft + ((clamped - minIq) / (maxIq - minIq)) * plotWidth;
  };

  // Generate full curve points
  const { fullCurvePath, shadedCurvePath, userX } = useMemo(() => {
    const points: [number, number][] = [];
    const steps = 90;

    for (let i = 0; i <= steps; i++) {
      const curIq = minIq + (i / steps) * (maxIq - minIq);
      const x = iqToX(curIq);
      const y = baselineY - gaussian(curIq) * plotHeight;
      points.push([x, y]);
    }

    // Build SVG path string for the line
    const fullPath = points
      .map(([x, y], idx) => `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");

    // Build shaded area path up to user's IQ
    const targetX = iqToX(iqScore);
    const shadedPoints = points.filter(([x]) => x <= targetX);

    // Add exact user point
    const userY = baselineY - gaussian(iqScore) * plotHeight;
    shadedPoints.push([targetX, userY]);

    let shadedPath = "";
    if (shadedPoints.length > 0) {
      shadedPath = `M ${shadedPoints[0][0].toFixed(1)} ${baselineY} `;
      shadedPath += shadedPoints
        .map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`)
        .join(" ");
      shadedPath += ` L ${targetX.toFixed(1)} ${baselineY} Z`;
    }

    return {
      fullCurvePath: fullPath,
      shadedCurvePath: shadedPath,
      userX: targetX,
    };
  }, [iqScore]);

  // Major ticks on X-axis (70, 85, 100, 115, 130, 145)
  const ticks = [
    { iq: 70, label: "70 (-2 SD)", sub: "Well Below Avg" },
    { iq: 85, label: "85 (-1 SD)", sub: "Lower Avg" },
    { iq: 100, label: "100 (Avg)", sub: "Middle" },
    { iq: 115, label: "115 (+1 SD)", sub: "Higher Avg" },
    { iq: 130, label: "130 (+2 SD)", sub: "Top 2%" },
    { iq: 145, label: "145 (+3 SD)", sub: "Rare High" },
  ];

  const lowerCiX = iqToX(iqScore - sem);
  const upperCiX = iqToX(iqScore + sem);

  return (
    <div className="rounded-tactile border border-border bg-surface p-5 sm:p-7 shadow-warm-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h3 className="text-base font-semibold text-charcoal-900">
            Where Your Score Sits Compared to Everyone Else (Bell Curve)
          </h3>
          <p className="text-xs text-charcoal-500">
            Most people score near the middle (100), with typical scores spreading out by 15 points on each side.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-canvas-subtle border border-border text-xs font-mono">
          <span className="text-charcoal-500 font-medium">Likely True Range:</span>
          <span className="font-bold text-primary">
            {iqScore - sem} – {iqScore + sem} (±{sem} pts)
          </span>
        </div>
      </div>

      {/* Responsive SVG Container */}
      <div className="w-full overflow-x-auto select-none pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Shaded Area Gradient */}
            <linearGradient id="bellCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.05" />
            </linearGradient>

            {/* Glowing filter for participant marker */}
            <filter id="glowMarker" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D97706" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background Grid Lines (Horizontal) */}
          <line
            x1={padLeft}
            y1={baselineY - plotHeight * 0.5}
            x2={width - padRight}
            y2={baselineY - plotHeight * 0.5}
            stroke="#E7E5E4"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={padLeft}
            y1={baselineY}
            x2={width - padRight}
            y2={baselineY}
            stroke="#78716C"
            strokeWidth="1.5"
          />

          {/* Standard Deviation Bands (Vertical Reference Guides) */}
          {ticks.map((t) => {
            const x = iqToX(t.iq);
            return (
              <line
                key={t.iq}
                x1={x}
                y1={padTop}
                x2={x}
                y2={baselineY}
                stroke={t.iq === 100 ? "#A8A29E" : "#E7E5E4"}
                strokeWidth={t.iq === 100 ? "1.5" : "1"}
                strokeDasharray={t.iq === 100 ? undefined : "3 3"}
              />
            );
          })}

          {/* Shaded Area Under Curve */}
          <path d={shadedCurvePath} fill="url(#bellCurveGradient)" />

          {/* Main Bell Curve Contour Line */}
          <path
            d={fullCurvePath}
            fill="none"
            stroke="#44403C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Standard Error Margin Band (CI 95%) on Baseline */}
          <rect
            x={lowerCiX}
            y={baselineY - 4}
            width={Math.max(6, upperCiX - lowerCiX)}
            height="8"
            rx="4"
            fill="#D97706"
            fillOpacity="0.3"
          />
          <line
            x1={lowerCiX}
            y1={baselineY}
            x2={upperCiX}
            y2={baselineY}
            stroke="#D97706"
            strokeWidth="3"
          />

          {/* User Score Vertical Needle */}
          <line
            x1={userX}
            y1={padTop - 5}
            x2={userX}
            y2={baselineY}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* User Pin / Head Marker */}
          <circle
            cx={userX}
            cy={padTop - 8}
            r="6"
            fill="#D97706"
            stroke="#FFFFFF"
            strokeWidth="2"
            filter="url(#glowMarker)"
          />

          {/* User Score Label Tooltip Badge */}
          <g transform={`translate(${Math.max(85, Math.min(width - 85, userX))}, ${padTop - 24})`}>
            <rect
              x="-78"
              y="-12"
              width="156"
              height="22"
              rx="6"
              fill="#1C1917"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <text
              x="0"
              y="2.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              IQ {iqScore} • Higher than {percentile}%
            </text>
          </g>

          {/* X-Axis Ticks & Labels */}
          {ticks.map((t) => {
            const x = iqToX(t.iq);
            return (
              <g key={t.iq} transform={`translate(${x}, ${baselineY + 14})`}>
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fill="#44403C"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {t.iq}
                </text>
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#78716C"
                  fontSize="9"
                  fontFamily="sans-serif"
                >
                  {t.sub}
                </text>
              </g>
            );
          })}

          {/* Y-Axis Label */}
          <text
            x={padLeft - 10}
            y={padTop + 20}
            textAnchor="end"
            fill="#A8A29E"
            fontSize="10"
            fontFamily="monospace"
          >
            How Common
          </text>
        </svg>
      </div>

      {/* Bell Curve Stratum Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-xs">
        <div className="p-2 rounded-lg bg-canvas-subtle border border-border">
          <span className="block font-mono text-[10px] text-charcoal-500 uppercase">Middle Range (68%)</span>
          <span className="font-semibold text-charcoal-900">IQ 85 – 115</span>
        </div>
        <div className="p-2 rounded-lg bg-canvas-subtle border border-border">
          <span className="block font-mono text-[10px] text-charcoal-500 uppercase">Above Average</span>
          <span className="font-semibold text-charcoal-900">IQ 115 – 120</span>
        </div>
        <div className="p-2 rounded-lg bg-canvas-subtle border border-border">
          <span className="block font-mono text-[10px] text-charcoal-500 uppercase">High Score</span>
          <span className="font-semibold text-charcoal-900">IQ 120 – 129</span>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
          <span className="block font-mono text-[10px] text-primary uppercase font-bold">Very High (Top 2%)</span>
          <span className="font-bold text-primary">IQ 130+ (Mensa Level)</span>
        </div>
      </div>
    </div>
  );
}
