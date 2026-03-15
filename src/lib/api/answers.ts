import { apiFetch } from "./client";

/**
 * Submit an answer for a question.
 * Returns the created answer id on 201.
 * Throws ApiError — callers must handle 409 (already answered / not in couple)
 * and 404 (question not found) explicitly.
 */
export async function submitAnswer(
  questionId: string,
  text: string,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/v1/answers", {
    method: "POST",
    body: JSON.stringify({ questionId, text }),
  });
}
