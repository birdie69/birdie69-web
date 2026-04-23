import { apiFetch } from "./client";

/**
 * Update the daily notification time for the caller's couple.
 * @param time - Time in "HH:mm" format, e.g. "08:00"
 */
export async function setNotificationTime(
  time: string,
): Promise<{ notificationTime: string }> {
  return apiFetch<{ notificationTime: string }>(
    "/v1/couples/me/notification-time",
    {
      method: "PUT",
      body: JSON.stringify({ notificationTime: time }),
    },
  );
}
