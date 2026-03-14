import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "@/app/page";

vi.mock("@azure/msal-react", () => ({
  useIsAuthenticated: () => false,
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

describe("HomePage (unauthenticated)", () => {
  it("renders the birdie69 heading", () => {
    render(<HomePage />);
    expect(screen.getByText("birdie69")).toBeInTheDocument();
  });

  it("shows a sign-in prompt when not authenticated", () => {
    render(<HomePage />);
    expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
  });
});
