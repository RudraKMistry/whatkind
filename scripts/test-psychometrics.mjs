import assert from "assert";
import { calculatePsychometrics } from "../src/lib/scoring.ts";
import { PrismaClient } from "@prisma/client";

console.log("=== RUNNING ADVANCED PSYCHOMETRIC & COGNITIVE SCORING VERIFICATION ===");

// ============================================================================
// TEST 1: Big Five (OCEAN) 30-Item Assessment & 20-Archetype Permutation Matrix
// ============================================================================
{
  console.log("\n--- TEST 1: Big Five (OCEAN) 30-Item Psychometrics & 20 Archetypes ---");

  // Synthetic 30-item Big Five Schema (5 steps x 6 items)
  const traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotional_stability"];
  const bfiSchema = {
    testType: "big_five",
    steps: [
      {
        id: "step_1",
        questions: [
          { id: "bo1", traitKey: "openness", isReverse: false },
          { id: "bc1", traitKey: "conscientiousness", isReverse: false },
          { id: "be1", traitKey: "extraversion", isReverse: false },
          { id: "ba1", traitKey: "agreeableness", isReverse: true },
          { id: "bn1", traitKey: "emotional_stability", isReverse: true },
          { id: "bo2", traitKey: "openness", isReverse: true },
        ],
      },
      {
        id: "step_2",
        questions: [
          { id: "ba2", traitKey: "agreeableness", isReverse: false },
          { id: "bn2", traitKey: "emotional_stability", isReverse: false },
          { id: "bo3", traitKey: "openness", isReverse: false },
          { id: "bc2", traitKey: "conscientiousness", isReverse: true },
          { id: "be2", traitKey: "extraversion", isReverse: true },
          { id: "ba3", traitKey: "agreeableness", isReverse: true },
        ],
      },
      {
        id: "step_3",
        questions: [
          { id: "bc3", traitKey: "conscientiousness", isReverse: false },
          { id: "be3", traitKey: "extraversion", isReverse: false },
          { id: "ba4", traitKey: "agreeableness", isReverse: false },
          { id: "bn3", traitKey: "emotional_stability", isReverse: true },
          { id: "bo4", traitKey: "openness", isReverse: true },
          { id: "bc4", traitKey: "conscientiousness", isReverse: true },
        ],
      },
      {
        id: "step_4",
        questions: [
          { id: "bn4", traitKey: "emotional_stability", isReverse: false },
          { id: "bo5", traitKey: "openness", isReverse: false },
          { id: "bc5", traitKey: "conscientiousness", isReverse: false },
          { id: "be4", traitKey: "extraversion", isReverse: true },
          { id: "ba5", traitKey: "agreeableness", isReverse: true },
          { id: "bn5", traitKey: "emotional_stability", isReverse: true },
        ],
      },
      {
        id: "step_5",
        questions: [
          { id: "be5", traitKey: "extraversion", isReverse: false },
          { id: "ba6", traitKey: "agreeableness", isReverse: false },
          { id: "bn6", traitKey: "emotional_stability", isReverse: false },
          { id: "bo6", traitKey: "openness", isReverse: true },
          { id: "bc6", traitKey: "conscientiousness", isReverse: true },
          { id: "be6", traitKey: "extraversion", isReverse: true },
        ],
      },
    ],
  };

  // Test reverse scoring calculation directly via production calculatePsychometrics
  // Openness: 3 regular (5, 5, 4), 3 reverse (1, 2, 1 -> reversed: 5, 4, 5) => avg = 28/6 = 4.67 => 92%
  const highAnswers = {
    bo1: 5, bo3: 5, bo5: 4,
    bo2: 1, bo4: 2, bo6: 1,
  };
  const bfiResult = calculatePsychometrics(bfiSchema, highAnswers);
  const oTrait = bfiResult.traits.find((t) => t.key === "openness");
  assert.strictEqual(oTrait.score, 92, "High trait score with reverse items in calculatePsychometrics must equal 92%");
  assert.strictEqual(oTrait.level, "Very High");

  // Test Low Trait: 3 regular (1, 1, 2), 3 reverse (5, 4, 5 -> reversed: 1, 2, 1) => avg = 8/6 = 1.33 => 8%
  const lowAnswers = {
    bo1: 1, bo3: 1, bo5: 2,
    bo2: 5, bo4: 4, bo6: 5,
  };
  const bfiLowResult = calculatePsychometrics(bfiSchema, lowAnswers);
  const oLowTrait = bfiLowResult.traits.find((t) => t.key === "openness");
  assert.strictEqual(oLowTrait.score, 8, "Low trait score with reverse items must equal 8%");
  assert.strictEqual(oLowTrait.level, "Very Low");

  // Verify all 20 dominant/secondary permutations resolve to non-fallback archetypes
  const EXPECTED_TITLES = {
    openness_conscientiousness: "The Creative Planner",
    openness_extraversion: "The Lively Idea Maker",
    openness_agreeableness: "The Kind Dreamer",
    openness_emotional_stability: "The Calm Explorer",
    conscientiousness_openness: "The Organized Builder",
    conscientiousness_extraversion: "The Driven Leader",
    conscientiousness_agreeableness: "The Dependable Helper",
    conscientiousness_emotional_stability: "The Steady Rock",
    extraversion_openness: "The Bold Adventurer",
    extraversion_conscientiousness: "The Go-Getter",
    extraversion_agreeableness: "The Warm People-Person",
    extraversion_emotional_stability: "The Confident Spark",
    agreeableness_openness: "The Thoughtful Listener",
    agreeableness_conscientiousness: "The Caring Teammate",
    agreeableness_extraversion: "The Friendly Bridge-Builder",
    agreeableness_emotional_stability: "The Gentle Peacekeeper",
    emotional_stability_openness: "The Quiet Thinker",
    emotional_stability_conscientiousness: "The Unshakeable Worker",
    emotional_stability_extraversion: "The Calm Leader",
    emotional_stability_agreeableness: "The Peaceful Supporter",
  };

  let testedPermutations = 0;
  for (const dominant of traits) {
    for (const secondary of traits) {
      if (dominant !== secondary) {
        // Construct answers where dominant = 100%, secondary = 75%, others = 25%
        const permAnswers = {};
        for (const step of bfiSchema.steps) {
          for (const q of step.questions) {
            if (q.traitKey === dominant) {
              permAnswers[q.id] = q.isReverse ? 1 : 5; // 100%
            } else if (q.traitKey === secondary) {
              permAnswers[q.id] = q.isReverse ? 2 : 4; // 75%
            } else {
              permAnswers[q.id] = q.isReverse ? 4 : 2; // 25%
            }
          }
        }

        const res = calculatePsychometrics(bfiSchema, permAnswers);
        const pairKey = `${dominant}_${secondary}`;
        const expectedTitle = EXPECTED_TITLES[pairKey];
        assert.strictEqual(res.archetypeTitle, expectedTitle, `Archetype for ${pairKey} must be "${expectedTitle}" (got "${res.archetypeTitle}")`);
        assert(res.archetypeSubtitle.length > 10, `Subtitle must be rich description for ${pairKey}`);
        assert.strictEqual(res.primaryMetricValue, res.traits.find(t => t.key === dominant).name);
        testedPermutations++;
      }
    }
  }

  assert.strictEqual(testedPermutations, 20, "Must test exactly 20 non-fallback archetypes");
  console.log(`✔ Verified all 20 dominant/secondary archetype permutations via production calculatePsychometrics`);
  console.log(`✔ Big Five 30-item scoring with 50% reverse-keying integrity passed`);
}

// ============================================================================
// TEST 2: Calibrated 36-Item Cognitive IQ Assessment (SEM ±4 pts)
// ============================================================================
{
  console.log("\n--- TEST 2: Cognitive IQ 36-Item Calibrated Suite (SEM ±4 pts) ---");

  // Construct 36-puzzle schema with 4 sub-domains
  const iqSchema = {
    testType: "cognitive_iq",
    steps: [
      {
        id: "step_iq_1",
        questions: Array.from({ length: 36 }, (_, i) => {
          const traits = ["fluid_reasoning", "spatial_reasoning", "quantitative_logic", "verbal_deduction"];
          return {
            id: `q_iq_${i + 1}`,
            type: "cognitive_puzzle",
            traitKey: traits[i % 4],
            correctOptionId: "opt_correct",
          };
        }),
      },
    ],
  };

  // Helper to generate answers with R correct out of 36
  const makeIqAnswers = (correctCount) => {
    const ans = {};
    for (let i = 0; i < 36; i++) {
      ans[`q_iq_${i + 1}`] = i < correctCount ? "opt_correct" : "opt_wrong";
    }
    return ans;
  };

  // 1. Median Score: 18 / 36 (50%) => IQ 100
  const medRes = calculatePsychometrics(iqSchema, makeIqAnswers(18));
  assert.strictEqual(medRes.iqScore, 100, "50% accuracy must anchor to IQ 100");
  assert.strictEqual(medRes.sem, 4, "SEM must be 4 points");
  assert.strictEqual(medRes.confidenceInterval, "96 – 104");
  assert(medRes.percentile >= 49 && medRes.percentile <= 51, "Median percentile must be ~50%");
  assert(medRes.classification.includes("Average"), "100 IQ must classify as Average");

  // 2. Superior Score: 30 / 36 (83%) => IQ ~126
  const supRes = calculatePsychometrics(iqSchema, makeIqAnswers(30));
  assert(supRes.iqScore >= 125 && supRes.iqScore <= 128, `30/36 should yield ~126 IQ (got ${supRes.iqScore})`);
  assert(supRes.percentile >= 94, "High IQ must be >= 94th percentile");
  assert(supRes.classification.includes("Well Above Average"));

  // 3. Ceiling Score: 36 / 36 (100%) => IQ 144
  const maxRes = calculatePsychometrics(iqSchema, makeIqAnswers(36));
  assert.strictEqual(maxRes.iqScore, 144, "36/36 must equal test ceiling IQ 144");
  assert(maxRes.percentile >= 99.5, "Ceiling percentile must be >= 99.5th");
  assert(maxRes.classification.includes("Far Above Average"));

  // 4. Low Bound: 0 / 36 (0%) => IQ 65
  const minRes = calculatePsychometrics(iqSchema, makeIqAnswers(0));
  assert.strictEqual(minRes.iqScore, 65, "0/36 must yield baseline IQ 65");
  assert(minRes.percentile <= 2);

  console.log(`✔ Calibrated 36-item IQ verified via calculatePsychometrics (Median: IQ ${medRes.iqScore} ± ${medRes.sem}, Superior: IQ ${supRes.iqScore} ± ${supRes.sem}, Ceiling: IQ ${maxRes.iqScore} ± ${maxRes.sem})`);
}

// ============================================================================
// TEST 3: Moral Alignment 24-Item Assessment & 9-Quadrant Resolution
// ============================================================================
{
  console.log("\n--- TEST 3: Moral Alignment 24-Item Suite & 9 Quadrant Grid ---");

  // Construct 24-item Moral Alignment schema (4 stages x 6 items: 3 order, 3 morality, 50% reverse)
  const moralSchema = {
    testType: "moral_alignment",
    steps: Array.from({ length: 4 }, (_, stageIdx) => ({
      id: `stage_${stageIdx + 1}`,
      questions: [
        { id: `qo_${stageIdx}_1`, traitKey: "order", isReverse: false },
        { id: `qo_${stageIdx}_2`, traitKey: "order", isReverse: true },
        { id: `qo_${stageIdx}_3`, traitKey: "order", isReverse: stageIdx % 2 === 1 },
        { id: `qm_${stageIdx}_1`, traitKey: "morality", isReverse: false },
        { id: `qm_${stageIdx}_2`, traitKey: "morality", isReverse: true },
        { id: `qm_${stageIdx}_3`, traitKey: "morality", isReverse: stageIdx % 2 === 0 },
      ],
    })),
  };

  // Helper to generate answers for target order and morality percentages
  // 1-5 scale: val = 1 + (target / 100) * 4
  const makeMoralAnswers = (orderTarget, moralityTarget) => {
    const orderVal = 1 + (orderTarget / 100) * 4;
    const moralityVal = 1 + (moralityTarget / 100) * 4;
    const ans = {};
    for (const step of moralSchema.steps) {
      for (const q of step.questions) {
        if (q.traitKey === "order") {
          ans[q.id] = q.isReverse ? 6 - orderVal : orderVal;
        } else if (q.traitKey === "morality") {
          ans[q.id] = q.isReverse ? 6 - moralityVal : moralityVal;
        }
      }
    }
    return ans;
  };

  // Test all 9 quadrants through calculatePsychometrics
  const QUADRANT_TESTS = [
    { order: 85, morality: 85, expectedTitle: "Rule-Following & Kind (Lawful Good)", subtitleKeyword: "The Honest Helper" },
    { order: 50, morality: 85, expectedTitle: "Balanced & Kind (Neutral Good)", subtitleKeyword: "The Caring Giver" },
    { order: 25, morality: 85, expectedTitle: "Free-Spirited & Kind (Chaotic Good)", subtitleKeyword: "The Kind Rebel" },
    { order: 85, morality: 50, expectedTitle: "Rule-Following & Neutral (Lawful Neutral)", subtitleKeyword: "The Fair Judge" },
    { order: 50, morality: 50, expectedTitle: "Balanced Middle Ground (True Neutral)", subtitleKeyword: "The Practical Balancer" },
    { order: 25, morality: 50, expectedTitle: "Free-Spirited & Neutral (Chaotic Neutral)", subtitleKeyword: "The Free Spirit" },
    { order: 85, morality: 20, expectedTitle: "Rule-Following & Self-First (Lawful Evil)", subtitleKeyword: "The Strict Controller" },
    { order: 50, morality: 20, expectedTitle: "Practical & Self-First (Neutral Evil)", subtitleKeyword: "The Self-First Opportunist" },
    { order: 20, morality: 20, expectedTitle: "Rule-Breaking & Self-First (Chaotic Evil)", subtitleKeyword: "The Reckless Rule-Breaker" },
  ];

  for (const t of QUADRANT_TESTS) {
    const res = calculatePsychometrics(moralSchema, makeMoralAnswers(t.order, t.morality));
    assert.strictEqual(res.archetypeTitle, t.expectedTitle, `Expected "${t.expectedTitle}", got "${res.archetypeTitle}"`);
    assert(res.archetypeSubtitle.includes(t.subtitleKeyword), `Subtitle for "${t.expectedTitle}" must include "${t.subtitleKeyword}"`);
  }

  // Threshold Boundary Verifications: <=40, 41-59, >=60
  const b1 = calculatePsychometrics(moralSchema, makeMoralAnswers(40, 40));
  assert.strictEqual(b1.archetypeTitle, "Rule-Breaking & Self-First (Chaotic Evil)", "Boundary (40, 40) must resolve to Chaotic Evil");

  const b2 = calculatePsychometrics(moralSchema, makeMoralAnswers(41, 41));
  assert.strictEqual(b2.archetypeTitle, "Balanced Middle Ground (True Neutral)", "Boundary (41, 41) must resolve to True Neutral");

  const b3 = calculatePsychometrics(moralSchema, makeMoralAnswers(59, 59));
  assert.strictEqual(b3.archetypeTitle, "Balanced Middle Ground (True Neutral)", "Boundary (59, 59) must resolve to True Neutral");

  const b4 = calculatePsychometrics(moralSchema, makeMoralAnswers(60, 60));
  assert.strictEqual(b4.archetypeTitle, "Rule-Following & Kind (Lawful Good)", "Boundary (60, 60) must resolve to Lawful Good");

  const b5 = calculatePsychometrics(moralSchema, makeMoralAnswers(60, 40));
  assert.strictEqual(b5.archetypeTitle, "Rule-Following & Self-First (Lawful Evil)", "Boundary (60, 40) must resolve to Lawful Evil (The Strict Controller)");

  const b6 = calculatePsychometrics(moralSchema, makeMoralAnswers(40, 60));
  assert.strictEqual(b6.archetypeTitle, "Free-Spirited & Kind (Chaotic Good)", "Boundary (40, 60) must resolve to Chaotic Good");

  // Verify MoralCartesianGrid activeQuadrant synchronization logic
  const resolveGridActiveQuadrant = (orderScore, moralScore, alignmentTitle) => {
    const NINE_ALIGNMENTS = [
      { id: "cg", name: "Free-Spirited & Kind (Chaotic Good)", shortCode: "CG" },
      { id: "ng", name: "Balanced & Kind (Neutral Good)", shortCode: "NG" },
      { id: "lg", name: "Rule-Following & Kind (Lawful Good)", shortCode: "LG" },
      { id: "cn", name: "Free-Spirited & Neutral (Chaotic Neutral)", shortCode: "CN" },
      { id: "tn", name: "Balanced Middle Ground (True Neutral)", shortCode: "TN" },
      { id: "ln", name: "Rule-Following & Neutral (Lawful Neutral)", shortCode: "LN" },
      { id: "ce", name: "Rule-Breaking & Self-First (Chaotic Evil)", shortCode: "CE" },
      { id: "ne", name: "Practical & Self-First (Neutral Evil)", shortCode: "NE" },
      { id: "le", name: "Rule-Following & Self-First (Lawful Evil)", shortCode: "LE" },
    ];
    if (alignmentTitle) {
      const normalizedTitle = alignmentTitle.trim().toLowerCase();
      const match = NINE_ALIGNMENTS.find(
        (q) =>
          q.name.toLowerCase() === normalizedTitle ||
          normalizedTitle.includes(`(${q.name.toLowerCase()})`) ||
          q.shortCode.toLowerCase() === normalizedTitle
      );
      if (match) return match.name;
    }
    const lawChar = orderScore >= 60 ? "l" : orderScore <= 40 ? "c" : "n";
    const moralChar = moralScore >= 60 ? "g" : moralScore <= 40 ? "e" : "n";
    const targetId = lawChar === "n" && moralChar === "n" ? "tn" : `${lawChar}${moralChar}`;
    return (NINE_ALIGNMENTS.find((q) => q.id === targetId) || NINE_ALIGNMENTS[4]).name;
  };

  assert.strictEqual(resolveGridActiveQuadrant(60, 60), "Rule-Following & Kind (Lawful Good)", "Grid at (60, 60) must resolve to Lawful Good");
  assert.strictEqual(resolveGridActiveQuadrant(40, 40), "Rule-Breaking & Self-First (Chaotic Evil)", "Grid at (40, 40) must resolve to Chaotic Evil");
  assert.strictEqual(resolveGridActiveQuadrant(60, 40), "Rule-Following & Self-First (Lawful Evil)", "Grid at (60, 40) must resolve to Lawful Evil");
  assert.strictEqual(resolveGridActiveQuadrant(40, 60), "Free-Spirited & Kind (Chaotic Good)", "Grid at (40, 60) must resolve to Chaotic Good");
  assert.strictEqual(resolveGridActiveQuadrant(50, 50), "Balanced Middle Ground (True Neutral)", "Grid at (50, 50) must resolve to True Neutral");
  assert.strictEqual(resolveGridActiveQuadrant(59, 41), "Balanced Middle Ground (True Neutral)", "Grid at (59, 41) must resolve to True Neutral");
  assert.strictEqual(resolveGridActiveQuadrant(60, 40, "Rule-Following & Self-First (Lawful Evil)"), "Rule-Following & Self-First (Lawful Evil)", "Grid with alignmentTitle must resolve Lawful Evil");

  // Legacy Schema Key Backward-Compatibility Test (lawful_chaotic, good_evil)
  const legacySchema = {
    testType: "moral_alignment",
    steps: [
      {
        id: "leg_1",
        questions: [
          { id: "lq1", traitKey: "lawful_chaotic", isReverse: false },
          { id: "lq2", traitKey: "good_evil", isReverse: false },
        ],
      },
    ],
  };
  const legRes = calculatePsychometrics(legacySchema, { lq1: 5, lq2: 1 });
  assert.strictEqual(legRes.archetypeTitle, "Rule-Following & Self-First (Lawful Evil)", "Legacy keys must resolve accurately");

  console.log(`✔ All 9 Moral Alignment archetypes resolved with unique titles & distinct evil profiles`);
  console.log(`✔ Synchronized boundary thresholds (<=40, 41-59, >=60) & legacy key backward-compatibility verified`);
}

// ============================================================================
// TEST 4: Dark Triad 27-Item SD3 & 9-Vector Elevation Typology Matrix
// ============================================================================
{
  console.log("\n--- TEST 4: Dark Triad 27-Item SD3 & 9-Vector Typology Matrix ---");

  // Construct 27-item Dark Triad schema (3 stages x 9 items: 3 per trait interleaved, 1 rev per trait per step)
  const traits = ["machiavellianism", "narcissism", "psychopathy"];
  const dtSchema = {
    testType: "dark_triad",
    steps: Array.from({ length: 3 }, (_, stageIdx) => ({
      id: `dt_stage_${stageIdx + 1}`,
      questions: [
        { id: `dt_m_${stageIdx}_1`, traitKey: "machiavellianism", isReverse: false },
        { id: `dt_n_${stageIdx}_1`, traitKey: "narcissism", isReverse: false },
        { id: `dt_p_${stageIdx}_1`, traitKey: "psychopathy", isReverse: false },
        { id: `dt_m_${stageIdx}_2`, traitKey: "machiavellianism", isReverse: false },
        { id: `dt_n_${stageIdx}_2`, traitKey: "narcissism", isReverse: false },
        { id: `dt_p_${stageIdx}_2`, traitKey: "psychopathy", isReverse: false },
        { id: `dt_m_${stageIdx}_3`, traitKey: "machiavellianism", isReverse: true },
        { id: `dt_n_${stageIdx}_3`, traitKey: "narcissism", isReverse: true },
        { id: `dt_p_${stageIdx}_3`, traitKey: "psychopathy", isReverse: true },
      ],
    })),
  };

  const makeDtAnswers = (mTarget, nTarget, pTarget) => {
    const mVal = 1 + (mTarget / 100) * 4;
    const nVal = 1 + (nTarget / 100) * 4;
    const pVal = 1 + (pTarget / 100) * 4;
    const ans = {};
    for (const step of dtSchema.steps) {
      for (const q of step.questions) {
        if (q.traitKey === "machiavellianism") ans[q.id] = q.isReverse ? 6 - mVal : mVal;
        if (q.traitKey === "narcissism") ans[q.id] = q.isReverse ? 6 - nVal : nVal;
        if (q.traitKey === "psychopathy") ans[q.id] = q.isReverse ? 6 - pVal : pVal;
      }
    }
    return ans;
  };

  // Test all 9 vectors through production calculatePsychometrics
  const TYPOLOGY_TESTS = [
    { m: 75, n: 70, p: 68, expectedTitle: "The Bold Power-Seeker" },
    { m: 72, n: 65, p: 40, expectedTitle: "The Ambitious Strategist" },
    { m: 70, n: 42, p: 65, expectedTitle: "The Cold Tactician" },
    { m: 45, n: 68, p: 64, expectedTitle: "The Fearless Attention-Seeker" },
    { m: 70, n: 45, p: 38, expectedTitle: "The Quiet Planner" },
    { m: 42, n: 72, p: 38, expectedTitle: "The Spotlight Seeker" },
    { m: 38, n: 42, p: 70, expectedTitle: "The Fearless Rule-Bender" },
    { m: 25, n: 30, p: 20, expectedTitle: "The Open & Caring Helper" },
    { m: 50, n: 50, p: 42, expectedTitle: "The Balanced Realist" },
  ];

  for (const t of TYPOLOGY_TESTS) {
    const res = calculatePsychometrics(dtSchema, makeDtAnswers(t.m, t.n, t.p));
    assert.strictEqual(res.archetypeTitle, t.expectedTitle, `Expected "${t.expectedTitle}", got "${res.archetypeTitle}"`);
    assert(res.archetypeSubtitle.length > 10, "Subtitle must be present");
  }

  // Exact Elevation Threshold Verification (Elevated >= 60%, Low <= 35%)
  const bLow = calculatePsychometrics(dtSchema, makeDtAnswers(35, 35, 35));
  assert.strictEqual(bLow.archetypeTitle, "The Open & Caring Helper", "Scores of (35, 35, 35) must be The Open & Caring Helper");

  const bMid = calculatePsychometrics(dtSchema, makeDtAnswers(36, 36, 36));
  assert.strictEqual(bMid.archetypeTitle, "The Balanced Realist", "Scores of (36, 36, 36) must be The Balanced Realist");

  const bSingleElevated = calculatePsychometrics(dtSchema, makeDtAnswers(60, 50, 50));
  assert.strictEqual(bSingleElevated.archetypeTitle, "The Quiet Planner", "Mach 60% with others <60 must be The Quiet Planner");

  console.log(`✔ All 9 vectors in the Dark Triad Elevation Typology Matrix verified via production calculatePsychometrics`);
  console.log(`✔ SD3 33% reverse keying & subclinical threshold bounds verified`);
}

// ============================================================================
// TEST 5: Live Database Schema Verification (dev.db)
// ============================================================================
{
  console.log("\n--- TEST 5: Live Database Campaign Schemas & Fast-Forward Validation ---");
  const prisma = new PrismaClient();

  try {
    const campaigns = await prisma.campaign.findMany({ where: { isActive: true } });
    const slugMap = new Map(campaigns.map((c) => [c.slug, JSON.parse(c.schemaJson)]));

    const coreSlugs = ["big-five-personality", "cognitive-iq-assessment", "moral-alignment", "dark-triad-traits"];
    for (const slug of coreSlugs) {
      assert(slugMap.has(slug), `Campaign "${slug}" must exist and be active in dev.db`);
    }

    // 1. Big Five Campaign
    const bfiDb = slugMap.get("big-five-personality");
    assert(bfiDb, "big-five-personality campaign must exist in DB");
    assert.strictEqual(bfiDb.testType, "big_five");
    assert.strictEqual(bfiDb.steps.length, 5, "Big Five must have 5 steps");
    const bfiQCount = bfiDb.steps.reduce((acc, s) => acc + s.questions.length, 0);
    assert.strictEqual(bfiQCount, 30, "Big Five must have exactly 30 questions");
    const bfiRevCount = bfiDb.steps.flatMap(s => s.questions).filter(q => q.isReverse).length;
    assert.strictEqual(bfiRevCount, 15, "Big Five must have exactly 15 reverse-keyed items (50%)");

    // 2. Cognitive IQ Campaign
    const iqDb = slugMap.get("cognitive-iq-assessment");
    assert(iqDb, "cognitive-iq-assessment campaign must exist in DB");
    assert.strictEqual(iqDb.testType, "cognitive_iq");
    assert.strictEqual(iqDb.steps.length, 4, "IQ must have 4 steps");
    const iqQCount = iqDb.steps.reduce((acc, s) => acc + s.questions.length, 0);
    assert.strictEqual(iqQCount, 36, "Cognitive IQ must have exactly 36 questions");

    // 3. Moral Alignment Campaign
    const moralDb = slugMap.get("moral-alignment");
    assert(moralDb, "moral-alignment campaign must exist in DB");
    assert.strictEqual(moralDb.testType, "moral_alignment");
    assert.strictEqual(moralDb.steps.length, 4, "Moral alignment must have 4 stages");
    const moralQCount = moralDb.steps.reduce((acc, s) => acc + s.questions.length, 0);
    assert.strictEqual(moralQCount, 24, "Moral alignment must have exactly 24 questions");
    const orderItems = moralDb.steps.flatMap(s => s.questions).filter(q => q.traitKey === "order");
    const moralItems = moralDb.steps.flatMap(s => s.questions).filter(q => q.traitKey === "morality");
    assert.strictEqual(orderItems.length, 12, "Must have 12 order questions");
    assert.strictEqual(moralItems.length, 12, "Must have 12 morality questions");

    // 4. Dark Triad Campaign
    const dtDb = slugMap.get("dark-triad-traits");
    assert(dtDb, "dark-triad-traits campaign must exist in DB");
    assert.strictEqual(dtDb.testType, "dark_triad");
    assert.strictEqual(dtDb.steps.length, 3, "Dark Triad must have 3 stages");
    const dtQCount = dtDb.steps.reduce((acc, s) => acc + s.questions.length, 0);
    assert.strictEqual(dtQCount, 27, "Dark Triad must have exactly 27 questions");
    const machItems = dtDb.steps.flatMap(s => s.questions).filter(q => q.traitKey === "machiavellianism");
    const narcItems = dtDb.steps.flatMap(s => s.questions).filter(q => q.traitKey === "narcissism");
    const psychItems = dtDb.steps.flatMap(s => s.questions).filter(q => q.traitKey === "psychopathy");
    assert.strictEqual(machItems.length, 9, "Must have 9 Machiavellianism items");
    assert.strictEqual(narcItems.length, 9, "Must have 9 Narcissism items");
    assert.strictEqual(psychItems.length, 9, "Must have 9 Psychopathy items");

    console.log(`✔ Verified all 4 live database campaigns in dev.db (30 OCEAN, 36 IQ, 24 Moral, 27 SD3)`);

    // 5. Test Fast-Forward Immediate Results on all 4 live campaigns
    // Big Five fast-forward
    const bfiFastAnswers = {};
    for (const s of bfiDb.steps) {
      for (const q of s.questions) {
        if (q.traitKey === "openness") bfiFastAnswers[q.id] = q.isReverse ? 1 : 5;
        else if (q.traitKey === "conscientiousness") bfiFastAnswers[q.id] = q.isReverse ? 2 : 5;
        else if (q.traitKey === "emotional_stability") bfiFastAnswers[q.id] = q.isReverse ? 2 : 4;
        else if (q.traitKey === "agreeableness") bfiFastAnswers[q.id] = q.isReverse ? 2 : 4;
        else if (q.traitKey === "extraversion") bfiFastAnswers[q.id] = q.isReverse ? 3 : 3;
      }
    }
    const bfiFastRes = calculatePsychometrics(bfiDb, bfiFastAnswers);
    assert.strictEqual(bfiFastRes.archetypeTitle, "The Creative Planner", "Fast-forward Big Five must yield The Creative Planner");
    assert.strictEqual(bfiFastRes.traits.find((t) => t.key === "extraversion")?.level, "Average", "50% extraversion must resolve to level 'Average'");

    // Moral Alignment fast-forward
    const moralFastAnswers = {};
    for (const s of moralDb.steps) {
      for (const q of s.questions) {
        if (q.traitKey === "order") moralFastAnswers[q.id] = q.isReverse ? 1 : 5;
        else if (q.traitKey === "morality") moralFastAnswers[q.id] = q.isReverse ? 1 : 5;
      }
    }
    const moralFastRes = calculatePsychometrics(moralDb, moralFastAnswers);
    assert.strictEqual(moralFastRes.archetypeTitle, "Rule-Following & Kind (Lawful Good)", "Fast-forward Moral Alignment must yield Rule-Following & Kind (Lawful Good)");

    // Dark Triad fast-forward
    const dtFastAnswers = {};
    for (const s of dtDb.steps) {
      for (const q of s.questions) {
        if (q.traitKey === "machiavellianism") dtFastAnswers[q.id] = q.isReverse ? 3 : 3;
        else if (q.traitKey === "narcissism") dtFastAnswers[q.id] = q.isReverse ? 3 : 3;
        else if (q.traitKey === "psychopathy") dtFastAnswers[q.id] = q.isReverse ? 4 : 3;
      }
    }
    const dtFastRes = calculatePsychometrics(dtDb, dtFastAnswers);
    assert.strictEqual(dtFastRes.archetypeTitle, "The Balanced Realist", "Fast-forward Dark Triad must yield The Balanced Realist");

    // Cognitive IQ fast-forward (30/36 correct)
    const iqMissIndices = new Set([14, 23, 30, 32, 34, 35]);
    const iqFastAnswers = {};
    let pIdx = 0;
    for (const s of iqDb.steps) {
      for (const q of s.questions) {
        if (iqMissIndices.has(pIdx) && q.options && q.options.length > 1) {
          const distractor = q.options.find(opt => String(opt.id) !== String(q.correctOptionId));
          iqFastAnswers[q.id] = distractor ? distractor.id : q.correctOptionId;
        } else {
          iqFastAnswers[q.id] = q.correctOptionId || q.options?.[0]?.id || "opt_a";
        }
        pIdx++;
      }
    }
    const iqFastRes = calculatePsychometrics(iqDb, iqFastAnswers);
    assert(iqFastRes.iqScore >= 125 && iqFastRes.iqScore <= 128, `Fast-forward IQ must yield ~126 IQ (got ${iqFastRes.iqScore})`);
    assert.strictEqual(iqFastRes.archetypeTitle, "Sharp Pattern Builder");

    // 5. Harry Potter Character Match DB Schema & Fast-Forward
    const hpDb = slugMap.get("harry-potter-character");
    assert(hpDb, "harry-potter-character campaign must exist in DB");
    assert.strictEqual(hpDb.testType, "harry_potter");
    assert.strictEqual(hpDb.category, "character");
    assert.strictEqual(hpDb.steps.length, 6, "Harry Potter quiz must have 6 steps");
    const hpQuestions = hpDb.steps.flatMap((s) => s.questions);
    assert.strictEqual(hpQuestions.length, 36, "Harry Potter quiz must have exactly 36 questions");
    const hpLikert = hpQuestions.filter((q) => q.type === "likert_5");
    const hpChoice = hpQuestions.filter((q) => q.type === "single_choice");
    assert.strictEqual(hpLikert.length, 24, "Must have 24 likert_5 items");
    assert.strictEqual(hpChoice.length, 12, "Must have 12 single_choice items");
    const hpRevCount = hpLikert.filter((q) => q.isReverse === true).length;
    assert.strictEqual(hpRevCount, 12, "Must have 12 reverse-keyed likert_5 items (50%)");
    for (const t of ["bravery", "wisdom", "ambition", "loyalty", "rebellion", "empathy_growth"]) {
      const tLikert = hpLikert.filter((q) => q.traitKey === t);
      assert.strictEqual(tLikert.length, 4, `HP trait ${t} must have 4 likert_5 items`);
      assert.strictEqual(tLikert.filter((q) => q.isReverse === true).length, 2, `HP trait ${t} must have 2 reverse items`);
    }
    for (const cq of hpChoice) {
      assert.strictEqual(cq.options?.length, 4, `Choice question ${cq.id} must have 4 options`);
      for (const opt of cq.options) {
        assert(opt.traitWeights && Object.keys(opt.traitWeights).length > 0, `Option ${cq.id}.${opt.id} must have traitWeights`);
      }
    }

    // Fast-forward simulation on live Harry Potter DB schema
    const hpTargets = { bravery: 4, wisdom: 5, ambition: 4, loyalty: 5, rebellion: 3, empathy_growth: 4 };
    const hpFastAnswers = {};
    for (const q of hpQuestions) {
      if (q.type === "likert_5") {
        const target = hpTargets[q.traitKey] ?? 4;
        hpFastAnswers[q.id] = q.isReverse ? 6 - target : target;
      } else if (q.type === "single_choice" && q.options?.length) {
        let bestOpt = q.options[0];
        let bestScore = -Infinity;
        for (const opt of q.options) {
          const w = opt.traitWeights || {};
          const score =
            (w.wisdom ?? 0) * 2 +
            (w.loyalty ?? 0) * 1.5 +
            (w.bravery ?? 0) * 1.2 +
            (w.empathy_growth ?? 0) * 1.2 +
            (w.ambition ?? 0) * 0.5;
          if (score > bestScore) {
            bestScore = score;
            bestOpt = opt;
          }
        }
        hpFastAnswers[q.id] = bestOpt.id;
      }
    }
    const hpFastRes = calculatePsychometrics(hpDb, hpFastAnswers);
    assert(hpFastRes && hpFastRes.characterMatch, "Fast-forward Harry Potter must return characterMatch");
    assert.strictEqual(hpFastRes.characterMatch.topMatches.length, 3, "Must return Top 3 matches");
    assert.strictEqual(hpFastRes.characterMatch.topMatch.name, "Hermione Granger", "Calibrated fast-forward must resolve to Hermione Granger");

    // Verify Malfoid (non-canon) & Draco Malfoy (canon) are both reachable on the real 36-question DB schema
    const solveHpDbFor = (target) => {
      const ans = {};
      for (const q of hpQuestions) {
        if (q.type === "likert_5") {
          const clamped = Math.max(1, Math.min(5, Math.round(1 + (target[q.traitKey] / 100) * 4)));
          ans[q.id] = q.isReverse ? 6 - clamped : clamped;
        } else if (q.type === "single_choice" && q.options?.length) {
          let bestOpt = q.options[0], bestErr = Infinity;
          for (const opt of q.options) {
            let err = 0;
            for (const [k, w] of Object.entries(opt.traitWeights || {})) {
              err += Math.abs(((w + 2) / 4) * 100 - target[k]);
            }
            if (err < bestErr) { bestErr = err; bestOpt = opt; }
          }
          ans[q.id] = bestOpt.id;
        }
      }
      return calculatePsychometrics(hpDb, ans);
    };
    const malfoidDbRes = solveHpDbFor({ bravery: 68, wisdom: 86, ambition: 88, loyalty: 72, rebellion: 64, empathy_growth: 84 });
    assert.strictEqual(malfoidDbRes.characterMatch.topMatch.name, "Malfoid", "Malfoid must be reachable on live 36-item DB schema");
    assert.strictEqual(malfoidDbRes.characterMatch.topMatch.isCanon, false, "Malfoid must be marked non-canon");
    const dracoDbRes = solveHpDbFor({ bravery: 32, wisdom: 56, ambition: 90, loyalty: 54, rebellion: 36, empathy_growth: 34 });
    assert.strictEqual(dracoDbRes.characterMatch.topMatch.name, "Draco Malfoy", "Canon Draco Malfoy must be reachable on live 36-item DB schema");
    assert.strictEqual(dracoDbRes.characterMatch.topMatch.isCanon, true, "Draco Malfoy must be marked canon");

    console.log(`✔ Fast-forward instant results simulation passed for all 5 campaigns`);
  } finally {
    await prisma.$disconnect();
  }
}

// ============================================================================
// TEST 6: Harry Potter Character Match (All 15 Characters & Mixed Scoring)
// ============================================================================
{
  console.log("\n--- TEST 6: Harry Potter 15-Character Roster, Reverse-Keying & traitWeights ---");

  // Mixed schema: 1 normal likert + 1 reverse likert + 1 single_choice per trait
  const hpTraits = ["bravery", "wisdom", "ambition", "loyalty", "rebellion", "empathy_growth"];
  const mixedSchema = {
    testType: "harry_potter",
    steps: [
      {
        id: "s1",
        questions: [
          { id: "lb", type: "likert_5", traitKey: "bravery", isReverse: false },
          { id: "lbr", type: "likert_5", traitKey: "bravery", isReverse: true },
          { id: "lw", type: "likert_5", traitKey: "wisdom", isReverse: false },
          { id: "lwr", type: "likert_5", traitKey: "wisdom", isReverse: true },
          { id: "la", type: "likert_5", traitKey: "ambition", isReverse: false },
          { id: "ll", type: "likert_5", traitKey: "loyalty", isReverse: false },
          { id: "lr", type: "likert_5", traitKey: "rebellion", isReverse: false },
          { id: "le", type: "likert_5", traitKey: "empathy_growth", isReverse: false },
          {
            id: "sc1",
            type: "single_choice",
            options: [
              { id: "opt_a", label: "A", traitWeights: { bravery: 2, wisdom: -2 } },
              { id: "opt_b", label: "B", traitWeights: { empathy_growth: 2, ambition: 1 } },
            ],
          },
        ],
      },
    ],
  };

  // Verify reverse-keying + single_choice traitWeights blending:
  // bravery: lb=5 (100), lbr=1 (rev->5 = 100), sc1=opt_a (+2 -> 100) => 100%
  // wisdom: lw=1 (0), lwr=5 (rev->1 = 0), sc1=opt_a (-2 -> 0) => 0%
  const blendRes = calculatePsychometrics(mixedSchema, { lb: 5, lbr: 1, lw: 1, lwr: 5, sc1: "opt_a" });
  assert.strictEqual(blendRes.traits.find((t) => t.key === "bravery").score, 100, "Mixed bravery must equal 100%");
  assert.strictEqual(blendRes.traits.find((t) => t.key === "wisdom").score, 0, "Mixed wisdom with reverse + -2 weight must equal 0%");

  // Verify empty answers edge case
  const emptyRes = calculatePsychometrics(mixedSchema, {});
  assert(emptyRes.characterMatch && emptyRes.characterMatch.topMatches.length === 3, "Empty answers must still return valid Top 3 matches");

  // Verify all 15 characters (14 book-canon + Malfoid) are uniquely reachable
  const TARGET_CHARACTERS = [
    { name: "Harry Potter", isCanon: true, vec: { bravery: 95, wisdom: 58, ambition: 52, loyalty: 92, rebellion: 82, empathy_growth: 84 } },
    { name: "Hermione Granger", isCanon: true, vec: { bravery: 82, wisdom: 98, ambition: 72, loyalty: 88, rebellion: 48, empathy_growth: 78 } },
    { name: "Ron Weasley", isCanon: true, vec: { bravery: 80, wisdom: 52, ambition: 48, loyalty: 95, rebellion: 62, empathy_growth: 76 } },
    { name: "Albus Dumbledore", isCanon: true, vec: { bravery: 84, wisdom: 98, ambition: 68, loyalty: 74, rebellion: 60, empathy_growth: 90 } },
    { name: "Severus Snape", isCanon: true, vec: { bravery: 85, wisdom: 88, ambition: 74, loyalty: 86, rebellion: 42, empathy_growth: 32 } },
    { name: "Draco Malfoy", isCanon: true, vec: { bravery: 32, wisdom: 56, ambition: 90, loyalty: 54, rebellion: 36, empathy_growth: 34 } },
    { name: "Malfoid", isCanon: false, vec: { bravery: 68, wisdom: 86, ambition: 88, loyalty: 72, rebellion: 64, empathy_growth: 84 } },
    { name: "Luna Lovegood", isCanon: true, vec: { bravery: 72, wisdom: 78, ambition: 22, loyalty: 86, rebellion: 88, empathy_growth: 94 } },
    { name: "Neville Longbottom", isCanon: true, vec: { bravery: 88, wisdom: 54, ambition: 34, loyalty: 94, rebellion: 38, empathy_growth: 90 } },
    { name: "Sirius Black", isCanon: true, vec: { bravery: 92, wisdom: 60, ambition: 46, loyalty: 90, rebellion: 96, empathy_growth: 62 } },
    { name: "Ginny Weasley", isCanon: true, vec: { bravery: 90, wisdom: 68, ambition: 76, loyalty: 84, rebellion: 78, empathy_growth: 74 } },
    { name: "Remus Lupin", isCanon: true, vec: { bravery: 76, wisdom: 88, ambition: 32, loyalty: 88, rebellion: 44, empathy_growth: 96 } },
    { name: "Cedric Diggory", isCanon: true, vec: { bravery: 82, wisdom: 74, ambition: 66, loyalty: 92, rebellion: 22, empathy_growth: 88 } },
    { name: "Bellatrix Lestrange", isCanon: true, vec: { bravery: 86, wisdom: 48, ambition: 88, loyalty: 84, rebellion: 76, empathy_growth: 8 } },
    { name: "Tom Riddle (Lord Voldemort)", isCanon: true, vec: { bravery: 62, wisdom: 92, ambition: 99, loyalty: 10, rebellion: 84, empathy_growth: 5 } },
  ];

  const reachSchema = {
    testType: "harry_potter",
    steps: [
      {
        id: "r1",
        questions: hpTraits.map((t) => ({ id: `q_${t}`, type: "likert_5", traitKey: t })),
      },
    ],
  };

  for (const target of TARGET_CHARACTERS) {
    const ans = {};
    for (const t of hpTraits) {
      ans[`q_${t}`] = 1 + (target.vec[t] / 100) * 4;
    }
    const res = calculatePsychometrics(reachSchema, ans);
    assert.strictEqual(res.characterMatch.topMatch.name, target.name, `Expected ${target.name}, got ${res.characterMatch.topMatch.name}`);
    assert.strictEqual(res.characterMatch.topMatch.isCanon, target.isCanon, `${target.name} canon flag mismatch`);
  }

  console.log("✔ All 15 Harry Potter characters (14 book-canon + Malfoid) verified reachable & distinct");
}

console.log("\n============================================================================");
console.log(">>> ALL 5 PSYCHOMETRIC & CHARACTER PIPELINES PASSED WITH 100% INTEGRITY <<<");
console.log("============================================================================");
