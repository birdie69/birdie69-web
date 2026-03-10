import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "@/app/page";

/**
 * Mock MSAL hooks so the test doesn't need a real PublicClientApplication.
 * useIsAuthenticated returns false by default → unauthenticated branch is rendered.
 */
vi.mock("@azure/msal-react", () => ({
  useIsAuthenticated: () => false,
  useMsal: () => ({ instance: { loginRedirect: vi.fn() }, inProgress: "none" }),
  MsalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe("HomePage", () => {
  it("renders the Today's Question heading", () => {
    render(<HomePage />);
    expect(screen.getByText("Today's Question")).toBeInTheDocument();
  });

  it("shows a sign-in prompt when not authenticated", () => {
    render(<HomePage />);
    expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument();
  });
});
