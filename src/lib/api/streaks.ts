import { apiFetch } from "./client";
import type { StreakDto } from "./types";

/**
 * Fetch the current user's streak data.
 * Throws ApiError on failure — callers should handle silently if streak
 * data is non-critical (e.g. on the question page).
 */
export async function getMyStreak(): Promise<StreakDto> {
  return apiFetch<StreakDto>("/v1/streaks/me");
}
