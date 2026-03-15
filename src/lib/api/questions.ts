import { apiFetch, ApiError } from "./client";
import type { QuestionDto, AnswerRevealDto } from "./types";

/**
 * Fetch today's question for the current user's couple.
 * Returns null on 404 (no question scheduled today).
 * Throws ApiError(403) when the user is not in an active couple —
 * callers should catch this to show a "connect first" prompt.
 * Throws ApiError for all other error statuses (e.g. 503 Strapi unavailable).
 */
export async function getTodayQuestion(): Promise<QuestionDto | null> {
  try {
    return await apiFetch<QuestionDto>("/v1/questions/today");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Fetch the reveal state for a given question — own answer + partner's answer.
 * Throws ApiError on failure.
 */
export async function getAnswers(questionId: string): Promise<AnswerRevealDto> {
  return apiFetch<AnswerRevealDto>(`/v1/answers/${questionId}`);
}
