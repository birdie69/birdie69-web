import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SettingsPage from "@/app/(auth)/settings/page";
import type { CoupleDto } from "@/lib/api/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/api/couples", () => ({
  getMyCouple: vi.fn(),
}));

vi.mock("@/lib/api/settings", () => ({
  setNotificationTime: vi.fn(),
}));

import { getMyCouple } from "@/lib/api/couples";
import { setNotificationTime } from "@/lib/api/settings";

const activeCouple: CoupleDto = {
  id: "couple-1",
  initiatorId: "user-alice",
  partnerId: "user-bob",
  inviteCode: "ABCD1234",
  status: "Active",
  notificationTime: "20:30",
};

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the time input with the couple's current notification time", async () => {
    vi.mocked(getMyCouple).mockResolvedValue(activeCouple);

    render(<SettingsPage />);

    await waitFor(() => {
      expect(document.querySelector('input[type="time"]')).not.toBeNull();
    });

    expect(
      (document.querySelector('input[type="time"]') as HTMLInputElement)?.value,
    ).toBe("20:30");
  });

  it("calls setNotificationTime with the selected value on save", async () => {
    vi.mocked(getMyCouple).mockResolvedValue(activeCouple);
    vi.mocked(setNotificationTime).mockResolvedValue({ notificationTime: "21:00" });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(document.querySelector('input[type="time"]')).not.toBeNull();
    });

    const input = document.querySelector('input[type="time"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: "21:00" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(vi.mocked(setNotificationTime)).toHaveBeenCalledWith("21:00");
    });
  });

  it("shows a success message after saving", async () => {
    vi.mocked(getMyCouple).mockResolvedValue(activeCouple);
    vi.mocked(setNotificationTime).mockResolvedValue({ notificationTime: "21:00" });

    render(<SettingsPage />);

    await waitFor(() => {
      expect(document.querySelector('input[type="time"]')).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/notification time saved/i)).toBeInTheDocument();
    });
  });

  it("shows an error message when saving fails", async () => {
    vi.mocked(getMyCouple).mockResolvedValue(activeCouple);
    vi.mocked(setNotificationTime).mockRejectedValue(new Error("Network error"));

    render(<SettingsPage />);

    await waitFor(() => {
      expect(document.querySelector('input[type="time"]')).not.toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });
});
