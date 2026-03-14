import { apiFetch, ApiError } from "./client";
import type { CoupleDto } from "./types";

/**
 * Create a new pending couple or regenerate the invite code for an existing one.
 * Returns the (new) invite code.
 */
export async function createInvite(): Promise<{ inviteCode: string }> {
  return apiFetch<{ inviteCode: string }>("/v1/couples", { method: "POST" });
}

/**
 * Get the current user's active or pending couple.
 * Returns null if the user is not in any couple (404).
 */
export async function getMyCouple(): Promise<CoupleDto | null> {
  try {
    return await apiFetch<CoupleDto>("/v1/couples/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Join a couple using an 8-character invite code.
 * Throws ApiError(404) if the code is invalid, ApiError(409) if already in a couple.
 */
export async function joinCouple(inviteCode: string): Promise<CoupleDto> {
  return apiFetch<CoupleDto>("/v1/couples/join", {
    method: "POST",
    body: JSON.stringify({ inviteCode }),
  });
}

/**
 * Leave the current couple (cancel pending invite or disband active couple).
 */
export async function leaveCouple(): Promise<void> {
  return apiFetch<void>("/v1/couples/me", { method: "DELETE" });
}
