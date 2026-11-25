import { z } from "zod";
import type { SurveyQuestion, SurveyStep, SurveySchemaDefinition } from "../types/survey";

export const ConsentSubmissionSchema = z.object({
  agreed: z.literal(true, {
    errorMap: () => ({ message: "Please check the box to agree to our rules and privacy notice before continuing." }),
  }),
  tcVersion: z.string().min(1, "The rules version number is missing."),
  tcChecksum: z.string().min(8, "The security check code for the rules is missing or invalid."),
  timestamp: z.string().datetime({ message: "The time format is not valid." }),
});

export const ProfileSubmissionSchema = z.object({
  profileToken: z.string().trim().min(8, "Your profile ID is missing."),
  fullName: z.string().trim().min(2, "Please enter your full name (at least 2 characters).").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  birthDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick your birth date."),
  gender: z.string().trim().min(1, "Please select your gender.").max(64),
  notes: z.string().trim().max(1000).optional().default(""),
});

export type ProfileSubmissionInput = z.infer<typeof ProfileSubmissionSchema>;

export const SurveySubmissionSchema = z.object({
  campaignSlug: z.string().min(1, "The survey link name is missing."),
  answers: z.record(z.any()),
  completionSec: z.number().int().min(0, "The time taken must be a whole number of seconds (0 or more)."),
  consent: ConsentSubmissionSchema,
  profile: ProfileSubmissionSchema,
  psychometrics: z.any().optional(),
});

export type SurveySubmissionInput = z.infer<typeof SurveySubmissionSchema>;

/**
 * Validates a single question answer against its schema definition.
 * Returns an error string or null if valid.
 */
export function validateQuestionAnswer(
  question: SurveyQuestion,
  answer: unknown
): string | null {
  const isProvided =
    answer !== undefined &&
    answer !== null &&
    answer !== "" &&
    (!Array.isArray(answer) || answer.length > 0);

  if (question.required && !isProvided) {
    return `Please answer "${question.title}" before moving on.`;
  }

  if (!isProvided) {
    return null; // Optional and empty
  }

  switch (question.type) {
    case "text":
    case "textarea":
    case "demographic_select":
      if (typeof answer !== "string" || answer.trim().length === 0) {
        return "Please type an answer here.";
      }
      break;

    case "single_choice":
      if (typeof answer !== "string" || !question.options?.some((opt) => opt.id === answer)) {
        return "Please pick one of the choices.";
      }
      break;

    case "multi_choice":
      if (!Array.isArray(answer) || answer.length === 0) {
        return "Please pick at least one choice.";
      }
      if (question.options) {
        const validIds = new Set(question.options.map((opt) => opt.id));
        const hasInvalid = answer.some((id) => !validIds.has(id));
        if (hasInvalid) {
          return "One of the choices you picked is not valid.";
        }
      }
      break;

    case "rating_scale":
      if (typeof answer !== "number" || isNaN(answer)) {
        return "Please pick a number rating.";
      }
      const min = question.minScale ?? 1;
      const max = question.maxScale ?? 10;
      if (answer < min || answer > max) {
        return `Please pick a number between ${min} and ${max}.`;
      }
      break;

    case "likert_5":
      if (typeof answer !== "number" || isNaN(answer) || answer < 1 || answer > 5) {
        return "Please pick how much you agree (from 1 to 5).";
      }
      break;

    case "likert_7":
      if (typeof answer !== "number" || isNaN(answer) || answer < 1 || answer > 7) {
        return "Please pick how much you agree (from 1 to 7).";
      }
      break;

    case "cognitive_puzzle":
      if (typeof answer !== "string" || !question.options?.some((opt) => opt.id === answer)) {
        return "Please pick one of the puzzle answers.";
      }
      break;
  }

  return null;
}

/**
 * Validates all questions within a survey step.
 * Returns an object with overall validity and per-question error messages.
 */
export function validateStepAnswers(
  step: SurveyStep,
  answers: Record<string, unknown>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const question of step.questions) {
    const error = validateQuestionAnswer(question, answers[question.id]);
    if (error) {
      errors[question.id] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates the entire survey schema answers prior to final submission.
 */
export function validateFullSurveyAnswers(
  schema: SurveySchemaDefinition,
  answers: Record<string, unknown>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const step of schema.steps) {
    for (const question of step.questions) {
      const error = validateQuestionAnswer(question, answers[question.id]);
      if (error) {
        errors[question.id] = error;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
