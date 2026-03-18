import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "@/app/(auth)/page";
import type { CoupleDto } from "@/lib/api/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/api/couples", () => ({
  getMyCouple: vi.fn(),
  createInvite: vi.fn(),
  leaveCouple: vi.fn(),
}));

vi.mock("@/lib/auth/devIdentity", () => ({
  getDevIdentity: vi.fn().mockReturnValue("dev"),
  hasDevIdentity: vi.fn().mockReturnValue(true),
  setDevIdentity: vi.fn(),
  DEV_IDENTITIES: ["dev", "alice", "bob"],
}));

import { getMyCouple } from "@/lib/api/couples";

const activeCouple: CoupleDto = {
  id: "couple-1",
  initiatorId: "user-alice",
  partnerId: "user-bob",
  inviteCode: "ABCD1234",
  status: "Active",
  notificationTime: "08:00",
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the birdie69 heading", () => {
    vi.mocked(getMyCouple).mockReturnValue(new Promise(() => {}));
    render(<HomePage />);
    expect(screen.getByText("birdie69")).toBeInTheDocument();
  });

  it("shows loading spinner on mount", () => {
    vi.mocked(getMyCouple).mockReturnValue(new Promise(() => {}));
    render(<HomePage />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("shows 'Connect with your partner' when not in a couple", async () => {
    vi.mocked(getMyCouple).mockResolvedValue(null);
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/connect with your partner/i)).toBeInTheDocument();
    });
  });

  it("shows the Today's Question button when in an active couple", async () => {
    vi.mocked(getMyCouple).mockResolvedValue(activeCouple);
    render(<HomePage />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /today.*question/i }),
      ).toBeInTheDocument();
    });
  });
});
