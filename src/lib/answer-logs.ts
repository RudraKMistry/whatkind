import type { SurveySchemaDefinition } from "@/types/survey";

export interface DetailedAnswerLogItem {
  stepId: string;
  stepTitle: string;
  questionId: string;
  questionTitle: string;
  questionType: string;
  traitKey?: string;
  isReverse?: boolean;
  selectedValue: unknown;
  selectedLabel: string;
  isCorrect?: boolean;
}

const LIKERT_5_LABELS: Record<number, string> = {
  1: "Strongly Disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly Agree",
};

/**
 * Builds a complete, human-readable question-by-question log from the
 * authoritative campaign schema and the respondent's submitted answers.
 */
export function buildDetailedAnswerLogs(
  schema: SurveySchemaDefinition | null | undefined,
  answers: Record<string, unknown>
): DetailedAnswerLogItem[] {
  const logs: DetailedAnswerLogItem[] = [];
  if (!schema || !Array.isArray(schema.steps)) {
    return logs;
  }

  for (const step of schema.steps) {
    for (const q of step.questions || []) {
      const val = answers[q.id];
      let selectedLabel = "No answer";
      let isCorrect: boolean | undefined = undefined;

      if (val !== undefined && val !== null && val !== "") {
        if (q.type === "likert_5") {
          const num = Number(val);
          if (!Number.isNaN(num)) {
            const label =
              num === 1 && q.minScaleLabel
                ? q.minScaleLabel
                : num === 5 && q.maxScaleLabel
                  ? q.maxScaleLabel
                  : LIKERT_5_LABELS[num] || "Selected";
            selectedLabel = `${num}/5 — ${label}`;
          } else {
            selectedLabel = String(val);
          }
        } else if (q.type === "likert_7") {
          selectedLabel = `${val}/7`;
        } else if (q.type === "rating_scale") {
          selectedLabel = `${val}/10`;
        } else if (q.type === "multi_choice" && Array.isArray(val)) {
          const labels = val.map((id) => {
            const opt = q.options?.find((o) => o.id === String(id));
            return opt ? opt.label : String(id);
          });
          selectedLabel = labels.join(", ");
        } else if (
          (q.type === "single_choice" ||
            q.type === "cognitive_puzzle" ||
            q.type === "demographic_select") &&
          Array.isArray(q.options)
        ) {
          const opt = q.options.find((o) => o.id === String(val));
          if (opt) {
            selectedLabel = opt.symbol ? `${opt.symbol} ${opt.label}` : opt.label;
          } else {
            selectedLabel = String(val);
          }
          if (q.correctOptionId) {
            isCorrect = String(val) === String(q.correctOptionId);
          }
        } else {
          selectedLabel = String(val);
        }
      }

      logs.push({
        stepId: step.id,
        stepTitle: step.title,
        questionId: q.id,
        questionTitle: q.title,
        questionType: q.type,
        traitKey: q.traitKey,
        isReverse: q.isReverse,
        selectedValue: val ?? null,
        selectedLabel,
        ...(isCorrect !== undefined ? { isCorrect } : {}),
      });
    }
  }

  return logs;
}
