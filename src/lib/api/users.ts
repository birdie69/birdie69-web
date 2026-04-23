import { apiFetch, ApiError } from "./client";
import type { UserProfile } from "./types";

/**
 * Fetch the current user's profile.
 * Returns null if the user has not been provisioned yet (404).
 */
export async function getMe(): Promise<UserProfile | null> {
  try {
    return await apiFetch<UserProfile>("/v1/users/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Create or update the current user's profile.
 * Called on first sign-in (onboarding) and whenever the user edits their name.
 */
export async function upsertMe(
  displayName: string,
  avatarUrl?: string,
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/v1/users/me", {
    method: "PUT",
    body: JSON.stringify({ displayName, avatarUrl }),
  });
}

/**
 * Register or update the FCM device token for the current user.
 * Called after successful push notification registration on native platforms.
 */
export async function setNotificationToken(token: string): Promise<void> {
  return apiFetch<void>("/v1/users/me/notification-token", {
    method: "PUT",
    body: JSON.stringify({ token }),
  });
}
