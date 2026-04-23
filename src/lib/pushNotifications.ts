import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

/**
 * Request push notification permission and register the device for FCM.
 * No-op on web (non-native platforms) — only runs inside a Capacitor iOS/Android app.
 * @param onToken - Called with the FCM device token once registration succeeds.
 */
export async function registerForPushNotifications(
  onToken: (token: string) => Promise<void>,
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== "granted") return;

  await PushNotifications.register();

  PushNotifications.addListener("registration", async ({ value }) => {
    console.log("[Push] FCM token:", value);
    await onToken(value);
  });
}
