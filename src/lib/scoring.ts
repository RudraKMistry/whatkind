import type {
  SurveySchemaDefinition,
  PsychometricResult,
  TraitScoreDefinition,
  CharacterMatchProfile,
} from "../types/survey";

function getLevel(score: number): "Very Low" | "Low" | "Average" | "High" | "Very High" {
  if (score < 25) return "Very Low";
  if (score < 45) return "Low";
  if (score < 65) return "Average";
  if (score < 85) return "High";
  return "Very High";
}

export function calculatePsychometrics(
  schema: SurveySchemaDefinition,
  answers: Record<string, any>
): PsychometricResult | null {
  const testType = schema.testType;
  if (!testType || testType === "standard_survey") {
    return null;
  }

  // 1. BIG FIVE PERSONALITY TEST (OCEAN)
  if (testType === "big_five") {
    const traitsConfig = [
      {
        key: "openness",
        name: "Curiosity & Openness (Openness)",
        color: "#D97706", // Burnt Amber
        summary: "Shows how much you enjoy new ideas, creative hobbies, and trying new things.",
      },
      {
        key: "conscientiousness",
        name: "Planning & Follow-Through (Conscientiousness)",
        color: "#059669", // Emerald
        summary: "Shows how organized you are, how well you plan ahead, and how reliably you finish what you start.",
      },
      {
        key: "extraversion",
        name: "Social Energy & Boldness (Extraversion)",
        color: "#C2410C", // Terracotta
        summary: "Shows how much energy you get from being around people, speaking up, and taking the lead.",
      },
      {
        key: "agreeableness",
        name: "Kindness & Teamwork (Agreeableness)",
        color: "#2563EB", // Royal Blue
        summary: "Shows how warm, helpful, trusting, and easy to get along with you are around other people.",
      },
      {
        key: "emotional_stability",
        name: "Calmness Under Stress (Emotional Stability)",
        color: "#7C3AED", // Violet
        summary: "Shows how calm and steady you stay when things get stressful, and how well you bounce back from worry.",
      },
    ];

    const traits: TraitScoreDefinition[] = traitsConfig.map((config) => {
      let rawSum = 0;
      let count = 0;

      for (const step of schema.steps) {
        for (const q of step.questions) {
          if (q.traitKey === config.key) {
            let val = Number(answers[q.id]);
            if (!isNaN(val) && val >= 1 && val <= 5) {
              if (q.isReverse) {
                val = 6 - val;
              }
              rawSum += val;
              count++;
            }
          }
        }
      }

      // Convert 1-5 scale average to 0-100%
      const avg = count > 0 ? rawSum / count : 3;
      const score = Math.round(((avg - 1) / 4) * 100);

      return {
        key: config.key,
        name: config.name,
        score,
        level: getLevel(score),
        color: config.color,
        summary: config.summary,
      };
    });

    // Determine Archetype based on top 2 dominant traits (Full 20-Archetype Permutation Matrix)
    const sorted = [...traits].sort((a, b) => b.score - a.score);
    const dominant = sorted[0];
    const secondary = sorted[1];

    const BIG_FIVE_ARCHETYPES: Record<string, { title: string; subtitle: string }> = {
      openness_conscientiousness: {
        title: "The Creative Planner",
        subtitle: "You pair big, fresh ideas with careful planning and follow-through.",
      },
      openness_extraversion: {
        title: "The Lively Idea Maker",
        subtitle: "You come up with creative ideas and get other people excited about them.",
      },
      openness_agreeableness: {
        title: "The Kind Dreamer",
        subtitle: "You use your imagination and open mind to help people and bring groups together.",
      },
      openness_emotional_stability: {
        title: "The Calm Explorer",
        subtitle: "You love exploring deep questions and new ideas while staying calm and steady.",
      },
      conscientiousness_openness: {
        title: "The Organized Builder",
        subtitle: "You bring strong habits and clear plans to fresh, creative projects.",
      },
      conscientiousness_extraversion: {
        title: "The Driven Leader",
        subtitle: "You combine strong self-discipline with confident leadership to get things done fast.",
      },
      conscientiousness_agreeableness: {
        title: "The Dependable Helper",
        subtitle: "You take your promises seriously and work hard because you genuinely care about others.",
      },
      conscientiousness_emotional_stability: {
        title: "The Steady Rock",
        subtitle: "You stay organized, stick with hard tasks, and keep a cool head even when things go wrong.",
      },
      extraversion_openness: {
        title: "The Bold Adventurer",
        subtitle: "You bring high energy and a curious spirit to new places, people, and projects.",
      },
      extraversion_conscientiousness: {
        title: "The Go-Getter",
        subtitle: "You motivate people around you and back it up with hard work and clear goals.",
      },
      extraversion_agreeableness: {
        title: "The Warm People-Person",
        subtitle: "You bring warm, friendly energy to groups and love helping everyone feel included.",
      },
      extraversion_emotional_stability: {
        title: "The Confident Spark",
        subtitle: "You stay upbeat, calm, and ready to take action even when plans change.",
      },
      agreeableness_openness: {
        title: "The Thoughtful Listener",
        subtitle: "You care deeply about others and stay open-minded to different views and ideas.",
      },
      agreeableness_conscientiousness: {
        title: "The Caring Teammate",
        subtitle: "You look out for other people's well-being and show up reliably to do your part.",
      },
      agreeableness_extraversion: {
        title: "The Friendly Bridge-Builder",
        subtitle: "You are warm, easy to talk to, and great at helping people trust and connect with each other.",
      },
      agreeableness_emotional_stability: {
        title: "The Gentle Peacekeeper",
        subtitle: "You offer steady kindness, patience, and a calming presence when others are upset.",
      },
      emotional_stability_openness: {
        title: "The Quiet Thinker",
        subtitle: "Your calm, steady mind lets you think clearly and explore big ideas without getting rattled.",
      },
      emotional_stability_conscientiousness: {
        title: "The Unshakeable Worker",
        subtitle: "You stay calm under pressure, keep your habits steady, and never give up easily.",
      },
      emotional_stability_extraversion: {
        title: "The Calm Leader",
        subtitle: "You feel comfortable around people and handle tough or noisy situations with ease.",
      },
      emotional_stability_agreeableness: {
        title: "The Peaceful Supporter",
        subtitle: "You stay calm inside and treat other people with patience, kindness, and understanding.",
      },
    };

    const pairKey = `${dominant.key}_${secondary.key}`;
    const archetype = BIG_FIVE_ARCHETYPES[pairKey] || {
      title: "The Balanced All-Rounder",
      subtitle: "You have a well-rounded mix of personality traits that helps you handle many different situations.",
    };

    const archetypeTitle = archetype.title;
    const archetypeSubtitle = archetype.subtitle;

    const detailedAnalysis = `Your top personality trait is ${dominant.name} (${dominant.score}%, ${dominant.level}), closely backed by ${secondary.name} (${secondary.score}%, ${secondary.level}). ${dominant.summary} Together, these two strengths shape how you handle daily tasks, work with others, and make decisions.`;

    return {
      testType,
      archetypeTitle,
      archetypeSubtitle,
      primaryMetricLabel: "Top Personality Trait",
      primaryMetricValue: dominant.name,
      traits,
      detailedAnalysis,
    };
  }

  // 2. COGNITIVE IQ & PROGRESSIVE MATRIX ASSESSMENT
  if (testType === "cognitive_iq") {
    let totalQuestions = 0;
    let correctCount = 0;

    // Sub-domain tracking (Cattell-Horn-Carroll Gf, Gv, Gq, Gc)
    const subDomainStats: Record<string, { correct: number; total: number }> = {
      fluid_reasoning: { correct: 0, total: 0 },
      spatial_reasoning: { correct: 0, total: 0 },
      quantitative_logic: { correct: 0, total: 0 },
      verbal_deduction: { correct: 0, total: 0 },
    };

    for (const step of schema.steps) {
      for (const q of step.questions) {
        if (q.type === "cognitive_puzzle" || q.correctOptionId) {
          totalQuestions++;
          const trait = q.traitKey || "fluid_reasoning";
          if (!subDomainStats[trait]) {
            subDomainStats[trait] = { correct: 0, total: 0 };
          }
          subDomainStats[trait].total++;

          if (String(answers[q.id]) === String(q.correctOptionId)) {
            correctCount++;
            subDomainStats[trait].correct++;
          }
        }
      }
    }

    // Accurate IQ Psychometric Scaling (Standard Deviation sigma = 15, Mean mu = 100)
    // Calibrated for 36 items: 50% (18/36) = 100, 75% (27/36) = 120, 100% (36/36) = 144
    let estimatedIq = 100;
    const R = correctCount;
    const N = totalQuestions || 36;
    const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0.5;

    if (N === 36) {
      if (R <= 9) {
        estimatedIq = Math.round(65 + (R / 9) * 10);
      } else if (R <= 18) {
        estimatedIq = Math.round(75 + ((R - 9) / 9) * 25);
      } else if (R <= 27) {
        estimatedIq = Math.round(100 + ((R - 18) / 9) * 20);
      } else if (R <= 34) {
        estimatedIq = Math.round(120 + ((R - 27) / 7) * 15);
      } else {
        estimatedIq = Math.round(135 + ((R - 34) / 2) * 9);
      }
    } else {
      // General proportional scaling for arbitrary puzzle count
      if (ratio <= 0.25) {
        estimatedIq = Math.round(65 + (ratio / 0.25) * 10);
      } else if (ratio <= 0.5) {
        estimatedIq = Math.round(75 + ((ratio - 0.25) / 0.25) * 25);
      } else if (ratio <= 0.75) {
        estimatedIq = Math.round(100 + ((ratio - 0.5) / 0.25) * 20);
      } else {
        estimatedIq = Math.round(120 + ((ratio - 0.75) / 0.25) * 24);
      }
    }

    // Standard Error of Measurement (SEM <= 4.5 pts with N >= 35)
    const sem = 4;
    const lowerCi = Math.max(60, estimatedIq - sem);
    const upperCi = Math.min(145, estimatedIq + sem);
    const confidenceInterval = `${lowerCi} – ${upperCi}`;

    // Cumulative normal distribution percentile approximation
    const z = (estimatedIq - 100) / 15;
    // Numerical approximation of error function erf(z / sqrt(2))
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    const prob =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    const cdf = z >= 0 ? 1 - prob : prob;
    const percentile = Math.min(99.9, Math.max(0.1, Math.round(cdf * 1000) / 10));

    // Mensa & WAIS Clinical Classification (Plain Everyday Terms)
    let classification = "Average (Typical Adult Range)";
    let archetypeTitle = "Practical Problem Solver";
    if (estimatedIq >= 130) {
      classification = "Far Above Average (Top 2% — Mensa Level)";
      archetypeTitle = "Master Problem Solver";
    } else if (estimatedIq >= 120) {
      classification = "Well Above Average (Top 9%)";
      archetypeTitle = "Sharp Pattern Builder";
    } else if (estimatedIq >= 110) {
      classification = "Above Average";
      archetypeTitle = "Clear Logical Thinker";
    } else if (estimatedIq >= 90) {
      classification = "Average (Typical Adult Range)";
      archetypeTitle = "Practical Problem Solver";
    } else {
      classification = "Below Average / Hands-On Thinker";
      archetypeTitle = "Creative Everyday Thinker";
    }

    const archetypeSubtitle = `Estimated IQ: about ${estimatedIq} (give or take ${sem} points, likely range ${confidenceInterval}) • Higher than ${percentile}% of adults`;

    // 4 Cattell-Horn-Carroll Cognitive Sub-Dimensions
    const subDomainConfigs = [
      {
        key: "fluid_reasoning",
        name: "Pattern & Puzzle Logic (Gf)",
        color: "#D97706", // Amber
        summary: "Spotting new patterns, finding what rule connects shapes, and solving visual puzzles.",
      },
      {
        key: "spatial_reasoning",
        name: "Shapes & Mental Pictures (Gv)",
        color: "#2563EB", // Blue
        summary: "Turning shapes around in your head, picturing how pieces fit, and seeing symmetry.",
      },
      {
        key: "quantitative_logic",
        name: "Numbers & Sequences (Gq)",
        color: "#059669", // Emerald
        summary: "Finding the next number in a list, cracking simple code shifts, and working through number patterns.",
      },
      {
        key: "verbal_deduction",
        name: "Word & Rule Reasoning (Gc)",
        color: "#7C3AED", // Violet
        summary: "Using clues and clear rules to rule out wrong choices and find what must be true.",
      },
    ];

    const traits: TraitScoreDefinition[] = subDomainConfigs.map((cfg) => {
      const stats = subDomainStats[cfg.key];
      const count = stats?.total || 0;
      const correct = stats?.correct || 0;
      const subScore = count > 0 ? Math.round((correct / count) * 100) : 50;

      return {
        key: cfg.key,
        name: cfg.name,
        score: subScore,
        level: getLevel(subScore),
        color: cfg.color,
        summary: `${cfg.summary} (Got ${correct} out of ${count} right.)`,
      };
    });

    const strongestSkill = [...traits].sort((a, b) => b.score - a.score)[0]?.name;
    const detailedAnalysis = `Your thinking test gives an estimated IQ of about ${estimatedIq}. Because any short test has a small margin of error (about ±${sem} points), your true score is very likely between ${confidenceInterval}.

This puts your puzzle and logic score in the ${percentile}th percentile, meaning you scored higher than about ${percentile}% of adults. In standard score groups, this falls under "${classification}".

Across the four thinking skills, your strongest area was ${strongestSkill}, showing solid problem-solving ability even as the puzzles got harder.`;

    return {
      testType,
      archetypeTitle,
      archetypeSubtitle,
      primaryMetricLabel: "Estimated IQ",
      primaryMetricValue: `~${estimatedIq}`,
      traits,
      detailedAnalysis,
      iqScore: estimatedIq,
      sem,
      confidenceInterval,
      percentile,
      classification,
    };
  }

  // 3. MORAL ALIGNMENT MATRIX (D&D Archetypes)
  if (testType === "moral_alignment") {
    let lawfulnessSum = 0;
    let lawfulnessCount = 0;
    let moralitySum = 0;
    let moralityCount = 0;

    for (const step of schema.steps) {
      for (const q of step.questions) {
        const val = Number(answers[q.id]);
        if (!isNaN(val) && val >= 1 && val <= 5) {
          if (q.traitKey === "order" || q.traitKey === "lawful_chaotic") {
            const score = q.isReverse ? 6 - val : val;
            lawfulnessSum += score;
            lawfulnessCount++;
          } else if (q.traitKey === "morality" || q.traitKey === "good_evil") {
            const score = q.isReverse ? 6 - val : val;
            moralitySum += score;
            moralityCount++;
          }
        }
      }
    }

    const lawScore = lawfulnessCount > 0 ? Math.round(((lawfulnessSum / lawfulnessCount - 1) / 4) * 100) : 50;
    const goodScore = moralityCount > 0 ? Math.round(((moralitySum / moralityCount - 1) / 4) * 100) : 50;

    // Determine Axis Keys based on calibrated psychometric thresholds (<=40, 41-59, >=60)
    const lawAxis = lawScore >= 60 ? "lawful" : lawScore <= 40 ? "chaotic" : "neutral";
    const goodAxis = goodScore >= 60 ? "good" : goodScore <= 40 ? "evil" : "neutral";
    const alignmentKey = `${lawAxis}_${goodAxis}`;

    const ALIGNMENT_PROFILES: Record<string, { title: string; subtitle: string }> = {
      lawful_good: {
        title: "Rule-Following & Kind (Lawful Good)",
        subtitle: "The Honest Helper: You follow rules and keep your promises while always trying to do what is kind and fair for others.",
      },
      neutral_good: {
        title: "Balanced & Kind (Neutral Good)",
        subtitle: "The Caring Giver: You focus on helping people and doing the right thing, whether or not a rule tells you to.",
      },
      chaotic_good: {
        title: "Free-Spirited & Kind (Chaotic Good)",
        subtitle: "The Kind Rebel: You care deeply about people and freedom, and you are willing to break unfair rules to help others.",
      },
      lawful_neutral: {
        title: "Rule-Following & Neutral (Lawful Neutral)",
        subtitle: "The Fair Judge: You believe rules, order, and keeping your word matter most, and you apply them steadily to everyone.",
      },
      neutral_neutral: {
        title: "Balanced Middle Ground (True Neutral)",
        subtitle: "The Practical Balancer: You prefer a balanced middle path, stay independent, and decide things case by case rather than taking extreme sides.",
      },
      chaotic_neutral: {
        title: "Free-Spirited & Neutral (Chaotic Neutral)",
        subtitle: "The Free Spirit: You value your own freedom above all else, follow your instincts, and dislike being tied down by strict rules.",
      },
      lawful_evil: {
        title: "Rule-Following & Self-First (Lawful Evil)",
        subtitle: "The Strict Controller: You carefully use rules, rank, and systems to gain power and put your own goals first.",
      },
      neutral_evil: {
        title: "Practical & Self-First (Neutral Evil)",
        subtitle: "The Self-First Opportunist: You look out for number one above everything else, and bend or drop loyalties whenever it helps you get ahead.",
      },
      chaotic_evil: {
        title: "Rule-Breaking & Self-First (Chaotic Evil)",
        subtitle: "The Reckless Rule-Breaker: You act on sudden urges and self-interest with little care for rules or how your choices hurt other people.",
      },
    };

    const profile = ALIGNMENT_PROFILES[alignmentKey] || {
      title: "Balanced Middle Ground (True Neutral)",
      subtitle: "Your position on the 2-way map of rules versus freedom and kindness versus self-interest.",
    };

    const archetypeTitle = profile.title;
    const archetypeSubtitle = profile.subtitle;

    const traits: TraitScoreDefinition[] = [
      {
        key: "order",
        name: "Following Rules & Order",
        score: lawScore,
        level: getLevel(lawScore),
        color: "#059669",
        summary: "How strongly you value clear rules, authority, duty, and keeping written promises.",
      },
      {
        key: "morality",
        name: "Kindness & Helping Others",
        score: goodScore,
        level: getLevel(goodScore),
        color: "#D97706",
        summary: "How willing you are to give up your own comfort to protect and help other people.",
      },
    ];

    const detailedAnalysis = `Your answers place you in the "${archetypeTitle}" group on the moral map. With a Rules & Order score of ${lawScore}% and a Kindness & Helping Others score of ${goodScore}%, your choices show how you balance sticking to rules against caring for people directly.`;

    return {
      testType,
      archetypeTitle,
      archetypeSubtitle,
      primaryMetricLabel: "Moral Style",
      primaryMetricValue: archetypeTitle,
      traits,
      detailedAnalysis,
    };
  }

  // 4. DARK TRIAD BEHAVIORAL TRAITS (9-Vector Elevation Typology)
  if (testType === "dark_triad") {
    const traitsConfig = [
      {
        key: "machiavellianism",
        name: "Strategic Manipulation (Machiavellianism)",
        color: "#C2410C", // Terracotta
        summary: "Using careful planning, reading people's weak spots, and staying emotionally cool to get what you want.",
      },
      {
        key: "narcissism",
        name: "Need for Admiration & Status (Narcissism)",
        color: "#D97706", // Amber
        summary: "Wanting praise, high status, special treatment, and being seen as the person in charge.",
      },
      {
        key: "psychopathy",
        name: "Cold Calmness & Risk-Taking (Psychopathy)",
        color: "#44403C", // Charcoal
        summary: "Staying unfazed by stress or conflict, taking big risks, and not worrying much about breaking social rules.",
      },
    ];

    const traits: TraitScoreDefinition[] = traitsConfig.map((config) => {
      let rawSum = 0;
      let count = 0;

      for (const step of schema.steps) {
        for (const q of step.questions) {
          if (q.traitKey === config.key) {
            let val = Number(answers[q.id]);
            if (!isNaN(val) && val >= 1 && val <= 5) {
              if (q.isReverse) val = 6 - val;
              rawSum += val;
              count++;
            }
          }
        }
      }

      const avg = count > 0 ? rawSum / count : 2.5;
      const score = Math.round(((avg - 1) / 4) * 100);

      return {
        key: config.key,
        name: config.name,
        score,
        level: getLevel(score),
        color: config.color,
        summary: config.summary,
      };
    });

    const mScore = traits.find((t) => t.key === "machiavellianism")?.score ?? 40;
    const nScore = traits.find((t) => t.key === "narcissism")?.score ?? 40;
    const pScore = traits.find((t) => t.key === "psychopathy")?.score ?? 40;

    // 9-Vector Elevation Typology Matrix (Elevated >= 60%, Low <= 35%)
    const mHigh = mScore >= 60;
    const nHigh = nScore >= 60;
    const pHigh = pScore >= 60;
    const allLow = mScore <= 35 && nScore <= 35 && pScore <= 35;

    let archetypeTitle = "The Balanced Realist";
    let archetypeSubtitle = "You stay in a healthy middle range—able to protect your own interests while still caring genuinely about other people.";

    if (mHigh && nHigh && pHigh) {
      archetypeTitle = "The Bold Power-Seeker";
      archetypeSubtitle = "You score high on all three traits: careful scheming, wanting status and praise, and fearless risk-taking.";
    } else if (mHigh && nHigh && !pHigh) {
      archetypeTitle = "The Ambitious Strategist";
      archetypeSubtitle = "You combine clever social planning with a strong drive for status, praise, and leadership.";
    } else if (mHigh && pHigh && !nHigh) {
      archetypeTitle = "The Cold Tactician";
      archetypeSubtitle = "You pair cool, practical plotting with fearless calm under pressure and very little emotional hesitation.";
    } else if (nHigh && pHigh && !mHigh) {
      archetypeTitle = "The Fearless Attention-Seeker";
      archetypeSubtitle = "You have a big sense of self-importance along with bold thrill-seeking and a willingness to clash with others.";
    } else if (mHigh && !nHigh && !pHigh) {
      archetypeTitle = "The Quiet Planner";
      archetypeSubtitle = "You think several steps ahead and use quiet leverage in deals, without needing the spotlight or acting recklessly.";
    } else if (nHigh && !mHigh && !pHigh) {
      archetypeTitle = "The Spotlight Seeker";
      archetypeSubtitle = "You strongly want praise, status, and admiration while still mostly sticking to everyday moral limits.";
    } else if (pHigh && !mHigh && !nHigh) {
      archetypeTitle = "The Fearless Rule-Bender";
      archetypeSubtitle = "You stay calm in tough spots and love big risks, without sneaking around or chasing praise.";
    } else if (allLow) {
      archetypeTitle = "The Open & Caring Helper";
      archetypeSubtitle = "You are warm, honest, and humble, and you avoid playing mind games or using people.";
    }

    const avgDark = Math.round(traits.reduce((acc, t) => acc + t.score, 0) / traits.length);
    const detailedAnalysis = `Your overall score on these three traits is ${avgDark}% (the typical average is around 35%). Based on your scores, your style fits "${archetypeTitle}". You showed ${traits[0].level.toLowerCase()} strategic plotting (${traits[0].score}%), ${traits[1].level.toLowerCase()} focus on status and praise (${traits[1].score}%), and ${traits[2].level.toLowerCase()} comfort with risk and conflict (${traits[2].score}%).`;

    return {
      testType,
      archetypeTitle,
      archetypeSubtitle,
      primaryMetricLabel: "Overall Score",
      primaryMetricValue: `${avgDark}%`,
      traits,
      detailedAnalysis,
    };
  }

  // 5. HARRY POTTER CHARACTER MATCH (14 Book-Canon + 1 Non-Canon: Malfoid)
  if (testType === "harry_potter") {
    const HP_TRAITS_CONFIG = [
      {
        key: "bravery",
        name: "Bravery & Nerve",
        color: "#C2410C", // Terracotta
        summary: "How ready you are to face danger, speak up, and step in when things get scary.",
      },
      {
        key: "wisdom",
        name: "Logic & Book Smarts",
        color: "#2563EB", // Royal Blue
        summary: "How much you rely on planning ahead, learning, and thinking carefully before acting.",
      },
      {
        key: "ambition",
        name: "Drive & Pride",
        color: "#059669", // Emerald
        summary: "How strongly you chase big goals, status, winning, and standing out from the crowd.",
      },
      {
        key: "loyalty",
        name: "Loyalty & Friendship",
        color: "#D97706", // Amber
        summary: "How fiercely you stand by the people you care about and keep your promises.",
      },
      {
        key: "rebellion",
        name: "Rule-Breaking & Independence",
        color: "#7C3AED", // Violet
        summary: "How willing you are to question authority, bend unfair rules, and go your own way.",
      },
      {
        key: "empathy_growth",
        name: "Kindness & Personal Growth",
        color: "#E11D48", // Rose
        summary: "How deeply you care about others' feelings, admit when you are wrong, and try to grow.",
      },
    ];

    interface InternalCharacterDef extends Omit<CharacterMatchProfile, "similarity"> {
      howYouMatch: string;
      watchOut: string;
    }

    const CHARACTER_ROSTER: InternalCharacterDef[] = [
      {
        id: "harry_potter",
        name: "Harry Potter",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The brave protector who runs toward trouble to save the people they love.",
        summary: "You lead with gut instinct, fierce loyalty, and real courage when it counts.",
        howYouMatch:
          "Just like Harry, you do not sit back when someone is being treated unfairly. You trust your instincts in fast moments, put your friends first, and push back against rules that get in the way of doing what is right.",
        watchOut:
          "Because you act fast and feel things deeply, you can sometimes rush into trouble without a full plan or carry too much weight on your own shoulders.",
        traits: { bravery: 95, wisdom: 58, ambition: 52, loyalty: 92, rebellion: 82, empathy_growth: 84 },
      },
      {
        id: "hermione_granger",
        name: "Hermione Granger",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The sharp planner who backs up big loyalty with preparation and logic.",
        summary: "You solve hard problems by reading, preparing, and refusing to give up.",
        howYouMatch:
          "Like Hermione, you like having the facts before you act. You respect rules when they make sense, work harder than almost anyone in the room, and use your brain to protect the people you care about.",
        watchOut:
          "You can sometimes stress too much over getting everything right, or get frustrated when other people wing it instead of preparing.",
        traits: { bravery: 82, wisdom: 98, ambition: 72, loyalty: 88, rebellion: 48, empathy_growth: 78 },
      },
      {
        id: "ron_weasley",
        name: "Ron Weasley",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The steady, ride-or-die friend who shows up even when they feel unsure.",
        summary: "You value real friendship, humor, and sticking together through thick and thin.",
        howYouMatch:
          "Just like Ron, you are the person friends can count on when life gets messy. You do not need to be the smartest or most polished person in the room—your warmth, humor, and loyalty hold the group together.",
        watchOut:
          "You can sometimes doubt yourself or compare yourself to louder people, even though your steady presence is what others rely on most.",
        traits: { bravery: 80, wisdom: 52, ambition: 48, loyalty: 95, rebellion: 62, empathy_growth: 76 },
      },
      {
        id: "albus_dumbledore",
        name: "Albus Dumbledore",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The calm big-picture thinker who sees several moves ahead and believes in second chances.",
        summary: "You blend deep wisdom, quiet warmth, and long-term planning.",
        howYouMatch:
          "Like Dumbledore, you look past surface drama to see the bigger pattern. People come to you for advice because you stay calm, think deeply, and believe that people can learn from their mistakes.",
        watchOut:
          "Because you carry big plans in your head, you can sometimes keep too many secrets or seem distant to the people trying to help you.",
        traits: { bravery: 84, wisdom: 98, ambition: 68, loyalty: 74, rebellion: 60, empathy_growth: 90 },
      },
      {
        id: "severus_snape",
        name: "Severus Snape",
        house: "Slytherin",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The guarded strategist who keeps deep loyalty hidden behind a tough shell.",
        summary: "You are sharp, disciplined, and willing to do hard things without asking for applause.",
        howYouMatch:
          "Like Snape, you do not wear your heart on your sleeve. You rely on sharp observation, keep your promises long after others forget, and handle high-pressure situations with a cool, controlled face.",
        watchOut:
          "Holding onto old grudges or keeping your feelings locked away can make you seem harsher than you really are and push away people who mean well.",
        traits: { bravery: 85, wisdom: 88, ambition: 74, loyalty: 86, rebellion: 42, empathy_growth: 32 },
      },
      {
        id: "draco_malfoy",
        name: "Draco Malfoy",
        house: "Slytherin",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The status-driven competitor who cares deeply about pride, image, and winning.",
        summary: "You are ambitious, sharp-tongued, and very aware of where you stand in any room.",
        howYouMatch:
          "Like canon Draco Malfoy, you care a lot about status, family expectations, and coming out on top. You prefer clever leverage and social position over reckless risk, and you protect your own comfort and pride.",
        watchOut:
          "Focusing too much on status or what other people think can trap you into choices you do not actually want to make.",
        traits: { bravery: 32, wisdom: 56, ambition: 90, loyalty: 54, rebellion: 36, empathy_growth: 34 },
      },
      {
        id: "malfoid",
        name: "Malfoid",
        house: "Slytherin",
        isCanon: false,
        originLabel: "Non-Canon",
        tagline: "The sharp, self-aware Slytherin who pairs high ambition with real empathy and growth.",
        summary: "You are driven and strategic like a Slytherin, yet emotionally honest enough to outgrow old pride.",
        howYouMatch:
          "You matched with Malfoid—the non-canon female version of Draco Malfoy (while every other character in this quiz is from the original Harry Potter books). Like Malfoid, you have all the ambition, sharp wit, and high standards of a Slytherin, but you pair them with much stronger wisdom, quiet courage, and genuine care for other people. You think for yourself instead of blindly copying what others expect.",
        watchOut:
          "Balancing your high standards with self-kindness is key—do not let perfectionism or pride stop you from letting trusted people in.",
        traits: { bravery: 68, wisdom: 86, ambition: 88, loyalty: 72, rebellion: 64, empathy_growth: 84 },
      },
      {
        id: "luna_lovegood",
        name: "Luna Lovegood",
        house: "Ravenclaw",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The gentle, original thinker who never pretends to be anyone else.",
        summary: "You are open-minded, deeply kind, and completely comfortable standing apart from the crowd.",
        howYouMatch:
          "Like Luna, you notice things other people miss and you do not chase popularity or status. You speak the truth calmly, stay loyal to your friends, and treat even awkward or misunderstood people with real kindness.",
        watchOut:
          "Because you march to your own beat, practical people may sometimes underestimate you—remember to ground your best ideas so others can follow them.",
        traits: { bravery: 72, wisdom: 78, ambition: 22, loyalty: 86, rebellion: 88, empathy_growth: 94 },
      },
      {
        id: "neville_longbottom",
        name: "Neville Longbottom",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The quiet, kindhearted fighter who grows stronger every time it matters.",
        summary: "You are humble, loyal, and braver than you give yourself credit for.",
        howYouMatch:
          "Just like Neville, you do not brag or chase the spotlight. You care deeply about doing right by your friends, grow steadily through hard moments, and find real courage whenever someone you love is in danger.",
        watchOut:
          "You may underestimate your own strength at first—trust that your quiet steadiness is a rare kind of power.",
        traits: { bravery: 88, wisdom: 54, ambition: 34, loyalty: 94, rebellion: 38, empathy_growth: 90 },
      },
      {
        id: "sirius_black",
        name: "Sirius Black",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The fearless rebel who values freedom and loyalty above any rulebook.",
        summary: "You are bold, independent, and fiercely protective of the people you choose as family.",
        howYouMatch:
          "Like Sirius, you hate feeling boxed in by unfair rules or stuffy traditions. You bring high energy, total honesty, and fearless loyalty to the people you love, and you are never afraid to break away from the crowd.",
        watchOut:
          "Your love of action and dislike of limits can sometimes make you impatient or overly reckless when a slower plan would work better.",
        traits: { bravery: 92, wisdom: 60, ambition: 46, loyalty: 90, rebellion: 96, empathy_growth: 62 },
      },
      {
        id: "ginny_weasley",
        name: "Ginny Weasley",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The bold, competitive all-rounder who speaks her mind and never backs down.",
        summary: "You combine fierce courage, sharp wit, and real drive to win.",
        howYouMatch:
          "Like Ginny, you are confident, quick on your feet, and not easily intimidated by anyone. You stand up for your friends, enjoy friendly competition, and bounce back fast from tough moments.",
        watchOut:
          "Your fiery independence is a strength, though slowing down to listen before firing back can help keep small disagreements from escalating.",
        traits: { bravery: 90, wisdom: 68, ambition: 76, loyalty: 84, rebellion: 78, empathy_growth: 74 },
      },
      {
        id: "remus_lupin",
        name: "Remus Lupin",
        house: "Gryffindor",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The thoughtful, empathetic mentor who brings calm and kindness to tense rooms.",
        summary: "You are wise, patient, and deeply understanding of what other people are going through.",
        howYouMatch:
          "Just like Lupin, you listen carefully, teach by example, and treat people with patience even when life has been hard on you. You value wisdom, quiet loyalty, and kindness far more than fame or power.",
        watchOut:
          "You can sometimes be too hard on yourself or pull back when you are worried about being a burden—let your friends show up for you too.",
        traits: { bravery: 76, wisdom: 88, ambition: 32, loyalty: 88, rebellion: 44, empathy_growth: 96 },
      },
      {
        id: "cedric_diggory",
        name: "Cedric Diggory",
        house: "Hufflepuff",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The fair-minded, hardworking leader who wins the right way.",
        summary: "You pair strong drive and courage with honesty, fairness, and respect for others.",
        howYouMatch:
          "Like Cedric, you work hard for your goals without stepping on other people to get ahead. You respect fair play, stay loyal to your team, and show real grace whether you win or lose.",
        watchOut:
          "Because you always try to play fair and follow the rules, watch out for people who may not play by the same honest standards.",
        traits: { bravery: 82, wisdom: 74, ambition: 66, loyalty: 92, rebellion: 22, empathy_growth: 88 },
      },
      {
        id: "bellatrix_lestrange",
        name: "Bellatrix Lestrange",
        house: "Slytherin",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The intense, fearless zealot who goes all-in with zero hesitation.",
        summary: "You have extreme nerve, fierce devotion to your cause, and zero interest in playing it safe.",
        howYouMatch:
          "Like Bellatrix, you do nothing halfway. You have high nerve, strong ambition, and intense loyalty to your chosen side, and you are completely unbothered by breaking social rules.",
        watchOut:
          "When intensity and pride are not balanced by empathy, it becomes easy to steamroll others or get swept up in extremes.",
        traits: { bravery: 86, wisdom: 48, ambition: 88, loyalty: 84, rebellion: 76, empathy_growth: 8 },
      },
      {
        id: "tom_riddle",
        name: "Tom Riddle (Lord Voldemort)",
        house: "Slytherin",
        isCanon: true,
        originLabel: "Book Canon",
        tagline: "The hyper-ambitious lone strategist focused purely on power, control, and winning.",
        summary: "You rely on sharp intellect, total self-reliance, and relentless drive.",
        howYouMatch:
          "Like Tom Riddle, your answers lean heavily toward extreme ambition, strategic thinking, and total independence—preferring to rely on your own cleverness rather than trusting others or following anyone else's rules.",
        watchOut:
          "Pushing everyone away and treating relationships purely as tools leaves you isolated—real strength grows when you let trust and empathy in.",
        traits: { bravery: 62, wisdom: 92, ambition: 99, loyalty: 10, rebellion: 84, empathy_growth: 5 },
      },
    ];

    // Calculate 6 trait scores combining likert_5 and single_choice traitWeights
    const userScores: Record<string, number> = {};
    const traits: TraitScoreDefinition[] = HP_TRAITS_CONFIG.map((cfg) => {
      let weightedSum = 0;
      let totalWeight = 0;

      for (const step of schema.steps) {
        for (const q of step.questions) {
          const ans = answers[q.id];
          if (ans === undefined || ans === null || ans === "") continue;

          if (q.type === "likert_5" || (!q.type && q.traitKey)) {
            if (q.traitKey === cfg.key) {
              let val = Number(ans);
              if (!isNaN(val) && val >= 1 && val <= 5) {
                if (q.isReverse) val = 6 - val;
                const normalized = ((val - 1) / 4) * 100;
                const w = q.weight ?? 1;
                weightedSum += normalized * w;
                totalWeight += w;
              }
            }
          } else if (q.type === "single_choice" && Array.isArray(q.options)) {
            const chosen = q.options.find((opt) => opt.id === String(ans));
            const rawWeight = chosen?.traitWeights?.[cfg.key];
            if (typeof rawWeight === "number" && !isNaN(rawWeight)) {
              // Map traitWeight in [-2, +2] to [0, 100]
              const normalized = Math.max(0, Math.min(100, ((rawWeight + 2) / 4) * 100));
              const w = q.weight ?? 1;
              weightedSum += normalized * w;
              totalWeight += w;
            }
          }
        }
      }

      const score = totalWeight > 0 ? Math.max(0, Math.min(100, Math.round(weightedSum / totalWeight))) : 50;
      userScores[cfg.key] = score;

      return {
        key: cfg.key,
        name: cfg.name,
        score,
        level: getLevel(score),
        color: cfg.color,
        summary: cfg.summary,
      };
    });

    // Compute normalized Euclidean similarity against all 15 characters
    const maxDistance = 100 * Math.sqrt(HP_TRAITS_CONFIG.length);
    const ranked = CHARACTER_ROSTER.map((char) => {
      let sqSum = 0;
      for (const cfg of HP_TRAITS_CONFIG) {
        const diff = (userScores[cfg.key] ?? 50) - (char.traits[cfg.key] ?? 50);
        sqSum += diff * diff;
      }
      const dist = Math.sqrt(sqSum);
      const similarity = Math.max(0, Math.min(100, Math.round((1 - dist / maxDistance) * 100)));
      return { char, dist, similarity };
    }).sort((a, b) => a.dist - b.dist);

    const best = ranked[0];
    const topMatches: CharacterMatchProfile[] = ranked.slice(0, 3).map(({ char, similarity }) => ({
      id: char.id,
      name: char.name,
      house: char.house,
      isCanon: char.isCanon,
      originLabel: char.originLabel,
      similarity,
      tagline: char.tagline,
      summary: char.summary,
      traits: char.traits,
    }));

    const topMatch = topMatches[0];
    const runnerUp1 = topMatches[1];
    const runnerUp2 = topMatches[2];

    // Find the 2 closest matching traits between user and topMatch
    const closestTraits = [...HP_TRAITS_CONFIG]
      .map((cfg) => ({
        name: cfg.name,
        userScore: userScores[cfg.key] ?? 50,
        charScore: best.char.traits[cfg.key] ?? 50,
        diff: Math.abs((userScores[cfg.key] ?? 50) - (best.char.traits[cfg.key] ?? 50)),
      }))
      .sort((a, b) => a.diff - b.diff);

    const strongestUserTrait = [...traits].sort((a, b) => b.score - a.score)[0];

    const canonNote = best.char.isCanon
      ? `They are one of the 14 original book-canon characters in this quiz (only Malfoid is from the non-canon version).`
      : `Malfoid is the one non-canon character in this quiz—a female version of Draco Malfoy who keeps Slytherin ambition and wit while adding sharper wisdom, empathy, and real growth. Every other character in this quiz comes from the original Harry Potter books.`;

    const detailedAnalysis = `Your closest Harry Potter match is ${best.char.name} (${best.similarity}% match • ${best.char.house} • ${best.char.originLabel}). ${canonNote}

${best.char.howYouMatch} Your strongest trait overall is ${strongestUserTrait.name} (${strongestUserTrait.score}%), and your scores lined up most closely with ${best.char.name} on ${closestTraits[0].name} (you: ${closestTraits[0].userScore}% vs. ${best.char.name}: ${closestTraits[0].charScore}%) and ${closestTraits[1].name} (you: ${closestTraits[1].userScore}% vs. ${best.char.name}: ${closestTraits[1].charScore}%).

${best.char.watchOut} Your next closest matches were ${runnerUp1.name} (${runnerUp1.similarity}% match, ${runnerUp1.house}) and ${runnerUp2.name} (${runnerUp2.similarity}% match, ${runnerUp2.house}).`;

    return {
      testType,
      archetypeTitle: best.char.name,
      archetypeSubtitle: `${best.char.house} • ${best.char.originLabel} — ${best.char.tagline}`,
      primaryMetricLabel: "Character Match",
      primaryMetricValue: `${best.similarity}%`,
      traits,
      detailedAnalysis,
      characterMatch: {
        topMatch,
        topMatches,
        characterTraits: best.char.traits,
      },
    };
  }

  return null;
}
