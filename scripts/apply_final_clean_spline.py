import os

demo_path = 'e:/projects/survey/ui-genius-demo.html'
with open(demo_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace Left Column Markup
left_start_marker = '<!-- Left: Grand Cognitive Topology Studio (7 Cols) -->'
left_end_marker = '<!-- Right: Visual Solutions Autopsy Suite (5 Cols) -->'

start_idx = content.find(left_start_marker)
end_idx = content.find(left_end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error locating left column markers: start={start_idx}, end={end_idx}")
    exit(1)

new_left_column = """<!-- Left: 8-Facet Biometric Spline Topology (7 Cols) -->
        <div class="lg:col-span-7 tactile-card p-6 sm:p-8 space-y-6">
          <!-- Top Header: 8-Facet Biometric Spline Topology -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <span class="text-xs font-mono uppercase text-[var(--accent)] font-bold tracking-wider block flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
                8-Facet Biometric Spline Topology
              </span>
              <h3 class="text-base font-bold text-[var(--charcoal)]">
                Cattell-Horn-Carroll Cognitive Profile vs. Population Norms
              </h3>
            </div>
            
            <!-- Highlighted Comparative Legend -->
            <div class="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs font-mono">
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <span class="h-2.5 w-2.5 rounded-full bg-[#D97706]"></span>
                <span class="font-bold text-[var(--charcoal)]">Your Profile</span>
              </div>
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <span class="h-2 w-2 rounded-sm border border-dashed border-[#78716C] bg-[#78716C]/20"></span>
                <span class="font-bold text-[var(--charcoal-muted)]">Pop. Average (50%)</span>
              </div>
            </div>
          </div>

          <!-- 2D Scientific Radar Canvas (Clean, Non-Interactive, Highlighting Average Population) -->
          <div class="relative flex justify-center py-2 overflow-hidden select-none">
            <!-- Canvas SVG (420x420, Center 210, 210, Radius 150) -->
            <svg
              id="radar-svg"
              width="420"
              height="420"
              viewBox="0 0 420 420"
              class="overflow-visible select-none max-w-full"
            >
              <defs>
                <!-- Participant Biometric Amber Gradient -->
                <linearGradient id="warmAmberRadarGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#D97706" stop-opacity="0.42" />
                  <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#D97706" stop-opacity="0.08" />
                </linearGradient>

                <!-- Shaded Neutral Core for 50% Population Average Highlight -->
                <radialGradient id="averagePopulationGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#78716C" stop-opacity="0.12" />
                  <stop offset="70%" stop-color="#78716C" stop-opacity="0.08" />
                  <stop offset="100%" stop-color="#78716C" stop-opacity="0.03" />
                </radialGradient>

                <radialGradient id="dialRadialBackdrop" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#FAF8F5" stop-opacity="1" />
                  <stop offset="85%" stop-color="#F5F2EB" stop-opacity="1" />
                  <stop offset="100%" stop-color="#EAE5DC" stop-opacity="1" />
                </radialGradient>

                <filter id="radarVertexGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#D97706" flood-opacity="0.4" />
                </filter>
              </defs>

              <!-- Instrument Dial Backing Disk -->
              <circle cx="210" cy="210" r="162" fill="url(#dialRadialBackdrop)" stroke="var(--border)" stroke-width="1.5" />
              <circle cx="210" cy="210" r="168" fill="none" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 4" />

              <!-- 24 Compass Degree Calibration Tick Marks -->
              <g stroke="var(--border)" stroke-width="1" opacity="0.8">
                <line x1="210" y1="48" x2="210" y2="58" stroke-width="2" />
                <line x1="372" y1="210" x2="362" y2="210" stroke-width="2" />
                <line x1="210" y1="372" x2="210" y2="362" stroke-width="2" />
                <line x1="48" y1="210" x2="58" y2="210" stroke-width="2" />
                <line x1="316" y1="104" x2="309" y2="111" stroke-width="1.8" />
                <line x1="316" y1="316" x2="309" y2="309" stroke-width="1.8" />
                <line x1="104" y1="316" x2="111" y2="309" stroke-width="1.8" />
                <line x1="104" y1="104" x2="111" y2="111" stroke-width="1.8" />
              </g>

              <!-- Concentric Polar Circular Web Rings (20%, 40%, 60%, 80%, 100%) -->
              <circle cx="210" cy="210" r="30" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" opacity="0.45" />
              <circle cx="210" cy="210" r="60" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" opacity="0.45" />
              <circle cx="210" cy="210" r="90" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" opacity="0.55" />
              <circle cx="210" cy="210" r="120" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" opacity="0.65" />
              <circle cx="210" cy="210" r="150" fill="none" stroke="var(--border)" stroke-width="1.8" />

              <!-- Degree / Ring Labels -->
              <text x="214" y="123" fill="var(--charcoal-muted)" font-size="8" font-family="monospace">60%</text>
              <text x="214" y="93" fill="var(--charcoal-muted)" font-size="8" font-family="monospace">80%</text>
              <text x="214" y="63" fill="var(--charcoal-muted)" font-size="8" font-family="monospace">100%</text>

              <!-- 8 Polar Degree Quadrant Radial Spokes -->
              <g stroke="var(--border)" stroke-width="1.2" opacity="0.65">
                <line x1="210" y1="48" x2="210" y2="372" />
                <line x1="48" y1="210" x2="372" y2="210" />
                <line x1="104" y1="104" x2="316" y2="316" stroke-dasharray="2 3" />
                <line x1="104" y1="316" x2="316" y2="104" stroke-dasharray="2 3" />
              </g>

              <!-- Central Reticle Hub -->
              <circle cx="210" cy="210" r="3.5" fill="var(--accent)" />
              <circle cx="210" cy="210" r="7" fill="none" stroke="var(--accent)" stroke-width="0.8" opacity="0.6" />

              <!-- HIGHLIGHTED AVERAGE POPULATION BENCHMARK CORE (50% • IQ 100) -->
              <path
                id="benchmark-overlay-path"
                d=""
                fill="url(#averagePopulationGradient)"
                stroke="#78716C"
                stroke-width="2"
                stroke-dasharray="4 4"
                opacity="0.9"
              />
              <text
                x="214"
                y="140"
                fill="#57534E"
                font-size="9"
                font-family="monospace"
                font-weight="700"
                letter-spacing="0.02em"
              >
                Average Population (50% • IQ 100)
              </text>

              <!-- PARTICIPANT ACTIVE 8-FACET BIOMETRIC SPLINE PATH -->
              <path
                id="topology-main-path"
                d=""
                fill="url(#warmAmberRadarGradient)"
                stroke="#D97706"
                stroke-width="2.8"
                stroke-linejoin="round"
                filter="url(#radarVertexGlow)"
                class="transition-all duration-300 ease-out"
              />

              <!-- 8 SCIENTIFIC MEASUREMENT VERTEX NODES & BADGES -->
              <g id="handles-container">
                <!-- Dynamically populated in JS -->
              </g>
            </svg>
          </div>

          <!-- Dynamic Telemetry Statistics Ribbon -->
          <div class="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] font-mono text-center shadow-inner">
            <div class="space-y-0.5">
              <span class="text-[10px] uppercase text-[var(--charcoal-muted)] font-bold block">Cognitive Volume</span>
              <span id="telemetry-volume" class="text-sm sm:text-base font-bold text-[var(--accent)]">74.8%</span>
              <span class="text-[9px] text-[var(--charcoal-muted)] block">of Total Mental Space</span>
            </div>
            <div class="space-y-0.5 border-x border-[var(--border)]">
              <span class="text-[10px] uppercase text-[var(--charcoal-muted)] font-bold block">Isotropy / Balance</span>
              <span id="telemetry-balance" class="text-sm sm:text-base font-bold text-emerald-600">92%</span>
              <span class="text-[9px] text-[var(--charcoal-muted)] block">Harmonic Symmetry</span>
            </div>
            <div class="space-y-0.5">
              <span class="text-[10px] uppercase text-[var(--charcoal-muted)] font-bold block">Phenotype Apex</span>
              <span id="telemetry-apex" class="text-xs sm:text-sm font-bold text-[var(--charcoal)] truncate block">Fluid-Spatial</span>
              <span class="text-[9px] text-emerald-700 block font-semibold">Dual Dominance</span>
            </div>
          </div>

          <!-- 4 Primary Domain Breakdown Cards with Population Delta Badges -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <!-- Fluid Reasoning -->
            <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-warm-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full bg-[#D97706]"></span>
                  <span class="text-xs font-mono uppercase text-[#D97706] font-bold">Gf • Fluid Logic</span>
                </div>
                <div class="flex items-center gap-2 font-mono">
                  <span class="text-sm font-bold text-[var(--charcoal)]" id="card-gf-score">90%</span>
                  <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    +40% vs Pop. Avg
                  </span>
                </div>
              </div>
              <p class="text-[11px] text-[var(--charcoal-muted)] leading-tight">
                Abstract non-verbal pattern induction, transformation rules, and invariant reasoning.
              </p>
              <div class="space-y-1">
                <div class="flex justify-between text-[10px] font-mono text-[var(--charcoal-muted)]">
                  <span>Gf₁ Pattern: <strong class="text-[var(--charcoal)]">92%</strong></span>
                  <span>Gf₂ Extrapolation: <strong class="text-[var(--charcoal)]">88%</strong></span>
                </div>
                <div class="w-full bg-[var(--surface-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border)] relative">
                  <div class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#78716C]/60 z-10" title="50% Population Median"></div>
                  <div id="bar-gf" class="h-full bg-[#D97706] rounded-full transition-all duration-300" style="width: 90%;"></div>
                </div>
              </div>
            </div>

            <!-- Visual-Spatial -->
            <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-warm-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full bg-[#2563EB]"></span>
                  <span class="text-xs font-mono uppercase text-[#2563EB] font-bold">Gv • Spatial Processing</span>
                </div>
                <div class="flex items-center gap-2 font-mono">
                  <span class="text-sm font-bold text-[var(--charcoal)]" id="card-gv-score">88%</span>
                  <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    +38% vs Pop. Avg
                  </span>
                </div>
              </div>
              <p class="text-[11px] text-[var(--charcoal-muted)] leading-tight">
                Mental 3D rotation, isometric cube net unfolding, and bilateral spatial vectoring.
              </p>
              <div class="space-y-1">
                <div class="flex justify-between text-[10px] font-mono text-[var(--charcoal-muted)]">
                  <span>Gv₁ 3D Rotation: <strong class="text-[var(--charcoal)]">90%</strong></span>
                  <span>Gv₂ Spatial Memory: <strong class="text-[var(--charcoal)]">85%</strong></span>
                </div>
                <div class="w-full bg-[var(--surface-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border)] relative">
                  <div class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#78716C]/60 z-10" title="50% Population Median"></div>
                  <div id="bar-gv" class="h-full bg-[#2563EB] rounded-full transition-all duration-300" style="width: 88%;"></div>
                </div>
              </div>
            </div>

            <!-- Quantitative -->
            <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-warm-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full bg-[#059669]"></span>
                  <span class="text-xs font-mono uppercase text-[#059669] font-bold">Gq • Quantitative Logic</span>
                </div>
                <div class="flex items-center gap-2 font-mono">
                  <span class="text-sm font-bold text-[var(--charcoal)]" id="card-gq-score">81%</span>
                  <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    +31% vs Pop. Avg
                  </span>
                </div>
              </div>
              <p class="text-[11px] text-[var(--charcoal-muted)] leading-tight">
                Recursive numerical sequences, difference polynomials, and modular algorithmic ciphers.
              </p>
              <div class="space-y-1">
                <div class="flex justify-between text-[10px] font-mono text-[var(--charcoal-muted)]">
                  <span>Gq₁ Induction: <strong class="text-[var(--charcoal)]">82%</strong></span>
                  <span>Gq₂ Algorithmic: <strong class="text-[var(--charcoal)]">80%</strong></span>
                </div>
                <div class="w-full bg-[var(--surface-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border)] relative">
                  <div class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#78716C]/60 z-10" title="50% Population Median"></div>
                  <div id="bar-gq" class="h-full bg-[#059669] rounded-full transition-all duration-300" style="width: 81%;"></div>
                </div>
              </div>
            </div>

            <!-- Deductive -->
            <div class="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-warm-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full bg-[#7C3AED]"></span>
                  <span class="text-xs font-mono uppercase text-[#7C3AED] font-bold">Gc • Deductive Syllogisms</span>
                </div>
                <div class="flex items-center gap-2 font-mono">
                  <span class="text-sm font-bold text-[var(--charcoal)]" id="card-gc-score">81%</span>
                  <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    +31% vs Pop. Avg
                  </span>
                </div>
              </div>
              <p class="text-[11px] text-[var(--charcoal-muted)] leading-tight">
                Aristotelian quantified predicate logic, categorical premises, and formal relational invariance.
              </p>
              <div class="space-y-1">
                <div class="flex justify-between text-[10px] font-mono text-[var(--charcoal-muted)]">
                  <span>Gc₁ Syllogisms: <strong class="text-[var(--charcoal)]">84%</strong></span>
                  <span>Gc₂ Propositional: <strong class="text-[var(--charcoal)]">78%</strong></span>
                </div>
                <div class="w-full bg-[var(--surface-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border)] relative">
                  <div class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#78716C]/60 z-10" title="50% Population Median"></div>
                  <div id="bar-gc" class="h-full bg-[#7C3AED] rounded-full transition-all duration-300" style="width: 81%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        """

content = content[:start_idx] + new_left_column + content[end_idx:]

# 2. Replace Script section with clean non-interactive 8-Facet Biometric Spline
script_start = content.find('// 8-FACET BIOMETRIC SPLINE ENGINE & TACTILE INTERACTION SYSTEM')
if script_start == -1:
    script_start = content.find('// GRAND COGNITIVE TOPOLOGY STUDIO')
if script_start == -1:
    script_start = content.find('const facetScores =')

script_end = content.find('// Case Study Switcher for Visual Solutions Autopsy')

header_idx = content.rfind('// ====', 0, script_start)
if header_idx != -1:
    script_start = header_idx

new_script = """// =====================================================================
    // 8-FACET BIOMETRIC SPLINE ENGINE (NON-INTERACTIVE, POPULATION BENCHMARK)
    // =====================================================================
    // 8-Facet CHC Profile State
    const facetScores = {
      gf1: 92, // Pattern Induction (-90deg, Top)
      gf2: 88, // Rule Extrapolation (-45deg, Top-Right)
      gv1: 90, // 3D Mental Rotation (0deg, Right)
      gv2: 85, // Spatial Working Memory (45deg, Bottom-Right)
      gq1: 82, // Quantitative Induction (90deg, Bottom)
      gq2: 80, // Algorithmic Logic (135deg, Bottom-Left)
      gc1: 84, // Deductive Syllogisms (180deg, Left)
      gc2: 78  // Relational Invariance (225deg, Top-Left)
    };

    // 8 Facet Definitions with Polar Angles (Center = 210, 210, R = 150)
    const facetDefs = [
      { id: 'gf1', code: 'Gf₁', label: 'Pattern Induction', domain: 'gf', angleDeg: -90, color: '#D97706' },
      { id: 'gf2', code: 'Gf₂', label: 'Rule Extrapolation', domain: 'gf', angleDeg: -45, color: '#F59E0B' },
      { id: 'gv1', code: 'Gv₁', label: '3D Rotation', domain: 'gv', angleDeg: 0, color: '#2563EB' },
      { id: 'gv2', code: 'Gv₂', label: 'Spatial Memory', domain: 'gv', angleDeg: 45, color: '#3B82F6' },
      { id: 'gq1', code: 'Gq₁', label: 'Sequence Induction', domain: 'gq', angleDeg: 90, color: '#059669' },
      { id: 'gq2', code: 'Gq₂', label: 'Algorithmic Logic', domain: 'gq', angleDeg: 135, color: '#10B981' },
      { id: 'gc1', code: 'Gc₁', label: 'Categorical Syllogisms', domain: 'gc', angleDeg: 180, color: '#7C3AED' },
      { id: 'gc2', code: 'Gc₂', label: 'Relational Invariance', domain: 'gc', angleDeg: 225, color: '#8B5CF6' }
    ];

    // Calculate (x, y) on 420x420 canvas (center 210, 210, max R 150)
    function getFacetCoords(facet, score) {
      const cx = 210;
      const cy = 210;
      const maxR = 150;
      const rad = (facet.angleDeg * Math.PI) / 180;
      const r = (Math.max(20, Math.min(100, score)) / 100) * maxR;
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
      };
    }

    // Catmull-Rom Smooth Closed Spline Curve Generator
    function getClosedSplinePath(points) {
      const n = points.length;
      if (n < 3) return '';
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
      d += ' Z';
      return d;
    }

    // Render 8-Facet Biometric Spline and Highlighted Population Benchmark
    function renderGrandTopology() {
      const points = facetDefs.map(f => getFacetCoords(f, facetScores[f.id]));

      // 1. Draw Participant 8-Facet Biometric Spline Shape
      const mainPath = document.getElementById('topology-main-path');
      if (mainPath) {
        mainPath.setAttribute('d', getClosedSplinePath(points));
        mainPath.setAttribute('fill', 'url(#warmAmberRadarGradient)');
        mainPath.setAttribute('stroke', '#D97706');
        mainPath.setAttribute('stroke-width', '2.8');
        mainPath.setAttribute('filter', 'url(#radarVertexGlow)');
      }

      // 2. Render Highlighted Average Population Benchmark (50% Spline)
      const benchPath = document.getElementById('benchmark-overlay-path');
      if (benchPath) {
        const popPoints = facetDefs.map(f => getFacetCoords(f, 50));
        benchPath.setAttribute('d', getClosedSplinePath(popPoints));
      }

      // 3. Render 8 Clean Scientific Measurement Vertex Nodes
      const handlesContainer = document.getElementById('handles-container');
      if (handlesContainer) {
        handlesContainer.innerHTML = '';
        facetDefs.forEach((f, idx) => {
          const p = points[idx];
          const score = facetScores[f.id];

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', 'select-none');

          // Subtle glowing halo
          const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          halo.setAttribute('cx', p.x);
          halo.setAttribute('cy', p.y);
          halo.setAttribute('r', '9');
          halo.setAttribute('fill', f.color);
          halo.setAttribute('opacity', '0.25');
          g.appendChild(halo);

          // Outer crisp ring
          const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          ring.setAttribute('cx', p.x);
          ring.setAttribute('cy', p.y);
          ring.setAttribute('r', '6');
          ring.setAttribute('fill', '#FFFFFF');
          ring.setAttribute('stroke', f.color);
          ring.setAttribute('stroke-width', '2.5');
          g.appendChild(ring);

          // Inner solid core pip
          const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          core.setAttribute('cx', p.x);
          core.setAttribute('cy', p.y);
          core.setAttribute('r', '2.5');
          core.setAttribute('fill', f.color);
          g.appendChild(core);

          // Node Text Badge (Facet Code + Score)
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          const rad = (f.angleDeg * Math.PI) / 180;
          const textR = 172;
          const tx = 210 + textR * Math.cos(rad);
          const ty = 210 + textR * Math.sin(rad) + 4;
          text.setAttribute('x', tx);
          text.setAttribute('y', ty);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('font-family', 'monospace');
          text.setAttribute('font-size', '9.5');
          text.setAttribute('font-weight', 'bold');
          text.setAttribute('fill', f.color);
          text.textContent = `${f.code} ${score}%`;
          g.appendChild(text);

          handlesContainer.appendChild(g);
        });
      }

      // 4. Update HUD Telemetry Statistics
      updateTelemetryHUD(facetDefs);
    }

    // Telemetry Statistics Calculator (Volume, Balance, Phenotype)
    function updateTelemetryHUD(facets) {
      const scores = facets.map(f => facetScores[f.id]);
      const n = scores.length;
      if (n === 0) return;

      // 1. Cognitive Volume %
      const avgScore = scores.reduce((a, b) => a + b, 0) / n;
      const vol = Math.pow(avgScore / 100, 2) * 100;
      const volEl = document.getElementById('telemetry-volume');
      if (volEl) volEl.textContent = `${vol.toFixed(1)}%`;

      // 2. Isotropy / Balance Index
      const variance = scores.reduce((sum, val) => sum + Math.pow(val - avgScore, 2), 0) / n;
      const stdDev = Math.sqrt(variance);
      const balance = Math.max(30, Math.min(100, Math.round(100 - (stdDev * 2.2))));
      const balEl = document.getElementById('telemetry-balance');
      if (balEl) {
        balEl.textContent = `${balance}%`;
        balEl.className = balance >= 85 ? 'text-sm sm:text-base font-bold text-emerald-600' : 'text-sm sm:text-base font-bold text-[var(--accent)]';
      }

      // 3. Phenotype Apex Identification
      const domainAgg = {
        Fluid: (facetScores.gf1 + facetScores.gf2) / 2,
        Spatial: (facetScores.gv1 + facetScores.gv2) / 2,
        Quant: (facetScores.gq1 + facetScores.gq2) / 2,
        Deductive: (facetScores.gc1 + facetScores.gc2) / 2
      };
      const sortedDomains = Object.entries(domainAgg).sort((a, b) => b[1] - a[1]);
      
      let apexName = 'Integrated Polymath';
      if (stdDev < 4) {
        apexName = 'Harmonic Isotropic Mind';
      } else if (sortedDomains[0][1] - sortedDomains[1][1] > 12) {
        apexName = `Pure ${sortedDomains[0][0]} Specialist`;
      } else {
        apexName = `${sortedDomains[0][0]}-${sortedDomains[1][0]}`;
      }
      const apexEl = document.getElementById('telemetry-apex');
      if (apexEl) apexEl.textContent = apexName;
    }

    // Default initialization
    setTimeout(() => {
      renderGrandTopology();
    }, 100);
"""

content = content[:script_start] + new_script + "\n\n    " + content[script_end:]

with open(demo_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully applied clean non-interactive 8-facet Biometric Spline to ui-genius-demo.html!")
