export type QuestionType =
  | "text"
  | "textarea"
  | "single_choice"
  | "multi_choice"
  | "rating_scale"
  | "demographic_select"
  | "likert_5"
  | "likert_7"
  | "cognitive_puzzle";

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  symbol?: string;
  traitWeights?: Record<string, number>;
}

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  placeholder?: string;
  options?: QuestionOption[];
  minScale?: number;
  maxScale?: number;
  minScaleLabel?: string;
  maxScaleLabel?: string;
  // Psychometric & Cognitive Scoring attributes
  traitKey?: string;
  weight?: number;
  isReverse?: boolean;
  correctOptionId?: string;
  puzzleClue?: string;
}

export interface SurveyStep {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
}

export type TestCategory =
  | "personality"
  | "cognitive"
  | "ethics"
  | "behavioral"
  | "character"
  | "general";

export interface TraitScoreDefinition {
  key: string;
  name: string;
  score: number; // 0 to 100
  level: "Very Low" | "Low" | "Average" | "High" | "Very High";
  color: string;
  summary: string;
}

export interface CharacterMatchProfile {
  id: string;
  name: string;
  house: "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";
  isCanon: boolean;
  originLabel: string;
  similarity: number;
  tagline: string;
  summary: string;
  traits: Record<string, number>;
}

export interface CharacterMatchResult {
  topMatch: CharacterMatchProfile;
  topMatches: CharacterMatchProfile[];
  characterTraits: Record<string, number>;
}

export interface PsychometricResult {
  testType: string;
  archetypeTitle: string;
  archetypeSubtitle: string;
  primaryMetricLabel?: string;
  primaryMetricValue?: string | number;
  traits: TraitScoreDefinition[];
  detailedAnalysis: string;
  demographicSummary?: Record<string, string>;
  // Calibrated Cognitive IQ Metrics
  iqScore?: number;
  sem?: number;
  confidenceInterval?: string;
  percentile?: number;
  classification?: string;
  // Harry Potter Character Match Result
  characterMatch?: CharacterMatchResult;
}

export interface SurveySchemaDefinition {
  version: string;
  title: string;
  description: string;
  category?: TestCategory;
  testType?: "big_five" | "cognitive_iq" | "moral_alignment" | "dark_triad" | "harry_potter" | "standard_survey";
  estimatedMinutes?: number;
  steps: SurveyStep[];
}

export interface ConsentSubmission {
  agreed: boolean;
  tcVersion: string;
  tcChecksum: string;
  timestamp: string;
}

export interface SurveySubmissionPayload {
  campaignSlug: string;
  answers: Record<string, any>;
  completionSec: number;
  consent: ConsentSubmission;
  psychometrics?: PsychometricResult;
}
