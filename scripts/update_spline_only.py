import os

# 1. Update ui-genius-demo.html JavaScript
demo_path = 'e:/projects/survey/ui-genius-demo.html'
with open(demo_path, 'r', encoding='utf-8') as f:
    demo_content = f.read()

# Replace the script section in ui-genius-demo.html
script_start = demo_content.find('// GRAND COGNITIVE TOPOLOGY STUDIO: ENGINE & INTERACTION SYSTEM')
if script_start == -1:
    script_start = demo_content.find('let activeArchetypeMode =')
    
script_end = demo_content.find('// Case Study Switcher for Visual Solutions Autopsy')

if script_start != -1 and script_end != -1:
    # Back up to the comment header
    header_idx = demo_content.rfind('// ====', 0, script_start)
    if header_idx != -1:
        script_start = header_idx

    new_demo_script = """    // =====================================================================
    // 8-FACET BIOMETRIC SPLINE ENGINE & TACTILE INTERACTION SYSTEM
    // =====================================================================
    let is3DTiltActive = false;
    let activeBenchmark = 'median';
    let draggingFacetId = null;

    // 8-Facet CHC Score State (0 - 100)
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

    // Benchmark Reference Profiles (Calibrated on 8-Facet CHC)
    const benchmarkProfiles = {
      median: { label: '50% Pop. Median (IQ 100)', scores: { gf1: 50, gf2: 50, gv1: 50, gv2: 50, gq1: 50, gq2: 50, gc1: 50, gc2: 50 } },
      high: { label: 'High Tier (84% • 1σ • IQ 115)', scores: { gf1: 84, gf2: 84, gv1: 84, gv2: 84, gq1: 84, gq2: 84, gc1: 84, gc2: 84 } },
      mensa: { label: 'Mensa Elite (98% • 2σ • IQ 130)', scores: { gf1: 98, gf2: 98, gv1: 98, gv2: 98, gq1: 98, gq2: 98, gc1: 98, gc2: 98 } },
      einstein: { label: 'Einstein (Theoretical Intuition)', scores: { gf1: 99, gf2: 97, gv1: 94, gv2: 91, gq1: 96, gq2: 94, gc1: 85, gc2: 82 } },
      turing: { label: 'Alan Turing (Algorithmic Logic)', scores: { gf1: 96, gf2: 95, gv1: 80, gv2: 78, gq1: 99, gq2: 99, gc1: 92, gc2: 90 } },
      davinci: { label: 'Leonardo da Vinci (Spatial-Empirical)', scores: { gf1: 95, gf2: 93, gv1: 100, gv2: 98, gq1: 85, gq2: 84, gc1: 93, gc2: 92 } }
    };

    // Forensic Clinical Diagnostic Database
    const forensicLookup = {
      gf1: {
        dot: '#D97706',
        title: 'Gf₁ • Fluid Pattern Induction (Raven Abstract Logic)',
        percentile: '98th Percentile (Superior)',
        ci: 'SEM ±3.4 pts (95% CI: 89 – 97) • Reliability α = 0.94',
        strengths: 'Rapid extraction of orthogonal Latin matrix invariants, 2D shape parity, and hierarchical rule nesting.',
        drill: 'Dynamic 3-Back Visual Invariance & 4x4 Latin Matrix Puzzles',
        insight: 'Strong abstract induction decouples visual distractors from essential core invariants without cognitive fatigue.'
      },
      gf2: {
        dot: '#F59E0B',
        title: 'Gf₂ • Fluid Rule Extrapolation (Transformational Series)',
        percentile: '94th Percentile (High)',
        ci: 'SEM ±3.8 pts (95% CI: 84 – 92) • Reliability α = 0.91',
        strengths: 'Synthesizing multi-step sequential state transitions across discrete cyclical symbol systems.',
        drill: 'Cyclical Polyomino Sequences & Progressive State Mutation Drill',
        insight: 'High fidelity in forward projective modeling with minimal retroactive interference from solved steps.'
      },
      gv1: {
        dot: '#2563EB',
        title: 'Gv₁ • Visual-Spatial 3D Mental Rotation & Isometric Vectoring',
        percentile: '96th Percentile (Superior)',
        ci: 'SEM ±3.6 pts (95% CI: 86 – 94) • Reliability α = 0.93',
        strengths: 'Instantaneous multi-axis mental rotation of folded isometric nets and bilateral volumetric projections.',
        drill: '3D Unfolding Isometric Cube Nets & Dual-Axis Chiral Transformations',
        insight: 'Vivid spatial working buffer allowing parallel mental simulation of competing 3D spatial orientations.'
      },
      gv2: {
        dot: '#3B82F6',
        title: 'Gv₂ • Visual-Spatial Working Memory & Coordinate Tracking',
        percentile: '92nd Percentile (Above Average)',
        ci: 'SEM ±4.1 pts (95% CI: 81 – 89) • Reliability α = 0.89',
        strengths: 'Holding complex coordinate configurations in short-term spatial buffer while performing logical operations.',
        drill: 'Corsi Block Grid Sequences & Spatial Matrix Recall',
        insight: 'High resistance to decay under high visual load; maintains positional acuity across complex matrices.'
      },
      gq1: {
        dot: '#059669',
        title: 'Gq₁ • Quantitative Sequence Induction & Interleaved Series',
        percentile: '90th Percentile (High)',
        ci: 'SEM ±3.9 pts (95% CI: 78 – 86) • Reliability α = 0.92',
        strengths: 'Detecting recursive second-order polynomial differences and interleaved exponential patterns.',
        drill: 'Multi-Tiered Fibonacci Sequences & Polynomial Interpolation Drills',
        insight: 'Strong numerical intuition enables rapid hypothesis testing of arithmetic and geometric ratios.'
      },
      gq2: {
        dot: '#10B981',
        title: 'Gq₂ • Quantitative Algorithmic Logic & Modular Arithmetic',
        percentile: '88th Percentile (Above Average)',
        ci: 'SEM ±4.2 pts (95% CI: 76 – 84) • Reliability α = 0.90',
        strengths: 'Deconstructing algorithmic transformations, modulo operations, and base-rate numerical relations.',
        drill: 'Modular Arithmetic Ciphers & Algorithmic Constraint Satisfaction',
        insight: 'Consistent computational precision; minimal calculation slips under timed testing pressure.'
      },
      gc1: {
        dot: '#7C3AED',
        title: 'Gc₁ • Deductive Categorical Syllogisms & Formal Invariance',
        percentile: '93rd Percentile (High)',
        ci: 'SEM ±3.7 pts (95% CI: 80 – 88) • Reliability α = 0.93',
        strengths: 'Unflinching adherence to formal deductive validity over intuitive semantic plausibility.',
        drill: 'Aristotelian Syllogism Verification & Quantified Predicate Logic',
        insight: 'Immunized against belief bias; accurately isolates formal logical necessity from empirical truth.'
      },
      gc2: {
        dot: '#8B5CF6',
        title: 'Gc₂ • Deductive Relational Invariance & Propositional Logic',
        percentile: '86th Percentile (Solid)',
        ci: 'SEM ±4.3 pts (95% CI: 74 – 82) • Reliability α = 0.88',
        strengths: 'Tracing multi-clause transitive chains (A>B, B>C) and Boolean truth-table evaluations.',
        drill: 'Multi-Conditional Truth Tables & Transitive Relational Mazes',
        insight: 'Efficient parsing of complex conditional premises with strong error-detection heuristics.'
      }
    };

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

    // Main Dynamic Render Loop (8-Facet Biometric Spline)
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

      // 2. Render Benchmark Comparison Overlay Layer (Spline)
      const benchPath = document.getElementById('benchmark-overlay-path');
      const benchLabel = document.getElementById('benchmark-overlay-label');
      if (benchPath && benchLabel) {
        if (activeBenchmark === 'none' || !benchmarkProfiles[activeBenchmark]) {
          benchPath.style.opacity = '0';
          benchLabel.style.opacity = '0';
        } else {
          benchPath.style.opacity = '0.85';
          benchLabel.style.opacity = '1';
          const bProfile = benchmarkProfiles[activeBenchmark];
          benchLabel.textContent = bProfile.label;

          const bPoints = facetDefs.map(f => {
            const bScore = bProfile.scores[f.id] || 50;
            return getFacetCoords(f, bScore);
          });
          benchPath.setAttribute('d', getClosedSplinePath(bPoints));
        }
      }

      // 3. Render 8 Draggable Vertex Nodes & Handles
      const handlesContainer = document.getElementById('handles-container');
      if (handlesContainer) {
        handlesContainer.innerHTML = '';
        facetDefs.forEach((f, idx) => {
          const p = points[idx];
          const score = facetScores[f.id];

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('id', `handle-${f.id}`);
          g.setAttribute('class', 'cursor-grab active:cursor-grabbing transition-transform duration-75');

          // Transparent broad touch/click hit area
          const hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          hit.setAttribute('cx', p.x);
          hit.setAttribute('cy', p.y);
          hit.setAttribute('r', '18');
          hit.setAttribute('fill', 'transparent');
          hit.onmousedown = (e) => startRadarDrag(e, f.id);
          hit.ontouchstart = (e) => startRadarDrag(e, f.id);
          hit.onclick = (e) => { e.stopPropagation(); inspectVector(f.id); };
          g.appendChild(hit);

          // Animated Pulsing Halo
          const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          halo.setAttribute('cx', p.x);
          halo.setAttribute('cy', p.y);
          halo.setAttribute('r', '9');
          halo.setAttribute('fill', f.color);
          halo.setAttribute('opacity', '0.22');
          halo.setAttribute('class', 'animate-pulse');
          g.appendChild(halo);

          // Outer vertex ring
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
          text.style.cursor = 'pointer';
          text.onclick = (e) => { e.stopPropagation(); inspectVector(f.id); };
          g.appendChild(text);

          handlesContainer.appendChild(g);
        });
      }

      // 4. Update HUD Telemetry Statistics
      updateTelemetryHUD(facetDefs);

      // 5. Update Domain Metric Cards
      updateDomainCards();
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

    // Update 4 Primary Domain Metric Cards
    function updateDomainCards() {
      const gf = Math.round((facetScores.gf1 + facetScores.gf2) / 2);
      const gv = Math.round((facetScores.gv1 + facetScores.gv2) / 2);
      const gq = Math.round((facetScores.gq1 + facetScores.gq2) / 2);
      const gc = Math.round((facetScores.gc1 + facetScores.gc2) / 2);

      const setCard = (dom, score) => {
        const scoreEl = document.getElementById(`card-${dom}-score`);
        const barEl = document.getElementById(`bar-${dom}`);
        if (scoreEl) scoreEl.textContent = `${score}%`;
        if (barEl) barEl.style.width = `${score}%`;
      };

      setCard('gf', gf);
      setCard('gv', gv);
      setCard('gq', gq);
      setCard('gc', gc);
    }

    // 2.5D Isometric Tilt Handler
    function toggle3DTilt() {
      is3DTiltActive = !is3DTiltActive;
      const statusLbl = document.getElementById('lbl-3d-status');
      const btn = document.getElementById('btn-3d-tilt');
      const card = document.getElementById('radar-3d-card');

      if (is3DTiltActive) {
        if (statusLbl) statusLbl.textContent = 'ON';
        if (btn) btn.className = 'px-2.5 py-1 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] text-[11px] font-semibold text-[var(--accent)] transition-all flex items-center gap-1.5 shadow-sm';
        if (card) {
          card.style.transform = 'perspective(900px) rotateX(14deg) rotateY(-8deg) scale3d(1.02, 1.02, 1.02)';
          card.style.boxShadow = '0 20px 30px -10px rgba(0,0,0,0.08)';
        }
      } else {
        if (statusLbl) statusLbl.textContent = 'OFF';
        if (btn) btn.className = 'px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[11px] font-semibold text-[var(--charcoal-muted)] hover:text-[var(--charcoal)] transition-all flex items-center gap-1.5 shadow-sm';
        if (card) {
          card.style.transform = 'none';
          card.style.boxShadow = 'none';
        }
      }
    }

    // Mouse movement perspective listener for 3D tilt
    const cardContainer = document.getElementById('radar-3d-wrapper');
    if (cardContainer) {
      cardContainer.addEventListener('mousemove', (e) => {
        if (!is3DTiltActive) return;
        const rect = cardContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        const rotY = (mouseX / (rect.width / 2)) * 15;
        const rotX = -(mouseY / (rect.height / 2)) * 15;
        const card = document.getElementById('radar-3d-card');
        if (card) {
          card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      });

      cardContainer.addEventListener('mouseleave', () => {
        if (!is3DTiltActive) return;
        const card = document.getElementById('radar-3d-card');
        if (card) {
          card.style.transform = 'perspective(900px) rotateX(14deg) rotateY(-8deg) scale3d(1.02, 1.02, 1.02)';
        }
      });
    }

    // Benchmark Comparison Layer Handler
    function handleBenchmarkSelect(val) {
      activeBenchmark = val;
      renderGrandTopology();
    }

    // Micro-Stepper Adjustments (+/- 5%)
    function adjustVector(facetId, delta) {
      const domain = facetId.slice(0, 2);
      const f1 = `${domain}1`;
      const f2 = `${domain}2`;
      facetScores[f1] = Math.max(20, Math.min(100, (facetScores[f1] || 80) + delta));
      facetScores[f2] = Math.max(20, Math.min(100, (facetScores[f2] || 80) + delta));
      renderGrandTopology();
      inspectVector(facetId);
    }

    // Forensic Diagnostic Drawer Inspector
    function inspectVector(facetId) {
      const data = forensicLookup[facetId] || forensicLookup.gf1;
      const dot = document.getElementById('forensic-badge-dot');
      const title = document.getElementById('forensic-title');
      const perc = document.getElementById('forensic-percentile');
      const ci = document.getElementById('forensic-ci');
      const strengths = document.getElementById('forensic-strengths');
      const drill = document.getElementById('forensic-drill');
      const insight = document.getElementById('forensic-insight');

      if (dot) dot.style.backgroundColor = data.dot;
      if (title) title.textContent = data.title;
      if (perc) perc.textContent = data.percentile;
      if (ci) ci.textContent = data.ci;
      if (strengths) strengths.textContent = data.strengths;
      if (drill) drill.textContent = data.drill;
      if (insight) insight.textContent = data.insight;
    }

    // Profile Presets (One-Click Morph)
    function applyProfilePreset(preset) {
      if (preset === 'polymath') {
        Object.assign(facetScores, { gf1: 94, gf2: 90, gv1: 92, gv2: 88, gq1: 95, gq2: 92, gc1: 90, gc2: 88 });
      } else if (preset === 'architect') {
        Object.assign(facetScores, { gf1: 86, gf2: 84, gv1: 99, gv2: 98, gq1: 82, gq2: 80, gc1: 78, gc2: 74 });
      } else if (preset === 'quant') {
        Object.assign(facetScores, { gf1: 92, gf2: 90, gv1: 78, gv2: 76, gq1: 99, gq2: 98, gc1: 84, gc2: 82 });
      } else if (preset === 'median') {
        Object.assign(facetScores, { gf1: 50, gf2: 50, gv1: 50, gv2: 50, gq1: 50, gq2: 50, gc1: 50, gc2: 50 });
      }
      renderGrandTopology();
    }

    // Direct Drag Initiation on Canvas Node
    function startRadarDrag(e, facetId) {
      e.preventDefault();
      draggingFacetId = facetId;
      const handle = document.getElementById(`handle-${facetId}`);
      if (handle) handle.classList.add('scale-125');
    }

    // Global Canvas Drag Handler
    function handleGlobalCanvasDrag(clientX, clientY) {
      if (!draggingFacetId) return;
      const svg = document.getElementById('radar-svg');
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const scaleX = 420 / rect.width;
      const scaleY = 420 / rect.height;
      const svgX = (clientX - rect.left) * scaleX;
      const svgY = (clientY - rect.top) * scaleY;

      const cx = 210;
      const cy = 210;
      const maxR = 150;

      const facet = facetDefs.find(f => f.id === draggingFacetId);
      if (!facet) return;

      const rad = (facet.angleDeg * Math.PI) / 180;
      const dirX = Math.cos(rad);
      const dirY = Math.sin(rad);

      // Project cursor vector onto facet's unit ray
      const dx = svgX - cx;
      const dy = svgY - cy;
      const projDistance = (dx * dirX) + (dy * dirY);

      let score = Math.round((projDistance / maxR) * 100);
      score = Math.max(20, Math.min(100, score));

      facetScores[draggingFacetId] = score;

      renderGrandTopology();
    }

    window.addEventListener('mousemove', (e) => {
      if (draggingFacetId) {
        e.preventDefault();
        handleGlobalCanvasDrag(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      if (draggingFacetId) {
        const handle = document.getElementById(`handle-${draggingFacetId}`);
        if (handle) handle.classList.remove('scale-125');
        draggingFacetId = null;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (draggingFacetId && e.touches.length > 0) {
        e.preventDefault();
        handleGlobalCanvasDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      if (draggingFacetId) {
        const handle = document.getElementById(`handle-${draggingFacetId}`);
        if (handle) handle.classList.remove('scale-125');
        draggingFacetId = null;
      }
    });
"""

    demo_content = demo_content[:script_start] + new_demo_script + "\n\n" + demo_content[script_end:]
    with open(demo_path, 'w', encoding='utf-8') as f:
        f.write(demo_content)
    print("Successfully updated ui-genius-demo.html script!")
else:
    print(f"Could not locate markers: start={script_start}, end={script_end}")
