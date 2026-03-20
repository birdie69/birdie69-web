import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: vi.fn().mockReturnValue(false),
  },
}));

vi.mock("@capacitor/push-notifications", () => ({
  PushNotifications: {
    requestPermissions: vi.fn(),
    register: vi.fn(),
    addListener: vi.fn(),
  },
}));

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { registerForPushNotifications } from "@/lib/pushNotifications";

describe("registerForPushNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns early without doing anything when not on a native platform", async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

    const onToken = vi.fn();
    await registerForPushNotifications(onToken);

    expect(PushNotifications.requestPermissions).not.toHaveBeenCalled();
    expect(PushNotifications.register).not.toHaveBeenCalled();
    expect(onToken).not.toHaveBeenCalled();
  });

  it("requests permission and registers when on a native platform with granted permission", async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    vi.mocked(PushNotifications.requestPermissions).mockResolvedValue({
      receive: "granted",
    });
    vi.mocked(PushNotifications.register).mockResolvedValue(undefined);
    vi.mocked(PushNotifications.addListener).mockResolvedValue({} as never);

    const onToken = vi.fn();
    await registerForPushNotifications(onToken);

    expect(PushNotifications.requestPermissions).toHaveBeenCalled();
    expect(PushNotifications.register).toHaveBeenCalled();
    expect(PushNotifications.addListener).toHaveBeenCalledWith(
      "registration",
      expect.any(Function),
    );
  });

  it("does not register when permission is denied", async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    vi.mocked(PushNotifications.requestPermissions).mockResolvedValue({
      receive: "denied",
    });

    const onToken = vi.fn();
    await registerForPushNotifications(onToken);

    expect(PushNotifications.register).not.toHaveBeenCalled();
    expect(onToken).not.toHaveBeenCalled();
  });
});
