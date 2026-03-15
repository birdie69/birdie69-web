import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "@/app/page";
import type { CoupleDto } from "@/lib/api/types";

const mockUseIsAuthenticated = vi.fn<[], boolean>().mockReturnValue(false);

vi.mock("@azure/msal-react", () => ({
  useIsAuthenticated: () => mockUseIsAuthenticated(),
  useMsal: () => ({ instance: { loginRedirect: vi.fn() }, inProgress: "none" }),
  MsalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/api/couples", () => ({
  getMyCouple: vi.fn().mockResolvedValue(null),
  createInvite: vi.fn(),
  leaveCouple: vi.fn(),
}));

vi.mock("@/lib/api/users", () => ({
  getMe: vi.fn().mockResolvedValue({ id: "user-1", displayName: "Test", avatarUrl: null }),
  upsertMe: vi.fn(),
}));

import { getMyCouple } from "@/lib/api/couples";
import { getMe } from "@/lib/api/users";

const activeCouple: CoupleDto = {
  id: "couple-1",
  initiatorId: "user-alice",
  partnerId: "user-bob",
  inviteCode: "ABCD1234",
  status: "Active",
  notificationTime: "08:00",
};

describe("HomePage (unauthenticated)", () => {
  beforeEach(() => {
    mockUseIsAuthenticated.mockReturnValue(false);
    vi.mocked(getMyCouple).mockResolvedValue(null);
    vi.mocked(getMe).mockResolvedValue({ id: "user-1", displayName: "Test", avatarUrl: null });
  });

  it("renders the birdie69 heading", () => {
    render(<HomePage />);
    expect(screen.getByText("birdie69")).toBeInTheDocument();
  });

  it("shows a sign-in prompt when not authenticated", () => {
    render(<HomePage />);
    expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
  });
});

describe("HomePage (active couple)", () => {
  beforeEach(() => {
    mockUseIsAuthenticated.mockReturnValue(true);
    vi.mocked(getMe).mockResolvedValue({ id: "user-1", displayName: "Test", avatarUrl: null });
    vi.mocked(getMyCouple).mockResolvedValue(activeCouple);
  });

  it("shows the Today's Question button when in an active couple", async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /today.*question/i }),
      ).toBeInTheDocument();
    });
  });
});
